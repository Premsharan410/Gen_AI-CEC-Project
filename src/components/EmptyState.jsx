import React from 'react';
import { 
  Sparkles, FilterX, WifiOff, Clock, AlertTriangle, 
  Settings, Search, ArrowRight 
} from 'lucide-react';

export default function EmptyState({ 
  type = 'initial', 
  errorMessage, 
  onAction, 
  onOpenSettings 
}) {
  switch (type) {
    case 'initial':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-brand-border rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              Ready to Generate Candidate Molecules
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Configure desired molecule count and physicochemical filters on the left panel, then initiate generation. Pre-computed samples run in Demo Mode; connect Google Colab for live PyTorch model inference.
            </p>
          </div>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover transition-colors shadow-xs cursor-pointer"
            >
              <span>Load Demo Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      );

    case 'no_filter_matches':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-border rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-[#FEF5E7] border border-[#F2B84B] text-[#D97706]">
            <FilterX className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              No Molecules Matched Filter Criteria
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              The generated candidates did not fall within your selected physicochemical thresholds (MW, logP, or QED).
            </p>
          </div>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#9A6008] bg-[#FEF5E7] hover:bg-[#FDF0D5] border border-[#F2B84B] transition-colors cursor-pointer"
            >
              Relax Property Filters
            </button>
          )}
        </div>
      );

    case 'no_molecules_returned':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-border rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-brand-bg border border-brand-border text-brand-muted">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              No Valid Molecules Returned
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              The backend was unable to generate valid chemical structures within the maximum sampling attempts.
            </p>
          </div>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover transition-colors shadow-xs cursor-pointer"
            >
              Retry Generation
            </button>
          )}
        </div>
      );

    case 'colab_disconnected':
    case 'connection_error':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#F8B4AB] rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-[#FDF0ED] border border-[#F8B4AB] text-[#DC2626]">
            <WifiOff className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              Google Colab Backend Disconnected
            </h3>
            <p className="text-xs text-[#B92A1D] leading-relaxed font-medium">
              {errorMessage || 'Unable to establish a connection with the temporary Colab FastAPI server.'}
            </p>
            <p className="text-[11px] text-brand-muted pt-1">
              Check if your Colab notebook is running and your ngrok / cloudflared tunnel is active.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-brand-text bg-white hover:bg-brand-bg border border-brand-border transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-brand-blue" />
                Configure Tunnel URL
              </button>
            )}
            {onAction && (
              <button
                type="button"
                onClick={onAction}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#9A6008] bg-[#FEF5E7] hover:bg-[#FDF0D5] border border-[#F2B84B] transition-colors cursor-pointer"
              >
                Switch to Demo Mode
              </button>
            )}
          </div>
        </div>
      );

    case 'timeout':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-border rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-[#FEF5E7] border border-[#F2B84B] text-[#D97706]">
            <Clock className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              Request Timed Out
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              The Colab runtime took longer than 45 seconds to generate and validate the candidate structures.
            </p>
          </div>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover transition-colors shadow-xs cursor-pointer"
            >
              Retry with Fewer Molecules
            </button>
          )}
        </div>
      );

    case 'invalid_response':
    default:
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#F8B4AB] rounded-xl text-center space-y-4 shadow-card">
          <div className="p-4 rounded-full bg-[#FDF0ED] border border-[#F8B4AB] text-[#DC2626]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-brand-text">
              Invalid API Response Format
            </h3>
            <p className="text-xs text-[#B92A1D] leading-relaxed font-medium">
              {errorMessage || 'The server returned data that does not conform to the expected GenMol AI response schema.'}
            </p>
          </div>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-brand-text bg-white hover:bg-brand-bg border border-brand-border transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      );
  }
}
