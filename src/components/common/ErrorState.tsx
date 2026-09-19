import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onReturnDashboard?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while accessing the contract workspace. Primary document data remains safe in memory.",
  onRetry,
  onReturnDashboard,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#130f16]/60 border border-rose-900/40 rounded-xl my-6">
      <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-6 h-6 text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            Retry
          </button>
        )}
        {onReturnDashboard && (
          <button
            onClick={onReturnDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
