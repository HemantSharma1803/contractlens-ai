import React from 'react';
import { ContractStatus, ReviewStatus, RiskSeverity } from '../../types/contract';

export const ContractStatusBadge: React.FC<{ status: ContractStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
          Active
        </span>
      );
    case 'pending_review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/70 text-amber-400 border border-amber-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
          Pending Review
        </span>
      );
    case 'expiring_soon':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-950/70 text-rose-400 border border-rose-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
          Expiring Soon
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
          Expired
        </span>
      );
    case 'terminated':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
          Terminated
        </span>
      );
    default:
      return null;
  }
};

export const ReviewStatusBadge: React.FC<{ status: ReviewStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
          Verified
        </span>
      );
    case 'needs_review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
          Needs Review
        </span>
      );
    case 'flagged':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-800/60">
          Flagged
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
          In Review
        </span>
      );
    default:
      return null;
  }
};

export const RiskBadge: React.FC<{ severity: RiskSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'critical':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700">
          Critical Risk
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700">
          High Risk
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-950/70 text-yellow-300 border border-yellow-800/60">
          Medium
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          Low Risk
        </span>
      );
  }
};

export const ConfidenceBadge: React.FC<{ 
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW';
  score?: number;
  size?: 'sm' | 'xs';
}> = ({ confidence, score, size = 'xs' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-1.5 py-0.2 text-[10px]';
  const scoreText = score !== undefined ? ` (${Math.round(score <= 1 ? score * 100 : score)}%)` : '';

  switch (confidence) {
    case 'HIGH':
      return (
        <span className={`inline-flex items-center font-mono font-medium rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
          HIGH{scoreText}
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center font-mono font-medium rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1"></span>
          MEDIUM{scoreText}
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center font-mono font-medium rounded bg-yellow-950/70 text-yellow-300 border border-yellow-800/60 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
          LOW{scoreText}
        </span>
      );
    case 'REVIEW':
    default:
      return (
        <span className={`inline-flex items-center font-mono font-medium rounded bg-amber-950/80 text-amber-300 border border-amber-800/70 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 animate-pulse"></span>
          REVIEW{scoreText}
        </span>
      );
  }
};

