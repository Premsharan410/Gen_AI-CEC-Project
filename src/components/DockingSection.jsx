import React from 'react';
import { Target, Info, ExternalLink } from 'lucide-react';

export default function DockingSection({ dockedMolecules = [] }) {
  const hasDockedCandidates = dockedMolecules.length > 0;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-mint text-brand-teal border border-brand-teal/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-text flex items-center gap-2">
              Virtual Screening Module (EGFR Target)
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-mint text-brand-teal border border-brand-teal/20">
                AutoDock Vina &bull; Meeko
              </span>
            </h3>
            <p className="text-xs text-brand-muted">
              Downstream computational docking against Epidermal Growth Factor Receptor kinase domain.
            </p>
          </div>
        </div>

        {/* Protein Target Pill */}
        <div className="flex items-center gap-2 text-xs bg-brand-bg px-3 py-1.5 rounded-lg border border-brand-border self-start sm:self-auto">
          <span className="text-brand-muted font-medium">PDB Reference:</span>
          <a 
            href="https://www.rcsb.org/structure/1M17" 
            target="_blank" 
            rel="noreferrer"
            className="font-mono font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            1M17
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <span className="text-brand-border">|</span>
          <span className="text-brand-muted font-medium">Res: 2.6 Å</span>
        </div>
      </div>

      {/* Pipeline Distinction Note */}
      <div className="p-3.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-muted flex items-start gap-2.5">
        <Info className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="leading-relaxed">
            <strong className="text-brand-text">Methodology Note:</strong> Molecular generation by the LSTM is intentionally decoupled from docking. Docking is an independent downstream verification filter that prepares ligands using Meeko and performs grid searches with AutoDock Vina.
          </p>
          <p className="text-[11px] text-brand-muted">
            Normal generation does not trigger docking automatically. Virtual screening is performed selectively on prioritized candidates to conserve compute cycles.
          </p>
        </div>
      </div>

      {/* Docking Results Table */}
      {hasDockedCandidates ? (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
            Screened Candidate Affinities
          </div>
          <div className="overflow-x-auto rounded-lg border border-brand-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-brand-text border-b border-brand-border font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Candidate ID</th>
                  <th className="py-2.5 px-3 font-bold">Target Protein</th>
                  <th className="py-2.5 px-3 font-bold">Binding Affinity (Vina)</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border font-mono bg-white">
                {dockedMolecules.map((m) => (
                  <tr key={m.candidate_id} className="hover:bg-brand-bg/50">
                    <td className="py-2.5 px-3 font-bold text-brand-blue">{m.candidate_id}</td>
                    <td className="py-2.5 px-3 text-brand-text font-medium">EGFR (PDB: 1M17)</td>
                    <td className="py-2.5 px-3 font-bold text-brand-teal">
                      {m.docking_score !== undefined && m.docking_score !== null 
                        ? `${m.docking_score} kcal/mol` 
                        : 'Pending'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F6ED] text-[#137A43] border border-[#7AD0A4]">
                        {m.docking_status || 'Computed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-brand-bg/60 border border-dashed border-brand-border text-center text-xs text-brand-muted space-y-1">
          <div className="font-medium text-brand-text">No candidates currently queued for AutoDock Vina screening.</div>
          <div className="text-[11px]">
            Generate candidates above, then select high-QED compounds to evaluate target binding affinities.
          </div>
        </div>
      )}
    </div>
  );
}
