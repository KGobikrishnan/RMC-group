import React, { useState, useEffect } from 'react';
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
  Building2,
  Trash2,
  Loader2,
  Database
} from 'lucide-react';
import { fetchProjects, saveProjectToBackend, deleteProjectFromBackend } from '../api/rmcApi';
import { DEFAULT_RATES, INITIAL_PROJECT_DATA } from '../data/initialData';

export function ProjectDirectoryPage({ setActiveTab, onSelectProject, currentEstimate }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    clientName: 'Er. Client Project',
    projectCode: '',
    projectType: 'Residential Villa (Framed RCC)',
    siteAddress: 'Theni District',
    builtupArea: 1758,
    status: 'In Estimation',
    stage: 'Quotation Ready',
    completionDate: 'Target: 2027'
  });

  // Load real projects from PostgreSQL database RMC
  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetchProjects();
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const title = p.title || '';
    const client = p.client_name || '';
    const site = p.site_address || '';
    const code = p.project_code || '';
    const pType = p.project_type || '';

    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
      client.toLowerCase().includes(search.toLowerCase()) ||
      site.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || pType.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title) return;
    try {
      setIsSubmitting(true);
      const payload = {
        title: newProject.title,
        projectCode: newProject.projectCode || `RMC-${Date.now().toString().slice(-4)}`,
        projectType: newProject.projectType,
        siteAddress: newProject.siteAddress,
        status: newProject.status,
        stage: newProject.stage,
        completionDate: newProject.completionDate,
        estimateData: {
          ...INITIAL_PROJECT_DATA,
          builtup: {
            ...INITIAL_PROJECT_DATA.builtup,
            clientName: newProject.clientName,
            siteLocation: newProject.siteAddress
          }
        },
        scheduleRates: DEFAULT_RATES
      };

      const res = await saveProjectToBackend(payload);
      if (res.success) {
        await loadProjects();
        setShowAddModal(false);
        setNewProject({
          title: '',
          clientName: 'Er. Client Project',
          projectCode: '',
          projectType: 'Residential Villa (Framed RCC)',
          siteAddress: 'Theni District',
          builtupArea: 1758,
          status: 'In Estimation',
          stage: 'Quotation Ready',
          completionDate: 'Target: 2027'
        });
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project from database?')) return;
    try {
      const res = await deleteProjectFromBackend(id);
      if (res.success) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
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
            Real-time project estimates stored in PostgreSQL Database <span className="font-mono font-bold text-amber-300">RMC</span>
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

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project title, code, client, site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-bold">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Category:</span>
          {['ALL', 'Residential', 'Commercial', 'Duplex', 'Independent'].map((cat) => (
            <button
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-[11px] ${
                typeFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-semibold">Loading projects from PostgreSQL database RMC...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Projects Found in Database</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All static mock projects have been removed. Create a new estimate or click "Save" on any active model to store it in PostgreSQL.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Estimate</span>
          </button>
        </div>
      ) : (
        /* Project Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const totalCost = Number(p.total_cost) || 0;
            const rateSqft = Number(p.rate_per_sqft) || 0;
            const builtupSqft = Number(p.total_builtup_sqft) || 0;
            const gfPlinth = Number(p.gf_plinth_sqft) || 0;

            return (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 relative group"
              >
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {p.project_code || 'RMC-EST'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Completed'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {p.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.client_name || 'Client Project'}</span>
                    </p>
                  </div>

                  {/* Budget Badge */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Budget</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">
                      ₹ {totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ₹ {Math.round(rateSqft).toLocaleString('en-IN')} / sq.ft
                    </span>
                  </div>
                </div>

                {/* Specs Matrix */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Built-Up Area</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">
                      {builtupSqft.toLocaleString()} Sq.ft
                    </span>
                    {gfPlinth > 0 && <span className="text-[10px] text-slate-400 block">GF: {gfPlinth} Sq.ft</span>}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Structure & Floors</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {p.floors || 'G + 1 Floors'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{p.columns_count || 8} Columns Isolated</span>
                  </div>
                </div>

                {/* Location */}
                {p.site_address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.site_address}</span>
                  </div>
                )}

                {/* Milestone & Load Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">Current Milestone:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {p.stage || 'Quotation Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteProject(p.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectProject) {
                          onSelectProject({
                            clientName: p.client_name,
                            siteLocation: p.site_address
                          });
                        }
                        if (setActiveTab) setActiveTab('inputs');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                      <span>Load Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                  <FolderGit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">New Project Estimate</h3>
                  <p className="text-xs text-slate-400">Creates record in PostgreSQL Database RMC</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  placeholder="e.g. Modern Residential Villa G+2"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. M. Jahir Hussain"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Project Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RMC/2026/VIL-01"
                    value={newProject.projectCode}
                    onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Project Type</label>
                  <select
                    value={newProject.projectType}
                    onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Residential Villa (Framed RCC)">Residential Villa</option>
                    <option value="Commercial Clinic & Residence">Commercial</option>
                    <option value="Luxury Duplex Villa">Duplex Villa</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Site Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Anna Nagar, Theni"
                    value={newProject.siteAddress}
                    onChange={(e) => setNewProject({ ...newProject, siteAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to DB...' : 'Save to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
