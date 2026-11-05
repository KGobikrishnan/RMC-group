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
export function FootingModule({ footings, updateFootings, estimate }) {
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
              <th className="py-2.5 px-2 text-right">Backfilling (CFT)</th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {footings.map((f, idx) => {
              const itemCalculated = estimate?.itemizedFootings?.[idx];
              const rowBackfill = itemCalculated?.backfillingCft !== undefined
                ? Math.round(itemCalculated.backfillingCft * 10) / 10
                : Math.round(
                    Math.max(
                      0,
                      (f.footingL * f.footingB * f.depth * f.nos) -
                      (
                        (f.footingL * f.footingB * f.pccDepth * f.nos) +
                        (f.footingL * f.footingB * f.footingD * f.nos) +
                        (f.nos * f.colL * f.colB * f.depth)
                      )
                    ) * 10
                  ) / 10;

              return (
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
                <td className="py-2 px-2 text-right font-extrabold text-amber-600 dark:text-amber-400">
                  {rowBackfill} CFT
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Module 2 Results Strip (Footing & Column Totals + Backfilling Volume) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Earthwork Excavation: </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">
            {Math.round(estimate?.totalExcavationCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">PCC 1:4:8 Bed: </span>
          <span className="font-extrabold text-slate-700 dark:text-slate-300">
            {Math.round(estimate?.totalPccCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Footing Concrete (M20): </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            {Math.round(estimate?.totalFootingConcreteCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Column Stub (M20): </span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">
            {Math.round(estimate?.totalColumnConcreteCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Column Backfilling Vol: </span>
          <span className="font-black text-amber-600 dark:text-amber-400">
            {Math.round((estimate?.totalFootingBackfillingCft || 0) * 10) / 10} CFT
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Footing + Col Cost:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round((estimate?.footingTotalCost || 0) + (estimate?.colTotalCost || 0) + (estimate?.pccTotalCost || 0) + (estimate?.excavationLabCost || 0) + (estimate?.backfillingLabCost || 0)).toLocaleString('en-IN')}
          </span>
        </div>
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
    const parsedVal = field === 'name' ? val : (parseFloat(val) || 0);
    newBeams[idx] = {
      ...newBeams[idx],
      [field]: parsedVal
    };
    // If length is changed on excavation side, synchronize length to concrete side if not individually overridden
    if (field === 'length' && newBeams[idx].concreteLength === undefined) {
      newBeams[idx].concreteLength = parsedVal;
    }
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
      concreteLength: 50,
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
            <p className="text-xs text-slate-500">Excel Section 3: Plinth Beam Excavation & Concrete Schedule (Linked to Basement Flyash & Backfilling)</p>
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

      {/* Two Column Layout matching Excel Columns C30:E35 and F30:H35 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table 1: PLINTH BEAM EXCAVATION */}
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                Plinth Beam Excavation
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
              Total: {Math.round(estimate?.totalPlinthExcavationCft || 0)} CFT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-200 dark:border-amber-800/60 font-bold text-slate-600 dark:text-slate-400 bg-amber-100/40 dark:bg-amber-950/30">
                  <th className="py-2 px-2.5">Beam</th>
                  <th className="py-2 px-2">Length (L)</th>
                  <th className="py-2 px-2">Width (B)</th>
                  <th className="py-2 px-2">Depth (D)</th>
                  <th className="py-2 px-2.5 text-right">Exc. CFT</th>
                  <th className="py-2 px-1 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30 font-medium">
                {beams.map((b, idx) => {
                  const excL = b.length || 0;
                  const excB = b.excavationB || 0;
                  const excD = b.excavationD || 0;
                  const excCft = excL * excB * excD;

                  return (
                    <tr key={b.id || idx} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/20">
                      <td className="py-1.5 px-2.5">
                        <input
                          type="text"
                          value={b.name}
                          onChange={(e) => handleBeamChange(idx, 'name', e.target.value)}
                          className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-amber-700 dark:text-amber-400 text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.5"
                          value={b.length}
                          onChange={(e) => handleBeamChange(idx, 'length', e.target.value)}
                          className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.05"
                          value={b.excavationB}
                          onChange={(e) => handleBeamChange(idx, 'excavationB', e.target.value)}
                          className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.05"
                          value={b.excavationD}
                          onChange={(e) => handleBeamChange(idx, 'excavationD', e.target.value)}
                          className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-extrabold text-amber-600 dark:text-amber-400">
                        {Math.round(excCft * 10) / 10}
                      </td>
                      <td className="py-1.5 px-1 text-center">
                        <button
                          onClick={() => removeBeamRow(idx)}
                          disabled={beams.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-20 transition-colors"
                          title="Remove beam"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-amber-300 dark:border-amber-800 bg-amber-100/30 dark:bg-amber-950/40 font-bold text-xs">
                  <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">Total:</td>
                  <td className="py-2 px-2 text-slate-900 dark:text-white font-black">
                    {Math.round(estimate?.totalPbLength || 0)} RFT
                  </td>
                  <td colSpan="2" className="py-2 px-2 text-right text-slate-500">Total Vol:</td>
                  <td className="py-2 px-2.5 text-right font-black text-amber-600 dark:text-amber-400">
                    {Math.round((estimate?.totalPlinthExcavationCft || 0) * 10) / 10} CFT
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Table 2: PLINTH BEAM CONCRETE (M20) */}
        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                Plinth Beam Concrete (M20)
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              Total: {Math.round(estimate?.totalPlinthConcreteCft || 0)} CFT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-200 dark:border-emerald-800/60 font-bold text-slate-600 dark:text-slate-400 bg-emerald-100/40 dark:bg-emerald-950/30">
                  <th className="py-2 px-2.5">Beam</th>
                  <th className="py-2 px-2">Length (L)</th>
                  <th className="py-2 px-2">Breadth (B)</th>
                  <th className="py-2 px-2">Depth (D)</th>
                  <th className="py-2 px-2.5 text-right">Conc. CFT</th>
                  <th className="py-2 px-1 text-center">Area (Sq.ft)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30 font-medium">
                {beams.map((b, idx) => {
                  const concL = b.concreteLength !== undefined ? b.concreteLength : (b.length || 0);
                  const concB = b.concreteB || 0.75;
                  const concD = b.concreteD || 1.25;
                  const concCft = concL * concB * concD;
                  const beamArea = concL * concB;

                  return (
                    <tr key={b.id || idx} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20">
                      <td className="py-1.5 px-2.5 font-bold text-emerald-700 dark:text-emerald-400">
                        {b.name || `PB${idx + 1}`}
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.5"
                          value={concL}
                          onChange={(e) => handleBeamChange(idx, 'concreteLength', e.target.value)}
                          className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                          title="Auto-linked from Excavation length; can be customized"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.05"
                          value={b.concreteB}
                          onChange={(e) => handleBeamChange(idx, 'concreteB', e.target.value)}
                          className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          step="0.05"
                          value={b.concreteD}
                          onChange={(e) => handleBeamChange(idx, 'concreteD', e.target.value)}
                          className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        {Math.round(concCft * 100) / 100}
                      </td>
                      <td className="py-1.5 px-1 text-center font-semibold text-slate-500 text-[11px]">
                        {Math.round(beamArea * 10) / 10}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-emerald-300 dark:border-emerald-800 bg-emerald-100/30 dark:bg-emerald-950/40 font-bold text-xs">
                  <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">Total:</td>
                  <td className="py-2 px-2 text-slate-900 dark:text-white font-black">
                    {Math.round(estimate?.totalPbLength || 0)} RFT
                  </td>
                  <td colSpan="2" className="py-2 px-2 text-right text-slate-500">Total Vol:</td>
                  <td className="py-2 px-2.5 text-right font-black text-emerald-600 dark:text-emerald-400">
                    {Math.round((estimate?.totalPlinthConcreteCft || 0) * 100) / 100} CFT
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                    {Math.round((estimate?.plinthBeamDeductionArea || 0) * 10) / 10}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Module 3 Results Strip (Plinth Beam Totals & Excel Auto-Link Highlights) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Total Beam Length: </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            {Math.round(estimate?.totalPbLength || 0)} RFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Trench Excavation: </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">
            {Math.round((estimate?.totalPlinthExcavationCft || 0) * 10) / 10} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Plinth Concrete (M20): </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {Math.round((estimate?.totalPlinthConcreteCft || 0) * 10) / 10} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Beam Area Deduction: </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400" title="Auto-deducted in Section 4 Basement Gravel & Sand Filling (L42)">
            {Math.round(estimate?.plinthBeamDeductionArea || 0)} Sq.ft 🔗
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Steel Rebar: </span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">
            {Math.round(estimate?.plinthSteelKg || 0)} kg
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Plinth Total:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round((estimate?.plinthConcreteTotalCost || 0) + (estimate?.plinthExcavationLabCost || 0)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * MODULE 4: Basement - Flyash Brickwork Details
 */
export function BasementModule({ basement, updateBasement, estimate, builtup }) {
  // Ground floor perimeter calculated as 2*(L+B) from Section 1
  const gfFloor = builtup?.floors?.[0];
  const gfLength = gfFloor?.length !== undefined ? Number(gfFloor.length) : 22;
  const gfBreadth = gfFloor?.breadth !== undefined ? Number(gfFloor.breadth) : 39;
  const autoGfPerimeter = Math.round(2 * (gfLength + gfBreadth) * 100) / 100; // e.g. 2*(22+39) = 122

  const isManualPerimeter = Boolean(basement?.isPerimeterManual);
  const currentPerimeter = isManualPerimeter 
    ? (basement.outerPerimeter ?? autoGfPerimeter)
    : autoGfPerimeter;

  const handleChange = (field, val) => {
    if (field === 'outerPerimeter') {
      updateBasement({
        ...basement,
        outerPerimeter: parseFloat(val) || 0,
        isPerimeterManual: true
      });
    } else {
      updateBasement({
        ...basement,
        [field]: parseFloat(val) || 0
      });
    }
  };

  const handleResetPerimeterToGf = () => {
    updateBasement({
      ...basement,
      outerPerimeter: autoGfPerimeter,
      isPerimeterManual: false
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
          <div className="flex items-center justify-between mb-1">
            <label className="text-slate-500 font-semibold block">Outer Perimeter (ft)</label>
            {!isManualPerimeter ? (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded" title="Auto-linked from Ground Floor: 2*(Length + Breadth)">
                Auto 🔗
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResetPerimeterToGf}
                className="text-[10px] font-bold text-slate-400 hover:text-blue-500 underline"
                title="Reset to Ground Floor auto-link"
              >
                Reset 🔗
              </button>
            )}
          </div>
          <input
            type="number"
            step="0.5"
            value={currentPerimeter}
            onChange={(e) => handleChange('outerPerimeter', e.target.value)}
            className={`w-full px-2.5 py-1.5 rounded-lg border font-bold ${
              !isManualPerimeter 
                ? 'border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}
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

      {/* Back Filling Details Schedule (Matching Excel DATA SHEET K40:N42 & Sheet 2.BASEMENT) */}
      <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
              Back Filling & Basement Area Deduction Schedule
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Excel Ref: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">K41:N42</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Total Plinth Area linked from Section 1 Ground Floor */}
          <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 font-semibold text-[11px]">Total Plinth Area</span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-1 rounded">
                Section 1 🔗
              </span>
            </div>
            <div className="text-base font-black text-blue-700 dark:text-blue-300">
              {Math.round(estimate?.gfArea ?? (gfLength * gfBreadth))} <span className="text-xs font-semibold">Sq.ft</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ground Floor ({gfLength} × {gfBreadth})
            </div>
          </div>

          {/* Plinth Beam Area Deduction linked from Section 3 */}
          <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 font-semibold text-[11px]">Plinth Beam Area</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-1 rounded">
                Section 3 🔗
              </span>
            </div>
            <div className="text-base font-black text-emerald-700 dark:text-emerald-300">
              - {Math.round((estimate?.plinthBeamDeductionArea || 0) * 10) / 10} <span className="text-xs font-semibold">Sq.ft</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Beam Plan Area Deducted (L42)
            </div>
          </div>

          {/* Net Filling Area (K42 - L42) */}
          <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 font-semibold text-[11px]">Net Filling Area</span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100/60 dark:bg-purple-900/40 px-1 rounded">
                M42 = K42-L42
              </span>
            </div>
            <div className="text-base font-black text-purple-700 dark:text-purple-300">
              {Math.round((estimate?.netBasementArea || 0) * 10) / 10} <span className="text-xs font-semibold">Sq.ft</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Net Gravel, Sand & PCC Area
            </div>
          </div>

          {/* Filling Depth (N42 = H42) */}
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 font-semibold text-[11px]">Filling Depth</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/40 px-1 rounded">
                N42 = H42
              </span>
            </div>
            <div className="text-base font-black text-amber-700 dark:text-amber-300">
              {basement.height || 3.0} <span className="text-xs font-semibold">ft</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Gravel Vol: <b>{Math.round(estimate?.basementGravelCft || 0)} CFT</b>
            </div>
          </div>
        </div>
      </div>

      {/* Module 4 Results Strip (Basement Masonry, Plaster, Gravel, Sand & PCC) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Flyash Bricks (1:6): </span>
          <span className="font-extrabold text-purple-600 dark:text-purple-400">
            {Math.round(estimate?.basementFlyashBricksNos || 0).toLocaleString()} Nos
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Basement Plaster (2 sides): </span>
          <span className="font-extrabold text-slate-700 dark:text-slate-300">
            {Math.round(estimate?.basementPlasteringSqft || 0)} Sq.ft
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Gravel Filling: </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">
            {Math.round(estimate?.basementGravelCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">4" M-Sand Bed: </span>
          <span className="font-extrabold text-teal-600 dark:text-teal-400">
            {Math.round(estimate?.basementMsandLayerCft || 0)} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Flooring PCC: </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            {Math.round(estimate?.flooringPccSqft || 0)} Sq.ft
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Basement Total:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round((estimate?.basementBrickworkTotalCost || 0) + (estimate?.basementPlasterTotalCost || 0) + (estimate?.basementGravelTotalCost || 0) + (estimate?.basementMsandMatCost || 0) + (estimate?.flooringPccTotalCost || 0)).toLocaleString('en-IN')}
          </span>
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

      {/* Module 5 Results Strip (Gross, Deductions, Net Bricks, Cement, Sand, Cost) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Gross Wall Volume: </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{Math.round(estimate?.grossWallVolumeCft || 0)} CFT</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Openings Deductions: </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">- {Math.round((estimate?.totalDeductionsVolumeCft || 0) * 10) / 10} CFT</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Net Brickwork Volume: </span>
          <span className="font-extrabold text-slate-900 dark:text-white">{Math.round((estimate?.netBrickworkCft || 0) * 10) / 10} CFT</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Chamber Bricks (Net CFT × 12): </span>
          <span className="font-black text-rose-600 dark:text-rose-400 text-sm">{Math.round(estimate?.chamberBricksNos || 0).toLocaleString()} Nos</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Superstructure Brickwork Cost:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round(estimate?.chamberBrickworkTotalCost || 0).toLocaleString('en-IN')}
          </span>
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

      {/* Module 6 Results Strip (Ceiling, Inner Wall, Outer Wall, Total Plaster & Costs) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Ceiling Plaster (1:3): </span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">{Math.round(estimate?.totalCeilingSqft || 0)} Sq.ft</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Inner Wall Plaster (1:6): </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{Math.round(estimate?.netInnerPlasteringSqft || 0)} Sq.ft</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Outer Wall Plaster (1:6): </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{Math.round(estimate?.totalOuterPlasteringSqft || 0)} Sq.ft</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Total Plastering: </span>
          <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
            {Math.round((estimate?.totalCeilingSqft || 0) + (estimate?.netInnerPlasteringSqft || 0) + (estimate?.totalOuterPlasteringSqft || 0)).toLocaleString()} Sq.ft
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Plastering Total Cost:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round((estimate?.ceilingPlasterTotalCost || 0) + (estimate?.wallPlasterTotalCost || 0)).toLocaleString('en-IN')}
          </span>
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
                  {Math.round(estimate?.totalLoftsVolumeCft || 0 * 10) / 10} CFT
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Module 7 Results Strip (Sill RFT, Lintel RFT, Lofts CFT, Rebar & Total Cost) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Sill Concrete Beam: </span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">
            {Math.round(sillLength)} RFT ({Math.round(estimate?.sillSteelKg || 0)} kg steel)
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Lintel Beam: </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            {Math.round(lintelLength)} RFT ({Math.round(estimate?.lintelSteelKg || 0)} kg steel)
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Lofts & Sunshades (M20): </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            {Math.round((estimate?.totalLoftsVolumeCft || 0) * 10) / 10} CFT
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Total Rebar (Sill + Lintel + Lofts): </span>
          <span className="font-black text-teal-600 dark:text-teal-400">
            {Math.round((estimate?.sillSteelKg || 0) + (estimate?.lintelSteelKg || 0) + (estimate?.loftsSteelKg || 0))} kg
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-500 uppercase text-[11px]">Sill, Lintel & Lofts Cost:</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹ {Math.round((estimate?.sillTotalCost || 0) + (estimate?.lintelTotalCost || 0) + (estimate?.loftsTotalCost || 0)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
