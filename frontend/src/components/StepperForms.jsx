import React from 'react';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  Trash2, 
  Info, 
  Maximize2, 
  Compass, 
  Box,
  CheckCircle2
} from 'lucide-react';

/**
 * MODULE 1: Total Built-Up Area
 */
export function TotalAreaModule({ builtup, updateBuiltup }) {
  const handleFloorChange = (idx, field, val) => {
    const newFloors = [...builtup.floors];
    newFloors[idx] = { ...newFloors[idx], [field]: parseFloat(val) || 0 };
    newFloors[idx].area = (newFloors[idx].length || 0) * (newFloors[idx].breadth || 0);
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateBuiltup({
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea,
    });
  };

  const addFloor = () => {
    const nextNum = builtup.floors.length + 1;
    const newFloors = [
      ...builtup.floors,
      { id: String(Date.now()), name: `Floor ${nextNum}`, length: 20, breadth: 30, area: 600 }
    ];
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateBuiltup({
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea
    });
  };

  const removeFloor = (idx) => {
    if (builtup.floors.length <= 1) return;
    const newFloors = builtup.floors.filter((_, i) => i !== idx);
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateBuiltup({
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea
    });
  };

  const totalArea = builtup.floors.reduce((acc, f) => acc + ((f.length || 0) * (f.breadth || 0)), 0);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Total Built-Up Area (AutoCAD Outer-to-Outer)</h3>
            <p className="text-xs text-slate-500">Floor-wise outer length and breadth measurements</p>
          </div>
        </div>
        <button
          onClick={addFloor}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Floor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
              <th className="py-2.5 px-3">Floor Level</th>
              <th className="py-2.5 px-3">Outer Length (ft)</th>
              <th className="py-2.5 px-3">Outer Breadth (ft)</th>
              <th className="py-2.5 px-3 text-right">Floor Area (Sq.ft)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {builtup.floors.map((floor, idx) => {
              const floorArea = (floor.length || 0) * (floor.breadth || 0);
              return (
                <tr key={floor.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={floor.name}
                      onChange={(e) => {
                        const newFloors = [...builtup.floors];
                        newFloors[idx].name = e.target.value;
                        updateBuiltup({ ...builtup, floors: newFloors });
                      }}
                      className="w-36 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={floor.length}
                      onChange={(e) => handleFloorChange(idx, 'length', e.target.value)}
                      className="w-28 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={floor.breadth}
                      onChange={(e) => handleFloorChange(idx, 'breadth', e.target.value)}
                      className="w-28 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    {Math.round(floorArea)} sq.ft
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeFloor(idx)}
                      disabled={builtup.floors.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Ground floor outer area is used as reference for plinth backfilling.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Built-Up Area:</span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
            {Math.round(totalArea)} Sq.ft
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 2: Footing & Column Schedule
 */
export function FootingModule({ footings, updateFootings }) {
  const handleFootingChange = (idx, field, val) => {
    const newFootings = [...footings];
    newFootings[idx] = { 
      ...newFootings[idx], 
      [field]: field === 'id' || field === 'colId' ? val : (parseFloat(val) || 0) 
    };
    updateFootings(newFootings);
  };

  const addFootingRow = () => {
    const num = footings.length + 1;
    const newRow = {
      id: `f${num}`,
      colId: `c${num}`,
      nos: 2,
      colL: 0.75,
      colB: 1.25,
      colD: 5.0,
      footingL: 4.5,
      footingB: 4.5,
      footingD: 1.5,
      depth: 5.0,
      pccDepth: 0.5
    };
    updateFootings([...footings, newRow]);
  };

  const removeFootingRow = (idx) => {
    if (footings.length <= 1) return;
    updateFootings(footings.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Footing & Column Schedule</h3>
            <p className="text-xs text-slate-500">Nos, Column size (L x B x D), Footing size (L x B x D), Excavation Depth & PCC Bed</p>
          </div>
        </div>
        <button
          onClick={addFootingRow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Footing Group
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
              <th className="py-2.5 px-2">Footing Type</th>
              <th className="py-2.5 px-2">Col Type</th>
              <th className="py-2.5 px-2">Nos</th>
              <th className="py-2.5 px-2">Col L (ft)</th>
              <th className="py-2.5 px-2">Col B (ft)</th>
              <th className="py-2.5 px-2">Col D (ft)</th>
              <th className="py-2.5 px-2">Footing L</th>
              <th className="py-2.5 px-2">Footing B</th>
              <th className="py-2.5 px-2">Footing D</th>
              <th className="py-2.5 px-2">Excv Depth</th>
              <th className="py-2.5 px-2">PCC D</th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {footings.map((f, idx) => (
              <tr key={f.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={f.id}
                    onChange={(e) => handleFootingChange(idx, 'id', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-blue-600"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={f.colId}
                    onChange={(e) => handleFootingChange(idx, 'colId', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={f.nos}
                    onChange={(e) => handleFootingChange(idx, 'nos', e.target.value)}
                    className="w-12 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.05"
                    value={f.colL}
                    onChange={(e) => handleFootingChange(idx, 'colL', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.05"
                    value={f.colB}
                    onChange={(e) => handleFootingChange(idx, 'colB', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.5"
                    value={f.colD}
                    onChange={(e) => handleFootingChange(idx, 'colD', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.5"
                    value={f.footingL}
                    onChange={(e) => handleFootingChange(idx, 'footingL', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.5"
                    value={f.footingB}
                    onChange={(e) => handleFootingChange(idx, 'footingB', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.25"
                    value={f.footingD}
                    onChange={(e) => handleFootingChange(idx, 'footingD', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.5"
                    value={f.depth}
                    onChange={(e) => handleFootingChange(idx, 'depth', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-amber-600 dark:text-amber-400"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.25"
                    value={f.pccDepth}
                    onChange={(e) => handleFootingChange(idx, 'pccDepth', e.target.value)}
                    className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <button
                    onClick={() => removeFootingRow(idx)}
                    disabled={footings.length <= 1}
                    className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * MODULE 3: Plinth Beam Calculation (Audited from Excel Row 29-35 & Sheet 1.FOUNDATION)
 */
export function PlinthBeamModule({ plinthBeam, updatePlinthBeam, estimate }) {
  const handleChange = (field, val) => {
    updatePlinthBeam({
      ...plinthBeam,
      [field]: parseFloat(val) || 0
    });
  };

  const excVol = (plinthBeam.length || 0) * (plinthBeam.excavationB || 0) * (plinthBeam.excavationD || 0);
  const concVol = (plinthBeam.length || 0) * (plinthBeam.concreteB || 0) * (plinthBeam.concreteD || 0);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Plinth Beam Calculation</h3>
            <p className="text-xs text-slate-500">Excavation trench & Concrete M20 (4kg/cft steel reinforcement)</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg">
          M20 Nominal Mix Design
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trench Excavation */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Plinth Beam Excavation</span>
            <span className="text-xs font-bold text-amber-600">{Math.round(excVol * 10) / 10} CFT</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Beam Length (ft)</label>
              <input
                type="number"
                value={plinthBeam.length}
                onChange={(e) => handleChange('length', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Trench Breadth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={plinthBeam.excavationB}
                onChange={(e) => handleChange('excavationB', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Trench Depth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={plinthBeam.excavationD}
                onChange={(e) => handleChange('excavationD', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Formula: Length × Trench B × Trench D = {plinthBeam.length}' × {plinthBeam.excavationB}' × {plinthBeam.excavationD}'
          </div>
        </div>

        {/* Concrete Beam */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Plinth Beam Concrete (M20)</span>
            <span className="text-xs font-bold text-emerald-600">{Math.round(concVol * 10) / 10} CFT</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Beam Length (ft)</label>
              <input
                type="number"
                disabled
                value={plinthBeam.length}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-bold text-slate-500"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Beam Breadth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={plinthBeam.concreteB}
                onChange={(e) => handleChange('concreteB', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Beam Depth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={plinthBeam.concreteD}
                onChange={(e) => handleChange('concreteD', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Formula: Length × Beam B × Beam D = {plinthBeam.length}' × {plinthBeam.concreteB}' × {plinthBeam.concreteD}'
          </div>
        </div>
      </div>

      {/* Output Summary Strip */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400">Plinth Beam Steel Rebar (4kg/CFT): </span>
          <span className="font-bold text-slate-900 dark:text-white">{Math.round(estimate.plinthSteelKg * 10) / 10} Kg</span>
        </div>
        <div>
          <span className="text-slate-400">Cement Required: </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round((estimate.plinthConcreteCft / 35.314) * 8.064 * 10) / 10} Bags</span>
        </div>
        <div>
          <span className="text-slate-400">Direct Plinth Concrete Cost: </span>
          <span className="font-extrabold text-emerald-600">₹ {Math.round(estimate.plinthConcreteTotalCost).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 4: Basement - Flyash Brickwork Details (Audited from Excel Row 38-47 & Sheet 2.BASEMENT)
 */
export function BasementModule({ basement, updateBasement, estimate }) {
  const handleChange = (field, val) => {
    updateBasement({
      ...basement,
      [field]: parseFloat(val) || 0
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Basement - Flyash Brickwork Details</h3>
            <p className="text-xs text-slate-500">Flyash brick masonry, both-side plastering, gravel filling, 4" M-sand bed & flooring PCC</p>
          </div>
        </div>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-lg">
          Flyash Masonry 1:6
        </span>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Masonry Length (ft)</label>
          <input
            type="number"
            value={basement.flyashLength}
            onChange={(e) => handleChange('flyashLength', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Usually matches Plinth Length</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Wall Thickness (ft)</label>
          <input
            type="number"
            step="0.05"
            value={basement.flyashBreadth}
            onChange={(e) => handleChange('flyashBreadth', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">9" Brickwork (0.75 ft)</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Masonry Depth (ft)</label>
          <input
            type="number"
            step="0.05"
            value={basement.flyashDepth}
            onChange={(e) => handleChange('flyashDepth', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">+3" for 1 layer below beam</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Outer Perimeter (ft)</label>
          <input
            type="number"
            value={basement.outerPerimeter}
            onChange={(e) => handleChange('outerPerimeter', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">2 × (L + B) = 122 RFT</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Basement Height (ft)</label>
          <input
            type="number"
            step="0.5"
            value={basement.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Above ground level</span>
        </div>
      </div>

      {/* Computed Reactive Breakdown Cards (Audited from Sheet 2.BASEMENT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* 1. Flyash Masonry */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Flyash Brickwork</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {Math.round(estimate.basementBrickworkCft * 10) / 10} CFT
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            {Math.round(estimate.basementFlyashBricksNos).toLocaleString()} Bricks
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Cost: ₹ {Math.round(estimate.basementBrickworkTotalCost).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 2. Outer Plastering */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Both-Side Plastering</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {Math.round(estimate.basementPlasteringSqft)} Sq.ft
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            1:6 Mortar (P-Sand)
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Cost: ₹ {Math.round(estimate.basementPlasterTotalCost).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 3. Gravel Backfilling */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Gravel Backfilling</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {Math.round(estimate.basementGravelCft * 10) / 10} CFT
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            Net Area: {Math.round(estimate.netBasementArea)} sq.ft
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Cost: ₹ {Math.round(estimate.basementGravelTotalCost).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 4. M-Sand 4" Bed */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">4. M-Sand 4" Layer</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {Math.round(estimate.basementMsandLayerCft * 10) / 10} CFT
          </div>
          <div className="text-[11px] text-cyan-600 font-semibold">
            4" Layer above gravel
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Cost: ₹ {Math.round(estimate.basementMsandMatCost).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 5. Flooring PCC Bed */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">5. Flooring PCC Bed</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {Math.round(estimate.flooringPccSqft * 10) / 10} Sq.ft
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            1:4:8 Bed Concrete
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Cost: ₹ {Math.round(estimate.flooringPccTotalCost).toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
}
