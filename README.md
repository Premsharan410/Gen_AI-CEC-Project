# GenMol AI — Deep Learning Molecular Generation & Virtual Screening

> **Computational Chemistry Research Prototype**  
> AI-powered molecular SMILES generation and virtual screening combining deep recurrent neural networks (PyTorch Character-level LSTM) with cheminformatics analysis (RDKit) and target docking (AutoDock Vina & Meeko against EGFR, PDB: 1M17).

---

## 1. Project Overview

GenMol AI is an academic research platform designed for exploring chemical space and generating candidate drug-like small molecules in silico. Heavy model inference is maintained in Google Colab (leveraging cloud GPUs/CPUs), while this React-based scientific web application provides a high-fidelity interface for real-time parameter tuning, structure inspection, property screening, and virtual screening analysis.

### System Architecture

```
[ React + Vite Client ]
       │
       │ POST /generate (JSON Payload: num_molecules, filters)
       ▼
[ Axios API Service ] (src/services/api.js)
       │
       │ Public Tunnel (ngrok / cloudflared / Localtunnel)
       ▼
[ Google Colab Runtime ] (FastAPI Endpoint)
       ├── PyTorch Character-level LSTM (SMILES Generator)
       ├── RDKit Sanitization & Descriptor Engine (MW, logP, QED, TPSA, Lipinski)
       └── Downstream AutoDock Vina & Meeko (EGFR 1M17 Screening)
```

---

## 2. Technology Stack

- **Frontend Core:** React 18, Vite 6, JavaScript (ES6+ / JSX)
- **Styling & Design System:** Tailwind CSS (Scientific dark palette with slate, cyan, and teal accents)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Network / API:** Axios
- **Data Visualizations:** Recharts (QED property distributions & MW-logP chemical space scatter plots)
- **Machine Learning & Cheminformatics Pipeline (Google Colab):** PyTorch LSTM, RDKit, AutoDock Vina, Meeko

---

## 3. Getting Started

### Prerequisites

- Node.js (v18 or higher recommended; verified on Node v22.14.0)
- npm (v9 or higher)

### Installation

```bash
# Clone or navigate to the project directory
cd genMOL_ai

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

To create an optimized production build:

```bash
npm run build
npm run preview
```

---

## 4. Colab Integration Guide (Phase 2 Preparation)

The frontend is fully prepared for zero-configuration integration with your Google Colab notebook.

### Colab API Contract

#### A. Health Check Endpoint
- **Method:** `GET`
- **Path:** `/health`
- **Response Format:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "message": "GenMol AI is ready"
}
```

#### B. Generation Endpoint
- **Method:** `POST`
- **Path:** `/generate`
- **Request Payload:**
```json
{
  "num_molecules": 10,
  "enable_filters": true,
  "filters": {
    "min_molecular_weight": 150,
    "max_molecular_weight": 500,
    "min_logP": -1.0,
    "max_logP": 5.0,
    "min_qed": 0.3
  }
}
```
- **Response Format:**
```json
{
  "status": "success",
  "requested_count": 10,
  "generated_count": 14,
  "valid_count": 11,
  "returned_count": 10,
  "filter_passed_count": 9,
  "duration_seconds": 3.42,
  "molecules": [
    {
      "candidate_id": "GM-001",
      "smiles": "COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1",
      "canonical_smiles": "COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1",
      "valid": true,
      "molecular_weight": 446.90,
      "logP": 3.24,
      "qed": 0.68,
      "hbd": 1,
      "hba": 7,
      "tpsa": 68.74,
      "rotatable_bonds": 7,
      "filter_pass": true,
      "structure_image": null,
      "docking_score": null
    }
  ]
}
```

### Colab FastAPI Wrapper Snippet (For Phase 2)

When ready, add this cell at the end of your Google Colab notebook to expose your generation pipeline:

```python
# ==========================================
# Phase 2: FastAPI + pyngrok Colab Server
# ==========================================
!pip install -q fastapi uvicorn pyngrok pydantic

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import uvicorn
import threading

app = FastAPI(title="GenMol AI Backend")

# Enable CORS for deployed website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilterSettings(BaseModel):
    min_molecular_weight: float = 150.0
    max_molecular_weight: float = 500.0
    min_logP: float = -1.0
    max_logP: float = 5.0
    min_qed: float = 0.3

class GenerateRequest(BaseModel):
    num_molecules: int = 10
    enable_filters: bool = True
    filters: Optional[FilterSettings] = None

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": True,
        "message": "GenMol AI PyTorch LSTM model ready in Colab"
    }

@app.post("/generate")
def generate(req: GenerateRequest):
    # Calls your existing notebook generation functions:
    # molecules = generate_molecules_pipeline(req.num_molecules, req.enable_filters, req.filters)
    return {
        "status": "success",
        "requested_count": req.num_molecules,
        "molecules": [] # Return formatted candidate list
    }

# Start server in background thread & expose via ngrok:
# from pyngrok import ngrok
# public_url = ngrok.connect(8000).public_url
# print(f"Paste this URL into GenMol AI Studio: {public_url}")
# uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 5. Project Structure

```
genmol-ai/
├── public/
├── src/
│   ├── components/
│   │   ├── ColabConnectionModal.jsx     # Dynamic tunnel config & live GET /health tester
│   │   ├── DockingSection.jsx           # Reserved EGFR 1M17 virtual screening module
│   │   ├── EmptyState.jsx               # Comprehensive empty, disconnected, & error states
│   │   ├── Footer.jsx                   # Academic disclaimer, navigation, & stack summary
│   │   ├── GenerationForm.jsx           # Molecular count & physicochemical filter controls
│   │   ├── HeroMoleculeCanvas.jsx       # 3D interactive molecular lattice canvas for hero
│   │   ├── LoadingState.jsx             # Orbital loading indicator with authentic steps
│   │   ├── MoleculeCard.jsx             # Candidate card with 2D rendering, SMILES copy, & badges
│   │   ├── MoleculeDetailsModal.jsx     # Full scientific property & Lipinski breakdown modal
│   │   ├── MoleculeViewer2D.jsx         # 2D chemical structure viewer with SVG/RDKit support
│   │   ├── Navbar.jsx                   # Wordmark, nav links, & live status indicator
│   │   ├── PropertyDistributionChart.jsx# QED & MW-logP chemical space charts (Recharts)
│   │   └── StatusIndicator.jsx          # Demo, Connecting, Connected, Error state pills
│   ├── config/
│   │   └── appConfig.js                 # API endpoints, default filters, & limits
│   ├── data/
│   │   └── mockMolecules.js             # High-fidelity pre-computed LSTM demo candidates
│   ├── pages/
│   │   ├── Generate.jsx                 # Molecular Generation Studio page
│   │   └── Home.jsx                     # Presentation overview & methodology page
│   ├── services/
│   │   └── api.js                       # Centralized Axios service with schema validation
│   ├── App.jsx                          # Main routing & state coordinator
│   ├── index.css                        # Tailwind directives & scientific styling
│   └── main.jsx                         # React entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 6. Scientific Disclaimer

GenMol AI is a computational chemistry research prototype developed for university evaluation. All candidate structures, molecular weights, logP calculations, QED drug-likeness scores, and docking affinities are in silico estimates. Predictions do not guarantee biological efficacy or chemical synthesizability. Experimental synthesis and biological assays are required to confirm pharmacological activity.

