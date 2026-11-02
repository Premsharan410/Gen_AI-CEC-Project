import React, { useState } from 'react';
import { Sliders, Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export default function GenerationForm({ 
  settings, 
  onSettingsChange, 
  onGenerate, 
  isLoading, 
  runtimeStatus 
}) {
  const [validationErrors, setValidationErrors] = useState([]);

  const handleNumChange = (val) => {
    const num = parseInt(val, 10);
    onSettingsChange({
      ...settings,
      num_molecules: isNaN(num) ? '' : num,
    });
  };

  const handleToggleFilters = (enabled) => {
    onSettingsChange({
      ...settings,
      enable_filters: enabled,
    });
  };

  const handleFilterChange = (key, value) => {
    const parsed = value === '' ? '' : parseFloat(value);
    onSettingsChange({
      ...settings,
      filters: {
        ...settings.filters,
        [key]: parsed,
      },
    });
  };

  const validate = () => {
    const errors = [];
    const num = Number(settings.num_molecules);
    if (!num || num < APP_CONFIG.limits.min_molecules || num > APP_CONFIG.limits.max_molecules) {
      errors.push(`Please enter a valid count between ${APP_CONFIG.limits.min_molecules} and ${APP_CONFIG.limits.max_molecules} molecules.`);
    }

    if (settings.enable_filters) {
      const f = settings.filters;
      if (f.min_molecular_weight > f.max_molecular_weight) {
        errors.push('Min Molecular Weight cannot exceed Max Molecular Weight.');
      }
      if (f.min_logP > f.max_logP) {
        errors.push('Min logP cannot exceed Max logP.');
      }
      if (f.min_qed < 0 || f.min_qed > 1) {
        errors.push('Minimum QED must be between 0.0 and 1.0.');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (validate()) {
      onGenerate();
    }
  };

  const handleResetDefaults = () => {
    onSettingsChange(JSON.parse(JSON.stringify(APP_CONFIG.defaultGenerationSettings)));
    setValidationErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-xl p-6 shadow-card space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-brand-blue/10 text-brand-blue">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
            Generation Parameters
          </h3>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          disabled={isLoading}
          className="text-xs font-medium text-brand-blue hover:text-brand-blue-hover disabled:opacity-40 transition-colors cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>

      {/* Validation alert if any */}
      {validationErrors.length > 0 && (
        <div className="p-3.5 rounded-lg bg-[#FDF0ED] border border-[#F8B4AB] text-[#B92A1D] text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Parameter Validation Error
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Input 1: Number of molecules */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="num_molecules" className="text-xs font-semibold text-brand-text">
            Candidate Molecules to Return
          </label>
          <span className="font-mono text-xs font-bold text-brand-blue px-2.5 py-0.5 rounded bg-brand-bg border border-brand-border">
            {settings.num_molecules || 0}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={APP_CONFIG.limits.min_molecules}
            max={APP_CONFIG.limits.max_molecules}
            value={settings.num_molecules || 1}
            disabled={isLoading}
            onChange={(e) => handleNumChange(e.target.value)}
            className="flex-1 accent-brand-blue h-2 bg-[#E1EDF7] rounded-lg cursor-pointer"
          />
          <input
            id="num_molecules"
            type="number"
            min={APP_CONFIG.limits.min_molecules}
            max={APP_CONFIG.limits.max_molecules}
            value={settings.num_molecules}
            disabled={isLoading}
            onChange={(e) => handleNumChange(e.target.value)}
            className="w-16 px-2.5 py-1.5 text-center font-mono text-xs font-semibold rounded-lg bg-white border border-brand-border text-brand-text focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-xs"
          />
        </div>
        <p className="text-[11px] text-brand-muted">
          Number of candidate molecules to generate and evaluate (1–100).
        </p>
      </div>

      {/* Input 2: Enable property filtering */}
      <div className="pt-2 border-t border-brand-border">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-brand-text block">
              Enable Property Filtering
            </label>
            <p className="text-[11px] text-brand-muted">
              Filter by Lipinski-like drug parameters
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.enable_filters}
            disabled={isLoading}
            onClick={() => handleToggleFilters(!settings.enable_filters)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.enable_filters ? 'bg-brand-blue' : 'bg-[#CBD8E5]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                settings.enable_filters ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Input 3: Optional property thresholds */}
      {settings.enable_filters && (
        <div className="p-4 rounded-xl bg-brand-mint border border-brand-border space-y-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
            Physicochemical Thresholds
          </div>

          {/* Molecular Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-brand-text text-[11px] font-medium">
              <span>Molecular Weight (MW) Range</span>
              <span className="font-mono font-semibold text-brand-blue">
                {settings.filters.min_molecular_weight} – {settings.filters.max_molecular_weight} g/mol
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-brand-muted font-medium">Min MW</label>
                <input
                  type="number"
                  step="10"
                  value={settings.filters.min_molecular_weight}
                  disabled={isLoading}
                  onChange={(e) => handleFilterChange('min_molecular_weight', e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs font-medium rounded-lg bg-white border border-brand-border text-brand-text focus:outline-none focus:border-brand-blue shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-brand-muted font-medium">Max MW</label>
                <input
                  type="number"
                  step="10"
                  value={settings.filters.max_molecular_weight}
                  disabled={isLoading}
                  onChange={(e) => handleFilterChange('max_molecular_weight', e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs font-medium rounded-lg bg-white border border-brand-border text-brand-text focus:outline-none focus:border-brand-blue shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* logP */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-brand-text text-[11px] font-medium">
              <span>Partition Coefficient (logP) Range</span>
              <span className="font-mono font-semibold text-brand-blue">
                {settings.filters.min_logP} to {settings.filters.max_logP}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-brand-muted font-medium">Min logP</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.filters.min_logP}
                  disabled={isLoading}
                  onChange={(e) => handleFilterChange('min_logP', e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs font-medium rounded-lg bg-white border border-brand-border text-brand-text focus:outline-none focus:border-brand-blue shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-brand-muted font-medium">Max logP</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.filters.max_logP}
                  disabled={isLoading}
                  onChange={(e) => handleFilterChange('max_logP', e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs font-medium rounded-lg bg-white border border-brand-border text-brand-text focus:outline-none focus:border-brand-blue shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Minimum QED */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-brand-text text-[11px] font-medium">
              <span>Minimum Drug-likeness (QED)</span>
              <span className="font-mono font-semibold text-brand-blue">{settings.filters.min_qed}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={settings.filters.min_qed}
              disabled={isLoading}
              onChange={(e) => handleFilterChange('min_qed', e.target.value)}
              className="w-full accent-brand-blue h-2 bg-[#E1EDF7] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-muted font-medium">
              <span>0.1 (Permissive)</span>
              <span>0.5 (Standard)</span>
              <span>0.9 (Stringent)</span>
            </div>
          </div>

          {/* Fixed rules reminder */}
          <div className="p-2.5 rounded-lg bg-white border border-brand-border text-[10px] text-brand-muted space-y-0.5">
            <div className="text-brand-text font-semibold">Underlying Pipeline Rules:</div>
            <div>HBD &le; 5 &bull; HBA &le; 10 &bull; TPSA &le; 140 Å² &bull; Rotatable Bonds &le; 10</div>
          </div>
        </div>
      )}

      {/* Scientific Pipeline Clarification Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-brand-bg border border-brand-border text-xs text-brand-muted">
        <Info className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <span>
          The LSTM model proposes SMILES tokens autoregressively. Valence and descriptors are validated by RDKit before threshold filtering.
        </span>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Research Pipeline...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Molecules</span>
          </>
        )}
      </button>
    </form>
  );
}
