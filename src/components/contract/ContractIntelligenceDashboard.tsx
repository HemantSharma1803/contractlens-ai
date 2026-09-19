/**
 * ContractLens AI - Contract Intelligence Dashboard
 * Segment 3: Explainable, evidence-first intelligence profile view.
 * 
 * Presents structured contract intelligence with verbatim citations,
 * confidence scores, completeness indicators, and 1-click evidence jumping.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar, 
  Scale, 
  HelpCircle, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { 
  Contract, 
  ContractIntelligence, 
  EvidenceReference, 
  StandardClauseCategory, 
  ClausePresence 
} from '../../types/contract';
import { IngestedDocument } from '../../types/document';
import { ConfidenceBadge, ContractStatusBadge, ReviewStatusBadge } from '../common/Badge';
import { ContractIntelligenceService } from '../../services/contractIntelligenceService';

interface ContractIntelligenceDashboardProps {
  contract: Contract;
  document?: IngestedDocument | null;
  onJumpToEvidence: (evidenceRef: EvidenceReference) => void;
}

export const ContractIntelligenceDashboard: React.FC<ContractIntelligenceDashboardProps> = ({
  contract,
  document,
  onJumpToEvidence,
}) => {
  // Ensure we have an intelligence profile (from contract or computed on the fly)
  const intelligence: ContractIntelligence = contract.intelligence || React.useMemo(() => {
    if (document) {
      return ContractIntelligenceService.extractIntelligence(document, contract.fileInfo.fileName);
    }
    // Minimal fallback synthesis
    return ContractIntelligenceService.extractIntelligence({
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
      sections: [],
      headings: [],
      rawText: contract.clauses.map(c => `${c.title} ${c.originalText}`).join('\n\n'),
      tableOfContents: [],
      extractedMetadata: contract.metadata,
      detectedParties: [contract.ourParty, contract.counterparty],
      extractedClauses: contract.clauses,
      extractedObligations: contract.obligations,
    }, contract.fileInfo.fileName);
  }, [contract, document]);

  // Clause filter
  const [clauseFilter, setClauseFilter] = useState<'all' | 'present' | 'not_identified' | 'review'>('all');
  const [expandedClause, setExpandedClause] = useState<StandardClauseCategory | null>(null);
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [activeSnapshotSection, setActiveSnapshotSection] = useState<'purpose' | 'exec_summary' | 'completeness'>('purpose');

  // Filtered standard clauses
  const filteredClauses = intelligence.allClausePresences.filter(c => {
    if (clauseFilter === 'present') return c.status === 'present';
    if (clauseFilter === 'not_identified') return c.status === 'not_identified';
    if (clauseFilter === 'review') return c.status === 'requires_review';
    return true;
  });

  const presentCount = intelligence.allClausePresences.filter(c => c.status === 'present').length;
  const notIdentifiedCount = intelligence.allClausePresences.filter(c => c.status === 'not_identified').length;

  const handleCopyProfile = () => {
    const text = `CONTRACT INTELLIGENCE PROFILE
Contract: ${intelligence.contractTitle}
Type: ${intelligence.contractType} (Confidence: ${intelligence.contractTypeConfidence})
Purpose: ${intelligence.contractPurpose}
Parties: ${intelligence.parties.map(p => `${p.name} (${p.role})`).join(' vs ')}
Term: Effective ${intelligence.effectiveDate.normalizedDate || intelligence.effectiveDate.originalText} to ${intelligence.expirationDate.normalizedDate || intelligence.expirationDate.originalText} (Renewal: ${intelligence.renewalType})
Commercial: ${intelligence.commercialTerms.map(c => `${c.label}: ${c.description}`).join('; ')}
Governing Law: ${intelligence.governingLaw} (${intelligence.jurisdiction})
Clause Coverage: ${presentCount}/19 standard clauses present
Completeness: ${intelligence.completeness.overallPercentage}%`;
    navigator.clipboard.writeText(text);
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  const handleDownloadProfile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(intelligence, null, 2));
    const downloadAnchor = window.document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${contract.name.replace(/\s+/g, '_')}_Intelligence_Profile.json`);
    window.document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Metadata Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
              {intelligence.contractType}
            </span>
            <ConfidenceBadge confidence={intelligence.contractTypeConfidence} score={intelligence.contractTypeScore} size="sm" />
            <ContractStatusBadge status={contract.status} />
            <span className="text-[11px] text-slate-500 font-mono">
              Processed: {new Date(intelligence.extractedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Source: <span className="font-mono text-slate-300">{contract.fileInfo.fileName}</span> ({contract.fileInfo.pageCount} pages, {contract.fileInfo.format})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyProfile}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-slate-100 transition-colors inline-flex items-center gap-1.5"
            title="Copy Structured Markdown Summary"
          >
            {copiedProfile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedProfile ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleDownloadProfile}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors inline-flex items-center gap-1.5"
            title="Export Profile JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Snapshot & Purpose Section */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Contract Intelligence Snapshot</h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveSnapshotSection('purpose')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSnapshotSection === 'purpose' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Purpose
            </button>
            <button
              onClick={() => setActiveSnapshotSection('exec_summary')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSnapshotSection === 'exec_summary' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveSnapshotSection('completeness')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSnapshotSection === 'completeness' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Extraction Health ({intelligence.completeness.overallPercentage}%)
            </button>
          </div>
        </div>

        {/* Content based on selected toggle */}
        {activeSnapshotSection === 'purpose' && (
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block font-mono">
              Grounded Agreement Purpose
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {intelligence.contractPurpose}
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Classified as: <strong className="text-slate-300 font-normal">{intelligence.contractType}</strong></span>
              <span className="font-mono">Confidence: {intelligence.contractTypeConfidence} ({Math.round(intelligence.contractTypeScore * 100)}%)</span>
            </div>
          </div>
        )}

        {activeSnapshotSection === 'exec_summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px] mb-1 font-medium">Agreement Scope</span>
              <p className="text-slate-200">{intelligence.executiveSummary.whatThisContractIs}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px] mb-1 font-medium">Entities Involved</span>
              <p className="text-slate-200">{intelligence.executiveSummary.whoIsInvolved}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px] mb-1 font-medium">Term & Renewal Structure</span>
              <p className="text-slate-200">{intelligence.executiveSummary.term}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px] mb-1 font-medium">Commercial Framework</span>
              <p className="text-slate-200">{intelligence.executiveSummary.commercialModel}</p>
            </div>
            <div className="md:col-span-2 p-3 rounded-lg bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px] mb-1 font-medium">Termination Summary</span>
              <p className="text-slate-200">{intelligence.executiveSummary.termination}</p>
            </div>
          </div>
        )}

        {activeSnapshotSection === 'completeness' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-200">Extraction Completeness Score</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {intelligence.completeness.overallPercentage}% Complete
                  </span>
                </div>
                <p className="text-xs text-slate-400">{intelligence.completeness.summaryText}</p>
              </div>

              {intelligence.completeness.reviewItemsCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium self-start sm:self-auto">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{intelligence.completeness.reviewItemsCount} items require review</span>
                </div>
              )}
            </div>

            {/* Completeness breakdown categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {Object.entries(intelligence.completeness.categories).map(([key, cat]) => (
                <div key={key} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                  <div className="flex justify-center mb-1">
                    {cat.identified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 block truncate">{cat.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{cat.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Parties Section */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Contracting Entities & Roles</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{intelligence.parties.length} entities verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligence.parties.map((party, idx) => (
            <div key={party.id || idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {party.role}
                    </span>
                    <ConfidenceBadge confidence={party.confidence} score={party.confidenceScore} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{party.name}</h4>
                </div>

                {party.sourceReference && (
                  <button
                    onClick={() => onJumpToEvidence(party.sourceReference!)}
                    className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Jump to preamble citation"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {party.jurisdiction && (
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Jurisdiction</span>
                    <span className="font-mono text-slate-200">{party.jurisdiction}</span>
                  </div>
                )}
                {party.address && (
                  <div className="py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Principal Address</span>
                    <span className="text-slate-300 text-[11px]">{party.address}</span>
                  </div>
                )}
                {party.representative && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Signatory / Rep</span>
                    <span className="text-slate-200 font-medium">{party.representative}</span>
                  </div>
                )}
              </div>

              {party.sourceReference?.textSnippet && (
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 italic">
                  "{party.sourceReference.textSnippet}"
                  <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono not-italic">
                    <span>Page {party.sourceReference.pageNumber} · {party.sourceReference.sectionIdentifier}</span>
                    <button
                      onClick={() => onJumpToEvidence(party.sourceReference!)}
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>View evidence</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Key Dates & Term & Renewal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Key Dates */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Key Contractual Dates</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Normalized ISO format</span>
          </div>

          <div className="space-y-3">
            {/* Effective Date */}
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Effective Date</span>
                  <ConfidenceBadge confidence={intelligence.effectiveDate.confidence} score={intelligence.effectiveDate.confidenceScore} />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Original text: <span className="font-mono text-slate-300">"{intelligence.effectiveDate.originalText}"</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-slate-100">
                  {intelligence.effectiveDate.normalizedDate || 'Not identified'}
                </span>
                <button
                  onClick={() => onJumpToEvidence(intelligence.effectiveDate.sourceReference)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono inline-flex items-center gap-1 transition-colors"
                  title="Jump to Effective Date evidence"
                >
                  <span>P.{intelligence.effectiveDate.sourcePage}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Expiration Date */}
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Expiration Date</span>
                  <ConfidenceBadge confidence={intelligence.expirationDate.confidence} score={intelligence.expirationDate.confidenceScore} />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Original text: <span className="font-mono text-slate-300">"{intelligence.expirationDate.originalText}"</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-slate-100">
                  {intelligence.expirationDate.normalizedDate || 'Not identified'}
                </span>
                <button
                  onClick={() => onJumpToEvidence(intelligence.expirationDate.sourceReference)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono inline-flex items-center gap-1 transition-colors"
                  title="Jump to Expiration Date evidence"
                >
                  <span>P.{intelligence.expirationDate.sourcePage}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Execution Date (if present) */}
            {intelligence.executionDate && (
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">Execution / Signing Date</span>
                    <ConfidenceBadge confidence={intelligence.executionDate.confidence} score={intelligence.executionDate.confidenceScore} />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Original text: <span className="font-mono text-slate-300">"{intelligence.executionDate.originalText}"</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-300">
                    {intelligence.executionDate.normalizedDate || 'Identified in signature block'}
                  </span>
                  <button
                    onClick={() => onJumpToEvidence(intelligence.executionDate!.sourceReference)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono inline-flex items-center gap-1 transition-colors"
                  >
                    <span>P.{intelligence.executionDate.sourcePage}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Renewal Notice Cutoff Deadline */}
            {intelligence.allExtractedDates.find(d => d.type === 'renewal_notice_deadline') && (() => {
              const noticeDate = intelligence.allExtractedDates.find(d => d.type === 'renewal_notice_deadline')!;
              return (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-300">Renewal Notice Cutoff</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 border border-amber-700">
                        Critical Window
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {noticeDate.relativeCondition || noticeDate.originalText}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-amber-300">
                      {noticeDate.normalizedDate || '45 Days Prior'}
                    </span>
                    <button
                      onClick={() => onJumpToEvidence(noticeDate.sourceReference)}
                      className="px-2 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-xs text-amber-200 font-mono inline-flex items-center gap-1 transition-colors"
                    >
                      <span>P.{noticeDate.sourcePage}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Column: Term & Renewal Mechanism */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Term & Renewal Mechanism</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {intelligence.renewalType}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Renewal Mechanism</span>
                <span className={`font-semibold capitalize ${
                  intelligence.renewalType === 'automatic' ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {intelligence.renewalType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Notice Period Required</span>
                <span className="font-mono text-slate-200">{intelligence.renewalNoticePeriod}</span>
              </div>
              {intelligence.renewalDuration && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Renewal Term Duration</span>
                  <span className="text-slate-200">{intelligence.renewalDuration}</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <span className="font-semibold text-slate-300 block">Notice Delivery Rules:</span>
              <p className="leading-relaxed">{intelligence.noticeRequirements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Commercial & Payment Terms */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Commercial & Financial Terms</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Currency: {intelligence.currency}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {intelligence.commercialTerms.map((term, i) => (
            <div key={term.id || i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                    {term.type.replace(/_/g, ' ')}
                  </span>
                  <ConfidenceBadge confidence={term.confidence} score={term.confidenceScore} />
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{term.label}</h4>
                {term.amount && (
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    {typeof term.amount === 'number' ? `$${term.amount.toLocaleString()}` : term.amount} {term.currency || intelligence.currency}
                    {term.frequency && <span className="text-xs text-slate-400 font-normal"> / {term.frequency}</span>}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{term.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>P.{term.sourceReference.pageNumber} · {term.sourceReference.sectionIdentifier}</span>
                <button
                  onClick={() => onJumpToEvidence(term.sourceReference)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs"
                >
                  <span>Citation</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Termination Intelligence & Governing Law */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Termination Intelligence */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Termination Intelligence</h3>
            </div>
            <span className="text-xs text-slate-400">Neutral Provisions</span>
          </div>

          <div className="space-y-3">
            {intelligence.terminationProvisions.map((term, i) => (
              <div key={term.id || i} className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{term.title}</span>
                    <ConfidenceBadge confidence={term.confidence} score={term.confidenceScore} />
                  </div>
                  <button
                    onClick={() => onJumpToEvidence(term.sourceReference)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono inline-flex items-center gap-1"
                  >
                    <span>P.{term.sourceReference.pageNumber}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {term.noticePeriod && (
                    <div className="text-slate-400">
                      Notice: <strong className="text-slate-200 font-normal">{term.noticePeriod}</strong>
                    </div>
                  )}
                  {term.curePeriod && (
                    <div className="text-slate-400">
                      Cure Window: <strong className="text-slate-200 font-normal">{term.curePeriod}</strong>
                    </div>
                  )}
                </div>

                {term.condition && (
                  <p className="text-[11px] text-slate-400">{term.condition}</p>
                )}

                {term.consequences && (
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="font-semibold text-slate-300">Consequences:</span> {term.consequences}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Governing Law & Jurisdiction */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Governing Law & Venue</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Jurisdiction</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Governing Law</span>
                <span className="font-semibold text-slate-200">{intelligence.governingLaw}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Jurisdiction Venue</span>
                <span className="text-slate-200 text-right">{intelligence.venue || intelligence.jurisdiction}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block text-[11px] mb-1">Dispute Resolution Mechanism</span>
                <p className="text-slate-200 text-xs leading-relaxed">{intelligence.disputeResolution}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                Jurisdiction is strictly extracted from the governing law and dispute covenants. Addresses in preambles do not override formal choice-of-law provisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 19 Standard Clauses Coverage & Verification Matrix */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Standard Clause Coverage Matrix (19 Categories)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified legal provisions anchored to exact page citations and section headings.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setClauseFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clauseFilter === 'all' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All (19)
            </button>
            <button
              onClick={() => setClauseFilter('present')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clauseFilter === 'present' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              onClick={() => setClauseFilter('not_identified')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clauseFilter === 'not_identified' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Not Identified ({notIdentifiedCount})
            </button>
          </div>
        </div>

        {/* 19 Clauses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredClauses.map((clause) => {
            const isPresent = clause.status === 'present';
            const isExpanded = expandedClause === clause.category;
            const ref = clause.sourceReferences[0];

            return (
              <div 
                key={clause.category}
                className={`p-3.5 rounded-xl border transition-all ${
                  isPresent 
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-900/30 border-slate-800/50 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-200 truncate">{clause.category}</span>
                  {isPresent ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-mono">
                      <Check className="w-3 h-3 mr-0.5" /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      Not Identified
                    </span>
                  )}
                </div>

                {isPresent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{clause.sectionIdentifier || 'General Article'}</span>
                      {ref && (
                        <button
                          onClick={() => onJumpToEvidence(ref)}
                          className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                          title="Jump to primary document page"
                        >
                          <span>Page {clause.pageNumber}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {clause.snippet && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-relaxed">
                        "{clause.snippet}"
                      </p>
                    )}

                    {clause.summary && (
                      <div className="text-[10px] text-slate-300 font-medium">
                        {clause.summary}
                      </div>
                    )}
                  </div>
                )}

                {!isPresent && (
                  <p className="text-[11px] text-slate-500">
                    No explicit heading or keyword pattern identified in document body.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Items Requiring Legal Review / Attention */}
      {intelligence.executiveSummary.itemsRequiringReview.length > 0 && (
        <div className="p-5 rounded-xl bg-[#0e1320] border border-amber-900/40 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Items Flagged for Legal Attention & Operational Review</h3>
          </div>
          <div className="space-y-2">
            {intelligence.executiveSummary.itemsRequiringReview.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/50 text-xs text-amber-200/90 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
