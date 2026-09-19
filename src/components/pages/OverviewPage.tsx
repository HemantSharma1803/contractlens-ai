import React from 'react';
import { 
  Plus, 
  Database, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ContractStatusBadge, ReviewStatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const OverviewPage: React.FC = () => {
  const { 
    contracts, 
    isDemoMode, 
    loadDemoWorkspace, 
    setIsUploadOpen, 
    selectContract, 
    activities,
    setActiveNavSection 
  } = useContract();

  if (contracts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-[#0e1320] border border-slate-800">
          <h1 className="text-xl font-bold text-slate-100 mb-1">Contract Intelligence</h1>
          <p className="text-xs text-slate-400">
            Turn agreements into searchable evidence, obligations, timelines, and decisions.
          </p>
        </div>
        <EmptyState
          title="No contracts in workspace"
          description="Upload your first executed agreement or load our realistic demo workspace to explore the intelligence features."
          actionText="Upload Contract"
          onAction={() => setIsUploadOpen(true)}
          secondaryActionText="Load Demo Workspace"
          onSecondaryAction={loadDemoWorkspace}
        />
      </div>
    );
  }

  // Calculate high-signal metrics
  const activeCount = contracts.filter(c => c.status === 'active').length;
  const upcomingRenewalsCount = contracts.filter(c => {
    // Within 60 days
    if (!c.metadata.renewalNoticeDeadline) return false;
    const deadline = new Date(c.metadata.renewalNoticeDeadline).getTime();
    const now = Date.now();
    const diffDays = (deadline - now) / (1000 * 3600 * 24);
    return diffDays >= -10 && diffDays <= 60;
  }).length;

  const totalOpenObligations = contracts.reduce((acc, c) => {
    return acc + c.obligations.filter(o => o.status !== 'fulfilled').length;
  }, 0);

  const needsReviewCount = contracts.reduce((acc, c) => {
    return acc
      + (c.reviewStatus === 'needs_review' || c.reviewStatus === 'flagged' ? 1 : 0)
      + c.reviewQueue.filter(item => item.status === 'pending' || item.status === 'in_progress').length;
  }, 0);

  // Segment 10 portfolio intelligence: derive attention and milestones from current indexed records.
  const today = new Date().toISOString().slice(0, 10);
  const attentionItems = contracts.flatMap(c => [
    ...c.risks.filter(r => !r.reviewed).slice(0, 3).map(r => ({
      id: r.id, title: r.title, detail: r.description, urgency: r.severity === 'critical' ? 'critical' : r.severity,
      tag: r.category, contractId: c.id, tab: 'clauses' as const
    })),
    ...c.obligations.filter(o => o.status === 'overdue' || o.responsibleParty === 'Unclear').slice(0, 2).map(o => ({
      id: o.id, title: o.title, detail: o.responsibleParty === 'Unclear' ? 'Responsible party could not be mapped reliably from source text.' : o.description,
      urgency: o.priority === 'urgent' ? 'critical' : o.priority, tag: 'Obligation Review', contractId: c.id, tab: 'obligations' as const
    }))
  ]).slice(0, 6);

  const upcomingMilestones = contracts.flatMap(c => c.timeline
    .filter(e => e.date >= today && !e.completed)
    .map(e => ({ id: e.id, date: e.date, title: e.title, contractName: c.name, contractId: c.id }))
  ).sort((a,b)=>a.date.localeCompare(b.date)).slice(0, 6);
  return (
    <div className="space-y-6">
      {/* Disclaimer Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Decision Support System:</strong> ContractLens AI assists human professionals with extracted evidence and does not replace legal counsel.
          </span>
        </div>
        {isDemoMode && (
          <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-300">
            DEMO WORKSPACE
          </span>
        )}
      </div>

      {/* A. Hero / Command Header */}
      <div className="relative p-6 sm:p-7 rounded-xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0c121e] border border-slate-800/90 shadow-lg overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-medium mb-3">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Intelligence Command Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              Contract Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Turn agreements into searchable evidence, obligations, timelines, and decisions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <Plus className="w-4 h-4" />
              Upload Contract
            </button>
            <button
              onClick={loadDemoWorkspace}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              Explore Demo
            </button>
          </div>
        </div>
      </div>

      {/* B. Intelligence Summary */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Portfolio Intelligence Metrics</span>
            {isDemoMode && (
              <span className="text-[10px] font-mono lowercase px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                demo data
              </span>
            )}
          </h2>
          <span className="text-[11px] text-slate-400">Current active agreements</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Active Contracts */}
          <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Active Contracts</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              {activeCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Out of {contracts.length} total indexed documents
            </p>
          </div>

          {/* Card 2: Upcoming Renewals */}
          <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Upcoming Renewals</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              {upcomingRenewalsCount}
            </div>
            <p className="text-[11px] text-amber-400/90 mt-1">
              Notice windows within next 60 days
            </p>
          </div>

          {/* Card 3: Open Obligations */}
          <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Open Obligations</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              {totalOpenObligations}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across compliance, payment & audits
            </p>
          </div>

          {/* Card 4: Needs Review */}
          <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Needs Review</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              {needsReviewCount}
            </div>
            <p className="text-[11px] text-rose-400/90 mt-1">
              High risk clauses or terms flagged
            </p>
          </div>
        </div>
      </div>

      {/* C. Priority Workspace: Needs Attention & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section: Needs Attention */}
        <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">Needs Attention</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60">
                Actionable Items
              </span>
            </div>

            <div className="space-y-3">
              {attentionItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => selectContract(item.contractId, item.tab)}
                  className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400">{item.tag}</span>
                    <span className={`px-1.5 py-0.2 rounded font-semibold ${
                      item.urgency === 'critical' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/80' 
                        : item.urgency === 'high'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.urgency.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/60 text-right">
            <button
              onClick={() => setActiveNavSection('review-queue')}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>View full review queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section: Upcoming Milestones */}
        <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Upcoming Milestones</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Timeline
              </span>
            </div>

            <div className="space-y-3">
              {upcomingMilestones.map((ms) => (
                <div 
                  key={ms.id}
                  onClick={() => selectContract(ms.contractId, 'timeline')}
                  className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-cyan-300 font-semibold">{ms.date}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[160px]">{ms.contractName}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {ms.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/60 text-right">
            <button
              onClick={() => setActiveNavSection('timeline')}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>View full milestone timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* D. Recent Contracts Table */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800/90">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Recent Contracts</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any agreement to view extracted clauses, evidence citations, and obligations
            </p>
          </div>
          <button
            onClick={() => setActiveNavSection('contracts')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>All Contracts ({contracts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-2.5 px-3">Contract</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Counterparty</th>
                <th className="py-2.5 px-3">Expiration</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Review</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contracts.slice(0, 4).map((contract) => (
                <tr 
                  key={contract.id}
                  onClick={() => selectContract(contract.id, 'overview')}
                  className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      {contract.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {contract.fileInfo.fileName} ({contract.fileInfo.pageCount} pgs)
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{contract.type}</td>
                  <td className="py-3 px-3 text-slate-300">{contract.counterparty.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{contract.metadata.expirationDate}</td>
                  <td className="py-3 px-3">
                    <ContractStatusBadge status={contract.status} />
                  </td>
                  <td className="py-3 px-3">
                    <ReviewStatusBadge status={contract.reviewStatus} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-cyan-400 group-hover:underline text-[11px] font-medium">
                      Open Workspace →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E. Intelligence Activity Stream */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800/90">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Intelligence Activity Stream</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Real-time local event ledger</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activities.map((act) => (
            <div key={act.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <div>
                <div className="font-medium text-slate-200 flex items-center gap-2">
                  <span>{act.title}</span>
                  {act.contractId && (
                    <button
                      onClick={() => selectContract(act.contractId!)}
                      className="text-[10px] text-cyan-400 hover:underline font-mono"
                    >
                      [{act.contractName || act.contractId}]
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{act.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <p className="text-[10px] text-slate-400">{act.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
