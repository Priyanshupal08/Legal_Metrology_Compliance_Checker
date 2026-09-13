import React from 'react';
import {
  Calculator,
  Scale,
  DollarSign,
  ShieldAlert,
  Server,
  Barcode,
  QrCode,
} from 'lucide-react';
import { AppPage } from './Sidebar';

interface ToolsViewProps {
  onSelectTool: (tool: AppPage) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: 'barcode' as AppPage,
      title: 'Barcode Verifier',
      subtitle: 'GS1 Origin & Math',
      icon: Barcode,
    },
    {
      id: 'qr' as AppPage,
      title: 'Smart QR Auditor',
      subtitle: 'G.S.R. 540(E) Web',
      icon: QrCode,
    },
    {
      id: 'tool-font' as AppPage,
      title: 'Font Height',
      subtitle: 'Mandatory mm height',
      icon: Scale,
    },
    {
      id: 'tool-usp' as AppPage,
      title: 'Unit Sale Price Calculator',
      subtitle: 'Rate / g or ml validation',
      icon: DollarSign,
    },
    {
      id: 'tool-mpe' as AppPage,
      title: 'Weight Tolerance (MPE)',
      subtitle: 'Tare & net weight test',
      icon: Scale,
    },
    {
      id: 'tool-penalty' as AppPage,
      title: 'Penalty Estimator',
      subtitle: 'Statutory penalty scales',
      icon: ShieldAlert,
    },
    {
      id: 'tool-server' as AppPage,
      title: 'Server & Sync',
      subtitle: 'APK connection setup',
      icon: Server,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Calculator className="w-7 h-7 text-emerald-600 shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Packaging Compliance Calculators
          </h2>
        </div>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Validation tools for font height requirements, Unit Sale Price math, weight tolerances, and penalties.
        </p>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl p-5 text-left transition-all duration-150 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="w-8 h-8 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">
                {tool.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

