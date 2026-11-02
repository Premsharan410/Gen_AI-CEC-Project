import React, { useState } from 'react';
import { Copy, Check, Eye, CheckCircle2 } from 'lucide-react';
import MoleculeViewer2D from './MoleculeViewer2D';

export default function MoleculeCard({ molecule, onViewDetails }) {
  const [copied, setCopied] = useState(false);

  const handleCopySmiles = (e) => {
    e.stopPropagation();
    const smiles = molecule.canonical_smiles || molecule.smiles || '';
    navigator.clipboard.writeText(smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getQedBadge = (qed) => {
    if (qed >= 0.75) return 'text-[#137A43] bg-[#E8F6ED] border-[#7AD0A4]';
    if (qed >= 0.5) return 'text-[#1E50B5] bg-[#EEF4FF] border-[#B8D3FE]';
    return 'text-[#9A6008] bg-[#FEF5E7] border-[#F2B84B]';
  };

  return (
    <div className="flex flex-col bg-white border border-brand-border hover:border-brand-blue/50 rounded-xl overflow-hidden transition-all duration-200 shadow-card hover:shadow-card-hover group">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-bg/60 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-brand-blue px-2.5 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/20">
            {molecule.candidate_id || 'GM-???'}
          </span>
          {molecule.valid && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#137A43] px-2 py-0.5 rounded-full bg-[#E8F6ED] border border-[#7AD0A4]">
              <CheckCircle2 className="w-3 h-3" />
              Valid
            </span>
          )}
        </div>

        {/* Filter pass badge */}
        {molecule.filter_pass !== undefined && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            molecule.filter_pass 
              ? 'text-[#137A43] bg-[#E8F6ED] border-[#7AD0A4]' 
              : 'text-[#B92A1D] bg-[#FDF0ED] border-[#F8B4AB]'
          }`}>
            {molecule.filter_pass ? 'Passed Filters' : 'Filtered Out'}
          </span>
        )}
      </div>

      {/* 2D Structure Rendering (Crisp White Canvas) */}
      <div className="p-3.5 bg-white">
        <MoleculeViewer2D
          structureImage={molecule.structure_image}
          svgStructure={molecule.svg_structure}
          smiles={molecule.smiles}
          candidateId={molecule.candidate_id}
          className="h-44"
        />
      </div>

      {/* SMILES Bar */}
      <div className="px-4 py-2 bg-brand-bg/40 border-t border-b border-brand-border flex items-center justify-between gap-2">
        <div className="font-mono text-xs text-brand-text truncate select-all" title={molecule.canonical_smiles || molecule.smiles}>
          <span className="text-brand-muted font-medium mr-1 select-none">SMILES:</span>
          {molecule.canonical_smiles || molecule.smiles || 'N/A'}
        </div>
        <button
          type="button"
          onClick={handleCopySmiles}
          title="Copy Canonical SMILES"
          className="p-1.5 rounded-md text-brand-muted hover:text-brand-blue hover:bg-brand-bg transition-colors shrink-0 cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#137A43]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Key Physicochemical Properties */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {/* Molecular Weight */}
          <div className="p-2 rounded-lg bg-brand-bg border border-brand-border">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">MW</div>
            <div className="text-xs font-mono font-bold text-brand-text mt-0.5">
              {molecule.molecular_weight !== undefined ? Number(molecule.molecular_weight).toFixed(1) : '—'}
            </div>
            <div className="text-[9px] text-brand-muted">g/mol</div>
          </div>

          {/* logP */}
          <div className="p-2 rounded-lg bg-brand-bg border border-brand-border">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">logP</div>
            <div className="text-xs font-mono font-bold text-brand-text mt-0.5">
              {molecule.logP !== undefined ? Number(molecule.logP).toFixed(2) : '—'}
            </div>
            <div className="text-[9px] text-brand-muted">lipophilicity</div>
          </div>

          {/* QED */}
          <div className={`p-2 rounded-lg border ${getQedBadge(molecule.qed || 0)}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">QED</div>
            <div className="text-xs font-mono font-bold mt-0.5">
              {molecule.qed !== undefined ? Number(molecule.qed).toFixed(2) : '—'}
            </div>
            <div className="text-[9px] opacity-80">drug-likeness</div>
          </div>
        </div>

        {/* Optional Docking Score if present */}
        {molecule.docking_score !== null && molecule.docking_score !== undefined && (
          <div className="px-3 py-1.5 rounded-lg bg-brand-mint border border-brand-teal/20 flex items-center justify-between text-xs">
            <span className="text-brand-muted font-medium">EGFR (1M17) Affinity:</span>
            <span className="font-mono font-bold text-brand-teal">
              {molecule.docking_score} kcal/mol
            </span>
          </div>
        )}

        {/* Card Action */}
        <button
          type="button"
          onClick={() => onViewDetails(molecule)}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-brand-text bg-white hover:bg-brand-blue hover:text-white border border-brand-border hover:border-brand-blue transition-all shadow-xs cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Molecular Details</span>
        </button>
      </div>
    </div>
  );
}
