import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  Printer, 
  FileText, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Box, 
  Hammer, 
  Grid, 
  Sliders, 
  ChevronRight,
  Download,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { calculateCivilEstimateComplete } from '../utils/calculator';
import { DEFAULT_RATES } from '../data/initialData';

export function ProjectDetailView({ project, onBack, onOpenQuotation }) {
  if (!project) return null;

  const estimateData = project.estimate_data || project.estimateData || {};
  const rates = project.schedule_rates || project.scheduleRates || DEFAULT_RATES;
  
  // Recalculate using audited engine to ensure 100% precision
  const estimate = calculateCivilEstimateComplete(estimateData, rates);

  const [activeTab, setActiveTab] = useState('summary');

  const clientName = project.client_name || estimateData.builtup?.clientName || 'Valued Client';
  const siteAddress = project.site_address || estimateData.builtup?.siteLocation || 'Site Location';
  const projectCode = project.project_code || 'RMC-EST';
  const projectTitle = project.title || 'Civil Estimate Project';
  const totalCost = Number(project.total_cost) || estimate.grandTotalCost || 0;
  const builtupSqft = Number(project.total_builtup_sqft) || estimate.totalBuiltupArea || 0;
  const gfArea = Number(project.gf_plinth_sqft) || estimate.gfArea || 0;
  const ratePerSqft = builtupSqft > 0 ? (totalCost / builtupSqft) : 0;

  // Breakdown modules for quick tabs
  const modulesSummary = [
    { id: 'sec1', num: '1', title: 'Built-up Area', val: `${Math.round(builtupSqft)} Sq.ft`, sub: `GF: ${Math.round(gfArea)} Sq.ft` },
    { id: 'sec2', num: '2', title: 'Footing & Columns', val: `${(estimate.totalFootingConcreteCft || 0).toFixed(1)} CFT`, sub: `${(estimate.footingRebarKg || 0).toFixed(1)} kg Steel` },
    { id: 'sec3', num: '3', title: 'Plinth Beams', val: `${(estimate.totalPlinthConcreteCft || 0).toFixed(1)} CFT`, sub: `${(estimate.plinthRebarKg || 0).toFixed(1)} kg Steel` },
    { id: 'sec4', num: '4', title: 'Basement Flyash', val: `${(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} Nos`, sub: `Cost: ₹ ${Math.round(estimate.basementTotalCost || 0).toLocaleString('en-IN')}` },
    { id: 'sec5', num: '5', title: 'Superstructure Bricks', val: `${(estimate.brickwork?.chamberBricksNos || 0).toLocaleString('en-IN')} Nos`, sub: `Cost: ₹ ${Math.round(estimate.brickwork?.totalCost || 0).toLocaleString('en-IN')}` },
    { id: 'sec6', num: '6', title: 'Plastering Work', val: `${(estimate.plastering?.totalPlasteringSqft || 0).toFixed(1)} Sq.ft`, sub: `Cost: ₹ ${Math.round(estimate.plastering?.totalCost || 0).toLocaleString('en-IN')}` },
    { id: 'sec7', num: '7', title: 'Sill & Lintel RCC', val: `${(estimate.sillAndLintel?.totalRebarKg || 0).toFixed(1)} kg Rebar`, sub: `Cost: ₹ ${Math.round(estimate.sillAndLintel?.totalCost || 0).toLocaleString('en-IN')}` },
    { id: 'sec8', num: '8', title: 'Tiles & Granite', val: `₹ ${Math.round(estimate.tiles?.totalCost || 0).toLocaleString('en-IN')}`, sub: 'Flooring, Kitchen, Bath' },
    { id: 'sec11', num: '11', title: 'Roof Slab & Beams', val: `₹ ${Math.round(estimate.roofSlab?.totalCost || 0).toLocaleString('en-IN')}`, sub: 'M20 Concrete & Steel' },
    { id: 'sec12', num: '12', title: 'Painting Work', val: `₹ ${Math.round(estimate.painting?.totalCost || 0).toLocaleString('en-IN')}`, sub: 'Inner, Outer & Ceiling' },
    { id: 'sec14', num: '14', title: 'Electrical & Plumbing', val: `₹ ${Math.round(estimate.others?.electricalPlumbingCost || 0).toLocaleString('en-IN')}`, sub: `Rate ₹200/Sq.ft` },
    { id: 'sec15', num: '15', title: 'Site Infrastructure', val: `₹ ${Math.round(estimate.totalAdditionalCost || 0).toLocaleString('en-IN')}`, sub: 'Sump, Tank, Compound' }
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            title="Back to Project Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                {projectCode}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {project.status || 'Active Estimate'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {projectTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenQuotation && (
            <button
              onClick={() => onOpenQuotation(project)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Open Formal Quotation</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Hero Project Meta Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Client & Site */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Client & Site</span>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">{clientName}</div>
              <div className="text-[11px] text-slate-400">{project.client_phone || 'Contact on file'}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{siteAddress}</span>
          </div>
        </div>

        {/* Built-Up Area & Structural Specs */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Built-Up Area</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {Math.round(builtupSqft).toLocaleString('en-IN')} <span className="text-sm font-semibold">Sq.ft</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Ground Floor:</span>
            <b className="text-slate-800 dark:text-slate-200">{Math.round(gfArea)} Sq.ft</b>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Structure:</span>
            <b className="text-slate-800 dark:text-slate-200">{project.floors || 'G + 1 Floors'}</b>
          </div>
        </div>

        {/* Steel & Concrete Materials */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Structural Materials</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {(estimate.totalSteelTons || 0).toFixed(2)} <span className="text-sm font-semibold">MT Steel</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Chamber Bricks:</span>
            <b className="text-slate-800 dark:text-slate-200">{(estimate.brickwork?.chamberBricksNos || 0).toLocaleString('en-IN')} Nos</b>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Flyash Bricks:</span>
            <b className="text-slate-800 dark:text-slate-200">{(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} Nos</b>
          </div>
        </div>

        {/* Total Cost & Rate/Sq.ft */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 space-y-2">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Total Estimated Cost</span>
          <div className="text-2xl font-black text-emerald-400">
            ₹ {Math.round(totalCost).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-indigo-200/80 flex items-center justify-between pt-2 border-t border-white/10">
            <span>Estimated Rate:</span>
            <b className="text-white font-mono font-bold">₹ {Math.round(ratePerSqft).toLocaleString('en-IN')} / sq.ft</b>
          </div>
          <div className="text-xs text-indigo-200/80 flex items-center justify-between">
            <span>Profit Margin:</span>
            <b className="text-amber-300">{rates.contractorMarginPct || 10}% Included</b>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs for the Detailed Single Page */}
      <div className="p-2 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl flex items-center gap-1 overflow-x-auto text-xs font-bold no-print">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'summary'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          15 Modules Breakdown
        </button>
        <button
          onClick={() => setActiveTab('boq')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'boq'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Civil BOQ Items ({estimate.boqSchedule?.length || 18})
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'bom'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Foundation Materials (BOM)
        </button>
      </div>

      {/* TAB CONTENT 1: Complete 15 Modules Breakdown Grid */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {modulesSummary.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Module #{m.num}</span>
                  <span className="p-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-mono font-bold">
                    Active
                  </span>
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {m.title}
                </div>
                <div className="text-base font-black text-blue-600 dark:text-blue-400">
                  {m.val}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Input Dimensions & Schedules */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Detailed Input Schedule & Computed Take-Off
            </h3>

            {/* 1. Floor Dimensions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Floor Built-up Dimensions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {(estimateData.builtup?.floors || []).map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white">{f.name}</div>
                    <div className="text-slate-500 mt-1">
                      {f.length} ft × {f.breadth} ft = <b className="text-blue-600 dark:text-blue-400">{Math.round((f.length || 0) * (f.breadth || 0))} Sq.ft</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Substructure Summary Table */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                2. Substructure Concrete & Brickwork Dimensions
              </h4>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="py-2 px-3">Structural Element</th>
                      <th className="py-2 px-3">Specification / Formula</th>
                      <th className="py-2 px-3 text-right">Computed Quantity</th>
                      <th className="py-2 px-3 text-right">Steel Rebar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Bed PCC (1:4:8)</td>
                      <td className="py-2 px-3 text-slate-500">Below Footings & Column bases</td>
                      <td className="py-2 px-3 text-right">{(estimate.totalPccVolumeCft || 0).toFixed(2)} CFT</td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Footing Concrete (M20)</td>
                      <td className="py-2 px-3 text-slate-500">Trapezoidal & Box Footings</td>
                      <td className="py-2 px-3 text-right text-indigo-600 dark:text-indigo-400 font-bold">
                        {(estimate.totalFootingConcreteCft || 0).toFixed(2)} CFT
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {(estimate.footingRebarKg || 0).toFixed(2)} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Column Stubs (M20)</td>
                      <td className="py-2 px-3 text-slate-500">Up to Plinth level</td>
                      <td className="py-2 px-3 text-right">{(estimate.columnConcreteCft || 0).toFixed(2)} CFT</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {(estimate.columnRebarKg || 0).toFixed(2)} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Plinth Beam (M20)</td>
                      <td className="py-2 px-3 text-slate-500">Continuous ring beam</td>
                      <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                        {(estimate.totalPlinthConcreteCft || 0).toFixed(2)} CFT
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {(estimate.plinthRebarKg || 0).toFixed(2)} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Basement Flyash Brickwork</td>
                      <td className="py-2 px-3 text-slate-500">CM 1:6 (Outer & Inner basement)</td>
                      <td className="py-2 px-3 text-right text-purple-600 dark:text-purple-400 font-bold">
                        {(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} Nos
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">Superstructure Brickwork</td>
                      <td className="py-2 px-3 text-slate-500">Red Chamber Bricks 9" & 4.5"</td>
                      <td className="py-2 px-3 text-right text-rose-600 dark:text-rose-400 font-bold">
                        {(estimate.brickwork?.chamberBricksNos || 0).toLocaleString('en-IN')} Nos
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Civil BOQ Table */}
      {activeTab === 'boq' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Itemized Bill of Quantities (BOQ)
              </h3>
              <p className="text-xs text-slate-500">
                Audited item schedule matching 03-11-2026_BRICK_ESTIMATE.xlsm
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-3">Item #</th>
                  <th className="py-3 px-3">Description of Work</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {(estimate.boqSchedule || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{item.itemNo || idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{item.desc}</td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      ₹ {typeof item.rate === 'number' ? item.rate.toLocaleString('en-IN') : item.rate}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-blue-600 dark:text-blue-400">
                      ₹ {Math.round(item.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold">
                  <td colSpan="5" className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    Grand BOQ Total:
                  </td>
                  <td className="py-3 px-3 text-right text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹ {Math.round(totalCost).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Foundation Materials Requisition (BOM) */}
      {activeTab === 'bom' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Materials Bill of Materials (BOM)
              </h3>
              <p className="text-xs text-slate-500">
                Cement, M-Sand, P-Sand, 20mm Blue Metal, and Rebar steel takeoff
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-3">Material Name & Specification</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Computed Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Total Material Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {(estimate.bomSummary || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {item.name}
                      {item.subNote && <span className="block text-[11px] font-normal text-blue-500">{item.subNote}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      ₹ {item.rate}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-indigo-600 dark:text-indigo-400">
                      ₹ {Math.round(item.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

