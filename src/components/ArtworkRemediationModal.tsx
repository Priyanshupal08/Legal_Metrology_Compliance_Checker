import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { InspectionResult } from '../types/compliance';

interface ArtworkRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: InspectionResult;
}

export const ArtworkRemediationModal: React.FC<ArtworkRemediationModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build compliant text blocks based on what failed
  const compliantNetQty = report.declarations.netQuantity?.numericValue
    ? `${report.declarations.netQuantity.numericValue} ${report.declarations.netQuantity.standardMetricUnit || 'g'}`
    : '500 g';

  const compliantMrp = report.declarations.mrp?.mrpAmount
    ? `MRP ₹ ${report.declarations.mrp.mrpAmount.toFixed(2)} (inclusive of all taxes)`
    : 'MRP ₹ 150.00 (inclusive of all taxes)';

  const compliantUsp = report.declarations.unitSalePrice?.expectedUnitPrice || 'Unit Sale Price: ₹ 0.30 / g';

  const compliantConsumerCare = `Consumer Care Officer, ${report.brandName} Ltd., ${report.declarations.manufacturerDetails?.value || 'Factory Address with PIN'}, Tel: 1800-200-8899, Email: customercare@${report.brandName.toLowerCase().replace(/[^a-z]/g, '')}.com`;

  const artworkGuideText = `
=== STATUTORILY COMPLIANT ARTWORK SPECIFICATION (LMPC 2011) ===
Commodity: ${report.productName}
Brand: ${report.brandName}

1. PRINCIPAL DISPLAY PANEL (RULE 6 & SCHEDULE II):
   - Net Quantity Declaration: "Net Quantity: ${compliantNetQty}"
     * Minimum Numeral Height: ${report.readability.requiredMinFontHeightMm || 4.0} mm
     * Minimum Letter Height: ${(report.readability.requiredMinFontHeightMm ? report.readability.requiredMinFontHeightMm / 2 : 2.0).toFixed(1)} mm
     * Note: Under Rule 11, strictly use "g" or "kg" (never "gms" or "kgs").

2. MAXIMUM RETAIL PRICE & UNIT SALE PRICE:
   - Retail Sale Price: "${compliantMrp}"
     * Prohibited: Never use words like "+ Taxes" or "Taxes Extra" (Section 36(2)).
   - Mandatory Unit Sale Price (2022 Amendment): "${compliantUsp}"

3. MANDATORY CONSUMER GRIEVANCE CELL (RULE 6(1)(f)):
   - Declaration: "${compliantConsumerCare}"
     * Must contain all 4 fields: Officer designation, Full Postal Address, Phone number, and Email ID.

4. MANUFACTURER / PACKER DECLARATION (RULE 6(1)(a)):
   - "${report.declarations.manufacturerDetails?.value || 'Company Name, Registered Factory Plot, City, State - PIN CODE'}"
     * Mandatory: Must include 6-digit postal PIN code.
  `;

  const handleCopy = () => {
    navigator.clipboard.writeText(artworkGuideText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold">AI Packaging Artwork Remediation Assistant</h3>
              <p className="text-xs text-slate-400">
                Statutorily compliant copy-paste printing plate specifications
              </p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
            Use these corrected typographical declarations to update packaging artworks, flexo cylinders, and carton
            rotogravure plates before commercial dispatch to eliminate risk of seizure under Section 15.
          </div>

          {/* Remediation Cards */}
          <div className="space-y-4">
            {/* Net Quantity Fix */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">Rule 6(1)(c) Net Quantity Declaration</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Min {report.readability.requiredMinFontHeightMm || 4.0}mm font
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 p-2.5 rounded border border-rose-200">
                  <span className="text-rose-700 font-bold block mb-1">Current Detection:</span>
                  <p className="font-mono text-rose-900">
                    {report.declarations.netQuantity?.value || 'Non-compliant format'}
                  </p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <span className="text-emerald-800 font-bold block mb-1">Compliant Print Plate Text:</span>
                  <p className="font-mono font-bold text-emerald-950">Net Quantity: {compliantNetQty}</p>
                </div>
              </div>
            </div>

            {/* MRP & Tax Clause Fix */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">Rule 6(1)(e) Maximum Retail Price</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tax Inclusive
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 p-2.5 rounded border border-rose-200">
                  <span className="text-rose-700 font-bold block mb-1">Current Detection:</span>
                  <p className="font-mono text-rose-900">{report.declarations.mrp?.value || 'N/A'}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <span className="text-emerald-800 font-bold block mb-1">Compliant Print Plate Text:</span>
                  <p className="font-mono font-bold text-emerald-950">{compliantMrp}</p>
                </div>
              </div>
            </div>

            {/* Unit Sale Price Fix */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">Rule 6(10) Mandatory Unit Sale Price</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  2022 Amendment
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 p-2.5 rounded border border-rose-200">
                  <span className="text-rose-700 font-bold block mb-1">Current Detection:</span>
                  <p className="font-mono text-rose-900">
                    {report.declarations.unitSalePrice?.value || 'Omitted from packaging'}
                  </p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <span className="text-emerald-800 font-bold block mb-1">Compliant Print Plate Text:</span>
                  <p className="font-mono font-bold text-emerald-950">{compliantUsp}</p>
                </div>
              </div>
            </div>

            {/* Consumer Care 4-Field Fix */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">Rule 6(1)(f) Consumer Grievance Cell</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  4 Mandatory Elements
                </span>
              </div>
              <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                <span className="text-emerald-800 font-bold block mb-1">Ready-to-Print Grievance Block:</span>
                <p className="font-mono text-emerald-950 leading-relaxed">{compliantConsumerCare}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Includes Schedule II font dimensions</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy All Artwork Specs'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
