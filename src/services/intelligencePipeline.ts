/**
 * ContractLens AI — Segments 5–12 deterministic intelligence layer.
 * Evidence-first: every extracted item points back to source text already present
 * in the document index. No dates, parties, or citations are fabricated.
 */

import { Contract, Obligation, TimelineEvent, RiskFlag, EvidenceReference, ContractVersion } from '../types/contract';
import { IngestedDocument } from '../types/document';

const ISO_RE = /\b(20\d{2}[-/]\d{1,2}[-/]\d{1,2})\b/;
const DAYS_RE = /(?:within|no later than|at least|not less than|at most)\s+(\d+)\s+(business|calendar)?\s*days?/i;

function isoDate(s: string): string | null {
  const m = s.match(ISO_RE);
  if (!m) return null;
  const d = new Date(m[1].replace(/\//g, '-'));
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0,10);
}

function evidenceFor(page: any, documentId: string, fileName: string, text: string, section = ''): EvidenceReference {
  const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 320);
  return {
    id: `ev-${documentId}-adv-${page.pageNumber}-${Math.abs(snippet.length + page.pageNumber)}`,
    documentId,
    documentName: fileName,
    pageNumber: page.pageNumber,
    sectionIdentifier: section || page.sections?.[0]?.identifier || `Page ${page.pageNumber}`,
    textSnippet: snippet,
    confidenceScore: 0.88,
    verifiedByHuman: false,
  };
}

function normalizeActor(sentence: string, contract: Contract): string {
  const lower = sentence.toLowerCase();
  if (/\b(customer|client|licensee|buyer)\b/.test(lower)) return contract.ourParty.name;
  if (/\b(provider|vendor|supplier|licensor|contractor)\b/.test(lower)) return contract.counterparty.name;
  if (/\b(both parties|each party|either party|the parties)\b/.test(lower)) return `${contract.ourParty.name} & ${contract.counterparty.name}`;
  return 'Unclear';
}

function categoryFor(text: string): Obligation['category'] {
  const t = text.toLowerCase();
  if (/pay|invoice|fee|price|tax/.test(t)) return 'Payment';
  if (/security|breach|incident|safeguard|soc\s*2|encrypt/.test(t)) return 'Security / Audit';
  if (/report|records|documentation|statement/.test(t)) return 'Reporting';
  if (/notice|notify|notification|non-renewal|terminate/.test(t)) return 'Notice';
  if (/audit|compliance|regulatory|law|insurance/.test(t)) return 'Compliance';
  return 'Operational';
}

function priorityFor(text: string): Obligation['priority'] {
  const t = text.toLowerCase();
  if (/breach|incident|terminate|termination|non-renewal|security/.test(t)) return 'urgent';
  if (/pay|invoice|audit|compliance/.test(t)) return 'high';
  return 'medium';
}

function recurrenceFor(text: string): Obligation['recurrence'] {
  const t = text.toLowerCase();
  if (/monthly|each month/.test(t)) return 'monthly';
  if (/quarterly|each quarter/.test(t)) return 'quarterly';
  if (/annual|annually|each year|yearly/.test(t)) return 'annual';
  if (/upon|if |when |discovery of|termination/.test(t)) return 'on_trigger';
  return 'one_time';
}

export function extractAdvancedObligations(contract: Contract, doc: IngestedDocument): Obligation[] {
  const existing = [...contract.obligations];
  const seen = new Set(existing.map(o => `${o.title}|${o.description}`.toLowerCase()));
  const out = [...existing];
  const patterns = [
    /\b(?:shall|must|is required to|agrees to|will)\b[^.\n]{20,260}[.]/gi,
    /\b(?:notify|provide written notice|deliver|maintain|retain|delete|return|report|pay)\b[^.\n]{20,260}[.]/gi,
  ];

  for (const page of doc.pages) {
    for (const pattern of patterns) {
      const matches = page.text.matchAll(pattern);
      for (const m of matches) {
        const sentence = (m[0] || '').replace(/\s+/g, ' ').trim();
        if (sentence.length < 35) continue;
        const key = sentence.toLowerCase();
        if (seen.has(key) || out.length >= 24) continue;

        const actor = normalizeActor(sentence, contract);
        const timing = sentence.match(DAYS_RE);
        const explicitDate = isoDate(sentence);
        // Relative deadlines stay relative; never invent an absolute calendar date from an effective-date assumption.
        const dueDate = explicitDate || '';
        const clause = contract.clauses.find(c => sentence.toLowerCase().includes(c.category.toLowerCase().split(' ')[0].toLowerCase()));
        const evidence = evidenceFor(page, doc.id, doc.fileName, sentence);

        const title = sentence
          .replace(/^(?:the\s+)?(?:customer|client|provider|vendor|supplier|licensee|licensor)\s+/i, '')
          .split(/\s+/).slice(0, 7).join(' ')
          .replace(/[,:;]+$/, '');

        const recipient = actor === 'Unclear' ? 'Unclear' : (actor === contract.counterparty.name ? contract.ourParty.name : contract.counterparty.name);

        const obligation: Obligation = {
          id: `ob-${contract.id}-adv-${out.length + 1}`,
          contractId: contract.id,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          description: sentence,
          responsibleParty: actor,
          recipientParty: recipient,
          dueDate,
          recurrence: recurrenceFor(sentence),
          status: dueDate && dueDate < new Date().toISOString().slice(0,10) ? 'overdue' : 'pending',
          priority: priorityFor(sentence),
          clauseRefId: clause?.id,
          evidenceRef: evidence,
          category: categoryFor(sentence),
        };
        out.push(obligation);
        seen.add(key);
      }
    }
  }
  return out;
}

