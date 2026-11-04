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
  Hammer,
  Paintbrush,
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
 * MODULE 3: Plinth Beam Calculation
 */
export function PlinthBeamModule({ plinthBeams, updatePlinthBeams, estimate }) {
  const beams = Array.isArray(plinthBeams) ? plinthBeams : [];

  const handleBeamChange = (idx, field, val) => {
    const newBeams = [...beams];
    newBeams[idx] = {
      ...newBeams[idx],
      [field]: field === 'name' ? val : (parseFloat(val) || 0)
    };
    updatePlinthBeams(newBeams);
  };

  const addBeamRow = () => {
    const num = beams.length + 1;
    const newRow = {
      id: `pb${Date.now()}`,
      name: `PB${num}`,
      length: 50,
      excavationB: 1.0,
      excavationD: 0.5,
      concreteB: 0.75,
      concreteD: 1.25,
    };
    updatePlinthBeams([...beams, newRow]);
  };

  const removeBeamRow = (idx) => {
    if (beams.length <= 1) return;
    updatePlinthBeams(beams.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Plinth Beam Calculation</h3>
            <p className="text-xs text-slate-500">Trench excavation & Concrete M20 (PB1, PB2, Grid Beams C-C, D-D)</p>
          </div>
        </div>
        <button
          onClick={addBeamRow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Plinth Beam
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
              <th className="py-2.5 px-3">Beam ID</th>
              <th className="py-2.5 px-3">Length (ft)</th>
              <th className="py-2.5 px-2 text-center" colSpan="2">Excavation (B × D ft)</th>
              <th className="py-2.5 px-2 text-center" colSpan="2">Concrete (B × D ft)</th>
              <th className="py-2.5 px-3 text-right">Excavation (CFT)</th>
              <th className="py-2.5 px-3 text-right">Concrete (CFT)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 uppercase bg-slate-50/30 dark:bg-slate-800/20">
              <th className="py-1 px-3"></th>
              <th className="py-1 px-3"></th>
              <th className="py-1 px-2 text-center">Trench B</th>
              <th className="py-1 px-2 text-center">Trench D</th>
              <th className="py-1 px-2 text-center">Beam B</th>
              <th className="py-1 px-2 text-center">Beam D</th>
              <th className="py-1 px-3 text-right">L × B × D</th>
              <th className="py-1 px-3 text-right">L × B × D</th>
              <th className="py-1 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {beams.map((b, idx) => {
              const excCft = (b.length || 0) * (b.excavationB || 0) * (b.excavationD || 0);
              const concCft = (b.length || 0) * (b.concreteB || 0) * (b.concreteD || 0);
              return (
                <tr key={b.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={b.name}
                      onChange={(e) => handleBeamChange(idx, 'name', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={b.length}
                      onChange={(e) => handleBeamChange(idx, 'length', e.target.value)}
                      className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={b.excavationB}
                      onChange={(e) => handleBeamChange(idx, 'excavationB', e.target.value)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={b.excavationD}
                      onChange={(e) => handleBeamChange(idx, 'excavationD', e.target.value)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={b.concreteB}
                      onChange={(e) => handleBeamChange(idx, 'concreteB', e.target.value)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={b.concreteD}
                      onChange={(e) => handleBeamChange(idx, 'concreteD', e.target.value)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-600">
                    {Math.round(excCft * 10) / 10} CFT
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-600">
                    {Math.round(concCft * 100) / 100} CFT
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeBeamRow(idx)}
                      disabled={beams.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Total Sum:</td>
              <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white">
                {Math.round(estimate.totalPbLength * 10) / 10} RFT
              </td>
              <td colSpan="4" className="py-2.5 px-2 text-center text-slate-400">Total Plinth Quantities</td>
              <td className="py-2.5 px-3 text-right font-black text-amber-600">
                {Math.round(estimate.totalPlinthExcavationCft * 10) / 10} CFT
              </td>
              <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                {Math.round(estimate.totalPlinthConcreteCft * 100) / 100} CFT
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/**
 * MODULE 4: Basement - Flyash Brickwork Details
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Masonry Length (ft)</label>
          <input
            type="number"
            value={basement.flyashLength}
            onChange={(e) => handleChange('flyashLength', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
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
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <label className="text-slate-500 font-semibold block mb-1">Outer Perimeter (ft)</label>
          <input
            type="number"
            value={basement.outerPerimeter}
            onChange={(e) => handleChange('outerPerimeter', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
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
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 5: Superstructure Brickwork (9" & 4.5" Red Chamber Bricks) & Openings Schedule
 */
export function BrickworkModule({ brickwork, updateBrickwork, estimate }) {
  const walls = Array.isArray(brickwork?.walls) ? brickwork.walls : [];
  const openings = Array.isArray(brickwork?.openings) ? brickwork.openings : [];

  const handleWallChange = (idx, field, val) => {
    const newWalls = [...walls];
    newWalls[idx] = { ...newWalls[idx], [field]: field === 'name' ? val : (parseFloat(val) || 0) };
    updateBrickwork({ ...brickwork, walls: newWalls });
  };

  const addWall = () => {
    const num = walls.length + 1;
    const newWall = {
      id: `w${Date.now()}`,
      name: `Wall Segment ${num}`,
      length: 25,
      breadth: 0.75,
      height: 9.0
    };
    updateBrickwork({ ...brickwork, walls: [...walls, newWall] });
  };

  const removeWall = (idx) => {
    if (walls.length <= 1) return;
    updateBrickwork({ ...brickwork, walls: walls.filter((_, i) => i !== idx) });
  };

  const handleOpeningChange = (idx, field, val) => {
    const newOps = [...openings];
    newOps[idx] = { ...newOps[idx], [field]: field === 'type' ? val : (parseFloat(val) || 0) };
    newOps[idx].deductionCft = (newOps[idx].nos || 1) * (newOps[idx].width || 0) * (newOps[idx].thickness || 0.75) * (newOps[idx].height || 0);
    updateBrickwork({ ...brickwork, openings: newOps });
  };

  const addOpening = () => {
    const newOp = {
      id: `op${Date.now()}`,
      type: 'UPVC Window (4x4)',
      nos: 2,
      width: 4.0,
      thickness: 0.75,
      height: 4.0,
      deductionCft: 24.0
    };
    updateBrickwork({ ...brickwork, openings: [...openings, newOp] });
  };

  const removeOpening = (idx) => {
    if (openings.length <= 1) return;
    updateBrickwork({ ...brickwork, openings: openings.filter((_, i) => i !== idx) });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">5. Superstructure Brickwork (Red Chamber Bricks 9" & 4.5" Walls)</h3>
            <p className="text-xs text-slate-500">Wall runs, openings deductions (Doors, Windows, Ventilators) & Chamber brick count</p>
          </div>
        </div>
        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-lg">
          Net Volume: {Math.round(estimate.netBrickworkCft * 10) / 10} CFT
        </span>
      </div>

      {/* Wall Runs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Wall Segments Schedule</span>
          <button
            onClick={addWall}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Wall
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Wall Description</th>
                <th className="py-2.5 px-3">Length (ft)</th>
                <th className="py-2.5 px-3">Thickness (ft)</th>
                <th className="py-2.5 px-3">Height (ft)</th>
                <th className="py-2.5 px-3 text-right">Gross CFT</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {walls.map((w, idx) => {
                const vol = (w.length || 0) * (w.breadth || 0.75) * (w.height || 9);
                return (
                  <tr key={w.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => handleWallChange(idx, 'name', e.target.value)}
                        className="w-52 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.5"
                        value={w.length}
                        onChange={(e) => handleWallChange(idx, 'length', e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={w.breadth}
                        onChange={(e) => handleWallChange(idx, 'breadth', e.target.value)}
                        className="w-28 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                      >
                        <option value="0.75">9" Wall (0.75 ft)</option>
                        <option value="0.375">4.5" Wall (0.375 ft)</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.5"
                        value={w.height}
                        onChange={(e) => handleWallChange(idx, 'height', e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                      {Math.round(vol * 10) / 10} CFT
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => removeWall(idx)}
                        disabled={walls.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Openings Schedule Table */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Openings Deductions Schedule</span>
          <button
            onClick={addOpening}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Opening
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2 px-3">Opening Type</th>
                <th className="py-2 px-3 text-center">Nos</th>
                <th className="py-2 px-3">Width (ft)</th>
                <th className="py-2 px-3">Wall Thk (ft)</th>
                <th className="py-2 px-3">Height (ft)</th>
                <th className="py-2 px-3 text-right">Deduction (CFT)</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {openings.map((op, idx) => (
                <tr key={op.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={op.type}
                      onChange={(e) => handleOpeningChange(idx, 'type', e.target.value)}
                      className="w-48 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      value={op.nos}
                      onChange={(e) => handleOpeningChange(idx, 'nos', e.target.value)}
                      className="w-14 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.05"
                      value={op.width}
                      onChange={(e) => handleOpeningChange(idx, 'width', e.target.value)}
                      className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.05"
                      value={op.thickness}
                      onChange={(e) => handleOpeningChange(idx, 'thickness', e.target.value)}
                      className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={op.height}
                      onChange={(e) => handleOpeningChange(idx, 'height', e.target.value)}
                      className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-600">
                    - {Math.round(op.deductionCft * 10) / 10} CFT
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeOpening(idx)}
                      disabled={openings.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30"
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

      {/* Summary Footer */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400">Gross Wall Volume: </span>
          <span className="font-bold text-slate-900 dark:text-white">{Math.round(estimate.grossWallVolumeCft)} CFT</span>
        </div>
        <div>
          <span className="text-slate-400">Total Deductions: </span>
          <span className="font-bold text-amber-600">- {Math.round(estimate.totalDeductionsVolumeCft * 10) / 10} CFT</span>
        </div>
        <div>
          <span className="text-slate-400">Red Chamber Bricks (Net CFT × 12): </span>
          <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">{Math.round(estimate.chamberBricksNos).toLocaleString()} Nos</span>
        </div>
        <div>
          <span className="text-slate-400">Superstructure Brickwork Cost: </span>
          <span className="font-extrabold text-slate-900 dark:text-white">₹ {Math.round(estimate.chamberBrickworkTotalCost).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 6: Wall & Ceiling Plastering (Inner & Outer)
 */
export function PlasteringModule({ plastering, updatePlastering, estimate }) {
  const rooms = Array.isArray(plastering?.rooms) ? plastering.rooms : [];

  const handleRoomChange = (idx, field, val) => {
    const newRooms = [...rooms];
    newRooms[idx] = { ...newRooms[idx], [field]: field === 'name' ? val : (parseFloat(val) || 0) };
    updatePlastering({ ...plastering, rooms: newRooms });
  };

  const addRoom = () => {
    const num = rooms.length + 1;
    const newRoom = {
      id: `r${Date.now()}`,
      name: `Room ${num}`,
      length: 12,
      breadth: 10,
      height: 10
    };
    updatePlastering({ ...plastering, rooms: [...rooms, newRoom] });
  };

  const removeRoom = (idx) => {
    if (rooms.length <= 1) return;
    updatePlastering({ ...plastering, rooms: rooms.filter((_, i) => i !== idx) });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Paintbrush className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">6. Plastering (Ceiling 1:3, Wall Inner 1:6 & Outer 1:6)</h3>
            <p className="text-xs text-slate-500">Room-wise dimensions for Ceiling Area, Internal Wall Runs & Outer Surfaces</p>
          </div>
        </div>
        <button
          onClick={addRoom}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
              <th className="py-2.5 px-3">Room / Space</th>
              <th className="py-2.5 px-3">Length (ft)</th>
              <th className="py-2.5 px-3">Breadth (ft)</th>
              <th className="py-2.5 px-3">Height (ft)</th>
              <th className="py-2.5 px-3 text-right">Ceiling Area (Sq.ft)</th>
              <th className="py-2.5 px-3 text-right">Wall Area (2*(L+B)*H)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {rooms.map((r, idx) => {
              const ceil = (r.length || 0) * (r.breadth || 0);
              const wall = (r.height || 0) > 0 ? (2 * ((r.length || 0) + (r.breadth || 0)) * (r.height || 0)) : 0;
              return (
                <tr key={r.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => handleRoomChange(idx, 'name', e.target.value)}
                      className="w-40 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={r.length}
                      onChange={(e) => handleRoomChange(idx, 'length', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={r.breadth}
                      onChange={(e) => handleRoomChange(idx, 'breadth', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={r.height}
                      onChange={(e) => handleRoomChange(idx, 'height', e.target.value)}
                      className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(ceil * 10) / 10} sq.ft
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(wall * 10) / 10} sq.ft
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeRoom(idx)}
                      disabled={rooms.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
              <td colSpan="4" className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Total Plastering Areas:</td>
              <td className="py-2.5 px-3 text-right font-black text-blue-600 dark:text-blue-400">
                {Math.round(estimate.totalCeilingSqft)} Sq.ft (Ceiling)
              </td>
              <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white">
                {Math.round(estimate.netInnerPlasteringSqft)} Sq.ft (Net Inner)
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Plastering Outer & Cost Strip */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400">Ceiling Plaster Cost (1:3): </span>
          <span className="font-bold text-blue-600">₹ {Math.round(estimate.ceilingPlasterTotalCost).toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-slate-400">Outer Plaster Area: </span>
          <span className="font-bold text-slate-900 dark:text-white">{Math.round(estimate.totalOuterPlasteringSqft)} Sq.ft</span>
        </div>
        <div>
          <span className="text-slate-400">Wall Plaster Cost (Inner & Outer): </span>
          <span className="font-extrabold text-slate-900 dark:text-white">₹ {Math.round(estimate.wallPlasterTotalCost).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 7: Sill Beam, Lintel Beam & Lofts/Sunshades RCC (DATA SHEET 8)
 */
export function SillLintelModule({ sillLintel, sillAndLintel: propSillAndLintel, updateSillLintel, estimate }) {
  const currentData = sillLintel || propSillAndLintel || {};
  const sillLength = currentData.sillLength ?? 122;
  const sillB = currentData.sillB ?? 0.75;
  const sillD = currentData.sillD ?? 0.25;
  const lintelLength = currentData.lintelLength ?? 245;
  const lintelB = currentData.lintelB ?? 0.75;
  const lintelD = currentData.lintelD ?? 0.50;
  const slabs = Array.isArray(currentData.slabs) ? currentData.slabs : [];

  const handleFieldChange = (field, val) => {
    updateSillLintel({
      ...currentData,
      [field]: parseFloat(val) || 0
    });
  };

  const handleSlabChange = (idx, field, val) => {
    const newSlabs = [...slabs];
    newSlabs[idx] = { ...newSlabs[idx], [field]: field === 'name' ? val : (parseFloat(val) || 0) };
    updateSillLintel({ ...currentData, slabs: newSlabs });
  };

  const addSlab = () => {
    const num = slabs.length + 1;
    const newSlab = {
      id: `s${Date.now()}`,
      name: `RCC Slab / Loft ${num}`,
      length: 15,
      breadth: 2.0,
      depth: 0.25
    };
    updateSillLintel({ ...currentData, slabs: [...slabs, newSlab] });
  };

  const removeSlab = (idx) => {
    if (slabs.length <= 1) return;
    updateSillLintel({ ...currentData, slabs: slabs.filter((_, i) => i !== idx) });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">7. Sill Beam, Lintel Beam & Lofts/Sunshades RCC</h3>
            <p className="text-xs text-slate-500">M15 Sill concrete (window level), Lintel beam (throughout building) & RCC lofts/sunshades</p>
          </div>
        </div>
        <button
          onClick={addSlab}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Loft/Sunshade
        </button>
      </div>

      {/* Sill & Lintel Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Sill Concrete Beam (Window Bottom)</span>
            <span className="text-blue-600">{sillLength} RFT</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Length (RFT)</label>
              <input
                type="number"
                value={sillLength}
                onChange={(e) => handleFieldChange('sillLength', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Width (ft)</label>
              <input
                type="number"
                step="0.05"
                value={sillB}
                onChange={(e) => handleFieldChange('sillB', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Depth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={sillD}
                onChange={(e) => handleFieldChange('sillD', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">Rebar: 2 nos 8mm TMT bars (146.4 kg)</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Lintel Concrete Beam (Throughout)</span>
            <span className="text-indigo-600">{lintelLength} RFT</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Length (RFT)</label>
              <input
                type="number"
                value={lintelLength}
                onChange={(e) => handleFieldChange('lintelLength', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Width (ft)</label>
              <input
                type="number"
                step="0.05"
                value={lintelB}
                onChange={(e) => handleFieldChange('lintelB', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Depth (ft)</label>
              <input
                type="number"
                step="0.05"
                value={lintelD}
                onChange={(e) => handleFieldChange('lintelD', e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">Rebar: 10mm TMT bars (349.1 kg)</div>
        </div>
      </div>

      {/* Lofts & Sunshades Table */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Lofts, Sunshades & Counter Slabs</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Length (ft)</th>
                <th className="py-2 px-3">Breadth (ft)</th>
                <th className="py-2 px-3">Thickness (ft)</th>
                <th className="py-2 px-3 text-right">Volume (CFT)</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {slabs.map((s, idx) => {
                const vol = (s.length || 0) * (s.breadth || 0) * (s.depth || 0.25);
                return (
                  <tr key={s.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => handleSlabChange(idx, 'name', e.target.value)}
                        className="w-48 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.5"
                        value={s.length}
                        onChange={(e) => handleSlabChange(idx, 'length', e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.05"
                        value={s.breadth}
                        onChange={(e) => handleSlabChange(idx, 'breadth', e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.05"
                        value={s.depth}
                        onChange={(e) => handleSlabChange(idx, 'depth', e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-indigo-600">
                      {Math.round(vol * 100) / 100} CFT
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => removeSlab(idx)}
                        disabled={slabs.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-bold text-xs">
                <td colSpan="4" className="py-2 px-3 text-slate-700 dark:text-slate-300">Total Slabs/Lofts RCC Volume:</td>
                <td className="py-2 px-3 text-right font-black text-indigo-600">
                  {Math.round(estimate.totalLoftsVolumeCft * 10) / 10} CFT
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
