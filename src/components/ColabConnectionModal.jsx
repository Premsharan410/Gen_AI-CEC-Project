import React, { useState, useEffect } from 'react';
import {
  X, Server, CheckCircle2, AlertTriangle, RefreshCw,
  Terminal, Zap, Info
} from 'lucide-react';
import {
  getApiBaseUrl, setApiBaseUrl,
  getRuntimeMode, setRuntimeMode,
  APP_CONFIG, RUNTIME_STATUS
} from '../config/appConfig';
import { checkConnection } from '../services/api';

export default function ColabConnectionModal({ isOpen, onClose, onStatusChange }) {
  const [tunnelUrl, setTunnelUrl] = useState('');
  const [currentMode, setCurrentMode] = useState('demo');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTunnelUrl(getApiBaseUrl());
      setCurrentMode(getRuntimeMode());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    setApiBaseUrl(tunnelUrl);
    setRuntimeMode('live');

    try {
      const res = await checkConnection();
      setTestResult(res);
      if (res.ok) {
        setCurrentMode('live');
        if (onStatusChange) onStatusChange(RUNTIME_STATUS.CONNECTED);
      } else {
        if (onStatusChange) onStatusChange(RUNTIME_STATUS.ERROR);
      }
    } catch (err) {
      setTestResult({
        ok: false,
        error: err.message || 'Connection test failed',
      });
      if (onStatusChange) onStatusChange(RUNTIME_STATUS.ERROR);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setApiBaseUrl(tunnelUrl);
    setRuntimeMode(currentMode);
    if (currentMode === 'demo') {
      if (onStatusChange) onStatusChange(RUNTIME_STATUS.DEMO);
    } else {
      if (testResult && testResult.ok) {
        if (onStatusChange) onStatusChange(RUNTIME_STATUS.CONNECTED);
      } else {
        if (onStatusChange) onStatusChange(RUNTIME_STATUS.CONNECTING);
        checkConnection().then(res => {
          if (onStatusChange) {
            onStatusChange(res.ok ? RUNTIME_STATUS.CONNECTED : RUNTIME_STATUS.ERROR);
          }
        });
      }
    }
    onClose();
  };

  const handleSwitchToDemo = () => {
    setCurrentMode('demo');
    setRuntimeMode('demo');
    if (onStatusChange) onStatusChange(RUNTIME_STATUS.DEMO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-brand-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-bg/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                Google Colab Runtime Connection
                {/* <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                  Phase 2 Bridge
                </span> */}
              </h3>
              <p className="text-xs text-brand-muted">
                Connect to GPU-accelerated PyTorch model hosted temporarily in Google Colab.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-bg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-brand-bg border border-brand-border">
            <button
              type="button"
              onClick={() => setCurrentMode('demo')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentMode === 'demo'
                ? 'bg-white text-brand-text border border-brand-border shadow-xs'
                : 'text-brand-muted hover:text-brand-text'
                }`}
            >
              <Zap className="w-4 h-4 text-brand-amber" />
              Demo Mode (Pre-computed Samples)
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('live')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentMode === 'live'
                ? 'bg-white text-brand-blue border border-brand-border shadow-xs'
                : 'text-brand-muted hover:text-brand-text'
                }`}
            >
              <Server className="w-4 h-4 text-brand-blue" />
              Live Colab Mode (FastAPI Tunnel)
            </button>
          </div>

          {currentMode === 'demo' ? (
            <div className="p-4 rounded-xl bg-[#FEF5E7] border border-[#F2B84B] text-xs text-[#9A6008] space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 shrink-0" />
                Active Runtime: Demo Evaluation Mode
              </div>
              <p className="leading-relaxed text-[#7A4B06]">
                The application operates autonomously using pre-computed candidate outputs generated by the trained character-level LSTM and verified by RDKit. All form inputs, property filters, sorting, and CSV export function normally without requiring an active Colab session.
              </p>
              {/* <p className="text-[11px] font-medium text-[#9A6008]">
                When ready for presentation, launch your Colab notebook, copy the temporary tunnel URL, and switch to Live Colab Mode.
              </p> */}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  Colab Public Tunnel URL (Localtunnel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={tunnelUrl}
                    onChange={(e) => setTunnelUrl(e.target.value)}
                    placeholder="https://xxxx-xx-xx.ngrok-free.app"
                    className="flex-1 px-3.5 py-2 text-xs font-mono rounded-lg bg-white border border-brand-border text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={!tunnelUrl || testing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-blue hover:bg-brand-blue-hover text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-brand-muted font-medium">
                  Expected endpoint: <code className="text-brand-blue font-bold font-mono">GET {APP_CONFIG.endpoints.health}</code>
                </p>
              </div>

              {/* Test Result Display */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs ${testResult.ok
                  ? 'bg-[#E8F6ED] border-[#7AD0A4] text-[#137A43]'
                  : 'bg-[#FDF0ED] border-[#F8B4AB] text-[#B92A1D]'
                  }`}>
                  <div className="flex items-start gap-2.5">
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#137A43] mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-[#B92A1D] mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold">
                        {testResult.ok ? 'Connection Successful!' : 'Connection Failed'}
                      </div>
                      <div className="text-[11px]">
                        {testResult.ok ? testResult.message : testResult.error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step-by-Step Presentation Guide */}
              {/* <div className="p-4 rounded-xl bg-brand-mint border border-brand-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-text">
                  <Terminal className="w-4 h-4 text-brand-teal" />
                  How to start Colab during project presentation
                </div>
                <ol className="text-xs text-brand-muted space-y-1.5 list-decimal list-inside leading-relaxed font-medium">
                  <li>Open your existing GenMol AI Google Colab notebook.</li>
                  <li>Run the notebook cells to load PyTorch model weights & RDKit.</li>
                  <li>Run the Phase 2 FastAPI + ngrok wrapper cell.</li>
                  <li>Copy the public URL (e.g. <span className="font-mono font-bold text-brand-blue">https://xxxx.ngrok-free.app</span>) and paste it above.</li>
                  <li>Click <strong>Test Connection</strong> to verify live connectivity.</li>
                </ol>
              </div> */}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-brand-border bg-brand-bg/60">
          <button
            type="button"
            onClick={handleSwitchToDemo}
            className="text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
          >
            Reset to Demo Mode
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white transition-all shadow-xs cursor-pointer"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
