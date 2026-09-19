import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  X, 
  List, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react';
import { IngestedDocument, DocumentPage, DocumentSection } from '../../types/document';
import { EvidenceReference } from '../../types/contract';
import { searchDocumentContent } from '../../services/structuralParser';

interface DocumentViewerProps {
  document: IngestedDocument;
  activeEvidenceRef?: EvidenceReference | null;
  onClearEvidenceFocus?: () => void;
  className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  activeEvidenceRef,
  onClearEvidenceFocus,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Sync to evidence reference page when citation clicked
  useEffect(() => {
    if (activeEvidenceRef && activeEvidenceRef.pageNumber) {
      setCurrentPage(Math.min(activeEvidenceRef.pageNumber, document.pageCount));
    }
  }, [activeEvidenceRef, document.pageCount]);

  const activePageData = document.pages.find(p => p.pageNumber === currentPage) || document.pages[0];

  // In-document search matches
  const searchMatches = searchQuery ? searchDocumentContent(document.pages, searchQuery) : [];
  const matchesOnCurrentPage = searchMatches.filter(m => m.pageNumber === currentPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < document.pageCount) setCurrentPage(p => p + 1);
  };

  const handleCopyCitation = () => {
    if (activeEvidenceRef) {
      const citeText = `"${activeEvidenceRef.textSnippet}" — ${document.fileName}, Page ${activeEvidenceRef.pageNumber}, ${activeEvidenceRef.sectionIdentifier}`;
      navigator.clipboard.writeText(citeText);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([document.rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Helper to render text with highlighting for active citation and search keywords
  const renderHighlightedPageText = (text: string) => {
    const citationSnippet = activeEvidenceRef && activeEvidenceRef.pageNumber === currentPage
      ? activeEvidenceRef.textSnippet.trim()
      : null;

    if (citationSnippet && text.includes(citationSnippet)) {
      const parts = text.split(citationSnippet);
      return (
        <>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <mark className="bg-cyan-950/90 border-2 border-cyan-400 text-cyan-100 px-2 py-1 rounded-md font-mono shadow-lg relative inline-block my-1 animate-pulse">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-0.5">
                    [GROUNDED PRIMARY CITATION • CONFIDENCE {((activeEvidenceRef?.confidenceScore || 0.95) * 100).toFixed(0)}%]
                  </span>
                  "{citationSnippet}"
                </mark>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }

    if (searchQuery && searchQuery.trim().length >= 2) {
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) => 
            regex.test(part) ? (
              <mark key={i} className="bg-amber-400 text-slate-950 font-bold px-1 rounded-xs">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    }

    return text;
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : className
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#111625] border-b border-slate-800/90">
        {/* Left: Document Info & Outline Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowOutline(!showOutline)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
              showOutline 
                ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300' 
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-slate-100 hover:border-slate-600'
            }`}
            title="Toggle Structural Outline / Sections"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Outline</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[280px]">
              {document.fileName}
            </span>
          </div>

          <button
            onClick={handleCopyHash}
            className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-cyan-300 hover:border-cyan-900 transition-colors"
            title={`Full SHA-256 Checksum: ${document.sha256Hash}`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SHA-256: {document.sha256Hash.slice(0, 8)}...</span>
            {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={document.pageCount}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= document.pageCount) {
                  setCurrentPage(val);
                }
              }}
              className="w-10 px-1 py-0.5 bg-slate-950 border border-slate-700 rounded text-center text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
            />
            <span className="text-slate-400">of {document.pageCount}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= document.pageCount}
            className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Search, View Mode, Zoom, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* In-Document Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-44 pl-7 pr-7 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:w-52 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                viewMode === 'formatted' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                viewMode === 'raw' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Text
            </button>
          </div>

          {/* Zoom */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-400">
            <button
              onClick={() => setZoomLevel(z => Math.max(75, z - 15))}
              className="p-1 hover:text-slate-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(160, z + 15))}
              className="p-1 hover:text-slate-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:text-slate-200"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Download Raw */}
          <button
            onClick={handleDownloadText}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Download full extracted text file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Evidence Notification Banner */}
      {activeEvidenceRef && (
        <div className="px-4 py-2.5 bg-cyan-950/70 border-b border-cyan-800/80 flex items-center justify-between gap-3 text-xs text-cyan-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Grounding Focus: <strong>{activeEvidenceRef.sectionIdentifier}</strong> (Page {activeEvidenceRef.pageNumber})
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-700 text-cyan-300">
              Confidence {((activeEvidenceRef.confidenceScore || 0.95) * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-900/80 hover:bg-cyan-800 border border-cyan-700 text-xs text-cyan-100 transition-colors"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Citation'}</span>
            </button>
            {onClearEvidenceFocus && (
              <button
                onClick={onClearEvidenceFocus}
                className="p-1 rounded hover:bg-cyan-900/60 text-cyan-400 hover:text-cyan-200"
                title="Clear citation focus"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search results banner if active */}
      {searchQuery && (
        <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Found <strong>{searchMatches.length}</strong> occurrences across document</span>
            <span className="text-slate-400">({matchesOnCurrentPage.length} on current page)</span>
          </div>
          {searchMatches.length > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400">Jump to:</span>
              <div className="flex gap-1 overflow-x-auto max-w-[240px]">
                {Array.from(new Set(searchMatches.map(m => m.pageNumber))).slice(0, 6).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      pageNum === currentPage ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    p.{pageNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area: Sidebar Outline + Document Page Canvas */}
      <div className="flex-1 flex overflow-hidden min-h-[480px]">
        {/* Outline / Table of Contents Sidebar */}
        {showOutline && (
          <div className="w-64 sm:w-72 bg-[#0e1320] border-r border-slate-800 p-3 overflow-y-auto shrink-0 animate-in slide-in-from-left-4 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Document Structure ({document.sections.length})
              </span>
              <button
                onClick={() => setShowOutline(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {document.tableOfContents.length === 0 ? (
                <p className="text-xs text-slate-400 p-2 italic">
                  No structural sections detected. Standard document layout.
                </p>
              ) : (
                document.tableOfContents.map((toc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(toc.pageNumber);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 ${
                      currentPage === toc.pageNumber
                        ? 'bg-cyan-950/60 border border-cyan-800/80 text-cyan-200'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{toc.identifier}</div>
                      <div className="text-[11px] text-slate-400 truncate">{toc.title}</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 shrink-0">
                      p.{toc.pageNumber}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Document Page Canvas */}
        <div 
          ref={textContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#080b11] flex flex-col items-center"
        >
          {/* Realistic Page Sheet */}
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-[#0f1422] border border-slate-800/90 rounded-lg p-6 sm:p-10 shadow-2xl transition-transform duration-100 text-slate-200 space-y-4"
          >
            {/* Sheet Page Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="truncate">{document.fileName}</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                PAGE {currentPage} OF {document.pageCount}
              </span>
            </div>

            {/* Sections on this page */}
            {activePageData.sections && activePageData.sections.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {activePageData.sections.map((sec) => (
                  <span 
                    key={sec.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-[11px] font-mono text-cyan-300"
                  >
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    {sec.identifier}: {sec.title.slice(0, 30)}
                  </span>
                ))}
              </div>
            )}

            {/* Verbatim Page Body */}
            {viewMode === 'formatted' ? (
              <div className="text-xs sm:text-sm leading-relaxed font-sans text-slate-200 space-y-3 whitespace-pre-wrap selection:bg-cyan-500/30">
                {renderHighlightedPageText(activePageData.text)}
              </div>
            ) : (
              <pre className="text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto selection:bg-cyan-500/30">
                {renderHighlightedPageText(activePageData.text)}
              </pre>
            )}

            {/* Sheet Page Footer */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{activePageData.wordCount} words • {activePageData.characterCount} characters</span>
              <span>ContractLens Grounded Ingestion Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
