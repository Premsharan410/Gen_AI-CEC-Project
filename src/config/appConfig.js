/**
 * GenMol AI - Application & API Configuration
 * 
 * Phase 1: Prepared for Google Colab FastAPI tunneling (e.g. ngrok / cloudflared / local).
 * The base URL is stored in localStorage so users can paste their Colab public tunnel URL
 * dynamically during university presentation without editing source code.
 */

const STORAGE_KEY_BASE_URL = 'genmol_colab_api_url';
const STORAGE_KEY_MODE = 'genmol_runtime_mode'; // 'demo' | 'live'

export const APP_CONFIG = {
  appName: 'GenMol AI',
  version: '1.0.0-rc1',
  tagline: 'Deep Learning Molecular Generation & Virtual Screening',
  institution: 'Computational Chemistry Research Prototype',
  targetProtein: {
    name: 'EGFR (Epidermal Growth Factor Receptor)',
    pdbId: '1M17',
    resolution: '2.60 Å',
    bindingPocket: 'ATP-binding kinase domain',
  },
  
  // Pipeline filter defaults (matching existing LSTM + RDKit research pipeline)
  defaultGenerationSettings: {
    num_molecules: 10,
    enable_filters: true,
    filters: {
      min_molecular_weight: 150,
      max_molecular_weight: 500,
      min_logP: -1.0,
      max_logP: 5.0,
      min_qed: 0.3,
    },
  },

  // Fixed scientific pipeline rules implemented in RDKit backend
  pipelineConstraints: {
    max_hbd: 5,
    max_hba: 10,
    max_tpsa: 140.0,
    max_rotatable_bonds: 10,
  },

  // Input boundaries
  limits: {
    min_molecules: 1,
    max_molecules: 100,
    mw_floor: 50,
    mw_ceiling: 1000,
    logP_floor: -5,
    logP_ceiling: 10,
    qed_floor: 0.0,
    qed_ceiling: 1.0,
  },

  // API Endpoints
  endpoints: {
    health: '/health',
    generate: '/generate',
    dock: '/dock', // Reserved for Phase 2 optional docking
  },

  // Request timeout in milliseconds (Colab generation on CPU/GPU typically completes in 5-20s)
  requestTimeoutMs: 45000,
};

// Runtime Status constants matching exact user prompt requirements
export const RUNTIME_STATUS = {
  DEMO: 'Demo Mode',
  CONNECTING: 'Connecting',
  CONNECTED: 'Colab Connected',
  GENERATING: 'Generating',
  ERROR: 'Connection Error',
};

/**
 * Get current configured Colab API base URL.
 * Defaults to empty string (forces Demo mode until user enters a Colab tunnel URL).
 */
export function getApiBaseUrl() {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_BASE_URL);
  if (stored && stored.trim().length > 0) return stored.trim();
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
}

/**
 * Set Colab API base URL (e.g. "https://xxxx-xx-xx.ngrok-free.app")
 */
export function setApiBaseUrl(url) {
  if (typeof window === 'undefined') return;
  const cleanUrl = (url || '').trim().replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY_BASE_URL, cleanUrl);
  return cleanUrl;
}

/**
 * Get configured runtime mode ('demo' or 'live')
 */
export function getRuntimeMode() {
  if (typeof window === 'undefined') return 'demo';
  const mode = localStorage.getItem(STORAGE_KEY_MODE);
  return mode === 'live' ? 'live' : 'demo';
}

/**
 * Set runtime mode ('demo' or 'live')
 */
export function setRuntimeMode(mode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODE, mode === 'live' ? 'live' : 'demo');
}

