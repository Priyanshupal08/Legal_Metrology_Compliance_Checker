import React, { useState } from 'react';
import {
  Scale,
  Ruler,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { AppPage } from '../Sidebar';
import { SCHEDULE_II_FONT_TABLE } from '../../data/rulesReference';

interface FontHeightToolViewProps {
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const FontHeightToolView: React.FC<FontHeightToolViewProps> = ({
  onBack,
  onSelectTool,
}) => {
  const [fontNetQty, setFontNetQty] = useState<number>(500);
  const [fontUnit, setFontUnit] = useState<string>('g');
  const [fontPkgType, setFontPkgType] = useState<'normal' | 'blown'>('normal');
  const [fontWidth, setFontWidth] = useState<number>(15);
  const [fontHeight, setFontHeight] = useState<number>(20);
  const [containerShape, setContainerShape] = useState<'rectangular' | 'cylindrical'>('rectangular');

  // Calculations for Font Height according to Schedule II Table 1
  const getNormalizedQty = (qty: number, unit: string) => {
    if (unit === 'kg' || unit === 'l') return qty * 1000;
    return qty;
  };

  const normQty = getNormalizedQty(fontNetQty, fontUnit);

  const getMinFontHeight = (norm: number, isBlown: boolean) => {
    if (norm <= 50) return isBlown ? 1.5 : 1.0;
    if (norm <= 200) return isBlown ? 3.0 : 2.0;
    if (norm <= 1000) return isBlown ? 6.0 : 4.0;
    return 6.0;
  };

  const computedFont = getMinFontHeight(normQty, fontPkgType === 'blown');
  const minLetterHeight = Number((computedFont / 2).toFixed(1));

  // PDP Area calculation
  // Rectangular: 40% of (Height x Width)
  // Cylindrical: 40% of (Height x Circumference) -> 20% of (Height x Diameter)
  const totalFaceArea = fontWidth * fontHeight;
  const computedPdpArea = Math.round(
    containerShape === 'rectangular' ? totalFaceArea * 0.4 : totalFaceArea * 0.2
  );

  // Determine active tier index in SCHEDULE_II_FONT_TABLE
  const getActiveTierIndex = (norm: number) => {
    if (norm <= 50) return 0;
    if (norm <= 200) return 1;
    if (norm <= 1000) return 2;
    return 3;
  };
  const activeTier = getActiveTierIndex(normQty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <ToolHeader
        currentTool="tool-font"
        title="Schedule II Font Height Calculator"
        subtitle="Evaluates mandatory numeral and letter height under Rule 8 Table 1 of LMPC Rules, 2011."
        statutoryReference="Rule 8 Table 1 (Schedule II)"
        onBack={onBack}
        onSelectTool={onSelectTool}
      />

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-600" />
              <span>Package Specifications</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Live Input Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Declared Net Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={fontNetQty}
                  onChange={(e) => setFontNetQty(Math.max(0.1, Number(e.target.value)))}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <select
                  value={fontUnit}
                  onChange={(e) => setFontUnit(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="g">g (grams)</option>
                  <option value="kg">kg (kilograms)</option>
                  <option value="ml">ml (millilitres)</option>
                  <option value="l">l / L (litres)</option>
                </select>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Equivalent weight/volume: <strong className="text-slate-700">{normQty} g / ml</strong>
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Packaging Substrate
              </label>
              <select
                value={fontPkgType}
                onChange={(e) => setFontPkgType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="normal">Printed Carton / Pouch / Label</option>
                <option value="blown">Blown Moulded / Glass Bottle / Can</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Blown/moulded containers have higher threshold
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Container Geometry
              </label>
              <select
                value={containerShape}
                onChange={(e) => setContainerShape(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="rectangular">Rectangular / Flat Pouch</option>
                <option value="cylindrical">Cylindrical / Bottle / Can</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                PDP is 40% of face (20% for cylinder)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Package Face Width (cm)
              </label>
              <input
                type="number"
                min="1"
                value={fontWidth}
                onChange={(e) => setFontWidth(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Package Face Height (cm)
              </label>
              <input
                type="number"
                min="1"
                value={fontHeight}
                onChange={(e) => setFontHeight(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Standard Package Presets
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setFontNetQty(30);
                  setFontUnit('g');
                  setFontPkgType('normal');
                  setFontWidth(10);
                  setFontHeight(12);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Small Sachet (30g)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFontNetQty(200);
                  setFontUnit('g');
                  setFontPkgType('normal');
                  setFontWidth(12);
                  setFontHeight(18);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Snack Pouch (200g)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFontNetQty(500);
                  setFontUnit('ml');
                  setFontPkgType('blown');
                  setFontWidth(7);
                  setFontHeight(22);
                  setContainerShape('cylindrical');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Beverage Bottle (500ml)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFontNetQty(1);
                  setFontUnit('kg');
                  setFontPkgType('normal');
                  setFontWidth(16);
                  setFontHeight(26);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Flour / Grain Bag (1kg)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFontNetQty(5);
                  setFontUnit('kg');
                  setFontPkgType('normal');
                  setFontWidth(24);
                  setFontHeight(38);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Bulk Rice (5kg)
              </button>
            </div>
          </div>
        </div>

        {/* Right Result Output Panel */}
        <div className="lg:col-span-6 space-y-4">
          {/* Statutory Numeral Height Result Card */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 text-center space-y-3 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Mandatory Minimum Numeral Height
            </span>
            <div className="text-5xl font-black text-emerald-900 tracking-tight">
              {computedFont.toFixed(1)}{' '}
              <span className="text-xl font-normal text-emerald-700">mm</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Schedule II Tier: {normQty <= 50 ? '≤ 50g' : normQty <= 200 ? '50g - 200g' : normQty <= 1000 ? '200g - 1kg' : '> 1kg'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200 text-left">
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Mandatory Letter Height
                </span>
                <span className="text-base font-black text-emerald-900 font-mono">
                  ≥ {minLetterHeight.toFixed(1)} mm
                </span>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Rule 8(2): Letters in declaration must be ≥ 50% numeral height.
                </p>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Principal Display Area (PDP)
                </span>
                <span className="text-base font-black text-emerald-900 font-mono">
                  {computedPdpArea} cm²
                </span>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Rule 7: {containerShape === 'rectangular' ? '40% of front face area' : '20% of cylindrical surface'}
                </p>
              </div>
            </div>
          </div>

          {/* Visual mm Caliper Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Visual Scale Representation</span>
              <span className="text-emerald-700 font-mono font-bold">{computedFont} mm required</span>
            </div>

            {/* Simulated mm ruler */}
            <div className="relative bg-slate-100 rounded-lg p-3 border border-slate-200 flex items-center justify-center min-h-[64px]">
              <div className="flex items-end gap-2">
                <div
                  className="bg-emerald-600 rounded-xs flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs transition-all duration-300"
                  style={{
                    height: `${Math.max(20, computedFont * 8)}px`,
                    width: `${Math.max(30, computedFont * 8)}px`,
                  }}
                >
                  {computedFont}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  <div>Net Qty font sample</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Sample: <strong>{fontNetQty} {fontUnit}</strong>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Numerals printed below {computedFont.toFixed(1)} mm violate Rule 8 and attract compounding penalty under Sec 36(1).
            </p>
          </div>
        </div>
      </div>

      {/* Schedule II Statutory Reference Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Schedule II (Table 1) Minimum Height of Numerals and Letters
            </h3>
            <p className="text-xs text-slate-500">
              Official statutory reference table from Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
            Active Tier Highlighted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-3">Net Quantity Range</th>
                <th className="py-2.5 px-3">Normal Packaging</th>
                <th className="py-2.5 px-3">Blown Moulded / Glass / Can</th>
                <th className="py-2.5 px-3">PDP Area Threshold</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEDULE_II_FONT_TABLE.map((row, idx) => {
                const isCurrent = idx === activeTier;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50/80 font-bold text-emerald-950 border-l-4 border-l-emerald-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">{row.netQuantityRange}</td>
                    <td className="py-3 px-3">
                      <span className={isCurrent ? 'text-emerald-800 font-mono text-sm' : ''}>
                        {row.minFontHeightNormal}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={isCurrent ? 'text-emerald-800 font-mono text-sm' : ''}>
                        {row.minFontHeightBlownMoulded}
                      </span>
                    </td>
                    <td className="py-3 px-3">{row.pdpAreaThreshold}</td>
                    <td className="py-3 px-3 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
