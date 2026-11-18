import React, { useState } from 'react';
import { 
  Printer, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Percent, 
  TrendingUp, 
  Building, 
  FileText, 
  Check, 
  XCircle,
  Award,
  PhoneCall,
  MapPin,
  Mail,
  Sliders,
  DollarSign
} from 'lucide-react';
import rmcLogo from '../assets/logo-rmc.png';

/**
 * FEATURE 2: Interactive Contractor Profit Margin Slider & Breakup Analysis (Sheet 12.Breakup)
 */
export function ProfitBreakupDashboard({ estimate, rates, updateRates }) {
  const margin = Number(rates.contractorMarginPct ?? 0);
  const gfArea = Number(estimate.gfArea ?? 0);
  const totalBuiltup = Number(estimate.totalBuiltupArea ?? 0);

  // Direct civil work total before markup
  const totalDirectCost = Number(estimate.totalDirectCost ?? 0);
  const additionalCost = Number(estimate.totalAdditionalCost ?? 0);
  const directCivilCost = Math.max(0, totalDirectCost - additionalCost);
  const markupAmount = directCivilCost * (margin / 100);
  const overallWithMarkup = directCivilCost + markupAmount;

  // Additional Works (Site Infrastructure)
  const additionalQuotedCost = additionalCost * (1 + margin / 100);
  const totalProjectWithAdditional = overallWithMarkup + additionalQuotedCost;

  // Rates per sq.ft
  const directRatePerSqft = gfArea > 0 ? (directCivilCost / gfArea) : 0;
  const quotedRatePerSqft = gfArea > 0 ? (overallWithMarkup / gfArea) : 0;
  const totalProjectRatePerSqft = gfArea > 0 ? (totalProjectWithAdditional / gfArea) : 0;

  const presets = [5, 8, 10, 12, 15, 20];

  const handleSliderChange = (e) => {
    const newMargin = parseFloat(e.target.value) || 0;
    if (updateRates) {
      updateRates({ ...rates, contractorMarginPct: newMargin });
    }
  };

  const handlePresetClick = (p) => {
    if (updateRates) {
      updateRates({ ...rates, contractorMarginPct: p });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Margin Controller */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-400/10 text-teal-300 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black tracking-tight">Contractor Profit Margin & Cost Breakup</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Adjust the margin to compare the quoted rate per square foot and projected profit.
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-xs font-semibold text-indigo-200">Selected Margin:</span>
            <span className="text-2xl font-black text-teal-300">{margin}%</span>
          </div>
        </div>

        {/* Live Slider & Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex justify-between text-xs font-bold text-indigo-200">
              <span>Low Margin (5%)</span>
              <span>Standard (10% - 12%)</span>
              <span>High Margin (20%)</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="0.5"
              value={margin}
              onChange={handleSliderChange}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 focus:outline-none"
            />
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-indigo-300 font-semibold">Quick Presets:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetClick(p)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    margin === p
                      ? 'bg-teal-300 text-slate-950 shadow-md font-black scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {p}% {p === 12 ? '(Excel Standard)' : p === 10 ? '(Base)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Highlight */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-center md:text-right">
            <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
              Total Quoted Rate / Sq.ft
            </div>
            <div className="text-3xl font-black text-white">
              ₹ {Math.round(quotedRatePerSqft).toLocaleString('en-IN')} <span className="text-sm font-semibold text-teal-300">/ sq.ft</span>
            </div>
            <div className="text-[11px] text-indigo-300">
              Net Profit Yield: <b className="text-emerald-400">₹ {Math.round(markupAmount).toLocaleString('en-IN')}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Breakup Cards Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Direct Civil Cost */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Civil Base Cost
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                0% Markup
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {Math.round(directCivilCost).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-xs mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
            Base Cost: ₹ {Math.round(directRatePerSqft).toLocaleString('en-IN')} / sq.ft (GF)
          </div>
        </div>

        {/* Card 2: Contractor Profit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-sm flex flex-col justify-between bg-emerald-50/20 dark:bg-emerald-950/10">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Contractor Profit ({margin}%)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                Yield
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              + ₹ {Math.round(markupAmount).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-xs mt-2.5 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold">
            Margin: ₹ {Math.round(markupAmount / (gfArea || 1)).toLocaleString('en-IN')} / sq.ft
          </div>
        </div>

        {/* Card 3: Civil Construction Quote */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 shadow-sm flex flex-col justify-between bg-blue-50/20 dark:bg-blue-950/10">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Civil Work Quote
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                Main Villa
              </span>
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              ₹ {Math.round(overallWithMarkup).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-xs mt-2.5 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold">
            Rate: ₹ {Math.round(quotedRatePerSqft).toLocaleString('en-IN')} / sq.ft
          </div>
        </div>

        {/* Card 4: Overall Project with Site Infra */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 shadow-sm flex flex-col justify-between bg-purple-50/20 dark:bg-purple-950/10">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Grand Project Total
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                + Site Infra
              </span>
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              ₹ {Math.round(totalProjectWithAdditional).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-xs mt-2.5 pt-2 border-t border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-400 font-semibold">
            Overall Rate: ₹ {Math.round(totalProjectRatePerSqft).toLocaleString('en-IN')} / sq.ft
          </div>
        </div>
      </div>

      {/* Detailed Multi-Tier Margin Matrix (Excel 12.Breakup Row 10 to 22) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Tier Margin Rate Matrix (Excel 12.Breakup Audit)
            </h4>
            <p className="text-xs text-slate-500">
              Pre-calculated contract scenarios at 12%, 10%, 8%, and 5% contractor profit levels
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            GF Plinth Reference: {gfArea} Sq.ft
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Margin Tier</th>
                <th className="py-2.5 px-3 text-right">Civil Cost (₹)</th>
                <th className="py-2.5 px-3 text-right">Civil Rate / Sq.ft</th>
                <th className="py-2.5 px-3 text-right">Profit Amount (₹)</th>
                <th className="py-2.5 px-3 text-right">Site Infra (₹)</th>
                <th className="py-2.5 px-3 text-right">Grand Total (₹)</th>
                <th className="py-2.5 px-3 text-right">Overall Rate / Sq.ft</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {[
                { pct: 15, tag: 'High Margin' },
                { pct: 12, tag: 'Excel Benchmark', highlight: true },
                { pct: 10, tag: 'Standard Quote' },
                { pct: 8, tag: 'Competitive' },
                { pct: 5, tag: 'Minimum Viable' },
              ].map((tier) => {
                const tierMarkup = directCivilCost * (tier.pct / 100);
                const tierCivil = directCivilCost + tierMarkup;
                const tierGrand = tierCivil + (additionalCost * (1 + tier.pct / 100));
                const tierCivilRate = gfArea > 0 ? (tierCivil / gfArea) : 0;
                const tierGrandRate = gfArea > 0 ? (tierGrand / gfArea) : 0;
                const isCurrent = Math.abs(margin - tier.pct) < 0.1;

                return (
                  <tr
                    key={tier.pct}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 border-l-4 border-amber-500'
                        : tier.highlight
                        ? 'bg-blue-50/40 dark:bg-blue-950/20'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className="font-black text-slate-900 dark:text-white mr-2">{tier.pct}%</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {tier.tag}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      ₹ {Math.round(tierCivil).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-blue-600 dark:text-blue-400">
                      ₹ {Math.round(tierCivilRate).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      + ₹ {Math.round(tierMarkup).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      ₹ {Math.round(additionalCost * (1 + tier.pct / 100)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white text-sm">
                      ₹ {Math.round(tierGrand).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-purple-600 dark:text-purple-400">
                      ₹ {Math.round(tierGrandRate).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950">
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePresetClick(tier.pct)}
                          className="text-[10px] font-bold text-slate-400 hover:text-blue-500 underline"
                        >
                          Select
                        </button>
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
}

export function FoundationDashboard({ estimate, rates }) {
  const kpis = [
    { label: 'Foundation Total Estimate', value: `₹ ${Math.round(estimate.grandTotalFoundationCost).toLocaleString('en-IN')}`, sub: `₹ ${Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft`, color: 'from-blue-600 to-indigo-600', text: 'text-white' },
    { label: 'Total Built-Up Area', value: `${Math.round(estimate.totalBuiltupArea)} Sq.ft`, sub: `Ground Floor: ${Math.round(estimate.gfArea)} Sq.ft`, color: '', badge: 'Contract Area' },
    { label: 'Total Columns Count', value: `${estimate.totalColumnsCount} Columns`, sub: 'Isolated Footings', color: '', badge: 'Structural' },
    { label: 'Earth Excavation', value: `${Math.round(estimate.totalExcavationCft)} CFT`, sub: 'Earth cutting to hard stratum', color: '', badge: 'Earthwork' },
    { label: 'PCC 1:4:8 Bed Concrete', value: `${Math.round(estimate.totalPccCft)} CFT`, sub: 'Foundation level bed', color: '', badge: 'Bed PCC' },
    { label: 'Footing Concrete (M20)', value: `${Math.round(estimate.totalFootingConcreteCft)} CFT`, sub: `${Math.round(estimate.totalFootingConcreteCft / 35.314 * 10) / 10} Cu.m RCC`, color: '', badge: 'M20 RCC' },
    { label: 'Column Stubs Concrete', value: `${Math.round(estimate.totalColumnConcreteCft * 10) / 10} CFT`, sub: 'Up to plinth level', color: '', badge: 'M20 RCC' },
    { label: 'Backfilling Compaction', value: `${Math.round(estimate.totalBackfillingCft)} CFT`, sub: 'Selected earth filling', color: '', badge: 'Compaction' },
    { label: 'Cement Required', value: `${Math.round(estimate.totalCementBags)} Bags`, sub: 'Dalmia / UltraTech', color: '', badge: 'Procurement' },
    { label: 'TMT Steel Rebar', value: `${(estimate.totalSteelTons).toFixed(2)} Tons`, sub: `${Math.round(estimate.totalSteelKg)} Kg (ARS Fe550D)`, color: '', badge: 'Fe550D' },
    { label: 'M-Sand for Concrete', value: `${Math.round(estimate.totalMsandCft)} CFT`, sub: `${(estimate.totalMsandCft / 100).toFixed(2)} Units`, color: '', badge: 'M-Sand' },
    { label: '20mm Blue Metal', value: `${Math.round(estimate.totalAggregateCft)} CFT`, sub: `${(estimate.totalAggregateCft / 100).toFixed(2)} Units`, color: '', badge: 'Aggregate' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              idx === 0
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-blue-500/10 border-transparent sm:col-span-2 lg:col-span-2'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${idx === 0 ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {kpi.label}
                </span>
                {kpi.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-black ${idx === 0 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {kpi.value}
              </div>
            </div>
            <div className={`text-xs mt-2.5 pt-2 border-t font-semibold ${idx === 0 ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800/80 text-slate-500'}`}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Itemized Quantities by Footing Group Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Footing & Column Group Computed Volume Breakup
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Footing</th>
                <th className="py-2.5 px-3">Col</th>
                <th className="py-2.5 px-3 text-center">Nos</th>
                <th className="py-2.5 px-3 text-right">Excavation (CFT)</th>
                <th className="py-2.5 px-3 text-right">PCC Bed (CFT)</th>
                <th className="py-2.5 px-3 text-right">Footing Conc (CFT)</th>
                <th className="py-2.5 px-3 text-right">Column Conc (CFT)</th>
                <th className="py-2.5 px-3 text-right">Backfilling (CFT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {estimate.itemizedFootings.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-blue-600">{f.id}</td>
                  <td className="py-2.5 px-3">{f.colId}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{f.nos}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-600">{Math.round(f.excavationCft * 10) / 10}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{Math.round(f.pccCft * 10) / 10}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">{Math.round(f.footingConcreteCft * 10) / 10}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-600 font-bold">{Math.round(f.colConcreteCft * 100) / 100}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">{Math.round(f.backfillingCft * 10) / 10}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
                <td colSpan="2" className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Total Sum:</td>
                <td className="py-2.5 px-3 text-center font-black">{estimate.totalColumnsCount}</td>
                <td className="py-2.5 px-3 text-right font-black text-amber-600">{Math.round(estimate.totalExcavationCft)} CFT</td>
                <td className="py-2.5 px-3 text-right font-black">{Math.round(estimate.totalPccCft)} CFT</td>
                <td className="py-2.5 px-3 text-right font-black text-emerald-600">{Math.round(estimate.totalFootingConcreteCft)} CFT</td>
                <td className="py-2.5 px-3 text-right font-black text-indigo-600">{Math.round(estimate.totalColumnConcreteCft * 10) / 10} CFT</td>
                <td className="py-2.5 px-3 text-right font-black">{Math.round(estimate.totalBackfillingCft)} CFT</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FoundationBOQView({ estimate, rates }) {
  const scheduleToRender = estimate.boqSchedule || estimate.foundationSchedule || [];

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Civil Bill of Quantities (BOQ Schedule)</h3>
            <p className="text-xs text-slate-500">Excel 11.BOQ Sheet: Foundation, Plinth Beams, Basement, Superstructure Brickwork, Plastering, Sill & Lintel</p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg">
            {rates.contractorMarginPct}% Contractor Markup Incl.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-4">Item of Work</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Direct Material (₹)</th>
                <th className="py-3 px-3 text-right">Direct Labour (₹)</th>
                <th className="py-3 px-4 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {scheduleToRender.map((row) => (
                <tr key={row.sno} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-center font-bold text-slate-400">{row.sno}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{row.item}</div>
                    <div className="text-[11px] text-slate-400">{row.spec}</div>
                  </td>
                  <td className="py-3 px-3 text-center uppercase font-bold text-slate-500">{row.unit}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white">{row.qty}</td>
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                    {row.materialCost > 0 ? `₹ ${Math.round(row.materialCost).toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                    {row.labourCost > 0 ? `₹ ${Math.round(row.labourCost).toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    ₹ {Math.round(row.totalCost).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
                <td colSpan="6" className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                  Total Direct Civil Cost:
                </td>
                <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white">
                  ₹ {Math.round(estimate.totalDirectCost || estimate.totalDirectFoundationCost).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
                <td colSpan="6" className="py-2 px-4 text-right text-slate-500">
                  Contractor Profit & Material Wastage ({rates.contractorMarginPct}%):
                </td>
                <td className="py-2 px-4 text-right font-bold text-emerald-600">
                  + ₹ {Math.round(estimate.contractorMarkup).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/40 font-extrabold text-sm">
                <td colSpan="6" className="py-3 px-4 text-right text-blue-900 dark:text-blue-200">
                  Grand Total Project Estimate:
                </td>
                <td className="py-3 px-4 text-right text-blue-700 dark:text-blue-400 text-base">
                  ₹ {Math.round(estimate.grandTotalCost || estimate.grandTotalFoundationCost).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FoundationBOMView({ bomSummary }) {
  const totalAmount = bomSummary.reduce((acc, row) => acc + (row.amount || 0), 0);

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Foundation Materials Requisition (BOM)</h3>
            <p className="text-xs text-slate-500">Concrete mix design material requirements for PCC, Footing & Column stubs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-4">Material Name & Specification</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-4 text-right">Computed Quantity</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right">Total Material Cost (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {bomSummary.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.name}
                    {item.subNote && (
                      <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-normal">
                        Equivalent: {item.subNote}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center uppercase font-bold text-slate-500">{item.unit}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white text-sm">
                    {item.qty.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    ₹ {item.rate}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                    ₹ {Math.round(item.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-sm">
                <td colSpan="4" className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                  Total Foundation Raw Materials Cost:
                </td>
                <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  ₹ {Math.round(totalAmount).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * FEATURE 1: Comprehensive Client Quotation & Scope of Work (Excel Sheet 13.Quotaiton)
 */
export function FoundationQuotationView({ estimate, projectInfo, rates }) {
  const handlePrint = () => {
    window.print();
  };

  const margin = Number(rates.contractorMarginPct ?? 0);
  const gfArea = Number(estimate.gfArea ?? 0);
  const totalBuiltup = Number(estimate.totalBuiltupArea ?? 0);

  const totalDirectCost = Number(estimate.totalDirectCost ?? 0);
  const additionalCost = Number(estimate.totalAdditionalCost ?? 0);
  const directCivilCost = Math.max(0, totalDirectCost - additionalCost);
  const markupAmount = directCivilCost * (margin / 100);
  const civilQuotedAmount = directCivilCost + markupAmount;
  const additionalQuotedCost = additionalCost * (1 + margin / 100);
  const grandTotalAmount = civilQuotedAmount + additionalQuotedCost;

  const civilRatePerSqft = gfArea > 0 ? (civilQuotedAmount / gfArea) : 0;
  const overallRatePerSqft = gfArea > 0 ? (grandTotalAmount / gfArea) : 0;

  // Engineering Stage Breakdown (Rollup of BOQ items for clear structural review)
  const boq = estimate.boqSchedule || [];
  const getSubtotal = (indices) => {
    return indices.reduce((sum, idx) => {
      const item = boq[idx];
      return sum + (item ? item.totalCost : 0);
    }, 0);
  };

  const stageBreakdown = [
    {
      trade: 'Substructure & Foundation Works',
      desc: 'Earth excavation, PCC 1:4:8, Isolated Footings (M20), Column Stubs & Backfilling',
      directCost: getSubtotal([0, 1, 2, 3, 4]),
      badge: 'Earthwork & Footings'
    },
    {
      trade: 'Plinth Beams & Basement Masonry',
      desc: 'Trench excavation, RCC Plinth Beams (M20), Flyash brickwork in CM 1:6, 2-side plastering, Gravel filling, 4" M-sand & Flooring PCC',
      directCost: getSubtotal([5, 6, 7, 8, 9, 10, 11]),
      badge: 'Plinth & Basement'
    },
    {
      trade: 'Superstructure Brick Masonry',
      desc: '9" exterior load-bearing/panel walls & 4.5" partition walls in first-class Chamber burnt clay bricks (CM 1:6)',
      directCost: getSubtotal([12]),
      badge: 'Masonry'
    },
    {
      trade: 'Structural RCC Frame, Lintel & Roof Slab',
      desc: 'Sill continuous band (M15), Continuous Lintel beams, Cantilever lofts/sunshades & 5" thick M20 Roof slab with Fe550D TMT',
      directCost: getSubtotal([15, 16, 17, 18]),
      badge: 'RCC Frame'
    },
    {
      trade: 'Plastering & Weathering Course',
      desc: 'Ceiling plaster (CM 1:3), Internal smooth sponge plastering (CM 1:6), External sand-face plastering & Terrace Surkhi weathering course',
      directCost: getSubtotal([13, 14, 20]),
      badge: 'Plastering & Terrace'
    },
    {
      trade: 'Staircase & Architectural Finishes',
      desc: 'Brick steps with waist slab & SS handrail; Vitrified tile flooring, anti-skid toilet tiles, wall dadoing (7ft) & Jet black kitchen granite',
      directCost: getSubtotal([19, 22]),
      badge: 'Finishes'
    },
    {
      trade: 'Doors, Windows & Painting Works',
      desc: 'Teak main entrance door, Sal flush doors, PVC bath doors, UPVC windows; 2-coat Birla putty, primer & Asian Paints emulsion/Apex',
      directCost: getSubtotal([21, 23]),
      badge: 'Joinery & Paint'
    },
    {
      trade: 'Concealed MEP (Electrical & Plumbing)',
      desc: 'ISI Supreme conduits, Finolex cabling, modular switches, AC/UPS wiring; Ashirvad CPVC/UPVC water lines & Parryware sanitary fixtures',
      directCost: getSubtotal([24]),
      badge: 'MEP Services'
    },
  ];

  if (additionalCost > 0) {
    stageBreakdown.push({
      trade: 'External Site Infrastructure',
      desc: 'Underground RCC Sump, Septic Tank, OHT Brick Stand, Compound Wall, Ramp, Setback PCC & Main Gate',
      directCost: additionalCost,
      badge: 'External Infra'
    });
  }

  // Engineering Material Grade Matrix
  const materialGrades = [
    { label: 'Structural Cement', spec: 'OPC / PPC 53 Grade', brand: 'Dalmia / UltraTech' },
    { label: 'Reinforcement Steel', spec: 'Fe550D High Ductility ISI TMT', brand: 'ARS / Tata Tiscon / JSW' },
    { label: 'Concrete Mix Design', spec: 'M20 Grade (1 : 1.5 : 3)', brand: 'Machine Mix + Needle Vibrator' },
    { label: 'Superstructure Masonry', spec: 'First Class Burnt Red Chamber Bricks', brand: '9" Outer & 4.5" Inner (CM 1:6)' },
    { label: 'Basement Masonry', spec: 'High-Density Flyash Bricks in CM 1:6', brand: '3 ft Height + 2-Side Plastering' },
    { label: 'Sand Specifications', spec: 'Zone-II M-Sand (Concrete) & P-Sand (Plaster)', brand: 'Double-Washed Sifted Sand' },
    { label: 'Roof Slab & Ceiling', spec: '5" Depth M20 RCC Slab with 10 ft Ceiling Ht', brand: 'Double Mat Mesh + Cover Blocks' },
    { label: 'Curing Schedule', spec: '14 to 18 Days Ponding (Slab) / 7 Days Wrap (Cols)', brand: 'Potable Curing Water' },
  ];

  // Exclusions (Sheet 13.Quotaiton Row 141 to 156)
  const exclusionsList = [
    'Borewell drilling, submersible pump motor & underground cable trenching',
    'Hard rock blasting / pneumatic breaker charges if rock stratum is met below ground',
    'Architectural 3D elevation renderings, DTCP / Local body plan approval & liaison fees',
    'TNEB power line charges (temporary construction meter & permanent 3-phase meter)',
    'Decorative light fittings, fans, chandeliers, kitchen chimney, water heaters & AC units',
    'Uninterrupted water & electricity supply for construction to be provided at site by Client'
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Engineering Civil Contract Quotation & Technical BOQ
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical structural quotation with trade-wise BOQ breakup, material grade matrix, and milestone payment schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Formal Letterhead Document */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-xl max-w-4xl mx-auto quotation-sheet font-sans print:border-none print:shadow-none print:p-0">
        
        {/* Header with Logo & Professional Credentials */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={rmcLogo}
              alt="RM Construction"
              className="w-14 h-14 object-contain rounded-xl border border-slate-200 p-1 bg-white shadow-sm"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <div className="text-lg font-black uppercase text-slate-950 tracking-tight">
                Rtn. Er. M. JAHIR HUSSAIN, M.E.
              </div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Structural Engineer & Chartered Builder
              </div>
              <div className="text-xs font-black text-slate-800 tracking-wide mt-0.5">
                RM CONSTRUCTION • DESIGN & BUILD
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-600 leading-snug">
            <div className="font-semibold text-slate-800">Building Doctor Complex, L.F Main Road,</div>
            <div>Opp to Ganipriya Mahal, Uthamapalayam - 625533</div>
            <div className="font-bold text-slate-900 mt-0.5">Mobile: +91 9489141122, 9111493336</div>
            <div className="text-blue-700 font-semibold">License: Consulting Structural Engineer</div>
          </div>
        </div>

        {/* Quotation Metadata Strip */}
        <div className="my-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
          <div>
            <span className="text-slate-500 font-medium">Ref No: </span>
            <span className="font-mono font-bold text-blue-700">{projectInfo.projectCode || 'RMC/PRJ-01'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Date: </span>
            <span className="font-bold text-slate-800">{projectInfo.quoteDate || 'Today'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Contract Type: </span>
            <span className="font-bold text-slate-800">Civil Turnkey Contract (Material + Labour)</span>
          </div>
          <div className="text-[11px] text-slate-500 italic">
            * Inclusive of {margin}% Contractor Profit & 2% Wastage
          </div>
        </div>

        {/* Project Technical Reference Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Client / Owner:</span>
            <span className="font-black text-slate-900 text-sm">{projectInfo.clientName || 'Valued Client'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Site Location:</span>
            <span className="font-bold text-slate-800">{projectInfo.siteLocation || 'Site Location'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">GF Plinth Area:</span>
            <span className="font-black text-blue-700 text-sm">{Math.round(gfArea)} Sq.ft</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Total Built-Up Area:</span>
            <span className="font-black text-slate-900 text-sm">{Math.round(totalBuiltup)} Sq.ft</span>
          </div>
        </div>

        {/* Executive Cost Breakdown Strip (Clean Engineer Layout) */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white shadow-sm border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Civil Works (Main Structure)
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                ₹ {Math.round(civilQuotedAmount).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                ₹ {Math.round(civilRatePerSqft).toLocaleString('en-IN')} / sq.ft (GF Plinth)
              </div>
            </div>

            <div className="sm:pl-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Site Infrastructure (External)
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                ₹ {Math.round(additionalQuotedCost).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                UG Sump, Septic Tank, Compound Wall
              </div>
            </div>

            <div className="sm:pl-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Total Quoted Contract Value
              </div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">
                ₹ {Math.round(grandTotalAmount).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                Overall: ₹ {Math.round(overallRatePerSqft).toLocaleString('en-IN')} / sq.ft
              </div>
            </div>
          </div>
        </div>

        {/* 1. TRADE-WISE ENGINEERING COST SUMMARY TABLE */}
        <div className="my-5 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
              1. Trade-Wise Engineering BOQ & Cost Breakdown
            </h4>
            <span className="text-[11px] text-slate-500 font-semibold">Stage-by-Stage Rollup</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Trade & Engineering Scope</th>
                  <th className="py-2.5 px-3 text-right">Direct Cost (₹)</th>
                  <th className="py-2.5 px-3 text-right">Quoted Value ({margin}% Inc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {stageBreakdown.map((stage, idx) => {
                  const stageQuoted = stage.directCost * (1 + margin / 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {stage.trade}
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {stage.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">{stage.desc}</div>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700">
                        ₹ {Math.round(stage.directCost).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">
                        ₹ {Math.round(stageQuoted).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black text-xs text-slate-900 border-t-2 border-slate-300">
                  <td colSpan="2" className="py-2.5 px-3 text-right uppercase tracking-wider">
                    Total Contract Valuation:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    ₹ {Math.round(totalDirectCost).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 text-sm">
                    ₹ {Math.round(grandTotalAmount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 2. STRUCTURAL MATERIAL GRADES & ENGINEERING STANDARDS MATRIX */}
        <div className="my-5 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
              2. Technical Material Specifications & Structural Design Matrix
            </h4>
            <span className="text-[11px] text-emerald-700 font-bold">IS Code Compliant</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {materialGrades.map((mat, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{mat.label}</span>
                  <span className="text-[11px] text-slate-600">{mat.spec}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block">
                    {mat.brand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MILESTONE PAYMENT SCHEDULE TABLE */}
        <div className="my-5 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
              3. Stage-Wise Milestone Payment Schedule
            </h4>
            <span className="text-[11px] text-slate-500 font-semibold">4 Payment Stages</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Stage 1: Advance</span>
              <span className="font-black text-slate-900 block text-sm">10% on Agreement</span>
              <span className="text-[11px] font-mono font-bold text-indigo-700 block mt-0.5">
                ₹ {Math.round(grandTotalAmount * 0.10).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Stage 2: Plinth</span>
              <span className="font-black text-slate-900 block text-sm">20% on Plinth Level</span>
              <span className="text-[11px] font-mono font-bold text-indigo-700 block mt-0.5">
                ₹ {Math.round(grandTotalAmount * 0.20).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Stage 3: Roof Slab</span>
              <span className="font-black text-slate-900 block text-sm">30% on Slab Casting</span>
              <span className="text-[11px] font-mono font-bold text-indigo-700 block mt-0.5">
                ₹ {Math.round(grandTotalAmount * 0.30).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Stage 4: Finishing</span>
              <span className="font-black text-slate-900 block text-sm">40% on Handover</span>
              <span className="text-[11px] font-mono font-bold text-indigo-700 block mt-0.5">
                ₹ {Math.round(grandTotalAmount * 0.40).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* 4. EXCLUSIONS & CLIENT SCOPE */}
        <div className="my-5 p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
          <div className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Standard Exclusions & Client Scope of Supply
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-700 text-[11px]">
            {exclusionsList.map((excl, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{excl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AUTHORIZED SIGNATURES & STAMP */}
        <div className="mt-8 pt-4 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-slate-900 mb-0.5">Client Confirmation:</div>
            <p className="text-[11px] text-slate-500 mb-8">
              Accepted the engineering specifications, BOQ quantities, and payment terms.
            </p>
            <div className="border-t border-dashed border-slate-400 pt-1 w-44 font-semibold text-slate-700">
              Authorized Signature / Date
            </div>
          </div>

          <div className="flex flex-col justify-end items-end text-right">
            <div className="font-black text-slate-950 uppercase text-xs">For RM CONSTRUCTION</div>
            <div className="text-[11px] text-blue-700 font-bold mb-8">Design & Civil Execution Division</div>
            <div className="text-slate-800 font-bold text-center border-t-2 border-slate-800 pt-1.5 w-56">
              Rtn. Er. M. Jahir Hussain, M.E.<br />
              <span className="text-[10px] text-slate-500 font-normal">Consulting Structural Engineer</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
