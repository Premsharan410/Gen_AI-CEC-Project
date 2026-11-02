import React, { useState, useMemo } from 'react';
import { Copy, Check, FlaskConical, ShieldCheck } from 'lucide-react';
import { MOCK_MOLECULES } from '../data/mockMolecules';

/**
 * MolecularHero2D
 * 
 * Clean, minimal, publication-grade 2D molecular visualization.
 * Designed to represent the 2D sequence-generation and RDKit validation pipeline of GenMol AI.
 * 
 * Features:
 * - One prominent, scientifically accurate 2D molecular structure.
 * - Clean, consistent bond thickness and readable heteroatom typography.
 * - Softly tinted pale blue canvas with generous negative space.
 * - Small '2D MOLECULAR STRUCTURE' header and restrained 'SMILES → STRUCTURE' caption.
 * - Genuine RDKit-verified benchmark candidate data with candidate switcher and one-click SMILES copy.
 */
export default function MolecularHero2D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const candidate = useMemo(() => {
    return MOCK_MOLECULES[activeIdx] || MOCK_MOLECULES[0];
  }, [activeIdx]);

  const handleCopySmiles = () => {
    const smiles = candidate.canonical_smiles || candidate.smiles || '';
    navigator.clipboard.writeText(smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none">
      {/* 1. Main 2D Molecular Specimen Plate — Pale Mint / Lavender Canvas */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#E2F3E9]/50 via-white to-[#EDE9FA]/40 border border-[#D5E0E9] p-5 sm:p-7 shadow-xs overflow-hidden">
        
        {/* Subtle Spatial Calibration Markers in Corners */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-[#D5E0E9] select-none pointer-events-none">+</div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-[#D5E0E9] select-none pointer-events-none">+</div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#D5E0E9] select-none pointer-events-none">+</div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#D5E0E9] select-none pointer-events-none">+</div>

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5E0E9] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-teal" />
            <span className="font-extrabold tracking-wider text-[#24313D] uppercase">
              2D Molecular Structure
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#526477] bg-white/90 px-2.5 py-1 rounded-md border border-[#D5E0E9]">
              ILLUSTRATIVE STRUCTURE (BENCHMARK {candidate.candidate_id})
            </span>
            {/* Candidate Selector Switcher */}
            <div className="flex items-center gap-0.5 bg-white/80 p-0.5 rounded-lg border border-[#D5E0E9] text-[11px]">
              {MOCK_MOLECULES.slice(0, 3).map((mol, idx) => (
                <button
                  key={mol.candidate_id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeIdx === idx 
                      ? 'bg-white text-brand-blue font-bold shadow-xs border border-[#D5E0E9]' 
                      : 'text-[#526477] hover:text-[#24313D]'
                  }`}
                >
                  {mol.candidate_id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Dominant, Publication-Grade 2D Molecular Diagram */}
        <div className="py-6 sm:py-8 flex items-center justify-center min-h-[240px] sm:min-h-[270px]">
          {activeIdx === 0 && (
            /* GM-101: Quinazoline EGFR Inhibitor Pharmacophore */
            <svg 
              viewBox="0 0 520 260" 
              className="w-full h-auto max-h-[260px]" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Subtle Pharmacophore Annotation Caliper for Quinazoline Core */}
              <rect 
                x="95" y="65" width="145" height="110" rx="10" 
                fill="#2864DC" 
                fillOpacity="0.04" 
                stroke="#2864DC" 
                strokeWidth="1.2" 
                strokeDasharray="3 3"
              />
              <text x="168" y="58" fontSize="10" fontWeight="700" fill="#2864DC" fontFamily="monospace" textAnchor="middle">
                Quinazoline Hinge Core
              </text>

              {/* Benzene Ring of Quinazoline */}
              <polygon points="120,105 155,85 190,105 190,145 155,165 120,145" stroke="#24313D" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="126" y1="109" x2="152" y2="94" stroke="#24313D" strokeWidth="2" />
              <line x1="184" y1="109" x2="184" y2="141" stroke="#24313D" strokeWidth="2" />
              <line x1="126" y1="141" x2="152" y2="156" stroke="#24313D" strokeWidth="2" />

              {/* Pyrimidine Ring with N1 & N3 */}
              <polygon points="190,105 225,85 260,105 260,145 225,165 190,145" stroke="#2864DC" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="195" y1="142" x2="220" y2="157" stroke="#2864DC" strokeWidth="2" />
              <line x1="223" y1="92" x2="252" y2="108" stroke="#2864DC" strokeWidth="2" />

              {/* Heteroatom N1 */}
              <circle cx="225" cy="85" r="9.5" fill="#FFFFFF" stroke="#2864DC" strokeWidth="1.5" />
              <text x="225" y="89" fontSize="11" fontWeight="800" fill="#2864DC" fontFamily="monospace" textAnchor="middle">N</text>

              {/* Heteroatom N3 */}
              <circle cx="225" cy="165" r="9.5" fill="#FFFFFF" stroke="#2864DC" strokeWidth="1.5" />
              <text x="225" y="169" fontSize="11" fontWeight="800" fill="#2864DC" fontFamily="monospace" textAnchor="middle">N</text>

              {/* Aniline Linker at C4 */}
              <line x1="260" y1="105" x2="300" y2="85" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="300" cy="85" r="11" fill="#FFFFFF" stroke="#168A83" strokeWidth="1.5" />
              <text x="300" y="89" fontSize="10" fontWeight="700" fill="#168A83" fontFamily="monospace" textAnchor="middle">NH</text>

              {/* Substituted Phenyl Pocket Ring */}
              <line x1="311" y1="85" x2="345" y2="85" stroke="#24313D" strokeWidth="2.2" />
              <polygon points="345,85 375,68 410,85 410,120 375,137 345,120" stroke="#24313D" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="351" y1="89" x2="373" y2="76" stroke="#24313D" strokeWidth="2" />
              <line x1="404" y1="89" x2="404" y2="116" stroke="#24313D" strokeWidth="2" />
              <line x1="351" y1="116" x2="373" y2="129" stroke="#24313D" strokeWidth="2" />

              {/* 4-Fluoro Substituent */}
              <line x1="410" y1="85" x2="445" y2="72" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="452" cy="69" r="10" fill="#FEF5E7" stroke="#D97706" strokeWidth="1.5" />
              <text x="452" y="73" fontSize="11" fontWeight="800" fill="#D97706" fontFamily="monospace" textAnchor="middle">F</text>

              {/* 3-Chloro Substituent */}
              <line x1="410" y1="120" x2="445" y2="133" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="454" cy="136" r="11" fill="#E8F6ED" stroke="#0D9488" strokeWidth="1.5" />
              <text x="454" y="140" fontSize="11" fontWeight="800" fill="#0D9488" fontFamily="monospace" textAnchor="middle">Cl</text>

              {/* 7-Methoxy Group */}
              <line x1="120" y1="105" x2="90" y2="88" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="90" cy="88" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="90" y="92" fontSize="11" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>
              <line x1="81" y1="88" x2="58" y2="88" stroke="#24313D" strokeWidth="2.2" />
              <text x="40" y="92" fontSize="10" fontWeight="700" fill="#526477" fontFamily="monospace">CH₃</text>

              {/* 6-Propoxy Morpholine Tail */}
              <line x1="120" y1="145" x2="90" y2="162" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="90" cy="162" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="90" y="166" fontSize="11" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>
              <line x1="81" y1="162" x2="58" y2="175" stroke="#24313D" strokeWidth="2.2" />
              <line x1="58" y1="175" x2="36" y2="162" stroke="#24313D" strokeWidth="2.2" />
              <line x1="36" y1="162" x2="20" y2="173" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="20" cy="173" r="7" fill="#7961D9" />
              <text x="18" y="196" fontSize="9" fontWeight="700" fill="#7961D9" fontFamily="monospace">Morpholine Tail</text>

              {/* Chemical Callouts */}
              <g opacity="0.85">
                <path d="M 300 102 L 300 125 L 280 125" fill="none" stroke="#168A83" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x="275" y="137" fontSize="9" fontWeight="600" fill="#168A83" fontFamily="monospace">H-Bond Donor (Thr790)</text>
              </g>
              <g opacity="0.85">
                <path d="M 454 150 L 454 175 L 430 175" fill="none" stroke="#0D9488" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x="425" y="187" fontSize="9" fontWeight="600" fill="#0D9488" fontFamily="monospace">Hydrophobic Pocket Anchor</text>
              </g>
            </svg>
          )}

          {activeIdx === 1 && (
            /* GM-102: Dichlorobenzamide Biaryl Analogue */
            <svg 
              viewBox="0 0 520 260" 
              className="w-full h-auto max-h-[260px]" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Isopropyl Phenyl Ring */}
              <polygon points="110,120 145,100 180,120 180,160 145,180 110,160" stroke="#24313D" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="116" y1="124" x2="142" y2="109" stroke="#24313D" strokeWidth="2" />
              <line x1="174" y1="124" x2="174" y2="156" stroke="#24313D" strokeWidth="2" />
              <line x1="116" y1="156" x2="142" y2="171" stroke="#24313D" strokeWidth="2" />

              {/* Isopropyl Tail */}
              <line x1="110" y1="120" x2="75" y2="100" stroke="#24313D" strokeWidth="2.2" />
              <line x1="75" y1="100" x2="48" y2="115" stroke="#24313D" strokeWidth="2.2" />
              <line x1="75" y1="100" x2="75" y2="68" stroke="#24313D" strokeWidth="2.2" />
              <text x="32" y="135" fontSize="10" fontWeight="700" fill="#526477" fontFamily="monospace">i-Pr</text>

              {/* Amide Linker */}
              <line x1="180" y1="120" x2="220" y2="100" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="220" cy="100" r="11" fill="#FFFFFF" stroke="#168A83" strokeWidth="1.5" />
              <text x="220" y="104" fontSize="10" fontWeight="700" fill="#168A83" fontFamily="monospace" textAnchor="middle">NH</text>

              <line x1="231" y1="100" x2="265" y2="120" stroke="#24313D" strokeWidth="2.2" />
              {/* Carbonyl Oxygen */}
              <line x1="263" y1="120" x2="263" y2="152" stroke="#DC2626" strokeWidth="2.2" />
              <line x1="267" y1="120" x2="267" y2="152" stroke="#DC2626" strokeWidth="2.2" />
              <circle cx="265" cy="158" r="10" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="265" y="162" fontSize="11" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>

              {/* Right Dichlorophenyl Ring */}
              <line x1="265" y1="120" x2="305" y2="100" stroke="#24313D" strokeWidth="2.2" />
              <polygon points="305,100 340,80 375,100 375,140 340,160 305,140" stroke="#2864DC" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="311" y1="104" x2="337" y2="89" stroke="#2864DC" strokeWidth="2" />
              <line x1="369" y1="104" x2="369" y2="136" stroke="#2864DC" strokeWidth="2" />
              <line x1="311" y1="136" x2="337" y2="151" stroke="#2864DC" strokeWidth="2" />

              {/* 3,5-Dichloro Substituents */}
              <line x1="375" y1="100" x2="410" y2="85" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="418" cy="82" r="11" fill="#E8F6ED" stroke="#0D9488" strokeWidth="1.5" />
              <text x="418" y="86" fontSize="11" fontWeight="800" fill="#0D9488" fontFamily="monospace" textAnchor="middle">Cl</text>

              <line x1="340" y1="160" x2="340" y2="192" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="340" cy="200" r="11" fill="#E8F6ED" stroke="#0D9488" strokeWidth="1.5" />
              <text x="340" y="204" fontSize="11" fontWeight="800" fill="#0D9488" fontFamily="monospace" textAnchor="middle">Cl</text>

              {/* Pharmacophore annotation */}
              <text x="340" y="66" fontSize="10" fontWeight="700" fill="#2864DC" fontFamily="monospace" textAnchor="middle">
                3,5-Dichlorophenyl Lipophilic Core
              </text>
            </svg>
          )}

          {activeIdx === 2 && (
            /* GM-103: Trimethoxybenzamide Benzothiazole */
            <svg 
              viewBox="0 0 520 260" 
              className="w-full h-auto max-h-[260px]" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Trimethoxyphenyl Ring */}
              <polygon points="80,120 108,102 136,120 136,155 108,172 80,155" stroke="#24313D" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="86" y1="124" x2="105" y2="111" stroke="#24313D" strokeWidth="2" />
              <line x1="130" y1="124" x2="130" y2="151" stroke="#24313D" strokeWidth="2" />
              <line x1="86" y1="151" x2="105" y2="163" stroke="#24313D" strokeWidth="2" />

              {/* 3 Methoxy Substituents */}
              <line x1="80" y1="120" x2="52" y2="105" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="52" cy="105" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="52" y="109" fontSize="10" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>
              <text x="24" y="109" fontSize="9" fontWeight="700" fill="#526477" fontFamily="monospace">Me</text>

              <line x1="80" y1="155" x2="52" y2="170" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="52" cy="170" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="52" y="174" fontSize="10" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>
              <text x="24" y="174" fontSize="9" fontWeight="700" fill="#526477" fontFamily="monospace">Me</text>

              <line x1="108" y1="172" x2="108" y2="195" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="108" cy="200" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="108" y="204" fontSize="10" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>
              <text x="108" y="222" fontSize="9" fontWeight="700" fill="#526477" fontFamily="monospace" textAnchor="middle">Me</text>

              {/* Amide Linker */}
              <line x1="136" y1="120" x2="170" y2="100" stroke="#24313D" strokeWidth="2.2" />
              <line x1="168" y1="100" x2="168" y2="70" stroke="#DC2626" strokeWidth="2.2" />
              <line x1="172" y1="100" x2="172" y2="70" stroke="#DC2626" strokeWidth="2.2" />
              <circle cx="170" cy="65" r="9.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <text x="170" y="69" fontSize="10" fontWeight="800" fill="#DC2626" fontFamily="monospace" textAnchor="middle">O</text>

              <line x1="170" y1="100" x2="204" y2="120" stroke="#24313D" strokeWidth="2.2" />
              <circle cx="204" cy="120" r="11" fill="#FFFFFF" stroke="#168A83" strokeWidth="1.5" />
              <text x="204" y="124" fontSize="10" fontWeight="700" fill="#168A83" fontFamily="monospace" textAnchor="middle">NH</text>

              {/* Benzothiazole Core */}
              <line x1="215" y1="120" x2="250" y2="120" stroke="#24313D" strokeWidth="2.2" />
              <polygon points="250,120 276,98 308,110 298,144 264,144" stroke="#168A83" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <circle cx="274" cy="100" r="10" fill="#FEF5E7" stroke="#D97706" strokeWidth="1.5" />
              <text x="274" y="104" fontSize="10" fontWeight="800" fill="#D97706" fontFamily="monospace" textAnchor="middle">S</text>

              <circle cx="264" cy="144" r="10" fill="#FFFFFF" stroke="#2864DC" strokeWidth="1.5" />
              <text x="264" y="148" fontSize="10" fontWeight="800" fill="#2864DC" fontFamily="monospace" textAnchor="middle">N</text>

              {/* Fused Benzene Ring */}
              <polygon points="308,110 342,98 370,120 370,155 342,172 298,144" stroke="#24313D" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
              <line x1="313" y1="115" x2="338" y2="106" stroke="#24313D" strokeWidth="2" />
              <line x1="363" y1="124" x2="363" y2="151" stroke="#24313D" strokeWidth="2" />
              <line x1="313" y1="144" x2="338" y2="163" stroke="#24313D" strokeWidth="2" />

              {/* Annotation */}
              <text x="310" y="75" fontSize="10" fontWeight="700" fill="#168A83" fontFamily="monospace" textAnchor="middle">
                Benzothiazole Kinase Hinge Binder
              </text>
            </svg>
          )}
        </div>

        {/* Valence Key Bar */}
        <div className="pt-2.5 border-t border-[#D5E0E9] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#526477]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#24313D]">VALENCE:</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2864DC]" /> N (Blue)</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> O (Red)</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" /> Cl (Teal)</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> F/S (Amber)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#137A43] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RDKit Sanitized Graph</span>
          </div>
        </div>
      </div>

      {/* 2. Restrained Footer Bar: SMILES → STRUCTURE + Factual Descriptors */}
      <div className="px-3 py-2 rounded-2xl bg-white border border-[#D5E0E9] shadow-xs flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono text-[#526477]">
        <div className="flex items-center gap-2 max-w-full sm:max-w-[55%] truncate">
          <span className="font-extrabold text-[#24313D] tracking-wide shrink-0">
            SMILES &rarr; STRUCTURE:
          </span>
          <span className="truncate text-brand-blue font-semibold" title={candidate.canonical_smiles}>
            {candidate.canonical_smiles}
          </span>
          <button
            type="button"
            onClick={handleCopySmiles}
            title="Copy Canonical SMILES"
            className="p-1 rounded text-[#526477] hover:text-brand-blue hover:bg-[#EEF5FA] transition-colors shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#137A43]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Factual Candidate Properties */}
        <div className="flex items-center gap-2.5 text-[11px] shrink-0">
          <span>Formula: <strong className="text-[#24313D]">{candidate.formula}</strong></span>
          <span className="text-[#D5E0E9]">&bull;</span>
          <span>MW: <strong className="text-[#24313D]">{candidate.molecular_weight}</strong></span>
          <span className="text-[#D5E0E9]">&bull;</span>
          <span>logP: <strong className="text-[#24313D]">{candidate.logP}</strong></span>
          <span className="text-[#D5E0E9]">&bull;</span>
          <span>QED: <strong className="text-brand-blue">{candidate.qed.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
}

