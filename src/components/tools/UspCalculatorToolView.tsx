import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { AppPage } from '../Sidebar';

interface UspCalculatorToolViewProps {
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const UspCalculatorToolView: React.FC<UspCalculatorToolViewProps> = ({
  onBack,
  onSelectTool,
}) => {
  const [uspMrp, setUspMrp] = useState<number>(150);
  const [uspNetQty, setUspNetQty] = useState<number>(450);
  const [uspUnit, setUspUnit] = useState<string>('g');
  const [uspDeclaredRate, setUspDeclaredRate] = useState<number>(0.33);

  // Calculations for USP under Notification G.S.R. 779(E) Rule 6(10)
  const calculateExpectedUSP = (): { rate: number; basis: string; denominator: string } => {
    if (uspNetQty <= 0) return { rate: 0, basis: 'per g', denominator: '0' };
    let rate = 0;
    let basis = '';
    let denominator = '';

    if (uspUnit === 'g') {
      if (uspNetQty >= 1000) {
        rate = uspMrp / (uspNetQty / 1000);
        basis = 'per kg';
        denominator = `${(uspNetQty / 1000).toFixed(2)} kg`;
      } else {
        rate = uspMrp / uspNetQty;
        basis = 'per g';
        denominator = `${uspNetQty} g`;
      }
    } else if (uspUnit === 'kg') {
      rate = uspMrp / uspNetQty;
      basis = 'per kg';
      denominator = `${uspNetQty} kg`;
    } else if (uspUnit === 'ml') {
      if (uspNetQty >= 1000) {
        rate = uspMrp / (uspNetQty / 1000);
        basis = 'per L';
        denominator = `${(uspNetQty / 1000).toFixed(2)} L`;
      } else {
        rate = uspMrp / uspNetQty;
        basis = 'per ml';
        denominator = `${uspNetQty} ml`;
      }
    } else if (uspUnit === 'l') {
      rate = uspMrp / uspNetQty;
      basis = 'per L';
      denominator = `${uspNetQty} L`;
    } else if (uspUnit === 'm') {
      rate = uspMrp / uspNetQty;
      basis = 'per metre';
      denominator = `${uspNetQty} m`;
    } else {
      rate = uspMrp / uspNetQty;
      basis = 'per N';
      denominator = `${uspNetQty} items`;
    }

    return { rate: Number(rate.toFixed(2)), basis, denominator };
  };

  const expectedUsp = calculateExpectedUSP();
  const diff = Number((uspDeclaredRate - expectedUsp.rate).toFixed(2));
  const isUspConsistent = Math.abs(diff) <= 0.02;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <ToolHeader
        currentTool="tool-usp"
        title="Unit Sale Price (USP) Calculator"
        subtitle="Validates compliance with Notification G.S.R. 779(E) amending Rule 6(10) of LMPC Rules, 2011."
        statutoryReference="Rule 6(10) / G.S.R. 779(E)"
        onBack={onBack}
        onSelectTool={onSelectTool}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Packaging Price &amp; Quantity Declaration</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Retail Values</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Maximum Retail Price (MRP in ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={uspMrp}
                  onChange={(e) => setUspMrp(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Inclusive of all taxes</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Declared Net Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={uspNetQty}
                  onChange={(e) => setUspNetQty(Math.max(1, Number(e.target.value)))}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <select
                  value={uspUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    setUspUnit(newUnit);
                  }}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="g">g (grams)</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml (millilitres)</option>
                  <option value="l">l / L</option>
                  <option value="N">N (number/units)</option>
                  <option value="m">m (metre)</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Printed USP Stated on Package (₹ / unit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={uspDeclaredRate}
                  onChange={(e) => setUspDeclaredRate(Number(e.target.value))}
                  placeholder="e.g. 0.33"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Enter the exact numeral printed on the package label after "Unit Sale Price: ₹"
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Commodity Examples
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setUspMrp(150);
                  setUspNetQty(450);
                  setUspUnit('g');
                  setUspDeclaredRate(0.33);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Snack Pouch (450g @ ₹150)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUspMrp(420);
                  setUspNetQty(5);
                  setUspUnit('kg');
                  setUspDeclaredRate(84.0);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Rice Bag (5kg @ ₹420)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUspMrp(190);
                  setUspNetQty(650);
                  setUspUnit('ml');
                  setUspDeclaredRate(0.29);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Shampoo (650ml @ ₹190)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUspMrp(340);
                  setUspNetQty(2);
                  setUspUnit('l');
                  setUspDeclaredRate(170.0);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Cooking Oil (2L @ ₹340)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUspMrp(99);
                  setUspNetQty(10);
                  setUspUnit('N');
                  setUspDeclaredRate(9.9);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Razor Blades (10 N @ ₹99)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`rounded-xl p-6 text-center space-y-3 border-2 shadow-sm ${
              isUspConsistent
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider block">
              Mandatory Statutory Unit Sale Price
            </span>
            <div className="text-4xl font-black">
              ₹ {expectedUsp.rate.toFixed(2)}{' '}
              <span className="text-lg font-normal opacity-85">/ {expectedUsp.basis}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/80 border border-current shadow-2xs">
              {isUspConsistent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Printed Rate Matches Legal Computation</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Discrepancy: Difference of ₹ {Math.abs(diff).toFixed(2)}</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-300/40 text-left text-xs">
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase block text-slate-600">
                  Formula Applied
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  ₹{uspMrp} ÷ {expectedUsp.denominator}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  G.S.R. 779(E) standard metric unit division
                </p>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase block text-slate-600">
                  Printed Label Verification
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  ₹ {uspDeclaredRate.toFixed(2)} / {expectedUsp.basis}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isUspConsistent ? 'Accurate within rounding tolerance' : 'Misleading unit rate printed on label'}
                </p>
              </div>
            </div>
          </div>

          {/* Legal Rule Guidance Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>G.S.R. 779(E) Unit Sale Price Declaration Rules</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p>
                <strong>Commodities &lt; 1 kg or 1 L:</strong> Must declare USP in terms of <strong>per gram (₹/g)</strong> or <strong>per millilitre (₹/ml)</strong>.
              </p>
              <p>
                <strong>Commodities ≥ 1 kg or 1 L:</strong> Must declare USP in terms of <strong>per kilogram (₹/kg)</strong> or <strong>per litre (₹/L)</strong>.
              </p>
              <p>
                <strong>Commodities sold by count:</strong> Must declare USP in terms of <strong>per number (₹/N)</strong> or <strong>per unit (₹/U)</strong>.
              </p>
              <p>
                <strong>Rounding:</strong> Rounded off to the nearest two decimal places.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
