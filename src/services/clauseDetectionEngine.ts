/**
 * ContractLens AI - Clause Detection & Evidence Mapping Engine
 * Segment 4: Multi-Layered Deterministic Detection with Provenance Grounding
 * 
 * Pipeline:
 * Document → Sections → Paragraphs → Candidate Detection → Context Analysis
 * → Clause Classification → Evidence Mapping → Confidence → Clause Intelligence Record
 */

import { IngestedDocument, DocumentSection, DocumentPage } from '../types/document';
import { 
  ClauseIntelligenceRecord, 
  ClauseTaxonomyCategory, 
  ClauseIntelligenceStatus, 
  ClauseDetectionConfidence, 
  ClauseDetectionMethod 
} from '../types/clause';
import { EvidenceReference } from '../types/contract';
import { CLAUSE_TAXONOMY_RULES, CategoryDetectionRule } from './clauseTaxonomy';

export class ClauseDetectionEngine {
  /**
   * Main entry point: Analyzes an IngestedDocument and produces a complete
   * suite of ClauseIntelligenceRecords spanning core and active additional categories.
   */
  public static detectClauses(
    doc: IngestedDocument, 
    contractId: string
  ): ClauseIntelligenceRecord[] {
    const records: ClauseIntelligenceRecord[] = [];
    const detectedCategories = new Set<string>();

    // Clean and prepare sections (skip TOC sections to prevent TOC false-positives)
    const validSections = (doc.sections || []).filter(sec => {
      const text = sec.fullText || sec.textSnippet || '';
      const isTOC = /table\s+of\s+contents|contents\s+page/i.test(sec.title) ||
        (sec.pageNumber === 1 && /^\s*(\d+\.?\s+[A-Za-z\s]+[\.\s\d]+)+\s*$/.test(text));
      return !isTOC;
    });

    // Run layered detection for each rule in our taxonomy
    for (const rule of CLAUSE_TAXONOMY_RULES) {
      const match = this.evaluateRuleAgainstDocument(rule, doc, validSections, contractId);
      if (match) {
        records.push(match);
        detectedCategories.add(rule.category);
      }
    }

    // For any Core or relevant Additional taxonomy category not identified,
    // construct a formal NOT_IDENTIFIED record so the auditor has complete coverage transparency
    for (const rule of CLAUSE_TAXONOMY_RULES) {
      if (!detectedCategories.has(rule.category)) {
        records.push(this.createNotIdentifiedRecord(rule, contractId, doc));
      }
    }

    // Sort: PRESENT first, then REVIEW_REQUIRED, then NOT_IDENTIFIED
    return records.sort((a, b) => {
      const score = (s: ClauseIntelligenceStatus) => 
        s === 'PRESENT' ? 3 : s === 'REVIEW_REQUIRED' ? 2 : 1;
      const diff = score(b.status) - score(a.status);
      if (diff !== 0) return diff;
      return a.category.localeCompare(b.category);
    });
  }

