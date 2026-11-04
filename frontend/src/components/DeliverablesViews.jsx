import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Printer, 
  Building, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Calendar,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';

export function DashboardView({ estimate, projectInfo, rates }) {
  const kpis = [
    { label: 'Total Estimate', value: `₹ ${Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')}`, sub: `₹ ${Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft`, color: 'from-blue-600 to-indigo-600', text: 'text-white' },
    { label: 'Built-Up Area', value: `${estimate.totalBuiltupArea} sq.ft`, sub: `Ground Floor: ${estimate.gfArea} sq.ft`, color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20', text: 'text-slate-900 dark:text-white', badge: 'Civil Layout' },
    { label: 'Cement Requisition', value: `${Math.round(estimate.totalCementBags)} Bags`, sub: 'Dalmia / UltraTech Grade', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20', text: 'text-slate-900 dark:text-white', badge: 'M20 & Mortar' },
    { label: 'TMT Steel Rebar', value: `${estimate.totalSteelTons.toFixed(2)} Tons`, sub: `${Math.round(estimate.totalSteelKg).toLocaleString('en-IN')} Kg (Fe550D)`, color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', text: 'text-slate-900 dark:text-white', badge: 'Reinforcement' },
    { label: 'Total Bricks', value: `${(Math.round(estimate.totalChamberBricks) + Math.round(estimate.totalFlyashBricks)).toLocaleString('en-IN')} Nos`, sub: `Chamber: ${Math.round(estimate.totalChamberBricks).toLocaleString()} | Flyash: ${Math.round(estimate.totalFlyashBricks).toLocaleString()}`, color: 'from-red-500/10 to-rose-500/10 border-red-500/20', text: 'text-slate-900 dark:text-white', badge: '9" & 4.5" Walls' },
    { label: 'M-Sand / P-Sand', value: `${Math.round(estimate.totalMsandCft + estimate.totalPsandCft).toLocaleString('en-IN')} CFT`, sub: `M-Sand: ${Math.round(estimate.totalMsandCft)} CFT | P-Sand: ${Math.round(estimate.totalPsandCft)} CFT`, color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20', text: 'text-slate-900 dark:text-white', badge: 'CFT to Units' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
              idx === 0 
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-blue-500/10 border-transparent' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${idx === 0 ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {kpi.label}
                </span>
                {kpi.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-extrabold tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {kpi.value}
              </div>
            </div>
            <div className={`text-xs mt-3 pt-2.5 border-t font-medium ${idx === 0 ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'}`}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Cost Breakup Chart & Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Progress Bars */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cost Distribution by Civil Trade</h3>
              <p className="text-xs text-slate-500">Live proportional allocation across construction disciplines</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg">
              {rates.contractorMarginPct}% Markup Incl.
            </span>
          </div>

          <div className="space-y-4">
            {estimate.categoryBreakup.map((cat, idx) => {
              const pct = estimate.overallTotalEstimate > 0 
                ? ((cat.cost / estimate.overallTotalEstimate) * 100) 
                : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-normal">₹ {Math.round(cat.costPerSqft)} / sq.ft</span>
                      <span className="text-slate-900 dark:text-white font-bold">₹ {Math.round(cat.cost).toLocaleString('en-IN')}</span>
                      <span className="text-slate-400 w-12 text-right">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(1, pct)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Key Engineering Parameters */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Contractor Financial Summary
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Main Building Estimate</span>
                <span className="font-bold text-slate-900 dark:text-white">₹ {Math.round(estimate.mainBuildingEstimateWithMarkup).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Main Building Cost / Sq.ft</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">₹ {Math.round(estimate.mainBuildingCostPerSqft).toLocaleString('en-IN')} / sq.ft</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Additional Works (Sump & Septic)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹ {Math.round(estimate.totalAdditionalWithMarkup).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Contractor Profit & Wastage ({rates.contractorMarginPct}%)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹ {Math.round((estimate.overallTotalEstimate * rates.contractorMarginPct) / (100 + rates.contractorMarginPct)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-3 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Overall Quote</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹ {Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">ISO/IS 456 Civil Engineering Standard:</div>
            <div>Dry mix mortar conversion: 1.54 multiplier applied for all wet-to-dry cement calculations. Steel factor: 1.5% of M20 structural volume.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BOQView({ boqSchedule }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(boqSchedule.map(i => i.category))];

  const filteredItems = filter === 'All' 
    ? boqSchedule 
    : boqSchedule.filter(i => i.category === filter);

  const totalBOQAmount = boqSchedule.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="space-y-6 text-left">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold text-slate-500">
          Showing {filteredItems.length} of {boqSchedule.length} Items
        </div>
      </div>

      {/* BOQ Schedule Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">Trade / Category</th>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right">Direct Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-400">{item.sno}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.desc}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 uppercase font-semibold">{item.unit}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(item.qty * 10) / 10}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {item.total > 0 ? (item.total / (item.qty || 1)).toFixed(2) : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {item.total > 0 ? `₹ ${Math.round(item.total).toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-sm">
                <td colSpan="6" className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                  Total Direct Schedule Amount:
                </td>
                <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                  ₹ {Math.round(totalBOQAmount).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function BOMView({ bomSummary, rates }) {
  const totalMaterialCost = bomSummary.reduce((acc, row) => acc + (row.totalAmount || 0), 0);

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Bill of Materials (BOM Requisition Schedule)</h3>
            <p className="text-xs text-slate-500">Procurement quantities based on M20/M15 mix design and mortar ratios</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg">
            Site Procurement Spec
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-4">Material Name & Specification</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-4 text-right">Computed Qty</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right">Material Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {bomSummary.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.name}
                    {item.subNote && (
                      <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-normal">
                        Equivalent: {item.subNote}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500 uppercase font-semibold">{item.unit}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-white text-sm">
                    {item.qty.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    ₹ {item.unitRate}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    ₹ {Math.round(item.totalAmount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-sm">
                <td colSpan="4" className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                  Total Bill of Materials Procurement Budget:
                </td>
                <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  ₹ {Math.round(totalMaterialCost).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CostBreakupView({ estimate, rates }) {
  const profitMargin = rates.contractorMarginPct || 12;

  const scenarios = [
    { label: 'Standard Enterprise (12% Markup)', margin: 12, multiplier: 1.12 },
    { label: 'Competitive Bidding (10% Markup)', margin: 10, multiplier: 1.10 },
    { label: 'Budget Commercial (8% Markup)', margin: 8, multiplier: 1.08 },
    { label: 'Direct Cost Only (Zero Margin)', margin: 0, multiplier: 1.00 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Category Breakup Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Trade Category & Cost-Per-Sq.ft Analysis</h3>
            <p className="text-xs text-slate-500">Built-Up Area Reference: {estimate.totalBuiltupArea} Sq.ft</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-4">Trade Category</th>
                <th className="py-3 px-4 text-right">Net Amount (₹)</th>
                <th className="py-3 px-4 text-right">Cost / Sq.ft (₹)</th>
                <th className="py-3 px-4 text-right">Share of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {estimate.categoryBreakup.map((cat, idx) => {
                const share = estimate.overallTotalEstimate > 0 
                  ? ((cat.cost / estimate.overallTotalEstimate) * 100).toFixed(1)
                  : '0.0';
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹ {Math.round(cat.cost).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">
                      ₹ {Math.round(cat.costPerSqft).toLocaleString('en-IN')} / sq.ft
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-bold">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-sm">
                <td className="py-3.5 px-4 text-slate-900 dark:text-white">
                  Grand Overall Estimate
                </td>
                <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  ₹ {Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 text-base">
                  ₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft
                </td>
                <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Margin Sensitivity Matrix */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Contractor Margin Sensitivity Scenarios
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {scenarios.map((sc, idx) => {
            const direct = estimate.overallTotalEstimate / (1 + profitMargin / 100);
            const scenarioCost = direct * (1 + sc.margin / 100);
            const scenarioRate = scenarioCost / (estimate.totalBuiltupArea || 1);
            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">{sc.label}</div>
                <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  ₹ {Math.round(scenarioCost).toLocaleString('en-IN')}
                </div>
                <div className="text-slate-500 font-semibold">
                  ₹ {Math.round(scenarioRate)} / sq.ft
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function QuotationView({ estimate, projectInfo, rates }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Print-Ready Official Client Quotation</h3>
          <p className="text-xs text-slate-500">Formal contractor letterhead format conforming to Er. M. Jahir Hussain / RM Construction standard</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Formal Letterhead Document Paper */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl max-w-4xl mx-auto quotation-sheet font-sans">
        {/* Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1.5">
          <div className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900">
            Rtn. Er. M. JAHIR HUSSAIN, M.E., (Structural Engg.)
          </div>
          <div className="text-base sm:text-lg font-bold text-blue-700 tracking-wider">
            RM CONSTRUCTION & CONSULTANCY
          </div>
          <div className="text-xs text-slate-600">
            Building Doctor Complex, L.F Main Road, Opp to Ganipriya Mahal, Uthamapalayam - 625533
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Mobile: +91 9489141122, 9111493336 | Email: jahir.rmc@gmail.com
          </div>
        </div>

        {/* Client Meta Bar */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold">Client Name:</span>
            <span className="font-bold text-slate-900 text-sm">{projectInfo.clientName}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Site Location:</span>
            <span className="font-bold text-slate-900">{projectInfo.siteLocation}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Date of Quote:</span>
            <span className="font-bold text-slate-900">{projectInfo.quoteDate || '04-Nov-2026'}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Built-Up Area:</span>
            <span className="font-bold text-slate-900 text-sm">{estimate.totalBuiltupArea} Sq.ft</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Ground Floor Area:</span>
            <span className="font-bold text-slate-900">{estimate.gfArea} Sq.ft</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Quotation Rate:</span>
            <span className="font-bold text-blue-700 text-sm">₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft</span>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="mb-6 p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase text-blue-900">Total Quoted Construction Budget</div>
            <div className="text-2xl font-black text-blue-950">
              ₹ {Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-blue-800 mt-0.5">
              Rupees {Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')} Only
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
              Framed RCC Structure Spec
            </span>
          </div>
        </div>

        {/* Technical Work Specifications from Sheet */}
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Scope of Construction Specifications
          </h4>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 font-bold text-slate-700 bg-slate-100">
                  <th className="py-2 px-2.5 w-10">S.No</th>
                  <th className="py-2 px-3 w-40">Nature of Work</th>
                  <th className="py-2 px-3">Description & Engineering Specification</th>
                  <th className="py-2 px-3 text-right">Standard Rate Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-2 px-2.5 font-bold">1</td>
                  <td className="py-2 px-3 font-semibold">Type of Structure</td>
                  <td className="py-2 px-3">Framed RCC Structure as per structural engineering design & soil test</td>
                  <td className="py-2 px-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">2</td>
                  <td className="py-2 px-3 font-semibold">Foundation</td>
                  <td className="py-2 px-3">Upto 5 ft depth to maximum hard stratum. Excavation, M-Sand 2" layer, PCC 1:4:8 & backfill included</td>
                  <td className="py-2 px-3 text-right">IS 456</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">3</td>
                  <td className="py-2 px-3 font-semibold">Plinth Beam</td>
                  <td className="py-2 px-3">Bottom prepared with one layer flyash brick. M20 concrete beam as per structural design</td>
                  <td className="py-2 px-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">4</td>
                  <td className="py-2 px-3 font-semibold">Basement</td>
                  <td className="py-2 px-3">Raised 3' height from existing ground level. Flyash brick masonry 1:6, internal & external plastering, gravel filling & 4" M-sand layer with anti-termite treatment</td>
                  <td className="py-2 px-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">5</td>
                  <td className="py-2 px-3 font-semibold">Cement & Concrete</td>
                  <td className="py-2 px-3">Dalmia / UltraTech Grade 53/43 cement. M20 nominal concrete mix</td>
                  <td className="py-2 px-3 text-right font-medium">₹ {rates.cement}/bag</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">6</td>
                  <td className="py-2 px-3 font-semibold">Steel Reinforcement</td>
                  <td className="py-2 px-3">ARS Fe550D ISI certified TMT bars used for columns, beams, footings & roof slab</td>
                  <td className="py-2 px-3 text-right font-medium">₹ {rates.steel}/kg</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">7</td>
                  <td className="py-2 px-3 font-semibold">Superstructure Brickwork</td>
                  <td className="py-2 px-3">Red chamber bricks (9" outer walls & 4.5" partition walls) in 1:6 cement mortar</td>
                  <td className="py-2 px-3 text-right font-medium">₹ {rates.brickChamber}/pc</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">8</td>
                  <td className="py-2 px-3 font-semibold">Sill & Lintel Beams</td>
                  <td className="py-2 px-3">2" sill concrete with 2 nos 8mm bars. 9"x6" lintel beam with 10mm TMT bars throughout building length</td>
                  <td className="py-2 px-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">9</td>
                  <td className="py-2 px-3 font-semibold">Roof Slab & Height</td>
                  <td className="py-2 px-3">Clear 10' ceiling height. 5" thickness RCC roof slab with centering sheets and pond curing for 14-18 days</td>
                  <td className="py-2 px-3 text-right">Min 5" Thk</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">10</td>
                  <td className="py-2 px-3 font-semibold">Joinery & Windows</td>
                  <td className="py-2 px-3">Teak frame & shutter for main door. Sal wood frame with flush doors for rooms. PVC for bathrooms. UPVC sliding windows with 12mm MS safety grills</td>
                  <td className="py-2 px-3 text-right">Teak / UPVC</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">11</td>
                  <td className="py-2 px-3 font-semibold">Tiles & Flooring</td>
                  <td className="py-2 px-3">2x2 Vitrified tile flooring, 4" skirting, jet black granite kitchen countertop, 7ft bathroom glazed wall dadoing & granite steps</td>
                  <td className="py-2 px-3 text-right">₹ 60/sq.ft bench</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">12</td>
                  <td className="py-2 px-3 font-semibold">Painting Works</td>
                  <td className="py-2 px-3">Interior: 1 coat white cement + 1 coat primer + 2 coat Asian Apex emulsion. Exterior: 2 coat putty + 1 primer + 2 Premium emulsion</td>
                  <td className="py-2 px-3 text-right">Asian Paints</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-bold">13</td>
                  <td className="py-2 px-3 font-semibold">Electrical & Plumbing</td>
                  <td className="py-2 px-3">Finolex/Efab wires, Supreme ISI conduits, Legrand/GM modular switches, Ashirvad UPVC/CPVC, Parryware sanitaryware & Kerovit CP fittings</td>
                  <td className="py-2 px-3 text-right">Branded ISI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms & Signatures */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-slate-900 mb-1">Terms & Conditions:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Stage payment schedule as per agreement milestone completion.</li>
              <li>Water and electricity for construction provided by the client.</li>
              <li>Soil condition variations beyond 5ft depth charged on actuals.</li>
              <li>Any elevation architectural details outside standard quoted separately.</li>
            </ul>
          </div>
          <div className="flex flex-col justify-end items-end space-y-8 text-right">
            <div className="font-bold text-slate-900">For RM CONSTRUCTION</div>
            <div className="text-slate-500 font-semibold text-center border-t border-slate-400 pt-1 w-48">
              Er. M. Jahir Hussain<br />
              <span className="text-[10px]">Managing Partner / Structural Er</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

