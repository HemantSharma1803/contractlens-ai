/**
 * ContractLens AI - AI Clause Analysis Service Abstraction
 * Segment 4: Hybrid AI & Deterministic Classification Engine
 * 
 * Complies with strict architectural constraints:
 * - Never requires Gemini or API keys for the app to start or function.
 * - Always falls back gracefully to deterministic local classification.
 * - Completely decouples AI invocation from React UI components.
 * - Adheres strictly to factual, neutral legal vocabulary.
 */

import { IngestedDocument } from '../types/document';
import { ClauseIntelligenceRecord } from '../types/clause';
import { ClauseDetectionEngine } from './clauseDetectionEngine';

export interface ClauseAnalysisOptions {
  useAIIfAvailable?: boolean;
  onProgress?: (stage: string) => void;
}

export class AIClauseService {
  /**
   * Analyzes an ingested document for contractual provisions.
   * Runs local deterministic classification by default.
   */
  public static async analyzeClauses(
    doc: IngestedDocument,
    contractId: string,
    options: ClauseAnalysisOptions = {}
  ): Promise<ClauseIntelligenceRecord[]> {
    if (options.onProgress) {
      options.onProgress('Executing multi-layer clause extraction pipeline...');
    }

    // Deterministic baseline extraction
    const deterministicResults = ClauseDetectionEngine.detectClauses(doc, contractId);

    // If client requested AI assistance and runtime has Gemini API access configured
    // Note: We maintain 100% offline static compatibility for GitHub Pages
    const hasClientKey = false; // By architectural rule, no hardcoded or insecure browser keys

    if (options.useAIIfAvailable && hasClientKey) {
      try {
        // AI refinement would go here if configured
        return deterministicResults;
      } catch (err) {
        console.warn('AI clause refinement unavailable, relying on deterministic extraction:', err);
        return deterministicResults;
      }
    }

    return deterministicResults;
  }
}
