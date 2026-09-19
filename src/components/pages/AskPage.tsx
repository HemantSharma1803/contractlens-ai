import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { EmptyState } from '../common/EmptyState';
import { answerContractQuestion, AskResult } from '../../services/intelligencePipeline';

export const AskPage: React.FC = () => {
  const { contracts, loadDemoWorkspace, setIsUploadOpen, selectContract } = useContract();
  const [selectedContractId, setSelectedContractId] = useState('all');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AskResult | null>(null);

  if (!contracts.length) return (
    <EmptyState title="No contracts to query"
      description="Upload a contract or load the demo workspace to search indexed evidence."
      actionText="Upload Contract" onAction={() => setIsUploadOpen(true)}
      secondaryActionText="Load Demo Workspace" onSecondaryAction={loadDemoWorkspace} />
  );

  const run = (q = query) => {
    setQuery(q);
    setResult(answerContractQuestion(contracts, q, selectedContractId));
  };

  const suggestions = [
    'Which contracts have renewal notice deadlines?',
    'What are the payment obligations?',
    'Which provisions mention security or breach notification?',
    'What are the liability cap provisions?',
  ];

  return <div className="space-y-5">
    <div>
      <h1 className="text-xl font-bold text-slate-100">Ask ContractLens</h1>
      <p className="text-xs text-slate-400 mt-1">Evidence-grounded search across contracts, clauses, obligations and indexed deadlines.</p>
    </div>

    <section className="p-4 rounded-xl bg-[#0e1320] border border-slate-800 space-y-3">
      <div className="flex flex-col md:flex-row gap-2">
        <select value={selectedContractId} onChange={e => setSelectedContractId(e.target.value)}
          className="md:w-72 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
          <option value="all">Entire repository ({contracts.length})</option>
          {contracts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="Ask about a clause, party, obligation, deadline or term…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200" />
          </div>
          <button disabled={!query.trim()} onClick={() => run()} className="px-4 rounded-lg bg-cyan-500 disabled:opacity-40 text-slate-950 text-xs font-semibold">Analyze</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(s => <button key={s} onClick={() => run(s)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-cyan-300">{s}</button>)}
      </div>
    </section>

    {result && <section className="rounded-xl bg-[#0f1524] border border-cyan-900/60 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400"/><h2 className="text-sm font-semibold text-slate-100">Indexed Answer</h2></div>
        <span className={`text-[10px] px-2 py-1 rounded border ${result.grounded ? 'text-emerald-300 bg-emerald-950 border-emerald-800' : 'text-amber-300 bg-amber-950 border-amber-800'}`}>
          {result.grounded ? 'GROUNDED' : 'NO MATCH'}
        </span>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-200 leading-relaxed">{result.answer}</p>
        {result.matches.map((m, i) => <div key={`${m.contractId}-${i}`} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-semibold text-slate-200">{m.title}</p><p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{m.excerpt}</p></div>
            <button onClick={() => selectContract(m.contractId, 'clauses')} className="shrink-0 text-cyan-400 text-[11px] inline-flex items-center gap-1">Open <ArrowRight className="w-3 h-3"/></button>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500">{m.page ? `Source page ${m.page}` : 'Source page not available in this record'}</div>
        </div>)}
      </div>
    </section>}

    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex gap-3">
      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0"/>
      <span><strong className="text-slate-200">Evidence-first:</strong> answers are generated from indexed source records and show their contract/page anchors. If evidence is insufficient, ContractLens says so instead of inventing an answer.</span>
    </div>
  </div>;
};
