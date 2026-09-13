import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { AppPage } from '../Sidebar';

interface WeightToleranceToolViewProps {
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const WeightToleranceToolView: React.FC<WeightToleranceToolViewProps> = ({
  onBack,
  onSelectTool,
}) => {
  const [mpeDeclaredQty, setMpeDeclaredQty] = useState<number>(500);
  const [mpeGrossScale, setMpeGrossScale] = useState<number>(518);
  const [mpeTareWeight, setMpeTareWeight] = useState<number>(25);

  // Calculations for Schedule I MPE Weight Tolerance
  const actualNetWeight = Number((mpeGrossScale - mpeTareWeight).toFixed(2));
  const deficiencyGrams = Number((mpeDeclaredQty - actualNetWeight).toFixed(2));
  const deficiencyPct = Number(((deficiencyGrams / mpeDeclaredQty) * 100).toFixed(2));

  // Schedule I Table 1 Statutory Tolerance Lookup (Official legal matrix)
  const getScheduleIMaxPermissibleError = (declared: number) => {
    if (declared <= 50) return Math.max(9, declared * 0.09); // 9%
    if (declared <= 100) return 4.5; // 4.5g
    if (declared <= 200) return Math.max(4.5, declared * 0.045); // 4.5%
    if (declared <= 300) return 9.0; // 9g
    if (declared <= 500) return Math.max(9, declared * 0.03); // 3% -> 15g for 500g
    if (declared <= 1000) return 15.0; // 15g
    return Math.max(15, declared * 0.015); // 1.5% for >1kg
  };

  const maxAllowedDeficiency = Number(getScheduleIMaxPermissibleError(mpeDeclaredQty).toFixed(1));
  const isWeightCompliant = deficiencyGrams <= maxAllowedDeficiency;
  const isExcess = deficiencyGrams < 0;

  // Table rows for Schedule I reference
  const SCHEDULE_I_TABLE = [
    { range: 'Up to 50 g / ml', maxErrorPct: '9.0 %', maxErrorFixed: '—', active: mpeDeclaredQty <= 50 },
    { range: '50 g to 100 g / ml', maxErrorPct: '—', maxErrorFixed: '4.5 g / ml', active: mpeDeclaredQty > 50 && mpeDeclaredQty <= 100 },
    { range: '100 g to 200 g / ml', maxErrorPct: '4.5 %', maxErrorFixed: '—', active: mpeDeclaredQty > 100 && mpeDeclaredQty <= 200 },
    { range: '200 g to 300 g / ml', maxErrorPct: '—', maxErrorFixed: '9.0 g / ml', active: mpeDeclaredQty > 200 && mpeDeclaredQty <= 300 },
    { range: '300 g to 500 g / ml', maxErrorPct: '3.0 %', maxErrorFixed: '—', active: mpeDeclaredQty > 300 && mpeDeclaredQty <= 500 },
    { range: '500 g to 1000 g / ml', maxErrorPct: '—', maxErrorFixed: '15.0 g / ml', active: mpeDeclaredQty > 500 && mpeDeclaredQty <= 1000 },
    { range: 'Above 1000 g / ml', maxErrorPct: '1.5 %', maxErrorFixed: '—', active: mpeDeclaredQty > 1000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <ToolHeader
        currentTool="tool-mpe"
        title="Weight Tolerance (MPE) Lab Scale"
        subtitle="Schedule I Maximum Permissible Error physical verification tool under Section 30 of LM Act, 2009."
        statutoryReference="Section 30 / Schedule I Table 1"
        onBack={onBack}
        onSelectTool={onSelectTool}
      />

      {/* Main Form & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Certified Scale Lab Measurements</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Metric Weights (g)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Declared Net Wt (g)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={mpeDeclaredQty}
                onChange={(e) => setMpeDeclaredQty(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Label statement</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Gross Scale Wt (g)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={mpeGrossScale}
                onChange={(e) => setMpeGrossScale(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Total on scale</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Tare Wrapper Wt (g)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={mpeTareWeight}
                onChange={(e) => setMpeTareWeight(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Packaging material</span>
            </div>
          </div>

          {/* Derived Measurements Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Actual Derived Net Weight:</span>
              <strong className="text-slate-900 font-mono text-sm">{actualNetWeight} g</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Weight Deficiency:</span>
              <strong
                className={`font-mono text-sm ${
                  deficiencyGrams > maxAllowedDeficiency
                    ? 'text-rose-600'
                    : deficiencyGrams > 0
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {deficiencyGrams > 0 ? `${deficiencyGrams} g (${deficiencyPct}%)` : `+${Math.abs(deficiencyGrams)} g (Excess)`}
              </strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-600">Schedule I Max Permissible Error (MPE):</span>
              <strong className="text-slate-800 font-mono text-sm">± {maxAllowedDeficiency} g</strong>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Standard Sampling Presets
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMpeDeclaredQty(500);
                  setMpeGrossScale(518);
                  setMpeTareWeight(25);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                500g Salt (Compliant)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMpeDeclaredQty(500);
                  setMpeGrossScale(490);
                  setMpeTareWeight(20);
                }}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border border-rose-200"
              >
                500g Pack (Deficient 30g)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMpeDeclaredQty(100);
                  setMpeGrossScale(108);
                  setMpeTareWeight(6);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                100g Biscuit (Compliant)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMpeDeclaredQty(1000);
                  setMpeGrossScale(1020);
                  setMpeTareWeight(45);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                1kg Dal (Deficient 25g)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`rounded-xl p-6 text-center space-y-3 border-2 shadow-sm ${
              isWeightCompliant
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider block">
              Schedule I Statutory Verdict
            </span>
            <div className="text-3xl font-black tracking-tight">
              {isWeightCompliant ? 'WITHIN LEGAL TOLERANCE' : 'ILLEGAL UNDERWEIGHT PACKAGE'}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 border border-current shadow-2xs">
              {isWeightCompliant ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isExcess ? 'Net weight exceeds declared value' : `Deficiency of ${deficiencyGrams}g is within ${maxAllowedDeficiency}g MPE`}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>
                    Deficiency of {deficiencyGrams}g exceeds max permitted {maxAllowedDeficiency}g
                  </span>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-300/40 text-xs text-left leading-relaxed">
              {isWeightCompliant ? (
                <p className="text-emerald-900">
                  The actual commodity net content ({actualNetWeight}g) conforms to Schedule I Table 1. No legal penalty actionable under Section 30.
                </p>
              ) : (
                <p className="text-rose-950 font-medium">
                  <strong>Offence under Section 30:</strong> Delivering short weight or measure to a consumer. Actionable with compounding fine up to ₹10,000 for first offence and seizure of non-conforming batch.
                </p>
              )}
            </div>
          </div>

          {/* Visual Tolerance Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Tolerance Margin Breakdown</span>
              <span className="font-mono text-slate-600 text-[11px]">Declared: {mpeDeclaredQty} g</span>
            </h4>

            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-4 relative overflow-hidden border border-slate-200 flex">
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: '25%' }}
                  title="Short weight violation zone"
                />
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: '25%' }}
                  title="Allowed MPE tolerance zone"
                />
                <div
                  className="bg-emerald-500 h-full flex-1"
                  title="Exact & Excess weight zone"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span className="text-rose-600 font-bold">&lt; {mpeDeclaredQty - maxAllowedDeficiency}g (Violation)</span>
                <span className="text-amber-700 font-bold">{mpeDeclaredQty - maxAllowedDeficiency}g to {mpeDeclaredQty}g (MPE)</span>
                <span className="text-emerald-700 font-bold">≥ {mpeDeclaredQty}g (Target / Excess)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule I Table 1 Reference Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Schedule I (Table 1) Maximum Permissible Errors on Net Quantity
            </h3>
            <p className="text-xs text-slate-500">
              Legal tolerance thresholds specified under Section 30 and Rule 24 of LMPC Rules, 2011.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
            Current Tier Highlighted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-3">Declared Quantity Range</th>
                <th className="py-2.5 px-3">Maximum Error (% of Qty)</th>
                <th className="py-2.5 px-3">Maximum Error (Fixed g / ml)</th>
                <th className="py-2.5 px-3 text-right">Applicability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEDULE_I_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.active
                      ? 'bg-amber-50/80 font-bold text-amber-950 border-l-4 border-l-amber-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-3">{row.range}</td>
                  <td className="py-3 px-3">{row.maxErrorPct}</td>
                  <td className="py-3 px-3">{row.maxErrorFixed}</td>
                  <td className="py-3 px-3 text-right">
                    {row.active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Target</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
