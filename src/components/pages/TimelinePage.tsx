import React, { useMemo, useState } from 'react';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { EmptyState } from '../common/EmptyState';

export const TimelinePage: React.FC = () => {
  const { contracts, selectContract, loadDemoWorkspace, setIsUploadOpen } = useContract();
  const [filter, setFilter] = useState('all');
  const events = useMemo(() => contracts.flatMap(c => c.timeline.map(e => ({...e, contractName:c.name}))).sort((a,b)=>a.date.localeCompare(b.date)), [contracts]);
  const filtered = events.filter(e => filter==='all' || e.criticalLevel===filter);
  if (!events.length) return <EmptyState title="No indexed timeline events" description="Upload an agreement to build dates and obligation milestones." actionText="Upload Contract" onAction={()=>setIsUploadOpen(true)} secondaryActionText="Load Demo Contracts" onSecondaryAction={loadDemoWorkspace}/>;
  return <div className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h1 className="text-xl font-bold text-slate-100">Deadline & Renewal Timeline</h1><p className="text-xs text-slate-400 mt-1">Dates are taken from indexed contract metadata and obligation evidence. Relative dates remain unresolved until source text supports normalization.</p></div>
      <div className="flex gap-1">{['all','critical','upcoming','completed'].map(x=><button key={x} onClick={()=>setFilter(x)} className={`px-2.5 py-1.5 rounded-lg text-[11px] border ${filter===x?'bg-cyan-950 text-cyan-300 border-cyan-800':'bg-slate-900 text-slate-400 border-slate-800'}`}>{x}</button>)}</div></div>
    <div className="space-y-3">{filtered.map(e=><div key={e.id} className="p-4 rounded-xl bg-[#0e1320] border border-slate-800 flex gap-4">
      <div className="pt-1"><CalendarClock className="w-4 h-4 text-cyan-400"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-cyan-300">{e.date}</span><span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">{e.type.replace(/_/g,' ')}</span>{e.completed&&<span className="text-[10px] text-emerald-300">completed</span>}</div><h3 className="text-sm font-semibold text-slate-100 mt-1">{e.title}</h3><p className="text-xs text-slate-400 mt-1">{e.description}</p><button onClick={()=>selectContract(e.contractId,'timeline')} className="mt-2 text-[11px] text-cyan-400 inline-flex items-center gap-1">{e.contractName}<ArrowRight className="w-3 h-3"/></button></div>
    </div>)}</div>
  </div>;
};
