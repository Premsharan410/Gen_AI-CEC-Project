/**
 * GenMol AI - API Communication Service
 * 
 * All network requests pass through this service. UI components do not call Axios directly.
 * Handles both:
 * 1. Demo Mode (clearly labelled high-fidelity scientific simulation with pre-computed LSTM data)
 * 2. Live Mode (Google Colab FastAPI tunnel via ngrok / cloudflared / reverse proxy)
 */

import axios from 'axios';
import { APP_CONFIG, getApiBaseUrl, getRuntimeMode } from '../config/appConfig';
import { filterMockMolecules } from '../data/mockMolecules';

/**
 * Create configured Axios client with base URL and timeout
 */
function createApiClient() {
  const baseURL = getApiBaseUrl();
  return axios.create({
    baseURL: baseURL || '/',
    timeout: APP_CONFIG.requestTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // ngrok-skip-browser-warning allows direct API calls to free ngrok tunnels
      'ngrok-skip-browser-warning': 'true',
    },
  });
}

/**
 * Perform a real health check against the configured Colab FastAPI backend.
 * Never fabricates a successful response in live mode.
 * 
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function checkConnection() {
  const mode = getRuntimeMode();
  const baseURL = getApiBaseUrl();

  if (mode === 'demo' || !baseURL) {
    return {
      ok: false,
      isDemo: true,
      message: 'Running in Demo Mode. Connect a Google Colab tunnel to switch to Live Mode.',
    };
  }

  try {
    const client = createApiClient();
    const response = await client.get(APP_CONFIG.endpoints.health);
    
    // Verify health schema
    if (response.status === 200 && response.data && response.data.status === 'ok') {
      return {
        ok: true,
        isDemo: false,
        modelLoaded: Boolean(response.data.model_loaded),
        message: response.data.message || 'Connected to GenMol AI Colab runtime',
        data: response.data,
      };
    } else {
      return {
        ok: false,
        isDemo: false,
        error: `Unexpected server response format: ${JSON.stringify(response.data)}`,
      };
    }
  } catch (err) {
    let errorMessage = 'Failed to connect to Google Colab runtime.';
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      errorMessage = 'Connection timed out. Colab instance may be loading the PyTorch model or waking up.';
    } else if (err.response) {
      errorMessage = `Server returned HTTP ${err.response.status}: ${err.response.statusText || 'Error'}`;
    } else if (err.request) {
      errorMessage = 'No response from Colab tunnel. Ensure ngrok/cloudflared tunnel is active and Colab notebook is running.';
    } else {
      errorMessage = err.message || 'Network error occurred.';
    }
    return {
      ok: false,
      isDemo: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate generation request payload before sending
 */
