import React, { useState, useEffect } from 'react';
import { 
  FileSearch, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  AlertCircle,
  Filter,
  Eye,
  BookOpen
} from 'lucide-react';
import { IngestedDocument } from '../../types/document';
import { Contract, EvidenceReference, Clause, Obligation } from '../../types/contract';
import { DocumentViewer } from './DocumentViewer';
import { RiskBadge } from '../common/Badge';

interface EvidenceViewerProps {
  contract: Contract;
  document?: IngestedDocument | null;
  initialCitationId?: string | null;
  onUpdateClauseVerification?: (clauseId: string, verified: boolean) => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  contract,
  document,
  initialCitationId,
  onUpdateClauseVerification,
}) => {
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(
    initialCitationId || contract.clauses[0]?.evidenceRef?.id || null
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'intelligence' | 'clauses' | 'obligations'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCitationId) {
      setSelectedCitationId(initialCitationId);
    }
  }, [initialCitationId]);

  // Compile intelligence-derived citations
  const intelligenceCitations: Array<{
    id: string;
    type: 'intelligence';
    title: string;
    category: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    evidenceRef: EvidenceReference;
    verified: boolean;
  }> = [];

  if (contract.intelligence) {
    // Parties
    contract.intelligence.parties.forEach(p => {
      if (p.sourceReference) {
        intelligenceCitations.push({
          id: p.sourceReference.id,
          type: 'intelligence',
          title: `Party: ${p.name} (${p.role})`,
          category: 'Parties',
          riskLevel: 'low',
          evidenceRef: p.sourceReference,
          verified: !!p.sourceReference.verifiedByHuman,
        });
      }
    });

    // Dates
    if (contract.intelligence.effectiveDate.sourceReference) {
      intelligenceCitations.push({
        id: contract.intelligence.effectiveDate.sourceReference.id,
        type: 'intelligence',
        title: `Effective Date: ${contract.intelligence.effectiveDate.normalizedDate || contract.intelligence.effectiveDate.originalText}`,
        category: 'Dates',
        riskLevel: 'low',
        evidenceRef: contract.intelligence.effectiveDate.sourceReference,
        verified: !!contract.intelligence.effectiveDate.sourceReference.verifiedByHuman,
      });
    }

    if (contract.intelligence.expirationDate.sourceReference) {
      intelligenceCitations.push({
        id: contract.intelligence.expirationDate.sourceReference.id,
        type: 'intelligence',
        title: `Expiration Date: ${contract.intelligence.expirationDate.normalizedDate || contract.intelligence.expirationDate.originalText}`,
        category: 'Dates',
        riskLevel: 'medium',
        evidenceRef: contract.intelligence.expirationDate.sourceReference,
        verified: !!contract.intelligence.expirationDate.sourceReference.verifiedByHuman,
      });
    }

    // Commercial terms
    contract.intelligence.commercialTerms.forEach(c => {
      intelligenceCitations.push({
        id: c.sourceReference.id,
        type: 'intelligence',
        title: `Commercial: ${c.label}`,
        category: 'Commercial Terms',
        riskLevel: 'medium',
        evidenceRef: c.sourceReference,
        verified: !!c.sourceReference.verifiedByHuman,
      });
    });

    // Termination provisions
    contract.intelligence.terminationProvisions.forEach(t => {
      intelligenceCitations.push({
        id: t.sourceReference.id,
        type: 'intelligence',
        title: `Termination: ${t.title}`,
        category: 'Termination',
        riskLevel: 'high',
        evidenceRef: t.sourceReference,
        verified: !!t.sourceReference.verifiedByHuman,
      });
    });

    // Clause presences
    contract.intelligence.allClausePresences.forEach(cp => {
      if (cp.status === 'present' && cp.sourceReferences[0]) {
        // avoid duplicates if already present
        const ref = cp.sourceReferences[0];
        if (!intelligenceCitations.some(c => c.id === ref.id)) {
          intelligenceCitations.push({
            id: ref.id,
            type: 'intelligence',
            title: `Clause Presence: ${cp.category}`,
            category: cp.category,
            riskLevel: 'low',
            evidenceRef: ref,
            verified: !!ref.verifiedByHuman,
          });
        }
      }
    });
  }

  // Segment 4: Detected Clause Intelligence Citations
  const detectedClauseCitations: Array<{
    id: string;
    type: 'clause';
    title: string;
    category: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    evidenceRef: EvidenceReference;
    clauseId?: string;
    verified: boolean;
  }> = [];

  if (contract.detectedClauses) {
    contract.detectedClauses.forEach(dc => {
      (dc.sourceReferences || []).forEach((ref: EvidenceReference) => {
        if (!detectedClauseCitations.some(c => c.id === ref.id)) {
          detectedClauseCitations.push({
            id: ref.id,
            type: 'clause',
            title: `Clause: ${dc.category} (${dc.title})`,
            category: dc.category,
            riskLevel: dc.status === 'REVIEW_REQUIRED' ? 'high' : 'low',
            evidenceRef: ref,
            clauseId: dc.clauseId,
            verified: !!ref.verifiedByHuman,
          });
        }
      });
    });
  }

  // Compile all citations across the contract
  const clauseCitations = contract.clauses.map(c => ({
    id: c.evidenceRef.id,
    type: 'clause' as const,
    title: c.title,
    category: c.category,
    riskLevel: c.riskLevel,
    evidenceRef: c.evidenceRef,
    clauseId: c.id,
    verified: c.evidenceRef.verifiedByHuman || c.reviewStatus === 'verified',
  }));

  const obligationCitations = contract.obligations
    .filter(o => o.evidenceRef)
    .map(o => ({
      id: o.evidenceRef!.id,
      type: 'obligation' as const,
      title: o.title,
      category: o.category,
      riskLevel: o.priority === 'urgent' ? 'critical' : o.priority === 'high' ? 'high' : 'medium',
      evidenceRef: o.evidenceRef!,
      obligationId: o.id,
      verified: false,
    }));

  const allCitations = [
    ...intelligenceCitations, 
    ...detectedClauseCitations, 
    ...clauseCitations, 
    ...obligationCitations
  ];
  const filteredCitations = allCitations.filter(item => {
    if (activeFilter === 'intelligence') return item.type === 'intelligence';
    if (activeFilter === 'clauses') return item.type === 'clause';
    if (activeFilter === 'obligations') return item.type === 'obligation';
    return true;
  });

  const activeCitationItem = allCitations.find(c => c.id === selectedCitationId) || allCitations[0];

  const handleCopyCitation = (item: typeof allCitations[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const cite = `"${item.evidenceRef.textSnippet}" — ${item.evidenceRef.documentName}, Page ${item.evidenceRef.pageNumber}, ${item.evidenceRef.sectionIdentifier}`;
    navigator.clipboard.writeText(cite);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // If no document model exists (e.g. initial demo before ingestion), build synthetic document representation
  const activeDocument: IngestedDocument = document || {
    id: `doc-${contract.id}`,
    contractId: contract.id,
    fileName: contract.fileInfo.fileName,
    fileSizeBytes: contract.fileInfo.fileSizeBytes,
    fileType: contract.fileInfo.format === 'DOCX' ? 'docx' : 'pdf',
    sha256Hash: contract.versions[0]?.sha256Checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    pageCount: contract.fileInfo.pageCount,
    wordCount: contract.fileInfo.pageCount * 450,
    characterCount: contract.fileInfo.pageCount * 2800,
    uploadedAt: contract.fileInfo.uploadedAt,
    sections: contract.clauses.map((c, i) => ({
      id: `sec-${i}`,
      identifier: c.sectionReference,
      title: c.title,
      type: 'section',
      pageNumber: c.evidenceRef.pageNumber,
      startCharIndex: 0,
      endCharIndex: c.originalText.length,
      textSnippet: c.evidenceRef.textSnippet,
      fullText: c.originalText,
    })),
    headings: contract.clauses.map(c => `${c.sectionReference} ${c.title}`),
    rawText: contract.clauses.map(c => `[Page ${c.evidenceRef.pageNumber}] ${c.sectionReference}: ${c.originalText}`).join('\n\n'),
    tableOfContents: contract.clauses.map(c => ({
      identifier: c.sectionReference,
      title: c.title,
      pageNumber: c.evidenceRef.pageNumber,
    })),
    pages: Array.from({ length: contract.fileInfo.pageCount }).map((_, idx) => {
      const pageNum = idx + 1;
      const clausesOnPage = contract.clauses.filter(c => c.evidenceRef.pageNumber === pageNum);
      const pageContent = clausesOnPage.length > 0
        ? clausesOnPage.map(c => `${c.sectionReference} ${c.title}\n\n${c.originalText}`).join('\n\n---\n\n')
        : `[ Section provisions and operational definitions for ${contract.name} ]\n\nStandard commercial covenants and legal obligations continue on this page.\n\nAll provisions are subject to the Master Services Agreement executed terms.`;

      return {
        pageNumber: pageNum,
        text: pageContent,
        cleanText: pageContent,
        wordCount: 380,
        characterCount: 2200,
        sections: clausesOnPage.map((c, i) => ({
          id: `sec-p${pageNum}-${i}`,
          identifier: c.sectionReference,
          title: c.title,
          type: 'section',
          pageNumber: pageNum,
          startCharIndex: 0,
          endCharIndex: c.originalText.length,
          textSnippet: c.evidenceRef.textSnippet,
          fullText: c.originalText,
        })),
      };
    }),
    extractedMetadata: contract.metadata,
    detectedParties: [contract.counterparty, contract.ourParty],
    extractedClauses: contract.clauses,
    extractedObligations: contract.obligations,
  };

  return (
    <div className="space-y-4">
      {/* Overview header */}
      <div className="p-4 rounded-xl bg-[#0e1320] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Evidence Grounding & Verbatim Citations
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every legal conclusion, obligation, and clause is anchored to an exact primary document page and text snippet.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeFilter === 'all' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Citations ({allCitations.length})
          </button>
          <button
            onClick={() => setActiveFilter('intelligence')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeFilter === 'intelligence' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Intelligence ({intelligenceCitations.length})
          </button>
          <button
            onClick={() => setActiveFilter('clauses')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeFilter === 'clauses' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clauses ({clauseCitations.length})
          </button>
          <button
            onClick={() => setActiveFilter('obligations')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeFilter === 'obligations' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Obligations ({obligationCitations.length})
          </button>
        </div>
      </div>

      {/* Split Viewer: Citations Index on Left + Live Document Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Citations List */}
        <div className="lg:col-span-5 space-y-3 max-h-[820px] overflow-y-auto pr-1">
          {filteredCitations.map((item) => {
            const isSelected = selectedCitationId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCitationId(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/90 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-[#0e1320] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">
                      {item.evidenceRef.sectionIdentifier}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                      Page {item.evidenceRef.pageNumber}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-mono uppercase">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {((item.evidenceRef.confidenceScore || 0.94) * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={(e) => handleCopyCitation(item, e)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="Copy verbatim citation"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </h4>
                  {item.riskLevel && (
                    <RiskBadge severity={item.riskLevel as any} />
                  )}
                </div>

                <blockquote className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed italic line-clamp-3">
                  "{item.evidenceRef.textSnippet}"
                </blockquote>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Source: {item.evidenceRef.documentName}</span>
                  {isSelected && (
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Illuminated in Viewer
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Document Viewer displaying Grounded Citation */}
        <div className="lg:col-span-7">
          <DocumentViewer
            document={activeDocument}
            activeEvidenceRef={activeCitationItem?.evidenceRef}
            onClearEvidenceFocus={() => setSelectedCitationId(null)}
            className="h-full min-h-[640px]"
          />
        </div>
      </div>
    </div>
  );
};
