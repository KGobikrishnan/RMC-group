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
      title: 'Materials',
      fields: [
        { key: 'cement', label: 'Cement', unit: '₹ / Bag' },
        { key: 'steel', label: 'TMT Steel', unit: '₹ / Kg' },
        { key: 'msand', label: 'M-Sand', unit: '₹ / CFT' },
        { key: 'psand', label: 'P-Sand', unit: '₹ / CFT' },
        { key: 'aggregate', label: 'Aggregate', unit: '₹ / CFT' },
        { key: 'gravel', label: 'Gravel', unit: '₹ / CFT' },
        { key: 'brickFlyash', label: 'Flyash Brick', unit: '₹ / Piece' },
        { key: 'brickChamber', label: 'Chamber Brick', unit: '₹ / Piece' },
      ]
    },
    {
      title: 'Structure & Masonry Labour',
      fields: [
        { key: 'labourExcavationPerCft', label: 'Earth Excavation', unit: '₹ / CFT' },
        { key: 'labourPccPerCft', label: 'Foundation PCC', unit: '₹ / CFT' },
        { key: 'labourFootingConcretePerCft', label: 'Footing Concrete', unit: '₹ / CFT' },
        { key: 'labourColumnStubPerCft', label: 'Column Concrete', unit: '₹ / CFT' },
        { key: 'labourBackfillingPerCft', label: 'Backfilling', unit: '₹ / CFT' },
        { key: 'labourPlinthExcavationPerCft', label: 'Plinth Excavation', unit: '₹ / CFT' },
        { key: 'labourPlinthConcretePerCft', label: 'Plinth Concrete', unit: '₹ / CFT' },
        { key: 'labourBasementBrickworkPerCft', label: 'Basement Brickwork', unit: '₹ / CFT' },
        { key: 'labourBasementPlasterPerSqft', label: 'Basement Plaster', unit: '₹ / Sq.ft' },
        { key: 'labourBasementGravelPerCft', label: 'Gravel Filling', unit: '₹ / CFT' },
        { key: 'labourFlooringPccPerSqft', label: 'Flooring PCC', unit: '₹ / Sq.ft' },
        { key: 'labourChamberBrickworkPerCft', label: 'Chamber Brickwork', unit: '₹ / CFT' },
        { key: 'labourCeilingPlasterPerSqft', label: 'Ceiling Plaster', unit: '₹ / Sq.ft' },
        { key: 'labourInnerPlasterPerSqft', label: 'Inner Plaster', unit: '₹ / Sq.ft' },
        { key: 'labourOuterPlasterPerSqft', label: 'Outer Plaster', unit: '₹ / Sq.ft' },
        { key: 'labourSillBeamPerRft', label: 'Sill Beam', unit: '₹ / RFT' },
        { key: 'labourLintelBeamPerRft', label: 'Lintel Beam', unit: '₹ / RFT' },
        { key: 'labourLoftsSunshadesPerCft', label: 'Lofts & Sunshades', unit: '₹ / CFT' },
      ]
    },
    {
      title: 'Tiles & Granite',
      fields: [
        { key: 'rateFlooringTile', label: 'Flooring Tile', unit: '₹ / Sq.ft' },
        { key: 'rateBathroomFloorTile', label: 'Bathroom Floor Tile', unit: '₹ / Sq.ft' },
        { key: 'rateParkingTile', label: 'Parking Tile', unit: '₹ / Sq.ft' },
        { key: 'rateKitchenWallTile', label: 'Kitchen Wall Tile', unit: '₹ / Sq.ft' },
        { key: 'rateBathroomWallTile', label: 'Bathroom Wall Tile', unit: '₹ / Sq.ft' },
        { key: 'rateSkirtingTile', label: 'Skirting Tile', unit: '₹ / Sq.ft' },
        { key: 'rateCountertopGranite', label: 'Countertop Granite', unit: '₹ / Sq.ft' },
        { key: 'rateStaircaseGranite', label: 'Staircase Granite', unit: '₹ / Sq.ft' },
        { key: 'rateTilePasteAraldite', label: 'Tile Adhesive', unit: '₹ / Sq.ft' },
        { key: 'tileFlooringLabour', label: 'Floor Tile Labour', unit: '₹ / Sq.ft' },
        { key: 'tileBathroomFloorLabour', label: 'Bathroom Floor Labour', unit: '₹ / Sq.ft' },
        { key: 'tileParkingLabour', label: 'Parking Tile Labour', unit: '₹ / Sq.ft' },
        { key: 'tileKitchenWallLabour', label: 'Kitchen Wall Tile Labour', unit: '₹ / Sq.ft' },
        { key: 'tileBathroomWallLabour', label: 'Bathroom Wall Tile Labour', unit: '₹ / Sq.ft' },
        { key: 'tileSkirtingLabour', label: 'Skirting Labour', unit: '₹ / Sq.ft' },
        { key: 'graniteCountertopLabour', label: 'Granite Countertop Labour', unit: '₹ / Sq.ft' },
      ]
    },
    {
      title: 'Roof, Painting & Services',
      fields: [
        { key: 'rateRoofBeamConcretePerCft', label: 'Roof Beam Concrete', unit: '₹ / CFT' },
        { key: 'rateRoofSlabConcretePerCft', label: 'Roof Slab Concrete', unit: '₹ / CFT' },
        { key: 'rateStaircaseConcrete', label: 'Staircase Concrete', unit: '₹ / CFT' },
        { key: 'rateInnerWallPainting', label: 'Inner Wall Paint', unit: '₹ / Sq.ft' },
        { key: 'rateOuterWallPainting', label: 'Outer Wall Paint', unit: '₹ / Sq.ft' },
        { key: 'rateCeilingPainting', label: 'Ceiling Paint', unit: '₹ / Sq.ft' },
        { key: 'rateStaircaseBrickSteps', label: 'Staircase Masonry', unit: '₹ / CFT' },
        { key: 'rateStaircaseHandrail', label: 'Handrail', unit: '₹ / RFT' },
        { key: 'rateElectricalPlumbing', label: 'Electrical & Plumbing', unit: '₹ / Sq.ft' },
        { key: 'rateTerraceBrickbatPerCft', label: 'Terrace Brickbat', unit: '₹ / CFT' },
        { key: 'rateTerraceLimePerBag', label: 'Terrace Lime', unit: '₹ / Bag' },
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
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Rate & Markup Master</h3>
              <p className="text-xs text-slate-500">Edit material, labour and trade rates used by every estimate</p>
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