export function buildTimeline(contract: Contract): TimelineEvent[] {
  const today = new Date().toISOString().slice(0,10);
  const events: TimelineEvent[] = [...contract.timeline.filter(e => e.date)];
  const push = (id: string, date: string, title: string, description: string, type: TimelineEvent['type'], level: TimelineEvent['criticalLevel']) => {
    if (!date || events.some(e => e.date === date && e.title === title)) return;
    const completed = date < today;
    events.push({ id, contractId: contract.id, contractName: contract.name, date, title, description, type, criticalLevel: completed ? 'completed' : level, completed });
  };

  push(`tl-${contract.id}-effective`, contract.metadata.effectiveDate, 'Agreement Effective Date', 'Effective date identified from the contract metadata index.', 'effective_date', 'info');
  push(`tl-${contract.id}-renewal`, contract.metadata.renewalNoticeDeadline || '', 'Renewal Notice Deadline', `Non-renewal notice window: ${contract.metadata.renewalNoticePeriodDays} days.`, 'renewal_notice_deadline', 'critical');
  push(`tl-${contract.id}-expiry`, contract.metadata.expirationDate, 'Contract Expiration Date', 'Expiration date identified from the contract metadata index.', 'contract_expiration', 'upcoming');

  contract.obligations.forEach((o, i) => {
    if (!o.dueDate) return;
    push(`tl-${contract.id}-ob-${i}`, o.dueDate, o.title, o.description, 'obligation_due', o.priority === 'urgent' ? 'critical' : 'upcoming');
  });

  return events.sort((a,b) => a.date.localeCompare(b.date));
}

export function deriveRiskFlags(contract: Contract): RiskFlag[] {
  const risks: RiskFlag[] = [...contract.risks];
  const has = (key: string) => risks.some(r => r.title.toLowerCase().includes(key));
  const add = (r: RiskFlag) => { if (!has(r.title.toLowerCase().slice(0,18))) risks.push(r); };

  if (contract.metadata.autoRenew && contract.metadata.renewalNoticeDeadline) {
    add({
      id: `risk-${contract.id}-renewal`, contractId: contract.id,
      title: 'Renewal Notice Deadline Requires Tracking', category: 'Term & Renewal', severity: 'medium',
      description: `The indexed contract contains an automatic renewal provision with a ${contract.metadata.renewalNoticePeriodDays}-day notice period.`,
      suggestedAction: 'Verify the deadline and route any required notice through the responsible business/legal owner.',
      reviewed: false,
    });
  }
  const uncapped = contract.clauses.find(c => c.category === 'Limitation of Liability' && /uncapped|unlimited|carve-out|except/i.test(c.originalText));
  if (uncapped) add({
    id:`risk-${contract.id}-liability`, contractId:contract.id, title:'Liability Provision Requires Human Review',
    category:'Liability', severity:'high',
    description:'The indexed limitation-of-liability provision contains carve-out or exception language that merits human verification.',
    suggestedAction:'Open the cited clause and verify the scope of the cap and exceptions against the executed agreement.',
    reviewed:false, clauseRefId:uncapped.id
  });
  return risks;
}

export interface AskResult {
  answer: string;
  grounded: boolean;
  citations: EvidenceReference[];
  matches: Array<{ contractId: string; title: string; excerpt: string; page: number }>;
}

