import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileCheck, AlertOctagon, Scale } from 'lucide-react';
import { InspectionResult } from '../types/compliance';

interface NoticeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: InspectionResult;
}

export const NoticeGeneratorModal: React.FC<NoticeGeneratorModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [noticeRef, setNoticeRef] = useState(`CLM/ENF/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [deadlineDays, setDeadlineDays] = useState(15);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const failedRules = report.rulesEvaluated.filter((r) => r.status === 'FAIL');

  const copyNoticeText = () => {
    const text = `
GOVERNMENT OF INDIA
DIRECTORATE OF LEGAL METROLOGY
DEPARTMENT OF CONSUMER AFFAIRS

NOTICE UNDER SECTION 18 READ WITH SECTION 36 OF THE LEGAL METROLOGY ACT, 2009
AND RULE 6 / 32 OF THE LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011

Notice Reference No: ${noticeRef}
Date: ${new Date().toLocaleDateString('en-IN')}

To,
M/s ${report.brandName} (Manufacturer / Packer / Importer)
Address: ${report.declarations.manufacturerDetails.value || 'As printed on commodity'}

Subject: Non-compliance of pre-packaged commodity "${report.productName}" under Legal Metrology (Packaged Commodities) Rules, 2011.

Sir / Madam,

During an inspection / digital compliance scan conducted on ${new Date(report.timestamp).toLocaleDateString('en-IN')} at ${report.inspectorInfo.inspectionLocation}, samples of your pre-packaged commodity titled "${report.productName}" (Net Qty: ${report.declarations.netQuantity.value || 'N/A'}, MRP: ${report.declarations.mrp.value || 'N/A'}) were examined by the undersigned Legal Metrology Officer.

Upon examination, the following statutory contraventions have been identified:
${failedRules
  .map(
    (r, i) =>
      `${i + 1}. [${r.ruleClause}] - ${r.ruleTitle}\n   Finding: ${r.observation}\n   Contravention: ${r.actSection} (Penal: ${r.penalProvision})\n`
  )
  .join('\n')}

YOU ARE HEREBY REQUIRED to submit your explanation in writing within ${deadlineDays} days from the date of receipt of this notice as to why penal action under Section 36 of the Legal Metrology Act, 2009 should not be initiated against you, or why the offence should not be compounded under Section 48 of the Act.

Failing which, legal prosecution proceedings will be instituted in the competent Court of Law without further reference.

Yours faithfully,

${report.inspectorInfo.name}
Legal Metrology Inspector (LMI)
Badge No: ${report.inspectorInfo.badgeId}
Jurisdiction: ${report.inspectorInfo.jurisdiction}
    `;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Statutory Show-Cause Notice Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-500 font-medium">Notice Ref:</span>
              <input
                type="text"
                value={noticeRef}
                onChange={(e) => setNoticeRef(e.target.value)}
                className="ml-1 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono font-semibold"
              />
            </div>
            <div>
              <span className="text-slate-500 font-medium">Notice Period:</span>
              <select
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="ml-1 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-semibold"
              >
                <option value={7}>7 Days (Urgent)</option>
                <option value={15}>15 Days (Standard)</option>
                <option value={30}>30 Days (Extended)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyNoticeText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Notice Text'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Official Notice
            </button>
          </div>
        </div>

        {/* Official Legal Document Preview (Printable) */}
        <div className="p-8 overflow-y-auto font-serif text-slate-900 leading-relaxed text-sm bg-white space-y-6">
          <div className="text-center border-b pb-4 border-slate-300 space-y-1">
            <h4 className="text-sm font-bold tracking-wider uppercase text-slate-900 font-sans">
              Government of India • Department of Consumer Affairs
            </h4>
            <h3 className="text-lg font-bold uppercase tracking-tight text-slate-950 font-sans">
              Directorate of Legal Metrology
            </h3>
            <p className="text-xs italic text-slate-600">
              Notice of Contravention under Section 18 read with Section 36 of Legal Metrology Act, 2009 &amp;
              Rule 6 / Rule 32 of Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>

          <div className="flex justify-between items-start text-xs font-sans">
            <div>
              <p>
                <strong>Ref No:</strong> <span className="font-mono">{noticeRef}</span>
              </p>
              <p>
                <strong>Inspection ID:</strong> <span className="font-mono">{report.id}</span>
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Date of Issue:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p>
                <strong>Compliance Deadline:</strong> {deadlineDays} Calendar Days
              </p>
            </div>
          </div>

          <div className="text-xs font-sans bg-slate-50 p-3 rounded border border-slate-200">
            <p className="font-bold text-slate-700">TO:</p>
            <p className="font-bold text-slate-900">M/s {report.brandName}</p>
            <p className="text-slate-600">
              {report.declarations.manufacturerDetails.value || 'Address as stamped on packaging'}
            </p>
          </div>

          <div className="space-y-3 text-justify">
            <p>
              <strong>SUBJECT:</strong> Notice for non-compliance of mandatory declarations on pre-packaged commodity{' '}
              <strong>"{report.productName}"</strong> (Category: {report.category.replace(/_/g, ' ')}).
            </p>

            <p>
              Whereas an automated &amp; physical compliance audit of the aforementioned commodity was conducted by the
              undersigned Legal Metrology Inspector on <strong>{new Date(report.timestamp).toLocaleDateString('en-IN')}</strong> at{' '}
              <strong>{report.inspectorInfo.inspectionLocation}</strong>.
            </p>

            <p>
              Upon examination of the Principal Display Panel and packaging declarations, the commodity has been found
              in direct contravention of the Legal Metrology (Packaged Commodities) Rules, 2011 on the following counts:
            </p>
          </div>

          {/* Contravention Items */}
          <div className="space-y-3 font-sans text-xs">
            {failedRules.map((r, i) => (
              <div key={i} className="p-3 rounded bg-rose-50/50 border border-rose-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-900">
                  <span>
                    Count {i + 1}: {r.ruleClause} - {r.ruleTitle}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    {r.severity} Offence
                  </span>
                </div>
                <p className="text-slate-800">
                  <strong>Specific Finding:</strong> {r.observation}
                </p>
                <p className="text-slate-600">
                  <strong>Statutory Provision:</strong> {r.actSection} • <em>{r.penalProvision}</em>
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-justify pt-2">
            <p>
              <strong>NOW THEREFORE</strong>, you are hereby called upon to show cause within{' '}
              <strong>{deadlineDays} days</strong> of receipt of this notice as to why criminal proceedings should not
              be instituted against your firm under Section 36(1) or 36(2) of the Legal Metrology Act, 2009 for the
              aforesaid contraventions, or alternatively why compounding of offence under Section 48 should not be applied.
            </p>
            <p>
              Take notice that failure to reply within the stipulated time will result in immediate seizure of
              non-compliant inventory under Section 15 and filing of prosecution complaints in the Court of Judicial
              Magistrate.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-8 flex justify-between items-end text-xs font-sans">
            <div className="text-slate-500 italic">
              [Official Seal of Inspectorate]
              <div className="w-24 h-24 border border-dashed border-slate-300 rounded-full flex items-center justify-center text-[10px] text-slate-400 mt-2">
                OFFICIAL SEAL
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-mono text-slate-400">Digitally Verified &amp; Signed</div>
              <p className="font-bold text-slate-900 text-sm">{report.inspectorInfo.name}</p>
              <p className="text-slate-600">Legal Metrology Inspector (LMI)</p>
              <p className="text-slate-500">Badge ID: {report.inspectorInfo.badgeId}</p>
              <p className="text-slate-500">{report.inspectorInfo.jurisdiction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
