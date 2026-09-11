import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Calculator,
  ShieldAlert,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
} from 'lucide-react';
import { STATUTORY_RULES, SCHEDULE_II_FONT_TABLE } from '../data/rulesReference';

export const RulebookView: React.FC = () => {
  const [selectedRuleCode, setSelectedRuleCode] = useState<string>('RULE_6_1_A');

  // Schedule II Interactive Calculator State
  const [calcNetQty, setCalcNetQty] = useState<number>(500);
  const [calcUnit, setCalcUnit] = useState<string>('g');
  const [calcPkgType, setCalcPkgType] = useState<'normal' | 'blown'>('normal');
  const [calcPdpWidth, setCalcPdpWidth] = useState<number>(15);
  const [calcPdpHeight, setCalcPdpHeight] = useState<number>(20);

  // Compute Schedule II minimum font height
  const getMinFontHeight = (qty: number, unit: string, isBlown: boolean) => {
    // normalize to grams or ml
    let normQty = qty;
    if (unit === 'kg' || unit === 'l' || unit === 'L') normQty = qty * 1000;

    if (normQty <= 50) {
      return isBlown ? 1.5 : 1.0;
    } else if (normQty <= 200) {
      return isBlown ? 3.0 : 2.0;
    } else if (normQty <= 1000) {
      return isBlown ? 6.0 : 4.0;
    } else {
      return isBlown ? 6.0 : 6.0;
    }
  };

  const computedMinFont = getMinFontHeight(calcNetQty, calcUnit, calcPkgType === 'blown');
  const computedPdpArea = Math.round(calcPdpWidth * calcPdpHeight * 0.4);

  const currentRule = STATUTORY_RULES.find((r) => r.ruleCode === selectedRuleCode) || STATUTORY_RULES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Legal Metrology Statutory Rulebook &amp; System Architecture
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Authoritative legal reference for the Legal Metrology Act, 2009, Packaged Commodities Rules, 2011, and 2022 amendments.
        </p>
      </div>

      {/* Section 1: Schedule II Interactive Font Height Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Schedule II Mandatory Font Height Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly compute the statutory minimum height (in mm) required for Net Quantity numerals and letters.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            Table 1, Rule 8
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Declared Net Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={calcNetQty}
                  onChange={(e) => setCalcNetQty(Number(e.target.value))}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-bold"
                />
                <select
                  value={calcUnit}
                  onChange={(e) => setCalcUnit(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="g">g (Gram)</option>
                  <option value="kg">kg (Kilogram)</option>
                  <option value="ml">ml (Millilitre)</option>
                  <option value="l">l / L (Litre)</option>
                  <option value="N">N (Number)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Package Material / Process</label>
              <select
                value={calcPkgType}
                onChange={(e) => setCalcPkgType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium"
              >
                <option value="normal">Standard Box, Pouch, Wrapper (Printed)</option>
                <option value="blown">Blown Moulded / Perforated / Glass Bottle</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Container Face Width (cm)</label>
              <input
                type="number"
                min="1"
                value={calcPdpWidth}
                onChange={(e) => setCalcPdpWidth(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Container Face Height (cm)</label>
              <input
                type="number"
                min="1"
                value={calcPdpHeight}
                onChange={(e) => setCalcPdpHeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Computed Statutory Output (5 cols) */}
          <div className="lg:col-span-5 bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Mandatory Minimum Numeral Height
            </span>
            <div className="text-4xl font-black text-emerald-800">
              {computedMinFont.toFixed(1)} <span className="text-base font-normal text-emerald-700">mm</span>
            </div>
            <p className="text-xs text-emerald-900 font-medium">
              Calculated PDP Area: <strong>{computedPdpArea} cm²</strong> (Rule 7 40% rule)
            </p>
            <div className="text-[11px] text-emerald-700 pt-2 border-t border-emerald-200">
              Any numeral printed smaller than <strong>{computedMinFont.toFixed(1)} mm</strong> constitutes a punishable
              offence under Rule 32 of LMPC Rules, 2011.
            </div>
          </div>
        </div>

        {/* Schedule II Reference Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Net Quantity Range</th>
                <th className="p-3">PDP Area Threshold</th>
                <th className="p-3">Normal Min. Height</th>
                <th className="p-3">Blown / Glass Min. Height</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SCHEDULE_II_FONT_TABLE.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900">{row.netQuantityRange}</td>
                  <td className="p-3">{row.pdpAreaThreshold}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">{row.minFontHeightNormal}</td>
                  <td className="p-3 font-mono font-bold text-blue-700">{row.minFontHeightBlownMoulded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Interactive LMPC Rules Reference Directory */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Scale className="w-5 h-5 text-emerald-600" />
          Statutory Rules Directory (LMPC 2011)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Rule List (4 cols) */}
          <div className="lg:col-span-4 space-y-1.5">
            {STATUTORY_RULES.map((rule) => (
              <button
                key={rule.ruleCode}
                onClick={() => setSelectedRuleCode(rule.ruleCode)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedRuleCode === rule.ruleCode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <span className="line-clamp-1">{rule.ruleTitle}</span>
                <span className={`text-[10px] font-mono shrink-0 ml-2 ${selectedRuleCode === rule.ruleCode ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {rule.ruleCode.replace('RULE_', 'R.')}
                </span>
              </button>
            ))}
          </div>

          {/* Right Rule Detail Panel (8 cols) */}
          <div className="lg:col-span-8 bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
                {currentRule.actReference}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">{currentRule.ruleTitle}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{currentRule.summary}</p>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-serif italic">
              "{currentRule.fullStatutoryText}"
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Frequent Industry Contraventions:
              </span>
              <ul className="space-y-1 list-disc list-inside text-rose-700">
                {currentRule.commonViolations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
              <strong className="block text-emerald-950">Statutory Best Practice:</strong>
              <p className="mt-0.5">{currentRule.correctPractice}</p>
            </div>

            <div className="pt-2 text-slate-500 flex items-center gap-1.5 border-t border-slate-200 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>
                <strong>Penal Section:</strong> {currentRule.penaltySection}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Technical System Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Cpu className="w-5 h-5 text-emerald-600" />
          Technical System Architecture &amp; Verification Framework
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Multimodal Vision &amp; OCR Engine</h4>
            <p className="text-slate-600 leading-relaxed">
              Captures high-resolution images of packaged commodity labels via camera or file upload. Extracts raw textual
              tokens, bounding boxes, and label layouts across diverse typography and curvature.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Deterministic Statutory Rules Engine</h4>
            <p className="text-slate-600 leading-relaxed">
              Cross-validates extracted declarations against Rules 6, 7, 8, 11, and 12. Identifies non-standard metric
              symbols ("gms"), checks PIN codes, verifies Unit Sale Price math, and flags illegal tax clauses.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Enforcement Memos &amp; Reporting</h4>
            <p className="text-slate-600 leading-relaxed">
              Generates official Government Form 1 Show-Cause Notices under Section 18/36 with officer badge attribution,
              compliance scoring, Schedule II font gauges, and exportable audit logs in CSV/JSON.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
