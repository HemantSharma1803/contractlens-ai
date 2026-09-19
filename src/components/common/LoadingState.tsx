import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  step?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Preparing contract workspace...",
  subtitle = "Structuring legal terms and synchronizing evidence citations",
  step
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center bg-[#0d121f]/50 border border-slate-800/80 rounded-xl my-4">
      <div className="relative mb-5">
        <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">{subtitle}</p>
      {step && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          {step}
        </div>
      )}
    </div>
  );
};