export function validateGenerationPayload(payload) {
  const errors = [];
  const num = Number(payload.num_molecules);
  if (isNaN(num) || num < APP_CONFIG.limits.min_molecules || num > APP_CONFIG.limits.max_molecules) {
    errors.push(`Number of molecules must be between ${APP_CONFIG.limits.min_molecules} and ${APP_CONFIG.limits.max_molecules}`);
  }

  if (payload.enable_filters && payload.filters) {
    const { min_molecular_weight, max_molecular_weight, min_logP, max_logP, min_qed } = payload.filters;
    if (min_molecular_weight < APP_CONFIG.limits.mw_floor || max_molecular_weight > APP_CONFIG.limits.mw_ceiling) {
      errors.push(`Molecular weight bounds must be within ${APP_CONFIG.limits.mw_floor} and ${APP_CONFIG.limits.mw_ceiling} g/mol`);
    }
    if (min_molecular_weight > max_molecular_weight) {
      errors.push('Minimum molecular weight cannot exceed maximum molecular weight');
    }
    if (min_logP > max_logP) {
      errors.push('Minimum logP cannot exceed maximum logP');
    }
    if (min_qed < 0 || min_qed > 1) {
      errors.push('Minimum QED must be between 0.0 and 1.0');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Request molecular generation from either Demo engine or Live Colab API
 * 
 * @param {Object} payload 
 * @param {Function} onProgressStep Optional callback for UI progress updates
 * @returns {Promise<Object>}
 */
export async function generateMolecules(payload, onProgressStep = () => {}) {
  // Validate input schema
  const validation = validateGenerationPayload(payload);
  if (!validation.isValid) {
    throw new Error(validation.errors.join('; '));
  }

  const mode = getRuntimeMode();
  const baseURL = getApiBaseUrl();

  // If in Demo Mode or no tunnel URL is set, return demo dataset with realistic pipeline simulation
  if (mode === 'demo' || !baseURL) {
    onProgressStep('Preparing generation request...');
    await new Promise(r => setTimeout(r, 600));

    onProgressStep('Sampling character-level LSTM for candidate SMILES...');
    await new Promise(r => setTimeout(r, 900));

    onProgressStep('Validating chemical structures and computing RDKit descriptors...');
    await new Promise(r => setTimeout(r, 700));

    onProgressStep('Applying Lipinski and custom property thresholds...');
    await new Promise(r => setTimeout(r, 400));

    const result = filterMockMolecules(payload);
    return result;
  }

  // Live Mode: Colab FastAPI request
  try {
    onProgressStep('Connecting to Google Colab PyTorch runtime...');
    const client = createApiClient();
    
    onProgressStep('Generating and validating candidate structures...');
    const response = await client.post(APP_CONFIG.endpoints.generate, payload);

    if (response.data && response.data.status === 'success' && Array.isArray(response.data.molecules)) {
      onProgressStep('Generation complete.');
      // Normalize candidates to guarantee compatibility across UI components
      const normalizedMolecules = response.data.molecules.map((mol, idx) => ({
        ...mol,
        candidate_id: mol.candidate_id || `GM-${String(idx + 1).padStart(3, '0')}`,
        valid: mol.valid !== undefined ? mol.valid : true,
        hbd: mol.hbd !== undefined ? mol.hbd : (mol.h_bond_donors !== undefined ? mol.h_bond_donors : 0),
        hba: mol.hba !== undefined ? mol.hba : (mol.h_bond_acceptors !== undefined ? mol.h_bond_acceptors : 0),
        h_bond_donors: mol.h_bond_donors !== undefined ? mol.h_bond_donors : (mol.hbd !== undefined ? mol.hbd : 0),
        h_bond_acceptors: mol.h_bond_acceptors !== undefined ? mol.h_bond_acceptors : (mol.hba !== undefined ? mol.hba : 0),
        filter_pass: mol.filter_pass !== undefined ? mol.filter_pass : true,
        structure_image: mol.structure_image || null,
        docking_score: mol.docking_score ?? null,
      }));

      return {
        ...response.data,
        molecules: normalizedMolecules,
        is_demo: false,
      };
    } else {
      throw new Error(
        response.data?.message || 
        'Invalid response structure received from Colab. Expected status: "success" and molecules array.'
      );
    }
  } catch (err) {
    let errorDetail = 'Colab generation request failed.';
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      errorDetail = 'Generation request timed out after 45 seconds. The Colab GPU/CPU took too long to generate candidates.';
    } else if (err.response) {
      errorDetail = `Colab backend error (HTTP ${err.response.status}): ${err.response.data?.detail || err.response.data?.message || err.message}`;
    } else if (err.request) {
      errorDetail = 'Colab backend unreachable. Check if the ngrok/cloudflared tunnel is still active and URL is correct.';
    } else {
      errorDetail = err.message || 'Unknown network error occurred.';
    }

    const customErr = new Error(errorDetail);
    customErr.isNetworkError = true;
    throw customErr;
  }
}

/**
 * Reserved for Phase 2: Virtual screening docking request (EGFR 1M17)
 */
export async function dockCandidates(candidateIds) {
  const mode = getRuntimeMode();
  const baseURL = getApiBaseUrl();

  if (mode === 'demo' || !baseURL) {
    throw new Error('Live docking against EGFR (PDB: 1M17) requires a live Colab runtime with AutoDock Vina and Meeko installed.');
  }

  const client = createApiClient();
  return client.post(APP_CONFIG.endpoints.dock, { candidate_ids: candidateIds, target: 'EGFR', pdb_id: '1M17' });
}

