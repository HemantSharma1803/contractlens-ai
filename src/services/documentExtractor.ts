/**
 * ContractLens AI - Document Ingestion & Extraction Engine
 * Handles client-side extraction for PDF, DOCX, and TXT with page boundary preservation.
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentPage, SupportedFileExtension, FileValidationResult } from '../types/document';
import { computeSHA256 } from './crypto';

// Setup pdf.js worker using standard public CDN for static deployment compatibility
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const WORDS_PER_PAGE_ESTIMATE = 450;

/**
 * Validates an uploaded file before ingestion
 */
export function validateContractFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'The selected file is empty (0 bytes).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      isValid: false, 
      error: `File exceeds maximum limit of 50MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).` 
    };
  }

  const name = file.name.toLowerCase();
  let fileType: SupportedFileExtension | undefined;

  if (name.endsWith('.pdf')) {
    fileType = 'pdf';
  } else if (name.endsWith('.docx')) {
    fileType = 'docx';
  } else if (name.endsWith('.txt') || name.endsWith('.text')) {
    fileType = 'txt';
  } else {
    return { 
      isValid: false, 
      error: 'Unsupported file format. Please upload a PDF, DOCX, or TXT document.' 
    };
  }

  const sizeFormatted = file.size < 1024 * 1024 
    ? `${(file.size / 1024).toFixed(1)} KB` 
    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  return {
    isValid: true,
    fileType,
    sizeFormatted,
  };
}

export interface ExtractionResult {
  pages: DocumentPage[];
  rawText: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
  sha256Hash: string;
}

/**
 * Main extractor dispatcher: routes to appropriate parser based on file format
 */
export async function extractDocumentContent(
  file: File,
  onPageProgress?: (current: number, total: number) => void
): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const sha256Hash = await computeSHA256(arrayBuffer);
  const ext = file.name.toLowerCase().split('.').pop() || '';

  if (ext === 'pdf') {
    return extractFromPDF(arrayBuffer, sha256Hash, onPageProgress);
  } else if (ext === 'docx') {
    return extractFromDOCX(arrayBuffer, sha256Hash, onPageProgress);
  } else {
    return extractFromTXT(arrayBuffer, sha256Hash, onPageProgress);
  }
}

/**
 * Client-side PDF extraction with preserved page numbering
 */
async function extractFromPDF(
  arrayBuffer: ArrayBuffer,
  sha256Hash: string,
  onPageProgress?: (current: number, total: number) => void
): Promise<ExtractionResult> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: true,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pages: DocumentPage[] = [];
    let fullRawText = '';

    for (let i = 1; i <= numPages; i++) {
      if (onPageProgress) {
        onPageProgress(i, numPages);
      }

      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      // Reconstruct text layout from text items
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          // Detect newline based on significant Y-coordinate shift or hasEOL
          if (lastY !== null && 'transform' in item && Math.abs(item.transform[5] - lastY) > 6) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          if ('transform' in item) {
            lastY = item.transform[5];
          }
        }
      }

      const cleanText = cleanExtractedText(pageText);
      const words = countWords(cleanText);

      pages.push({
        pageNumber: i,
        text: pageText,
        cleanText,
        wordCount: words,
        characterCount: cleanText.length,
        sections: [],
      });

      fullRawText += `\n--- [ PAGE ${i} ] ---\n` + pageText + '\n';
    }

    const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0);
    const totalChars = pages.reduce((acc, p) => acc + p.characterCount, 0);

    return {
      pages,
      rawText: fullRawText,
      pageCount: numPages,
      wordCount: totalWords,
      charCount: totalChars,
      sha256Hash,
    };
  } catch (err: any) {
    console.error('PDF extraction error:', err);
    throw new Error(`Failed to extract text from PDF: ${err?.message || 'The PDF file may be encrypted or corrupted.'}`);
  }
}

/**
 * Client-side DOCX extraction using mammoth
 */
