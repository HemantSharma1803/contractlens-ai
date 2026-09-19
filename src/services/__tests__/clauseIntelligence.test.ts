import { describe, it, expect } from 'vitest';
import { CLAUSE_TAXONOMY_RULES, CORE_TAXONOMY_CATEGORIES, ADDITIONAL_TAXONOMY_CATEGORIES } from '../clauseTaxonomy';
import { ClauseDetectionEngine } from '../clauseDetectionEngine';
import { IngestedDocument } from '../../types/document';
import { DEMO_CLAUSE_INTELLIGENCE_MAP } from '../../data/demoClauseIntelligence';

describe('Clause Intelligence - Taxonomy & Model Verification', () => {
  it('should define a comprehensive taxonomy of 50+ categories across Core and Additional', () => {
    expect(CORE_TAXONOMY_CATEGORIES.length).toBe(21);
    expect(ADDITIONAL_TAXONOMY_CATEGORIES.length).toBe(30);
    expect(CLAUSE_TAXONOMY_RULES.length).toBe(51);
  });

  it('each rule should define typicalHeadings, keyPhrases, boostPhrases, and normalized meaning generator', () => {
    for (const rule of CLAUSE_TAXONOMY_RULES) {
      expect(rule.typicalHeadings.length).toBeGreaterThan(0);
      expect(rule.keyPhrases.length).toBeGreaterThan(0);
      expect(typeof rule.generateNormalizedMeaning).toBe('function');
      const sampleMeaning = rule.generateNormalizedMeaning('sample text', 'sample heading');
      expect(typeof sampleMeaning).toBe('string');
      expect(sampleMeaning.length).toBeGreaterThan(10);
    }
  });
});

describe('ClauseDetectionEngine - Layered Detection Logic', () => {
  const sampleDocument: IngestedDocument = {
    id: 'doc-test-101',
    contractId: 'contract-test-101',
    fileName: 'Sample_Master_Services_Agreement.pdf',
    fileSizeBytes: 1204000,
    fileType: 'pdf',
    sha256Hash: 'abc123hash',
    pageCount: 15,
    wordCount: 6500,
    characterCount: 42000,
    uploadedAt: '2026-09-19T00:00:00Z',
    pages: [
      {
        pageNumber: 1,
        text: 'Master Services Agreement between Company A and Company B.',
        cleanText: 'Master Services Agreement between Company A and Company B.',
        wordCount: 10,
        characterCount: 60,
        sections: []
      },
      {
        pageNumber: 5,
        text: 'Section 8. Confidentiality. The receiving party shall hold proprietary information in confidence.',
        cleanText: 'Section 8. Confidentiality. The receiving party shall hold proprietary information in confidence.',
        wordCount: 15,
        characterCount: 100,
        sections: []
      }
    ],
    sections: [
      {
        id: 'sec-1',
        identifier: 'Section 9',
        title: 'Section 9 — Confidentiality',
        pageNumber: 5,
        type: 'section',
        startCharIndex: 0,
        endCharIndex: 140,
        textSnippet: '9.1 Standard of Care. The Receiving Party shall protect Disclosing Party\'s Confidential Information...',
        fullText: '9.1 Standard of Care. The Receiving Party shall protect Disclosing Party\'s Confidential Information using reasonable care and non-disclosure obligations for three years.'
      },
      {
        id: 'sec-2',
        identifier: 'Section 12',
        title: 'Section 12 — Limitation of Liability',
        pageNumber: 8,
        type: 'section',
        startCharIndex: 141,
        endCharIndex: 350,
        textSnippet: '12.1 Cap on Damages. In no event shall aggregate liability exceed...',
        fullText: '12.1 Cap on Damages. In no event shall aggregate liability exceed the total fees paid under this agreement in the twelve months preceding the incident. Neither party shall be liable for indirect or consequential damages.'
      },
      {
        id: 'sec-3',
        identifier: 'Section 16',
        title: 'Section 16 — Subcontracting',
        pageNumber: 11,
        type: 'section',
        startCharIndex: 351,
        endCharIndex: 450,
        textSnippet: '16.1 Delegation. Supplier may delegate certain basic administrative tasks.',
        fullText: '16.1 Delegation. Supplier may delegate certain basic administrative tasks.'
      }
    ],
    headings: [],
    rawText: '',
    tableOfContents: [],
    extractedMetadata: {} as any,
    detectedParties: [],
    extractedClauses: [],
    extractedObligations: []
  };

  it('detects Confidentiality and Limitation of Liability as PRESENT with HIGH/MEDIUM confidence', () => {
    const results = ClauseDetectionEngine.detectClauses(sampleDocument, 'contract-test-101');
    
    const confRecord = results.find(r => r.category === 'Confidentiality');
    expect(confRecord).toBeDefined();
    expect(confRecord?.status).toBe('PRESENT');
    expect(['HIGH', 'MEDIUM']).toContain(confRecord?.confidence);
    expect(confRecord?.sourceReferences.length).toBeGreaterThan(0);
    expect(confRecord?.sourceReferences[0].pageNumber).toBe(5);

    const liabRecord = results.find(r => r.category === 'Liability Limitation');
    expect(liabRecord).toBeDefined();
    expect(liabRecord?.status).toBe('PRESENT');
    expect(liabRecord?.sourceReferences[0].pageNumber).toBe(8);
  });

  it('marks ambiguous or brief provisions as REVIEW_REQUIRED', () => {
    const results = ClauseDetectionEngine.detectClauses(sampleDocument, 'contract-test-101');
    
    const subRecord = results.find(r => r.category === 'Subcontracting');
    expect(subRecord).toBeDefined();
    expect(subRecord?.status).toBe('REVIEW_REQUIRED');
    expect(subRecord?.reviewRequired).toBe(true);
    expect(subRecord?.confidence).toBe('REVIEW');
  });

  it('marks unspotted categories as NOT_IDENTIFIED with neutral, safe explanation', () => {
    const results = ClauseDetectionEngine.detectClauses(sampleDocument, 'contract-test-101');
    
    const nonCompete = results.find(r => r.category === 'Non-Competition');
    expect(nonCompete).toBeDefined();
    expect(nonCompete?.status).toBe('NOT_IDENTIFIED');
    expect(nonCompete?.sourceReferences.length).toBe(0);
    expect(nonCompete?.explanation).toContain('No matching provision was reliably identified');
  });
});

