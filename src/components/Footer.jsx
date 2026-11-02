import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, ShieldAlert, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-brand-border py-12 text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-7 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                {/* <Atom className="w-4 h-4 text-brand-blue" /> */}
                <div className="relative w-9 h-9 rounded-xl bg-white border border-[#D5E0E9] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:border-brand-blue/40">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-7 h-7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Outer Hexagonal Valence Core */}
                    <polygon
                      points="18,4.5 29.5,11.2 29.5,24.8 18,31.5 6.5,24.8 6.5,11.2"
                      stroke="#2864DC"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      className="transition-colors group-hover:stroke-brand-blue"
                    />
                    {/* Delocalized Resonance Core */}
                    <circle
                      cx="18"
                      cy="18"
                      r="5.5"
                      stroke="#168A83"
                      strokeWidth="1.4"
                      strokeDasharray="2.5 2"
                    />
                    {/* Dynamic Orbital Axis */}
                    <path
                      d="M5 14 C9 6, 27 6, 31 14 C27 22, 9 22, 5 14 Z"
                      stroke="#7961D9"
                      strokeWidth="0.9"
                      strokeDasharray="1.5 2"
                      className="opacity-70"
                    />
                    {/* Vertex Atom Centers */}
                    <circle cx="18" cy="4.5" r="2.2" fill="#168A83" />
                    <circle cx="29.5" cy="11.2" r="2" fill="#2864DC" />
                    <circle cx="29.5" cy="24.8" r="2" fill="#7961D9" />
                    <circle cx="18" cy="31.5" r="2.2" fill="#168A83" />
                    <circle cx="6.5" cy="24.8" r="2" fill="#2864DC" />
                    <circle cx="6.5" cy="11.2" r="2" fill="#7961D9" />
                    <circle cx="18" cy="18" r="2.4" fill="#2864DC" />
                  </svg>
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#24313D] leading-none">
                GenMol
              </span>
              <span className="text-xs font-mono font-bold text-white bg-brand-blue px-1.5 py-0.5 rounded shadow-xs leading-none">
                AI
              </span>              {/* <span className="text-[10px] font-mono font-semibold text-brand-blue px-1.5 py-0.5 rounded bg-brand-bg border border-brand-border">
                v1.0-research
              </span> */}
            </div>
            <p className="text-xs text-brand-muted leading-relaxed max-w-md font-medium">
              A university computational chemistry research prototype integrating deep recurrent neural networks (PyTorch Character-level LSTM) with cheminformatics analysis (RDKit) and target virtual screening (AutoDock Vina).
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link to="/" className="hover:text-brand-blue transition-colors">
                  Overview & Methodology
                </Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-brand-blue transition-colors">
                  Molecular Generation Studio
                </Link>
              </li>
              <li>
                <a
                  href="https://www.rcsb.org/structure/1M17"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  EGFR Target PDB (1M17)
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Research Stack */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Scientific Pipeline
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-semibold">
              <span className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border text-brand-text">PyTorch LSTM</span>
              <span className="px-2 py-0.5 rounded bg-brand-mint border border-brand-border text-brand-teal">RDKit</span>
              <span className="px-2 py-0.5 rounded bg-brand-lavender border border-brand-border text-brand-violet">AutoDock Vina</span>
              <span className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border text-brand-text">Meeko</span>
              <span className="px-2 py-0.5 rounded bg-[#FEF5E7] border border-[#F2B84B] text-[#9A6008]">QED Metric</span>
            </div>
          </div>
        </div>

        {/* Scientific Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-[#FEF5E7] border border-[#F2B84B] flex items-start gap-3 text-xs leading-relaxed text-[#9A6008]">
          <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-[#7A4B06]">Academic & Research Prototype Notice:</strong> GenMol AI is an academic research prototype for in silico molecular generation. Generated molecular structures and predicted physicochemical properties are computational estimations and should not be construed as clinically validated therapeutics or confirmed pharmacological inhibitors. Experimental synthesis and biochemical assays are required for biological confirmation.
          </div>
        </div>

        {/* Copyright / Attribution */}
        <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-muted font-medium">
          <div>
            &copy; {new Date().getFullYear()} GenMol AI Research Project. All rights reserved.
          </div>
          <div className="font-mono text-[11px]">
            Target: EGFR (1M17) &bull; PyTorch + RDKit Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
