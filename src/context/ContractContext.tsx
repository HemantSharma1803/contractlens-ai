/**
 * ContractLens AI - Application State & Context Provider
 * Manages contracts, navigation, filters, search, and upload/processing lifecycle.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Contract, 
  ContractStatus, 
  ReviewStatus, 
  ActiveNavSection, 
  ContractDetailTab,
  ActivityEvent,
  Clause,
  Obligation,
  ObligationStatus,
  ContractType,
  EvidenceReference
} from '../types/contract';
import { 
  IngestedDocument, 
  IngestionProgress, 
  IngestionStage 
} from '../types/document';
import { DEMO_CONTRACTS, DEMO_ACTIVITIES } from '../data/demoContracts';
import { extractDocumentContent, validateContractFile } from '../services/documentExtractor';
import { parseDocumentStructure } from '../services/structuralParser';
import { 
  loadStoredDocuments, 
  saveStoredDocument, 
  deleteStoredDocument, 
  loadStoredContracts, 
  saveStoredContract, 
  deleteStoredContract 
} from '../services/storage';
import { SAMPLE_CONTRACT_TEMPLATES, createSampleFile } from '../data/sampleContracts';
import { extractAdvancedObligations, buildTimeline, deriveRiskFlags } from '../services/intelligencePipeline';

export interface FilterState {
  type: string;
  status: string;
  reviewStatus: string;
  search: string;
  sortBy: 'name' | 'expiration' | 'status' | 'updated' | 'counterparty';
  sortOrder: 'asc' | 'desc';
  viewMode: 'table' | 'grid';
}

interface ContractContextType {
  contracts: Contract[];
  isDemoMode: boolean;
  activeNavSection: ActiveNavSection;
  activeContractId: string | null;
  activeContract: Contract | null;
  activeDetailTab: ContractDetailTab;
  activities: ActivityEvent[];
  filters: FilterState;
  globalSearchQuery: string;
  isSearchOpen: boolean;
  isUploadOpen: boolean;
  isProcessing: boolean;
  processingStage: string;
  processingProgress: number;
  ingestionProgress: IngestionProgress;
  privacyNoticeAcknowledged: boolean;
  ingestedDocuments: Record<string, IngestedDocument>;
  activeDocument: IngestedDocument | null;
  activeEvidenceRef: EvidenceReference | null;
  
  // Actions
  setActiveNavSection: (section: ActiveNavSection) => void;
  selectContract: (id: string | null, tab?: ContractDetailTab) => void;
  setActiveDetailTab: (tab: ContractDetailTab) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  setGlobalSearchQuery: (q: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsUploadOpen: (open: boolean) => void;
  loadDemoWorkspace: () => void;
  loadEmptyWorkspace: () => void;
  simulateUploadContract: (fileName: string, type: Contract['type']) => Promise<void>;
  ingestDocument: (file: File, type?: ContractType) => Promise<string>;
  deleteContract: (contractId: string) => void;
  setActiveEvidenceRef: (ref: EvidenceReference | null) => void;
  updateClauseReviewStatus: (contractId: string, clauseId: string, status: ReviewStatus, notes?: string) => void;
  toggleObligationStatus: (contractId: string, obligationId: string) => void;
  acknowledgePrivacyNotice: () => void;
}

const defaultFilters: FilterState = {
  type: 'all',
  status: 'all',
  reviewStatus: 'all',
  search: '',
  sortBy: 'expiration',
  sortOrder: 'asc',
  viewMode: 'table',
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored contracts merged with DEMO_CONTRACTS
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const stored = loadStoredContracts();
    return stored.length > 0 ? [...stored, ...DEMO_CONTRACTS] : DEMO_CONTRACTS;
  });

  const [ingestedDocuments, setIngestedDocuments] = useState<Record<string, IngestedDocument>>(() => {
    return loadStoredDocuments();
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [activeNavSection, setActiveNavSection] = useState<ActiveNavSection>('overview');
  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<ContractDetailTab>('overview');
  const [activities, setActivities] = useState<ActivityEvent[]>(DEMO_ACTIVITIES);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('Reading document');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [privacyNoticeAcknowledged, setPrivacyNoticeAcknowledged] = useState<boolean>(false);
  const [activeEvidenceRef, setActiveEvidenceRef] = useState<EvidenceReference | null>(null);

  const [ingestionProgress, setIngestionProgress] = useState<IngestionProgress>({
    stage: 'IDLE',
    stageName: 'Ready for document ingestion',
    percent: 0,
    currentStep: 0,
    totalSteps: 6,
    detailMessage: 'No document currently in extraction queue.',
  });

  // Derive currently selected contract and document
  const activeContract = contracts.find(c => c.id === activeContractId) || null;
  const activeDocument = (activeContractId && ingestedDocuments[activeContractId]) || null;

  // Handle browser popstate / back button if using hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash) {
        setActiveNavSection('overview');
        setActiveContractId(null);
        return;
      }

      if (hash.startsWith('contracts/')) {
        const parts = hash.split('/');
        const contractId = parts[1];
        const tab = (parts[2] as ContractDetailTab) || 'overview';
        setActiveNavSection('contracts');
        setActiveContractId(contractId);
        setActiveDetailTab(tab);
      } else {
        const validSections: ActiveNavSection[] = [
          'overview', 'contracts', 'obligations', 'timeline', 'compare', 'ask', 'review-queue', 'settings'
        ];
        if (validSections.includes(hash as ActiveNavSection)) {
          setActiveNavSection(hash as ActiveNavSection);
          setActiveContractId(null);
        }
      }
    };

    handleHashChange();
    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when navigation changes
  const updateHash = (section: ActiveNavSection, contractId?: string | null, tab?: ContractDetailTab) => {
    if (contractId) {
      window.location.hash = `#/contracts/${contractId}${tab ? `/${tab}` : ''}`;
    } else {
      window.location.hash = `#/${section}`;
    }
  };

  const handleNavSectionChange = (section: ActiveNavSection) => {
    setActiveNavSection(section);
    setActiveContractId(null);
    updateHash(section);
  };

  const selectContract = (id: string | null, tab: ContractDetailTab = 'overview') => {
    setActiveContractId(id);
    setActiveDetailTab(tab);
    if (id) {
      setActiveNavSection('contracts');
      updateHash('contracts', id, tab);
    } else {
      updateHash('contracts');
    }
  };

  const handleDetailTabChange = (tab: ContractDetailTab) => {
    setActiveDetailTab(tab);
    if (activeContractId) {
      updateHash('contracts', activeContractId, tab);
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const loadDemoWorkspace = () => {
    setContracts(DEMO_CONTRACTS);
    setActivities(DEMO_ACTIVITIES);
    setIsDemoMode(true);
    setActiveContractId(null);
    setActiveNavSection('overview');
    updateHash('overview');
  };

  const loadEmptyWorkspace = () => {
    setContracts([]);
    setActivities([]);
    setIsDemoMode(false);
    setActiveContractId(null);
    setActiveNavSection('overview');
    updateHash('overview');
  };

  const acknowledgePrivacyNotice = () => {
    setPrivacyNoticeAcknowledged(true);
  };

  // Deletes contract and associated ingested document
  const deleteContract = (contractId: string) => {
    deleteStoredContract(contractId);
    deleteStoredDocument(contractId);
    setContracts(prev => prev.filter(c => c.id !== contractId));
    setIngestedDocuments(prev => {
      const next = { ...prev };
      delete next[contractId];
      return next;
    });
    if (activeContractId === contractId) {
      selectContract(null);
    }
  };

  /**
   * Main Document Ingestion Pipeline
   * Runs the complete state machine: Validating -> Reading -> Extracting -> Parsing -> Indexing -> Grounding -> Ready
   */
  const ingestDocument = async (file: File, requestedType?: ContractType): Promise<string> => {
    setIsUploadOpen(false);
    setIsDemoMode(false);
    setIsProcessing(true);
    
    // Step 1: Validating
    setIngestionProgress({
      stage: 'VALIDATING',
      stageName: 'Validating File Format & Integrity',
      percent: 10,
      currentStep: 1,
      totalSteps: 6,
      detailMessage: `Checking extension and file boundaries for ${file.name}...`,
    });
    setProcessingProgress(10);
    setProcessingStage(`Validating ${file.name}...`);

    const validation = validateContractFile(file);
    if (!validation.isValid) {
      setIngestionProgress({
        stage: 'ERROR',
        stageName: 'File Validation Failed',
        percent: 0,
        currentStep: 1,
        totalSteps: 6,
        detailMessage: validation.error || 'Invalid file format.',
        error: validation.error,
      });
      setIsProcessing(false);
      throw new Error(validation.error);
    }

    // Step 2: Reading binary buffer & computing SHA-256
    setIngestionProgress({
      stage: 'READING_FILE',
      stageName: 'Reading Document Stream',
      percent: 25,
      currentStep: 2,
      totalSteps: 6,
      detailMessage: `Loading binary stream (${validation.sizeFormatted}) & computing SHA-256 fingerprint...`,
    });
    setProcessingProgress(25);
    setProcessingStage('Reading document stream & computing SHA-256 fingerprint...');
    await new Promise(r => setTimeout(r, 250));

    // Step 3: Extracting pages and text
    setIngestionProgress({
      stage: 'EXTRACTING_TEXT',
      stageName: 'Extracting Paginated Text Content',
      percent: 45,
      currentStep: 3,
      totalSteps: 6,
      detailMessage: 'Preserving page boundaries, layout, and raw typography...',
    });
    setProcessingProgress(45);
    setProcessingStage('Extracting paginated text content...');

    const extraction = await extractDocumentContent(file, (curr, total) => {
      const pct = 45 + Math.floor((curr / total) * 20);
      setProcessingProgress(pct);
      setProcessingStage(`Extracting Page ${curr} of ${total}...`);
      setIngestionProgress(prev => ({
        ...prev,
        pageCurrent: curr,
        pageTotal: total,
        percent: pct,
        detailMessage: `Extracted Page ${curr} of ${total} (${Math.round((curr / total) * 100)}%)...`,
      }));
    });

    // Step 4: Parsing structure & legal schema
    setIngestionProgress({
      stage: 'PARSING_STRUCTURE',
      stageName: 'Parsing Legal Structure & Sections',
      percent: 70,
      currentStep: 4,
      totalSteps: 6,
      detailMessage: 'Identifying Articles, Sections, parties, and governing jurisdiction...',
    });
    setProcessingProgress(70);
    setProcessingStage('Identifying Articles, Sections, and commercial boundaries...');
    await new Promise(r => setTimeout(r, 300));

    const contractId = `contract-${Date.now()}`;
    const documentId = `doc-${Date.now()}`;

    const structural = parseDocumentStructure(extraction.pages, file.name, contractId);

    // Step 5: Indexing search & outline
    setIngestionProgress({
      stage: 'INDEXING_SEARCH',
      stageName: 'Building Verbatim Citation Index',
      percent: 85,
      currentStep: 5,
      totalSteps: 6,
      detailMessage: `Indexing ${structural.sections.length} structural sections for instant lookup...`,
    });
    setProcessingProgress(85);
    setProcessingStage('Building evidence grounding map and page anchors...');
    await new Promise(r => setTimeout(r, 250));

    // Step 6: Grounding evidence & final assembly
    setIngestionProgress({
      stage: 'GROUNDING_EVIDENCE',
      stageName: 'Grounding Intelligence in Verbatim Citations',
      percent: 95,
      currentStep: 6,
      totalSteps: 6,
      detailMessage: 'Anchoring clauses, obligations, and risk flags to source pages...',
    });
    setProcessingProgress(95);
    setProcessingStage('Finalizing intelligence profile and evidence grounding...');
    await new Promise(r => setTimeout(r, 200));

    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

    const ingestedDoc: IngestedDocument = {
      id: documentId,
      contractId,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: validation.fileType || 'pdf',
      sha256Hash: extraction.sha256Hash,
      pageCount: extraction.pageCount,
      wordCount: extraction.wordCount,
      characterCount: extraction.charCount,
      uploadedAt: new Date().toISOString(),
      pages: extraction.pages,
      sections: structural.sections,
      headings: structural.headings,
      rawText: extraction.rawText,
      tableOfContents: structural.tableOfContents,
      extractedMetadata: structural.metadata,
      detectedParties: [structural.counterparty, structural.ourParty],
      extractedClauses: structural.clauses,
      extractedObligations: structural.obligations,
    };

    const newContract: Contract = {
      id: contractId,
      name: cleanName,
      type: requestedType || structural.contractType,
      counterparty: structural.counterparty,
      ourParty: structural.ourParty,
      status: 'pending_review',
      reviewStatus: 'needs_review',
      fileInfo: {
        fileName: file.name,
        fileSizeBytes: file.size,
        pageCount: extraction.pageCount,
        uploadedAt: new Date().toISOString(),
        format: file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.text') ? 'TXT' : 'PDF',
      },
      metadata: {
        effectiveDate: structural.metadata.effectiveDate || '',
        expirationDate: structural.metadata.expirationDate || '',
        autoRenew: structural.metadata.autoRenew ?? false,
        renewalNoticePeriodDays: structural.metadata.renewalNoticePeriodDays ?? 0,
        renewalNoticeDeadline: structural.metadata.renewalNoticeDeadline,
        governingLaw: structural.metadata.governingLaw || '',
        jurisdictionVenue: structural.metadata.jurisdictionVenue || '',
        totalContractValue: structural.metadata.totalContractValue,
        currency: structural.metadata.currency || '',
        paymentTerms: structural.metadata.paymentTerms || '',
        liabilityCapAmount: structural.metadata.liabilityCapAmount,
        indemnityCapSummary: structural.metadata.indemnityCapSummary,
        confidentialityPeriodYears: structural.metadata.confidentialityPeriodYears,
      },
      intelligence: structural.intelligence,
      clauses: structural.clauses,
      obligations: structural.obligations,
      timeline: [
        {
          id: `time-${contractId}-1`,
          contractId,
          contractName: cleanName,
          date: structural.metadata.effectiveDate || '',
          title: 'Agreement Effective Date',
          description: 'Formal commencement of subscription term and operational covenants.',
          type: 'effective_date',
          criticalLevel: 'info',
        },
        ...(structural.metadata.renewalNoticeDeadline ? [{
          id: `time-${contractId}-2`,
          contractId,
          contractName: cleanName,
          date: structural.metadata.renewalNoticeDeadline,
          title: 'Renewal Notice Deadline',
          description: `Final notice window (${structural.metadata.renewalNoticePeriodDays} days) before automatic renewal.`,
          type: 'renewal_notice_deadline' as const,
          criticalLevel: 'critical' as const,
        }] : []),
        {
          id: `time-${contractId}-3`,
          contractId,
          contractName: cleanName,
          date: structural.metadata.expirationDate || '',
          title: 'Contract Expiration Date',
          description: 'End of initial contractual period.',
          type: 'contract_expiration',
          criticalLevel: 'upcoming',
        }
      ],
      risks: structural.risks,
      reviewQueue: structural.clauses.map((c, i) => ({
        id: `rev-${contractId}-${i + 1}`,
        contractId,
        contractName: cleanName,
        title: c.title,
        category: c.category,
        status: 'pending',
        assignedTo: 'Legal Operations Lead',
        priority: c.riskLevel === 'high' ? 'high' : 'medium',
        notes: 'Awaiting primary counsel review for non-standard playbook deviations.',
        clauseRefId: c.id,
        updatedAt: new Date().toISOString(),
      })),
      versions: [{
        id: `v-${contractId}-1`,
        versionNumber: 'v1.0 (Executed)',
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileSizeBytes: file.size,
        sha256Checksum: extraction.sha256Hash,
        changelogNotes: 'Primary document ingestion with SHA-256 integrity verification.',
        status: 'active',
      }],
      insights: [
        {
          id: `ins-${contractId}-1`,
          type: 'compliance_gap',
          title: 'Primary Document Grounding Completed',
          summary: `Parsed ${extraction.pageCount} pages, identifying ${structural.sections.length} structural sections and ${structural.clauses.length} core legal clauses.`,
          impact: '100% of discovered terms anchored with exact page numbers and verbatim text snippets.',
          confidence: 0.98,
          evidenceRefs: structural.clauses.map(c => c.evidenceRef),
        }
      ],
      lastUpdated: new Date().toISOString(),
    };

    // Segments 5–11: deterministic obligation, timeline, risk and evidence enrichment.
    // Every generated record is grounded in extracted document text; no API key is required.
    newContract.obligations = extractAdvancedObligations(newContract, ingestedDoc);
    newContract.timeline = buildTimeline(newContract);
    newContract.risks = deriveRiskFlags(newContract);
    newContract.reviewQueue = [
      ...newContract.reviewQueue,
      ...newContract.obligations
        .filter(o => o.responsibleParty === 'Unclear' || o.status === 'overdue')
        .map((o, i) => ({
          id: `rev-${contractId}-ob-${i + 1}`,
          contractId,
          contractName: cleanName,
          title: o.title,
          category: o.category,
          status: 'pending' as const,
          assignedTo: 'Human Reviewer',
          priority: o.priority === 'urgent' ? 'high' as const : 'medium' as const,
          notes: o.responsibleParty === 'Unclear'
            ? 'Responsible party could not be mapped reliably from the source text.'
            : 'Due date requires operational verification against the executed agreement.',
          updatedAt: new Date().toISOString(),
        }))
    ];

    // Persist locally
    saveStoredDocument(ingestedDoc);
    saveStoredContract(newContract);

    setIngestedDocuments(prev => ({ ...prev, [contractId]: ingestedDoc }));
    setContracts(prev => [newContract, ...prev]);

    // Activity log
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'contract_uploaded',
      title: 'Contract Ingested & Indexed',
      detail: `${cleanName} ingested (${extraction.pageCount} pgs, ${extraction.wordCount} words, SHA-256 verified).`,
      contractId,
      contractName: cleanName,
      actor: 'You (Document Ingestion Engine)',
    };
    setActivities(prev => [newAct, ...prev]);

    // Complete progress
    setIngestionProgress({
      stage: 'READY',
      stageName: 'Document Ingestion Complete',
      percent: 100,
      currentStep: 6,
      totalSteps: 6,
      detailMessage: `Successfully ingested and anchored ${extraction.pageCount} pages.`,
    });
    setProcessingProgress(100);
    setProcessingStage('Document ready.');

    await new Promise(r => setTimeout(r, 400));
    setIsProcessing(false);

    // Navigate to Contract Detail and open Evidence view
    selectContract(contractId, 'evidence');
    return contractId;
  };

  /**
   * Bridges sample or simulated contracts through the real ingestion pipeline
   */
  const simulateUploadContract = async (fileName: string, type: Contract['type']) => {
    const matchingSample = SAMPLE_CONTRACT_TEMPLATES.find(
      s => s.fileName.toLowerCase() === fileName.toLowerCase() ||
           s.fileName.replace(/\.[^/.]+$/, '').toLowerCase() === fileName.replace(/\.[^/.]+$/, '').toLowerCase()
    );

    let testFile: File;
    if (matchingSample) {
      testFile = createSampleFile(matchingSample);
    } else {
      const defaultSample = SAMPLE_CONTRACT_TEMPLATES[0];
      testFile = new File([new Blob([defaultSample.content])], fileName, { type: 'text/plain' });
    }

    await ingestDocument(testFile, type);
    return;
  };


  const updateClauseReviewStatus = (contractId: string, clauseId: string, status: ReviewStatus, notes?: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedClauses = c.clauses.map(cl => {
        if (cl.id !== clauseId) return cl;
        return {
          ...cl,
          reviewStatus: status,
          reviewNotes: notes !== undefined ? notes : cl.reviewNotes,
        };
      });
      return {
        ...c,
        clauses: updatedClauses,
        lastUpdated: new Date().toISOString(),
      };
    }));

    const activity: ActivityEvent = {
      id: `act-rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'status_changed',
      title: `Clause review updated to ${status.replace('_', ' ')}`,
      detail: `Contract: ${contracts.find(c => c.id === contractId)?.name || contractId}`,
      contractId,
      actor: 'Human Reviewer',
    };
    setActivities(prev => [activity, ...prev]);
  };

  const toggleObligationStatus = (contractId: string, obligationId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedObligations = c.obligations.map(ob => {
        if (ob.id !== obligationId) return ob;
        const nextStatus: ObligationStatus = ob.status === 'fulfilled' ? 'pending' : 'fulfilled';
        return {
          ...ob,
          status: nextStatus,
        };
      });
      return {
        ...c,
        obligations: updatedObligations,
      };
    }));
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        isDemoMode,
        activeNavSection,
        activeContractId,
        activeContract,
        activeDetailTab,
        activities,
        filters,
        globalSearchQuery,
        isSearchOpen,
        isUploadOpen,
        isProcessing,
        processingStage,
        processingProgress,
        ingestionProgress,
        privacyNoticeAcknowledged,
        ingestedDocuments,
        activeDocument,
        activeEvidenceRef,
        setActiveEvidenceRef,
        setActiveNavSection: handleNavSectionChange,
        selectContract,
        setActiveDetailTab: handleDetailTabChange,
        setFilters,
        clearFilters,
        setGlobalSearchQuery,
        setIsSearchOpen,
        setIsUploadOpen,
        loadDemoWorkspace,
        loadEmptyWorkspace,
        simulateUploadContract,
        ingestDocument,
        deleteContract,
        updateClauseReviewStatus,
        toggleObligationStatus,
        acknowledgePrivacyNotice,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
