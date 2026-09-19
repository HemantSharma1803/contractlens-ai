/**
 * ContractLens AI - Clause Intelligence & Evidence Mapping Types
 * Segment 4: Standard & Additional Clause Taxonomy, Detection Records, & Evidence Provenance
 */

import { EvidenceReference } from './contract';

export type ClauseIntelligenceStatus = 'PRESENT' | 'NOT_IDENTIFIED' | 'REVIEW_REQUIRED';

export type ClauseDetectionConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW';

export type ClauseTaxonomyGroup = 'core' | 'additional';

export type CoreClauseCategory =
  | 'Confidentiality'
  | 'Intellectual Property'
  | 'Data Protection'
  | 'Privacy'
  | 'Liability Limitation'
  | 'Indemnification'
  | 'Termination'
  | 'Renewal'
  | 'Payment'
  | 'Pricing'
  | 'Service Level / SLA'
  | 'Warranty'
  | 'Representations'
  | 'Assignment'
  | 'Audit Rights'
  | 'Insurance'
  | 'Force Majeure'
  | 'Governing Law'
  | 'Dispute Resolution'
  | 'Notices'
  | 'Amendments / Change Control';

export type AdditionalClauseCategory =
  | 'Security Requirements'
  | 'Compliance'
  | 'Subcontracting'
  | 'Confidential Information'
  | 'Data Processing'
  | 'Data Retention'
  | 'Data Deletion'
  | 'Security Incident / Breach Notification'
  | 'Intellectual Property Ownership'
  | 'License Grant'
  | 'License Restrictions'
  | 'Acceptance'
  | 'Delivery'
  | 'Support / Maintenance'
  | 'Credits / Service Credits'
  | 'Taxes'
  | 'Late Payment'
  | 'Expenses'
  | 'Non-Solicitation'
  | 'Non-Competition'
  | 'Exclusivity'
  | 'Publicity'
  | 'Survival'
  | 'Transition Assistance'
  | 'Records Retention'
  | 'Business Continuity'
  | 'Regulatory Requirements'
  | 'Export Controls'
  | 'Anti-Bribery / Anti-Corruption'
  | 'Order of Precedence'
  | 'Non-Disparagement'
  | 'Cumulative Remedies'
  | 'Counterparts'
  | 'Independent Contractor'
  | 'Miscellaneous';

export type ClauseTaxonomyCategory = CoreClauseCategory | AdditionalClauseCategory;

export type ClauseDetectionMethod = 
  | 'heading_and_context'
  | 'contextual_pattern'
  | 'structural_hierarchy'
  | 'ai_assisted'
  | 'deterministic_rules';

export interface ClauseIntelligenceRecord {
  clauseId: string;
  contractId: string;
  category: ClauseTaxonomyCategory | string;
  group: ClauseTaxonomyGroup;
  title: string;
  status: ClauseIntelligenceStatus;
  summary: string;
  originalText: string;
  normalizedMeaning: string;
  sourceReferences: EvidenceReference[];
  confidence: ClauseDetectionConfidence;
  detectionMethod: ClauseDetectionMethod;
  reviewRequired: boolean;
  detectedAt: string;
  sectionIdentifier?: string;
  pageNumber?: number;
  paragraphIndex?: number;
  explanation?: string;
  reviewNotes?: string;
}

export interface ClauseCategoryDefinition {
  category: ClauseTaxonomyCategory;
  group: ClauseTaxonomyGroup;
  displayName: string;
  description: string;
  typicalHeadings: string[];
  keyPhrases: string[];
  falsePositiveKeywordsToAvoid: string[];
  sampleNormalizedMeaning: string;
}

export interface ClauseExplorerFilters {
  searchQuery: string;
  status: 'ALL' | ClauseIntelligenceStatus;
  group: 'ALL' | ClauseTaxonomyGroup;
  category: string;
  sortBy: 'category' | 'confidence' | 'page' | 'status';
  sortDirection: 'asc' | 'desc';
}
