import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowUpRight, ArrowDown, FlaskConical, Target,
  Cpu, CheckCircle2, ChevronRight, Activity, ShieldAlert,
  Dna, BarChart3, Database, FileText
} from 'lucide-react';
import MolecularHero2D from '../components/MolecularHero2D';

/**
 * Coherent headline pairs cycling through all 4 user-specified phrases:
 * 1. Explore molecules.
 * 2. Discover possibilities.
 * 3. Investigate new structures.
 * 4. Explore chemical space.
 * 
 * Displays as natural, publication-grade sentences where the dynamic line
 * is highlighted in blue-teal gradient with a calm, breathing cursor.
 */
const CYCLING_HEADINGS = [
  { lead: "Explore molecules.", dynamic: "Discover possibilities." },
  { lead: "Designing molecules.", dynamic: "Investigate new structures." },
  { lead: "Learn new dynamics.", dynamic: "Explore chemical space." },
  { lead: "Discover possibilities.", dynamic: "Explore molecules." },
];

/**
 * AnimatedHeroHeading
 * 
 * Continuous, smooth character-by-character typing animation:
 * - Types character-by-character (~80ms).
 * - Pauses for ~1.0s upon completing the phrase.
 * - Deletes smoothly character-by-character (~40ms).
 * - Transitions to the next phrase with a 240ms inter-phrase pause.
 * - Cycles indefinitely while the homepage is visible.
 * - Pauses execution when tab is hidden/inactive via document.visibilityState.
 * - Full accessibility: screen readers hear a clean static heading via sr-only.
 * - Respects prefers-reduced-motion (shows full static heading instantly).
 * - Layout-stable: reserved vertical footprint prevents any surrounding content shift.
 */
function AnimatedHeroHeading() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check reduced-motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Listen for tab visibility changes so animation pauses in the background
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) {
      return;
    }

    const currentDynamic = CYCLING_HEADINGS[index].dynamic;

    // 1. Reached end of current phrase -> pause for 1 second before deleting
    if (!isDeleting && subIndex === currentDynamic.length) {
      const holdTimer = setTimeout(() => {
        setIsDeleting(true);
      }, 1000);
      return () => clearTimeout(holdTimer);
    }

    // 2. Fully deleted phrase -> pause briefly (240ms) then advance to next phrase
    if (isDeleting && subIndex === 0) {
      const nextTimer = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % CYCLING_HEADINGS.length);
      }, 240);
      return () => clearTimeout(nextTimer);
    }

    // 3. Smooth typing (80ms/char) or deleting (40ms/char)
    const speed = isDeleting ? 40 : 80;
    const charTimer = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(charTimer);
  }, [subIndex, isDeleting, index, isVisible, prefersReducedMotion]);

  const currentLead = CYCLING_HEADINGS[index].lead;
  const currentDynamic = CYCLING_HEADINGS[index].dynamic;
  const displayedText = prefersReducedMotion
    ? currentDynamic
    : currentDynamic.substring(0, subIndex);

  return (
    <h1
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#24313D] leading-[1.12] min-h-[2.4em] sm:min-h-[2.26em]"
      aria-label="Explore molecules. Discover possibilities."
    >
      {/* Screen reader accessible permanent text representation */}
      <span className="sr-only">
        {CYCLING_HEADINGS[0].lead} {CYCLING_HEADINGS[0].dynamic}
      </span>

      {/* Visual continuously animated typing representation */}
      <span aria-hidden="true">
        <span>{currentLead}</span>
        <br className="hidden sm:inline" />
        {' '}
        <span className="bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
          {displayedText}
        </span>
        {!prefersReducedMotion && (
          <span className="inline-block w-[3.5px] h-[0.84em] ml-1.5 bg-brand-teal align-middle animate-cursor-blink rounded-xs" />
        )}
      </span>
    </h1>
  );
}

