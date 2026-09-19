import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Shield, Sparkles, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ContractType } from '../../types/contract';
import { SAMPLE_CONTRACT_TEMPLATES, createSampleFile } from '../../data/sampleContracts';
import { validateContractFile } from '../../services/documentExtractor';

export const UploadModal: React.FC = () => {
  const { isUploadOpen, setIsUploadOpen, ingestDocument, simulateUploadContract } = useContract();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ContractType>('Cloud Services');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadOpen) return null;

  const handleProcessFile = (file: File) => {
    setValidationError(null);
    setSelectedSampleIndex(null);
    const validation = validateContractFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid contract file format.');
      return;
    }
    setSelectedFile(file);
    setSelectedFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_CONTRACT_TEMPLATES[0], index: number) => {
    setValidationError(null);
    setSelectedSampleIndex(index);
    const file = createSampleFile(sample);
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setSelectedType(sample.contractType as ContractType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        await ingestDocument(selectedFile, selectedType);
      } else {
        // Fallback to primary sample contract
        const defaultSample = SAMPLE_CONTRACT_TEMPLATES[0];
        const sampleFile = createSampleFile(defaultSample);
        await ingestDocument(sampleFile, selectedType);
      }
    } catch (err: any) {
      setValidationError(err.message || 'Ingestion failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl bg-[#0e1320] border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#121828]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-sm font-semibold text-slate-100">
                Upload & Ingest Contract
              </h2>
              <p className="text-xs text-slate-400">
                Client-side extraction of text, sections, metadata, and grounded citations
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20'
                : selectedFileName
                ? 'border-cyan-600/60 bg-cyan-950/10'
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            {selectedFileName ? (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-xs font-mono text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedFileName}
                  {selectedFile && (
                    <span className="text-slate-400 font-mono text-[10px]">
                      ({(selectedFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">Click to select a different contract file</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop contract file, or <span className="text-cyan-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports <strong className="text-slate-300">PDF, DOCX, and TXT</strong> up to 50MB (Bilateral agreements, MSAs, SOWs, DPAs)
                </p>
              </div>
            )}
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quick Sample Selector with Real Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">
                Or pick a pre-configured legal agreement:
              </label>
              <span className="text-[10px] text-cyan-400/80 font-mono">100% Client-Side</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_CONTRACT_TEMPLATES.map((sample, idx) => (
                <button
                  type="button"
                  key={sample.id}
                  onClick={() => handleSelectSample(sample, idx)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedSampleIndex === idx
                      ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <p className="font-medium truncate text-slate-200">{sample.fileName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="truncate">{sample.contractType}</span>
                    <span className="font-mono text-[10px] text-cyan-400">{sample.format}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contract Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contract Classification
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContractType)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
            >
              <option value="Cloud Services">Cloud Services Agreement</option>
              <option value="Vendor Agreement">Vendor / Facilities Agreement</option>
              <option value="Master Services Agreement (MSA)">Master Services Agreement (MSA)</option>
              <option value="Software License & DPA">Software License & DPA</option>
              <option value="Statement of Work (SOW)">Statement of Work (SOW)</option>
              <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
              <option value="Service Level Agreement (SLA)">Service Level Agreement (SLA)</option>
            </select>
          </div>

          {/* Privacy Architecture Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-300">Client-Side Privacy Architecture</span>: Documents are parsed and hashed directly inside your browser memory. Files are never transmitted to unauthorized third-party servers. ContractLens assists humans and does not replace legal professionals.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <Sparkles className="w-4 h-4" />
              Ingest & Extract Intelligence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
