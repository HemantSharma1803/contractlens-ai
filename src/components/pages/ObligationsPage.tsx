import React, { useState } from 'react';
import { CheckSquare, Check, Filter, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ObligationStatus } from '../../types/contract';
import { EmptyState } from '../common/EmptyState';

export const ObligationsPage: React.FC = () => {
  const { contracts, toggleObligationStatus, selectContract, loadDemoWorkspace, setIsUploadOpen } = useContract();
  const [statusFilter, setStatusFilter] = useState<'all' | ObligationStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Flatten all obligations across contracts
  const allObligations = contracts.flatMap(c => 
    c.obligations.map(ob => ({ ...ob, contractName: c.name, contract: c }))
  );

  const filteredObligations = allObligations.filter(ob => {
    if (statusFilter !== 'all' && ob.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ob.priority !== priorityFilter) return false;
    return true;
  });

  const pendingCount = allObligations.filter(o => o.status !== 'fulfilled').length;
  const fulfilledCount = allObligations.filter(o => o.status === 'fulfilled').length;

  if (allObligations.length === 0) {
    return (
      <EmptyState
        title="No obligations identified"
        description="Upload a contract to extract actionable duties, deadlines, and audit windows."
        actionText="Upload Contract"
        onAction={() => setIsUploadOpen(true)}
        secondaryActionText="Load Demo Contracts"
        onSecondaryAction={loadDemoWorkspace}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Obligation Tracker</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational duties, audit windows, payment milestones, and notice deadlines extracted from agreements
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-800/80 text-amber-300">
            {pendingCount} Pending
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-800/80 text-emerald-300">
            {fulfilledCount} Fulfilled
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#0e1320] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredObligations.length} obligations
        </span>
      </div>

      {/* Obligations List */}
      <div className="space-y-3">
        {filteredObligations.map((ob) => {
          const isFulfilled = ob.status === 'fulfilled';
          return (
            <div
              key={ob.id}
              className={`p-4 rounded-xl border transition-all ${
                isFulfilled
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : 'bg-[#0e1320] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleObligationStatus(ob.contractId, ob.id)}
                    className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isFulfilled
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-transparent'
                    }`}
                    aria-label={`Toggle status for ${ob.title}`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {ob.category}
                      </span>
                      <button
                        onClick={() => selectContract(ob.contractId, 'obligations')}
                        className="text-xs text-slate-400 hover:text-cyan-300 hover:underline font-medium"
                      >
                        {ob.contractName}
                      </button>
                    </div>

                    <h3 className={`text-sm font-semibold ${isFulfilled ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {ob.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ob.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span>Responsible: <strong className="text-slate-300">{ob.responsibleParty}</strong></span>
                      <span>•</span>
                      <span>Recipient: {ob.recipientParty}</span>
                      <span>•</span>
                      <span>Recurrence: {ob.recurrence}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="font-mono text-xs text-cyan-300 font-semibold">{ob.dueDate}</div>
                  <span className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.2 rounded ${
                    ob.priority === 'urgent'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : ob.priority === 'high'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
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
  );
};
