import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  SlidersHorizontal,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  ClauseIntelligenceRecord, 
  ClauseIntelligenceStatus, 
  ClauseTaxonomyGroup,
  ClauseDetectionConfidence
} from '../../types/clause';
import { Contract } from '../../types/contract';
import { IngestedDocument } from '../../types/document';
import { ClauseCard } from './ClauseCard';
import { ClauseDetailModal } from './ClauseDetailModal';
import { ClauseDetectionEngine } from '../../services/clauseDetectionEngine';

interface ClauseExplorerProps {
  contract: Contract;
  document?: IngestedDocument | null;
  onNavigateToEvidence: (citationId?: string, pageNumber?: number) => void;
}

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({
  contract,
  document,
  onNavigateToEvidence,
}) => {
  // Load or detect clauses
  const clauses = useMemo(() => {
    // 1. If contract has detected clauses already attached (e.g. demo contracts or persisted)
    if (contract.detectedClauses && contract.detectedClauses.length > 0) {
      return contract.detectedClauses;
    }

    // 2. If an IngestedDocument is supplied (e.g. newly parsed contract)
    if (document && document.pages && document.pages.length > 0) {
      return ClauseDetectionEngine.detectClauses(document, contract.id);
    }

    // 3. Fallback: synthesize a pseudo IngestedDocument from existing contract clauses
    const pseudoDoc: IngestedDocument = {
      id: `doc-${contract.id}`,
      contractId: contract.id,
      fileName: contract.fileInfo.fileName,
      fileSizeBytes: contract.fileInfo.fileSizeBytes,
      fileType: contract.fileInfo.format === 'DOCX' ? 'docx' : 'pdf',
      sha256Hash: '',
      pageCount: contract.fileInfo.pageCount,
      wordCount: contract.fileInfo.pageCount * 450,
      characterCount: contract.fileInfo.pageCount * 2800,
      uploadedAt: contract.fileInfo.uploadedAt,
      pages: [],
      sections: contract.clauses.map((c, i) => ({
        id: `sec-${c.id}`,
        identifier: c.sectionReference || `§${i + 1}`,
        title: c.title,
        pageNumber: c.evidenceRef?.pageNumber || Math.min(i + 2, contract.fileInfo.pageCount),
        type: 'section' as const,
        startCharIndex: 0,
        endCharIndex: c.originalText.length,
        textSnippet: c.summary,
        fullText: `${c.title}\n${c.originalText}\n${c.summary}`
      })),
      headings: [],
      rawText: contract.clauses.map(c => `${c.title} ${c.originalText}`).join('\n\n'),
      tableOfContents: [],
      extractedMetadata: contract.metadata,
      detectedParties: [contract.ourParty, contract.counterparty],
      extractedClauses: contract.clauses,
      extractedObligations: contract.obligations,
    };

    return ClauseDetectionEngine.detectClauses(pseudoDoc, contract.id);
  }, [contract, document]);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ClauseIntelligenceStatus>('ALL');
  const [groupFilter, setGroupFilter] = useState<'ALL' | ClauseTaxonomyGroup>('ALL');
  const [sortBy, setSortBy] = useState<'category' | 'confidence' | 'page' | 'status'>('status');
  const [selectedClause, setSelectedClause] = useState<ClauseIntelligenceRecord | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Statistics
  const totalCount = clauses.length;
  const presentCount = clauses.filter(c => c.status === 'PRESENT').length;
  const reviewCount = clauses.filter(c => c.status === 'REVIEW_REQUIRED').length;
  const notIdentifiedCount = clauses.filter(c => c.status === 'NOT_IDENTIFIED').length;

  // Filter & Search
  const filteredClauses = useMemo(() => {
    let result = [...clauses];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Taxonomy group filter
    if (groupFilter !== 'ALL') {
      result = result.filter(c => c.group === groupFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => {
        // Support search by page (e.g. "page 14", "p. 14", "14")
        const pageMatch = q.startsWith('page ') || q.startsWith('p.') || q.startsWith('p ');
        if (pageMatch) {
          const targetNum = parseInt(q.replace(/[^0-9]/g, ''), 10);
          if (c.pageNumber === targetNum) return true;
        }

        return (
          c.category.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.normalizedMeaning.toLowerCase().includes(q) ||
          c.originalText.toLowerCase().includes(q) ||
          (c.sectionIdentifier && c.sectionIdentifier.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'confidence') {
        const confWeight: Record<string, number> = {
          HIGH: 4,
          MEDIUM: 3,
          REVIEW: 2,
          LOW: 1
        };
        return (confWeight[b.confidence] || 0) - (confWeight[a.confidence] || 0);
      }
      if (sortBy === 'page') {
        return (a.pageNumber || 999) - (b.pageNumber || 999);
      }
      if (sortBy === 'status') {
        const statusWeight: Record<string, number> = {
          PRESENT: 3,
          REVIEW_REQUIRED: 2,
          NOT_IDENTIFIED: 1
        };
        const diff = (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0);
        if (diff !== 0) return diff;
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [clauses, statusFilter, groupFilter, searchQuery, sortBy]);

  const handleViewEvidence = (clause: ClauseIntelligenceRecord) => {
    const primaryRef = clause.sourceReferences && clause.sourceReferences.length > 0
      ? clause.sourceReferences[0]
      : null;

    if (primaryRef) {
      onNavigateToEvidence(primaryRef.id, primaryRef.pageNumber);
    } else if (clause.pageNumber) {
      onNavigateToEvidence(undefined, clause.pageNumber);
    }
  };

  const handleCopyCoverageSummary = () => {
    const text = `CLAUSE INTELLIGENCE SUMMARY — ${contract.name}
Total Audited: ${totalCount}
Present: ${presentCount}
Review Required: ${reviewCount}
Not Identified: ${notIdentifiedCount}

PRESENT CLAUSES:
${clauses.filter(c => c.status === 'PRESENT').map(c => `• ${c.category} (${c.title}) - Page ${c.pageNumber || 'N/A'}`).join('\n')}

REVIEW REQUIRED:
${clauses.filter(c => c.status === 'REVIEW_REQUIRED').map(c => `• ${c.category}: ${c.explanation || c.summary}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clauses, null, 2));
    const downloadAnchor = window.document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${contract.name.replace(/\s+/g, '_')}_Clause_Intelligence.json`);
    window.document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0d121e] to-[#0a0d16] border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider border border-cyan-800/80">
                Segment 4 Core
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">Multi-Layer Extraction</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-2">
              Clause Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Detected provisions grounded in the source document. Every finding maps to verbatim text with extraction certainty indicators.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCoverageSummary}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-slate-100 flex items-center gap-1.5 transition-colors"
              title="Copy clause briefing"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Briefing'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-slate-100 flex items-center gap-1.5 transition-colors"
              title="Download structured JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Summary Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Total Audited
            </span>
            <div className="text-xl font-bold font-mono text-slate-100">
              {totalCount}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Taxonomy provisions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-0.5">
                Present
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300">
              {presentCount}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono">Grounded provisions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-0.5">
                Review Required
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">
              {reviewCount}
            </div>
            <span className="text-[10px] text-amber-500/80 font-mono">Ambiguous signals</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                Not Identified
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-400">
              {notIdentifiedCount}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">No reliable signals</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters, Sorting */}
      <div className="p-4 rounded-xl bg-[#0e1320] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clause category, wording, title, or page (e.g. 'liability', 'Page 14')..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'PRESENT', 'REVIEW_REQUIRED', 'NOT_IDENTIFIED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All' : st === 'PRESENT' ? 'Present' : st === 'REVIEW_REQUIRED' ? 'Review Required' : 'Not Identified'}
              <span className="ml-1 text-[10px] opacity-70">
                ({st === 'ALL' ? totalCount : st === 'PRESENT' ? presentCount : st === 'REVIEW_REQUIRED' ? reviewCount : notIdentifiedCount})
              </span>
            </button>
          ))}
        </div>

        {/* Taxonomy Group & Sorting Controls */}
        <div className="flex items-center gap-2">
          {/* Group */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Provisions</option>
            <option value="core">Core Taxonomy (21)</option>
            <option value="additional">Additional (29)</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 font-mono">
            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="status">Sort: Status & Confidence</option>
              <option value="category">Sort: Category (A-Z)</option>
              <option value="page">Sort: Source Page Number</option>
              <option value="confidence">Sort: Extraction Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clause Cards Grid */}
      {filteredClauses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClauses.map((clause) => (
            <ClauseCard
              key={clause.clauseId}
              clause={clause}
              onViewEvidence={handleViewEvidence}
              onSelectClause={(c) => setSelectedClause(c)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0e1320] border border-slate-800 space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-200">No matching provisions found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No clauses matched your filter criteria "{searchQuery}". Try modifying your search term or clearing the status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setGroupFilter('ALL');
            }}
            className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Clause Detail Modal */}
      {selectedClause && (
        <ClauseDetailModal
          clause={selectedClause}
          onClose={() => setSelectedClause(null)}
          onViewEvidence={handleViewEvidence}
        />
      )}
    </div>
  );
};
