import React from 'react';
import { 
  Building2, 
  Layers, 
  Box, 
  Paintbrush, 
  Hammer, 
  PlusCircle, 
  Trash2, 
  Info,
  Compass,
  Maximize2
} from 'lucide-react';

export function ProjectStep({ data, updateData }) {
  const { projectInfo, builtup } = data;

  const handleInfoChange = (field, val) => {
    updateData('projectInfo', { ...projectInfo, [field]: val });
  };

  const handleFloorChange = (idx, field, val) => {
    const newFloors = [...builtup.floors];
    newFloors[idx] = { ...newFloors[idx], [field]: parseFloat(val) || 0 };
    // recompute area
    newFloors[idx].area = (newFloors[idx].length || 0) * (newFloors[idx].breadth || 0);
    
    // total sum
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateData('builtup', {
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea,
      gfArea: newFloors[0]?.area || builtup.gfArea,
    });
  };

  const addFloor = () => {
    const nextNum = builtup.floors.length + 1;
    const newFloors = [
      ...builtup.floors,
      { id: String(Date.now()), name: `Floor ${nextNum}`, length: 20, breadth: 30, area: 600 }
    ];
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateData('builtup', {
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea
    });
  };

  const removeFloor = (idx) => {
    if (builtup.floors.length <= 1) return;
    const newFloors = builtup.floors.filter((_, i) => i !== idx);
    const totalArea = newFloors.reduce((acc, f) => acc + (f.area || 0), 0);
    updateData('builtup', {
      ...builtup,
      floors: newFloors,
      totalContractArea: totalArea
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Project Meta Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Project Identity & Location</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Name / Project Title</label>
            <input
              type="text"
              value={projectInfo.clientName}
              onChange={(e) => handleInfoChange('clientName', e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Jahir Hussain Villa"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Site Location & District</label>
            <input
              type="text"
              value={projectInfo.siteLocation}
              onChange={(e) => handleInfoChange('siteLocation', e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Uthamapalayam - 625533"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Quotation Contact / Mobile</label>
            <input
              type="text"
              value={projectInfo.contactNumber}
              onChange={(e) => handleInfoChange('contactNumber', e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 9489141122"
            />
          </div>
        </div>
      </div>

      {/* Builtup Area Floor Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Floor-Wise Built-Up Area Schedule</h3>
              <p className="text-xs text-slate-500">Measure outer-to-outer outer dimensions from AutoCAD / architectural layout</p>
            </div>
          </div>
          <button
            onClick={addFloor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Floor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Floor Level</th>
                <th className="py-2.5 px-3">Outer Length (ft)</th>
                <th className="py-2.5 px-3">Outer Breadth (ft)</th>
                <th className="py-2.5 px-3 text-right">Floor Area (Sq.ft)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {builtup.floors.map((floor, idx) => (
                <tr key={floor.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={floor.name}
                      onChange={(e) => {
                        const newFloors = [...builtup.floors];
                        newFloors[idx].name = e.target.value;
                        updateData('builtup', { ...builtup, floors: newFloors });
                      }}
                      className="w-36 px-2.5 py-1 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={floor.length}
                      onChange={(e) => handleFloorChange(idx, 'length', e.target.value)}
                      className="w-28 px-2.5 py-1 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={floor.breadth}
                      onChange={(e) => handleFloorChange(idx, 'breadth', e.target.value)}
                      className="w-28 px-2.5 py-1 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {Math.round(floor.area || (floor.length * floor.breadth))} sq.ft
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => removeFloor(idx)}
                      disabled={builtup.floors.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary Footer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            Total built-up contract area directly scales labour, roof slabs, and civil cost-per-sq.ft.
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Built-Up Area</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(builtup.totalContractArea)} Sq.ft
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubstructureStep({ data, updateData }) {
  const { substructure } = data;

  const handleFootingChange = (idx, field, val) => {
    const newFootings = [...substructure.footings];
    newFootings[idx] = { ...newFootings[idx], [field]: parseFloat(val) || 0 };
    updateData('substructure', { ...substructure, footings: newFootings });
  };

  const addFootingRow = () => {
    const num = substructure.footings.length + 1;
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
    updateData('substructure', {
      ...substructure,
      footings: [...substructure.footings, newRow]
    });
  };

  const removeFootingRow = (idx) => {
    if (substructure.footings.length <= 1) return;
    updateData('substructure', {
      ...substructure,
      footings: substructure.footings.filter((_, i) => i !== idx)
    });
  };

  const handlePlinthChange = (type, field, val) => {
    updateData('substructure', {
      ...substructure,
      plinthBeam: {
        ...substructure.plinthBeam,
        [type]: {
          ...substructure.plinthBeam[type],
          [field]: parseFloat(val) || 0
        }
      }
    });
  };

  const handleBasementChange = (field, val) => {
    updateData('substructure', {
      ...substructure,
      basement: {
        ...substructure.basement,
        [field]: parseFloat(val) || 0
      }
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Footings & Columns Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Footing & Column Schedule</h3>
              <p className="text-xs text-slate-500">Excavation depth, PCC bed 1:4:8, M20 Footing & Column stub volume</p>
            </div>
          </div>
          <button
            onClick={addFootingRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Footing Group
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30">
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
                <th className="py-2.5 px-2 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {substructure.footings.map((f, idx) => (
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
                      className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={f.nos}
                      onChange={(e) => handleFootingChange(idx, 'nos', e.target.value)}
                      className="w-12 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
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
                      className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.5"
                      value={f.footingB}
                      onChange={(e) => handleFootingChange(idx, 'footingB', e.target.value)}
                      className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                      className="w-14 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-amber-600"
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
                      disabled={substructure.footings.length <= 1}
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

      {/* Plinth Beam & Basement Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plinth Beam */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Plinth Beam Dimensions</h3>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">Excavation Trench</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-500">Length (ft)</label>
                <input
                  type="number"
                  value={substructure.plinthBeam.excavation.L}
                  onChange={(e) => handlePlinthChange('excavation', 'L', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Breadth (ft)</label>
                <input
                  type="number"
                  value={substructure.plinthBeam.excavation.B}
                  onChange={(e) => handlePlinthChange('excavation', 'B', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Depth (ft)</label>
                <input
                  type="number"
                  value={substructure.plinthBeam.excavation.D}
                  onChange={(e) => handlePlinthChange('excavation', 'D', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase pt-2">Concrete Beam M20</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-500">Length (ft)</label>
                <input
                  type="number"
                  value={substructure.plinthBeam.concrete.L}
                  onChange={(e) => handlePlinthChange('concrete', 'L', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Breadth (ft)</label>
                <input
                  type="number"
                  step="0.05"
                  value={substructure.plinthBeam.concrete.B}
                  onChange={(e) => handlePlinthChange('concrete', 'B', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Depth (ft)</label>
                <input
                  type="number"
                  step="0.05"
                  value={substructure.plinthBeam.concrete.D}
                  onChange={(e) => handlePlinthChange('concrete', 'D', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basement Masonry & Backfilling */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Box className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Basement & Earth Filling</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Perimeter (Rft)</label>
              <input
                type="number"
                value={substructure.basement.perimeter}
                onChange={(e) => handleBasementChange('perimeter', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Basement Height (ft)</label>
              <input
                type="number"
                step="0.5"
                value={substructure.basement.height}
                onChange={(e) => handleBasementChange('height', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Gravel Filling (CFT)</label>
              <input
                type="number"
                value={substructure.basement.gravelFillingCft}
                onChange={(e) => handleBasementChange('gravelFillingCft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">M-Sand 4" Bed (CFT)</label>
              <input
                type="number"
                value={substructure.basement.msandLayerCft}
                onChange={(e) => handleBasementChange('msandLayerCft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Flooring PCC Area (Sq.ft)</label>
              <input
                type="number"
                value={substructure.basement.flooringPccSqft}
                onChange={(e) => handleBasementChange('flooringPccSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Basement Plastering (Sq.ft)</label>
              <input
                type="number"
                value={substructure.basement.plasteringSqft}
                onChange={(e) => handleBasementChange('plasteringSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuperstructureStep({ data, updateData }) {
  const { masonry } = data;

  const handleWallChange = (idx, field, val) => {
    const newWalls = [...masonry.walls];
    newWalls[idx] = { ...newWalls[idx], [field]: parseFloat(val) || 0 };
    updateData('masonry', { ...masonry, walls: newWalls });
  };

  const addWallSegment = () => {
    const newRow = {
      id: `w${Date.now()}`,
      name: 'Partition Wall Segment',
      length: 25,
      breadth: 0.375,
      height: 9,
    };
    updateData('masonry', {
      ...masonry,
      walls: [...masonry.walls, newRow]
    });
  };

  const removeWall = (idx) => {
    if (masonry.walls.length <= 1) return;
    updateData('masonry', {
      ...masonry,
      walls: masonry.walls.filter((_, i) => i !== idx)
    });
  };

  const handleOpeningChange = (idx, field, val) => {
    const newOps = [...masonry.openings];
    newOps[idx] = { ...newOps[idx], [field]: field === 'type' ? val : (parseFloat(val) || 0) };
    // update deduction CFT: nos * width * height * 0.75 (for 9" wall standard)
    if (field !== 'deductionCFT') {
      newOps[idx].deductionCFT = (newOps[idx].nos || 1) * (newOps[idx].width || 0) * (newOps[idx].height || 0) * 0.75;
    }
    updateData('masonry', { ...masonry, openings: newOps });
  };

  const addOpening = () => {
    const newOp = {
      id: `op${Date.now()}`,
      type: 'UPVC Window (4x4)',
      nos: 2,
      width: 4.0,
      height: 4.0,
      deductionCFT: 24.0,
    };
    updateData('masonry', {
      ...masonry,
      openings: [...masonry.openings, newOp]
    });
  };

  const removeOpening = (idx) => {
    if (masonry.openings.length <= 1) return;
    updateData('masonry', {
      ...masonry,
      openings: masonry.openings.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Wall Runs Input */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Superstructure Wall Segments (9" & 4.5" Walls)</h3>
            <p className="text-xs text-slate-500">Vertical runs, horizontal runs, and internal partition walls</p>
          </div>
          <button
            onClick={addWallSegment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Wall Segment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Length (ft)</th>
                <th className="py-2.5 px-3">Thickness (ft)</th>
                <th className="py-2.5 px-3">Height (ft)</th>
                <th className="py-2.5 px-3 text-right">Gross CFT</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {masonry.walls.map((w, idx) => (
                <tr key={w.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={w.name}
                      onChange={(e) => {
                        const newWalls = [...masonry.walls];
                        newWalls[idx].name = e.target.value;
                        updateData('masonry', { ...masonry, walls: newWalls });
                      }}
                      className="w-48 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={w.length}
                      onChange={(e) => handleWallChange(idx, 'length', e.target.value)}
                      className="w-24 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={w.breadth}
                      onChange={(e) => handleWallChange(idx, 'breadth', e.target.value)}
                      className="w-28 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                      className="w-20 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {Math.round((w.length || 0) * (w.breadth || 0) * (w.height || 0))} CFT
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeWall(idx)}
                      disabled={masonry.walls.length <= 1}
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

        {/* Parapet Wall Spec */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Terrace Parapet Wall:</div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Length:</span>
            <input
              type="number"
              value={masonry.parapet.length}
              onChange={(e) => updateData('masonry', { ...masonry, parapet: { ...masonry.parapet, length: parseFloat(e.target.value) || 0 } })}
              className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">Height:</span>
            <input
              type="number"
              value={masonry.parapet.height}
              onChange={(e) => updateData('masonry', { ...masonry, parapet: { ...masonry.parapet, height: parseFloat(e.target.value) || 0 } })}
              className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
            />
            <span className="text-slate-500">ft</span>
          </div>
        </div>
      </div>

      {/* Openings Schedule & Deductions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Openings Schedule & Wall Deductions</h3>
            <p className="text-xs text-slate-500">Main door, room doors, PVC bathroom doors, UPVC windows & ventilators</p>
          </div>
          <button
            onClick={addOpening}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Opening
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-2.5 px-3">Opening Type</th>
                <th className="py-2.5 px-3">Nos</th>
                <th className="py-2.5 px-3">Width (ft)</th>
                <th className="py-2.5 px-3">Height (ft)</th>
                <th className="py-2.5 px-3 text-right">Deduction Volume (CFT)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {masonry.openings.map((op, idx) => (
                <tr key={op.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={op.type}
                      onChange={(e) => handleOpeningChange(idx, 'type', e.target.value)}
                      className="w-48 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={op.nos}
                      onChange={(e) => handleOpeningChange(idx, 'nos', e.target.value)}
                      className="w-16 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.25"
                      value={op.width}
                      onChange={(e) => handleOpeningChange(idx, 'width', e.target.value)}
                      className="w-20 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.25"
                      value={op.height}
                      onChange={(e) => handleOpeningChange(idx, 'height', e.target.value)}
                      className="w-20 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                    - {Math.round(op.deductionCFT || ((op.nos || 1) * (op.width || 0) * (op.height || 0) * 0.75))} CFT
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => removeOpening(idx)}
                      disabled={masonry.openings.length <= 1}
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
    </div>
  );
}

export function BeamsPlasteringStep({ data, updateData }) {
  const { beamsAndPlastering } = data;

  const handleBeamsChange = (field, key, val) => {
    updateData('beamsAndPlastering', {
      ...beamsAndPlastering,
      [field]: {
        ...beamsAndPlastering[field],
        [key]: parseFloat(val) || 0
      }
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sill & Lintel Beam */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Hammer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Sill & Lintel Beams (M15 RCC)</h3>
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sill Beam (2" Thk at Window Sill Level)</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400">Length (ft)</span>
                  <input
                    type="number"
                    value={beamsAndPlastering.sillBeam.length}
                    onChange={(e) => handleBeamsChange('sillBeam', 'length', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Breadth (ft)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={beamsAndPlastering.sillBeam.breadth}
                    onChange={(e) => handleBeamsChange('sillBeam', 'breadth', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Depth (ft)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={beamsAndPlastering.sillBeam.depth}
                    onChange={(e) => handleBeamsChange('sillBeam', 'depth', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lintel Beam (9"x6" Throughout Building)</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400">Length (ft)</span>
                  <input
                    type="number"
                    value={beamsAndPlastering.lintelBeam.length}
                    onChange={(e) => handleBeamsChange('lintelBeam', 'length', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Breadth (ft)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={beamsAndPlastering.lintelBeam.breadth}
                    onChange={(e) => handleBeamsChange('lintelBeam', 'breadth', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Depth (ft)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={beamsAndPlastering.lintelBeam.depth}
                    onChange={(e) => handleBeamsChange('lintelBeam', 'depth', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roof Slab & Beams */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Roof Slab & Plastering Dimensions</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Roof Slab Thickness (Inches)</label>
                <input
                  type="number"
                  step="0.5"
                  value={beamsAndPlastering.roofSlab.slabThicknessInch}
                  onChange={(e) => handleBeamsChange('roofSlab', 'slabThicknessInch', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Roof Beam Run (ft)</label>
                <input
                  type="number"
                  value={beamsAndPlastering.roofSlab.roofBeamLength}
                  onChange={(e) => handleBeamsChange('roofSlab', 'roofBeamLength', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Plastering Surface Areas</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400">Ceiling (1:3) Sq.ft</span>
                  <input
                    type="number"
                    value={beamsAndPlastering.plastering.ceilingAreaSqft}
                    onChange={(e) => handleBeamsChange('plastering', 'ceilingAreaSqft', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Wall Inner (1:6) Sq.ft</span>
                  <input
                    type="number"
                    value={beamsAndPlastering.plastering.wallInnerSqft}
                    onChange={(e) => handleBeamsChange('plastering', 'wallInnerSqft', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Wall Outer (1:6) Sq.ft</span>
                  <input
                    type="number"
                    value={beamsAndPlastering.plastering.wallOuterSqft}
                    onChange={(e) => handleBeamsChange('plastering', 'wallOuterSqft', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinishesStep({ data, updateData }) {
  const { finishes } = data;

  const handleTileChange = (field, val) => {
    updateData('finishes', {
      ...finishes,
      tiles: {
        ...finishes.tiles,
        [field]: parseFloat(val) || 0
      }
    });
  };

  const handleStairChange = (field, val) => {
    updateData('finishes', {
      ...finishes,
      staircase: {
        ...finishes.staircase,
        [field]: parseFloat(val) || 0
      }
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staircase Parameters */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Staircase & Granite Steps</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Total Steps Count</label>
              <input
                type="number"
                value={finishes.staircase.stepsCount}
                onChange={(e) => handleStairChange('stepsCount', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Step Width (ft)</label>
              <input
                type="number"
                step="0.25"
                value={finishes.staircase.width}
                onChange={(e) => handleStairChange('width', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Tread (ft)</label>
              <input
                type="number"
                step="0.05"
                value={finishes.staircase.tread}
                onChange={(e) => handleStairChange('tread', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Riser (ft)</label>
              <input
                type="number"
                step="0.05"
                value={finishes.staircase.riser}
                onChange={(e) => handleStairChange('riser', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">SS 304 Handrail (RFT)</label>
              <input
                type="number"
                value={finishes.staircase.handrailRft}
                onChange={(e) => handleStairChange('handrailRft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Granite Steps Area (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.graniteStepsSqft}
                onChange={(e) => handleTileChange('graniteStepsSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Flooring & Wall Tiles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Paintbrush className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Tile Schedule & Dadoing</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Vitrified Floor Tiles (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.flooringSqft}
                onChange={(e) => handleTileChange('flooringSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Skirting Band (RFT)</label>
              <input
                type="number"
                value={finishes.tiles.skirtingRft}
                onChange={(e) => handleTileChange('skirtingRft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Bathroom Wall Tiles (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.bathWallSqft}
                onChange={(e) => handleTileChange('bathWallSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Kitchen Wall Tiles (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.kitchenWallSqft}
                onChange={(e) => handleTileChange('kitchenWallSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Parking Tiles (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.parkingPorticoSqft}
                onChange={(e) => handleTileChange('parkingPorticoSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Granite Countertop (Sq.ft)</label>
              <input
                type="number"
                value={finishes.tiles.graniteCounterSqft}
                onChange={(e) => handleTileChange('graniteCounterSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdditionalWorksStep({ data, updateData }) {
  const { additionalWorks } = data;

  const handleChange = (field, val) => {
    updateData('additionalWorks', {
      ...additionalWorks,
      [field]: parseFloat(val) || 0
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Box className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Ancillary Structures & Additional Scope</h3>
            <p className="text-xs text-slate-500">Underground sump, septic tank, compound wall, gates, and soakpits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">UG Sump Capacity</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="500"
                value={additionalWorks.sumpLitres}
                onChange={(e) => handleChange('sumpLitres', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-blue-600"
              />
              <span className="text-slate-400 font-bold">Litres</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Flyash Brickwork & Plastering</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Septic Tank Capacity</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="500"
                value={additionalWorks.septicLitres}
                onChange={(e) => handleChange('septicLitres', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-blue-600"
              />
              <span className="text-slate-400 font-bold">Litres</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Flyash 3-Chamber Partition</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Compound Wall Length</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={additionalWorks.compoundWallRft}
                onChange={(e) => handleChange('compoundWallRft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
              <span className="text-slate-400 font-bold">RFT</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">5ft Solid Block Plastered</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">MS Main Gate Area</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={additionalWorks.gateAreaSqft}
                onChange={(e) => handleChange('gateAreaSqft', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              />
              <span className="text-slate-400 font-bold">Sq.ft</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Fabrication & 2-Coat Enamel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

