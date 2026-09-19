/**
 * ContractLens AI - Local Storage & Persistence Service
 * Persists ingested documents and extracted contracts locally in browser storage.
 */

import { IngestedDocument } from '../types/document';
import { Contract } from '../types/contract';

const STORAGE_DOCUMENTS_KEY = 'contractlens_ingested_documents_v1';
const STORAGE_CONTRACTS_KEY = 'contractlens_custom_contracts_v1';

export function loadStoredDocuments(): Record<string, IngestedDocument> {
  try {
    const raw = localStorage.getItem(STORAGE_DOCUMENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read documents from localStorage:', e);
    return {};
  }
}

export function saveStoredDocument(doc: IngestedDocument): void {
  try {
    const existing = loadStoredDocuments();
    existing[doc.id] = doc;
    localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save document to localStorage (quota or disabled):', e);
  }
}

export function deleteStoredDocument(docId: string): void {
  try {
    const existing = loadStoredDocuments();
    delete existing[docId];
    localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to delete document from localStorage:', e);
  }
}

export function loadStoredContracts(): Contract[] {
  try {
    const raw = localStorage.getItem(STORAGE_CONTRACTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read contracts from localStorage:', e);
    return [];
  }
}

export function saveStoredContract(contract: Contract): void {
  try {
    const existing = loadStoredContracts().filter(c => c.id !== contract.id);
    existing.unshift(contract);
    localStorage.setItem(STORAGE_CONTRACTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save contract to localStorage:', e);
  }
}

export function deleteStoredContract(contractId: string): void {
  try {
    const existing = loadStoredContracts().filter(c => c.id !== contractId);
    localStorage.setItem(STORAGE_CONTRACTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to delete contract from localStorage:', e);
  }
}
