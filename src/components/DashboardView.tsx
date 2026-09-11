import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { InspectionResult } from '../types/compliance';

interface DashboardViewProps {
  inspections: InspectionResult[];
  onSelectInspection: (inspection: InspectionResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  onSelectInspection,
}) => {
  const total = inspections.length;
  const compliant = inspections.filter((x) => x.overallVerdict === 'COMPLIANT').length;
  const nonCompliant = inspections.filter((x) => x.overallVerdict === 'NON_COMPLIANT').length;
  const serious = inspections.filter((x) => x.overallVerdict === 'SERIOUS_VIOLATION').length;
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

  // Analyze specific violation patterns across inspected records
  const violationStats = {
    missingUsp: 0,
    nonStandardUnits: 0,
    missingConsumerEmail: 0,
    taxesExtra: 0,
    fontHeightDeficit: 0,
    incompleteAddress: 0,
  };

  inspections.forEach((insp) => {
    if (!insp.declarations.unitSalePrice?.isCompliant) violationStats.missingUsp++;
    if (!insp.declarations.netQuantity?.isStandardUnit || insp.declarations.netQuantity?.hasProhibitedQualifiers) {
      violationStats.nonStandardUnits++;
    }
    if (!insp.declarations.consumerCare?.emailId) violationStats.missingConsumerEmail++;
    if (insp.declarations.mrp?.hasTaxesExtraViolation) violationStats.taxesExtra++;
    if (!insp.readability?.isFontHeightCompliant) violationStats.fontHeightDeficit++;
    if (!insp.declarations.manufacturerDetails?.pinCodeDeclared) violationStats.incompleteAddress++;
  });

  const violationBars = [
    {
      label: 'Unit Sale Price (USP) Missing or Inconsistent',
      count: violationStats.missingUsp,
      pct: Math.min(100, Math.round((violationStats.missingUsp / total) * 100)),
      act: 'Pricing Requirement',
    },
    {
      label: 'Non-Standard Metric Units ("gms", "ltr", "pcs")',
      count: violationStats.nonStandardUnits,
      pct: Math.min(100, Math.round((violationStats.nonStandardUnits / total) * 100)),
      act: 'Units Requirement',
    },
    {
      label: 'Customer Care Missing Email or Helpline Phone',
      count: violationStats.missingConsumerEmail,
      pct: Math.min(100, Math.round((violationStats.missingConsumerEmail / total) * 100)),
      act: 'Support Requirement',
    },
    {
      label: 'Print Font Size Below Minimum Legibility Threshold',
      count: violationStats.fontHeightDeficit,
      pct: Math.min(100, Math.round((violationStats.fontHeightDeficit / total) * 100)),
      act: 'Readability Standard',
    },
    {
      label: 'MRP Lacking All-Inclusive Taxes Declaration',
      count: violationStats.taxesExtra,
      pct: Math.min(100, Math.round((violationStats.taxesExtra / total) * 100)),
      act: 'Pricing Standard',
    },
    {
      label: 'Manufacturer Address Missing Postal PIN Code',
      count: violationStats.incompleteAddress,
      pct: Math.min(100, Math.round((violationStats.incompleteAddress / total) * 100)),
      act: 'Address Standard',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Packaging Compliance Analytics
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Overview of inspected products, compliance trends, and common packaging defects.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Surveillance Audits</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{inspections.length}</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 100% active
            </span>
          </div>
          <span className="text-xs text-slate-500 block">Total digital scans executed</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700">{complianceRate}%</span>
            <span className="text-xs text-slate-500 font-medium">LMPC Benchmark</span>
          </div>
          <span className="text-xs text-slate-500 block">Commodities passing all Rule 6 clauses</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Notice Referrals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-700">{nonCompliant + serious}</span>
            <span className="text-xs text-rose-600 font-semibold">{serious} Severe</span>
          </div>
          <span className="text-xs text-slate-500 block">Form 1 Show-Cause Notices required</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Penalty Pool</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              ₹ {((nonCompliant + serious) * 25000).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500">Sec 36(1)</span>
          </div>
          <span className="text-xs text-slate-500 block">Maximum compounding value</span>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top Violations Breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Statutory Contravention Frequency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Most prevalent packaging defects identified during automated label audits.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">LMPC 2011 + 2022 USP</span>
          </div>

          <div className="space-y-4">
            {violationBars.map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{bar.label}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{bar.count}</strong> occurrences ({bar.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      bar.count > 0 ? 'bg-rose-500' : 'bg-slate-300'
                    }`}
                    style={{ width: `${Math.max(bar.pct, 4)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">{bar.act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sectoral Breakdown & Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Category Distribution
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Food &amp; Edibles</span>
                <span className="font-bold text-slate-900">
                  {inspections.filter((x) => x.category === 'FOOD_AND_BEVERAGES').length} audited
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Personal Care &amp; Cosmetics</span>
                <span className="font-bold text-slate-900">
                  {inspections.filter((x) => x.category === 'PERSONAL_CARE').length} audited
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Household Goods</span>
                <span className="font-bold text-slate-900">
                  {inspections.filter((x) => x.category === 'HOUSEHOLD').length} audited
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">General Commodities</span>
                <span className="font-bold text-slate-900">
                  {inspections.filter((x) => x.category === 'COMMODITIES').length} audited
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5 space-y-2 text-xs text-emerald-900">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-700" />
              Surveillance Directive
            </h4>
            <p className="leading-relaxed text-emerald-900/90">
              Surveillance teams are instructed to check <strong>imported goods</strong> for complete country of origin
              declarations and verify that the <strong>Unit Sale Price</strong> is correctly rounded off to two decimal
              places.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Inspection Activity Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Recent Surveillance Field Activity
        </h3>

        <div className="space-y-2">
          {inspections.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent field inspection records found. Audits will automatically record as real products are investigated.
            </div>
          ) : (
            inspections.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectInspection(item)}
                className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.overallVerdict === 'COMPLIANT'
                        ? 'bg-emerald-500'
                        : item.overallVerdict === 'SERIOUS_VIOLATION'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  ></span>
                  <div>
                    <span className="font-bold text-slate-800">{item.productName}</span>
                    <span className="text-slate-500 ml-2">({item.brandName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-500">{new Date(item.timestamp).toLocaleDateString('en-IN')}</span>
                  <span className="font-bold text-slate-700">{item.complianceScore}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
