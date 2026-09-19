import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Menu, 
  Bell, 
  ShieldCheck, 
  Database, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useContract } from '../../context/ContractContext';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    activeNavSection, 
    activeContract, 
    setIsSearchOpen, 
    setIsUploadOpen, 
    isDemoMode,
    selectContract,
    activities
  } = useContract();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const getSectionTitle = () => {
    switch (activeNavSection) {
      case 'overview': return 'Command Center';
      case 'contracts': return 'Contract Library';
      case 'obligations': return 'Obligations & Actions';
      case 'timeline': return 'Milestone Timeline';
      case 'compare': return 'Contract Comparison';
      case 'ask': return 'Ask ContractLens';
      case 'review-queue': return 'Clause Review Queue';
      case 'settings': return 'Workspace Settings';
      default: return 'ContractLens';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 focus:outline-none"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-100 tracking-tight text-sm">
            {getSectionTitle()}
          </span>

          {activeContract && activeNavSection === 'contracts' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button 
                onClick={() => selectContract(activeContract.id, 'overview')}
                className="text-cyan-400 hover:text-cyan-300 font-medium truncate max-w-[200px] sm:max-w-[320px] transition-colors"
              >
                {activeContract.name}
              </button>
            </>
          )}

          {isDemoMode && (
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/70">
              <Database className="w-2.5 h-2.5 text-cyan-400" />
              DEMO DATA
            </span>
          )}
        </div>
      </div>

      {/* Center/Right: Global Search, Privacy, Upload, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500"
          aria-label="Search contracts and clauses"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search agreements & clauses...</span>
          <span className="sm:hidden">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Privacy Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Local Memory</span>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 transition-colors relative"
            aria-label="Intelligence activity notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0e1320] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-200">Intelligence Activity Stream</span>
                <span className="text-[10px] text-slate-400 font-mono">Recent Events</span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/70">
                    <p className="font-medium text-slate-200">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.detail}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{act.actor}</span>
                      <span className="font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="w-full mt-2 py-1 text-center text-xs text-slate-400 hover:text-slate-200 font-medium"
              >
                Close Activity Panel
              </button>
            </div>
          )}
        </div>

        {/* Primary CTA: Upload Contract */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#080b11]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Contract</span>
        </button>
      </div>
    </header>
  );
};