export function answerContractQuestion(contracts: Contract[], query: string, scopeId = 'all'): AskResult {
  const q = query.toLowerCase().trim();
  if (!q) return { answer: 'Enter a question to search the indexed contract evidence.', grounded: false, citations: [], matches: [] };
  const scoped = scopeId === 'all' ? contracts : contracts.filter(c => c.id === scopeId);
  const tokens = q.split(/[^a-z0-9]+/).filter(t => t.length > 2);
  const matches: AskResult['matches'] = [];
  scoped.forEach(c => {
    const add = (title: string, text: string, ref?: EvidenceReference) => {
      const score = tokens.filter(t => `${title} ${text}`.toLowerCase().includes(t)).length;
      if (score >= Math.max(1, Math.min(2, tokens.length))) {
        matches.push({ contractId:c.id, title, excerpt:text.slice(0,420), page:ref?.pageNumber || 0 });
      }
    };
    c.clauses.forEach(cl => add(`${c.name} — ${cl.title}`, `${cl.category} ${cl.summary} ${cl.originalText}`, cl.evidenceRef));
    c.obligations.forEach(o => add(`${c.name} — ${o.title}`, `${o.description} ${o.responsibleParty} ${o.category}`, o.evidenceRef));
    c.timeline.forEach(t => add(`${c.name} — ${t.title}`, `${t.description} ${t.date}`, undefined));
  });
  const top = matches.slice(0,8);
  if (!top.length) return { answer:'No indexed evidence matched the question. Try a clause, party, obligation, deadline, or exact contract term.', grounded:false, citations:[], matches:[] };
  const answer = top.length === 1
    ? `The indexed evidence identifies "${top[0].title}". ${top[0].excerpt}`
    : `The indexed workspace contains ${top.length} matching evidence records. The most relevant records are shown below; verify the cited source text before relying on the result.`;
  const citations = top.map(m => scoped.find(c => c.id === m.contractId)?.clauses.flatMap(cl => [cl.evidenceRef]).find(r => r.pageNumber === m.page) || scoped.find(c => c.id === m.contractId)?.obligations.find(o => o.evidenceRef?.pageNumber === m.page)?.evidenceRef).filter(Boolean) as EvidenceReference[];
  return { answer, grounded:true, citations, matches:top };
}

export interface ComparisonRow { label:string; a:string; b:string; changed:boolean; }
export function compareContracts(a: Contract, b: Contract): ComparisonRow[] {
  const rows: ComparisonRow[] = [
    ['Type', a.type, b.type],
    ['Counterparty', a.counterparty.name, b.counterparty.name],
    ['Effective date', a.metadata.effectiveDate, b.metadata.effectiveDate],
    ['Expiration date', a.metadata.expirationDate, b.metadata.expirationDate],
    ['Auto-renewal', a.metadata.autoRenew ? `Yes — ${a.metadata.renewalNoticePeriodDays} days` : 'No', b.metadata.autoRenew ? `Yes — ${b.metadata.renewalNoticePeriodDays} days` : 'No'],
    ['Payment terms', a.metadata.paymentTerms, b.metadata.paymentTerms],
    ['Liability cap', a.metadata.liabilityCapAmount || 'Not identified', b.metadata.liabilityCapAmount || 'Not identified'],
    ['Governing law', a.metadata.governingLaw, b.metadata.governingLaw],
    ['Clause coverage', `${a.clauses.length} indexed`, `${b.clauses.length} indexed`],
    ['Obligations', `${a.obligations.length} indexed`, `${b.obligations.length} indexed`],
  ];
  return rows.map(([label,x,y]) => ({label,a:x,b:y,changed:x!==y}));
}

export function portfolioMetrics(contracts: Contract[]) {
  const obligations = contracts.flatMap(c=>c.obligations);
  const risks = contracts.flatMap(c=>c.risks);
  const review = contracts.flatMap(c=>c.reviewQueue).filter(r=>r.status==='pending');
  return {
    contracts:contracts.length, clauses:contracts.reduce((n,c)=>n+c.clauses.length,0),
    obligations:obligations.length, deadlines:obligations.filter(o=>!!o.dueDate).length,
    reviews:review.length, risks:risks.length,
    expiring:contracts.filter(c => {
      const d = new Date(c.metadata.expirationDate).getTime();
      return Number.isFinite(d) && d-Date.now() < 90*86400000 && d>=Date.now();
    }).length
  };
}

export function compareVersions(a: ContractVersion, b: ContractVersion) {
  return [
    ['Version', a.versionNumber, b.versionNumber],
    ['File', a.fileName, b.fileName],
    ['SHA-256', a.sha256Checksum, b.sha256Checksum],
    ['Uploaded', a.uploadedAt, b.uploadedAt],
    ['Notes', a.changelogNotes, b.changelogNotes],
  ].map(([label,x,y]) => ({label,a:x,b:y,changed:x!==y}));
}
