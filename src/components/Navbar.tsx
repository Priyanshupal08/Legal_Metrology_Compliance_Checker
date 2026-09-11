import React from 'react';
import { ShieldCheck, Scale, History, BarChart3, BookOpen, Camera, UserCircle2 } from 'lucide-react';
import { UserRole } from '../types/compliance';

interface NavbarProps {
  activeTab: 'scanner' | 'report' | 'repository' | 'dashboard' | 'rulebook';
  onSelectTab: (tab: 'scanner' | 'report' | 'repository' | 'dashboard' | 'rulebook') => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  hasCurrentReport: boolean;
  unresolvedViolationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onChangeRole,
  hasCurrentReport,
  unresolvedViolationsCount,
}) => {
  const roleTitles: Record<UserRole, { title: string; badge: string; desc: string }> = {
    INSPECTOR: {
      title: 'Field Inspector',
      badge: 'Enforcement',
      desc: 'Inspection & Notice Officer',
    },
    CONTROLLER: {
      title: 'Supervisory Officer',
      badge: 'Review Wing',
      desc: 'State & Regional Authority',
    },
    MANUFACTURER_AUDITOR: {
      title: 'Quality & Brand Auditor',
      badge: 'Pre-Market Audit',
      desc: 'Compliance Assurance',
    },
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm print:hidden">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('scanner')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md border border-emerald-500/40">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Packaging Compliance Inspector
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated Verification of Mandatory Label &amp; Pricing Declarations
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 pl-2 text-xs text-slate-300">
            <UserCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-medium">Role:</span>
          </div>
          <select
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="bg-slate-900 text-xs text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            id="user-role-selector"
          >
            <option value="INSPECTOR">Field Inspector</option>
            <option value="CONTROLLER">Supervisory Officer</option>
            <option value="MANUFACTURER_AUDITOR">Brand Quality Auditor</option>
          </select>
          <span className="hidden lg:inline text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {roleTitles[userRole].badge}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/70">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          <button
            id="tab-scanner"
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            Packaging Scanner
          </button>

          <button
            id="tab-report"
            onClick={() => onSelectTab('report')}
            disabled={!hasCurrentReport}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'report'
                ? 'bg-emerald-600 text-white shadow-sm'
                : hasCurrentReport
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Inspection Report
            {unresolvedViolationsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unresolvedViolationsCount}
              </span>
            )}
          </button>

          <button
            id="tab-repository"
            onClick={() => onSelectTab('repository')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'repository'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            Inspection History
          </button>

          <button
            id="tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics Dashboard
          </button>

          <button
            id="tab-rulebook"
            onClick={() => onSelectTab('rulebook')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'rulebook'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Packaging Standards Guide
          </button>
        </nav>
      </div>
    </header>
  );
};
