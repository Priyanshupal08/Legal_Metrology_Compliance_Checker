import React, { useState } from 'react';
import {
  Calculator,
  Scale,
  DollarSign,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SCHEDULE_II_FONT_TABLE } from '../data/rulesReference';

export const ToolsView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'font' | 'usp' | 'mpe' | 'penalty'>('font');

  // Tool 1: Schedule II Font Calculator State
  const [fontNetQty, setFontNetQty] = useState<number>(500);
  const [fontUnit, setFontUnit] = useState<string>('g');
  const [fontPkgType, setFontPkgType] = useState<'normal' | 'blown'>('normal');
  const [fontWidth, setFontWidth] = useState<number>(15);
  const [fontHeight, setFontHeight] = useState<number>(20);

  // Tool 2: USP Validator State
  const [uspMrp, setUspMrp] = useState<number>(150);
  const [uspNetQty, setUspNetQty] = useState<number>(450);
  const [uspUnit, setUspUnit] = useState<string>('g');
  const [uspDeclaredRate, setUspDeclaredRate] = useState<number>(0.33);

  // Tool 3: Schedule I MPE Weight Tolerance State
  const [mpeDeclaredQty, setMpeDeclaredQty] = useState<number>(500);
  const [mpeGrossScale, setMpeGrossScale] = useState<number>(518);
  const [mpeTareWeight, setMpeTareWeight] = useState<number>(25);

  // Tool 4: Statutory Penalty Calculator State
  const [penaltySection, setPenaltySection] = useState<'SEC_36_1' | 'SEC_36_2' | 'SEC_30' | 'SEC_38'>('SEC_36_1');
  const [offenceCount, setOffenceCount] = useState<'FIRST' | 'SECOND' | 'SUBSEQUENT'>('FIRST');

  // Calculations for Font Height
  const getMinFontHeight = (qty: number, unit: string, isBlown: boolean) => {
    let norm = qty;
    if (unit === 'kg' || unit === 'l') norm = qty * 1000;
    if (norm <= 50) return isBlown ? 1.5 : 1.0;
    if (norm <= 200) return isBlown ? 3.0 : 2.0;
    if (norm <= 1000) return isBlown ? 6.0 : 4.0;
    return isBlown ? 6.0 : 6.0;
  };
  const computedFont = getMinFontHeight(fontNetQty, fontUnit, fontPkgType === 'blown');
  const computedPdpArea = Math.round(fontWidth * fontHeight * 0.4);

  // Calculations for USP
  const calculateExpectedUSP = (): { rate: number; basis: string } => {
    if (uspNetQty <= 0) return { rate: 0, basis: 'per g' };
    let rate = 0;
    let basis = '';
    if (uspUnit === 'g') {
      if (uspNetQty >= 1000) {
        rate = (uspMrp / (uspNetQty / 1000));
        basis = 'per kg';
      } else {
        rate = (uspMrp / uspNetQty);
        basis = 'per g';
      }
    } else if (uspUnit === 'ml') {
      if (uspNetQty >= 1000) {
        rate = (uspMrp / (uspNetQty / 1000));
        basis = 'per L';
      } else {
        rate = (uspMrp / uspNetQty);
        basis = 'per ml';
      }
    } else {
      rate = uspMrp / uspNetQty;
      basis = 'per N';
    }
    return { rate: Number(rate.toFixed(2)), basis };
  };
  const expectedUsp = calculateExpectedUSP();
  const isUspConsistent = Math.abs(expectedUsp.rate - uspDeclaredRate) <= 0.02;

  // Calculations for Schedule I MPE Weight Tolerance
  const actualNetWeight = mpeGrossScale - mpeTareWeight;
  const deficiencyGrams = mpeDeclaredQty - actualNetWeight;
  const deficiencyPct = Number(((deficiencyGrams / mpeDeclaredQty) * 100).toFixed(2));

  // Schedule I Table 1 Statutory Tolerance Lookup (Simplified legal matrix)
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

  // Penalties
  const getPenaltyAmount = () => {
    if (penaltySection === 'SEC_36_1') {
      if (offenceCount === 'FIRST') return { fine: '₹ 25,000', remark: 'Compoundable under Section 48' };
      if (offenceCount === 'SECOND') return { fine: '₹ 50,000', remark: 'Compoundable with Directorate sanction' };
      return { fine: 'Up to ₹ 1,00,000 or 1 Year Imprisonment', remark: 'Non-compoundable; trial in Judicial Magistrate Court' };
    }
    if (penaltySection === 'SEC_36_2') {
      if (offenceCount === 'FIRST') return { fine: '₹ 2,000 to ₹ 5,000 per package', remark: 'Mandatory refund of overcharged amount to consumer' };
      if (offenceCount === 'SECOND') return { fine: '₹ 10,000 to ₹ 25,000', remark: 'Prosecution under IPC / LM Act' };
      return { fine: '₹ 50,000 and possible trade cancellation', remark: 'Criminal prosecution' };
    }
    if (penaltySection === 'SEC_30') {
      return { fine: '₹ 10,000', remark: 'Underweight / short measurement offence' };
    }
    return { fine: '₹ 25,000 to ₹ 50,000', remark: 'Importation non-conformance' };
  };
  const penaltyEst = getPenaltyAmount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          Packaging Compliance Calculators
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Validation tools for font height requirements, Unit Sale Price math, weight tolerances, and penalties.
        </p>
      </div>

      {/* Tool Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTool('font')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeTool === 'font'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Scale className="w-5 h-5 mb-2" />
          <div>
            <span className="text-xs font-bold block">Font Height Calculator</span>
            <span className={`text-[11px] block mt-0.5 ${activeTool === 'font' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Mandatory mm height
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('usp')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeTool === 'usp'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <DollarSign className="w-5 h-5 mb-2" />
          <div>
            <span className="text-xs font-bold block">Unit Sale Price Calculator</span>
            <span className={`text-[11px] block mt-0.5 ${activeTool === 'usp' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Rate / g or ml validation
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('mpe')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeTool === 'mpe'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Scale className="w-5 h-5 mb-2" />
          <div>
            <span className="text-xs font-bold block">Weight Tolerance (MPE)</span>
            <span className={`text-[11px] block mt-0.5 ${activeTool === 'mpe' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Tare &amp; net weight test
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('penalty')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeTool === 'penalty'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-2" />
          <div>
            <span className="text-xs font-bold block">Penalty Estimator</span>
            <span className={`text-[11px] block mt-0.5 ${activeTool === 'penalty' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Statutory penalty scales
            </span>
          </div>
        </button>
      </div>

      {/* Tool 1: Schedule II Font Caliper */}
      {activeTool === 'font' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Schedule II Minimum Font Height Calculator</h3>
            <p className="text-xs text-slate-500">
              Evaluates mandatory numeral height under Rule 8 Table 1 of the Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Declared Net Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={fontNetQty}
                    onChange={(e) => setFontNetQty(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                  />
                  <select
                    value={fontUnit}
                    onChange={(e) => setFontUnit(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l / L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Packaging Substrate</label>
                <select
                  value={fontPkgType}
                  onChange={(e) => setFontPkgType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="normal">Standard Printed Carton / Pouch</option>
                  <option value="blown">Blown Moulded / Glass Bottle / Can</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Container Face Width (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={fontWidth}
                  onChange={(e) => setFontWidth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Container Face Height (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={fontHeight}
                  onChange={(e) => setFontHeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="md:col-span-5 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Mandatory Minimum Numeral Height
              </span>
              <div className="text-4xl font-black text-emerald-800">
                {computedFont.toFixed(1)} <span className="text-base font-normal text-emerald-700">mm</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium">
                Calculated PDP Area: <strong>{computedPdpArea} cm²</strong> (Rule 7 40% threshold)
              </p>
              <div className="text-[11px] text-emerald-800 pt-2 border-t border-emerald-200">
                Letters in Net Qty declaration must be at least half the height (min. {(computedFont / 2).toFixed(1)} mm).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Unit Sale Price (USP) Validator */}
      {activeTool === 'usp' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Unit Sale Price (USP) Mathematical Consistency Check</h3>
            <p className="text-xs text-slate-500">
              Validates compliance with Notification G.S.R. 779(E) amending Rule 6(10) of LMPC Rules, 2011.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Declared MRP (₹)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={uspMrp}
                  onChange={(e) => setUspMrp(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Declared Net Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={uspNetQty}
                    onChange={(e) => setUspNetQty(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                  />
                  <select
                    value={uspUnit}
                    onChange={(e) => setUspUnit(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="N">N</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Printed USP Stated on Package (₹ / unit)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={uspDeclaredRate}
                  onChange={(e) => setUspDeclaredRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            <div
              className={`md:col-span-5 rounded-xl p-6 text-center space-y-2 border ${
                isUspConsistent
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                Statutory Unit Sale Price
              </span>
              <div className="text-3xl font-black">
                ₹ {expectedUsp.rate.toFixed(2)}{' '}
                <span className="text-sm font-normal">/ {expectedUsp.basis}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 font-semibold text-xs flex items-center justify-center gap-1.5">
                {isUspConsistent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Printed USP Matches Calculation</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Discrepancy Detected (Expected ₹ {expectedUsp.rate.toFixed(2)})</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool 3: Schedule I MPE Weight Tolerance Scale */}
      {activeTool === 'mpe' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule I Maximum Permissible Error (MPE) Lab Scale Tool
            </h3>
            <p className="text-xs text-slate-500">
              Used during physical lab inspections to verify whether packaged product net weight meets legal tolerance thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Declared Net (g)</label>
                <input
                  type="number"
                  value={mpeDeclaredQty}
                  onChange={(e) => setMpeDeclaredQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gross Scale Wt (g)</label>
                <input
                  type="number"
                  value={mpeGrossScale}
                  onChange={(e) => setMpeGrossScale(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tare Wrapper Wt (g)</label>
                <input
                  type="number"
                  value={mpeTareWeight}
                  onChange={(e) => setMpeTareWeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div className="sm:col-span-3 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span>Actual Derived Net Weight:</span>
                  <strong className="text-slate-900 font-mono">{actualNetWeight} g</strong>
                </div>
                <div className="flex justify-between">
                  <span>Measured Weight Deficiency:</span>
                  <strong className={`${deficiencyGrams > 0 ? 'text-amber-700' : 'text-emerald-700'} font-mono`}>
                    {deficiencyGrams > 0 ? `${deficiencyGrams} g (${deficiencyPct}%)` : 'No deficiency (Excess)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Max Permissible Error (MPE):</span>
                  <strong className="text-slate-700 font-mono">{maxAllowedDeficiency} g</strong>
                </div>
              </div>
            </div>

            <div
              className={`md:col-span-5 rounded-xl p-6 text-center space-y-2 border ${
                isWeightCompliant
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                Schedule I Weight Verdict
              </span>
              <div className="text-2xl font-black">
                {isWeightCompliant ? 'WITHIN TOLERANCE' : 'ILLEGAL UNDERWEIGHT'}
              </div>
              <p className="text-xs leading-relaxed">
                {isWeightCompliant
                  ? `Deficiency of ${deficiencyGrams}g is within the statutory limit of ${maxAllowedDeficiency}g.`
                  : `Deficiency of ${deficiencyGrams}g exceeds the statutory limit of ${maxAllowedDeficiency}g. Actionable under Section 30.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: Statutory Penalties & Compounding Fee Calculator */}
      {activeTool === 'penalty' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Statutory Penalty &amp; Compounding Estimation (Legal Metrology Act, 2009)
            </h3>
            <p className="text-xs text-slate-500">
              Calculate legal penalties and compounding charges under Sections 18, 30, 36, and 48.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicable Section of Act</label>
                <select
                  value={penaltySection}
                  onChange={(e) => setPenaltySection(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="SEC_36_1">Section 36(1): Selling non-conforming pre-packaged commodities</option>
                  <option value="SEC_36_2">Section 36(2): Selling above MRP or charging "Taxes Extra"</option>
                  <option value="SEC_30">Section 30: Penalty for delivering short weight or measure</option>
                  <option value="SEC_38">Section 38: Penalty for non-registration of importer / packer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Offence Severity / Recurrence</label>
                <select
                  value={offenceCount}
                  onChange={(e) => setOffenceCount(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="FIRST">First Offence (Eligible for Compounding under Sec 48)</option>
                  <option value="SECOND">Second Offence (Enhanced Penalty)</option>
                  <option value="SUBSEQUENT">Subsequent Offence (Imprisonment / Court Trial)</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-900 text-white rounded-xl p-6 text-center space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Estimated Statutory Penalty
              </span>
              <div className="text-2xl font-black text-white">{penaltyEst.fine}</div>
              <p className="text-xs text-slate-400">{penaltyEst.remark}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
