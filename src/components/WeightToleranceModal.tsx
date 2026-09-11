import React, { useState } from 'react';
import { X, Scale, CheckCircle2, AlertTriangle, XCircle, Printer } from 'lucide-react';
import { InspectionResult } from '../types/compliance';

interface WeightToleranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: InspectionResult;
}

export const WeightToleranceModal: React.FC<WeightToleranceModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const declaredQty = report.declarations.netQuantity?.numericValue || 500;
  const [grossWeight, setGrossWeight] = useState<number>(declaredQty + 18);
  const [tareWeight, setTareWeight] = useState<number>(22);

  if (!isOpen) return null;

  const actualNet = grossWeight - tareWeight;
  const deficiency = declaredQty - actualNet;
  const deficiencyPct = Number(((deficiency / declaredQty) * 100).toFixed(2));

  // Schedule I Table 1 tolerance approximation
  const getMaxAllowedDeficiency = (declared: number) => {
    if (declared <= 50) return Math.max(9, declared * 0.09);
    if (declared <= 100) return 4.5;
    if (declared <= 200) return Math.max(4.5, declared * 0.045);
    if (declared <= 300) return 9.0;
    if (declared <= 500) return Math.max(9, declared * 0.03); // 15g
    if (declared <= 1000) return 15.0;
    return Math.max(15, declared * 0.015);
  };

  const maxAllowed = Number(getMaxAllowedDeficiency(declaredQty).toFixed(1));
  const isCompliant = deficiency <= maxAllowed;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Schedule I Net Weight Tolerance Test</h3>
              <p className="text-xs text-slate-400">Maximum Permissible Error (MPE) Lab Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between font-medium">
              <span>Audited Commodity:</span>
              <strong className="text-slate-900">{report.productName}</strong>
            </div>
            <div className="flex justify-between font-medium mt-1">
              <span>Declared Label Net Quantity:</span>
              <strong className="text-emerald-700 font-mono font-bold">{declaredQty} g</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gross Balance Weight (g)</label>
              <input
                type="number"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tare Wrapper Weight (g)</label>
              <input
                type="number"
                value={tareWeight}
                onChange={(e) => setTareWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Computed Breakdown */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Actual Net Weight (Gross - Tare):</span>
              <strong className="text-slate-900">{actualNet} g</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Statutory Max Permissible Error (MPE):</span>
              <strong className="text-slate-900">{maxAllowed} g</strong>
            </div>
            <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1.5">
              <span>Net Deficiency:</span>
              <strong className={deficiency > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                {deficiency > 0 ? `${deficiency} g (${deficiencyPct}%)` : 'None (Excess Net Qty)'}
              </strong>
            </div>
          </div>

          {/* Verdict */}
          <div
            className={`p-4 rounded-xl border text-center space-y-1 ${
              isCompliant ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-black text-sm flex items-center justify-center gap-1.5">
              {isCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
              {isCompliant ? 'WITHIN LEGAL TOLERANCE (PASS)' : 'STATUTORILY UNDERWEIGHT (CONTRAVENTION)'}
            </div>
            <p className="text-[11px] leading-relaxed">
              {isCompliant
                ? `Measured deficiency of ${deficiency}g is within the Schedule I maximum tolerance of ${maxAllowed}g.`
                : `Measured deficiency of ${deficiency}g exceeds the Schedule I limit of ${maxAllowed}g. Actionable under Section 30.`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
