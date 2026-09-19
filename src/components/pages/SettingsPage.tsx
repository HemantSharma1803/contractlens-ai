import React from 'react';
import { ShieldCheck, Database, Download, Trash2, RefreshCw, Key, Info, CheckCircle2 } from 'lucide-react';
import { useContract } from '../../context/ContractContext';

export const SettingsPage: React.FC = () => {
  const { 
    isDemoMode, 
    loadDemoWorkspace, 
    loadEmptyWorkspace, 
    contracts 
  } = useContract();

  const handleExportAll = () => {
    const data = {
      exportDate: new Date().toISOString(),
      system: 'ContractLens AI Command Center',
      version: '1.0.0-segment1',
      contracts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contractlens-portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">Workspace & Privacy Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Data residency controls, local workspace management, and privacy-first intelligence architecture
        </p>
      </div>

      {/* 1. Privacy-First Architecture Panel */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Privacy-First Workspace Architecture</h3>
            <span className="text-[11px] text-slate-400">Strict local execution boundaries</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong className="text-cyan-300">Privacy Guarantee:</strong> Documents remain in your workspace memory unless you explicitly enable an external AI processing provider. No document text or metadata is transferred to third-party advertising or public training engines.
          </p>
          <p className="text-slate-400">
            ContractLens AI assists human decision-makers with evidence verification and does not replace qualified legal professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Local Sandbox Execution</span>
            <p className="text-slate-400 text-[11px]">All indexing, search, filtering, and parsing runs locally in the client browser sandbox.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Zero Analytics Tracking</span>
            <p className="text-slate-400 text-[11px]">Telemetry, behavioral cookies, and third-party trackers are explicitly excluded by architecture.</p>
          </div>
        </div>
      </div>

      {/* 2. Workspace State Management */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Workspace State & Demo Environment</h3>
            <span className="text-[11px] text-slate-400">Switch between demo contracts and a clean repository</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">Current Environment:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {isDemoMode ? 'DEMO WORKSPACE' : 'LOCAL WORKSPACE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Currently holding <strong className="text-slate-300">{contracts.length}</strong> active contract records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <button
                onClick={loadEmptyWorkspace}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                Clear to Empty Workspace
              </button>
            ) : (
              <button
                onClick={loadDemoWorkspace}
                className="px-3.5 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-medium transition-colors"
              >
                Load Demo Contracts
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Portfolio Data Export */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Download className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Export Structured Portfolio Data</h3>
            <span className="text-[11px] text-slate-400">Download complete schema and citations in JSON</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 max-w-md">
            Export all contracts, parsed clauses, verbatim evidence citations, obligations, and risk flags for archival or compliance audits.
          </p>

          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-900/80 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
