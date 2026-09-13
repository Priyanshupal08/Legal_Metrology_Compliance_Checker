import React from 'react';
import {
  ArrowLeft,
  Barcode,
  QrCode,
  Scale,
  DollarSign,
  ShieldAlert,
  Server,
  Calculator,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { AppPage } from '../Sidebar';

export interface ToolHeaderProps {
  currentTool: 'barcode' | 'qr' | 'tool-font' | 'tool-usp' | 'tool-mpe' | 'tool-penalty' | 'tool-server';
  title: string;
  subtitle: string;
  statutoryReference?: string;
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const ALL_TOOLS = [
  {
    id: 'barcode' as AppPage,
    name: 'Barcode Verifier',
    shortName: 'Barcode',
    category: 'Provenance',
    icon: Barcode,
    color: 'blue',
    badge: 'GS1 Math',
    desc: 'Verify GS1 890 prefix, compute Modulo-10 check digits, and check country of origin.',
  },
  {
    id: 'qr' as AppPage,
    name: 'Smart QR Auditor',
    shortName: 'Smart QR',
    category: 'Audit',
    icon: QrCode,
    color: 'indigo',
    badge: 'G.S.R. 540(E)',
    desc: 'Audit digital label compliance and mandatory declaration exemptions under 2024 rules.',
  },
  {
    id: 'tool-font' as AppPage,
    name: 'Font Height Calculator',
    shortName: 'Font Height',
    category: 'Schedule II',
    icon: Scale,
    color: 'emerald',
    badge: 'Rule 8 Table 1',
    desc: 'Calculate mandatory millimetre height for numerals and letters based on package net quantity.',
  },
  {
    id: 'tool-usp' as AppPage,
    name: 'Unit Sale Price (USP)',
    shortName: 'USP Math',
    category: 'Pricing',
    icon: DollarSign,
    color: 'teal',
    badge: 'G.S.R. 779(E)',
    desc: 'Validate per gram, per kilogram, per millilitre, or per litre unit pricing accuracy.',
  },
  {
    id: 'tool-mpe' as AppPage,
    name: 'Weight Tolerance (MPE)',
    shortName: 'MPE Scale',
    category: 'Schedule I',
    icon: Scale,
    color: 'amber',
    badge: 'Section 30',
    desc: 'Laboratory tare & gross scale checker evaluating Maximum Permissible Error tolerances.',
  },
  {
    id: 'tool-penalty' as AppPage,
    name: 'Statutory Penalty Estimator',
    shortName: 'Penalties',
    category: 'Legal Matrix',
    icon: ShieldAlert,
    color: 'rose',
    badge: 'Sec 18 / 36 / 48',
    desc: 'Estimate statutory fines and compounding liabilities under the Legal Metrology Act, 2009.',
  },
  {
    id: 'tool-server' as AppPage,
    name: 'Server & Mobile Sync',
    shortName: 'Server Sync',
    category: 'System',
    icon: Server,
    color: 'slate',
    badge: 'Android APK',
    desc: 'Configure backend endpoint, ADB reverse USB tunnel, and connectivity for field testing.',
  },
];

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  currentTool,
  title,
  subtitle,
  statutoryReference,
  onBack,
  onSelectTool,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500">Calculators &amp; Checkers</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900 font-mono">{title}</span>
        </div>

        {statutoryReference && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{statutoryReference}</span>
          </div>
        )}
      </div>

      {/* Quick Tool Switcher Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Switch Tool:
        </span>
        {ALL_TOOLS.map((tool) => {
          const isActive = tool.id === currentTool;
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tool.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
