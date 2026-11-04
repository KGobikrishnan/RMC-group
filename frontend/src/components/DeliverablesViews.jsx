import React from 'react';
import { Printer, ShieldCheck, CheckCircle } from 'lucide-react';

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
  return (
    <div className="space-y-6 text-left">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Foundation Bill of Quantities (BOQ Schedule)</h3>
            <p className="text-xs text-slate-500">Excavation, PCC Bed, Footing Concrete, Column Stubs, and Backfilling</p>
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
              {estimate.foundationSchedule.map((row) => (
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
                  Direct Foundation Cost:
                </td>
                <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white">
                  ₹ {Math.round(estimate.totalDirectFoundationCost).toLocaleString('en-IN')}
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
                  Grand Total Foundation Estimate:
                </td>
                <td className="py-3 px-4 text-right text-blue-700 dark:text-blue-400 text-base">
                  ₹ {Math.round(estimate.grandTotalFoundationCost).toLocaleString('en-IN')}
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

export function FoundationQuotationView({ estimate, projectInfo, rates }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Print-Ready Foundation Quotation</h3>
          <p className="text-xs text-slate-500">Official letterhead for Substructure & Footing Earthwork Contract</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Formal Letterhead */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl max-w-4xl mx-auto quotation-sheet font-sans">
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black uppercase text-slate-900">
            Rtn. Er. M. JAHIR HUSSAIN, M.E., (Structural Engg.)
          </div>
          <div className="text-base font-bold text-blue-700">
            RM CONSTRUCTION & CONSULTANCY
          </div>
          <div className="text-xs text-slate-600">
            Building Doctor Complex, L.F Main Road, Opp to Ganipriya Mahal, Uthamapalayam - 625533
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Mobile: +91 9489141122, 9111493336 | Email: jahir.rmc@gmail.com
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold">Client Name:</span>
            <span className="font-bold text-slate-900">{projectInfo.clientName}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Site Location:</span>
            <span className="font-bold text-slate-900">{projectInfo.siteLocation}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Total Built-Up Area:</span>
            <span className="font-bold text-slate-900">{Math.round(estimate.totalBuiltupArea)} Sq.ft</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Total Columns:</span>
            <span className="font-bold text-slate-900">{estimate.totalColumnsCount} Columns</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Foundation Rate / Sq.ft:</span>
            <span className="font-bold text-blue-700">₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Date of Quote:</span>
            <span className="font-bold text-slate-900">{projectInfo.quoteDate || '04-Nov-2026'}</span>
          </div>
        </div>

        {/* Total Cost Highlight */}
        <div className="mb-6 p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-blue-900">Total Foundation & Footing Quote</div>
            <div className="text-2xl font-black text-blue-950">
              ₹ {Math.round(estimate.grandTotalFoundationCost).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-blue-800">
              Includes Material, Labour, and {rates.contractorMarginPct}% Contractor Markup
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
            Substructure Spec
          </span>
        </div>

        {/* Schedule Table */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Scope of Foundation Works
          </h4>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 font-bold text-slate-700 bg-slate-100">
                  <th className="py-2 px-2 w-10">S.No</th>
                  <th className="py-2 px-3">Description of Work</th>
                  <th className="py-2 px-3 text-center">Unit</th>
                  <th className="py-2 px-3 text-right">Quantity</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {estimate.foundationSchedule.map((row) => (
                  <tr key={row.sno}>
                    <td className="py-2 px-2 font-bold">{row.sno}</td>
                    <td className="py-2 px-3 font-semibold">{row.item}</td>
                    <td className="py-2 px-3 text-center uppercase font-bold text-slate-500">{row.unit}</td>
                    <td className="py-2 px-3 text-right font-bold">{row.qty}</td>
                    <td className="py-2 px-3 text-right font-bold">₹ {Math.round(row.totalCost).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-slate-900 mb-1">Execution Terms:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Excavation depth standard up to 5'-6' to hit hard stratum.</li>
              <li>Dalmia / UltraTech Grade 53 cement and Fe550D TMT bars.</li>
              <li>Water curing for RCC footings done for minimum 7 days.</li>
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
