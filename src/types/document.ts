/**
 * ContractLens AI - Document Ingestion & Extraction Types
 * Segment 2: Structured Document Representation, Ingestion Pipeline, & Search Index
 */

import { ContractMetadata, ContractParty, Clause, Obligation, EvidenceReference } from './contract';

export type SupportedFileExtension = 'pdf' | 'docx' | 'txt';

export interface DocumentSection {
  id: string;
  identifier: string; // e.g., "Section 14.2" or "ARTICLE IV"
  title: string;
  type: 'title' | 'preamble' | 'recital' | 'article' | 'section' | 'subsection' | 'signature' | 'exhibit' | 'schedule';
  pageNumber: number;
  startCharIndex: number;
  endCharIndex: number;
  textSnippet: string;
  fullText: string;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  cleanText: string;
  wordCount: number;
  characterCount: number;
  sections: DocumentSection[];
  hasSignatures?: boolean;
}

export interface DocumentSearchMatch {
  pageNumber: number;
  sectionIdentifier?: string;
  snippet: string;
  matchIndex: number;
  matchLength: number;
}

export interface IngestedDocument {
  id: string;
  contractId: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: SupportedFileExtension;
  sha256Hash: string;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  uploadedAt: string;
  pages: DocumentPage[];
  sections: DocumentSection[];
  headings: string[];
  rawText: string;
  tableOfContents: Array<{
    identifier: string;
    title: string;
    pageNumber: number;
  }>;
  extractedMetadata: Partial<ContractMetadata>;
  detectedParties: ContractParty[];
  extractedClauses: Clause[];
  extractedObligations: Obligation[];
}

export type IngestionStage = 
  | 'IDLE'
  | 'VALIDATING'
  | 'READING_FILE'
  | 'EXTRACTING_TEXT'
  | 'PARSING_STRUCTURE'
  | 'INDEXING_SEARCH'
  | 'GROUNDING_EVIDENCE'
  | 'READY'
  | 'ERROR';

export interface IngestionProgress {
  stage: IngestionStage;
  stageName: string;
  percent: number;
  currentStep: number;
  totalSteps: number;
  fileName?: string;
  pageCurrent?: number;
  pageTotal?: number;
  detailMessage: string;
  error?: string;
  startedAt?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: SupportedFileExtension;
  sizeFormatted?: string;
}
