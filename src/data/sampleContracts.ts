/**
 * ContractLens AI - Sample Commercial Contracts for Test Ingestion
 * Generates realistic contract text and File objects for rapid testing of the extraction pipeline.
 */

export interface SampleContractOption {
  id: string;
  fileName: string;
  type: string;
  contractType: string;
  format: string;
  size: string;
  content: string;
  description: string;
}

export const SAMPLE_CONTRACT_TEMPLATES: SampleContractOption[] = [
  {
    id: 'sample-apex-saas',
    fileName: 'Apex_Global_SaaS_License_2026.txt',
    type: 'Cloud Services',
    contractType: 'Cloud Services',
    format: 'TXT',
    size: '14.2 KB',
    description: 'Enterprise Cloud SaaS License with auto-renewal, SLA, and strict limitation of liability.',
    content: `MASTER CLOUD SERVICES AND SOFTWARE LICENSE AGREEMENT

This Master Cloud Services Agreement ("Agreement") is made and entered into as of January 15, 2026 ("Effective Date"), by and between Apex Global Technologies Inc., a Delaware corporation having its principal place of business at 500 Technology Way, Wilmington, DE 19801 ("Provider"), and Acme Operations Global Corp., a Delaware corporation having its principal office at 100 Enterprise Blvd, San Francisco, CA 94105 ("Customer").

RECITALS
WHEREAS, Provider has developed and operates a proprietary enterprise data platform and cloud services; and
WHEREAS, Customer desires to access and utilize the Cloud Services in accordance with the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

\f
--- [ PAGE 2 ] ---
ARTICLE I: DEFINITIONS AND SUBSCRIPTION SCOPE

1.1 "Authorized Users" means Customer's employees, agents, and independent contractors authorized by Customer to access the Services.
1.2 "Customer Data" means all electronic data, content, or materials submitted by Customer to the Cloud Service.
1.3 "Service Availability" means the percentage of total scheduled operating time during which the core API is reachable.

SECTION 2.1 License Grant and Restrictions.
Subject to the terms of this Agreement, Provider grants to Customer a non-exclusive, non-transferable, non-sublicensable, worldwide subscription license during the Term to access and use the Cloud Services solely for Customer's internal business operations. Customer shall not reverse engineer, decompile, or create derivative works from the Services.

SECTION 2.2 Customer Data Ownership.
As between the parties, Customer retains all right, title, and interest, including all Intellectual Property Rights, in and to all Customer Data. Provider acquires no rights in Customer Data except the limited license necessary to provide the Services.

\f
--- [ PAGE 3 ] ---
ARTICLE III: FEES, INVOICING, AND PAYMENT TERMS

3.1 Fees and Payment Schedule.
Customer shall pay the annual subscription fees in the amount of $145,000.00 USD within thirty (30) calendar days of receipt of Provider's invoice (Net 30 days). All fees are non-refundable except as expressly provided herein.

3.2 Taxes.
Customer shall be responsible for all applicable sales, use, excise, and value-added taxes, excluding taxes based solely on Provider's net income.

3.3 Late Payment.
Unpaid amounts not subject to a good-faith dispute shall accrue interest at the rate of 1.0% per month or the maximum rate permitted by law, whichever is less.

\f
--- [ PAGE 4 ] ---
ARTICLE IV: TERM, RENEWAL, AND TERMINATION

4.1 Term.
The initial term of this Agreement commences on the Effective Date and shall continue in full force and effect until January 15, 2027 ("Expiration Date"), unless terminated earlier pursuant to this Section.

4.2 Automatic Renewal and Notice Window.
This Agreement shall automatically renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least forty-five (45) calendar days prior to the expiration of the then-current Term.

4.3 Termination for Cause.
Either party may terminate this Agreement immediately upon written notice if the other party breaches any material provision of this Agreement and fails to cure such breach within thirty (30) calendar days of receiving written notice thereof.

4.4 Termination for Insolvency.
Either party may terminate this Agreement upon written notice if the other party becomes insolvent, enters receivership, or files for bankruptcy.

\f
--- [ PAGE 5 ] ---
ARTICLE V: SERVICE LEVELS AND AVAILABILITY (SLA)

5.1 Uptime Guarantee.
Provider shall maintain a monthly Service Availability level of at least 99.9% ("SLA Commitment"), excluding scheduled maintenance windows announced at least 72 hours in advance.

5.2 SLA Credits.
If Provider fails to meet the SLA Commitment during any calendar month, Customer shall be entitled to receive a service credit equal to 10% of that month's prorated subscription fee upon written notice submitted within thirty (30) days of month-end.

\f
--- [ PAGE 6 ] ---
ARTICLE VI: CONFIDENTIALITY AND SECURITY

6.1 Definition of Confidential Information.
"Confidential Information" means all non-public information disclosed by either party to the other, whether orally or in writing, designated as confidential or that reasonably should be understood to be confidential given the nature of the information.

6.2 Standard of Care.
Each party agrees to protect the other's Confidential Information with the same degree of care it uses for its own confidential materials, but not less than reasonable care.

6.3 Exclusions.
Confidential Information does not include information that is or becomes publicly known without breach of this Agreement.

\f
--- [ PAGE 7 ] ---
ARTICLE VII: LIMITATION OF LIABILITY AND DAMAGES

7.1 Aggregate Liability Cap.
EXCEPT FOR WILLFUL MISCONDUCT OR BREACH OF CONFIDENTIALITY OBLIGATIONS, IN NO EVENT SHALL EITHER PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

7.2 Exclusion of Consequential Damages.
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

\f
--- [ PAGE 8 ] ---
ARTICLE VIII: INDEMNIFICATION

8.1 Provider IP Indemnification.
Provider shall defend, indemnify, and hold harmless Customer, its officers, directors, and employees from and against any third-party claims alleging that Customer's authorized use of the Cloud Services infringes any valid patent, copyright, or trademark.

8.2 Indemnification Procedure.
Customer shall give prompt written notice of any claim to Provider, allow Provider sole control over defense and settlement, and cooperate reasonably at Provider's expense.

\f
--- [ PAGE 9 ] ---
ARTICLE IX: GOVERNING LAW AND GENERAL PROVISIONS

9.1 Governing Law and Venue.
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. The parties submit to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware.

9.2 Entire Agreement and Severability.
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof. If any provision is held unenforceable, the remaining provisions shall remain in full force.

IN WITNESS WHEREOF, the parties hereto have executed this Master Cloud Services Agreement by their duly authorized representatives.

APEX GLOBAL TECHNOLOGIES INC.
By: /s/ Robert Vance
Name: Robert Vance
Title: Vice President & General Counsel
Date: January 15, 2026

ACME OPERATIONS GLOBAL CORP.
By: /s/ Elena Rostova
Name: Elena Rostova
Title: Chief Technology Officer
Date: January 15, 2026
`
  },
  {
    id: 'sample-omnidata-dpa',
    fileName: 'OmniData_Security_DPA_Executed.txt',
    type: 'Software License & DPA',
    contractType: 'Software License & DPA',
    format: 'TXT',
    size: '11.8 KB',
    description: 'Data Processing Addendum covering GDPR Article 28, SOC2 safeguards, and 48-hour breach notification.',
    content: `DATA PROCESSING ADDENDUM (DPA) AND SECURITY SCHEDULE

This Data Processing Addendum ("DPA") supplements the Master Agreement by and between OmniData Solutions LLC ("Data Processor") and Acme Operations Global Corp. ("Data Controller").

SECTION 1: SUBJECT MATTER AND DURATION
This DPA governs the Processing of Personal Data on behalf of Data Controller in connection with the cloud analytics software. The term of this DPA shall run concurrently with the Principal Agreement until all Customer Personal Data is deleted or returned.

\f
--- [ PAGE 2 ] ---
SECTION 2: PROCESSOR OBLIGATIONS AND GDPR COMPLIANCE
2.1 Processing Instructions. Data Processor shall Process Personal Data only on documented instructions from Controller, including with respect to transfers of Personal Data to a third country or international organization.
2.2 Confidentiality of Staff. Processor shall ensure that persons authorized to process Personal Data have committed themselves to confidentiality.

\f
--- [ PAGE 3 ] ---
SECTION 3: TECHNICAL AND ORGANIZATIONAL SECURITY MEASURES
3.1 Processor shall maintain appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including AES-256 encryption at rest and TLS 1.3 in transit.
3.2 Processor shall undergo an annual independent SOC 2 Type II audit and provide copies of such audit reports to Controller upon request.

\f
--- [ PAGE 4 ] ---
SECTION 4: SECURITY INCIDENT NOTIFICATION
4.1 Breach Notice Window.
Processor shall notify Controller in writing without undue delay, and in any event within forty-eight (48) hours, after becoming aware of any confirmed Personal Data Breach or unauthorized access.

SECTION 5: SUB-PROCESSORS AND AUDIT RIGHTS
5.1 Controller may conduct an audit of Processor's compliance with this DPA upon thirty (30) days prior written notice during normal business hours.

GOVERNING LAW: State of New York.
`
  },
  {
    id: 'sample-meridian-sow',
    fileName: 'Meridian_Facilities_Vendor_SOW.txt',
    type: 'Vendor Agreement',
    contractType: 'Vendor Agreement',
    format: 'TXT',
    size: '8.4 KB',
    description: 'Vendor Statement of Work for facility maintenance, monthly SLAs, and insurance requirements.',
    content: `STATEMENT OF WORK FOR VENDOR FACILITY MANAGEMENT

This Statement of Work #2026-F1 is entered into as of February 1, 2026, by Meridian Facilities Group Inc. ("Vendor") and Acme Operations Global Corp. ("Client").

1. SCOPE OF SERVICES
Vendor shall provide complete HVAC preventative maintenance, electrical inspections, and physical facility security monitoring for Client facilities.

2. PAYMENT TERMS
Client shall pay monthly recurring fees of $12,500.00 USD. Payment terms are Net 30 calendar days from receipt of detailed invoice.

3. INSURANCE AND INDEMNIFICATION
Vendor shall maintain Commercial General Liability Insurance with limits not less than $2,000,000 per occurrence and $4,000,000 aggregate. Vendor agrees to defend and indemnify Client from third-party slip-and-fall or physical property damage claims arising from Vendor negligence.

4. TERM AND TERMINATION
The initial term is for twenty-four (24) months ending February 1, 2028. Either party may terminate with 60 days advance written notice.

Governing Law: State of California.
`
  }
];

export function createSampleFile(sample: SampleContractOption): File {
  const blob = new Blob([sample.content], { type: 'text/plain' });
  return new File([blob], sample.fileName, { type: 'text/plain' });
}
