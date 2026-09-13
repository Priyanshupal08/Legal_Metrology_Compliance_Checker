import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Gavel,
  Building2,
  HelpCircle,
  Info,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { AppPage } from '../Sidebar';

interface PenaltyEstimatorToolViewProps {
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const PenaltyEstimatorToolView: React.FC<PenaltyEstimatorToolViewProps> = ({
  onBack,
  onSelectTool,
}) => {
  const [penaltySection, setPenaltySection] = useState<'SEC_36_1' | 'SEC_36_2' | 'SEC_30' | 'SEC_38' | 'SEC_18'>('SEC_36_1');
  const [offenceCount, setOffenceCount] = useState<'FIRST' | 'SECOND' | 'SUBSEQUENT'>('FIRST');
  const [entityType, setEntityType] = useState<'RETAIL' | 'DISTRIBUTOR' | 'MANUFACTURER'>('MANUFACTURER');

  // Penalties data structure
  const getPenaltyAmount = () => {
    if (penaltySection === 'SEC_36_1') {
      if (offenceCount === 'FIRST') {
        return {
          fine: '₹ 25,000',
          procedure: 'Compoundable by authorized Legal Metrology Officer under Section 48',
          courtAction: 'No court prosecution if compounding fee paid within 30 days',
          prison: 'Nil (Monetary compounding only)',
          isCompoundable: true,
          details: 'Mandatory fine for manufacturing, packing, importing, or selling non-conforming pre-packaged commodities without statutory declarations.'
        };
      }
      if (offenceCount === 'SECOND') {
        return {
          fine: '₹ 50,000',
          procedure: 'Compoundable with Directorate sanction or departmental approval',
          courtAction: 'Subject to scrutiny of prior compliance history',
          prison: 'Nil if compounded',
          isCompoundable: true,
          details: 'Enhanced compounding fee for repeated violation within 3 years of first compounding.'
        };
      }
      return {
        fine: 'Up to ₹ 1,00,000',
        procedure: 'Non-compoundable; formal chargesheet filed in Judicial Magistrate First Class (JMFC) Court',
        courtAction: 'Criminal trial under Section 36(1) proviso',
        prison: 'Imprisonment up to 1 Year, or fine, or both',
        isCompoundable: false,
        details: 'Subsequent repeated offences cannot be compounded; trial proceeds in criminal court.'
      };
    }

    if (penaltySection === 'SEC_36_2') {
      if (offenceCount === 'FIRST') {
        return {
          fine: '₹ 2,000 to ₹ 5,000 per package',
          procedure: 'Compoundable under Section 48 with mandatory restitution to consumer',
          courtAction: 'Notice issued with refund mandate',
          prison: 'Nil',
          isCompoundable: true,
          details: 'Charging price above printed MRP or illegally stating "Local Taxes Extra" violates Section 18(2).'
        };
      }
      if (offenceCount === 'SECOND') {
        return {
          fine: '₹ 10,000 to ₹ 25,000',
          procedure: 'Compounding with formal undertaking to cease trade overcharging',
          courtAction: 'Notice to commercial tax department',
          prison: 'Nil if compounded',
          isCompoundable: true,
          details: 'Persistent overcharging triggers department inquiry across distribution chain.'
        };
      }
      return {
        fine: 'Up to ₹ 50,000',
        procedure: 'Criminal complaint before Judicial Magistrate and suspension of trade registration',
        courtAction: 'Criminal trial',
        prison: 'Up to 6 Months imprisonment',
        isCompoundable: false,
        details: 'Habitual overpricing offence under Section 36(2).'
      };
    }

    if (penaltySection === 'SEC_30') {
      if (offenceCount === 'FIRST') {
        return {
          fine: '₹ 10,000',
          procedure: 'Compoundable under Section 48',
          courtAction: 'Seizure of short-weight batch under Section 15',
          prison: 'Nil',
          isCompoundable: true,
          details: 'Delivering short weight or measure beyond Schedule I Maximum Permissible Error.'
        };
      }
      return {
        fine: '₹ 20,000 to ₹ 50,000',
        procedure: 'Enhanced penalty with complete batch recall order',
        courtAction: 'Court trial for repeat short measurement',
        prison: 'Up to 1 Year imprisonment for repeat offender',
        isCompoundable: false,
        details: 'Repeat short-delivery of commodities to consumers.'
      };
    }

    if (penaltySection === 'SEC_38') {
      return {
        fine: '₹ 25,000 to ₹ 50,000',
        procedure: 'Non-registration compounding under Rule 27 of LMPC Rules',
        courtAction: 'Notice to register within 30 days',
        prison: 'Nil',
        isCompoundable: true,
        details: 'Failure to register manufacturing or packing premises with Director or Controller of Legal Metrology.'
      };
    }

    // SEC_18 General
    return {
      fine: '₹ 25,000',
      procedure: 'Compoundable under Section 48',
      courtAction: 'Standard compounding notice Form 1',
      prison: 'Nil',
      isCompoundable: true,
      details: 'General violation of standard package declaration requirements under Section 18.'
    };
  };

  const penaltyEst = getPenaltyAmount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <ToolHeader
        currentTool="tool-penalty"
        title="Statutory Penalties & Compounding Estimator"
        subtitle="Calculates legal penalties and compounding charges under Sections 18, 30, 36, 38, 48 and 49 of Legal Metrology Act, 2009."
        statutoryReference="Legal Metrology Act, 2009"
        onBack={onBack}
        onSelectTool={onSelectTool}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Options Form */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-emerald-600" />
              <span>Offence Parameters &amp; Classification</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Statutory Matrix</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Applicable Statutory Section of the Act
              </label>
              <select
                value={penaltySection}
                onChange={(e) => setPenaltySection(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="SEC_36_1">Section 36(1): Selling / packing non-conforming pre-packaged commodities</option>
                <option value="SEC_36_2">Section 36(2): Selling above MRP or charging "Taxes Extra"</option>
                <option value="SEC_30">Section 30: Delivering short weight or measure (MPE violation)</option>
                <option value="SEC_38">Section 38: Non-registration of importer / packer (Rule 27)</option>
                <option value="SEC_18">Section 18: General violation of packaging declaration rules</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Offence Recurrence History
                </label>
                <select
                  value={offenceCount}
                  onChange={(e) => setOffenceCount(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FIRST">First Offence</option>
                  <option value="SECOND">Second Offence</option>
                  <option value="SUBSEQUENT">Subsequent (Repeat Offender)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Entity Category
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="RETAIL">Retailer / Merchant</option>
                  <option value="DISTRIBUTOR">Wholesale Distributor</option>
                  <option value="MANUFACTURER">Manufacturer / Importer / Brand</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
              <span className="font-bold text-[11px] text-slate-900 block">Offence Description:</span>
              <p className="text-[11px] leading-relaxed">{penaltyEst.details}</p>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 text-center space-y-3 shadow-md border border-slate-800">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              Estimated Statutory Liability
            </span>
            <div className="text-4xl font-black text-white tracking-tight">
              {penaltyEst.fine}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700">
              {penaltyEst.isCompoundable ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Compoundable under Section 48</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-300">Non-Compoundable / Court Prosecution</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-left text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase block text-slate-400">
                  Legal Procedure
                </span>
                <p className="text-slate-200 text-[11px] mt-0.5 leading-snug">
                  {penaltyEst.procedure}
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase block text-slate-400">
                  Imprisonment Risk
                </span>
                <p className="text-slate-200 text-[11px] mt-0.5 leading-snug">
                  {penaltyEst.prison}
                </p>
              </div>
            </div>
          </div>

          {/* Section 49 Corporate Liability Card */}
          {entityType === 'MANUFACTURER' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-1.5 text-amber-950">
              <div className="font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Section 49: Corporate Liability for Company Directors</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Under Section 49, where an offence is committed by a company, every person in charge and responsible for company conduct (Directors, Partners, or designated nominated Director) shall be deemed guilty unless proven without knowledge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
