/**
 * ContractLens AI - Domain Models & Data Architecture
 * Segment 1: Foundational typed structures for contract intelligence.
 */

export type ContractStatus = 'active' | 'pending_review' | 'expiring_soon' | 'expired' | 'terminated';
export type ReviewStatus = 'verified' | 'needs_review' | 'in_review' | 'flagged';
export type ContractType = 
  | 'Cloud Services'
  | 'Vendor Agreement'
  | 'Master Services Agreement (MSA)'
  | 'Software License & DPA'
  | 'Non-Disclosure Agreement (NDA)'
  | 'Statement of Work (SOW)'
  | 'Service Level Agreement (SLA)';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ObligationStatus = 'pending' | 'in_progress' | 'fulfilled' | 'overdue';
export type ObligationRecurrence = 'one_time' | 'monthly' | 'quarterly' | 'annual' | 'on_trigger';

import { ClauseIntelligenceRecord } from './clause';
export * from './clause';

export interface EvidenceReference {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  sectionIdentifier: string; // e.g., "Section 12.3 (b)"
  textSnippet: string;
  confidenceScore: number; // 0.00 to 1.00
  sourceBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  highlightColor?: string;
  verifiedByHuman?: boolean;
}

export interface ContractParty {
  id: string;
  name: string;
  role: 'customer' | 'provider' | 'disclosing_party' | 'receiving_party' | 'partner';
  jurisdiction: string;
  signatoryName?: string;
  signatoryTitle?: string;
  contactEmail?: string;
}

export interface ContractMetadata {
  effectiveDate: string; // ISO 8601 YYYY-MM-DD
  expirationDate: string; // ISO 8601 YYYY-MM-DD
  autoRenew: boolean;
  renewalNoticePeriodDays: number;
  renewalNoticeDeadline?: string;
  governingLaw: string;
  jurisdictionVenue: string;
  totalContractValue?: number;
  currency: string;
  paymentTerms: string; // e.g. "Net 30"
  liabilityCapAmount?: string; // e.g. "12 months aggregate fees paid"
  indemnityCapSummary?: string;
  confidentialityPeriodYears?: number;
}

export interface Clause {
  id: string;
  category: 
    | 'Indemnification'
    | 'Limitation of Liability'
    | 'Termination'
    | 'Confidentiality'
    | 'Intellectual Property'
    | 'Governing Law'
    | 'Data Protection & Security'
    | 'Service Level Agreement (SLA)'
    | 'Payment Terms'
    | 'Warranty & Disclaimers';
  title: string;
  sectionReference: string; // e.g. "§ 8.2"
  originalText: string;
  standardComparison: 'standard' | 'non_standard' | 'high_deviation' | 'unusual_omission';
  summary: string;
  riskLevel: RiskSeverity;
  evidenceRef: EvidenceReference;
  reviewStatus: ReviewStatus;
  reviewNotes?: string;
}

export interface Obligation {
  id: string;
  contractId: string;
  title: string;
  description: string;
  responsibleParty: string; // Party name or "Our Organization"
  recipientParty: string;
  dueDate: string; // ISO YYYY-MM-DD
  recurrence: ObligationRecurrence;
  status: ObligationStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clauseRefId?: string;
  evidenceRef?: EvidenceReference;
  category: 'Compliance' | 'Payment' | 'Reporting' | 'Security / Audit' | 'Operational' | 'Notice';
}

export interface TimelineEvent {
  id: string;
  contractId: string;
  contractName: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  description: string;
  type: 'effective_date' | 'renewal_notice_deadline' | 'contract_expiration' | 'audit_window' | 'payment_milestone' | 'obligation_due';
  criticalLevel: 'info' | 'upcoming' | 'critical' | 'completed';
  completed?: boolean;
}

export interface RiskFlag {
  id: string;
  contractId: string;
  title: string;
  category: string;
  severity: RiskSeverity;
  description: string;
  clauseRefId?: string;
  suggestedAction: string;
  reviewed: boolean;
}

export interface ReviewItem {
  id: string;
  contractId: string;
  contractName: string;
  title: string;
  category: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  clauseRefId?: string;
  updatedAt: string;
}

