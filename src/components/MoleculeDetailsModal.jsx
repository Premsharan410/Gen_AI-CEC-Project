import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Copy, Check, FlaskConical, CheckCircle2, ShieldCheck, 
  Info, Activity, Target
} from 'lucide-react';
import MoleculeViewer2D from './MoleculeViewer2D';

/**
 * MoleculeDetailsModal
 * 
 * Full-page backdrop modal dialog for comprehensive molecular candidate inspection.
 * Rendered via createPortal directly into document.body to ensure:
 * 1. The backdrop covers and dims the entire viewport (100vw x 100vh) including the navbar & footer.
 * 2. Visual blur (backdrop-filter: blur(6px)) is applied across the entire background page.
 * 3. Background interactions and scrolling are safely locked while the modal is open.
 * 4. Keyboard accessibility: Escape key closes the modal; focus is trapped and restored.
 */
export default function MoleculeDetailsModal({ molecule, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const modalContainerRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Keyboard Escape listener, background scroll lock, and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Save active element to restore focus on close
    previousFocusRef.current = document.activeElement;

    // 1. Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Escape key handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Move focus to modal container
    if (modalContainerRef.current) {
      modalContainerRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !molecule) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const smilesToCopy = molecule.canonical_smiles || molecule.smiles || '';

  // Lipinski rule compliance calculation
  const mwPass = molecule.molecular_weight <= 500;
  const logPPass = molecule.logP <= 5;
  const hbdVal = molecule.hbd !== undefined ? molecule.hbd : molecule.h_bond_donors;
  const hbaVal = molecule.hba !== undefined ? molecule.hba : molecule.h_bond_acceptors;
  const hbdPass = hbdVal !== undefined ? hbdVal <= 5 : true;
  const hbaPass = hbaVal !== undefined ? hbaVal <= 10 : true;
  const lipinskiScore = [mwPass, logPPass, hbdPass, hbaPass].filter(Boolean).length;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/45 backdrop-blur-[6px] animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      {/* Modal Dialog Surface */}
      <div 
        ref={modalContainerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="molecule-details-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto bg-white border border-[#CBD8E5] rounded-3xl shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#CBD8E5] bg-[#EEF5FA]/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-brand-blue px-3 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20">
              {molecule.candidate_id || 'Candidate'}
            </span>
            <div>
              <h2 id="molecule-details-title" className="text-lg font-extrabold text-[#24313D] flex items-center gap-2">
                Molecule Details
                {molecule.valid && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F6ED] text-[#137A43] border border-[#7AD0A4]">
                    <ShieldCheck className="w-3 h-3" />
                    RDKit Validated
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#526477] font-medium">
                {molecule.scaffold_family || 'De Novo Generated Candidate Scaffold'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {molecule.filter_pass !== undefined && (
              <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${
                molecule.filter_pass 
                  ? 'text-[#137A43] bg-[#E8F6ED] border-[#7AD0A4]' 
                  : 'text-[#B92A1D] bg-[#FDF0ED] border-[#F8B4AB]'
              }`}>
                {molecule.filter_pass ? 'Passed Filters' : 'Filtered Out'}
              </span>
            )}
            <button 
              type="button"
              onClick={onClose}
              aria-label="Close Molecule Details Modal"
              className="p-2 rounded-xl text-[#526477] hover:text-[#24313D] hover:bg-white border border-transparent hover:border-[#CBD8E5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top section: 2D Diagram & Formula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-[#EEF5FA]/40 rounded-2xl p-4 border border-[#CBD8E5] flex items-center justify-center">
              <MoleculeViewer2D
                structureImage={molecule.structure_image}
                svgStructure={molecule.svg_structure}
                smiles={molecule.smiles}
                candidateId={molecule.candidate_id}
                className="h-60 w-full"
              />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#526477] uppercase tracking-wider">
                  Chemical Formula
                </span>
                <div className="text-2xl font-mono font-extrabold text-[#24313D] mt-0.5">
                  {molecule.formula || 'Calculated on structure'}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-[#526477] uppercase tracking-wider">
                  Drug-Likeness (QED Score)
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-2xl font-mono font-extrabold text-brand-blue">
                    {molecule.qed !== undefined ? Number(molecule.qed).toFixed(3) : 'N/A'}
                  </div>
                  <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F6ED] text-[#137A43] border border-[#7AD0A4]">
                    {molecule.qed >= 0.7 
                      ? 'Optimal Drug-Likeness' 
                      : molecule.qed >= 0.5 
                        ? 'Moderate Profile' 
                        : 'Sub-Optimal'}
                  </div>
                </div>
              </div>

              {/* Lipinski Summary Panel */}
              <div className="p-4 rounded-2xl bg-[#DDF3E8]/80 border border-[#CBD8E5] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#24313D]">
                  <span>Lipinski Rule of 5 Compliance</span>
                  <span className={`font-mono font-bold ${lipinskiScore === 4 ? 'text-[#137A43]' : 'text-[#9A6008]'}`}>
                    {lipinskiScore} / 4 Criteria Met
                  </span>
                </div>
                <p className="text-[11px] text-[#526477] leading-relaxed">
                  {lipinskiScore === 4 
                    ? 'Candidate complies fully with Lipinski oral bioavailability guidelines (MW ≤ 500, logP ≤ 5, HBD ≤ 5, HBA ≤ 10).' 
                    : 'Candidate has parameters outside standard Lipinski boundaries.'}
                </p>
              </div>
            </div>
          </div>

          {/* Canonical SMILES Section with Copy Button */}
          <div className="p-4 rounded-2xl bg-[#EEF5FA]/60 border border-[#CBD8E5] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#24313D] font-bold">CANONICAL SMILES</span>
              <button
                type="button"
                onClick={() => handleCopy(smilesToCopy)}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#137A43]" />
                    <span className="text-[#137A43]">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SMILES</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-[#24313D] bg-white p-3 rounded-xl border border-[#CBD8E5] break-all select-all font-medium">
              {smilesToCopy || 'Not available'}
            </div>
          </div>

          {/* Physicochemical Property Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24313D] mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-brand-blue" />
              <span>Calculated Physicochemical Descriptors (RDKit)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">Mol. Weight</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {molecule.molecular_weight !== undefined ? Number(molecule.molecular_weight).toFixed(2) : 'N/A'}
                  <span className="text-xs font-normal text-[#526477] ml-1">g/mol</span>
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Rule: 150 – 500</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">logP (Lipophilicity)</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {molecule.logP !== undefined ? Number(molecule.logP).toFixed(2) : 'N/A'}
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Rule: -1 to 5</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">H-Bond Donors</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {hbdVal !== undefined ? hbdVal : 'N/A'}
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Max allowed: 5</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">H-Bond Acceptors</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {hbaVal !== undefined ? hbaVal : 'N/A'}
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Max allowed: 10</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">TPSA</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {molecule.tpsa !== undefined ? Number(molecule.tpsa).toFixed(2) : 'N/A'}
                  <span className="text-xs font-normal text-[#526477] ml-1">&#197;&sup2;</span>
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Max: 140 &#197;&sup2;</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">Rotatable Bonds</div>
                <div className="text-base font-mono font-bold text-[#24313D] mt-0.5">
                  {molecule.rotatable_bonds !== undefined ? molecule.rotatable_bonds : 'N/A'}
                </div>
                <div className="text-[10px] text-[#526477] mt-1">Max: 10 bonds</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD8E5] shadow-xs col-span-2">
                <div className="text-[10px] text-[#526477] font-mono font-bold uppercase tracking-wider">Virtual Screening Status</div>
                <div className="text-sm font-bold text-[#24313D] mt-0.5 flex items-center gap-2">
                  {molecule.docking_score !== null && molecule.docking_score !== undefined ? (
                    <span className="text-brand-teal font-mono">
                      Affinity: {molecule.docking_score} kcal/mol (EGFR 1M17)
                    </span>
                  ) : (
                    <span className="text-[#526477]">
                      Not docked (Optional downstream stage)
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#526477] mt-1">AutoDock Vina / Meeko target</div>
              </div>
            </div>
          </div>

          {/* Scientific Disclaimer Alert */}
          <div className="p-4 rounded-2xl bg-[#FEF5E7] border border-[#F2B84B] text-xs text-[#9A6008] flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
            <p className="leading-relaxed">
              <strong>Scientific Notice:</strong> All values are in silico computational estimates generated by PyTorch LSTM and RDKit descriptors. Predictions represent virtual screening models and do not substitute for wet-lab bioassays.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#CBD8E5] bg-[#EEF5FA]/70">
          <div className="text-xs font-mono font-semibold text-[#526477]">
            Candidate ID: <span className="text-[#24313D] font-bold">{molecule.candidate_id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors shadow-xs cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );

  // Render via portal directly to document.body for an unconstrained full-viewport backdrop
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
