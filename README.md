# ContractLens AI

> **Contract intelligence that turns documents into decisions, obligations, timelines and evidence.**

ContractLens AI is an evidence-first contract analysis prototype built for a hackathon environment. It runs primarily in the browser, preserves source citations, and gives a human reviewer a structured path from:

**CONTRACT → CLAUSE → OBLIGATION → RESPONSIBLE PARTY → TIMING → SOURCE EVIDENCE**

It is a decision-support prototype, not a replacement for qualified legal counsel.

## What is implemented

### Segment 1 — Product foundation
- Responsive dark enterprise command center
- Contract repository, navigation, search, loading/empty/error states
- Demo workspace and local workspace
- Accessible keyboard-friendly controls

### Segment 2 — Document ingestion
- PDF, DOCX and TXT ingestion
- Client-side extraction
- SHA-256 document fingerprint
- Page boundaries, sections and table-of-contents index
- Local persistence

### Segment 3 — Contract intelligence
- Party identification
- Contract type
- Effective/expiration dates
- Renewal metadata
- Payment terms
- Governing law / venue
- Commercial terms
- Termination provisions
- Evidence references

### Segment 4 — Clause intelligence
- Clause taxonomy and deterministic detection
- PRESENT / not reliably identified / review-required semantics
- Verbatim source snippets
- Page and section evidence anchors
- Clause Explorer and review workflow
- AI-service abstraction with deterministic fallback

### Segment 5 — Obligation extraction
- Action-oriented obligation detection
- Responsible-party mapping
- Recipient/beneficiary mapping
- Trigger/timing extraction
- Relative deadline handling
- Recurrence detection
- Obligation evidence references
- Human review when the actor cannot be mapped reliably

### Segment 6 — Deadline & renewal intelligence
- Effective and expiration dates
- Renewal notice deadlines
- Obligation due dates
- Completed/upcoming/critical timeline states
- Consolidated portfolio timeline

### Segment 7 — Evidence-grounded Ask
- Search questions across contracts, clauses, obligations and timeline records
- Contract-level scoping
- Evidence-grounded answer cards
- Source page navigation
- Explicit no-match behavior instead of invented answers

### Segment 8 — Comparison / change intelligence
- Contract-to-contract structured comparison
- Term, payment, liability, law, clause and obligation differences
- Version integrity comparison using file name, upload metadata and SHA-256
- Changed fields are highlighted without presenting a legal conclusion

### Segment 9 — Human review workspace
- Review queue
- Clause verification
- Obligation review items for unresolved responsibility / due-date conditions
- Source-first review navigation

### Segment 10 — Portfolio intelligence
- Portfolio counts
- Open obligations
- Review workload
- Renewal/deadline attention
- Risk and milestone summaries
- Global search across contract intelligence

### Segment 11 — Privacy, security & reliability
- No API key committed to the repository
- Client-side SHA-256 fingerprints
- Local workspace persistence
- No analytics/tracking code
- Graceful deterministic operation without Gemini
- Unsupported/corrupt file validation and extraction errors
- Human-review wording for uncertain extraction

### Segment 12 — Judge-ready delivery
- GitHub Pages-compatible Vite build
- Relative asset base for project pages
- Automated GitHub Actions deployment
- Typecheck + test + production build in CI
- Optimized README
- `.env.example` only; secrets stay local

## Architecture

```text
src/
├── components/
│   ├── common/
│   ├── contract/
│   ├── document/
│   ├── layout/
│   ├── modals/
│   ├── pages/
│   └── search/
├── context/
│   └── ContractContext.tsx
├── data/
├── services/
│   ├── aiClauseService.ts
│   ├── clauseDetectionEngine.ts
│   ├── contractIntelligenceService.ts
│   ├── documentExtractor.ts
│   ├── intelligencePipeline.ts
│   ├── storage.ts
│   └── structuralParser.ts
└── types/
```

## Run locally

Prerequisite: Node.js 20+.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

### Validation

```bash
npm run lint
npm test
npm run build
```

All three should pass before submission.

## Optional Gemini configuration

The application is designed to remain usable without a Gemini key. Do **not** commit a real key.

If you add an AI provider integration locally, keep the credential in an ignored `.env.local` file and expose only the environment variable required by the local build. The repository contains `.env.example` as a template.

For a public GitHub Pages deployment, treat any browser-exposed API key as public. The deterministic evidence engine therefore remains the safe default.

## GitHub Pages

The repository includes:

`.github/workflows/deploy.yml`

The workflow:
1. installs dependencies
2. runs TypeScript validation
3. runs tests
4. creates the production Vite build
5. publishes `dist` to GitHub Pages

In the GitHub repository, enable **Settings → Pages → Source: GitHub Actions**.

The Vite config uses relative asset paths so the application works when served from a repository subpath.

## Demo flow

For a judge/demo walkthrough:

1. Open **Overview** and show portfolio metrics.
2. Open **Contracts** and inspect a demo agreement.
3. Open **Evidence & Citations** to show page-grounded source text.
4. Open **Clauses** and demonstrate review status.
5. Open **Obligations** and show responsible party + timing.
6. Open **Timeline** for renewal/deadline intelligence.
7. Open **Ask ContractLens** and run an evidence-grounded query.
8. Open **Compare** and show structured differences.
9. Open **Review Queue** to show human verification workflow.
10. Open **Settings** to demonstrate local data/export controls.

## Important product boundary

ContractLens AI extracts and organizes information from agreements. It can surface evidence, obligations and deadlines, but it does not determine legal enforceability, replace counsel, or make a legal decision for the user.

## License

Hackathon prototype. Add the competition's required license or submission terms before public commercial distribution.
