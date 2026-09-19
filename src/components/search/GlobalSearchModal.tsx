import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ArrowRight, ShieldAlert, CheckSquare, Layers, Sparkles } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { Contract, ContractDetailTab } from '../../types/contract';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, contracts, selectContract } = useContract();
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmedQuery = query.toLowerCase().trim();

  // Search Results aggregation
  const contractResults: Contract[] = [];
  const intelligenceResults: Array<{ contract: Contract; field: string; value: string; citation?: string }> = [];
  const clauseResults: Array<{ contract: Contract; clauseTitle: string; category: string; section: string }> = [];
  const obligationResults: Array<{ contract: Contract; obligationTitle: string; dueDate: string }> = [];
  const riskResults: Array<{ contract: Contract; riskTitle: string; severity: string }> = [];

  if (trimmedQuery.length > 0) {
    contracts.forEach(contract => {
      // Check contract core metadata
      const matchesContract = 
        contract.name.toLowerCase().includes(trimmedQuery) ||
        contract.counterparty.name.toLowerCase().includes(trimmedQuery) ||
        contract.type.toLowerCase().includes(trimmedQuery) ||
        contract.status.toLowerCase().includes(trimmedQuery) ||
        contract.metadata.governingLaw.toLowerCase().includes(trimmedQuery);

      if (matchesContract) {
        contractResults.push(contract);
      }

      // Check intelligence metadata
      if (contract.intelligence) {
        const intel = contract.intelligence;

        if (intel.contractPurpose.toLowerCase().includes(trimmedQuery)) {
          intelligenceResults.push({
            contract,
            field: 'Contract Purpose',
            value: intel.contractPurpose.slice(0, 120) + '...',
          });
        }

        intel.commercialTerms.forEach(ct => {
          if (ct.label.toLowerCase().includes(trimmedQuery) || ct.description.toLowerCase().includes(trimmedQuery)) {
            intelligenceResults.push({
              contract,
              field: `Commercial: ${ct.label}`,
              value: ct.description,
              citation: `P.${ct.sourceReference.pageNumber} (${ct.sourceReference.sectionIdentifier})`,
            });
          }
        });

        intel.terminationProvisions.forEach(tp => {
          if (tp.title.toLowerCase().includes(trimmedQuery) || (tp.condition && tp.condition.toLowerCase().includes(trimmedQuery))) {
            intelligenceResults.push({
              contract,
              field: `Termination: ${tp.title}`,
              value: tp.condition || tp.title,
              citation: `P.${tp.sourceReference.pageNumber}`,
            });
          }
        });

        intel.allClausePresences.forEach(cp => {
          if (cp.status === 'present' && (cp.category.toLowerCase().includes(trimmedQuery) || (cp.summary && cp.summary.toLowerCase().includes(trimmedQuery)))) {
            intelligenceResults.push({
              contract,
              field: `Clause Presence: ${cp.category}`,
              value: cp.summary || cp.snippet || 'Provision identified in agreement body',
              citation: cp.pageNumber ? `P.${cp.pageNumber}` : undefined,
            });
          }
        });
      }

      // Check clauses
      contract.clauses.forEach(clause => {
        if (
          clause.title.toLowerCase().includes(trimmedQuery) ||
          clause.category.toLowerCase().includes(trimmedQuery) ||
          clause.originalText.toLowerCase().includes(trimmedQuery) ||
          clause.summary.toLowerCase().includes(trimmedQuery)
        ) {
          clauseResults.push({
            contract,
            clauseTitle: clause.title,
            category: clause.category,
            section: clause.sectionReference,
          });
        }
      });

      // Check obligations
      contract.obligations.forEach(ob => {
        if (
          ob.title.toLowerCase().includes(trimmedQuery) ||
          ob.description.toLowerCase().includes(trimmedQuery) ||
          ob.category.toLowerCase().includes(trimmedQuery)
        ) {
          obligationResults.push({
            contract,
            obligationTitle: ob.title,
            dueDate: ob.dueDate,
          });
        }
      });

      // Check risks
      contract.risks.forEach(risk => {
        if (
          risk.title.toLowerCase().includes(trimmedQuery) ||
          risk.description.toLowerCase().includes(trimmedQuery) ||
          risk.category.toLowerCase().includes(trimmedQuery)
        ) {
          riskResults.push({
            contract,
            riskTitle: risk.title,
            severity: risk.severity,
          });
        }
      });
    });
  }

  const totalResultsCount = 
    contractResults.length + intelligenceResults.length + clauseResults.length + obligationResults.length + riskResults.length;

  const handleSelectContract = (contractId: string, tab: ContractDetailTab = 'overview') => {
    setIsSearchOpen(false);
    selectContract(contractId, tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-[#0e1320] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Global Intelligence Search"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-[#131929]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, counterparties, clauses, obligations, risk terms..."
            className="w-full py-3.5 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 ml-2">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {trimmedQuery.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">Global Intelligence Index</p>
              <p className="text-slate-400 max-w-sm mx-auto mb-4">
                Type keywords like "indemnification", "Northstar", "renewal", "SLA", or counterparty names.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Northstar', 'Liability Cap', 'Termination', 'SLA Credits', 'Vertex'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <p className="text-sm font-semibold text-slate-300 mb-1">No intelligence matches found</p>
              <p className="text-slate-400 max-w-xs mx-auto">
                No matching contracts, clauses, obligations, or counterparties found for "{query}".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Contracts Matches */}
              {contractResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contracts ({contractResults.length})</span>
                  </div>
                  <div className="space-y-1">
                    {contractResults.map(contract => (
                      <button
                        key={contract.id}
                        onClick={() => handleSelectContract(contract.id, 'overview')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-800/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                            {contract.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{contract.counterparty.name}</span>
                            <span>•</span>
                            <span>{contract.type}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Intelligence Matches */}
              {intelligenceResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contract Intelligence Matches ({intelligenceResults.length})</span>
                  </div>
                  <div className="space-y-1">
                    {intelligenceResults.slice(0, 4).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectContract(item.contract.id, 'overview')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-800/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                              {item.field}
                            </span>
                            {item.citation && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-cyan-300">
                                {item.citation}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {item.value}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Contract: {item.contract.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clauses Matches */}
              {clauseResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Clauses & Citations ({clauseResults.length})</span>
                  </div>
                  <div className="space-y-1">
                    {clauseResults.slice(0, 4).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectContract(item.contract.id, 'clauses')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-800/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                              {item.clauseTitle}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                              {item.section}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            In {item.contract.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Obligations Matches */}
              {obligationResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Obligations ({obligationResults.length})</span>
                  </div>
                  <div className="space-y-1">
                    {obligationResults.slice(0, 3).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectContract(item.contract.id, 'obligations')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-800/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                            {item.obligationTitle}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Due {item.dueDate}</span>
                            <span>•</span>
                            <span>{item.contract.name}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Flags Matches */}
              {riskResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Risk Alerts ({riskResults.length})</span>
                  </div>
                  <div className="space-y-1">
                    {riskResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectContract(item.contract.id, 'overview')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-800/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-semibold text-amber-300 group-hover:text-amber-200">
                            {item.riskTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.contract.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-[#121828] text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigates directly to citations and evidence tabs</span>
          </div>
          <span className="font-mono text-cyan-400/80">ContractLens Intelligence</span>
        </div>
      </div>
    </div>
  );
};
