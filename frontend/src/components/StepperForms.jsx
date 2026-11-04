import React from 'react';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  Trash2, 
  Info,
  Maximize2,
  HardHat
} from 'lucide-react';

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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Total Built-Up Area Calculation</h3>
            <p className="text-xs text-slate-500">Measure outer-to-outer length & breadth in AutoCAD plan</p>
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

      {/* Summary Footer Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Sum of all measured AutoCAD floor slabs (outer edge to outer edge)</span>
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Footing & Column Foundation Calculation</h3>
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
