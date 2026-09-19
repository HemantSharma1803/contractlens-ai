import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Shield, 
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { ClauseIntelligenceRecord, ClauseIntelligenceStatus, ClauseDetectionConfidence } from '../../types/clause';

interface ClauseCardProps {
  clause: ClauseIntelligenceRecord;
  onViewEvidence: (clause: ClauseIntelligenceRecord) => void;
  onSelectClause: (clause: ClauseIntelligenceRecord) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  onViewEvidence,
  onSelectClause,
}) => {
  const hasEvidence = clause.sourceReferences && clause.sourceReferences.length > 0;
  const isPresent = clause.status === 'PRESENT';
  const isReview = clause.status === 'REVIEW_REQUIRED';
  const isNotIdentified = clause.status === 'NOT_IDENTIFIED';

  const renderStatusBadge = (status: ClauseIntelligenceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            PRESENT
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-amber-950/80 text-amber-300 border border-amber-700/60">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            REVIEW REQUIRED
          </span>
        );
      case 'NOT_IDENTIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-slate-900 text-slate-400 border border-slate-700/60">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            NOT IDENTIFIED
          </span>
        );
    }
  };

  const renderConfidenceBadge = (confidence: ClauseDetectionConfidence) => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
            HIGH CONFIDENCE
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            MEDIUM CONFIDENCE
          </span>
        );
      case 'LOW':
        return (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            LOW CONFIDENCE
          </span>
        );
      case 'REVIEW':
        return (
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
            HUMAN REVIEW
          </span>
        );
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onSelectClause(clause)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectClause(clause);
        }
      }}
      className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all text-left focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
        isPresent
          ? 'bg-[#0e1320] border-slate-800 hover:border-slate-700 hover:bg-[#111728]'
          : isReview
          ? 'bg-[#14121a] border-amber-900/40 hover:border-amber-700/60 hover:bg-[#1a1622]'
          : 'bg-[#0a0d14]/70 border-slate-800/60 hover:border-slate-700 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {clause.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {clause.group === 'core' ? 'Core Taxonomy' : 'Additional Provision'}
            </span>
          </div>
          {renderStatusBadge(clause.status)}
        </div>

        {/* Clause Title */}
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {clause.title}
        </h4>

        {/* Short Factual Summary */}
        <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
          {clause.summary}
        </p>

        {/* Review Indicator Banner when applicable */}
        {isReview && (
          <div className="mt-3 p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-tight">
              {clause.explanation || 'Classification confidence is insufficient for automatic confirmation. Review source document.'}
            </p>
          </div>
        )}

        {/* Not Identified Notice */}
        {isNotIdentified && (
          <div className="mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-tight">
              No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.
            </p>
          </div>
        )}
      </div>

      {/* Footer Metadata & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Source metadata */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          {clause.pageNumber ? (
            <span className="flex items-center gap-1 text-slate-300">
              <FileText className="w-3 h-3 text-cyan-400" />
              Page {clause.pageNumber}
              {clause.sectionIdentifier && (
                <span className="text-slate-500 font-normal"> · {clause.sectionIdentifier}</span>
              )}
            </span>
          ) : (
            <span className="text-slate-500 italic">No source mapping</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {renderConfidenceBadge(clause.confidence)}

          {hasEvidence && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewEvidence(clause);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 hover:border-cyan-500 transition-colors shadow-xs"
              title="Open source document at exact citation"
            >
              <span>View Evidence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </div>
  );
};
