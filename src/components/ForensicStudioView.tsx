import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Layers,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Maximize2,
  FileText,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { InspectionResult, LabelAnnotation } from '../types/compliance';
import { safeExtractSvg } from '../utils/svgHelper';

interface ForensicStudioViewProps {
  report: InspectionResult;
  onNavigateToReport?: () => void;
  onOpenNoticeGenerator?: () => void;
  onOpenRemediation?: () => void;
}

export const ForensicStudioView: React.FC<ForensicStudioViewProps> = ({
  report,
  onNavigateToReport,
  onOpenNoticeGenerator,
  onOpenRemediation,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showOnlyViolations, setShowOnlyViolations] = useState<boolean>(false);
  const [showRulerGrid, setShowRulerGrid] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<'canvas' | 'details'>('canvas');

  // Generate sensible annotations if none exist on report
  const annotations: LabelAnnotation[] =
    report.annotations && report.annotations.length > 0
      ? report.annotations
      : [
          {
            id: 'box-netqty',
            label: 'Net Quantity Declaration',
            fieldKey: 'netQuantity',
            topPct: 28,
            leftPct: 8,
            widthPct: 84,
            heightPct: 8,
            isCompliant: report.declarations.netQuantity?.isCompliant ?? true,
            ruleClause: 'Statutory Standard Net Quantity',
            detectedText: report.declarations.netQuantity?.value || 'Net Quantity not clearly stated',
            violationMessage: report.declarations.netQuantity?.violationReason,
          },
          {
            id: 'box-mrp',
            label: 'Maximum Retail Price (MRP)',
            fieldKey: 'mrp',
            topPct: 37,
            leftPct: 8,
            widthPct: 84,
            heightPct: 8,
            isCompliant: report.declarations.mrp?.isCompliant ?? true,
            ruleClause: 'All-Inclusive Retail Price',
            detectedText: report.declarations.mrp?.value || 'MRP not detected',
            violationMessage: report.declarations.mrp?.hasTaxesExtraViolation
              ? 'CRITICAL: "Taxes Extra" illegal under retail pricing standards'
              : undefined,
          },
          {
            id: 'box-usp',
            label: 'Unit Sale Price (USP)',
            fieldKey: 'unitSalePrice',
            topPct: 45,
            leftPct: 8,
            widthPct: 84,
            heightPct: 8,
            isCompliant: report.declarations.unitSalePrice?.isCompliant ?? true,
            ruleClause: 'Per-Unit Pricing Standard',
            detectedText: report.declarations.unitSalePrice?.value || 'Missing Unit Sale Price declaration',
            violationMessage: report.declarations.unitSalePrice?.violationReason || 'Mandatory USP omitted',
          },
          {
            id: 'box-mfg',
            label: 'Manufacturer / Packer Details',
            fieldKey: 'manufacturerDetails',
            topPct: 56,
            leftPct: 8,
            widthPct: 84,
            heightPct: 15,
            isCompliant: report.declarations.manufacturerDetails?.isCompliant ?? true,
            ruleClause: 'Complete Physical Address with Postal Code',
            detectedText: report.declarations.manufacturerDetails?.value || 'Incomplete address',
            violationMessage: report.declarations.manufacturerDetails?.pinCodeDeclared
              ? undefined
              : 'Missing 6-digit postal PIN code',
          },
          {
            id: 'box-care',
            label: 'Consumer Care Cell',
            fieldKey: 'consumerCare',
            topPct: 73,
            leftPct: 8,
            widthPct: 84,
            heightPct: 16,
            isCompliant: report.declarations.consumerCare?.isCompliant ?? true,
            ruleClause: 'Direct Consumer Redressal Contact Channels',
            detectedText: report.declarations.consumerCare?.value || 'Incomplete contact details',
            violationMessage: report.declarations.consumerCare?.violationReason || 'Missing required contact channels',
          },
        ];

  const displayedAnnotations = showOnlyViolations
    ? annotations.filter((a) => !a.isCompliant)
    : annotations;

  const activeAnnotation = annotations.find((a) => a.id === selectedAnnotationId) || annotations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Fast Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              VERIFICATION STUDIO
            </span>
            <span className="text-xs text-slate-500 font-mono">CASE: {report.id}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Visual Label Inspector &amp; Verification Studio
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Examine packaging panels with interactive optical loupe, verified statutory zones, and fine-print calipers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {report.overallVerdict !== 'COMPLIANT' && (
            <>
              <button
                onClick={onOpenRemediation}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Artwork Remediation
              </button>
              <button
                onClick={onOpenNoticeGenerator}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Inspection Notice
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Screen Segmented Switcher */}
      <div className="lg:hidden flex bg-slate-200/80 p-1 rounded-xl border border-slate-300 shadow-2xs">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileTab === 'canvas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Visual Evidence Canvas
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileTab === 'details' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Zone Findings ({displayedAnnotations.length})
        </button>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas Area (8 cols) */}
        <div className={`lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 ${
          mobileTab === 'canvas' ? 'block' : 'hidden lg:block'
        }`}>
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Digital Loupe:</span>
              <button
                onClick={() => setZoomLevel(1)}
                className={`px-2.5 py-1 rounded font-mono font-bold ${
                  zoomLevel === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setZoomLevel(1.5)}
                className={`px-2.5 py-1 rounded font-mono font-bold ${
                  zoomLevel === 1.5 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1.5x
              </button>
              <button
                onClick={() => setZoomLevel(2.0)}
                className={`px-2.5 py-1 rounded font-mono font-bold ${
                  zoomLevel === 2.0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2.0x
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={showOnlyViolations}
                  onChange={(e) => setShowOnlyViolations(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                Show Violations Only
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={showRulerGrid}
                  onChange={(e) => setShowRulerGrid(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                Schedule II Caliper
              </label>
            </div>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="relative overflow-auto border border-slate-200 rounded-xl bg-slate-950 flex items-center justify-center p-4 min-h-[480px]">
            {/* Caliper overlay */}
            {showRulerGrid && (
              <div className="absolute top-2 left-2 z-20 bg-slate-900/90 text-emerald-400 font-mono text-[10px] px-2.5 py-1 rounded border border-slate-700 flex items-center gap-2">
                <span>SCHEDULE II CALIPER:</span>
                <span>Measured Font: {report.readability.measuredFontHeightMm}mm</span>
                <span>•</span>
                <span>Required Min: {report.readability.requiredMinFontHeightMm}mm</span>
              </div>
            )}

            <div
              className="relative transition-transform duration-200 origin-center max-w-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Product Label SVG or Raster */}
              {report.images.pdpImage?.startsWith('data:image/svg+xml') ? (
                <div
                  className="w-[360px] sm:w-[420px] max-w-full select-none shadow-2xl rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: safeExtractSvg(report.images.pdpImage),
                  }}
                />
              ) : report.images.pdpImage ? (
                <img
                  src={report.images.pdpImage}
                  alt="Packaging"
                  className="w-[360px] sm:w-[420px] max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-[360px] h-[460px] bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                  No preview available
                </div>
              )}

              {/* Interactive Bounding Box Overlay */}
              {displayedAnnotations.map((ann) => {
                const isSelected = selectedAnnotationId === ann.id;
                const isPass = ann.isCompliant;

                return (
                  <button
                    key={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    style={{
                      top: `${ann.topPct}%`,
                      left: `${ann.leftPct}%`,
                      width: `${ann.widthPct}%`,
                      height: `${ann.heightPct}%`,
                    }}
                    className={`absolute z-10 rounded transition-all cursor-pointer text-left p-1 text-[10px] font-bold flex flex-col justify-between ${
                      isSelected
                        ? isPass
                          ? 'ring-3 ring-emerald-400 bg-emerald-500/25 border-2 border-emerald-400'
                          : 'ring-3 ring-rose-500 bg-rose-500/30 border-2 border-rose-500'
                        : isPass
                        ? 'border border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'border border-rose-500 bg-rose-500/20 hover:bg-rose-500/30'
                    }`}
                  >
                    <span
                      className={`inline-block px-1 rounded text-[9px] uppercase font-mono shadow-xs ${
                        isPass ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white animate-pulse'
                      }`}
                    >
                      {isPass ? '✓' : '✕'} {ann.label.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Click any highlighted label zone on the packaging to view statutory finding.</span>
            <span className="font-mono">
              Zones: {displayedAnnotations.filter((a) => a.isCompliant).length} Compliant,{' '}
              {displayedAnnotations.filter((a) => !a.isCompliant).length} Non-Compliant
            </span>
          </div>
        </div>

        {/* Right: Selected Zone Inspector Panel (4 cols) */}
        <div className={`lg:col-span-4 space-y-4 ${
          mobileTab === 'details' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Inspected Zone Details
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  activeAnnotation.isCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {activeAnnotation.isCompliant ? 'PASS' : 'CONTRAVENTION'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Statutory Mandate
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeAnnotation.label}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{activeAnnotation.ruleClause}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Extracted Printed Text
              </span>
              <p className="text-xs font-semibold text-slate-900 font-mono break-words">
                "{activeAnnotation.detectedText}"
              </p>
            </div>

            {!activeAnnotation.isCompliant && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1.5 text-xs text-rose-900">
                <div className="font-bold flex items-center gap-1 text-rose-950">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Statutory Contravention
                </div>
                <p className="leading-relaxed">
                  {activeAnnotation.violationMessage || 'Non-compliance under Legal Metrology Rules.'}
                </p>
                <div className="pt-1 text-[11px] text-rose-700 font-mono">
                  Penal Section: Section 36(1) of LM Act, 2009
                </div>
              </div>
            )}

            {/* List of All Zones */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                All Recognized Panel Zones
              </span>
              {annotations.map((ann) => {
                const isSelected = (selectedAnnotationId || annotations[0].id) === ann.id;
                return (
                  <button
                    key={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span className="line-clamp-1">{ann.label.split('(')[0]}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        ann.isCompliant
                          ? isSelected
                            ? 'text-emerald-300'
                            : 'text-emerald-700'
                          : isSelected
                          ? 'text-rose-300'
                          : 'text-rose-600'
                      }`}
                    >
                      {ann.isCompliant ? '✓ PASS' : '✕ FAIL'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
