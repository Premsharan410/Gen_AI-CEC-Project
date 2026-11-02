"""
GenMol AI - Google Colab FastAPI Integration Script (Phase 2)
=============================================================
This script contains the complete FastAPI server, schema models, RDKit
descriptor calculation, 2D structure depiction, and public tunnel launcher.

These cells have already been appended to your notebook:
    C:\Users\prems\Downloads\GenMol_AI_Research_Lab.ipynb

CRITICAL: DO NOT RUN ON LOCAL LAPTOP (No GPU).
Run these cells inside Google Colab during your presentation.
"""

# =====================================================================
# CELL 1: Install Integration Dependencies in Colab
# =====================================================================
# !pip install -q fastapi uvicorn pydantic pyngrok nest-asyncio

# =====================================================================
# CELL 2: FastAPI Server, Validation & Generation Pipeline
# =====================================================================
import time
import os
import io
import base64
from typing import List, Optional
import torch
import torch.nn.functional as F
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rdkit import Chem
from rdkit.Chem import Descriptors, QED, Crippen, Lipinski, Draw

# 1. Initialize FastAPI application
app = FastAPI(
    title="GenMol AI Research Lab - Live Generation API",
    description="Temporary live molecular candidate generation API for GenMol AI frontend presentation.",
    version="1.0.0"
)

# 2. Configure CORS middleware (allows React frontend to call the Colab tunnel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any frontend URL during live presentation
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Pydantic request models matching frontend schema
class FilterCriteria(BaseModel):
    min_molecular_weight: Optional[float] = 150.0
    max_molecular_weight: Optional[float] = 500.0
    min_logP: Optional[float] = -1.0
    max_logP: Optional[float] = 5.0
    min_qed: Optional[float] = 0.3

class GenerateRequestPayload(BaseModel):
    num_molecules: int = Field(default=10, ge=1, le=100, description="Requested candidate count (1-100)")
    enable_filters: bool = Field(default=True, description="Enable physicochemical filters")
    filters: Optional[FilterCriteria] = None

# 4. Helper: 2D depiction generator returning base64 PNG
def render_molecule_base64(mol, size=(450, 350)) -> Optional[str]:
    """Renders RDKit 2D molecule depiction into a base64 PNG data string."""
    if mol is None:
        return None
    try:
        image = Draw.MolToImage(mol, size=size)
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")
    except Exception:
        return None

# 5. Helper: Retrieve active model
def get_model_instance():
    """Retrieves the trained model from notebook memory or loads checkpoint from disk."""
    global model
    if 'model' in globals() and model is not None:
        return model
    
    proj_dir = globals().get('PROJECT_DIR', "/content/genmol_ai")
    ckpt_path = os.path.join(proj_dir, "genmol_lstm_checkpoint.pt")
    if os.path.exists(ckpt_path):
        print(f"[API] Loading model from checkpoint: {ckpt_path}")
        device = globals().get('DEVICE', torch.device("cuda" if torch.cuda.is_available() else "cpu"))
        checkpoint = torch.load(ckpt_path, map_location=device)
        loaded = MolecularLSTM(
            vocab_size=len(checkpoint["vocabulary"]),
            embedding_dim=checkpoint["embedding_dim"],
            hidden_dim=checkpoint["hidden_dim"],
            num_layers=checkpoint["num_layers"],
            dropout=checkpoint["dropout"]
        ).to(device)
        loaded.load_state_dict(checkpoint["model_state_dict"])
        loaded.eval()
        model = loaded
        return model
    return None

# 6. GET /health endpoint
@app.get("/health")
async def health_check():
    active_model = get_model_instance()
    is_loaded = active_model is not None
    device_name = str(globals().get('DEVICE', "cuda" if torch.cuda.is_available() else "cpu"))
    
    return {
        "status": "ok",
        "model_loaded": is_loaded,
        "device": device_name,
        "message": f"GenMol AI PyTorch LSTM model ready on {device_name}" if is_loaded else "Model not loaded. Run notebook training cell or checkpoint cell."
    }

