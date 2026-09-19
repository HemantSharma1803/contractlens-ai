import React from 'react';
import { CheckCircle2, Loader2, FileSearch, ShieldCheck, Binary, BookOpen, AlertCircle, FileCheck2, Cpu } from 'lucide-react';
import { useContract } from '../../context/ContractContext';

const INGESTION_STAGES = [
  { id: 'VALIDATING', label: 'File Validation & Integrity', desc: 'MIME check & SHA-256 cryptographic fingerprinting', icon: ShieldCheck },
  { id: 'READING_FILE', label: 'Document Layout & Pages', desc: 'Reading binary stream and extracting clean textual layout', icon: BookOpen },
  { id: 'EXTRACTING_TEXT', label: 'Structure & Metadata', desc: 'Mapping parties, jurisdiction, effective dates, and TCV', icon: Binary },
  { id: 'PARSING_STRUCTURE', label: 'Clause & Risk Parsing', desc: 'Identifying liability caps, indemnities, renewals & obligations', icon: FileSearch },
  { id: 'INDEXING_SEARCH', label: 'Text & Clause Indexing', desc: 'Building full-text search index and section boundaries', icon: Cpu },
  { id: 'GROUNDING_EVIDENCE', label: 'Evidence Citation Map', desc: 'Anchoring exact verbatim snippets to source page citations', icon: FileCheck2 },
];

export const ProcessingModal: React.FC = () => {
  const { isProcessing, processingProgress, processingStage, ingestionProgress } = useContract();

  if (!isProcessing) return null;

  const currentStageName = ingestionProgress?.stage || 'READING_FILE';
  const stageOrder = ['VALIDATING', 'READING_FILE', 'EXTRACTING_TEXT', 'PARSING_STRUCTURE', 'INDEXING_SEARCH', 'GROUNDING_EVIDENCE', 'READY'];
  const currentStageIndex = stageOrder.indexOf(currentStageName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-[#0e1320] border border-cyan-900/50 rounded-xl shadow-2xl p-6 relative overflow-hidden"
        role="status"
        aria-live="polite"
      >
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-500"></div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-inner">
            {ingestionProgress?.stage === 'ERROR' ? (
              <AlertCircle className="w-6 h-6 text-red-400" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            Contract Ingestion & Extraction Engine
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {processingStage}
          </p>
          {ingestionProgress?.fileName && (
            <p className="text-[11px] text-cyan-400/90 font-mono mt-1 truncate">
              {ingestionProgress.fileName}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 mb-6 overflow-hidden border border-slate-800">
          <div 
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              ingestionProgress?.stage === 'ERROR' ? 'bg-red-500' : 'bg-cyan-400'
            }`}
            style={{ width: `${processingProgress}%` }}
          />
        </div>

        {/* Stage List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {INGESTION_STAGES.map((stage, idx) => {
            const isDone = currentStageIndex > idx || processingProgress === 100;
            const isCurrent = currentStageIndex === idx && processingProgress < 100;
            const Icon = stage.icon;

            return (
              <div 
                key={stage.id}
                className={`flex items-start gap-3 p-2 rounded-lg text-xs transition-all ${
                  isCurrent 
                    ? 'bg-cyan-950/40 border border-cyan-800/60 text-cyan-200'
                    : isDone
                    ? 'bg-slate-900/40 text-slate-300'
                    : 'text-slate-500 opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold flex items-center justify-between">
                    <span className="truncate">{stage.label}</span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/80 text-cyan-300 shrink-0">
                        Processing
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[9px] font-mono text-emerald-400 shrink-0">
                        Done
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stage.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500">
            100% Client-side local parsing • Assisted human intelligence
          </p>
        </div>
      </div>
    </div>
  );
};
