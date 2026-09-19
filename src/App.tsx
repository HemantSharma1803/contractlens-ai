/**
 * CONTRACTLENS AI
 * "Contract intelligence that turns documents into decisions, obligations, evidence, and timelines."
 * 
 * Segment 1: Production-quality architecture, visual design system, shell/nav,
 * data models, empty/loading/error/demo states, responsive & accessible.
 */

import React, { useState } from 'react';
import { ContractProvider, useContract } from './context/ContractContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { UploadModal } from './components/modals/UploadModal';
import { ProcessingModal } from './components/modals/ProcessingModal';

// Pages
import { OverviewPage } from './components/pages/OverviewPage';
import { ContractsPage } from './components/pages/ContractsPage';
import { ContractDetailPage } from './components/pages/ContractDetailPage';
import { ObligationsPage } from './components/pages/ObligationsPage';
import { TimelinePage } from './components/pages/TimelinePage';
import { ComparePage } from './components/pages/ComparePage';
import { AskPage } from './components/pages/AskPage';
import { ReviewQueuePage } from './components/pages/ReviewQueuePage';
import { SettingsPage } from './components/pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { activeNavSection, activeContractId } = useContract();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (activeNavSection) {
      case 'overview':
        return <OverviewPage />;
      case 'contracts':
        return activeContractId ? <ContractDetailPage /> : <ContractsPage />;
      case 'obligations':
        return <ObligationsPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'compare':
        return <ComparePage />;
      case 'ask':
        return <AskPage />;
      case 'review-queue':
        return <ReviewQueuePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col">
      {/* Sidebar Navigation (Desktop Fixed + Mobile Drawer) */}
      <Sidebar 
        isMobileOpen={mobileMenuOpen} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        {/* Persistent Top Navigation Bar */}
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Legal & Privacy Disclaimer Footer */}
        <footer className="mt-auto px-6 py-4 border-t border-slate-900 bg-[#07090f] text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              ContractLens AI assists human decision-makers and does not replace qualified legal counsel.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>Privacy-First Architecture</span>
              <span>•</span>
              <span>Local Execution</span>
              <span>•</span>
              <span className="text-cyan-400/80">Segments 1–12</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Persistent Global Modals */}
      <GlobalSearchModal />
      <UploadModal />
      <ProcessingModal />
    </div>
  );
};

export default function App() {
  return (
    <ContractProvider>
      <MainLayout />
    </ContractProvider>
  );
}
