import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Download, Search, ArrowUpDown, Server
} from 'lucide-react';
import GenerationForm from '../components/GenerationForm';
import MoleculeCard from '../components/MoleculeCard';
import MoleculeDetailsModal from '../components/MoleculeDetailsModal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import DockingSection from '../components/DockingSection';
import PropertyDistributionChart from '../components/PropertyDistributionChart';
import StatusIndicator from '../components/StatusIndicator';
import { APP_CONFIG, RUNTIME_STATUS } from '../config/appConfig';
import { generateMolecules } from '../services/api';
import { MOCK_GENERATION_METRICS, MOCK_MOLECULES } from '../data/mockMolecules';

export default function Generate({ runtimeStatus, setRuntimeStatus, onOpenSettings }) {
  // Generation Settings State
  const [settings, setSettings] = useState(JSON.parse(JSON.stringify(APP_CONFIG.defaultGenerationSettings)));

  // Generation Process State
  const [isLoading, setIsLoading] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [errorState, setErrorState] = useState(null); // { type, message }

  // Generation Results State
  const [generationMetrics, setGenerationMetrics] = useState(null);
  const [molecules, setMolecules] = useState([]);

  // Inspection / Modal State
  const [selectedMolecule, setSelectedMolecule] = useState(null);

  // Search & Sorting Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('qed_desc');

  // Load initial demo data on mount for immediate presentation readiness
  useEffect(() => {
    setGenerationMetrics(MOCK_GENERATION_METRICS);
    setMolecules(MOCK_MOLECULES);
  }, []);

  // Execute Generation
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorState(null);
    setRuntimeStatus(RUNTIME_STATUS.GENERATING);

    try {
      const response = await generateMolecules(settings, (msg) => {
        setStepMessage(msg);
      });

      setGenerationMetrics(response);
      setMolecules(response.molecules || []);

      if (response.is_demo) {
        setRuntimeStatus(RUNTIME_STATUS.DEMO);
      } else {
        setRuntimeStatus(RUNTIME_STATUS.CONNECTED);
      }
    } catch (err) {
      const isTimeout = err.message?.toLowerCase().includes('time');
      const isConnection = err.isNetworkError || err.message?.toLowerCase().includes('unreachable') || err.message?.toLowerCase().includes('connect');

      const errType = isTimeout ? 'timeout' : isConnection ? 'colab_disconnected' : 'invalid_response';
      setErrorState({
        type: errType,
        message: err.message,
      });

      setRuntimeStatus(RUNTIME_STATUS.ERROR);
    } finally {
      setIsLoading(false);
      setStepMessage('');
    }
  };

  const handleResetToDemo = () => {
    setErrorState(null);
    setGenerationMetrics(MOCK_GENERATION_METRICS);
    setMolecules(MOCK_MOLECULES);
    setRuntimeStatus(RUNTIME_STATUS.DEMO);
  };

  // Filter & Sort Molecules
  const filteredAndSortedMolecules = useMemo(() => {
    let result = [...molecules];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        (m.candidate_id && m.candidate_id.toLowerCase().includes(q)) ||
        (m.canonical_smiles && m.canonical_smiles.toLowerCase().includes(q)) ||
        (m.smiles && m.smiles.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'qed_desc':
          return (b.qed || 0) - (a.qed || 0);
        case 'qed_asc':
          return (a.qed || 0) - (b.qed || 0);
        case 'mw_asc':
          return (a.molecular_weight || 0) - (b.molecular_weight || 0);
        case 'mw_desc':
          return (b.molecular_weight || 0) - (a.molecular_weight || 0);
        case 'logp_asc':
          return (a.logP || 0) - (b.logP || 0);
        case 'logp_desc':
          return (b.logP || 0) - (a.logP || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [molecules, searchQuery, sortBy]);

  // Export results as CSV
  const handleExportCSV = () => {
    if (!molecules.length) return;

    const headers = [
      'candidate_id',
      'canonical_smiles',
      'raw_smiles',
      'valid',
      'molecular_weight',
      'logP',
      'qed',
      'hbd',
      'hba',
      'tpsa',
      'rotatable_bonds',
      'filter_pass',
      'docking_score'
    ];

    const rows = molecules.map(m => [
      `"${m.candidate_id || ''}"`,
      `"${m.canonical_smiles || m.smiles || ''}"`,
      `"${m.smiles || ''}"`,
      m.valid ? 'true' : 'false',
      m.molecular_weight !== undefined ? m.molecular_weight : '',
      m.logP !== undefined ? m.logP : '',
      m.qed !== undefined ? m.qed : '',
      m.hbd !== undefined ? m.hbd : '',
      m.hba !== undefined ? m.hba : '',
      m.tpsa !== undefined ? m.tpsa : '',
      m.rotatable_bonds !== undefined ? m.rotatable_bonds : '',
      m.filter_pass ? 'true' : 'false',
      m.docking_score !== undefined && m.docking_score !== null ? m.docking_score : ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `genmol_ai_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dockedMolecules = useMemo(() => {
    return molecules.filter(m => m.docking_score !== null && m.docking_score !== undefined);
  }, [molecules]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* PAGE HEADING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text">
              Molecular Generation Studio
            </h1>
            <StatusIndicator
              status={runtimeStatus}
              onOpenSettings={onOpenSettings}
            />
          </div>
          <p className="text-sm text-brand-muted font-medium">
            Generate, validate, and analyze candidate molecular structures using the GenMol AI research pipeline.
          </p>
        </div>

        {/* Runtime helper action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-brand-bg text-brand-text border border-brand-border shadow-xs transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-brand-blue" />
            <span>Colab Connection Settings</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner if currently in Demo Mode */}
      {/* {generationMetrics?.is_demo && !errorState && (
        <div className="p-4 rounded-2xl bg-[#FEF5E7] border border-[#F2B84B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9A6008] shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <div>
              <span className="font-bold text-[#7A4B06]">Demo Mode Active:</span> Displaying pre-computed sample candidates from the LSTM research pipeline. Connect Google Colab in settings to enable live GPU generation during presentation.
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F2B84B] hover:bg-[#E5AA3D] text-[#6B4B10] transition-colors self-start sm:self-auto cursor-pointer"
          >
            Connect Colab
          </button>
        </div>
      )}*/}

      {/* MAIN TWO-COLUMN STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-4 sticky top-24">
          <GenerationForm
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            runtimeStatus={runtimeStatus}
          />
        </div>

        {/* RIGHT COLUMN: Results Area (Pale Lavender / Blue Backdrop) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-brand-lavender/40 border border-brand-border space-y-6">
          {/* Loading State */}
          {isLoading && (
            <LoadingState stepMessage={stepMessage} />
          )}

          {/* Error State */}
          {!isLoading && errorState && (
            <EmptyState
              type={errorState.type}
              errorMessage={errorState.message}
              onAction={handleResetToDemo}
              onOpenSettings={onOpenSettings}
            />
          )}

          {/* Normal Results State */}
          {!isLoading && !errorState && (
            <>
              {/* RESULTS OVERVIEW METRICS */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-text">
                      Pipeline Execution Overview
                    </span>
                    {generationMetrics?.is_demo && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FEF5E7] text-[#9A6008] border border-[#F2B84B]">
                        Demo Samples
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-medium text-brand-muted">
                    Duration:{' '}
                    <span className="text-brand-blue font-bold">
                      {generationMetrics?.duration_seconds !== undefined
                        ? `${generationMetrics.duration_seconds}s`
                        : 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">Requested</div>
                    <div className="text-xl font-mono font-extrabold text-brand-text mt-0.5">
                      {generationMetrics?.requested_count ?? 'Not provided'}
                    </div>
                    <div className="text-[10px] text-brand-muted">Target count</div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">Raw Generated</div>
                    <div className="text-xl font-mono font-extrabold text-brand-text mt-0.5">
                      {generationMetrics?.generated_count ?? 'Not provided'}
                    </div>
                    <div className="text-[10px] text-brand-muted">LSTM strings</div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-mint border border-brand-border">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-brand-teal">Valid Structures</div>
                    <div className="text-xl font-mono font-extrabold text-brand-teal mt-0.5">
                      {generationMetrics?.valid_count ?? 'Not provided'}
                    </div>
                    <div className="text-[10px] text-brand-muted">RDKit verified</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E8F6ED] border border-[#7AD0A4]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#137A43]">Passed Filters</div>
                    <div className="text-xl font-mono font-extrabold text-[#137A43] mt-0.5">
                      {generationMetrics?.filter_passed_count ?? 'Not provided'}
                    </div>
                    <div className="text-[10px] text-[#137A43]">Threshold match</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF4FF] border border-[#B8D3FE] col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-brand-blue">Returned</div>
                    <div className="text-xl font-mono font-extrabold text-brand-blue mt-0.5">
                      {generationMetrics?.returned_count ?? molecules.length}
                    </div>
                    <div className="text-[10px] text-brand-muted">Final candidates</div>
                  </div>
                </div>
              </div>

              {/* SEARCH, SORT & EXPORT TOOLBAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-brand-border rounded-xl p-3.5 shadow-card">
                {/* Search box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by candidate ID or SMILES..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg bg-brand-bg border border-brand-border text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-1.5 text-xs bg-brand-bg px-3 py-2 rounded-lg border border-brand-border">
                    <ArrowUpDown className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-brand-text text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="qed_desc">Sort by QED (High &rarr; Low)</option>
                      <option value="qed_asc">Sort by QED (Low &rarr; High)</option>
                      <option value="mw_asc">Sort by MW (Low &rarr; High)</option>
                      <option value="mw_desc">Sort by MW (High &rarr; Low)</option>
                      <option value="logp_asc">Sort by logP (Low &rarr; High)</option>
                      <option value="logp_desc">Sort by logP (High &rarr; Low)</option>
                    </select>
                  </div>

                  {/* CSV Export Button */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={!molecules.length}
                    title="Export results to CSV"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>

              {/* MOLECULE CARDS GRID */}
              {filteredAndSortedMolecules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAndSortedMolecules.map((mol) => (
                    <MoleculeCard
                      key={mol.candidate_id || mol.smiles}
                      molecule={mol}
                      onViewDetails={setSelectedMolecule}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  type={molecules.length > 0 ? 'no_filter_matches' : 'no_molecules_returned'}
                  onAction={() => {
                    setSearchQuery('');
                    handleGenerate();
                  }}
                />
              )}

              {/* SCIENTIFIC PROPERTY DISTRIBUTION CHART */}
              {molecules.length > 0 && (
                <PropertyDistributionChart molecules={molecules} />
              )}

              {/* RESERVED DOCKING SECTION */}
              <DockingSection dockedMolecules={dockedMolecules} />
            </>
          )}
        </div>
      </div>

      {/* MOLECULE DETAIL MODAL */}
      <MoleculeDetailsModal
        molecule={selectedMolecule}
        isOpen={Boolean(selectedMolecule)}
        onClose={() => setSelectedMolecule(null)}
      />
    </div>
  );
}
