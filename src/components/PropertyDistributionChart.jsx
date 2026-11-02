import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, CartesianGrid 
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon } from 'lucide-react';

export default function PropertyDistributionChart({ molecules = [] }) {
  if (!molecules || molecules.length === 0) return null;

  // Prepare data for QED Distribution
  const qedBins = [
    { range: '0.0-0.3', count: 0, label: '< 0.3' },
    { range: '0.3-0.5', count: 0, label: '0.3-0.5' },
    { range: '0.5-0.7', count: 0, label: '0.5-0.7' },
    { range: '0.7-0.9', count: 0, label: '0.7-0.9' },
    { range: '0.9-1.0', count: 0, label: '> 0.9' },
  ];

  molecules.forEach(m => {
    const q = m.qed || 0;
    if (q < 0.3) qedBins[0].count++;
    else if (q < 0.5) qedBins[1].count++;
    else if (q < 0.7) qedBins[2].count++;
    else if (q < 0.9) qedBins[3].count++;
    else qedBins[4].count++;
  });

  // Scatter data (MW vs logP)
  const scatterData = molecules.map(m => ({
    name: m.candidate_id,
    mw: Number((m.molecular_weight || 0).toFixed(1)),
    logp: Number((m.logP || 0).toFixed(2)),
    qed: Number((m.qed || 0).toFixed(2)),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* QED Histogram */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text">
            <BarChart3 className="w-4 h-4 text-brand-blue" />
            <span>Drug-Likeness (QED) Distribution</span>
          </div>
          <span className="text-[11px] text-brand-muted font-mono font-semibold">N = {molecules.length}</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qedBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF5FA" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#526477', fontSize: 11, fontWeight: 500 }} stroke="#CBD8E5" />
              <YAxis allowDecimals={false} tick={{ fill: '#526477', fontSize: 11, fontWeight: 500 }} stroke="#CBD8E5" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#CBD8E5', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  color: '#24313D',
                  boxShadow: '0 4px 12px rgba(36,49,61,0.08)'
                }} 
              />
              <Bar dataKey="count" fill="#2864DC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MW vs logP Chemical Space */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text">
            <ScatterIcon className="w-4 h-4 text-brand-teal" />
            <span>Chemical Space (MW vs logP)</span>
          </div>
          <span className="text-[11px] text-brand-teal font-mono font-semibold bg-brand-mint px-2 py-0.5 rounded border border-brand-teal/20">
            Lipinski Window
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF5FA" />
              <XAxis 
                type="number" 
                dataKey="mw" 
                name="Mol. Weight" 
                unit=" g/mol" 
                tick={{ fill: '#526477', fontSize: 11, fontWeight: 500 }} 
                stroke="#CBD8E5" 
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="logp" 
                name="logP" 
                tick={{ fill: '#526477', fontSize: 11, fontWeight: 500 }} 
                stroke="#CBD8E5" 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#CBD8E5', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  color: '#24313D',
                  boxShadow: '0 4px 12px rgba(36,49,61,0.08)'
                }} 
              />
              <Scatter name="Molecules" data={scatterData} fill="#168A83" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
