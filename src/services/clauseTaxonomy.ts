/**
 * ContractLens AI - Clause Taxonomy & Detection Signatures
 * Segment 4: Standard 50-Clause Comprehensive Commercial Taxonomy
 * 
 * Provides layered detection patterns:
 * - Layer 1: Headings and section titles
 * - Layer 2: Contextual phrase patterns & required proximity signals
 * - Layer 3: Anti-false-positive exclusions (e.g. TOC-only, stray casual mentions)
 * - Layer 4: Neutral, conservative factual normalized meanings
 */

import { ClauseCategoryDefinition, ClauseTaxonomyCategory, ClauseTaxonomyGroup } from '../types/clause';

export interface CategoryDetectionRule {
  category: ClauseTaxonomyCategory;
  group: ClauseTaxonomyGroup;
  displayName: string;
  description: string;
  typicalHeadings: RegExp[];
  keyPhrases: RegExp[];
  boostPhrases: RegExp[];
  falsePositiveExclusions: RegExp[];
  generateNormalizedMeaning: (originalText: string, sectionTitle?: string) => string;
}

export const CLAUSE_TAXONOMY_RULES: CategoryDetectionRule[] = [
  // ==================== CORE TAXONOMY ====================
  {
    category: 'Confidentiality',
    group: 'core',
    displayName: 'Confidentiality',
    description: 'Obligations to protect proprietary and non-public information from unauthorized disclosure.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(confidentiality|nondisclosure|non-disclosure|confidential\s+information)\b/i
    ],
    keyPhrases: [
      /keep\s+confidential/i,
      /confidential\s+information/i,
      /disclosure\s+restrictions/i,
      /receiving\s+party.*disclosing\s+party/i,
      /standard\s+of\s+care.*protect/i,
      /permitted\s+disclosures/i
    ],
    boostPhrases: [
      /duty\s+of\s+confidentiality/i,
      /proprietary\s+information/i,
      /return\s+or\s+destroy.*confidential/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /contents\s+page/i,
      /keep\s+(their|your)\s+password\s+confidential/i,
      /login\s+credentials\s+confidential/i
    ],
    generateNormalizedMeaning: () => 
      'Receiving party is required to maintain the confidentiality of disclosed proprietary materials and restrict unauthorized disclosure.'
  },
  {
    category: 'Intellectual Property',
    group: 'core',
    displayName: 'Intellectual Property',
    description: 'Allocation of patents, copyrights, trademarks, trade secrets, and ownership of deliverables.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(intellectual\s+property|ip\s+rights|proprietary\s+rights|ownership\s+of\s+intellectual\s+property)\b/i
    ],
    keyPhrases: [
      /intellectual\s+property/i,
      /patents?,\s*copyrights?|trademarks?|trade\s+secrets?/i,
      /work\s+made\s+for\s+hire/i,
      /all\s+right,\s+title\s+and\s+interest/i,
      /retains?\s+all\s+ownership/i
    ],
    boostPhrases: [
      /pre-existing\s+ip|background\s+ip/i,
      /developed\s+materials/i,
      /assignment\s+of\s+inventions/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Parties establish legal ownership boundaries over pre-existing intellectual property and materials created under the agreement.'
  },
  {
    category: 'Data Protection',
    group: 'core',
    displayName: 'Data Protection',
    description: 'Safeguards, compliance mandates, and processing standards for personal and organizational data.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(data\s+protection|data\s+security|data\s+privacy|gdpr|information\s+security)\b/i
    ],
    keyPhrases: [
      /personal\s+data|personal\s+information/i,
      /data\s+protection\s+laws?|gdpr|ccpa/i,
      /data\s+controller|data\s+processor/i,
      /technical\s+and\s+organizational\s+measures/i,
      /processing\s+of\s+personal\s+data/i
    ],
    boostPhrases: [
      /security\s+safeguards/i,
      /sub-processors?/i,
      /data\s+protection\s+agreement/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /data\s+entry\s+personnel/i
    ],
    generateNormalizedMeaning: () => 
      'Vendor must adhere to technical and organizational safeguards and applicable data protection regulations when processing customer data.'
  },
  {
    category: 'Privacy',
    group: 'core',
    displayName: 'Privacy',
    description: 'Policies and commitments regarding collection, handling, and rights regarding private user information.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(privacy|privacy\s+policy|consumer\s+privacy)\b/i
    ],
    keyPhrases: [
      /privacy\s+policy/i,
      /consumer\s+privacy/i,
      /data\s+subject\s+rights/i,
      /opt-out|consent\s+to\s+process/i
    ],
    boostPhrases: [
      /personally\s+identifiable\s+information/i,
      /right\s+to\s+be\s+forgotten/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Sets forth conditions under which individual privacy preferences and regulatory consumer rights are recognized.'
  },
  {
    category: 'Liability Limitation',
    group: 'core',
    displayName: 'Liability Limitation',
    description: 'Monetary caps on aggregate liability and exclusions for indirect or consequential damages.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(limitation\s+of\s+liability|liability\s+cap|waiver\s+of\s+consequential\s+damages|consequential\s+damages)\b/i
    ],
    keyPhrases: [
      /limitation\s+of\s+liability/i,
      /aggregate\s+liability/i,
      /indirect,?\s*incidental,?\s*special,?\s*(or\s*)?consequential\s+damages/i,
      /lost\s+profits/i,
      /shall\s+not\s+exceed/i,
      /in\s+no\s+event\s+shall/i
    ],
    boostPhrases: [
      /total\s+cumulative\s+liability/i,
      /fees\s+paid\s+in\s+the\s+preceding/i,
      /super-cap|uncapped\s+liabilities/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /without\s+liability\s+insurance/i
    ],
    generateNormalizedMeaning: (text) => {
      if (/fees\s+paid/i.test(text)) {
        return 'Caps maximum aggregate liability to fees paid during a specified preceding period and waives consequential damages.';
      }
      return 'Establishes aggregate financial liability ceiling and excludes consequential, punitive, and incidental damages.';
    }
  },
  {
    category: 'Indemnification',
    group: 'core',
    displayName: 'Indemnification',
    description: 'Obligation of one party to defend, hold harmless, and compensate the other against third-party claims.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(indemnification|indemnity|defense\s+of\s+claims)\b/i
    ],
    keyPhrases: [
      /indemnify|indemnification/i,
      /defend\s+and\s+hold\s+harmless/i,
      /third-party\s+claims?/i,
      /losses,?\s*damages,?\s*(and\s*)?liabilities/i,
      /settlement\s+of\s+claims/i
    ],
    boostPhrases: [
      /infringement\s+indemnity/i,
      /sole\s+control\s+of\s+the\s+defense/i,
      /prompt\s+written\s+notice\s+of\s+claim/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Obligates the indemnifying party to defend and hold harmless the other against designated third-party claims, liabilities, and judgments.'
  },
  {
    category: 'Termination',
    group: 'core',
    displayName: 'Termination',
    description: 'Rules governing contract dissolution for cause, convenience, insolvency, or expiration.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(term\s+and\s+termination|termination|cancellation)\b/i
    ],
    keyPhrases: [
      /terminate\s+this\s+agreement/i,
      /termination\s+for\s+cause/i,
      /termination\s+for\s+convenience/i,
      /material\s+breach/i,
      /cure\s+period/i,
      /effective\s+upon\s+notice/i
    ],
    boostPhrases: [
      /written\s+notice\s+of\s+termination/i,
      /thirty\s*\(30\)\s*days/i,
      /insolvency\s+or\s+bankruptcy/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /termination\s+date\s+of\s+prior\s+agreement/i
    ],
    generateNormalizedMeaning: () => 
      'Defines procedural triggers for ending the agreement, including notice periods for material breach and convenience rights if applicable.'
  },
  {
    category: 'Renewal',
    group: 'core',
    displayName: 'Renewal',
    description: 'Provisions specifying automatic extension, term duration, and non-renewal notice cutoffs.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(term|renewal|contract\s+term|duration)\b/i
    ],
    keyPhrases: [
      /automatically\s+renew/i,
      /successive\s+periods?/i,
      /written\s+notice\s+of\s+non-renewal/i,
      /renewal\s+term/i,
      /prior\s+to\s+the\s+expiration/i
    ],
    boostPhrases: [
      /sixty\s*\(60\)\s*days\s+prior/i,
      /thirty\s*\(30\)\s*days\s+prior/i,
      /initial\s+term/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Agreement automatically renews for successive terms unless either party issues written notice of non-renewal prior to the cutoff window.'
  },
  {
    category: 'Payment',
    group: 'core',
    displayName: 'Payment',
    description: 'Invoicing procedures, remittance timelines, payment methods, and receipt conditions.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(payment|payment\s+terms|invoicing|fees\s+and\s+payment)\b/i
    ],
    keyPhrases: [
      /payment\s+due/i,
      /net\s+(15|30|45|60|90)\b/i,
      /invoice\s+date/i,
      /remit\s+payment/i,
      /invoicing\s+frequency/i
    ],
    boostPhrases: [
      /electronic\s+funds\s+transfer/i,
      /undisputed\s+amounts/i,
      /disputed\s+invoices/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Specifies invoice delivery mechanism and obligates recipient to remit undisputed payments within the defined Net payment schedule.'
  },
  {
    category: 'Pricing',
    group: 'core',
    displayName: 'Pricing',
    description: 'Fee structures, rate cards, price escalation limits, and currency specifications.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(fees|pricing|rates|compensation|charges)\b/i
    ],
    keyPhrases: [
      /fee\s+schedule/i,
      /subscription\s+fees?/i,
      /rate\s+card/i,
      /price\s+increase/i,
      /annual\s+escalation/i,
      /fixed\s+fee/i
    ],
    boostPhrases: [
      /cpi\s+adjustment/i,
      /per\s+user|per\s+month|annual\s+fee/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Establishes contractual price matrix, subscription rates, and parameters regarding future fee adjustments.'
  },
  {
    category: 'Service Level / SLA',
    group: 'core',
    displayName: 'Service Level / SLA',
    description: 'Availability uptime percentages, response times, and service credit remedies.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(service\s+levels?|sla|service\s+availability|uptime)\b/i
    ],
    keyPhrases: [
      /service\s+level/i,
      /uptime\s+percentage|availability\s+target/i,
      /99\.\d+%/i,
      /service\s+credits?/i,
      /response\s+time/i,
      /scheduled\s+maintenance/i
    ],
    boostPhrases: [
      /monthly\s+uptime/i,
      /severity\s+level/i,
      /sole\s+and\s+exclusive\s+financial\s+remedy/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Guarantees system availability uptime commitments and defines financial service credit formulas for unscheduled service outages.'
  },
  {
    category: 'Warranty',
    group: 'core',
    displayName: 'Warranty',
    description: 'Guarantees of product performance, conformity to specifications, and warranty disclaimers.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(warranties|warranty|limited\s+warranty|disclaimer\s+of\s+warranties)\b/i
    ],
    keyPhrases: [
      /warrants?\s+that/i,
      /as\s+is\b/i,
      /merchantability/i,
      /fitness\s+for\s+a\s+particular\s+purpose/i,
      /conform\s+to\s+specifications/i,
      /warranty\s+period/i
    ],
    boostPhrases: [
      /disclaim\s+all\s+other\s+warranties/i,
      /express\s+or\s+implied/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Outlines performance guarantees and disclaims implied warranties such as merchantability and fitness for purpose.'
  },
  {
    category: 'Representations',
    group: 'core',
    displayName: 'Representations',
    description: 'Formal statements of fact made by parties regarding authority, corporate standing, and legal capacity.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(representations\s+and\s+warranties|mutual\s+representations)\b/i
    ],
    keyPhrases: [
      /represents?\s+and\s+warrants?/i,
      /duly\s+organized|validly\s+existing/i,
      /power\s+and\s+authority/i,
      /does\s+not\s+conflict\s+with/i,
      /enforceable\s+in\s+accordance/i
    ],
    boostPhrases: [
      /binding\s+obligation/i,
      /good\s+standing/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Parties formally declare their organizational authority, legal standing, and absence of conflicting agreements.'
  },
  {
    category: 'Assignment',
    group: 'core',
    displayName: 'Assignment',
    description: 'Restrictions or permissions regarding transferring rights or delegating obligations to third parties.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(assignment|successors\s+and\s+assigns)\b/i
    ],
    keyPhrases: [
      /may\s+not\s+assign/i,
      /prior\s+written\s+consent/i,
      /successors\s+and\s+permitted\s+assigns/i,
      /merger,?\s*acquisition,?\s*or\s*sale\s+of\s+assets/i,
      /assignment\s+in\s+violation/i
    ],
    boostPhrases: [
      /shall\s+not\s+be\s+unreasonably\s+withheld/i,
      /change\s+of\s+control/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /assigned\s+counsel/i,
      /assigned\s+personnel/i
    ],
    generateNormalizedMeaning: () => 
      'Prohibits assignment of contract rights without prior written consent, except in connection with qualifying corporate transactions.'
  },
  {
    category: 'Audit Rights',
    group: 'core',
    displayName: 'Audit Rights',
    description: 'Authority to inspect records, security systems, and books to ensure compliance.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(audit|audit\s+rights|inspection\s+of\s+records|books\s+and\s+records)\b/i
    ],
    keyPhrases: [
      /right\s+to\s+audit/i,
      /inspect\s+records/i,
      /reasonable\s+prior\s+notice/i,
      /during\s+regular\s+business\s+hours/i,
      /independent\s+auditor/i
    ],
    boostPhrases: [
      /audit\s+shall\s+not\s+unreasonably\s+interfere/i,
      /cost\s+of\s+the\s+audit/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Grants inspection rights to verify operational, licensing, or financial compliance during business hours upon advance notice.'
  },
  {
    category: 'Insurance',
    group: 'core',
    displayName: 'Insurance',
    description: 'Mandatory coverage types (e.g., Commercial General Liability, Cyber, E&O) and policy minimums.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(insurance|insurance\s+requirements|coverage)\b/i
    ],
    keyPhrases: [
      /maintain\s+insurance/i,
      /commercial\s+general\s+liability/i,
      /errors\s+and\s+omissions|cyber\s+liability/i,
      /workers['\s]+compensation/i,
      /certificate\s+of\s+insurance/i,
      /additional\s+insured/i
    ],
    boostPhrases: [
      /\$\d+[\d,]*\s*(million|per\s+occurrence)/i,
      /policy\s+limits/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /health\s+insurance\s+benefits\s+of\s+employees/i,
      /our\s+insurance\s+covers\s+office\s+rent/i
    ],
    generateNormalizedMeaning: () => 
      'Requires supplier to maintain designated commercial general, errors & omissions, and cyber liability policies at stipulated minimum limits.'
  },
  {
    category: 'Force Majeure',
    group: 'core',
    displayName: 'Force Majeure',
    description: 'Excusal of performance delays caused by unforeseeable events beyond reasonable control.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(force\s+majeure|acts\s+of\s+god|uncontrollable\s+events)\b/i
    ],
    keyPhrases: [
      /force\s+majeure/i,
      /acts\s+of\s+god/i,
      /beyond\s+(its\s+)?reasonable\s+control/i,
      /war,?\s*terrorism,?\s*riot/i,
      /strikes?|labor\s+disputes?/i,
      /excused\s+from\s+performance/i
    ],
    boostPhrases: [
      /prompt\s+notice\s+of\s+force\s+majeure/i,
      /failure\s+to\s+pay\s+shall\s+not\s+be\s+excused/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Suspends performance obligations during qualifying events outside reasonable control, excluding monetary payment duties.'
  },
  {
    category: 'Governing Law',
    group: 'core',
    displayName: 'Governing Law',
    description: 'Jurisdiction whose statutory and case law governs the interpretation and enforcement of the agreement.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(governing\s+law|applicable\s+law|choice\s+of\s+law)\b/i
    ],
    keyPhrases: [
      /governed\s+by/i,
      /laws\s+of\s+the\s+state\s+of/i,
      /without\s+regard\s+to\s+conflict(s)?\s+of\s+laws?/i,
      /construed\s+in\s+accordance\s+with/i
    ],
    boostPhrases: [
      /state\s+of\s+[A-Z][a-z]+/i,
      /substantive\s+laws\s+of/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Establishes the designated jurisdiction whose substantive legal principles govern contract interpretation.'
  },
  {
    category: 'Dispute Resolution',
    group: 'core',
    displayName: 'Dispute Resolution',
    description: 'Mandatory procedures for resolving conflicts, including negotiation, mediation, and arbitration.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(dispute\s+resolution|arbitration|mediation|jurisdiction\s+and\s+venue)\b/i
    ],
    keyPhrases: [
      /arbitration/i,
      /mediation/i,
      /dispute\s+resolution/i,
      /exclusive\s+jurisdiction/i,
      /american\s+arbitration\s+association|jams/i,
      /waiver\s+of\s+jury\s+trial/i
    ],
    boostPhrases: [
      /good\s+faith\s+negotiation/i,
      /venue\s+shall\s+lie\s+in/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Mandates escalation procedures, venue selection, and binding arbitration or judicial forum for legal disputes.'
  },
  {
    category: 'Notices',
    group: 'core',
    displayName: 'Notices',
    description: 'Protocol for formal communications, valid delivery methods, and address designations.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(notices|formal\s+notices|communications)\b/i
    ],
    keyPhrases: [
      /notices?\s+shall\s+be\s+in\s+writing/i,
      /certified\s+mail|overnight\s+courier/i,
      /deemed\s+(given|received)/i,
      /addressed\s+as\s+follows/i,
      /email\s+notification/i
    ],
    boostPhrases: [
      /legal-notices@/i,
      /attention:\s+general\s+counsel/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /notice\s+board/i
    ],
    generateNormalizedMeaning: () => 
      'Designates recognized communication channels, postal or electronic addresses, and effective receipt standards for legal notices.'
  },
  {
    category: 'Amendments / Change Control',
    group: 'core',
    displayName: 'Amendments / Change Control',
    description: 'Requirements for modifying agreement terms or implementing changes to scope.',
    typicalHeadings: [
      /(^|\b)(section|article)?\s*\d*[\.\)]?\s*(amendments?|modifications?|change\s+orders?|change\s+control)\b/i
    ],
    keyPhrases: [
      /amended\s+only\s+by\s+a\s+written/i,
      /signed\s+by\s+authorized\s+representatives/i,
      /change\s+order\s+procedure/i,
      /no\s+oral\s+modification/i
    ],
    boostPhrases: [
      /writing\s+signed\s+by\s+both\s+parties/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Requires bilateral written execution by authorized signatories for any formal amendment or scope modification.'
  },

  // ==================== ADDITIONAL TAXONOMY ====================
  {
    category: 'Security Requirements',
    group: 'additional',
    displayName: 'Security Requirements',
    description: 'Specific cybersecurity baselines, encryption protocols, and infrastructure standards.',
    typicalHeadings: [
      /(^|\b)(security\s+requirements|information\s+security|cybersecurity|security\s+standards)\b/i
    ],
    keyPhrases: [
      /encryption\s+at\s+rest|encryption\s+in\s+transit/i,
      /soc\s*2|iso\s*27001/i,
      /vulnerability\s+assessments?|penetration\s+testing/i,
      /security\s+controls/i
    ],
    boostPhrases: [
      /industry\s+standard\s+security/i,
      /multi-factor\s+authentication/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Mandates compliance with defined technical security frameworks, encryption standards, and periodic vulnerability audits.'
  },
  {
    category: 'Compliance',
    group: 'additional',
    displayName: 'Compliance',
    description: 'Obligations to obey applicable statutory, regulatory, and municipal ordinances.',
    typicalHeadings: [
      /(^|\b)(compliance|compliance\s+with\s+laws?|legal\s+compliance)\b/i
    ],
    keyPhrases: [
      /comply\s+with\s+all\s+applicable\s+laws/i,
      /statutes,?\s*rules,?\s*(and\s*)?regulations/i,
      /governmental\s+authorities/i
    ],
    boostPhrases: [
      /licenses\s+and\s+permits/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Requires parties to conduct operations in compliance with all relevant jurisdictional laws and administrative regulations.'
  },
  {
    category: 'Subcontracting',
    group: 'additional',
    displayName: 'Subcontracting',
    description: 'Rules regarding engaging third-party vendors and responsibility for their actions.',
    typicalHeadings: [
      /(^|\b)(subcontractors?|subcontracting|delegation)\b/i
    ],
    keyPhrases: [
      /engage\s+subcontractors?/i,
      /remain\s+responsible\s+for/i,
      /subcontractor\s+performance/i,
      /prior\s+approval\s+of\s+subcontractors/i
    ],
    boostPhrases: [
      /acts\s+and\s+omissions\s+of\s+subcontractors/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Permits or limits engagement of third-party subcontractors while maintaining prime contractor responsibility for performance.'
  },
  {
    category: 'Security Incident / Breach Notification',
    group: 'additional',
    displayName: 'Security Incident / Breach Notification',
    description: 'Timelines and duties to notify the other party upon discovery of a data compromise.',
    typicalHeadings: [
      /(^|\b)(security\s+incident|security\s+breach|breach\s+notification|incident\s+response)\b/i
    ],
    keyPhrases: [
      /security\s+breach|security\s+incident/i,
      /notify.*within\s+\d+\s+(hours|business\s+days)/i,
      /remediation\s+efforts/i,
      /unauthorized\s+access\s+to\s+customer\s+data/i
    ],
    boostPhrases: [
      /without\s+undue\s+delay/i,
      /promptly\s+investigate/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Obligates supplier to report confirmed or suspected data security incidents within designated hourly or daily reporting windows.'
  },
  {
    category: 'License Grant',
    group: 'additional',
    displayName: 'License Grant',
    description: 'Scope and permissions granted to access, use, or deploy software and services.',
    typicalHeadings: [
      /(^|\b)(license\s+grant|grant\s+of\s+license|software\s+license|access\s+grant)\b/i
    ],
    keyPhrases: [
      /non-exclusive,?\s*non-transferable/i,
      /grants?\s+to\s+customer\s+a\s+license/i,
      /right\s+to\s+access\s+and\s+use/i,
      /for\s+internal\s+business\s+purposes/i
    ],
    boostPhrases: [
      /revocable|royalty-free/i,
      /worldwide\s+license/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /driver's\s+license/i
    ],
    generateNormalizedMeaning: () => 
      'Grants customer a non-exclusive, revocable authorization to utilize the software within specified user and volume restrictions.'
  },
  {
    category: 'License Restrictions',
    group: 'additional',
    displayName: 'License Restrictions',
    description: 'Prohibitions against reverse engineering, reselling, or circumventing software controls.',
    typicalHeadings: [
      /(^|\b)(license\s+restrictions|use\s+restrictions|prohibited\s+uses?)\b/i
    ],
    keyPhrases: [
      /shall\s+not\s+(reverse\s+engineer|decompile|disassemble)/i,
      /derivative\s+works/i,
      /rent,?\s*lease,?\s*(or\s*)?sublicense/i,
      /circumvent\s+security/i,
      /benchmark\s+testing/i
    ],
    boostPhrases: [
      /source\s+code/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Expressly forbids customer from reverse engineering, sublicensing, or creating unauthorized derivative works of the service.'
  },
  {
    category: 'Acceptance',
    group: 'additional',
    displayName: 'Acceptance',
    description: 'Procedures for testing deliverables and confirming conformity before formal sign-off.',
    typicalHeadings: [
      /(^|\b)(acceptance|acceptance\s+testing|acceptance\s+criteria)\b/i
    ],
    keyPhrases: [
      /acceptance\s+criteria/i,
      /acceptance\s+period/i,
      /written\s+notice\s+of\s+acceptance/i,
      /deemed\s+accepted/i,
      /defects?\s+or\s+non-conformit(y|ies)/i
    ],
    boostPhrases: [
      /user\s+acceptance\s+testing|uat/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Sets testing timeline and defines standards for formal deliverable acceptance or deemed sign-off.'
  },
  {
    category: 'Delivery',
    group: 'additional',
    displayName: 'Delivery',
    description: 'Timetable, location, and conditions for transferring hardware, software, or service outputs.',
    typicalHeadings: [
      /(^|\b)(delivery|shipment|shipping\s+and\s+delivery)\b/i
    ],
    keyPhrases: [
      /f\.?o\.?b\.?|fob/i,
      /risk\s+of\s+loss/i,
      /delivery\s+date|delivery\s+schedule/i,
      /freight\s+prepaid/i
    ],
    boostPhrases: [
      /carrier/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Governs shipping logistics, delivery timetables, and transfer of title and risk of loss.'
  },
  {
    category: 'Support / Maintenance',
    group: 'additional',
    displayName: 'Support / Maintenance',
    description: 'Technical assistance availability, patch distribution, and help-desk coverage windows.',
    typicalHeadings: [
      /(^|\b)(support|maintenance|technical\s+support|maintenance\s+and\s+support)\b/i
    ],
    keyPhrases: [
      /technical\s+support/i,
      /bug\s+fixes\s+and\s+updates/i,
      /help\s+desk/i,
      /business\s+hours|24x7\s+support/i,
      /support\s+services/i
    ],
    boostPhrases: [
      /ticket\s+escalation/i,
      /releases\s+and\s+enhancements/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Commits provider to ongoing software maintenance, error resolution, and designated support ticket coverage hours.'
  },
  {
    category: 'Credits / Service Credits',
    group: 'additional',
    displayName: 'Credits / Service Credits',
    description: 'Financial rebate calculations awarded for operational shortfalls or outage incidents.',
    typicalHeadings: [
      /(^|\b)(service\s+credits?|credits?|sla\s+credits?)\b/i
    ],
    keyPhrases: [
      /service\s+credit/i,
      /credit\s+against\s+future\s+invoices/i,
      /calculated\s+as\s+a\s+percentage/i,
      /apply\s+for\s+credit/i
    ],
    boostPhrases: [
      /maximum\s+credit/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i,
      /credit\s+card/i
    ],
    generateNormalizedMeaning: () => 
      'Calculates fee reductions credited toward subsequent billings in the event of validated service level shortfalls.'
  },
  {
    category: 'Taxes',
    group: 'additional',
    displayName: 'Taxes',
    description: 'Responsibility for sales, use, value-added, withholding, and customs duties.',
    typicalHeadings: [
      /(^|\b)(taxes|taxation|duties)\b/i
    ],
    keyPhrases: [
      /exclusive\s+of\s+(all\s+)?taxes/i,
      /sales,?\s*use,?\s*value-added|vat/i,
      /withholding\s+taxes/i,
      /responsible\s+for\s+all\s+taxes/i
    ],
    boostPhrases: [
      /tax\s+exemption\s+certificate/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Establishes customer responsibility for applicable sales, use, and value-added taxes levied on fees.'
  },
  {
    category: 'Late Payment',
    group: 'additional',
    displayName: 'Late Payment',
    description: 'Interest rates, grace periods, and collection expenses for delinquent invoices.',
    typicalHeadings: [
      /(^|\b)(late\s+payments?|overdue\s+amounts?|delinquent\s+payments?)\b/i
    ],
    keyPhrases: [
      /late\s+payment\s+fee|interest\s+on\s+late/i,
      /1\.5%\s+per\s+month/i,
      /maximum\s+permitted\s+by\s+law/i,
      /costs\s+of\s+collection/i,
      /suspend\s+services\s+for\s+non-payment/i
    ],
    boostPhrases: [
      /compounded\s+monthly/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Levies interest penalties on past-due amounts and reserves right to suspend performance after cure notification.'
  },
  {
    category: 'Expenses',
    group: 'additional',
    displayName: 'Expenses',
    description: 'Reimbursement guidelines, pre-approval requirements, and travel per-diem terms.',
    typicalHeadings: [
      /(^|\b)(expenses|reimbursable\s+expenses|travel\s+and\s+living)\b/i
    ],
    keyPhrases: [
      /reimburse.*reasonable\s+expenses/i,
      /travel\s+and\s+lodging/i,
      /pre-approved\s+in\s+writing/i,
      /receipts\s+and\s+documentation/i
    ],
    boostPhrases: [
      /actual\s+out-of-pocket/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Permits reimbursement of reasonable out-of-pocket travel and logistical expenses with advance written authorization.'
  },
  {
    category: 'Non-Solicitation',
    group: 'additional',
    displayName: 'Non-Solicitation',
    description: 'Covenant preventing recruitment or hiring of the other party\'s personnel.',
    typicalHeadings: [
      /(^|\b)(non-solicitation|non\s+solicitation|solicitation\s+of\s+employees)\b/i
    ],
    keyPhrases: [
      /shall\s+not\s+solicit/i,
      /recruit,?\s*hire,?\s*(or\s*)?engage/i,
      /employees\s+or\s+contractors/i,
      /twelve\s*\(12\)\s*months/i
    ],
    boostPhrases: [
      /general\s+public\s+advertising/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Restricts direct solicitation and hiring of employees or key contractors during and following the term.'
  },
  {
    category: 'Non-Competition',
    group: 'additional',
    displayName: 'Non-Competition',
    description: 'Geographic and business limits prohibiting competing commercial endeavors.',
    typicalHeadings: [
      /(^|\b)(non-competition|non\s+compete|restrictive\s+covenants)\b/i
    ],
    keyPhrases: [
      /shall\s+not\s+compete/i,
      /competing\s+business/i,
      /restricted\s+territory/i,
      /substantially\s+similar\s+services/i
    ],
    boostPhrases: [
      /covenant\s+not\s+to\s+compete/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Imposes covenant barring competitive commercial engagements in designated product or geographical sectors.'
  },
  {
    category: 'Exclusivity',
    group: 'additional',
    displayName: 'Exclusivity',
    description: 'Commitments granting sole distribution, purchasing, or representation rights.',
    typicalHeadings: [
      /(^|\b)(exclusivity|exclusive\s+provider|sole\s+source)\b/i
    ],
    keyPhrases: [
      /exclusive\s+provider/i,
      /sole\s+supplier/i,
      /exclusive\s+right\s+to/i,
      /shall\s+not\s+engage\s+any\s+third\s+party/i
    ],
    boostPhrases: [
      /sole\s+and\s+exclusive/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Binds one or both parties to sole-source or exclusive commercial relationships within the subject matter.'
  },
  {
    category: 'Publicity',
    group: 'additional',
    displayName: 'Publicity',
    description: 'Guidelines for issuing press releases, marketing endorsements, and logo display.',
    typicalHeadings: [
      /(^|\b)(publicity|press\s+releases?|marketing|public\s+announcements?)\b/i
    ],
    keyPhrases: [
      /press\s+release/i,
      /public\s+announcement/i,
      /use\s+the\s+other\s+party's\s+name|logo/i,
      /prior\s+written\s+consent/i,
      /marketing\s+materials/i
    ],
    boostPhrases: [
      /customer\s+reference/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Prohibits public marketing announcements, customer logos, or press releases without prior written clearance.'
  },
  {
    category: 'Survival',
    group: 'additional',
    displayName: 'Survival',
    description: 'Enumerates clauses that remain legally operational following agreement expiration or termination.',
    typicalHeadings: [
      /(^|\b)(survival|provisions\s+surviving\s+termination)\b/i
    ],
    keyPhrases: [
      /shall\s+survive\s+(the\s+)?(expiration|termination)/i,
      /survival\s+of\s+provisions/i,
      /continue\s+in\s+full\s+force\s+and\s+effect/i,
      /sections\s+\d+.*shall\s+survive/i
    ],
    boostPhrases: [
      /confidentiality,?\s*liability,?\s*and\s*indemnification\s+shall\s+survive/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Designates that confidentiality, indemnification, liability limitations, and payment duties persist post-termination.'
  },
  {
    category: 'Transition Assistance',
    group: 'additional',
    displayName: 'Transition Assistance',
    description: 'Wind-down support, data offboarding, and handover to replacement vendors.',
    typicalHeadings: [
      /(^|\b)(transition|transition\s+assistance|disentanglement|wind-down)\b/i
    ],
    keyPhrases: [
      /transition\s+services?/i,
      /cooperation\s+upon\s+termination/i,
      /migration\s+to\s+replacement\s+provider/i,
      /data\s+export|data\s+turnover/i
    ],
    boostPhrases: [
      /transition\s+period/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Directs provider to maintain operational support and provide orderly data handoff to designated successor vendors.'
  },
  {
    category: 'Records Retention',
    group: 'additional',
    displayName: 'Records Retention',
    description: 'Minimum timeframes for retaining business books, compliance records, and project files.',
    typicalHeadings: [
      /(^|\b)(records?\s+retention|retention\s+of\s+records|recordkeeping)\b/i
    ],
    keyPhrases: [
      /retain\s+records/i,
      /books\s+and\s+records/i,
      /period\s+of\s+(three|five|seven)\s*\(\d\)\s*years/i,
      /audit\s+retention/i
    ],
    boostPhrases: [
      /statutory\s+retention/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Specifies mandatory minimum archival retention years for financial books, audit trails, and transactional logs.'
  },
  {
    category: 'Business Continuity',
    group: 'additional',
    displayName: 'Business Continuity',
    description: 'Disaster recovery architectures, backup frequency, and resumption RTO/RPO targets.',
    typicalHeadings: [
      /(^|\b)(business\s+continuity|disaster\s+recovery|bcp|dr)\b/i
    ],
    keyPhrases: [
      /business\s+continuity\s+plan/i,
      /disaster\s+recovery/i,
      /recovery\s+time\s+objective|rto/i,
      /recovery\s+point\s+objective|rpo/i,
      /data\s+backup/i
    ],
    boostPhrases: [
      /tested\s+at\s+least\s+annually/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Requires provider to maintain validated disaster recovery facilities and data backups conforming to stated recovery time objectives.'
  },
  {
    category: 'Regulatory Requirements',
    group: 'additional',
    displayName: 'Regulatory Requirements',
    description: 'Specific banking, healthcare, or government sector oversight and filing conditions.',
    typicalHeadings: [
      /(^|\b)(regulatory\s+requirements?|regulatory\s+compliance|banking\s+regulations?|hipaa)\b/i
    ],
    keyPhrases: [
      /regulatory\s+authorit(y|ies)/i,
      /finra|sec|fdic|occ|hipaa/i,
      /audits\s+by\s+regulators/i,
      /mandatory\s+regulatory\s+filings/i
    ],
    boostPhrases: [
      /regulated\s+entity/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Requires operational adherence to supervisory financial, health, or statutory oversight authorities.'
  },
  {
    category: 'Export Controls',
    group: 'additional',
    displayName: 'Export Controls',
    description: 'Restrictions on exporting technical data, encryption, and products under trade regulations.',
    typicalHeadings: [
      /(^|\b)(export\s+controls?|export\s+regulations?|trade\s+compliance)\b/i
    ],
    keyPhrases: [
      /export\s+administration\s+regulations|ear/i,
      /international\s+traffic\s+in\s+arms|itar/i,
      /ofac\s+sanctions|sanctioned\s+countries/i,
      /prohibited\s+destinations/i
    ],
    boostPhrases: [
      /denied\s+parties\s+list/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Prohibits unauthorized export, re-export, or transfer of technical data under export administration and trade sanctions laws.'
  },
  {
    category: 'Anti-Bribery / Anti-Corruption',
    group: 'additional',
    displayName: 'Anti-Bribery / Anti-Corruption',
    description: 'Commitments against corrupt payments, kickbacks, and compliance with FCPA and Bribery Acts.',
    typicalHeadings: [
      /(^|\b)(anti-bribery|anti-corruption|fcpa|anti-kickback)\b/i
    ],
    keyPhrases: [
      /foreign\s+corrupt\s+practices\s+act|fcpa/i,
      /uk\s+bribery\s+act/i,
      /bribe,?\s*kickback,?\s*or\s*illicit\s+payment/i,
      /government\s+officials/i
    ],
    boostPhrases: [
      /anti-corruption\s+laws/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Prohibits bribery, improper inducements, and kickbacks in conformity with global anti-corruption statutes.'
  },
  {
    category: 'Order of Precedence',
    group: 'additional',
    displayName: 'Order of Precedence',
    description: 'Hierarchical priority resolving conflicts between the master agreement, schedules, and orders.',
    typicalHeadings: [
      /(^|\b)(order\s+of\s+precedence|conflict|hierarchy\s+of\s+terms)\b/i
    ],
    keyPhrases: [
      /in\s+the\s+event\s+of\s+(any\s+)?conflict/i,
      /order\s+of\s+precedence/i,
      /shall\s+prevail\s+over/i,
      /statement\s+of\s+work.*agreement/i
    ],
    boostPhrases: [
      /expressly\s+supersedes/i,
      /controlling\s+terms/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Establishes explicit hierarchical priority where the main agreement or specific schedules prevail in the event of conflicting terms.'
  },
  {
    category: 'Non-Disparagement',
    group: 'additional',
    displayName: 'Non-Disparagement',
    description: 'Mutual or unilateral covenant prohibiting disparaging statements regarding either party.',
    typicalHeadings: [
      /(^|\b)(non-disparagement|disparagement)\b/i
    ],
    keyPhrases: [
      /refrain\s+from\s+making.*disparaging/i,
      /negative\s+or\s+derogatory\s+statements/i,
      /harm\s+the\s+reputation/i
    ],
    boostPhrases: [
      /non-disparagement/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Prohibits parties from making false, derogatory, or commercially damaging public statements regarding each other.'
  },
  {
    category: 'Cumulative Remedies',
    group: 'additional',
    displayName: 'Cumulative Remedies',
    description: 'Stipulates that contractual remedies are cumulative and do not preclude statutory or equitable remedies.',
    typicalHeadings: [
      /(^|\b)(cumulative\s+remedies|remedies\s+cumulative)\b/i
    ],
    keyPhrases: [
      /rights\s+and\s+remedies.*cumulative/i,
      /not\s+exclusive\s+of\s+any\s+(other\s+)?remedies/i,
      /provided\s+by\s+law\s+or\s+in\s+equity/i
    ],
    boostPhrases: [
      /cumulative\s+and\s+not\s+alternative/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Clarifies that contractual remedies are cumulative with, and not exclusive of, any rights available at law or equity.'
  },
  {
    category: 'Counterparts',
    group: 'additional',
    displayName: 'Counterparts & Electronic Signatures',
    description: 'Permits agreement execution in multiple counterparts and delivery via electronic signature.',
    typicalHeadings: [
      /(^|\b)(counterparts|electronic\s+signatures?)\b/i
    ],
    keyPhrases: [
      /executed\s+in\s+(two\s+or\s+more\s+)?counterparts/i,
      /facsimile\s+or\s+electronic\s+(copy|signature)/i,
      /docusign|electronic\s+transmission/i,
      /each\s+of\s+which\s+shall\s+be\s+deemed\s+an\s+original/i
    ],
    boostPhrases: [
      /deemed\s+an\s+original/i,
      /together\s+constitute\s+one\s+and\s+the\s+same/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Allows valid execution in separate counterparts and recognizes digital or electronic signatures as binding originals.'
  },
  {
    category: 'Independent Contractor',
    group: 'additional',
    displayName: 'Independent Contractor',
    description: 'Clarifies that the parties act as independent contractors and disclaims partnership or agency.',
    typicalHeadings: [
      /(^|\b)(relationship\s+of\s+(the\s+)?parties|independent\s+contractors?)\b/i
    ],
    keyPhrases: [
      /independent\s+contractors?/i,
      /nothing\s+herein\s+shall\s+be\s+construed\s+to\s+create/i,
      /partnership,?\s*joint\s+venture,?\s*or\s+agency/i,
      /no\s+authority\s+to\s+bind/i
    ],
    boostPhrases: [
      /no\s+fiduciary\s+duty/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Affirms that the parties operate as independent contractors with no joint venture, agency, or partnership relationship.'
  },
  {
    category: 'Miscellaneous',
    group: 'additional',
    displayName: 'Miscellaneous',
    description: 'Boilerplate consolidation including severability, entire agreement, counterparts, and headings.',
    typicalHeadings: [
      /(^|\b)(miscellaneous|general\s+provisions|general)\b/i
    ],
    keyPhrases: [
      /entire\s+agreement/i,
      /severability/i,
      /counterparts/i,
      /headings\s+are\s+for\s+convenience/i,
      /waiver/i
    ],
    boostPhrases: [
      /supersedes\s+all\s+prior\s+agreements/i
    ],
    falsePositiveExclusions: [
      /table\s+of\s+contents/i
    ],
    generateNormalizedMeaning: () => 
      'Encompasses integration (entire agreement), severability of invalid terms, and electronic execution in counterparts.'
  }
];

export function getCategoryRule(category: string): CategoryDetectionRule | undefined {
  return CLAUSE_TAXONOMY_RULES.find(r => r.category.toLowerCase() === category.toLowerCase());
}

export function getAllCategories(): ClauseTaxonomyCategory[] {
  return CLAUSE_TAXONOMY_RULES.map(r => r.category);
}

export function getCoreCategories(): CategoryDetectionRule[] {
  return CLAUSE_TAXONOMY_RULES.filter(r => r.group === 'core');
}

export function getAdditionalCategories(): CategoryDetectionRule[] {
  return CLAUSE_TAXONOMY_RULES.filter(r => r.group === 'additional');
}

export const CORE_TAXONOMY_CATEGORIES: ClauseTaxonomyCategory[] = CLAUSE_TAXONOMY_RULES
  .filter(r => r.group === 'core')
  .map(r => r.category);

export const ADDITIONAL_TAXONOMY_CATEGORIES: ClauseTaxonomyCategory[] = CLAUSE_TAXONOMY_RULES
  .filter(r => r.group === 'additional')
  .map(r => r.category);