# 7. POST /generate endpoint
@app.post("/generate")
async def generate_molecules(payload: GenerateRequestPayload):
    start_time = time.time()
    
    # 1. Ensure model is loaded
    active_model = get_model_instance()
    if active_model is None:
        raise HTTPException(
            status_code=500,
            detail="Trained model is not loaded in Colab. Please run the model checkpoint cell first."
        )
    
    # 2. Validate input boundaries (1 to 100 molecules)
    if payload.num_molecules < 1 or payload.num_molecules > 100:
        raise HTTPException(
            status_code=400,
            detail="num_molecules must be an integer between 1 and 100."
        )
    
    # 3. Extract requested filter thresholds
    min_mw = 150.0
    max_mw = 500.0
    min_logp = -1.0
    max_logp = 5.0
    min_qed = 0.3
    
    if payload.enable_filters and payload.filters:
        if payload.filters.min_molecular_weight is not None:
            min_mw = float(payload.filters.min_molecular_weight)
        if payload.filters.max_molecular_weight is not None:
            max_mw = float(payload.filters.max_molecular_weight)
        if payload.filters.min_logP is not None:
            min_logp = float(payload.filters.min_logP)
        if payload.filters.max_logP is not None:
            max_logp = float(payload.filters.max_logP)
        if payload.filters.min_qed is not None:
            min_qed = float(payload.filters.min_qed)
    
    # 4. Bounded generation attempts to avoid hanging
    target_count = payload.num_molecules
    max_attempts = min(max(target_count * 6, 60), 400)
    
    generated_smiles_set = set()
    molecules = []
    generated_count = 0
    valid_count = 0
    filter_passed_count = 0
    
    for attempt in range(max_attempts):
        generated_count += 1
        raw_smiles = generate_smiles(active_model, temperature=0.8)
        if not raw_smiles:
            continue
        
        mol = Chem.MolFromSmiles(raw_smiles)
        if mol is None:
            continue
        
        canonical = Chem.MolToSmiles(mol, canonical=True)
        if not canonical or canonical in generated_smiles_set:
            continue
        
        generated_smiles_set.add(canonical)
        valid_count += 1
        
        # Calculate RDKit physicochemical descriptors
        mw = round(float(Descriptors.MolWt(mol)), 3)
        logp = round(float(Crippen.MolLogP(mol)), 3)
        qed_val = round(float(QED.qed(mol)), 3)
        hbd = int(Lipinski.NumHDonors(mol))
        hba = int(Lipinski.NumHAcceptors(mol))
        tpsa_val = round(float(Descriptors.TPSA(mol)), 2)
        rot_bonds = int(Lipinski.NumRotatableBonds(mol))
        
        # Apply requested and notebook's essential filters
        passes = True
        if not (min_mw <= mw <= max_mw):
            passes = False
        if not (min_logp <= logp <= max_logp):
            passes = False
        if qed_val < min_qed:
            passes = False
        if hbd > 5 or hba > 10:
            passes = False
        if tpsa_val > 140.0:
            passes = False
        if rot_bonds > 10:
            passes = False
        
        if passes:
            filter_passed_count += 1
        
        # If filtering is requested, skip molecules that fail the filters
        if payload.enable_filters and not passes:
            continue
        
        # Render 2D structure image
        img_base64 = render_molecule_base64(mol)
        candidate_id = f"GM-{len(molecules) + 1:03d}"
        
        molecules.append({
            "candidate_id": candidate_id,
            "smiles": raw_smiles,
            "canonical_smiles": canonical,
            "valid": True,
            "molecular_weight": mw,
            "logP": logp,
            "qed": qed_val,
            "h_bond_donors": hbd,
            "h_bond_acceptors": hba,
            "tpsa": tpsa_val,
            "rotatable_bonds": rot_bonds,
            "filter_pass": passes,
            "structure_image": img_base64,
            "docking_score": None
        })
        
        if len(molecules) >= target_count:
            break
    
    duration = round(time.time() - start_time, 2)
    
    return {
        "status": "success",
        "requested_count": target_count,
        "generated_count": generated_count,
        "valid_count": valid_count,
        "returned_count": len(molecules),
        "filter_passed_count": filter_passed_count,
        "duration_seconds": duration,
        "molecules": molecules
    }

print("FastAPI app created successfully. Endpoints ready: GET /health, POST /generate")


# =====================================================================
# CELL 3: Run Uvicorn in Background Thread & Establish Public Tunnel
# =====================================================================
import threading
import uvicorn
import nest_asyncio
from pyngrok import ngrok

nest_asyncio.apply()

# 1. Start Uvicorn on localhost:8000 in a background daemon thread
def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()
print("Uvicorn server running in background on port 8000.")

# 2. Establish public HTTPS tunnel
# Optional: Read ngrok token from Colab Secrets if configured
try:
    from google.colab import userdata
    ngrok_token = userdata.get('NGROK_AUTHTOKEN')
    if ngrok_token:
        ngrok.set_auth_token(ngrok_token)
except Exception:
    pass

try:
    ngrok.kill()  # Terminate any previously opened tunnels
    tunnel = ngrok.connect(8000)
    public_url = tunnel.public_url
    print("\n" + "="*65)
    print(" GENMOL AI FASTAPI IS LIVE!")
    print(f" Public URL: {public_url}")
    print(" Copy and paste this URL into your GenMol AI web interface")
    print(" (Click 'Configure Backend' or the runtime badge in top navigation).")
    print("="*65 + "\n")
except Exception as e:
    print(f"ngrok tunnel notice: {e}")
    print("\nIf you do not have an ngrok authtoken, you can run localtunnel instead:")
    print("!npx localtunnel --port 8000")

