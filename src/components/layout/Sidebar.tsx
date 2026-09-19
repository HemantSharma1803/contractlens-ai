import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Clock, 
  GitCompare, 
  MessageSquareCode, 
  ShieldAlert, 
  Settings, 
  ShieldCheck, 
  Sparkles,
  Database,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useContract } from '../../context/ContractContext';
import { ActiveNavSection } from '../../types/contract';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const { 
    activeNavSection, 
    setActiveNavSection, 
    contracts, 
    isDemoMode,
    loadDemoWorkspace,
    loadEmptyWorkspace
  } = useContract();

  // Counts for badge indicators
  const totalContracts = contracts.length;
  const totalObligations = contracts.reduce((acc, c) => acc + c.obligations.length, 0);
  const pendingReviews = contracts.reduce((acc, c) => acc + (c.reviewStatus === 'needs_review' || c.reviewStatus === 'flagged' ? 1 : 0), 0);

  const navItems: Array<{
    id: ActiveNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'contracts', label: 'Contracts', icon: FileText, count: totalContracts },
    { id: 'obligations', label: 'Obligations', icon: CheckSquare, count: totalObligations },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'ask', label: 'Ask ContractLens', icon: MessageSquareCode },
    { id: 'review-queue', label: 'Review Queue', icon: ShieldAlert, count: pendingReviews, countColor: pendingReviews > 0 ? 'bg-amber-950 text-amber-300 border-amber-800' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: ActiveNavSection) => {
    setActiveNavSection(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-slate-800/90 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-sm">
            <span className="font-mono text-base font-black tracking-tighter">CL</span>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-base font-sans">
                CONTRACTLENS
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/70">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide">
              Contract Intelligence Command Center
            </p>
          </div>
        </div>

        {/* Product Pipeline Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Intelligence Flow
          </p>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span className="text-cyan-400 font-semibold">DOC</span>
            <span>→</span>
            <span>EXTRACT</span>
            <span>→</span>
            <span className="text-emerald-400 font-semibold">VERIFY</span>
            <span>→</span>
            <span>ACT</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/70 shadow-xs'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  item.countColor || (isActive ? 'bg-cyan-900/60 text-cyan-200 border-cyan-800' : 'bg-slate-800/80 text-slate-400 border-slate-700')
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Sidebar: Privacy, Demo Mode Indicator, User Profile */}
      <div className="p-3 border-t border-slate-800/80 space-y-2.5 bg-[#090d16]">
        {/* Workspace State Switcher */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-slate-200 text-[11px]">
                {isDemoMode ? 'DEMO WORKSPACE' : 'LOCAL WORKSPACE'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <p className="text-[10px] text-slate-400 mb-2 leading-tight">
            {isDemoMode 
              ? '4 synthetic test contracts loaded for evaluation.'
              : 'Clean slate ready for fresh document ingest.'}
          </p>
          <div className="flex items-center gap-1.5">
            {isDemoMode ? (
              <button
                onClick={loadEmptyWorkspace}
                className="w-full py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors text-center"
              >
                Switch to Clean Workspace
              </button>
            ) : (
              <button
                onClick={loadDemoWorkspace}
                className="w-full py-1 px-2 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-[10px] font-mono transition-colors text-center"
              >
                Load Demo Contracts
              </button>
            )}
          </div>
        </div>

        {/* Privacy Status */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-900/50 border border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy-first</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Local Memory</span>
        </div>

        {/* User / Profile Area */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">Elena Rostova</p>
              <p className="text-[10px] text-slate-400 truncate">CTO & Legal Ops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
