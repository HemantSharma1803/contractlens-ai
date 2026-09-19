import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  X, 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText
} from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ContractStatusBadge, ReviewStatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ContractType, ContractStatus, ReviewStatus } from '../../types/contract';

export const ContractsPage: React.FC = () => {
  const { 
    contracts, 
    filters, 
    setFilters, 
    clearFilters, 
    selectContract, 
    setIsUploadOpen, 
    loadDemoWorkspace 
  } = useContract();

  // Filter and sort contracts
  const filteredContracts = contracts.filter((contract) => {
    // Search query filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch = 
        contract.name.toLowerCase().includes(q) ||
        contract.counterparty.name.toLowerCase().includes(q) ||
        contract.type.toLowerCase().includes(q) ||
        contract.metadata.governingLaw.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type !== 'all' && contract.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && contract.status !== filters.status) {
      return false;
    }

    // Review status filter
    if (filters.reviewStatus !== 'all' && contract.reviewStatus !== filters.reviewStatus) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    let comp = 0;
    if (filters.sortBy === 'name') {
      comp = a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'counterparty') {
      comp = a.counterparty.name.localeCompare(b.counterparty.name);
    } else if (filters.sortBy === 'expiration') {
      comp = a.metadata.expirationDate.localeCompare(b.metadata.expirationDate);
    } else if (filters.sortBy === 'updated') {
      comp = a.lastUpdated.localeCompare(b.lastUpdated);
    } else if (filters.sortBy === 'status') {
      comp = a.status.localeCompare(b.status);
    }
    return filters.sortOrder === 'asc' ? comp : -comp;
  });

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.type !== 'all' || 
    filters.status !== 'all' || 
    filters.reviewStatus !== 'all';

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Contract Repository</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed agreements with extracted clauses, liability boundaries, and verified citations
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Contract</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#0e1320] border border-slate-800/90 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by contract title, counterparty, governing law..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">All Types</option>
              <option value="Cloud Services">Cloud Services</option>
              <option value="Vendor Agreement">Vendor Agreement</option>
              <option value="Master Services Agreement (MSA)">MSA</option>
              <option value="Software License & DPA">Software License & DPA</option>
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending_review">Pending Review</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>

            {/* Review Status */}
            <select
              value={filters.reviewStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, reviewStatus: e.target.value }))}
              className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified</option>
              <option value="needs_review">Needs Review</option>
              <option value="flagged">Flagged</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="expiration">Sort by Expiration</option>
              <option value="name">Sort by Name</option>
              <option value="counterparty">Sort by Counterparty</option>
              <option value="updated">Sort by Last Updated</option>
            </select>

            {/* View Mode Toggle: Table vs Grid */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'table' }))}
                className={`p-1.5 rounded ${filters.viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                title="Table view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                className={`p-1.5 rounded ${filters.viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{sortedContracts.length}</strong> of {contracts.length} contracts
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-cyan-400">Filtered view active</span>
        )}
      </div>

      {/* Empty State when no contracts match */}
      {sortedContracts.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No contracts match your filters" : "No contracts in repository"}
          description={hasActiveFilters 
            ? "Try broadening your search query, or clear current filters to view all contracts."
            : "Upload your first PDF or DOCX contract agreement to begin extraction."}
          actionText={hasActiveFilters ? "Clear All Filters" : "Upload Contract"}
          onAction={hasActiveFilters ? clearFilters : () => setIsUploadOpen(true)}
          secondaryActionText={contracts.length === 0 ? "Load Demo Contracts" : undefined}
          onSecondaryAction={contracts.length === 0 ? loadDemoWorkspace : undefined}
        />
      ) : filters.viewMode === 'table' ? (
        /* Table View */
        <div className="rounded-xl bg-[#0e1320] border border-slate-800/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#121828] text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4">Contract</th>
                  <th className="py-3 px-3">Counterparty</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Renewal / Exp</th>
                  <th className="py-3 px-3">Review</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    onClick={() => selectContract(contract.id, 'overview')}
                    className="hover:bg-slate-900/70 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                        {contract.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {contract.fileInfo.fileName} • {contract.fileInfo.pageCount} pages
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <div>{contract.counterparty.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{contract.counterparty.jurisdiction}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                        {contract.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <ContractStatusBadge status={contract.status} />
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                      <div>Exp: {contract.metadata.expirationDate}</div>
                      {contract.metadata.renewalNoticeDeadline && (
                        <div className="text-[10px] text-amber-400/90">
                          Notice: {contract.metadata.renewalNoticeDeadline}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <ReviewStatusBadge status={contract.reviewStatus} />
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">
                      {new Date(contract.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-cyan-400 group-hover:text-cyan-300 font-medium text-xs">
                        Open Workspace
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedContracts.map((contract) => (
            <div
              key={contract.id}
              onClick={() => selectContract(contract.id, 'overview')}
              className="p-4 rounded-xl bg-[#0e1320] border border-slate-800/90 hover:border-cyan-800/80 hover:bg-slate-900/60 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <ContractStatusBadge status={contract.status} />
                  <ReviewStatusBadge status={contract.reviewStatus} />
                </div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5">
                  {contract.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {contract.counterparty.name}
                </p>

                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Type</span>
                    <span className="text-slate-200">{contract.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expiration</span>
                    <span className="font-mono text-slate-200">{contract.metadata.expirationDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Clauses Extracted</span>
                    <span className="font-mono text-cyan-400">{contract.clauses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Obligations</span>
                    <span className="font-mono text-slate-200">{contract.obligations.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {contract.fileInfo.format} ({contract.fileInfo.pageCount} pgs)
                </span>
                <span className="text-cyan-400 group-hover:underline font-medium inline-flex items-center gap-1">
                  View Intelligence →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
