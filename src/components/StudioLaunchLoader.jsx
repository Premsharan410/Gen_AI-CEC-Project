import React, { useEffect, useState } from 'react';
import { Atom, Sparkles } from 'lucide-react';

/**
 * Branded 1.2–1.6s loading transition when opening the Research Studio from the homepage.
 * Features a light, colorful scientific aesthetic, animated molecular assembly,
 * and smooth progress feedback.
 */
export default function StudioLaunchLoader({ isOpen }) {
  const [stepText, setStepText] = useState('Setting up computational workspace...');
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setStepText('Setting up computational workspace...');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(100);
      setStepText('Workspace ready.');
      return;
    }

    // Step sequence across 1.4 seconds
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStepText('Loading molecular inspection canvas & chemical filters...');
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(90);
      setStepText('Preparing virtual screening environment...');
    }, 950);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepText('Opening Molecular Studio...');
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#EEF5FA]/90 backdrop-blur-md animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-full max-w-md bg-white border border-[#CBD8E5] rounded-3xl p-8 shadow-2xl overflow-hidden text-center space-y-6">
        {/* Subtle Background Geometric Lattice */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="loader-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2864DC" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loader-grid)" />
          </svg>
        </div>

        {/* Animated Molecular Structure Assembly */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Pulsing orbital rings */}
          <div className="absolute inset-0 rounded-full border border-brand-blue/30 animate-ping opacity-30" />
          <div className="absolute -inset-2 rounded-full border border-brand-teal/20 animate-pulse" />

          {/* SVG Animated Molecular Hexagonal Ring Assembly */}
          <svg 
            viewBox="0 0 80 80" 
            className="w-20 h-20 shrink-0" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hexagonal chemical bond paths */}
            <polygon 
              points="40,12 65,26 65,54 40,68 15,54 15,26" 
              stroke="#2864DC" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
              className="stroke-dash-animation opacity-90"
              style={{
                strokeDasharray: '200',
                animation: 'dashDraw 1.4s ease-in-out infinite'
              }}
            />
            {/* Internal delocalized resonance circle */}
            <circle 
              cx="40" 
              cy="40" 
              r="14" 
              stroke="#168A83" 
              strokeWidth="2" 
              strokeDasharray="4 3" 
              className="animate-spin"
              style={{ animationDuration: '6s' }}
            />
            {/* Atom Nodes */}
            <circle cx="40" cy="12" r="4.5" fill="#168A83" />
            <circle cx="65" cy="26" r="4" fill="#2864DC" />
            <circle cx="65" cy="54" r="4" fill="#7961D9" />
            <circle cx="40" cy="68" r="4.5" fill="#168A83" />
            <circle cx="15" cy="54" r="4" fill="#2864DC" />
            <circle cx="15" cy="26" r="4" fill="#E9AE47" />
            {/* Center Core */}
            <circle cx="40" cy="40" r="4.5" fill="#2864DC" />
          </svg>
        </div>

        {/* Status Text & Typography */}
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE5FC] text-brand-violet text-[11px] font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3 text-brand-violet" />
            <span>GENMOL AI WORKSPACE</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#24313D] tracking-tight">
            Preparing Molecular Studio
          </h3>
          <p className="text-xs text-[#526477] font-medium leading-relaxed">
            Initializing your research workspace
          </p>
        </div>

        {/* Scientific Progress Bar (Blue-to-Teal) */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="w-full h-2 rounded-full bg-[#EEF5FA] border border-[#CBD8E5] overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-teal to-brand-violet transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#526477]">
            <span className="truncate max-w-[280px]">{stepText}</span>
            <span className="font-bold text-brand-blue">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