  /**
   * Evaluates a single taxonomy rule across the document sections and pages
   */
  private static evaluateRuleAgainstDocument(
    rule: CategoryDetectionRule,
    doc: IngestedDocument,
    sections: DocumentSection[],
    contractId: string
  ): ClauseIntelligenceRecord | null {
    // 1. First pass: Match by section headings (Layer 1)
    for (const section of sections) {
      const text = section.fullText || section.textSnippet || '';
      const headingMatches = rule.typicalHeadings.some(pattern => pattern.test(section.title));
      
      if (headingMatches) {
        // Check for false-positive exclusions in the section content
        const hasExclusion = rule.falsePositiveExclusions.some(exc => exc.test(text));
        if (hasExclusion && !rule.keyPhrases.some(kp => kp.test(text))) {
          continue; // Discard false positive
        }

        // Count contextual key phrase signals in section content (Layer 2)
        const keyPhraseMatches = rule.keyPhrases.filter(kp => kp.test(text)).length;
        const boostMatches = rule.boostPhrases.filter(bp => bp.test(text)).length;

        // Content length and density check
        const isContentSubstantive = text.trim().length > 40;

        let status: ClauseIntelligenceStatus = 'PRESENT';
        let confidence: ClauseDetectionConfidence = 'HIGH';
        let detectionMethod: ClauseDetectionMethod = 'heading_and_context';
        let reviewRequired = false;
        let explanation = `Identified via section heading "${section.title}" confirmed by ${keyPhraseMatches} contextual term(s).`;

        if (!isContentSubstantive || keyPhraseMatches === 0) {
          // Heading exists but content is ambiguous or brief
          status = 'REVIEW_REQUIRED';
          confidence = 'REVIEW';
          reviewRequired = true;
          explanation = `Section title suggests ${rule.displayName}, but substantive operational text requires human review.`;
        } else if (boostMatches > 0 && keyPhraseMatches >= 2) {
          confidence = 'HIGH';
        } else {
          confidence = 'MEDIUM';
        }

        const snippet = this.extractRelevantSnippet(text, rule);
        const originalText = text.trim();
        const normalizedMeaning = rule.generateNormalizedMeaning(originalText, section.title);

        const evidenceRef = this.buildEvidenceReference(
          doc,
          section.pageNumber,
          section.title,
          snippet || originalText.slice(0, 300),
          confidence === 'HIGH' ? 0.95 : confidence === 'MEDIUM' ? 0.82 : 0.65
        );

        return {
          clauseId: `clause-${contractId}-${rule.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          contractId,
          category: rule.category,
          group: rule.group,
          title: section.title || rule.displayName,
          status,
          summary: `${rule.displayName} provision identified in Section "${section.title}".`,
          originalText,
          normalizedMeaning,
          sourceReferences: [evidenceRef],
          confidence,
          detectionMethod,
          reviewRequired,
          detectedAt: new Date().toISOString(),
          sectionIdentifier: section.title,
          pageNumber: section.pageNumber,
          explanation
        };
      }
    }

    // 2. Second pass: Deep Contextual Pattern Detection without explicit heading (Layer 2 & 3)
    for (const section of sections) {
      const text = section.fullText || section.textSnippet || '';
      // Must not match false positive exclusions
      const hasExclusion = rule.falsePositiveExclusions.some(exc => exc.test(text));
      if (hasExclusion) continue;

      const matchedKeyPhrases = rule.keyPhrases.filter(kp => kp.test(text));
      const matchedBoostPhrases = rule.boostPhrases.filter(bp => bp.test(text));

      // Require at least 2 distinct key phrases or 1 key phrase + 1 boost phrase
      const isStrongContext = matchedKeyPhrases.length >= 2 || (matchedKeyPhrases.length >= 1 && matchedBoostPhrases.length >= 1);

      if (isStrongContext && text.trim().length > 60) {
        const snippet = this.extractRelevantSnippet(text, rule);
        const originalText = text.trim();
        const normalizedMeaning = rule.generateNormalizedMeaning(originalText, section.title);

        const isUnambiguous = matchedKeyPhrases.length >= 3 || matchedBoostPhrases.length >= 2;
        const status: ClauseIntelligenceStatus = isUnambiguous ? 'PRESENT' : 'REVIEW_REQUIRED';
        const confidence: ClauseDetectionConfidence = isUnambiguous ? 'MEDIUM' : 'REVIEW';
        const reviewRequired = status === 'REVIEW_REQUIRED';

        const evidenceRef = this.buildEvidenceReference(
          doc,
          section.pageNumber,
          section.title || `Page ${section.pageNumber}`,
          snippet || originalText.slice(0, 300),
          isUnambiguous ? 0.80 : 0.60
        );

        return {
          clauseId: `clause-${contractId}-${rule.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          contractId,
          category: rule.category,
          group: rule.group,
          title: `${rule.displayName} Provision`,
          status,
          summary: `${rule.displayName} terms detected within ${section.title || `Page ${section.pageNumber}`}.`,
          originalText,
          normalizedMeaning,
          sourceReferences: [evidenceRef],
          confidence,
          detectionMethod: 'contextual_pattern',
          reviewRequired,
          detectedAt: new Date().toISOString(),
          sectionIdentifier: section.title,
          pageNumber: section.pageNumber,
          explanation: isUnambiguous 
            ? `Detected via semantic pattern clustering with multiple contextual signatures.`
            : `Potential ${rule.displayName} provision detected, but classification confidence is insufficient for automatic confirmation.`
        };
      }
    }

    // 3. Third pass: Page-level scanning if no sections were parsed
    if (sections.length === 0 && doc.pages && doc.pages.length > 0) {
      for (const page of doc.pages) {
        const matchedKeyPhrases = rule.keyPhrases.filter(kp => kp.test(page.text));
        if (matchedKeyPhrases.length >= 2) {
          const originalText = page.text.slice(0, 800);
          const snippet = this.extractRelevantSnippet(page.text, rule) || originalText.slice(0, 300);
          const normalizedMeaning = rule.generateNormalizedMeaning(originalText);

          const evidenceRef = this.buildEvidenceReference(
            doc,
            page.pageNumber,
            `Page ${page.pageNumber}`,
            snippet,
            0.75
          );

          return {
            clauseId: `clause-${contractId}-${rule.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            contractId,
            category: rule.category,
            group: rule.group,
            title: `${rule.displayName} Provision`,
            status: 'PRESENT',
            summary: `${rule.displayName} terms identified on Page ${page.pageNumber}.`,
            originalText,
            normalizedMeaning,
            sourceReferences: [evidenceRef],
            confidence: 'MEDIUM',
            detectionMethod: 'contextual_pattern',
            reviewRequired: false,
            detectedAt: new Date().toISOString(),
            pageNumber: page.pageNumber,
            explanation: `Identified on page ${page.pageNumber} via pattern frequency.`
          };
        }
      }
    }

    return null;
  }

  /**
   * Generates a neutral, legally safe NOT_IDENTIFIED record for an unspotted category
   */
  private static createNotIdentifiedRecord(
    rule: CategoryDetectionRule,
    contractId: string,
    doc: IngestedDocument
  ): ClauseIntelligenceRecord {
    return {
      clauseId: `clause-${contractId}-${rule.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      contractId,
      category: rule.category,
      group: rule.group,
      title: rule.displayName,
      status: 'NOT_IDENTIFIED',
      summary: `No matching ${rule.displayName.toLowerCase()} provision was reliably identified in the extracted document.`,
      originalText: '',
      normalizedMeaning: `No affirmative ${rule.displayName.toLowerCase()} covenants or declarations were recognized under standard extraction signatures.`,
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: new Date().toISOString(),
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    };
  }

  /**
   * Extracts the most relevant contiguous paragraph or sentence snippet around matched patterns
   */
  private static extractRelevantSnippet(content: string, rule: CategoryDetectionRule): string {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    for (const para of paragraphs) {
      if (rule.keyPhrases.some(kp => kp.test(para))) {
        return para.trim().slice(0, 450);
      }
    }
    // Fallback to first paragraph
    return paragraphs[0]?.trim().slice(0, 450) || content.trim().slice(0, 350);
  }

  /**
   * Builds an EvidenceReference preserving full provenance
   */
  private static buildEvidenceReference(
    doc: IngestedDocument,
    pageNumber: number,
    sectionIdentifier: string,
    textSnippet: string,
    confidenceScore: number
  ): EvidenceReference {
    return {
      id: `cite-${doc.contractId || doc.id}-p${pageNumber}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      documentId: doc.id,
      documentName: doc.fileName,
      pageNumber: Math.max(1, pageNumber || 1),
      sectionIdentifier: sectionIdentifier || `Page ${pageNumber}`,
      textSnippet: textSnippet.trim(),
      confidenceScore: Math.min(1, Math.max(0.1, confidenceScore)),
      verifiedByHuman: false
    };
  }
}
