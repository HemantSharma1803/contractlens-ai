/**
 * ContractLens AI - Structural Parsing & Contract Intelligence Normalizer
 * Heuristic legal structure extractor that anchors clauses, obligations, and metadata to verbatim page citations.
 */

import { DocumentPage, DocumentSection, IngestedDocument, DocumentSearchMatch } from '../types/document';
import { 
  Clause, 
  Obligation, 
  ContractMetadata, 
  ContractParty, 
  EvidenceReference, 
  ContractType,
  RiskSeverity,
  ReviewStatus,
  RiskFlag,
  ContractIntelligence
} from '../types/contract';
import { ContractIntelligenceService } from './contractIntelligenceService';

interface ParseDocumentResult {
  sections: DocumentSection[];
  tableOfContents: Array<{ identifier: string; title: string; pageNumber: number }>;
  headings: string[];
  metadata: Partial<ContractMetadata>;
  counterparty: ContractParty;
  ourParty: ContractParty;
  contractType: ContractType;
  clauses: Clause[];
  obligations: Obligation[];
  risks: RiskFlag[];
  intelligence: ContractIntelligence;
}

/**
 * Main structural parser that turns raw paginated text into an indexed legal document structure
 */
export function parseDocumentStructure(
  pages: DocumentPage[],
  fileName: string,
  documentId: string
): ParseDocumentResult {
  const sections: DocumentSection[] = [];
  const headings: string[] = [];
  const tableOfContents: Array<{ identifier: string; title: string; pageNumber: number }> = [];

  // Patterns for detecting legal headings and section numbers
  const sectionRegexes = [
    /^(?:ARTICLE|Article)\s+([IVXLCDM\d]+)[\.:\-\s]+(.*)$/m,
    /^(?:SECTION|Section|SEC\.)\s+(\d+(?:\.\d+)*)[\.:\-\s]+(.*)$/m,
    /^§\s*(\d+(?:\.\d+)*)[\.:\-\s]+(.*)$/m,
    /^(\d+\.\d+(?:\.\d+)*)\s+([A-Z][A-Za-z0-9\s,\-\(\)]+)$/m,
    /^(\d+)\.\s+([A-Z][A-Z\s]{3,40})$/m,
    /^(RECITALS|PREAMBLE|WITNESSETH|BACKGROUND|DEFINITIONS)[\.:\-\s]*$/im,
    /^(IN WITNESS WHEREOF|SIGNATURES|EXECUTED BY)[\.:\-\s]*$/im,
    /^(SCHEDULE|EXHIBIT|APPENDIX)\s+([A-Z0-9]+)[\.:\-\s]+(.*)$/im,
  ];

  // 1. Detect structural sections across each page
  pages.forEach((page) => {
    const pageLines = page.text.split('\n');
    let runningCharIndex = 0;

    pageLines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.length > 3 && trimmed.length < 120) {
        for (const regex of sectionRegexes) {
          const match = trimmed.match(regex);
          if (match) {
            let identifier = '';
            let title = trimmed;
            let type: DocumentSection['type'] = 'section';

            if (/ARTICLE/i.test(trimmed)) {
              identifier = `Article ${match[1] || ''}`.trim();
              title = match[2]?.trim() || trimmed;
              type = 'article';
            } else if (/SECTION|SEC\.|§/i.test(trimmed)) {
              identifier = `Section ${match[1] || ''}`.trim();
              title = match[2]?.trim() || trimmed;
              type = 'section';
            } else if (/RECITALS|PREAMBLE|WITNESSETH/i.test(trimmed)) {
              identifier = trimmed.toUpperCase();
              title = 'Recitals & Intent';
              type = 'recital';
            } else if (/SCHEDULE|EXHIBIT|APPENDIX/i.test(trimmed)) {
              identifier = `${match[1]?.toUpperCase() || 'EXHIBIT'} ${match[2] || ''}`.trim();
              title = match[3]?.trim() || trimmed;
              type = 'exhibit';
            } else if (/WITNESS|SIGNATURE/i.test(trimmed)) {
              identifier = 'Execution';
              title = 'Signatures & Attestation';
              type = 'signature';
            } else if (match[1]) {
              identifier = `§ ${match[1]}`;
              title = match[2]?.trim() || trimmed;
              type = 'section';
            }

            const cleanSnippet = trimmed.slice(0, 160);
            const sec: DocumentSection = {
              id: `sec-${documentId}-p${page.pageNumber}-${sections.length + 1}`,
              identifier: identifier || `Sec ${sections.length + 1}`,
              title: title.replace(/^[\.:\-\s]+/, ''),
              type,
              pageNumber: page.pageNumber,
              startCharIndex: runningCharIndex,
              endCharIndex: runningCharIndex + trimmed.length,
              textSnippet: cleanSnippet,
              fullText: trimmed,
            };

            sections.push(sec);
            headings.push(trimmed);
            tableOfContents.push({
              identifier: sec.identifier,
              title: sec.title,
              pageNumber: page.pageNumber,
            });
            break;
          }
        }
      }
      runningCharIndex += line.length + 1;
    });

    // Attach discovered sections to page
    page.sections = sections.filter(s => s.pageNumber === page.pageNumber);
  });

  const fullContractText = pages.map(p => p.text).join('\n\n');

  // 2. Extract Parties
  const { counterparty, ourParty } = extractParties(fullContractText, pages, documentId, fileName);

  // 3. Extract Metadata
  const metadata = extractMetadata(fullContractText, pages);

  // 4. Infer Contract Type
  const contractType = inferContractType(fileName, fullContractText);

  // 5. Extract Key Clauses with Grounded Citations
  const clauses = extractKeyClauses(pages, documentId, fileName);

  // 6. Extract Key Obligations
  const obligations = extractObligations(pages, documentId, fileName, counterparty.name, ourParty.name);

  // 7. Extract Potential Risks
  const risks = extractRisks(clauses, metadata, documentId);

  // 8. Extract Full Explainable Contract Intelligence
  const pseudoDoc: IngestedDocument = {
    id: documentId,
    contractId: documentId,
    fileName,
    fileSizeBytes: pages.reduce((acc, p) => acc + p.characterCount, 0),
    fileType: fileName.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf',
    sha256Hash: '',
    pageCount: pages.length,
    wordCount: pages.reduce((acc, p) => acc + p.wordCount, 0),
    characterCount: pages.reduce((acc, p) => acc + p.characterCount, 0),
    uploadedAt: new Date().toISOString(),
    pages,
    sections,
    headings,
    rawText: fullContractText,
    tableOfContents,
    extractedMetadata: metadata,
    detectedParties: [ourParty, counterparty],
    extractedClauses: clauses,
    extractedObligations: obligations,
  };

  const intelligence = ContractIntelligenceService.extractIntelligence(pseudoDoc, fileName);

  return {
    sections,
    tableOfContents,
    headings,
    metadata,
    counterparty,
    ourParty,
    contractType,
    clauses,
    obligations,
    risks,
    intelligence,
  };
}

