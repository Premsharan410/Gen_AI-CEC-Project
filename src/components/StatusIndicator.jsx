import React from 'react';
import { Wifi, WifiOff, Loader2, Sparkles } from 'lucide-react';
import { RUNTIME_STATUS } from '../config/appConfig';

/**
 * Status indicator reflecting exact runtime states:
 * - Demo Mode
 * - Connecting
 * - Colab Connected
 * - Generating
 * - Connection Error
 */
export default function StatusIndicator({ status, onOpenSettings, compact = false }) {
  const getStatusConfig = () => {
    switch (status) {
      case RUNTIME_STATUS.CONNECTED:
        return {
          icon: Wifi,
          badgeColor: 'bg-[#E8F6ED] text-[#137A43] border-[#7AD0A4] shadow-xs',
          dotColor: 'bg-[#168A83]',
          label: 'Colab Connected',
          tooltip: 'Google Colab PyTorch runtime is active & responsive',
        };
      case RUNTIME_STATUS.CONNECTING:
        return {
          icon: Loader2,
          badgeColor: 'bg-[#E8F2FC] text-[#1E50B5] border-[#A8CCF4] shadow-xs',
          dotColor: 'bg-[#2864DC] animate-ping',
          label: 'Connecting...',
          tooltip: 'Pinging Colab health endpoint (GET /health)',
          spin: true,
        };
      case RUNTIME_STATUS.GENERATING:
        return {
          icon: Loader2,
          badgeColor: 'bg-[#EEF4FF] text-[#2864DC] border-[#B8D3FE] shadow-xs',
          dotColor: 'bg-[#2864DC]',
          label: 'Generating Candidates',
          tooltip: 'Model computation in progress',
          spin: true,
        };
      case RUNTIME_STATUS.ERROR:
        return {
          icon: WifiOff,
          badgeColor: 'bg-[#FDF0ED] text-[#B92A1D] border-[#F8B4AB] shadow-xs',
          dotColor: 'bg-[#DC2626]',
          label: 'Connection Error',
          tooltip: 'Colab runtime unreachable. Click to check settings',
        };
      case RUNTIME_STATUS.DEMO:
      default:
        return {
          icon: Sparkles,
          badgeColor: 'bg-[#FEF5E7] text-[#9A6008] border-[#F2B84B] shadow-xs',
          dotColor: 'bg-[#D97706]',
          label: 'Demo Mode',
          tooltip: 'Displaying pre-computed LSTM research samples. Click to connect Colab',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <button
      onClick={onOpenSettings}
      type="button"
      title={`${config.label} — ${config.tooltip}`}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:opacity-95 active:scale-95 cursor-pointer ${config.badgeColor}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`} />
      </span>
      {!compact && (
        <span className="tracking-wide">
          {config.label}
        </span>
      )}
      {config.spin ? (
        <Icon className="w-3 h-3 animate-spin ml-0.5 opacity-90" />
      ) : (
        <Icon className="w-3 h-3 ml-0.5 opacity-75" />
      )}
    </button>
  );
}
