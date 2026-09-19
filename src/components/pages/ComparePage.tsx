import React, { useMemo, useState } from 'react';
import { GitCompare, FileDiff, ShieldCheck } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { EmptyState } from '../common/EmptyState';
import { compareContracts, compareVersions } from '../../services/intelligencePipeline';

export const ComparePage: React.FC = () => {
  const { contracts, loadDemoWorkspace, setIsUploadOpen } = useContract();
  const [aId, setAId] = useState(contracts[0]?.id || '');
  const [bId, setBId] = useState(contracts[1]?.id || contracts[0]?.id || '');
  const a = contracts.find(c => c.id === aId) || contracts[0];
  const b = contracts.find(c => c.id === bId) || contracts[1] || contracts[0];
  const rows = useMemo(() => a && b ? compareContracts(a, b) : [], [a, b]);
  const versionRows = useMemo(() => a && b ? compareVersions(a.versions[0], b.versions[0]) : [], [a, b]);

  if (contracts.length < 2 || !a || !b) return <EmptyState title="Two contracts are required"
    description="Load the demo workspace or upload another agreement to compare structured terms and evidence."
    actionText="Load Demo Contracts" onAction={loadDemoWorkspace}
    secondaryActionText="Upload Contract" onSecondaryAction={() => setIsUploadOpen(true)} />;

  return <div className="space-y-5">
    <div><h1 className="text-xl font-bold text-slate-100">Contract Comparison</h1><p className="text-xs text-slate-400 mt-1">Structured diff of two indexed agreements. Changed fields are highlighted; source evidence remains available in each contract.</p></div>
    <div className="grid md:grid-cols-2 gap-3">
      <select value={a.id} onChange={e=>setAId(e.target.value)} className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">{contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select value={b.id} onChange={e=>setBId(e.target.value)} className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">{contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    </div>
    <section className="rounded-xl bg-[#0e1320] border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2"><GitCompare className="w-4 h-4 text-cyan-400"/><h2 className="text-xs font-semibold uppercase tracking-wider">Term & obligation diff</h2></div>
      <div className="divide-y divide-slate-800">{rows.map(r=><div key={r.label} className="grid md:grid-cols-5 gap-3 p-4 text-xs">
        <div className="font-semibold text-slate-400">{r.label}</div><div className={`md:col-span-2 p-3 rounded-lg bg-slate-900 border ${r.changed?'border-amber-800/60':'border-slate-800'}`}><span className="text-[10px] text-cyan-400 block mb-1">A</span>{r.a}</div>
        <div className={`md:col-span-2 p-3 rounded-lg bg-slate-900 border ${r.changed?'border-amber-800/60':'border-slate-800'}`}><span className="text-[10px] text-cyan-400 block mb-1">B</span>{r.b}</div>
      </div>)}</div>
    </section>
    <section className="rounded-xl bg-[#0e1320] border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2"><FileDiff className="w-4 h-4 text-cyan-400"/><h2 className="text-xs font-semibold uppercase tracking-wider">Version integrity comparison</h2></div>
      <div className="divide-y divide-slate-800">{versionRows.map(r=><div key={r.label} className="grid md:grid-cols-3 gap-3 p-4 text-xs"><div className="font-semibold text-slate-400">{r.label}</div><div className={r.changed?'text-amber-300':'text-slate-300'}>{r.a}</div><div className={r.changed?'text-amber-300':'text-slate-300'}>{r.b}</div></div>)}</div>
    </section>
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0"/><span>Comparison is descriptive: differences are shown from indexed data and are not a legal conclusion about which term is preferable.</span></div>
  </div>;
};
