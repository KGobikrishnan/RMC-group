import React from 'react';
import { X, Sliders, RotateCcw, Check, Percent } from 'lucide-react';

export default function RateMasterModal({ isOpen, onClose, rates, setRates, onResetRates }) {
  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setRates(prev => ({
      ...prev,
      [field]: parseFloat(val) || 0
    }));
  };

  const sections = [
    {
      title: 'Foundation Raw Materials',
      fields: [
        { key: 'cement', label: 'Cement (Dalmia / UltraTech)', unit: '₹ / Bag', step: '5' },
        { key: 'steel', label: 'TMT Steel (ARS Fe550D ISI)', unit: '₹ / Kg', step: '1' },
        { key: 'msand', label: 'M-Sand (Concrete Sand)', unit: '₹ / CFT', step: '1' },
        { key: 'aggregate', label: '20mm Blue Metal Aggregate', unit: '₹ / CFT', step: '1' },
      ]
    },
    {
      title: 'Foundation Work Labour Rates',
      fields: [
        { key: 'labourExcavationPerCft', label: 'Earth Excavation Labour', unit: '₹ / CFT', step: '1' },
        { key: 'labourPccPerCft', label: 'PCC 1:4:8 Bed Concrete Labour', unit: '₹ / CFT', step: '1' },
        { key: 'labourFootingConcretePerCft', label: 'Footing Concrete M20 Labour', unit: '₹ / CFT', step: '1' },
        { key: 'labourColumnStubPerCft', label: 'Column Stub M20 Labour', unit: '₹ / CFT', step: '1' },
        { key: 'labourBackfillingPerCft', label: 'Backfilling & Compaction Labour', unit: '₹ / CFT', step: '1' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Foundation Rates & Markup Master</h3>
              <p className="text-xs text-slate-500">Live prices for Cement, Steel, M-Sand, Aggregates & Labour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Highlight Contractor Margin Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Contractor Margin & Wastage</div>
                <div className="text-xs text-slate-500">Default 12% (10% Profit + 2% Site Wastage)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={rates.contractorMarginPct}
                onChange={(e) => handleChange('contractorMarginPct', e.target.value)}
                className="w-20 px-3 py-1.5 text-center text-base font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">%</span>
            </div>
          </div>

          {/* Grouped Rate Fields */}
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                {sec.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sec.fields.map((fld) => (
                  <div
                    key={fld.key}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fld.label}</div>
                      <div className="text-[11px] font-medium text-slate-400">{fld.unit}</div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        step={fld.step || '1'}
                        value={rates[fld.key] ?? ''}
                        onChange={(e) => handleChange(fld.key, e.target.value)}
                        className="w-24 pl-6 pr-2 py-1.5 text-right text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <button
            onClick={onResetRates}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            Apply Rates
          </button>
        </div>
      </div>
    </div>
  );
}
