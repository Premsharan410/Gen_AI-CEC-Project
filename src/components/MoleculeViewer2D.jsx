import React, { useState } from 'react';
import { FileCode2 } from 'lucide-react';

/**
 * Renders 2D chemical structure diagrams.
 * High-contrast, crisp presentation on light backgrounds.
 */
export default function MoleculeViewer2D({ 
  structureImage, 
  svgStructure, 
  smiles, 
  candidateId,
  className = "h-44",
  interactive = false 
}) {
  const [imgError, setImgError] = useState(false);

  // 1. Direct RDKit Image (base64 or URL)
  if (structureImage && !imgError) {
    const src = structureImage.startsWith('data:') 
      ? structureImage 
      : `data:image/png;base64,${structureImage}`;
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-lg bg-white border border-brand-border overflow-hidden ${className}`}>
        <img 
          src={src} 
          alt={`2D structure of ${candidateId || 'candidate molecule'}`}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain"
        />
        <span className="absolute bottom-1 right-2 text-[10px] font-mono font-medium text-brand-muted bg-brand-bg px-1.5 py-0.5 rounded border border-brand-border">
          RDKit 2D
        </span>
      </div>
    );
  }

  // 2. High-fidelity SVG structure
  if (svgStructure) {
    return (
      <div 
        className={`relative flex items-center justify-center p-3 rounded-lg bg-white border border-brand-border overflow-hidden group ${className}`}
      >
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          dangerouslySetInnerHTML={{ __html: svgStructure }}
        />
        <div className="absolute top-1 right-2 text-[10px] font-mono font-medium text-brand-blue bg-brand-blue/5 border border-brand-blue/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          2D Vector Structure
        </div>
      </div>
    );
  }

  // 3. Fallback representation when image is not yet rendered by backend
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 rounded-lg bg-brand-bg border border-dashed border-brand-border text-brand-muted ${className}`}>
      <div className="w-12 h-12 mb-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
        <FileCode2 className="w-6 h-6" />
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-brand-text">
          Structure unavailable
        </div>
        <div className="text-[11px] text-brand-muted font-mono mt-0.5 max-w-[200px] truncate" title={smiles}>
          {smiles || 'No SMILES provided'}
        </div>
        <div className="text-[10px] text-brand-blue font-medium mt-1">
          RDKit 2D render queued in backend
        </div>
      </div>
    </div>
  );
}
