import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Shield, 
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ClauseIntelligenceRecord } from '../../types/clause';

interface ClauseDetailModalProps {
  clause: ClauseIntelligenceRecord | null;
  onClose: () => void;
  onViewEvidence: (clause: ClauseIntelligenceRecord) => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({
  clause,
  onClose,
  onViewEvidence,
}) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedNormalized, setCopiedNormalized] = useState(false);

  if (!clause) return null;

  const handleCopyOriginal = () => {
    if (clause.originalText) {
      navigator.clipboard.writeText(clause.originalText);
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    }
  };

  const handleCopyNormalized = () => {
    if (clause.normalizedMeaning) {
      navigator.clipboard.writeText(clause.normalizedMeaning);
      setCopiedNormalized(true);
      setTimeout(() => setCopiedNormalized(false), 2000);
    }
  };

  const hasEvidence = clause.sourceReferences && clause.sourceReferences.length > 0;
  const primaryEvidence = hasEvidence ? clause.sourceReferences[0] : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0d111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-[#111624]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  {clause.category}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {clause.group === 'core' ? 'Core Taxonomy' : 'Additional Provision'}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 mt-0.5">
                {clause.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Classification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Presence Status
              </span>
              <div className="flex items-center gap-1.5">
                {clause.status === 'PRESENT' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300">PRESENT</span>
                  </>
                )}
                {clause.status === 'REVIEW_REQUIRED' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300">REVIEW REQUIRED</span>
                  </>
                )}
                {clause.status === 'NOT_IDENTIFIED' && (
                  <>
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono font-bold text-slate-400">NOT IDENTIFIED</span>
                  </>
                )}
              </div>
            </div>

            {/* Confidence */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Extraction Confidence
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-mono font-bold ${
                  clause.confidence === 'HIGH' ? 'text-cyan-400' :
                  clause.confidence === 'MEDIUM' ? 'text-slate-200' :
                  clause.confidence === 'REVIEW' ? 'text-amber-300' : 'text-slate-400'
                }`}>
                  {clause.confidence}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">(Classification certainty)</span>
              </div>
            </div>

            {/* Detection Method */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Detection Method
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono capitalize">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{clause.detectionMethod.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Explanation / Review note */}
          {clause.explanation && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              clause.status === 'REVIEW_REQUIRED'
                ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                : 'bg-slate-900/40 border-slate-800 text-slate-300'
            }`}>
              <Info className={`w-4 h-4 shrink-0 mt-0.5 ${
                clause.status === 'REVIEW_REQUIRED' ? 'text-amber-400' : 'text-cyan-400'
              }`} />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5">Extraction Analysis:</span>
                {clause.explanation}
              </div>
            </div>
          )}

          {/* Factual Summary */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
              Factual Provision Summary
            </span>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {clause.summary}
            </div>
          </div>

          {/* Normalized Meaning */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Normalized Contractual Meaning
              </span>
              <button
                onClick={handleCopyNormalized}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {copiedNormalized ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNormalized ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090d16] border border-cyan-900/40 text-xs text-slate-200 leading-relaxed font-sans">
              {clause.normalizedMeaning}
            </div>
          </div>

          {/* Verbatim Original Source Text */}
          {clause.originalText && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Verbatim Source Document Text
                </span>
                <button
                  onClick={handleCopyOriginal}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  {copiedOriginal ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOriginal ? 'Copied' : 'Copy Verbatim'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-[#060911] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto select-text">
                {clause.originalText}
              </div>
            </div>
          )}

          {/* Source References & Provenance */}
          {hasEvidence ? (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Document Grounding & Provenance
              </span>
              <div className="space-y-2">
                {clause.sourceReferences.map((ref, idx) => (
                  <div 
                    key={ref.id || idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold shrink-0">
                        p.{ref.pageNumber}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {ref.documentName}
                          {ref.sectionIdentifier && (
                            <span className="text-slate-400 font-normal"> · {ref.sectionIdentifier}</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                          "{ref.textSnippet}"
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                        Score: {((ref.confidenceScore || 0.9) * 100).toFixed(0)}%
                      </span>
                      <button
                        onClick={() => onViewEvidence(clause)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 transition-colors"
                        title="Open in Document Viewer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400 italic">
                No affirmative source citations are attached to this provision.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-[#111624]">
          <span className="text-[11px] text-slate-500 font-mono">
            Neutral extraction profile • Zero legal advice
          </span>

          <div className="flex items-center gap-2.5">
            {hasEvidence && (
              <button
                onClick={() => {
                  onClose();
                  onViewEvidence(clause);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
              >
                <span>Jump to Source Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