async function extractFromDOCX(
  arrayBuffer: ArrayBuffer,
  sha256Hash: string,
  onPageProgress?: (current: number, total: number) => void
): Promise<ExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value || '';
    
    // Segment DOCX text into realistic page boundaries (~450 words per page or double newlines)
    const pages = paginateText(fullText);
    const totalWords = countWords(fullText);

    if (onPageProgress) {
      onPageProgress(pages.length, pages.length);
    }

    let fullRawText = '';
    pages.forEach(p => {
      fullRawText += `\n--- [ PAGE ${p.pageNumber} ] ---\n` + p.text + '\n';
    });

    return {
      pages,
      rawText: fullRawText,
      pageCount: pages.length,
      wordCount: totalWords,
      charCount: fullText.length,
      sha256Hash,
    };
  } catch (err: any) {
    console.error('DOCX extraction error:', err);
    throw new Error(`Failed to extract text from Word document: ${err?.message || 'File may be corrupted.'}`);
  }
}

/**
 * TXT extraction with smart pagination
 */
async function extractFromTXT(
  arrayBuffer: ArrayBuffer,
  sha256Hash: string,
  onPageProgress?: (current: number, total: number) => void
): Promise<ExtractionResult> {
  try {
    const decoder = new TextDecoder('utf-8');
    const fullText = decoder.decode(arrayBuffer);
    
    // Check if TXT already contains explicit page breaks (e.g. form feed \f or --- PAGE X ---)
    let rawPages: string[] = [];
    if (fullText.includes('\f')) {
      rawPages = fullText.split('\f');
    } else if (/---+\s*\[?\s*PAGE\s+\d+\s*\]?\s*---+/i.test(fullText)) {
      rawPages = fullText.split(/---+\s*\[?\s*PAGE\s+\d+\s*\]?\s*---+/i).filter(p => p.trim().length > 0);
    }

    let pages: DocumentPage[] = [];

    if (rawPages.length > 0) {
      pages = rawPages.map((pageText, idx) => {
        const clean = cleanExtractedText(pageText);
        return {
          pageNumber: idx + 1,
          text: pageText,
          cleanText: clean,
          wordCount: countWords(clean),
          characterCount: clean.length,
          sections: [],
        };
      });
    } else {
      pages = paginateText(fullText);
    }

    if (onPageProgress) {
      onPageProgress(pages.length, pages.length);
    }

    let fullRawText = '';
    pages.forEach(p => {
      fullRawText += `\n--- [ PAGE ${p.pageNumber} ] ---\n` + p.text + '\n';
    });

    const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0);
    const totalChars = pages.reduce((acc, p) => acc + p.characterCount, 0);

    return {
      pages,
      rawText: fullRawText,
      pageCount: pages.length,
      wordCount: totalWords,
      charCount: totalChars,
      sha256Hash,
    };
  } catch (err: any) {
    console.error('TXT extraction error:', err);
    throw new Error(`Failed to read text file: ${err?.message || 'Invalid text encoding.'}`);
  }
}

/**
 * Segments raw unpaginated text into logical pages based on paragraph boundaries
 */
function paginateText(fullText: string): DocumentPage[] {
  const paragraphs = fullText.split(/\n\s*\n/);
  const pages: DocumentPage[] = [];
  
  let currentPageNumber = 1;
  let currentBuffer: string[] = [];
  let currentWordCount = 0;

  for (const para of paragraphs) {
    const paraWords = countWords(para);
    if (currentWordCount + paraWords > WORDS_PER_PAGE_ESTIMATE && currentBuffer.length > 0) {
      const pageText = currentBuffer.join('\n\n');
      const clean = cleanExtractedText(pageText);
      pages.push({
        pageNumber: currentPageNumber,
        text: pageText,
        cleanText: clean,
        wordCount: countWords(clean),
        characterCount: clean.length,
        sections: [],
      });
      currentPageNumber++;
      currentBuffer = [para];
      currentWordCount = paraWords;
    } else {
      currentBuffer.push(para);
      currentWordCount += paraWords;
    }
  }

  if (currentBuffer.length > 0) {
    const pageText = currentBuffer.join('\n\n');
    const clean = cleanExtractedText(pageText);
    pages.push({
      pageNumber: currentPageNumber,
      text: pageText,
      cleanText: clean,
      wordCount: countWords(clean),
      characterCount: clean.length,
      sections: [],
    });
  }

  return pages.length > 0 ? pages : [{
    pageNumber: 1,
    text: fullText,
    cleanText: cleanExtractedText(fullText),
    wordCount: countWords(fullText),
    characterCount: fullText.length,
    sections: [],
  }];
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/[\r\t]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