export default function Home({ onOpenSettings, onLaunchStudio }) {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 md:pt-16 pb-16 bg-gradient-to-b from-[#EEF5FA] via-[#EEF5FA] to-[#EDE9FA]/35 border-b border-[#D5E0E9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography, Eyebrow, and Call-to-actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow Label with Subtle Colored Dot */}
              {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D5E0E9] shadow-xs text-xs font-mono font-bold text-[#24313D]">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                <span className="tracking-wider">MOLECULAR DISCOVERY &bull; COMPUTATIONAL CHEMISTRY</span>
              </div> */}

              {/* Main Heading with Polished Typing Cursor Animation */}
              <AnimatedHeroHeading />

              {/* Supporting Description — Concise & Factual */}
              <p className="text-base sm:text-lg text-[#526477] font-normal leading-relaxed max-w-xl">
                Generate molecular candidates with an LSTM model, validate structures using RDKit, and explore their physicochemical properties.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/generate"
                  onClick={(e) => {
                    if (onLaunchStudio) {
                      e.preventDefault();
                      onLaunchStudio();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-hover active:scale-[0.98] transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Start Generating</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <a
                  href="#methodology"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[#24313D] bg-white hover:bg-[#EEF5FA] border border-[#D5E0E9] shadow-xs active:scale-[0.98] transition-colors cursor-pointer"
                >
                  <span>Explore the Method</span>
                  <ArrowDown className="w-4 h-4 text-brand-blue" />
                </a>
              </div>

              {/* Compact Technical Credibility Line */}
              <div className="pt-3 border-t border-[#D5E0E9] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono font-medium text-[#526477]">
                <span className="text-[#24313D] font-bold">PyTorch LSTM</span>
                <span className="text-[#D5E0E9]">&bull;</span>
                <span className="text-[#24313D] font-bold">RDKit</span>
                <span className="text-[#D5E0E9]">&bull;</span>
                <span className="text-[#24313D] font-bold">AutoDock Vina</span>
                {/* <span className="text-[#D5E0E9]">&bull;</span> */}
                {/* <span className="text-brand-teal font-semibold">EGFR (1M17)</span> */}
              </div>
            </div>

            {/* Right Column: Refined 2D Molecular Hero Visualization */}
            <div className="lg:col-span-6 relative">
              <MolecularHero2D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESEARCH STATISTICS STRIP (TRANSITION INTO 4 FACTUAL METRICS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
          <div>
            <div className="text-xs font-mono font-bold text-brand-blue tracking-wider uppercase flex items-center gap-1.5">
              <span>RESEARCH DATASET &amp; EXPERIMENTAL METRICS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#24313D] mt-0.5">
              Reported Experimental Results
            </h2>
          </div>
          <p className="text-xs text-[#526477] font-medium max-w-md sm:text-right">
            Reported empirical results from the trained molecular generator and virtual screening experiment. Does not represent live session counts.
          </p>
        </div>

        {/* 4 Factual Metrics: Blue, Mint, Lavender, and White Surfaces */}
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl sm:rounded-3xl border border-[#D5E0E9] bg-white shadow-card overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[#D5E0E9]">
          {/* Metric 1: Pale Blue Surface */}
          <div className="p-6 sm:p-7 bg-[#EEF5FA] flex flex-col justify-between space-y-3 transition-colors hover:bg-[#EEF5FA]/80">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E50B5]">
              Source Dataset
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#24313D] tracking-tight">
                249,455
              </div>
              <div className="text-xs font-bold text-[#24313D] mt-1">
                Source dataset molecules
              </div>
            </div>
            <p className="text-[11px] text-[#526477] leading-relaxed">
              ZINC-derived drug-like SMILES collection filtered and audited for sequence modeling.
            </p>
          </div>

          {/* Metric 2: Soft Mint Surface */}
          <div className="p-6 sm:p-7 bg-[#E2F3E9] flex flex-col justify-between space-y-3 transition-colors hover:bg-[#E2F3E9]/80">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#168A83]">
              Training Cohort
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#24313D] tracking-tight">
                30,000
              </div>
              <div className="text-xs font-bold text-[#24313D] mt-1">
                Molecules used for training
              </div>
            </div>
            <p className="text-[11px] text-[#526477] leading-relaxed">
              Balanced sequence batch utilized for character-level recurrent LSTM optimization.
            </p>
          </div>

          {/* Metric 3: Soft Lavender Surface */}
          <div className="p-6 sm:p-7 bg-[#EDE9FA] flex flex-col justify-between space-y-3 transition-colors hover:bg-[#EDE9FA]/80">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7961D9]">
              Chemical Validity
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#24313D] tracking-tight">
                647
              </div>
              <div className="text-xs font-bold text-[#24313D] mt-1">
                Unique valid molecules reported
              </div>
            </div>
            <p className="text-[11px] text-[#526477] leading-relaxed">
              Fully validated by RDKit sanitization with 100% structural novelty against training set.
            </p>
          </div>

          {/* Metric 4: Crisp White Surface */}
          <div className="p-6 sm:p-7 bg-white flex flex-col justify-between space-y-3 transition-colors hover:bg-[#EEF5FA]/40">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A6008]">
              Virtual Screening
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#24313D] tracking-tight">
                20
              </div>
              <div className="text-xs font-bold text-[#24313D] mt-1">
                Candidates evaluated through docking
              </div>
            </div>
            <p className="text-[11px] text-[#526477] leading-relaxed">
              Targeted against EGFR ATP domain (PDB: 1M17) using AutoDock Vina &amp; Meeko.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RESEARCH CAPABILITIES */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold text-brand-blue tracking-wider uppercase">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Three Core Computational Pillars
          </h2>
          <p className="text-base text-brand-muted">
            Engineered to bridge neural sequence modeling, cheminformatics filtering, and structural biology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Molecular Generation */}
          <div className="bg-white border border-[#D5E0E9] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">
                AI Molecular Generation
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed font-medium">
                The trained character-level LSTM neural network models the conditional syntax of molecular SMILES strings. By autoregressively sampling character probabilities, the model navigates chemical space to propose new molecules.
              </p>
            </div>
            <div className="pt-4 border-t border-[#D5E0E9] text-xs font-mono font-bold text-brand-blue flex items-center gap-1.5">
              <span>PyTorch RNN Architecture</span>
            </div>
          </div>

          {/* Card 2: Molecular Property Analysis */}
          <div className="bg-white border border-[#D5E0E9] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-mint border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">
                Molecular Property Analysis
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed font-medium">
                Every generated sequence undergoes valence verification and RDKit sanitization. The pipeline computes Lipinski Rule of 5 parameters, partition coefficient (logP), QED drug-likeness, and polar surface area (TPSA).
              </p>
            </div>
            <div className="pt-4 border-t border-[#D5E0E9] text-xs font-mono font-bold text-brand-teal flex items-center gap-1.5">
              <span>RDKit Descriptors &amp; QED</span>
            </div>
          </div>

          {/* Card 3: Virtual Screening */}
          <div className="bg-white border border-[#D5E0E9] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-lavender border border-brand-violet/20 flex items-center justify-center text-brand-violet">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">
                Virtual Screening
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed font-medium">
                Promising filtered molecules can be queued for docking against the target protein EGFR (Epidermal Growth Factor Receptor, PDB: 1M17). AutoDock Vina and Meeko calculate binding poses and predicted binding free energy (&Delta;G in kcal/mol).
              </p>
            </div>
            <div className="pt-4 border-t border-[#D5E0E9] text-xs font-mono font-bold text-brand-violet flex items-center gap-1.5">
              <span>AutoDock Vina &bull; PDB 1M17</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY (CONNECTED TIMELINE / EDITORIAL WORKFLOW) */}
      <section id="methodology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold text-brand-blue tracking-wider uppercase">
            Scientific Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Five-Stage Generation &amp; Screening Process
          </h2>
          <p className="text-base text-brand-muted">
            A structured workflow ensuring syntactically valid SMILES, drug-likeness compliance, and targeted in silico screening.
          </p>
        </div>

        {/* 5 Connected Stages (Connected Timeline Workflow) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-[#D5E0E9] z-0" />

          {/* 01 — Dataset preparation */}
          <div className="relative z-10 bg-white border border-[#D5E0E9] rounded-2xl p-5 shadow-card space-y-3 transition-transform hover:-translate-y-0.5 duration-150">
            <div className="w-9 h-9 rounded-full bg-brand-blue text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              01
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue">Stage 01</div>
            <h4 className="text-sm font-bold text-brand-text">Dataset preparation</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Curation and tokenization of 249,455 drug-like SMILES from ZINC, filtered into an audited canonical training vocabulary.
            </p>
          </div>

          {/* 02 — LSTM sequence learning */}
          <div className="relative z-10 bg-[#E2F3E9] border border-[#D5E0E9] rounded-2xl p-5 shadow-card space-y-3 transition-transform hover:-translate-y-0.5 duration-150">
            <div className="w-9 h-9 rounded-full bg-brand-teal text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              02
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-teal">Stage 02</div>
            <h4 className="text-sm font-bold text-brand-text">LSTM sequence learning</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Character-level recurrent neural network trained on 30,000 sequence batches to capture chemical syntax and valency rules.
            </p>
          </div>

          {/* 03 — SMILES generation and RDKit validation */}
          <div className="relative z-10 bg-white border border-[#D5E0E9] rounded-2xl p-5 shadow-card space-y-3 transition-transform hover:-translate-y-0.5 duration-150">
            <div className="w-9 h-9 rounded-full bg-brand-blue text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              03
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue">Stage 03</div>
            <h4 className="text-sm font-bold text-brand-text">SMILES generation &amp; RDKit validation</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Autoregressive sampling of candidate SMILES, followed by RDKit valence sanitization and topological graph verification.
            </p>
          </div>

          {/* 04 — Physicochemical filtering */}
          <div className="relative z-10 bg-[#EDE9FA] border border-[#D5E0E9] rounded-2xl p-5 shadow-card space-y-3 transition-transform hover:-translate-y-0.5 duration-150">
            <div className="w-9 h-9 rounded-full bg-brand-violet text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              04
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-violet">Stage 04</div>
            <h4 className="text-sm font-bold text-brand-text">Physicochemical filtering</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Multi-parameter screening across Lipinski Rule of 5 (MW, logP, HBD, HBA) and quantitative drug-likeness (QED &ge; 0.5).
            </p>
          </div>

          {/* 05 — Optional docking evaluation */}
          <div className="relative z-10 bg-white border border-[#D5E0E9] rounded-2xl p-5 shadow-card space-y-3 transition-transform hover:-translate-y-0.5 duration-150">
            <div className="w-9 h-9 rounded-full bg-[#D97706] text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              05
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A6008]">Stage 05</div>
            <h4 className="text-sm font-bold text-brand-text">Optional docking evaluation</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Targeted virtual screening against the EGFR kinase ATP pocket (PDB: 1M17) using AutoDock Vina and Meeko for binding affinity estimation.
            </p>
          </div>
        </div>

        {/* Workflow Clarification Callout */}
        <div className="p-4 rounded-xl bg-white border border-[#D5E0E9] flex items-start gap-3 text-xs text-brand-muted shadow-card">
          <Activity className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <strong className="text-brand-text font-bold">Decoupled Execution Architecture:</strong> Molecular generation (Stages 01–04) runs independently from 3D molecular docking (Stage 05). Virtual screening requires conformational searches and is reserved as an optional downstream step.
          </div>
        </div>
      </section>

      {/* 5. TECHNOLOGY & RESEARCH LIMITATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold text-brand-blue tracking-wider uppercase">
            Technical Framework
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Research Technologies &amp; Limitations
          </h2>
        </div>

        {/* Technology Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: 'PyTorch', desc: 'Deep Learning', bg: 'bg-[#EEF5FA] text-brand-blue border-[#D5E0E9]' },
            { name: 'LSTM', desc: 'Character RNN', bg: 'bg-[#EEF5FA] text-brand-blue border-[#D5E0E9]' },
            { name: 'RDKit', desc: 'Cheminformatics', bg: 'bg-[#E2F3E9] text-brand-teal border-[#D5E0E9]' },
            { name: 'SMILES', desc: 'Chemical Syntax', bg: 'bg-white text-brand-text border-[#D5E0E9]' },
            { name: 'QED', desc: 'Drug-Likeness', bg: 'bg-[#FEF5E7] text-[#9A6008] border-[#F2B84B]/60' },
            { name: 'AutoDock Vina', desc: 'Docking Engine', bg: 'bg-[#EDE9FA] text-brand-violet border-[#D5E0E9]' },
            { name: 'Meeko', desc: 'Ligand Prep', bg: 'bg-[#EDE9FA] text-brand-violet border-[#D5E0E9]' },
            { name: 'EGFR (1M17)', desc: 'Kinase Target', bg: 'bg-[#E2F3E9] text-brand-teal border-[#D5E0E9]' },
          ].map((tech) => (
            <div
              key={tech.name}
              className={`p-3.5 rounded-xl border shadow-xs text-center ${tech.bg}`}
            >
              <div className="text-xs font-mono font-bold">{tech.name}</div>
              <div className="text-[10px] text-brand-muted mt-0.5 font-medium">{tech.desc}</div>
            </div>
          ))}
        </div>

        {/* Pale Amber Research Limitations Panel */}
        <div className="p-5 rounded-2xl bg-[#FEF5E7] border border-[#F2B84B] text-xs text-[#9A6008] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-[#7A4B06]">
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#D97706]" />
            Computational Research Prototype Limitations
          </div>
          <p className="leading-relaxed font-medium">
            GenMol AI operates as an in silico generative prototype. All returned chemical structures, calculated physicochemical metrics (MW, logP, QED), and docking binding affinities are computational estimates. They do not constitute confirmed biological activity, clinical validation, or confirmed synthesis pathways. Wet-lab biochemical assays are required for experimental confirmation.
          </p>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#E2F3E9]/80 via-white to-[#EDE9FA]/80 border border-[#D5E0E9] p-8 sm:p-10 shadow-card">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
              Academic Demonstration
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              Launch the Molecular Generation Studio
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed font-medium">
              Test customized candidate counts, inspect high-contrast 2D structures, filter by Lipinski thresholds, and export results directly to CSV.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/generate"
                onClick={(e) => {
                  if (onLaunchStudio) {
                    e.preventDefault();
                    onLaunchStudio();
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover transition-colors shadow-xs cursor-pointer"
              >
                <span>Launch Studio Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-xs font-semibold text-brand-text hover:text-brand-blue transition-colors cursor-pointer"
              >
                Configure Colab Connection
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