export interface ContractVersion {
  id: string;
  versionNumber: string;
  uploadedAt: string;
  fileName: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  changelogNotes: string;
  status: 'active' | 'superseded' | 'draft';
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'anomaly' | 'negotiation_leverage' | 'financial_exposure' | 'compliance_gap';
  title: string;
  summary: string;
  impact: string;
  confidence: number;
  evidenceRefs: EvidenceReference[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string; // ISO
  type: 
    | 'contract_uploaded'
    | 'dates_extracted'
    | 'obligation_identified'
    | 'clause_flagged'
    | 'comparison_completed'
    | 'status_changed'
    | 'review_completed';
  title: string;
  detail: string;
  contractId?: string;
  contractName?: string;
  actor: string;
}

export interface Contract {
  id: string;
  name: string;
  type: ContractType;
  counterparty: ContractParty;
  ourParty: ContractParty;
  status: ContractStatus;
  reviewStatus: ReviewStatus;
  fileInfo: {
    fileName: string;
    fileSizeBytes: number;
    pageCount: number;
    uploadedAt: string;
    format: 'PDF' | 'DOCX' | 'TXT';
  };
  metadata: ContractMetadata;
  intelligence?: ContractIntelligence;
  clauses: Clause[];
  detectedClauses?: ClauseIntelligenceRecord[];
  obligations: Obligation[];
  timeline: TimelineEvent[];
  risks: RiskFlag[];
  reviewQueue: ReviewItem[];
  versions: ContractVersion[];
  insights: AIInsight[];
  lastUpdated: string;
}

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW';

export interface ExtractedDate {
  type: 'execution' | 'effective' | 'commencement' | 'expiration' | 'renewal_notice_deadline' | 'other';
  label: string;
  normalizedDate: string | null; // ISO YYYY-MM-DD or null if relative
  originalText: string;
  relativeCondition?: string;
  sourcePage: number;
  section: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0.00 to 1.00
  sourceReference: EvidenceReference;
  status: 'identified' | 'not_identified' | 'requires_review' | 'relative_term';
}

export interface IntelligenceParty {
  id: string;
  name: string;
  role: 
    | 'Service Provider'
    | 'Customer'
    | 'Disclosing Party'
    | 'Receiving Party'
    | 'Vendor'
    | 'Client'
    | 'Contractor'
    | 'Company'
    | 'Partner'
    | 'Licensor'
    | 'Licensee'
    | 'Other';
  address?: string;
  representative?: string;
  jurisdiction?: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  sourceReference?: EvidenceReference;
  status: 'identified' | 'not_identified' | 'requires_review';
}

export interface CommercialTerm {
  id: string;
  type: 
    | 'recurring_fee' 
    | 'one_time_fee' 
    | 'billing_frequency' 
    | 'payment_due_period' 
    | 'late_payment_penalty' 
    | 'taxes' 
    | 'deposit' 
    | 'usage_based' 
    | 'other';
  label: string;
  amount?: number | string;
  currency?: string;
  frequency?: string;
  condition?: string;
  description: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  sourceReference: EvidenceReference;
  status: 'identified' | 'not_identified' | 'requires_review';
}

export interface TerminationProvision {
  id: string;
  type: 'convenience' | 'for_cause' | 'breach' | 'insolvency' | 'non_renewal' | 'survival' | 'other';
  title: string;
  noticePeriod?: string;
  curePeriod?: string;
  condition?: string;
  consequences?: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  sourceReference: EvidenceReference;
  status: 'identified' | 'not_identified' | 'requires_review';
}

export type StandardClauseCategory =
  | 'Confidentiality'
  | 'Intellectual Property'
  | 'Data Protection'
  | 'Limitation of Liability'
  | 'Indemnification'
  | 'Insurance'
  | 'Assignment'
  | 'Force Majeure'
  | 'Audit Rights'
  | 'Service Levels'
  | 'Warranties'
  | 'Representations'
  | 'Non-Solicitation'
  | 'Non-Compete'
  | 'Notices'
  | 'Amendments'
  | 'Governing Law'
  | 'Dispute Resolution'
  | 'Termination';

export interface ClausePresence {
  category: StandardClauseCategory;
  status: 'present' | 'not_identified' | 'requires_review';
  sectionIdentifier?: string;
  pageNumber?: number;
  snippet?: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  sourceReferences: EvidenceReference[];
  summary?: string;
}

export interface ExecutiveSummary {
  whatThisContractIs: string;
  whoIsInvolved: string;
  term: string;
  commercialModel: string;
  termination: string;
  keyProvisions: string;
  itemsRequiringReview: string[];
}

export interface ExtractionCompletenessCategory {
  identified: boolean;
  label: string;
  score: number; // 0 to 100
}

export interface ExtractionCompleteness {
  overallPercentage: number;
  categories: {
    parties: ExtractionCompletenessCategory;
    dates: ExtractionCompletenessCategory;
    commercialTerms: ExtractionCompletenessCategory;
    renewal: ExtractionCompletenessCategory;
    termination: ExtractionCompletenessCategory;
    governingLaw: ExtractionCompletenessCategory;
    standardClauses: ExtractionCompletenessCategory;
  };
  reviewItemsCount: number;
  summaryText: string;
}

export interface ContractIntelligence {
  contractId: string;
  contractTitle: string;
  contractType: string;
  contractTypeConfidence: ConfidenceLevel;
  contractTypeScore: number;
  contractPurpose: string;
  parties: IntelligenceParty[];
  effectiveDate: ExtractedDate;
  executionDate?: ExtractedDate;
  expirationDate: ExtractedDate;
  commencementDate?: ExtractedDate;
  allExtractedDates: ExtractedDate[];
  renewalType: 'automatic' | 'manual' | 'evergreen' | 'fixed_term' | 'not_identified' | 'requires_review';
  renewalNoticePeriod: string;
  renewalDuration?: string;
  paymentTerms: string;
  currency: string;
  commercialTerms: CommercialTerm[];
  governingLaw: string;
  jurisdiction: string;
  venue?: string;
  disputeResolution: string;
  terminationSummary: string;
  terminationProvisions: TerminationProvision[];
  
  // Standard Clause presence flags
  confidentialityPresent: ClausePresence;
  indemnificationPresent: ClausePresence;
  liabilityLimitationPresent: ClausePresence;
  disputeResolutionPresent: ClausePresence;
  serviceLevelPresent: ClausePresence;
  dataProtectionPresent: ClausePresence;
  intellectualPropertyPresent: ClausePresence;
  assignmentPresent: ClausePresence;
  amendmentPresent: ClausePresence;
  allClausePresences: ClausePresence[];
  
  noticeRequirements: string;
  executiveSummary: ExecutiveSummary;
  completeness: ExtractionCompleteness;
  
  extractedAt: string;
  extractionConfidence: ConfidenceLevel;
  extractionConfidenceScore: number;
  sourceReferences: EvidenceReference[];
}

export type ActiveNavSection = 
  | 'overview'
  | 'contracts'
  | 'obligations'
  | 'timeline'
  | 'compare'
  | 'ask'
  | 'review-queue'
  | 'settings';

export type ContractDetailTab = 
  | 'overview'
  | 'evidence'
  | 'clauses'
  | 'obligations'
  | 'timeline'
  | 'compare'
  | 'ask';
