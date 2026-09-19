import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Share2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  GitCompare, 
  MessageSquareCode, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Search,
  Check,
  Tag,
  ChevronRight,
  Info
} from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ContractDetailTab, ReviewStatus } from '../../types/contract';
import { ContractStatusBadge, ReviewStatusBadge, RiskBadge } from '../common/Badge';
import { EvidenceViewer } from '../document/EvidenceViewer';
import { ContractIntelligenceDashboard } from '../contract/ContractIntelligenceDashboard';
import { ClauseExplorer } from '../contract/ClauseExplorer';
import { answerContractQuestion, AskResult } from '../../services/intelligencePipeline';

export const ContractDetailPage: React.FC = () => {
  const { 
    activeContract, 
    activeDocument,
    selectContract, 
    activeDetailTab, 
    setActiveDetailTab,
    updateClauseReviewStatus,
    toggleObligationStatus
  } = useContract();

  const [askQuery, setAskQuery] = useState<string>('');
  const [askResult, setAskResult] = useState<AskResult | null>(null);
  const [selectedEvidenceClause, setSelectedEvidenceClause] = useState<string | null>(null);
  const [selectedEvidenceCitationId, setSelectedEvidenceCitationId] = useState<string | null>(null);

  if (!activeContract) {
    return (
      <div className="p-8 text-center bg-[#0e1320] border border-slate-800 rounded-xl">
        <p className="text-slate-300 mb-3">No contract selected.</p>
        <button
          onClick={() => selectContract(null)}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-lg text-xs"
        >
          Return to Contract Library
        </button>
      </div>
    );
  }

  const tabs: Array<{ id: ContractDetailTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: 'Evidence & Citations', count: activeContract.clauses.length },
    { id: 'clauses', label: 'Clauses', count: activeContract.clauses.length },
    { id: 'obligations', label: 'Obligations', count: activeContract.obligations.length },
    { id: 'timeline', label: 'Timeline', count: activeContract.timeline.length },
    { id: 'compare', label: 'Compare' },
    { id: 'ask', label: 'Ask AI' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => selectContract(null)}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contract Repository</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>SHA-256 Verified</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
      </div>

      {/* Contract Workspace Header */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0e1320] border border-slate-800/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                {activeContract.type}
              </span>
              <ContractStatusBadge status={activeContract.status} />
              <ReviewStatusBadge status={activeContract.reviewStatus} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {activeContract.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <div>
                Counterparty: <strong className="text-slate-200">{activeContract.counterparty.name}</strong>
              </div>
              <span>•</span>
              <div>
                Jurisdiction: <span className="font-mono text-slate-300">{activeContract.metadata.governingLaw}</span>
              </div>
              <span>•</span>
              <div>
                Source: <span className="font-mono text-cyan-400">{activeContract.fileInfo.fileName}</span> ({activeContract.fileInfo.pageCount} pgs)
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1">
            <button
              onClick={() => {
                const jsonStr = JSON.stringify(activeContract, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${activeContract.id}-intelligence.json`;
                a.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
              title="Download structured JSON summary"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Intel</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-800 mt-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeDetailTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-cyan-900/80 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[420px]">
        {/* TAB 1: OVERVIEW */}
        {activeDetailTab === 'overview' && (
          <ContractIntelligenceDashboard
            contract={activeContract}
            document={activeDocument}
            onJumpToEvidence={(evidenceRef) => {
              setSelectedEvidenceCitationId(evidenceRef.id);
              setActiveDetailTab('evidence');
            }}
          />
        )}

        {/* TAB 2: EVIDENCE & CITATIONS */}
        {activeDetailTab === 'evidence' && (
          <EvidenceViewer
            contract={activeContract}
            document={activeDocument}
            initialCitationId={selectedEvidenceCitationId}
            onUpdateClauseVerification={(clauseId, verified) => {
              updateClauseReviewStatus(activeContract.id, clauseId, verified ? 'verified' : 'needs_review');
            }}
          />
        )}

        {/* TAB 3: CLAUSES (CLAUSE INTELLIGENCE EXPLORER) */}
        {activeDetailTab === 'clauses' && (
          <ClauseExplorer
            contract={activeContract}
            document={activeDocument}
            onNavigateToEvidence={(citationId, pageNumber) => {
              setSelectedEvidenceCitationId(citationId || null);
              setActiveDetailTab('evidence');
            }}
          />
        )}

        {/* TAB 4: OBLIGATIONS */}
        {activeDetailTab === 'obligations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0e1320] border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 mb-1">Contractual Obligations & Deadlines</h3>
              <p className="text-xs text-slate-400">
                Actionable duties extracted from the agreement. Check off obligations once fulfilled.
              </p>
            </div>

            <div className="space-y-3">
              {activeContract.obligations.map((ob) => {
                const isFulfilled = ob.status === 'fulfilled';
                return (
                  <div
                    key={ob.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isFulfilled
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                        : 'bg-[#0e1320] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleObligationStatus(activeContract.id, ob.id)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            isFulfilled
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-transparent'
                          }`}
                          aria-label={`Mark ${ob.title} as ${isFulfilled ? 'pending' : 'fulfilled'}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div>
                          <h4 className={`text-xs font-semibold ${isFulfilled ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {ob.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ob.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                            <span>Responsible: <strong className="text-slate-300">{ob.responsibleParty}</strong></span>
                            <span>•</span>
                            <span>Recipient: <span className="text-slate-300">{ob.recipientParty}</span></span>
                            <span>•</span>
                            <span>Recurrence: <span className="text-slate-300">{ob.recurrence}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-xs text-cyan-300 font-semibold">{ob.dueDate}</div>
                        <span className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.2 rounded ${
                          ob.priority === 'urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ob.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: TIMELINE */}
        {activeDetailTab === 'timeline' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0e1320] border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 mb-1">Contract Lifecycle Timeline</h3>
              <p className="text-xs text-slate-400">
                Chronological sequence of effective dates, notice periods, audit requirements, and termination dates.
              </p>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {activeContract.timeline.map((event) => (
                <div key={event.id} className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-[#080b11] ${
                    event.criticalLevel === 'critical'
                      ? 'border-rose-400'
                      : event.criticalLevel === 'completed'
                      ? 'border-emerald-400'
                      : 'border-cyan-400'
                  }`} />
                  <div className="p-4 rounded-xl bg-[#0e1320] border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-cyan-400 font-bold">{event.date}</span>
                      <span className="text-[10px] font-mono text-slate-400">{event.type.replace(/_/g, ' ')}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">{event.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMPARE */}
        {activeDetailTab === 'compare' && (
          <div className="p-6 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Comparison Engine Architecture</h3>
                <p className="text-xs text-slate-400">
                  Ready to compare this agreement against organizational standards or prior executed versions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-cyan-400 block mb-1">Current Agreement:</span>
                <p className="font-medium text-slate-200">{activeContract.name}</p>
                <div className="mt-3 space-y-1 font-mono text-[11px] text-slate-400">
                  <div>Liability: {activeContract.metadata.liabilityCapAmount}</div>
                  <div>Renewal: {activeContract.metadata.renewalNoticePeriodDays} days notice</div>
                  <div>Law: {activeContract.metadata.governingLaw}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-6">
                <p className="text-slate-300 font-medium mb-1">Select Agreement to Compare</p>
                <p className="text-xs text-slate-400 mb-3">
                  Compare against our baseline playbook or another vendor agreement.
                </p>
                <button
                  onClick={() => selectContract(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                >
                  Choose from Repository
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ASK AI */}
        {activeDetailTab === 'ask' && (
          <div className="p-6 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <MessageSquareCode className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Evidence-Grounded Intelligence Query</h3>
                <p className="text-xs text-slate-400">
                  Query this specific agreement with strict verbatim citations.
                </p>
              </div>
            </div>

            {/* Suggested Queries */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Suggested high-leverage legal queries:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "What is our notice deadline to prevent automatic renewal?",
                  "Are there any uncapped liability exceptions in Section 9?",
                  "What are the SLA credit forfeiture conditions?",
                  "Who owns bespoke work product created under this SOW?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAskQuery(q)}
                    className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  placeholder="Ask a question about this contract's clauses, deadlines, or risks..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  disabled={!askQuery.trim()}
                  onClick={() => setAskResult(answerContractQuestion([activeContract], askQuery, activeContract.id))}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 transition-colors"
                >
                  Analyze
                </button>
              </div>
              {askResult && (
                <div className="p-3 rounded-lg bg-slate-900 border border-cyan-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300">{askResult.grounded ? 'EVIDENCE GROUNDED' : 'NO MATCH'}</span>
                    <span className="text-[10px] text-slate-500">{askResult.matches.length} source record(s)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{askResult.answer}</p>
                  {askResult.matches.map((m, i) => (
                    <div key={i} className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                      <strong className="text-slate-300">{m.title}</strong> · {m.page ? `Page ${m.page}` : 'page not indexed'}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                Answers are generated from this agreement's indexed evidence and should be verified against the cited source text.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