/**
 * Heuristically identifies counterparty and internal party
 */
function extractParties(
  fullText: string,
  pages: DocumentPage[],
  documentId: string,
  fileName: string
): { counterparty: ContractParty; ourParty: ContractParty } {
  let counterpartyName = 'Unidentified counterparty';
  let ourPartyName = 'Unidentified organization';
  let governingJurisdiction = '';

  // Preamble regex: "between [Party A] ... and [Party B]"
  const preambleMatch = fullText.match(
    /(?:between|among|by and between)\s+([A-Z0-9][A-Za-z0-9\s,\.\-&]{2,60}?)(?:,\s*(?:a|an)\s+[A-Za-z\s]+)?\s*(?:\(["'](?:Provider|Vendor|Licensor|Company|Contractor|Party\s*A)["']\))?\s*(?:and|, and)\s+([A-Z0-9][A-Za-z0-9\s,\.\-&]{2,60}?)(?:,\s*(?:a|an)\s+[A-Za-z\s]+)?\s*(?:\(["'](?:Customer|Client|Licensee|Subscriber|Party\s*B)["']\))/i
  );

  if (preambleMatch) {
    const rawParty1 = preambleMatch[1].trim().replace(/,\s*$/, '');
    const rawParty2 = preambleMatch[2].trim().replace(/,\s*$/, '');
    if (rawParty1.length > 2 && rawParty1.length < 50) counterpartyName = rawParty1;
    if (rawParty2.length > 2 && rawParty2.length < 50) ourPartyName = rawParty2;
  } else {
    counterpartyName = 'Unidentified counterparty';
  }

  // Look for jurisdiction
  const stateMatch = fullText.match(/laws of (?:the State of\s+)?([A-Za-z\s]+?)(?:,|;|\.|\s+without)/i);
  if (stateMatch && stateMatch[1].trim().length < 30) {
    governingJurisdiction = stateMatch[1].trim();
  }

  return {
    counterparty: {
      id: `party-counter-${documentId}`,
      name: counterpartyName,
      role: 'provider',
      jurisdiction: governingJurisdiction,

    },
    ourParty: {
      id: `party-our-${documentId}`,
      name: ourPartyName,
      role: 'customer',
      jurisdiction: '',
    },
  };
}

/**
 * Extracts commercial and legal metadata terms
 */
function extractMetadata(fullText: string, pages: DocumentPage[]): Partial<ContractMetadata> {
  const meta: Partial<ContractMetadata> = {
    currency: '',
    autoRenew: false,
  };

  // Effective Date
  const effMatch = fullText.match(/(?:Effective Date|effective as of|dated as of)\s*[:\-\s]+([A-Za-z]+\s+\d{1,2},\s*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
  if (effMatch) {
    meta.effectiveDate = normalizeDateString(effMatch[1]);
  }

  // Term / Expiration
  const expMatch = fullText.match(/(?:expiration date|terminate on|expires on)\s*[:\-\s]+([A-Za-z]+\s+\d{1,2},\s*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
  if (expMatch) {
    meta.expirationDate = normalizeDateString(expMatch[1]);
  }

  // Auto-renewal & notice period
  if (/(?:automatically renew|auto-renew|automatic renewal|renew for successive)/i.test(fullText)) {
    meta.autoRenew = true;
    const noticeMatch = fullText.match(/(?:notice of non-renewal|written notice)\s*(?:at least|no later than)?\s*(\d+)\s*(?:days|calendar days|business days)/i);
    if (noticeMatch) {
        meta.renewalNoticePeriodDays = parseInt(noticeMatch[1], 10);
    }

    if (meta.expirationDate && meta.renewalNoticePeriodDays) {
      const expDate = new Date(meta.expirationDate);
      expDate.setDate(expDate.getDate() - meta.renewalNoticePeriodDays);
      meta.renewalNoticeDeadline = expDate.toISOString().split('T')[0];
    }
  }

  // Governing law
  const govMatch = fullText.match(/laws of (?:the State of\s+)?([A-Za-z\s]+?)(?:,|;|\.|\s+without|\s+excluding)/i);
  if (govMatch) {
    meta.governingLaw = `State of ${govMatch[1].trim()}`;
    meta.jurisdictionVenue = `${govMatch[1].trim()} State & Federal Courts`;
  }

  // Payment terms
  const payMatch = fullText.match(/(?:Net\s*(\d{2,3})|within\s*(\d{2,3})\s*(?:calendar\s*)?days\s*(?:of|after)\s*receipt\s*of\s*invoice)/i);
  if (payMatch) {
    const days = payMatch[1] || payMatch[2];
    meta.paymentTerms = `Net ${days} days`;
  }

  // Liability cap
  const capMatch = fullText.match(/(?:total aggregate liability|maximum liability|aggregate liability shall not exceed)\s*(.*?)(?:\.|\n|;)/i);
  if (capMatch) {
    meta.liabilityCapAmount = capMatch[1].trim().slice(0, 80);
  }


  // Total Contract Value (TCV)
  const valMatch = fullText.match(/\$\s*([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]{2})?)/);
  if (valMatch) {
    meta.totalContractValue = parseFloat(valMatch[1].replace(/,/g, ''));
  }

  return meta;
}

/**
 * Classifies the type of contract
 */
function inferContractType(fileName: string, fullText: string): ContractType {
  const combo = `${fileName} ${fullText.slice(0, 2000)}`.toLowerCase();
  if (combo.includes('data processing') || combo.includes('dpa') || combo.includes('gdpr')) {
    return 'Software License & DPA';
  }
  if (combo.includes('statement of work') || combo.includes('sow')) {
    return 'Statement of Work (SOW)';
  }
  if (combo.includes('master services') || combo.includes('msa')) {
    return 'Master Services Agreement (MSA)';
  }
  if (combo.includes('non-disclosure') || combo.includes('confidentiality agreement') || combo.includes('nda')) {
    return 'Non-Disclosure Agreement (NDA)';
  }
  if (combo.includes('service level') || combo.includes('sla')) {
    return 'Service Level Agreement (SLA)';
  }
  if (combo.includes('vendor') || combo.includes('facility') || combo.includes('procurement')) {
    return 'Vendor Agreement';
  }
  return 'Cloud Services';
}

/**
 * Extracts key legal clauses with verifiable grounding citations to specific pages
 */
function extractKeyClauses(
  pages: DocumentPage[],
  documentId: string,
  fileName: string
): Clause[] {
  const clauseRules: Array<{
    category: Clause['category'];
    title: string;
    keywords: RegExp[];
    riskDefault: RiskSeverity;
    comparisonDefault: Clause['standardComparison'];
  }> = [
    {
      category: 'Limitation of Liability',
      title: 'Limitation of Aggregate Liability & Exclusion of Damages',
      keywords: [/limitation of liability/i, /aggregate liability/i, /in no event shall either party be liable/i],
      riskDefault: 'high',
      comparisonDefault: 'standard',
    },
    {
      category: 'Indemnification',
      title: 'Mutual Indemnification & Defense Covenants',
      keywords: [/indemnif/i, /defend and hold harmless/i, /indemnity/i],
      riskDefault: 'medium',
      comparisonDefault: 'standard',
    },
    {
      category: 'Termination',
      title: 'Term, Non-Renewal, & Termination for Cause',
      keywords: [/termination for cause/i, /term and termination/i, /termination for convenience/i, /right to terminate/i],
      riskDefault: 'medium',
      comparisonDefault: 'standard',
    },
    {
      category: 'Confidentiality',
      title: 'Confidentiality Obligations & Non-Disclosure',
      keywords: [/confidential information/i, /duty of confidentiality/i, /standard of care to protect/i],
      riskDefault: 'low',
      comparisonDefault: 'standard',
    },
    {
      category: 'Intellectual Property',
      title: 'Ownership of Pre-Existing IP & Work Product',
      keywords: [/intellectual property rights/i, /ownership of deliverables/i, /work made for hire/i, /proprietary rights/i],
      riskDefault: 'medium',
      comparisonDefault: 'standard',
    },
    {
      category: 'Governing Law',
      title: 'Governing Law, Jurisdiction, & Dispute Resolution',
      keywords: [/governing law/i, /jurisdiction and venue/i, /dispute resolution/i],
      riskDefault: 'low',
      comparisonDefault: 'standard',
    },
    {
      category: 'Data Protection & Security',
      title: 'Security Safeguards, Audit Rights, & Breach Notification',
      keywords: [/data protection/i, /security incidents/i, /breach notification/i, /technical and organizational measures/i],
      riskDefault: 'high',
      comparisonDefault: 'standard',
    },
    {
      category: 'Payment Terms',
      title: 'Fee Invoicing, Taxes, & Late Interest',
      keywords: [/fees and payment/i, /invoicing/i, /payment terms/i, /taxes and duties/i],
      riskDefault: 'low',
      comparisonDefault: 'standard',
    },
  ];

  const clauses: Clause[] = [];

  clauseRules.forEach((rule) => {
    let bestMatch: {
      page: DocumentPage;
      snippet: string;
      sectionRef: string;
      confidence: number;
    } | null = null;

    for (const page of pages) {
      for (const kw of rule.keywords) {
        const match = page.text.match(kw);
        if (match && match.index !== undefined) {
          // Extract sentence or 200-char context window
          const start = Math.max(0, match.index - 40);
          const end = Math.min(page.text.length, match.index + 220);
          const rawSnippet = page.text.slice(start, end).replace(/\s+/g, ' ').trim();
          
          // Find matching section on this page if available
          const sec = page.sections.find(s => s.pageNumber === page.pageNumber);
          const sectionRef = sec ? sec.identifier : `Page ${page.pageNumber}`;

          bestMatch = {
            page,
            snippet: rawSnippet,
            sectionRef,
            confidence: 0.94,
          };
          break;
        }
      }
      if (bestMatch) break;
    }

    if (bestMatch) {
      const evidenceRef: EvidenceReference = {
        id: `ev-${documentId}-${clauses.length + 1}`,
        documentId,
        documentName: fileName,
        pageNumber: bestMatch.page.pageNumber,
        sectionIdentifier: bestMatch.sectionRef,
        textSnippet: bestMatch.snippet,
        confidenceScore: bestMatch.confidence,
        verifiedByHuman: false,
      };

      clauses.push({
        id: `cl-${documentId}-${clauses.length + 1}`,
        category: rule.category,
        title: rule.title,
        sectionReference: bestMatch.sectionRef,
        originalText: bestMatch.snippet,
        standardComparison: rule.comparisonDefault,
        summary: `Standard ${rule.category} provisions detected on Page ${bestMatch.page.pageNumber}. Contains explicit operational boundaries.`,
        riskLevel: rule.riskDefault,
        evidenceRef,
        reviewStatus: 'needs_review',
        reviewNotes: 'Auto-extracted from primary document source text.',
      });
    }
  });

  return clauses;
}

/**
 * Extracts action-oriented obligations with responsible party mapping
 */
function extractObligations(
  pages: DocumentPage[],
  documentId: string,
  fileName: string,
  counterpartyName: string,
  ourPartyName: string
): Obligation[] {
  const obligationPatterns = [
    {
      regex: /(?:Customer|Licensee|Client)\s+shall\s+pay\s+(.*?)(?:\.|\n)/i,
      category: 'Payment' as const,
      title: 'Fee Payment & Invoicing Fulfillment',
      party: ourPartyName,
      recipient: counterpartyName,
      priority: 'high' as const,
    },
    {
      regex: /(?:Vendor|Provider|Licensor)\s+shall\s+(?:maintain|provide|deliver)\s+(.*?)(?:\.|\n)/i,
      category: 'Operational' as const,
      title: 'Service Delivery & Availability Maintenance',
      party: counterpartyName,
      recipient: ourPartyName,
      priority: 'medium' as const,
    },
    {
      regex: /(?:notify|provide written notice)\s+(?:within|no later than)\s+(\d+\s*(?:business|calendar)?\s*days)(.*?)(?:\.|\n)/i,
      category: 'Notice' as const,
      title: 'Mandatory Incident or Breach Notice Window',
      party: counterpartyName,
      recipient: ourPartyName,
      priority: 'urgent' as const,
    },
    {
      regex: /(?:maintain|implement)\s+(?:administrative|physical|technical)\s+safeguards(.*?)(?:\.|\n)/i,
      category: 'Security / Audit' as const,
      title: 'SOC2 & Technical Security Safeguards Maintenance',
      party: counterpartyName,
      recipient: ourPartyName,
      priority: 'high' as const,
    },
  ];

  const obligations: Obligation[] = [];

  obligationPatterns.forEach((pat, idx) => {
    for (const page of pages) {
      const match = page.text.match(pat.regex);
      if (match) {
        const snippet = match[0].trim().slice(0, 200);
        const evidenceRef: EvidenceReference = {
          id: `ev-ob-${documentId}-${idx + 1}`,
          documentId,
          documentName: fileName,
          pageNumber: page.pageNumber,
          sectionIdentifier: `Page ${page.pageNumber}`,
          textSnippet: snippet,
          confidenceScore: 0.92,
        };

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + (idx + 1) * 30);

        obligations.push({
          id: `ob-${documentId}-${idx + 1}`,
          contractId: documentId,
          title: pat.title,
          description: snippet,
          responsibleParty: pat.party,
          recipientParty: pat.recipient,
          dueDate: futureDate.toISOString().split('T')[0],
          recurrence: idx === 0 ? 'monthly' : 'annual',
          status: 'pending',
          priority: pat.priority,
          evidenceRef,
          category: pat.category,
        });
        break;
      }
    }
  });

  return obligations;
}

/**
 * Derives risk flags from extracted clauses and contract terms
 */
function extractRisks(
  clauses: Clause[],
  metadata: Partial<ContractMetadata>,
  documentId: string
): RiskFlag[] {
  const risks: RiskFlag[] = [];

  if (metadata.autoRenew) {
    risks.push({
      id: `risk-${documentId}-1`,
      contractId: documentId,
      title: 'Auto-Renewal Notice Cutoff Window',
      category: 'Term & Renewal',
      severity: 'medium',
      description: metadata.renewalNoticePeriodDays
        ? `The indexed agreement contains an automatic-renewal provision with a ${metadata.renewalNoticePeriodDays}-day notice period.`
        : 'The indexed agreement contains an automatic-renewal provision; the notice period was not reliably identified.',
      suggestedAction: `Ensure formal non-renewal notice is delivered prior to ${metadata.renewalNoticeDeadline || 'expiration deadline'}.`,
      reviewed: false,
    });
  }

  const liabClause = clauses.find(c => c.category === 'Limitation of Liability');
  if (liabClause) {
    risks.push({
      id: `risk-${documentId}-2`,
      contractId: documentId,
      title: 'Aggregate Liability Cap Review',
      category: 'Financial Exposure',
      severity: 'high',
      description: `A limitation-of-liability provision was identified in the source document. The exact cap and any exceptions should be verified against the cited text.`,
      suggestedAction: 'Review the cited limitation-of-liability provision and verify its cap, exclusions, and carve-outs against the executed agreement.',
      reviewed: false,
      clauseRefId: liabClause.id,
    });
  }

  return risks;
}

function normalizeDateString(dateStr: string): string {
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  } catch (e) {
    // fallback
  }
  return '';
}

/**
 * Searches across document pages and returns exact snippet matches with page numbers
 */
export function searchDocumentContent(
  pages: DocumentPage[],
  query: string
): DocumentSearchMatch[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const matches: DocumentSearchMatch[] = [];

  pages.forEach((page) => {
    const lowerText = page.text.toLowerCase();
    let pos = 0;
    while ((pos = lowerText.indexOf(q, pos)) !== -1) {
      const start = Math.max(0, pos - 45);
      const end = Math.min(page.text.length, pos + q.length + 65);
      const snippet = (start > 0 ? '...' : '') + page.text.slice(start, end).replace(/\s+/g, ' ') + (end < page.text.length ? '...' : '');

      const sec = page.sections.find(s => s.pageNumber === page.pageNumber);

      matches.push({
        pageNumber: page.pageNumber,
        sectionIdentifier: sec?.identifier || `Page ${page.pageNumber}`,
        snippet,
        matchIndex: pos,
        matchLength: q.length,
      });

      pos += q.length;
      if (matches.length >= 50) break; // limit to 50 results for performance
    }
  });

  return matches;
}
