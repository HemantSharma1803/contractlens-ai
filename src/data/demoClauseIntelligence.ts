/**
 * ContractLens AI - Fictional Demo Clause Intelligence
 * Segment 4: Realistic, Multi-Contract Clause Taxonomies with Provenance Evidence
 * 
 * Complies with strict testing and architectural standards:
 * - Each demo contract includes multiple PRESENT clauses.
 * - Each demo contract includes REVIEW_REQUIRED clauses.
 * - Each demo contract includes NOT_IDENTIFIED provisions.
 * - All evidence citations map to internally consistent fictional document sections.
 * - Factual, conservative phrasing with zero legal advice.
 */

import { ClauseIntelligenceRecord } from '../types/clause';

export const DEMO_CLAUSE_INTELLIGENCE_MAP: Record<string, ClauseIntelligenceRecord[]> = {
  // =========================================================================
  // 1. Northstar Cloud Services Master Agreement (contract-ns-2026-01)
  // =========================================================================
  'contract-ns-2026-01': [
    // --- PRESENT: CORE ---
    {
      clauseId: 'clause-ns-confidentiality',
      contractId: 'contract-ns-2026-01',
      category: 'Confidentiality',
      group: 'core',
      title: 'Section 9 — Confidentiality & Proprietary Information',
      status: 'PRESENT',
      summary: 'Establishes mutual non-disclosure obligations, standards of care, and a 3-year survival term.',
      originalText: '9.1 Definition. "Confidential Information" means all non-public information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.\n9.2 Standard of Care. The Receiving Party shall use the same degree of care that it uses to protect the confidentiality of its own confidential information of like kind (but not less than reasonable care) to: (i) not use any Confidential Information of the Disclosing Party for any purpose outside the scope of this Agreement, and (ii) except as otherwise authorized by the Disclosing Party in writing, limit access to Confidential Information of the Disclosing Party to those of its and its Affiliates\' employees and contractors who need that access for purposes consistent with this Agreement and who have signed confidentiality agreements with the Receiving Party containing protections not materially less protective of the Confidential Information than those herein.',
      normalizedMeaning: 'Each party must protect disclosed non-public proprietary information using at least reasonable care and restrict internal access to authorized personnel.',
      sourceReferences: [
        {
          id: 'cite-ns-conf-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 14,
          sectionIdentifier: 'Section 9.1–9.2',
          textSnippet: 'The Receiving Party shall use the same degree of care that it uses to protect the confidentiality of its own confidential information of like kind (but not less than reasonable care)...',
          confidenceScore: 0.98,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 9',
      pageNumber: 14,
      explanation: 'Verified via explicit Article Heading 9 and standard mutual confidentiality signatures.'
    },
    {
      clauseId: 'clause-ns-liability',
      contractId: 'contract-ns-2026-01',
      category: 'Liability Limitation',
      group: 'core',
      title: 'Section 11 — Limitation of Liability',
      status: 'PRESENT',
      summary: '12-month fees aggregate liability ceiling with waiver of incidental and consequential damages.',
      originalText: '11.1 Aggregate Ceiling. EXCEPT FOR INDEMNIFICATION OBLIGATIONS UNDER SECTION 10 OR GROSS NEGLIGENCE, NEITHER PARTY\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL EXCEED THE TOTAL AMOUNT PAID BY CUSTOMER HEREUNDER IN THE TWELVE (12) MONTHS PRECEDING THE FIRST INCIDENT GIVING RISE TO LIABILITY, OR FIVE HUNDRED THOUSAND DOLLARS ($500,000), WHICHEVER IS LESS.\n11.2 Consequential Damages. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY LOST PROFITS, LOSS OF USE, LOSS OF DATA, OR FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, REGARDLESS OF THE FORM OF ACTION.',
      normalizedMeaning: 'Aggregate liability is capped at fees paid over the preceding twelve months (or $500,000, whichever is lower) and incidental damages are excluded.',
      sourceReferences: [
        {
          id: 'cite-ns-liab-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 18,
          sectionIdentifier: 'Section 11.1',
          textSnippet: 'NEITHER PARTY\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL EXCEED THE TOTAL AMOUNT PAID BY CUSTOMER HEREUNDER IN THE TWELVE (12) MONTHS PRECEDING...',
          confidenceScore: 0.96,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 11',
      pageNumber: 18,
      explanation: 'Identified through prominent capitalized heading and formulaic aggregate ceiling wording.'
    },
    {
      clauseId: 'clause-ns-indemnification',
      contractId: 'contract-ns-2026-01',
      category: 'Indemnification',
      group: 'core',
      title: 'Section 10 — Mutual Indemnification',
      status: 'PRESENT',
      summary: 'Mutual defense against third-party IP infringement and customer content claims.',
      originalText: '10.1 Northstar Indemnification. Northstar shall defend Customer against any claim, demand, suit or proceeding made or brought against Customer by an unaffiliated third party alleging that any Service infringes or misappropriates such third party\'s intellectual property rights, and shall indemnify Customer for any damages, attorney fees and costs finally awarded against Customer as a result of, or for amounts paid by Customer under a settlement approved by Northstar in writing.\n10.2 Customer Indemnification. Customer shall defend Northstar against any claim alleging that Customer Content infringes third party rights or violates applicable law.',
      normalizedMeaning: 'Provider defends customer against third-party IP infringement claims; customer defends provider against claims related to customer-uploaded content.',
      sourceReferences: [
        {
          id: 'cite-ns-indem-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 16,
          sectionIdentifier: 'Section 10.1',
          textSnippet: 'Northstar shall defend Customer against any claim, demand, suit or proceeding made or brought against Customer by an unaffiliated third party alleging that any Service infringes...',
          confidenceScore: 0.94,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 10',
      pageNumber: 16,
      explanation: 'Identified via Section 10 title and explicit mutual defense and hold harmless undertakings.'
    },
    {
      clauseId: 'clause-ns-termination',
      contractId: 'contract-ns-2026-01',
      category: 'Termination',
      group: 'core',
      title: 'Section 14 — Term & Termination',
      status: 'PRESENT',
      summary: '30-day notice for material breach with cure window; mutual convenience termination upon 60 days advance notice.',
      originalText: '14.2 Termination for Cause. A party may terminate this Agreement for cause: (i) upon thirty (30) days written notice to the other party of a material breach if such breach remains uncured at the expiration of such period, or (ii) if the other party becomes the subject of a petition in bankruptcy or any other proceeding relating to insolvency.\n14.3 Termination for Convenience. Customer may terminate this Agreement without cause at any time by providing Northstar at least sixty (60) calendar days prior written notice.',
      normalizedMeaning: 'Agreement allows termination for uncured material breach after 30 days notice, or by customer for convenience upon 60 days written notice.',
      sourceReferences: [
        {
          id: 'cite-ns-term-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 22,
          sectionIdentifier: 'Section 14.2–14.3',
          textSnippet: 'A party may terminate this Agreement for cause: (i) upon thirty (30) days written notice to the other party of a material breach if such breach remains uncured...',
          confidenceScore: 0.95,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 14',
      pageNumber: 22,
      explanation: 'Confirmed via Section 14 title and procedural cure and convenience subsections.'
    },
    {
      clauseId: 'clause-ns-renewal',
      contractId: 'contract-ns-2026-01',
      category: 'Renewal',
      group: 'core',
      title: 'Section 3.2 — Term and Renewal Extension',
      status: 'PRESENT',
      summary: 'Automatic 12-month extension unless non-renewal notice is delivered 45 days prior.',
      originalText: '3.2 Automatic Extension. Upon expiration of the Initial Term, this Agreement shall automatically renew for additional successive periods of twelve (12) months each (each a "Renewal Term"), unless either party delivers written notice of non-renewal to the other party at least forty-five (45) calendar days prior to the expiration of the then-current term.',
      normalizedMeaning: 'Contract automatically extends for 12-month periods unless written notice of non-renewal is provided at least 45 days before term end.',
      sourceReferences: [
        {
          id: 'cite-ns-renew-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 4,
          sectionIdentifier: 'Section 3.2',
          textSnippet: 'this Agreement shall automatically renew for additional successive periods of twelve (12) months each (each a "Renewal Term"), unless either party delivers written notice of non-renewal... at least forty-five (45) calendar days prior...',
          confidenceScore: 0.96,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 3.2',
      pageNumber: 4,
      explanation: 'Detected in Section 3 with explicit 45-day notice window formula.'
    },
    {
      clauseId: 'clause-ns-sla',
      contractId: 'contract-ns-2026-01',
      category: 'Service Level / SLA',
      group: 'core',
      title: 'Schedule B — Service Level Agreement (SLA)',
      status: 'PRESENT',
      summary: '99.9% uptime target with service credit remedies scaling up to 25% of monthly fees.',
      originalText: 'B.1 Uptime Commitment. Northstar will use commercially reasonable efforts to make the Cloud Infrastructure available with a Monthly Uptime Percentage of at least 99.9% during any monthly billing cycle.\nB.2 Service Credits. In the event Monthly Uptime falls between 99.0% and 99.89%, Customer will receive a 10% credit. If uptime falls below 99.0%, Customer will receive a 25% service credit against future invoices.',
      normalizedMeaning: 'Guarantees 99.9% monthly availability uptime with proportional billing credits for service downtime.',
      sourceReferences: [
        {
          id: 'cite-ns-sla-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 26,
          sectionIdentifier: 'Schedule B.1–B.2',
          textSnippet: 'Northstar will use commercially reasonable efforts to make the Cloud Infrastructure available with a Monthly Uptime Percentage of at least 99.9%...',
          confidenceScore: 0.95,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Schedule B',
      pageNumber: 26,
      explanation: 'Schedule B title and numeric percentage uptime benchmarks identified.'
    },
    {
      clauseId: 'clause-ns-governing-law',
      contractId: 'contract-ns-2026-01',
      category: 'Governing Law',
      group: 'core',
      title: 'Section 20.1 — Governing Law & Jurisdiction',
      status: 'PRESENT',
      summary: 'Governed by the laws of the State of Delaware without conflict of law principles.',
      originalText: '20.1 Governing Law. This Agreement, and any disputes arising out of or related hereto, will be governed exclusively by the internal substantive laws of the State of Delaware, without regard to its conflicts of laws rules or the United Nations Convention on the International Sale of Goods.',
      normalizedMeaning: 'Interpreted under the substantive laws of Delaware, excluding conflict of laws provisions.',
      sourceReferences: [
        {
          id: 'cite-ns-gov-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 32,
          sectionIdentifier: 'Section 20.1',
          textSnippet: 'This Agreement... will be governed exclusively by the internal substantive laws of the State of Delaware, without regard to its conflicts of laws rules...',
          confidenceScore: 0.97,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 20.1',
      pageNumber: 32,
      explanation: 'Standard statutory choice of law paragraph located in Section 20.'
    },

    // --- PRESENT: ADDITIONAL ---
    {
      clauseId: 'clause-ns-security-incident',
      contractId: 'contract-ns-2026-01',
      category: 'Security Incident / Breach Notification',
      group: 'additional',
      title: 'Section 7.4 — Security Incident & Data Breach Protocol',
      status: 'PRESENT',
      summary: '48-hour written notification upon confirmation of unauthorized access to customer data.',
      originalText: '7.4 Breach Notification. In the event Northstar confirms any unauthorized access, acquisition, or disclosure of Customer Personal Data ("Security Incident"), Northstar shall notify Customer in writing without undue delay and in any event within forty-eight (48) hours of becoming aware of the incident, and shall take immediate remediation steps.',
      normalizedMeaning: 'Vendor must report confirmed unauthorized customer data disclosures in writing within 48 hours and implement remediation.',
      sourceReferences: [
        {
          id: 'cite-ns-sec-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 11,
          sectionIdentifier: 'Section 7.4',
          textSnippet: 'Northstar shall notify Customer in writing without undue delay and in any event within forty-eight (48) hours of becoming aware of the incident...',
          confidenceScore: 0.92,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 7.4',
      pageNumber: 11,
      explanation: 'Detected under Data Security subsection with explicit 48-hour operational reporting cutoff.'
    },
    {
      clauseId: 'clause-ns-late-payment',
      contractId: 'contract-ns-2026-01',
      category: 'Late Payment',
      group: 'additional',
      title: 'Section 4.3 — Late Payment Accrual',
      status: 'PRESENT',
      summary: '1.5% monthly interest fee on past-due invoices with 15-day cure window prior to service suspension.',
      originalText: '4.3 Overdue Charges. If any invoiced amount is not received by Northstar by the due date, then without limiting Northstar\'s rights or remedies, those charges shall accrue late interest at the rate of 1.5% of the outstanding balance per month, or the maximum rate permitted by law, whichever is lower.',
      normalizedMeaning: 'Past-due invoices incur monthly late fees of 1.5% or the maximum statutory rate.',
      sourceReferences: [
        {
          id: 'cite-ns-late-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 7,
          sectionIdentifier: 'Section 4.3',
          textSnippet: 'charges shall accrue late interest at the rate of 1.5% of the outstanding balance per month, or the maximum rate permitted by law...',
          confidenceScore: 0.91,
          verifiedByHuman: false
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 4.3',
      pageNumber: 7,
      explanation: 'Identified under Payment Terms with explicit monthly interest calculation.'
    },

    // --- REVIEW_REQUIRED ---
    {
      clauseId: 'clause-ns-subcontracting',
      contractId: 'contract-ns-2026-01',
      category: 'Subcontracting',
      group: 'additional',
      title: 'Section 15.2 — Third-Party Delegation Language',
      status: 'REVIEW_REQUIRED',
      summary: 'Potential subcontracting authorization detected, but customer consent conditions are ambiguous.',
      originalText: '15.2 Operational Delegation. Northstar may utilize third-party infrastructure affiliates in connection with hosting operations, provided Northstar remains primarily responsible for operational compliance.',
      normalizedMeaning: 'Provider uses hosting affiliates while retaining baseline compliance responsibility, but formal subcontractor approval procedures are not explicitly defined.',
      sourceReferences: [
        {
          id: 'cite-ns-sub-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 24,
          sectionIdentifier: 'Section 15.2',
          textSnippet: 'Northstar may utilize third-party infrastructure affiliates in connection with hosting operations, provided Northstar remains primarily responsible...',
          confidenceScore: 0.62,
          verifiedByHuman: false
        }
      ],
      confidence: 'REVIEW',
      detectionMethod: 'contextual_pattern',
      reviewRequired: true,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 15.2',
      pageNumber: 24,
      explanation: 'Potential subcontracting provision detected, but classification confidence is insufficient for automatic confirmation. Review source document to determine whether prior customer consent is required.'
    },
    {
      clauseId: 'clause-ns-audit-rights',
      contractId: 'contract-ns-2026-01',
      category: 'Audit Rights',
      group: 'core',
      title: 'Section 8.4 — SOC 2 Audit Report Sharing',
      status: 'REVIEW_REQUIRED',
      summary: 'Supplier provides annual SOC 2 reports, but on-site inspection rights are restricted.',
      originalText: '8.4 Verification. Upon Customer\'s written request not more than once per calendar year, Northstar will provide a copy of its then-current SOC 2 Type II audit report. On-site physical facility inspections are not permitted due to multi-tenant security architecture.',
      normalizedMeaning: 'Customer is entitled to annual independent audit reports, but physical on-site audit access is expressly prohibited.',
      sourceReferences: [
        {
          id: 'cite-ns-audit-1',
          documentId: 'doc-ns-2026-01',
          documentName: 'Northstar_Cloud_Master_Agreement_v2.1.pdf',
          pageNumber: 13,
          sectionIdentifier: 'Section 8.4',
          textSnippet: 'Northstar will provide a copy of its then-current SOC 2 Type II audit report. On-site physical facility inspections are not permitted...',
          confidenceScore: 0.68,
          verifiedByHuman: false
        }
      ],
      confidence: 'REVIEW',
      detectionMethod: 'contextual_pattern',
      reviewRequired: true,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 8.4',
      pageNumber: 13,
      explanation: 'Provision mentions audit reports but restricts traditional on-site audit verification. Counsel review recommended to confirm compliance requirements.'
    },

    // --- NOT_IDENTIFIED ---
    {
      clauseId: 'clause-ns-non-compete',
      contractId: 'contract-ns-2026-01',
      category: 'Non-Competition',
      group: 'additional',
      title: 'Non-Competition',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching non-competition provision was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'No restrictive covenants or non-compete prohibitions were identified in the text.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    },
    {
      clauseId: 'clause-ns-exclusivity',
      contractId: 'contract-ns-2026-01',
      category: 'Exclusivity',
      group: 'additional',
      title: 'Exclusivity',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching exclusivity provision was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'No sole-source or exclusive procurement covenants were detected.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    },
    {
      clauseId: 'clause-ns-acceptance',
      contractId: 'contract-ns-2026-01',
      category: 'Acceptance',
      group: 'additional',
      title: 'Acceptance',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching formal deliverable acceptance testing provision was reliably identified.',
      originalText: '',
      normalizedMeaning: 'Standard cloud SaaS subscription model does not articulate staged milestone acceptance criteria.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    }
  ],

  // =========================================================================
  // 2. Vertex AI Platform Subscription & SLA Agreement (contract-va-2026-02)
  // =========================================================================
  'contract-va-2026-02': [
    {
      clauseId: 'clause-va-license-grant',
      contractId: 'contract-va-2026-02',
      category: 'License Grant',
      group: 'additional',
      title: 'Section 2.1 — Platform Access and API License Grant',
      status: 'PRESENT',
      summary: 'Non-exclusive, revocable worldwide license to query model endpoints via authorized APIs.',
      originalText: '2.1 License Grant. Subject to the terms and conditions of this Agreement, Vertex hereby grants Customer a limited, non-exclusive, non-transferable, revocable license to access and use the Vertex AI Platform and APIs solely for Customer\'s internal business operations during the Term.',
      normalizedMeaning: 'Customer receives a non-exclusive, revocable license to access AI platform endpoints solely for internal business operations.',
      sourceReferences: [
        {
          id: 'cite-va-lic-1',
          documentId: 'doc-va-2026-02',
          documentName: 'Vertex_AI_Platform_Agreement_Final.pdf',
          pageNumber: 5,
          sectionIdentifier: 'Section 2.1',
          textSnippet: 'Vertex hereby grants Customer a limited, non-exclusive, non-transferable, revocable license to access and use the Vertex AI Platform and APIs...',
          confidenceScore: 0.97,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 2.1',
      pageNumber: 5,
      explanation: 'Explicit section heading and standard grant terminology detected.'
    },
    {
      clauseId: 'clause-va-ip',
      contractId: 'contract-va-2026-02',
      category: 'Intellectual Property',
      group: 'core',
      title: 'Section 7 — Model Weights & Generated Output Ownership',
      status: 'PRESENT',
      summary: 'Customer owns prompts and generated outputs; Vertex retains proprietary foundation model weights.',
      originalText: '7.1 Ownership of Outputs. As between the parties, Customer owns all right, title, and interest in and to Inputs provided by Customer and Outputs generated by the Service. Vertex retains all proprietary rights, including copyrights and patent rights, in the underlying model architectures and foundation weights.',
      normalizedMeaning: 'Customer retains intellectual property in user inputs and generated results, while vendor retains proprietary model weights.',
      sourceReferences: [
        {
          id: 'cite-va-ip-1',
          documentId: 'doc-va-2026-02',
          documentName: 'Vertex_AI_Platform_Agreement_Final.pdf',
          pageNumber: 12,
          sectionIdentifier: 'Section 7.1',
          textSnippet: 'Customer owns all right, title, and interest in and to Inputs provided by Customer and Outputs generated by the Service...',
          confidenceScore: 0.95,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 7',
      pageNumber: 12,
      explanation: 'Identified via Section 7 title and distinct input/output ownership allocation.'
    },
    {
      clauseId: 'clause-va-confidentiality',
      contractId: 'contract-va-2026-02',
      category: 'Confidentiality',
      group: 'core',
      title: 'Section 6 — Non-Disclosure & Model Training Restrictions',
      status: 'PRESENT',
      summary: 'Strict confidentiality with explicit prohibition against using customer data to train public models.',
      originalText: '6.3 No Model Training. Confidential Information of Customer, including all customer prompts, embeddings, and dataset fine-tuning parameters, shall not be utilized by Vertex to train, tune, or improve public or multi-tenant machine learning models without express affirmative consent.',
      normalizedMeaning: 'Customer confidential data and fine-tuning datasets may not be utilized to train public machine learning models.',
      sourceReferences: [
        {
          id: 'cite-va-conf-1',
          documentId: 'doc-va-2026-02',
          documentName: 'Vertex_AI_Platform_Agreement_Final.pdf',
          pageNumber: 11,
          sectionIdentifier: 'Section 6.3',
          textSnippet: 'Confidential Information of Customer... shall not be utilized by Vertex to train, tune, or improve public or multi-tenant machine learning models...',
          confidenceScore: 0.98,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 6.3',
      pageNumber: 11,
      explanation: 'Confirmed in Section 6 with affirmative restriction against model training.'
    },
    {
      clauseId: 'clause-va-breach',
      contractId: 'contract-va-2026-02',
      category: 'Security Incident / Breach Notification',
      group: 'additional',
      title: 'Section 5.6 — Security Incident Escalation',
      status: 'REVIEW_REQUIRED',
      summary: 'Prompt notice required, but specific numerical hourly notification deadline is omitted.',
      originalText: '5.6 Incident Communication. In the event of a security compromise impacting customer training data, Vertex will promptly communicate with Customer\'s designated administrative contact to coordinate remediation.',
      normalizedMeaning: 'Vendor will notify customer promptly of security compromises impacting data, but does not provide a fixed hourly deadline.',
      sourceReferences: [
        {
          id: 'cite-va-sec-1',
          documentId: 'doc-va-2026-02',
          documentName: 'Vertex_AI_Platform_Agreement_Final.pdf',
          pageNumber: 10,
          sectionIdentifier: 'Section 5.6',
          textSnippet: 'In the event of a security compromise impacting customer training data, Vertex will promptly communicate with Customer\'s designated administrative contact...',
          confidenceScore: 0.65,
          verifiedByHuman: false
        }
      ],
      confidence: 'REVIEW',
      detectionMethod: 'contextual_pattern',
      reviewRequired: true,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 5.6',
      pageNumber: 10,
      explanation: 'Provision mandates prompt communication but lacks specific hourly deadlines (e.g. 24/48h). Review suggested to determine compliance with corporate incident response standards.'
    },
    {
      clauseId: 'clause-va-insurance',
      contractId: 'contract-va-2026-02',
      category: 'Insurance',
      group: 'core',
      title: 'Insurance',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching insurance coverage schedule was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'No minimum insurance coverage covenants or certificate delivery duties are articulated in the agreement.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    },
    {
      clauseId: 'clause-va-non-solicit',
      contractId: 'contract-va-2026-02',
      category: 'Non-Solicitation',
      group: 'additional',
      title: 'Non-Solicitation',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching non-solicitation covenant was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'Agreement contains no covenants restricting recruitment of research engineers or personnel.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    }
  ],

  // =========================================================================
  // 3. Apex Security Appliance Purchase & Software License (contract-ap-2026-03)
  // =========================================================================
  'contract-ap-2026-03': [
    {
      clauseId: 'clause-ap-delivery',
      contractId: 'contract-ap-2026-03',
      category: 'Delivery',
      group: 'additional',
      title: 'Section 2.1 — Hardware Shipping & Transfer of Risk',
      status: 'PRESENT',
      summary: 'FOB Origin shipping with risk of loss transferring to customer upon carrier pickup.',
      originalText: '2.1 Delivery Terms. Hardware units shall be delivered FCA (Incoterms 2020) Apex Manufacturing Facility. Risk of loss and title to hardware shall pass to Customer upon tender of goods to the commercial freight carrier.',
      normalizedMeaning: 'Appliance hardware ships FCA with risk of loss passing to customer upon handover to freight carrier.',
      sourceReferences: [
        {
          id: 'cite-ap-del-1',
          documentId: 'doc-ap-2026-03',
          documentName: 'Apex_Appliance_Purchase_Agreement.pdf',
          pageNumber: 4,
          sectionIdentifier: 'Section 2.1',
          textSnippet: 'Risk of loss and title to hardware shall pass to Customer upon tender of goods to the commercial freight carrier.',
          confidenceScore: 0.94,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 2.1',
      pageNumber: 4,
      explanation: 'Identified via Section 2.1 title and Incoterms shipping specifications.'
    },
    {
      clauseId: 'clause-ap-warranty',
      contractId: 'contract-ap-2026-03',
      category: 'Warranty',
      group: 'core',
      title: 'Section 6 — Hardware & Firmware Warranty',
      status: 'PRESENT',
      summary: '3-year hardware replacement warranty; 90-day conformity warranty for embedded firmware.',
      originalText: '6.1 Hardware Warranty. Apex warrants to Customer that hardware appliances will be free from material defects in workmanship and materials under normal operational use for thirty-six (36) months following shipment.\n6.2 Remedy. Customer\'s sole and exclusive remedy for breach of warranty shall be repair or replacement of defective units at Apex\'s option.',
      normalizedMeaning: 'Provides 36-month hardware repair or replacement warranty for defects in material and workmanship.',
      sourceReferences: [
        {
          id: 'cite-ap-war-1',
          documentId: 'doc-ap-2026-03',
          documentName: 'Apex_Appliance_Purchase_Agreement.pdf',
          pageNumber: 12,
          sectionIdentifier: 'Section 6.1–6.2',
          textSnippet: 'Apex warrants to Customer that hardware appliances will be free from material defects in workmanship and materials under normal operational use for thirty-six (36) months...',
          confidenceScore: 0.96,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 6',
      pageNumber: 12,
      explanation: 'Prominent Article 6 heading and explicit 36-month warranty term.'
    },
    {
      clauseId: 'clause-ap-acceptance',
      contractId: 'contract-ap-2026-03',
      category: 'Acceptance',
      group: 'additional',
      title: 'Section 2.4 — Verification & Deemed Acceptance',
      status: 'PRESENT',
      summary: '14-day physical inspection window with deemed acceptance upon failure to provide timely rejection notice.',
      originalText: '2.4 Acceptance Testing. Customer shall have fourteen (14) calendar days from receipt of appliances to inspect for physical transit damage and operational conformity. Appliances shall be deemed accepted unless Customer provides written notice of defect within said 14-day period.',
      normalizedMeaning: 'Customer has 14 days to inspect delivered appliances; failure to provide written defect notice constitutes deemed acceptance.',
      sourceReferences: [
        {
          id: 'cite-ap-acc-1',
          documentId: 'doc-ap-2026-03',
          documentName: 'Apex_Appliance_Purchase_Agreement.pdf',
          pageNumber: 5,
          sectionIdentifier: 'Section 2.4',
          textSnippet: 'Appliances shall be deemed accepted unless Customer provides written notice of defect within said 14-day period.',
          confidenceScore: 0.93,
          verifiedByHuman: false
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 2.4',
      pageNumber: 5,
      explanation: 'Detected under Delivery article with deemed acceptance timeline.'
    },
    {
      clauseId: 'clause-ap-transition',
      contractId: 'contract-ap-2026-03',
      category: 'Transition Assistance',
      group: 'additional',
      title: 'Section 11.2 — Appliance Decommissioning Support',
      status: 'REVIEW_REQUIRED',
      summary: 'Decommissioning data wipe assistance mentioned, but service rates and timelines are undefined.',
      originalText: '11.2 End of Life. Upon equipment retirement, Apex may assist with certified cryptographic disk shredding services subject to mutual execution of a statement of work.',
      normalizedMeaning: 'Vendor offers optional cryptographic sanitization upon retirement under a separate unexecuted statement of work.',
      sourceReferences: [
        {
          id: 'cite-ap-trans-1',
          documentId: 'doc-ap-2026-03',
          documentName: 'Apex_Appliance_Purchase_Agreement.pdf',
          pageNumber: 20,
          sectionIdentifier: 'Section 11.2',
          textSnippet: 'Apex may assist with certified cryptographic disk shredding services subject to mutual execution of a statement of work.',
          confidenceScore: 0.58,
          verifiedByHuman: false
        }
      ],
      confidence: 'REVIEW',
      detectionMethod: 'contextual_pattern',
      reviewRequired: true,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 11.2',
      pageNumber: 20,
      explanation: 'Transition assistance is conditional upon future statement of work. Counsel review suggested to verify whether firm de-installation commitments exist.'
    },
    {
      clauseId: 'clause-ap-exclusivity',
      contractId: 'contract-ap-2026-03',
      category: 'Exclusivity',
      group: 'additional',
      title: 'Exclusivity',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching exclusivity provision was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'Agreement contains no restrictions on purchasing third-party firewall or security hardware.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    }
  ],

  // =========================================================================
  // 4. Horizon Logistics Vendor Master Services Agreement (contract-hz-2026-04)
  // =========================================================================
  'contract-hz-2026-04': [
    {
      clauseId: 'clause-hz-insurance',
      contractId: 'contract-hz-2026-04',
      category: 'Insurance',
      group: 'core',
      title: 'Section 7 — Commercial Fleet & Cargo Insurance Requirements',
      status: 'PRESENT',
      summary: 'Mandates $5M commercial general liability and $2M motor cargo liability naming customer as additional insured.',
      originalText: '7.1 Required Policies. Vendor shall maintain at its sole cost: (i) Commercial General Liability insurance with limits not less than $5,000,000 per occurrence; (ii) Commercial Automobile Liability insurance with limits of $5,000,000 combined single limit; and (iii) Motor Truck Cargo insurance with limits not less than $2,000,000 per shipment. Customer shall be endorsed as an Additional Insured.',
      normalizedMeaning: 'Vendor must carry $5M general and automobile liability plus $2M cargo insurance and name customer as additional insured.',
      sourceReferences: [
        {
          id: 'cite-hz-ins-1',
          documentId: 'doc-hz-2026-04',
          documentName: 'Horizon_Logistics_MSA_2026.pdf',
          pageNumber: 16,
          sectionIdentifier: 'Section 7.1',
          textSnippet: 'Vendor shall maintain at its sole cost: (i) Commercial General Liability insurance with limits not less than $5,000,000 per occurrence...',
          confidenceScore: 0.98,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 7',
      pageNumber: 16,
      explanation: 'Identified via Section 7 title with explicit multi-million dollar policy requirements.'
    },
    {
      clauseId: 'clause-hz-audit',
      contractId: 'contract-hz-2026-04',
      category: 'Audit Rights',
      group: 'core',
      title: 'Section 11 — Books, Records, and Facility Audit Rights',
      status: 'PRESENT',
      summary: 'Annual on-site inspection of dispatch logs, vehicle maintenance, and driver qualification files.',
      originalText: '11.1 Right of Audit. Customer or its designated independent auditor shall have the right, upon ten (10) business days prior written notice and during normal business hours, to inspect and audit Vendor\'s operational records, vehicle inspection logs, DOT compliance records, and billings relating to the Services.',
      normalizedMeaning: 'Customer may audit carrier operational logs, safety inspection records, and invoices on 10 business days notice.',
      sourceReferences: [
        {
          id: 'cite-hz-aud-1',
          documentId: 'doc-hz-2026-04',
          documentName: 'Horizon_Logistics_MSA_2026.pdf',
          pageNumber: 24,
          sectionIdentifier: 'Section 11.1',
          textSnippet: 'Customer or its designated independent auditor shall have the right, upon ten (10) business days prior written notice and during normal business hours, to inspect and audit...',
          confidenceScore: 0.95,
          verifiedByHuman: true
        }
      ],
      confidence: 'HIGH',
      detectionMethod: 'heading_and_context',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 11',
      pageNumber: 24,
      explanation: 'Explicit Section 11 title and detailed audit notice procedures identified.'
    },
    {
      clauseId: 'clause-hz-subcontracting',
      contractId: 'contract-hz-2026-04',
      category: 'Subcontracting',
      group: 'additional',
      title: 'Section 8.1 — Carrier Brokering & Secondary Hauler Language',
      status: 'REVIEW_REQUIRED',
      summary: 'Prohibits re-brokering of loads without written consent, but emergency overflow exceptions lack clear criteria.',
      originalText: '8.1 Anti-Brokering. Vendor shall transport all tenders on equipment operated exclusively under its own operating authority. Double-brokering is strictly prohibited, except in unforeseen weather contingencies where secondary haulers may be dispatched upon verbal notice.',
      normalizedMeaning: 'Prohibits double-brokering of shipments, with an ambiguous exception permitting verbal dispatch of secondary haulers during weather contingencies.',
      sourceReferences: [
        {
          id: 'cite-hz-sub-1',
          documentId: 'doc-hz-2026-04',
          documentName: 'Horizon_Logistics_MSA_2026.pdf',
          pageNumber: 18,
          sectionIdentifier: 'Section 8.1',
          textSnippet: 'Double-brokering is strictly prohibited, except in unforeseen weather contingencies where secondary haulers may be dispatched upon verbal notice.',
          confidenceScore: 0.64,
          verifiedByHuman: false
        }
      ],
      confidence: 'REVIEW',
      detectionMethod: 'contextual_pattern',
      reviewRequired: true,
      detectedAt: '2026-09-14T10:00:00Z',
      sectionIdentifier: 'Section 8.1',
      pageNumber: 18,
      explanation: 'Strict anti-brokering rule contains an ambiguous verbal notice exception. Legal review recommended to confirm liability allocation during contingency dispatches.'
    },
    {
      clauseId: 'clause-hz-license-grant',
      contractId: 'contract-hz-2026-04',
      category: 'License Grant',
      group: 'additional',
      title: 'License Grant',
      status: 'NOT_IDENTIFIED',
      summary: 'No matching software license grant was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'Logistics services agreement does not grant intellectual property or software access licenses.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    },
    {
      clauseId: 'clause-hz-sla',
      contractId: 'contract-hz-2026-04',
      category: 'Service Level / SLA',
      group: 'core',
      title: 'Service Level / SLA',
      status: 'NOT_IDENTIFIED',
      summary: 'No formal technical service level agreement (SLA) was reliably identified in the extracted document.',
      originalText: '',
      normalizedMeaning: 'Agreement establishes delivery timetables in work orders rather than a recurring software uptime SLA schedule.',
      sourceReferences: [],
      confidence: 'LOW',
      detectionMethod: 'deterministic_rules',
      reviewRequired: false,
      detectedAt: '2026-09-14T10:00:00Z',
      explanation: 'No matching provision was reliably identified in the extracted document. Review source document if this provision is expected.'
    }
  ]
};

export function getDemoClausesForContract(contractId: string): ClauseIntelligenceRecord[] {
  return DEMO_CLAUSE_INTELLIGENCE_MAP[contractId] || [];
}
