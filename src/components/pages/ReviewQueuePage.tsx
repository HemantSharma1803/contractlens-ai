import React from 'react';
import { ShieldAlert, CheckCircle2, User, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { EmptyState } from '../common/EmptyState';

export const ReviewQueuePage: React.FC = () => {
  const { contracts, selectContract, updateClauseReviewStatus, loadDemoWorkspace, setIsUploadOpen } = useContract();

  // Aggregate all review items across contracts
  const reviewItems = contracts.flatMap(c => 
    c.reviewQueue.map(item => ({ ...item, contract: c }))
  );

  // Also collect flagged clauses that need review
  const flaggedClauses = contracts.flatMap(c =>
    c.clauses.filter(cl => cl.reviewStatus === 'needs_review' || cl.reviewStatus === 'flagged')
      .map(cl => ({ clause: cl, contract: c }))
  );

  if (reviewItems.length === 0 && flaggedClauses.length === 0) {
    return (
      <EmptyState
        title="Review queue is clear"
        description="All extracted clauses and terms are verified. Any new agreements uploaded with non-standard clauses will appear here for legal verification."
        actionText="Upload Contract"
        onAction={() => setIsUploadOpen(true)}
        secondaryActionText="Load Demo Workspace"
        onSecondaryAction={loadDemoWorkspace}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Review Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Triage workspace for non-standard clauses, liability carve-outs, and pending legal verifications
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-300">
          {flaggedClauses.length} Clauses Awaiting Legal Counsel Review
        </span>
      </div>

      {/* Flagged Clauses Requiring Human Verification */}
      <div className="space-y-3">
        {flaggedClauses.map(({ clause, contract }) => (
          <div
            key={clause.id}
            className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-semibold">
                  {clause.sectionReference}
                </span>
                <h3 className="text-sm font-semibold text-slate-100">{clause.title}</h3>
                <span className="text-xs text-slate-400 font-mono">({clause.category})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  clause.riskLevel === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  clause.riskLevel === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {clause.riskLevel.toUpperCase()} RISK
                </span>
                <span className="text-xs text-slate-400">in {contract.name}</span>
              </div>
            </div>

            {/* Verbatim quote */}
            <blockquote className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 italic">
              "{clause.originalText}"
            </blockquote>

            {clause.reviewNotes && (
              <p className="text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded border border-amber-900/50 leading-relaxed">
                <strong>Legal Flag:</strong> {clause.reviewNotes}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <span>Citation Anchor: Page {clause.evidenceRef.pageNumber}</span>
                <span>•</span>
                <span>{(clause.evidenceRef.confidenceScore * 100).toFixed(0)}% Confidence</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateClauseReviewStatus(contract.id, clause.id, 'verified')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-medium transition-colors"
                >
                  Approve / Mark Verified
                </button>
                <button
                  onClick={() => selectContract(contract.id, 'clauses')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
