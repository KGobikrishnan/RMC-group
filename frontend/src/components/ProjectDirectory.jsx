import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sliders, 
  FileText, 
  ArrowUpRight, 
  Eye, 
  BarChart3,
  HardHat,
  Building2
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'prj-001',
    code: 'RMC/2026/VIL-01',
    name: 'Residential Villa G+2 (Benchmark Model)',
    clientName: 'Er. M. Jahir Hussain',
    type: 'Residential Villa (Framed RCC)',
    siteLocation: 'Building Doctor Complex, Uthamapalayam - 625533',
    builtupArea: '1,758 Sq.ft',
    gfPlinth: '858 Sq.ft',
    floors: 'G + 2 Floors',
    columns: 8,
    status: 'In Estimation',
    stage: 'Quotation Ready',
    directCost: '₹ 21,78,767',
    totalQuote: '₹ 26,43,619',
    ratePerSqft: '₹ 3,081 / sq.ft',
    marginPct: 12,
    completionDate: 'Target: Dec 2027',
    isCurrent: true
  },
  {
    id: 'prj-002',
    code: 'RMC/2026/COM-02',
    name: 'Sri Meenakshi Commercial Clinic & Residence',
    clientName: 'Dr. K. Senthil Kumar',
    type: 'Commercial + Residential (Mixed)',
    siteLocation: 'Bypass Road, Opp Bus Stand, Periyakulam',
    builtupArea: '3,200 Sq.ft',
    gfPlinth: '1,600 Sq.ft',
    floors: 'G + 1 Floors',
    columns: 16,
    status: 'Foundation Ongoing',
    stage: 'Plinth Beam Level',
    directCost: '₹ 41,20,000',
    totalQuote: '₹ 48,20,000',
    ratePerSqft: '₹ 3,012 / sq.ft',
    marginPct: 10,
    completionDate: 'Target: Oct 2027',
    isCurrent: false
  },
  {
    id: 'prj-003',
    code: 'RMC/2025/BUN-03',
    name: 'Star Agro Modern Duplex Bungalow',
    clientName: 'Alhaj. Mohamed Ibrahim',
    type: 'Luxury Duplex Villa',
    siteLocation: 'Main Bazaar, Chinnamanur',
    builtupArea: '2,450 Sq.ft',
    gfPlinth: '1,225 Sq.ft',
    floors: 'G + 1 Floors',
    columns: 12,
    status: 'Roof Slab Cast',
    stage: 'Finishing & Plastering',
    directCost: '₹ 33,50,000',
    totalQuote: '₹ 38,90,000',
    ratePerSqft: '₹ 3,175 / sq.ft',
    marginPct: 12,
    completionDate: 'Target: Jun 2027',
    isCurrent: false
  },
  {
    id: 'prj-004',
    code: 'RMC/2026/IND-04',
    name: 'Anand Tex 3BHK Independent Villa',
    clientName: 'Mrs. Jayalakshmi Anand',
    type: 'Single Floor Independent',
    siteLocation: 'Near Cotton Market, Cumbum',
    builtupArea: '1,450 Sq.ft',
    gfPlinth: '1,450 Sq.ft',
    floors: 'Ground Floor Only',
    columns: 10,
    status: 'Drafting Plan',
    stage: 'Initial Takeoff',
    directCost: '₹ 28,10,000',
    totalQuote: '₹ 32,50,000',
    ratePerSqft: '₹ 2,241 / sq.ft',
    marginPct: 10,
    completionDate: 'Target: Jan 2028',
    isCurrent: false
  }
];

export function ProjectDirectoryPage({ setActiveTab, onSelectProject, currentEstimate }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    clientName: 'Er. Client',
    type: 'Residential Villa (Framed RCC)',
    siteLocation: 'Theni District',
    builtupArea: '1,500 Sq.ft',
    gfPlinth: '800 Sq.ft',
    floors: 'G + 1',
    columns: 10,
    totalQuote: '₹ 28,00,000',
    ratePerSqft: '₹ 2,850 / sq.ft'
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.siteLocation.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    const added = {
      ...newProject,
      id: `prj-${Date.now().toString().slice(-4)}`,
      code: `RMC/2026/VIL-${(projects.length + 1).toString().padStart(2, '0')}`,
      status: 'In Estimation',
      stage: 'Quotation Ready',
      directCost: '₹ 24,00,000',
      marginPct: 12,
      completionDate: 'Target: 2027',
      isCurrent: false
    };
    setProjects([added, ...projects]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Project Portfolio Directory</h2>
          </div>
          <p className="text-xs text-indigo-200/80">
            Track site estimations, structural models, built-up areas, and quotation values across client sites
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Estimate</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project title, code, client, site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-semibold mr-1">Category:</span>
          {['ALL', 'Residential', 'Commercial', 'Duplex', 'Independent'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
              p.isCurrent
                ? 'border-blue-500/60 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              {/* Header with Project Code & Current Badge */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.code}
                    </span>
                    {p.isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        ACTIVE IN ENGINE
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {p.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Client: <span className="font-bold text-slate-800 dark:text-slate-200">{p.clientName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400">
                    {p.totalQuote}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{p.ratePerSqft}</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="pt-3 grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Built-Up Area</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{p.builtupArea}</span>
                  <span className="text-[10px] text-slate-400 block">GF: {p.gfPlinth}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Structure & Floors</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{p.floors}</span>
                  <span className="text-[10px] text-slate-400 block">{p.columns} Columns Isolated</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Site Location</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{p.siteLocation}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Progress Bar & Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Current Milestone:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.stage}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  {p.completionDate}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectProject) onSelectProject(p);
                      setActiveTab('breakup');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold transition-colors flex items-center gap-1 text-[11px]"
                    title="Profit Margin Breakup"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Margin</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectProject) onSelectProject(p);
                      setActiveTab('inputs');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1 text-[11px]"
                    title="Load Project into Engine"
                  >
                    <span>{p.isCurrent ? 'Active Engine' : 'Load Project'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Site Project</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Residential Villa G+1"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Building Type</label>
                  <input
                    type="text"
                    value={newProject.type}
                    onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Site Location & Survey Number</label>
                <input
                  type="text"
                  value={newProject.siteLocation}
                  onChange={(e) => setNewProject({ ...newProject, siteLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Total Built-Up Area</label>
                  <input
                    type="text"
                    value={newProject.builtupArea}
                    onChange={(e) => setNewProject({ ...newProject, builtupArea: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">GF Plinth Area</label>
                  <input
                    type="text"
                    value={newProject.gfPlinth}
                    onChange={(e) => setNewProject({ ...newProject, gfPlinth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Floors</label>
                  <input
                    type="text"
                    value={newProject.floors}
                    onChange={(e) => setNewProject({ ...newProject, floors: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Estimated Budget (₹)</label>
                  <input
                    type="text"
                    value={newProject.totalQuote}
                    onChange={(e) => setNewProject({ ...newProject, totalQuote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Target Rate / Sq.ft</label>
                  <input
                    type="text"
                    value={newProject.ratePerSqft}
                    onChange={(e) => setNewProject({ ...newProject, ratePerSqft: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