describe('Demo Contracts Clause Intelligence Coverage', () => {
  it('Northstar Cloud Services contains balanced PRESENT, REVIEW_REQUIRED, and NOT_IDENTIFIED provisions', () => {
    const nsClauses = DEMO_CLAUSE_INTELLIGENCE_MAP['contract-ns-2026-01'];
    expect(nsClauses).toBeDefined();
    expect(nsClauses.length).toBeGreaterThanOrEqual(10);

    const present = nsClauses.filter(c => c.status === 'PRESENT');
    const review = nsClauses.filter(c => c.status === 'REVIEW_REQUIRED');
    const notId = nsClauses.filter(c => c.status === 'NOT_IDENTIFIED');

    expect(present.length).toBeGreaterThanOrEqual(5);
    expect(review.length).toBeGreaterThanOrEqual(2);
    expect(notId.length).toBeGreaterThanOrEqual(2);

    // Provenance verification
    for (const p of present) {
      expect(p.sourceReferences.length).toBeGreaterThan(0);
      expect(p.sourceReferences[0].textSnippet.length).toBeGreaterThan(20);
      expect(p.sourceReferences[0].pageNumber).toBeGreaterThan(0);
    }
  });

  it('Vertex AI Subscription contains model-specific clauses with verified citations', () => {
    const vaClauses = DEMO_CLAUSE_INTELLIGENCE_MAP['contract-va-2026-02'];
    expect(vaClauses).toBeDefined();
    const ip = vaClauses.find(c => c.category === 'Intellectual Property');
    expect(ip).toBeDefined();
    expect(ip?.status).toBe('PRESENT');
    expect(ip?.sourceReferences[0].documentName).toContain('Vertex');
  });
});
