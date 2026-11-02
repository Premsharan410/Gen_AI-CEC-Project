import React from 'react';
import { Atom } from 'lucide-react';

export default function LoadingState({ stepMessage }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-border rounded-xl shadow-card text-center space-y-6">
      {/* Animated Chemical Orbital Spinner */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer Orbit */}
        <div className="absolute inset-0 rounded-full border border-brand-blue/30 animate-spin" style={{ animationDuration: '6s' }}>
          <div className="w-3 h-3 rounded-full bg-brand-blue absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-xs" />
        </div>
        {/* Middle Orbit */}
        <div className="absolute inset-2 rounded-full border border-brand-teal/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-brand-teal absolute top-1/2 -right-1.5 -translate-y-1/2 shadow-xs" />
        </div>
        {/* Core Nucleus */}
        <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center">
          <Atom className="w-4 h-4 text-brand-blue animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-base font-bold text-brand-text">
          Executing Molecular Generation Pipeline
        </h3>
        <p className="text-xs font-mono font-semibold text-brand-blue bg-brand-bg px-3.5 py-2 rounded-lg border border-brand-border animate-pulse">
          {stepMessage || 'Generating and validating candidate structures...'}
        </p>
        <p className="text-xs text-brand-muted leading-relaxed pt-1 font-medium">
          The character-level LSTM is sampling token probabilities to construct valid SMILES sequences, followed by valence sanitization and property calculation using RDKit.
        </p>
      </div>

      {/* Pipeline Status Indicator bar */}
      <div className="w-64 h-1.5 bg-[#E1EDF7] rounded-full overflow-hidden border border-brand-border">
        <div className="h-full bg-gradient-to-r from-brand-blue via-brand-teal to-brand-blue w-1/2 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
