import React from 'react';
import {
  Camera,
  Layers,
  ShieldCheck,
  Calculator,
  FolderArchive,
  BarChart3,
  BookOpen,
  Scale,
  PlusCircle,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Barcode,
  QrCode,
} from 'lucide-react';
import { UserRole } from '../types/compliance';

export type AppPage =
  | 'scan'
  | 'studio'
  | 'report'
  | 'barcode'
  | 'qr'
  | 'tool-font'
  | 'tool-usp'
  | 'tool-mpe'
  | 'tool-penalty'
  | 'tool-server'
  | 'tools'
  | 'cases'
  | 'dashboard'
  | 'handbook';

interface SidebarProps {
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  hasCurrentReport: boolean;
  unresolvedViolationsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onStartNewScan: () => void;
  isMobileMenu?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  userRole,
  onChangeRole,
  hasCurrentReport,
  unresolvedViolationsCount,
  isCollapsed,
  onToggleCollapse,
  onStartNewScan,
  isMobileMenu = false,
  onCloseMobileMenu,
}) => {
  // Navigation items definition
  // Note: Scan, Report, Studio, History, and Tools are already in the bottom navigation bar.
  // In the menu tab, repeated items are excluded so navigation remains clean and non-redundant.
  const allNavGroups = [
    {
      title: 'Inspection Workflow',
      items: [
        {
          id: 'scan' as AppPage,
          label: 'Product Scanner',
          icon: Camera,
          badge: null,
          disabled: false,
        },
        {
          id: 'report' as AppPage,
          label: 'Inspection Report',
          icon: ShieldCheck,
          badge: hasCurrentReport && unresolvedViolationsCount > 0 ? 'FAIL' : hasCurrentReport ? 'PASS' : null,
          badgeColor: hasCurrentReport && unresolvedViolationsCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white',
          disabled: !hasCurrentReport,
        },
        {
          id: 'studio' as AppPage,
          label: 'Visual Label Inspector',
          icon: Layers,
          badge: hasCurrentReport && unresolvedViolationsCount > 0 ? `${unresolvedViolationsCount}` : null,
          badgeColor: 'bg-rose-500 text-white',
          disabled: !hasCurrentReport,
        },
      ],
    },
    {
      title: 'Audit & Records',
      items: [
        {
          id: 'cases' as AppPage,
          label: 'Inspection History',
          icon: FolderArchive,
          badge: null,
          disabled: false,
        },
        {
          id: 'dashboard' as AppPage,
          label: 'Analytics Dashboard',
          icon: BarChart3,
          badge: null,
          disabled: false,
        },
      ],
    },
    {
      title: 'Packaging & Provenance',
      items: [
        {
          id: 'barcode' as AppPage,
          label: 'Barcode Origin Verifier',
          icon: Barcode,
          badge: 'GS1 Math',
          badgeColor: 'bg-blue-900/80 text-blue-300 border border-blue-700/50',
          disabled: false,
        },
        {
          id: 'qr' as AppPage,
          label: 'Smart QR Auditor',
          icon: QrCode,
          badge: 'G.S.R. 540(E)',
          badgeColor: 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50',
          disabled: false,
        },
      ],
    },
    {
      title: 'Tools & Reference',
      items: [
        {
          id: 'tools' as AppPage,
          label: 'Calculators & Checkers',
          icon: Calculator,
          badge: '7 Tools',
          badgeColor: 'bg-slate-700 text-slate-300',
          disabled: false,
        },
        {
          id: 'handbook' as AppPage,
          label: 'Standards Guide',
          icon: BookOpen,
          badge: null,
          disabled: false,
        },
      ],
    },
  ];

  // In the menu tab/drawer, remove items already present in the bottom navigation bar (Scan, Report, Studio, History, Tools)
  const navGroups = isMobileMenu
    ? [
        {
          title: 'Packaging & Provenance',
          items: [
            {
              id: 'barcode' as AppPage,
              label: 'Barcode Origin Verifier',
              icon: Barcode,
              badge: 'GS1 Math',
              badgeColor: 'bg-blue-900/80 text-blue-300 border border-blue-700/50',
              disabled: false,
            },
            {
              id: 'qr' as AppPage,
              label: 'Smart QR Auditor',
              icon: QrCode,
              badge: 'G.S.R. 540(E)',
              badgeColor: 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50',
              disabled: false,
            },
          ],
        },
        {
          title: 'Additional Services & Guides',
          items: [
            {
              id: 'dashboard' as AppPage,
              label: 'Analytics Dashboard',
              icon: BarChart3,
              badge: null,
              disabled: false,
            },
            {
              id: 'handbook' as AppPage,
              label: 'Standards Guide',
              icon: BookOpen,
              badge: null,
              disabled: false,
            },
          ],
        },
      ]
    : allNavGroups;

  return (
    <aside
      className={`bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none print:hidden ${
        isMobileMenu ? 'w-72 max-w-[85vw]' : isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!isCollapsed || isMobileMenu ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md border border-emerald-500/40 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
                  Packaging Inspector
                </h1>
                <p className="text-[11px] text-slate-400 truncate">Compliance &amp; Quality</p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md border border-emerald-500/40">
              <Scale className="w-5 h-5" />
            </div>
          )}

          {isMobileMenu && onCloseMobileMenu ? (
            <button
              onClick={onCloseMobileMenu}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Quick New Scan Action */}
        <div className="p-3">
          <button
            onClick={onStartNewScan}
            className={`w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCollapsed ? 'px-0 justify-center' : ''
            }`}
            title="Scan New Product"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>New Inspection</span>}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-2 space-y-3 mt-1">
          {navGroups.map((group, groupIdx) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 pt-2 pb-0.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                  {group.title}
                </div>
              ) : groupIdx > 0 ? (
                <div className="border-t border-slate-800 my-2 mx-2" />
              ) : null}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activePage === item.id ||
                  (item.id === 'tools' &&
                    ['tool-font', 'tool-usp', 'tool-mpe', 'tool-penalty', 'tool-server'].includes(activePage));
                return (
                  <button
                    key={item.id}
                    onClick={() => !item.disabled && onSelectPage(item.id)}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-2xs font-bold'
                        : item.disabled
                        ? 'text-slate-600 cursor-not-allowed opacity-40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Role Footer */}
      <div className="p-3 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="bg-slate-800/60 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <UserCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400">Current Role</span>
                <span className="font-bold text-slate-200 truncate block">
                  {userRole === 'INSPECTOR' ? 'Field Inspector' : userRole === 'CONTROLLER' ? 'Supervisor' : 'Quality Auditor'}
                </span>
              </div>
            </div>
            <select
              value={userRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-slate-900 text-[11px] text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              <option value="INSPECTOR">Inspector</option>
              <option value="CONTROLLER">Supervisor</option>
              <option value="MANUFACTURER_AUDITOR">Auditor</option>
            </select>
          </div>
        ) : (
          <div className="flex justify-center" title={`Role: ${userRole}`}>
            <UserCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
