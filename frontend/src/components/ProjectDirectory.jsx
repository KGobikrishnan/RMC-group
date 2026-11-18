import React, { useState, useEffect, useMemo } from 'react';
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
  Edit3,
  BarChart3,
  HardHat,
  Building2,
  Trash2,
  Loader2,
  Database,
  UserCheck,
  Check,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { fetchProjects, fetchClients, fetchProjectById, saveProjectToBackend, deleteProjectFromBackend } from '../api/rmcApi';
import { DEFAULT_RATES } from '../data/initialData';
import { BLANK_PROJECT_DATA } from '../data/blankProjectData';
import { calculateCivilEstimateComplete } from '../utils/calculator';
import { ProjectDetailView } from './ProjectDetailView';
import { 
  TotalAreaModule, 
  FootingModule, 
  PlinthBeamModule, 
  BasementModule,
  BrickworkModule,
  PlasteringModule,
  SillLintelModule,
  TilesModule,
  JoineryModule,
  RoofSlabModule,
  PaintingModule,
  StaircaseModule,
  OthersModule,
  AdditionalWorksModule
} from './StepperForms';

export function ProjectDirectoryPage({ setActiveTab, onSelectProject, currentEstimate, appRates }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Selected project for comprehensive single-page details view
  const [viewingProject, setViewingProject] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Stepper active tab in full estimation modal: 'meta' | 'substructure' | 'superstructure' | 'finishes' | 'infra'
  const [activeStepTab, setActiveStepTab] = useState('meta');
  const estimateSteps = [
    { id: 'meta', short: 'Project', title: 'Project details', help: 'Add the client and site details first.' },
    { id: 'substructure', short: 'Foundation', title: 'Foundation & plinth', help: 'Enter floor sizes, footing quantities and plinth beam measurements.' },
    { id: 'superstructure', short: 'Walls & RCC', title: 'Walls, plaster & concrete', help: 'Add wall lengths, room sizes, openings and lintel or sunshade measurements.' },
    { id: 'finishes', short: 'Finishes', title: 'Finishes & services', help: 'Fill only the finish and service items included in this project.' },
    { id: 'infra', short: 'Extra works', title: 'Site & extra works', help: 'Add site infrastructure and optional works, then review the estimate.' },
  ];
  const currentStepIndex = estimateSteps.findIndex((step) => step.id === activeStepTab);
  const setStepByOffset = (offset) => {
    const next = Math.max(0, Math.min(estimateSteps.length - 1, currentStepIndex + offset));
    setActiveStepTab(estimateSteps[next].id);
  };

  // New Project State with integrated complete 15-module estimate inputs (Defaults to clean Blank template)
  const [newProject, setNewProject] = useState({
    title: '',
    clientId: '',
    clientName: '',
    projectCode: '',
    projectType: 'Residential Villa (Framed RCC)',
    siteAddress: '',
    status: 'In Estimation',
    stage: 'Quotation Ready',
    completionDate: '',
    estimateData: JSON.parse(JSON.stringify(BLANK_PROJECT_DATA))
  });

  const handleResetToBlank = () => {
    setNewProject(prev => ({
      ...prev,
      estimateData: JSON.parse(JSON.stringify(BLANK_PROJECT_DATA))
    }));
  };

  // Rates for this modal calculation
  const rates = appRates || DEFAULT_RATES;

  // Real-time calculation engine within the modal
  const liveEstimate = useMemo(() => {
    return calculateCivilEstimateComplete(newProject.estimateData, rates);
  }, [newProject.estimateData, rates]);

  // Load real projects & clients from PostgreSQL database RMC
  const loadData = async () => {
    try {
      setLoading(true);
      const [resProjects, resClients] = await Promise.all([
        fetchProjects(),
        fetchClients()
      ]);
      if (resProjects.success) {
        setProjects(resProjects.data || []);
      }
      if (resClients.success) {
        setClients(resClients.data || []);
      }
    } catch (err) {
      console.error('Error fetching data from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClientSelectChange = (clientId) => {
    const selected = clients.find(c => c.id === clientId);
    if (selected) {
      setNewProject(prev => {
        const updatedEstimate = {
          ...prev.estimateData,
          builtup: {
            ...prev.estimateData.builtup,
            clientName: selected.name,
            siteLocation: selected.location || selected.address || ''
          }
        };
        return {
          ...prev,
          clientId: selected.id,
          clientName: selected.name,
          siteAddress: selected.location || selected.address || prev.siteAddress,
          title: prev.title || `${selected.name} Residence`,
          estimateData: updatedEstimate
        };
      });
    } else {
      setNewProject(prev => ({ ...prev, clientId: '', clientName: '' }));
    }
  };

  // Updaters for the 15 modules inside the modal
  const updateBuiltup = (newBuiltup) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, builtup: newBuiltup }
    }));
  };

  const updateFootings = (newFootings) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, footings: newFootings }
    }));
  };

  const updatePlinthBeams = (newPlinthBeams) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { 
        ...prev.estimateData, 
        plinthBeams: newPlinthBeams,
        plinthBeam: newPlinthBeams[0] || prev.estimateData.plinthBeam
      }
    }));
  };

  const updateBasement = (newBasement) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, basement: newBasement }
    }));
  };

  const updateBrickwork = (newBrickwork) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, brickwork: newBrickwork }
    }));
  };

  const updatePlastering = (newPlastering) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, plastering: newPlastering }
    }));
  };

  const updateSillLintel = (newSillLintel) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { 
        ...prev.estimateData, 
        sillLintel: newSillLintel, 
        sillAndLintel: newSillLintel 
      }
    }));
  };

  const updateTiles = (newTiles) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, tiles: newTiles }
    }));
  };

  const updateJoinery = (newJoinery) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, joinery: newJoinery }
    }));
  };

  const updateRoofSlab = (newRoofSlab) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, roofSlab: newRoofSlab }
    }));
  };

  const updatePainting = (newPainting) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, painting: newPainting }
    }));
  };

  const updateStaircase = (newStaircase) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, staircase: newStaircase }
    }));
  };

  const updateOthers = (newOthers) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, others: newOthers }
    }));
  };

  const updateAdditionalWorks = (newAdditionalWorks) => {
    setNewProject(prev => ({
      ...prev,
      estimateData: { ...prev.estimateData, additionalWorks: newAdditionalWorks }
    }));
  };

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

  // Handle open project in edit mode inside the full 15-module modal
  const handleEditProject = async (proj, e) => {
    if (e) e.stopPropagation();
    try {
      setLoadingDetails(true);
      const res = await fetchProjectById(proj.id);
      const fullProj = (res.success && res.data) ? res.data : proj;

      const loadedEstimateData = fullProj.estimate_data 
        ? (typeof fullProj.estimate_data === 'string' ? JSON.parse(fullProj.estimate_data) : fullProj.estimate_data)
        : JSON.parse(JSON.stringify(BLANK_PROJECT_DATA));

      setEditingProjectId(fullProj.id);
      setNewProject({
        id: fullProj.id,
        title: fullProj.title || '',
        clientId: fullProj.client_id || '',
        clientName: fullProj.client_name || '',
        projectCode: fullProj.project_code || '',
        projectType: fullProj.project_type || 'Residential Villa (Framed RCC)',
        siteAddress: fullProj.site_address || '',
        status: fullProj.status || 'In Estimation',
        stage: fullProj.stage || 'Quotation Ready',
        completionDate: fullProj.completion_date || '',
        estimateData: loadedEstimateData
      });
      setActiveStepTab('meta');
      setShowAddModal(true);
    } catch (err) {
      console.error('Error loading project for edit:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenNewProject = () => {
    setEditingProjectId(null);
    setNewProject({
      title: '',
      clientId: '',
      clientName: '',
      projectCode: '',
      projectType: 'Residential Villa (Framed RCC)',
      siteAddress: '',
      status: 'In Estimation',
      stage: 'Quotation Ready',
      completionDate: '',
      estimateData: JSON.parse(JSON.stringify(BLANK_PROJECT_DATA))
    });
    setActiveStepTab('meta');
    setShowAddModal(true);
  };

  const handleAddProject = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newProject.title) {
      alert('Please enter a Project Title');
      return;
    }
    try {
      setIsSubmitting(true);
      const generatedCode = newProject.projectCode || `RMC/${new Date().getFullYear()}/PRJ-${Date.now().toString().slice(-4)}`;
      
      const syncedEstimateData = {
        ...newProject.estimateData,
        builtup: {
          ...newProject.estimateData.builtup,
          clientName: newProject.clientName || '',
          siteLocation: newProject.siteAddress || ''
        }
      };

      const payload = {
        id: editingProjectId || undefined,
        title: newProject.title,
        clientId: newProject.clientId || null,
        projectCode: generatedCode,
        projectType: newProject.projectType,
        siteAddress: newProject.siteAddress,
        status: newProject.status,
        stage: newProject.stage,
        completionDate: newProject.completionDate,
        estimateData: syncedEstimateData,
        scheduleRates: rates
      };

      const res = await saveProjectToBackend(payload);
      if (res.success) {
        await loadData();
        setShowAddModal(false);
        setEditingProjectId(null);
        
        // Pass to active calculation engine and navigate to quotation / dashboard immediately
        if (onSelectProject) {
          onSelectProject({
            id: res.data?.id,
            projectCode: generatedCode,
            projectType: newProject.projectType,
            clientId: newProject.clientId,
            clientName: newProject.clientName,
            siteLocation: newProject.siteAddress,
            title: newProject.title,
            scheduleRates: rates,
            estimateData: syncedEstimateData
          });
        }
        if (setActiveTab) {
          setActiveTab('quotation');
        }

        setNewProject({
          title: '',
          clientId: '',
          clientName: '',
          projectCode: '',
          projectType: 'Residential Villa (Framed RCC)',
          siteAddress: '',
          status: 'In Estimation',
          stage: 'Quotation Ready',
          completionDate: '',
          estimateData: JSON.parse(JSON.stringify(BLANK_PROJECT_DATA))
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

  // Handle open project details in single clean page view
  const handleViewProjectDetails = async (proj) => {
    try {
      setLoadingDetails(true);
      // Fetch full project payload with estimate_data & schedule_rates from DB
      const res = await fetchProjectById(proj.id);
      if (res.success && res.data) {
        setViewingProject(res.data);
      } else {
        setViewingProject(proj);
      }
    } catch (err) {
      console.error('Error fetching project full details:', err);
      setViewingProject(proj);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectProjectForQuotation = async (project) => {
    try {
      const result = await fetchProjectById(project.id);
      const fullProject = result.success && result.data ? result.data : project;
      const rawEstimate = fullProject.estimate_data || fullProject.estimateData;
      const estimateData = typeof rawEstimate === 'string' ? JSON.parse(rawEstimate) : rawEstimate;
      onSelectProject?.({
        id: fullProject.id,
        title: fullProject.title,
        projectCode: fullProject.project_code,
        projectType: fullProject.project_type,
        clientId: fullProject.client_id,
        clientName: fullProject.client_name,
        siteLocation: fullProject.site_address,
        scheduleRates: fullProject.schedule_rates || fullProject.scheduleRates,
        estimateData
      });
      setActiveTab?.('quotation');
    } catch (err) {
      console.error('Could not load project for quotation:', err);
    }
  };

  // If a project is selected for single page detailed viewing, render ProjectDetailView
  if (viewingProject) {
    return (
      <ProjectDetailView
        project={viewingProject}
        onBack={() => setViewingProject(null)}
        onEditProject={(p) => {
          setViewingProject(null);
          handleOpenEditProject(p);
        }}
        onOpenQuotation={(p) => {
          if (onSelectProject) {
            onSelectProject({
              id: p.id,
              clientId: p.client_id,
              clientName: p.client_name,
              siteLocation: p.site_address,
              title: p.title,
              estimateData: p.estimate_data || p.estimateData
            });
          }
          if (setActiveTab) setActiveTab('quotation');
        }}
      />
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Project Portfolio Directory</h2>
          </div>
          <p className="text-xs text-slate-500">
            Track project estimates, clients and construction details in one place.
          </p>
        </div>

        <button
          onClick={handleOpenNewProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
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
                      {p.floors || 'Not set'}
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
                      onClick={(e) => handleEditProject(p, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 transition-all shadow-sm"
                      title="Edit project inputs in the 15-module estimation calculator"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Project</span>
                    </button>
                    <button
                      onClick={() => handleViewProjectDetails(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                      title="View all inputs & computed outputs in a clean page"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleSelectProjectForQuotation(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                      <span>Quotation</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Project Modal - Complete 15 Modules Estimation Engine Pop-Up */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="w-full max-w-6xl max-h-[92vh] bg-white border border-[#e2e9e6] rounded-3xl shadow-2xl flex flex-col text-left animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e2e9e6] flex items-center justify-between bg-[#f8faf9] rounded-t-3xl shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#0f766e] text-white rounded-2xl shadow-sm">
                  <FolderGit2 className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#17211f]">
                      {editingProjectId ? 'Edit Project Estimate' : 'Create Project Estimate'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PostgreSQL: RMC
                    </span>
                  </div>
                  <p className="text-xs text-[#667772]">Enter measurements in order. Totals update automatically as you go.</p>
                </div>
              </div>

              {/* Live Cost Summary Pill & Mode Toggle in Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-[#e2e9e6]/60 rounded-xl">
                  <button
                    type="button"
                    onClick={handleResetToBlank}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#293936] hover:bg-white hover:shadow-xs transition-all"
                    title="Clear all fields to start fresh with custom site measurements"
                  >
                    Clear to Blank
                  </button>
                </div>

                <div className="hidden sm:block text-right px-3 py-1.5 bg-[#eaf6f4] border border-[#c8e7e2] rounded-2xl">
                  <span className="text-[10px] font-bold text-[#667772] block uppercase">Estimate Total</span>
                  <span className="text-sm font-black text-[#0f766e] font-mono">
                    ₹ {Math.round(liveEstimate.grandTotalCost || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl text-[#667772] hover:text-[#17211f] hover:bg-[#e2e9e6] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simple, sequential estimate steps */}
            <div className="px-6 py-3.5 bg-white border-b border-[#e2e9e6] shrink-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-[#17211f]">Step {currentStepIndex + 1} of {estimateSteps.length}: {estimateSteps[currentStepIndex]?.title}</span>
                <span className="text-xs text-[#667772] font-semibold">{Math.round(((currentStepIndex + 1) / estimateSteps.length) * 100)}% complete</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f1f5f3] overflow-hidden mb-3">
                <div className="h-full rounded-full bg-[#0f766e] transition-all" style={{ width: `${((currentStepIndex + 1) / estimateSteps.length) * 100}%` }} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {estimateSteps.map((step, index) => (
                  <button 
                    key={step.id} 
                    type="button" 
                    onClick={() => setActiveStepTab(step.id)} 
                    aria-current={activeStepTab === step.id ? 'step' : undefined}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      activeStepTab === step.id 
                        ? 'bg-[#0f766e] text-white shadow-sm' 
                        : index < currentStepIndex 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-[#f1f5f3] text-[#667772] hover:text-[#17211f]'
                    }`}
                  >
                    <span className={`grid place-items-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      activeStepTab === step.id 
                        ? 'bg-white/20 text-white' 
                        : index < currentStepIndex 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-white text-[#667772]'
                    }`}>
                      {index < currentStepIndex ? '✓' : index + 1}
                    </span>
                    {step.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body with Scroll */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#f5f7f6]">
              <div className="max-w-4xl mx-auto px-4 py-3 rounded-2xl border border-[#c8e7e2] bg-[#eaf6f4] text-xs text-[#0f766e] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#17211f]">{estimateSteps[currentStepIndex]?.title}:</span> {estimateSteps[currentStepIndex]?.help} Dimensions are in feet unless specified.
                </div>
              </div>
              {/* TAB 1: Project Metadata & Client Linking */}
              {activeStepTab === 'meta' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
                    <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-1">
                      Project and client details
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Choose a saved client, or leave it empty and enter the client name below.
                    </p>

                    <div>
                      <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1 text-xs">
                        Select Existing Client (from PostgreSQL Database)
                      </label>
                      <select
                        value={newProject.clientId || ''}
                        onChange={(e) => handleClientSelectChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100 shadow-sm"
                      >
                        <option value="">Choose a saved client (optional)</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="Example: Kumar residence"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter the client name"
                        value={newProject.clientName}
                        onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Project Code</label>
                      <input
                        type="text"
                        placeholder="Auto-generated (e.g. RMC/2026/PRJ-01)"
                        value={newProject.projectCode}
                        onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Project Type</label>
                      <select
                        value={newProject.projectType}
                        onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                      >
                        <option value="Residential Villa (Framed RCC)">Residential Villa (Framed RCC)</option>
                        <option value="Commercial Clinic & Residence">Commercial Clinic & Residence</option>
                        <option value="Luxury Duplex Villa">Luxury Duplex Villa</option>
                        <option value="Independent House">Independent House</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="text-slate-500 font-semibold block mb-1">Site Location & Dimensions</label>
                    <input
                      type="text"
                      placeholder="e.g. East 60ft x North 40ft, Anna Nagar, Theni"
                      value={newProject.siteAddress}
                      onChange={(e) => setNewProject({ ...newProject, siteAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('substructure')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      <span>Continue to foundation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Substructure Modules 1 to 4 */}
              {activeStepTab === 'substructure' && (
                <div className="space-y-6">
                  <TotalAreaModule 
                    builtup={newProject.estimateData.builtup} 
                    updateBuiltup={updateBuiltup} 
                    estimate={liveEstimate} 
                  />
                  <FootingModule 
                    footings={newProject.estimateData.footings} 
                    updateFootings={updateFootings} 
                    estimate={liveEstimate} 
                  />
                  <PlinthBeamModule 
                    plinthBeams={newProject.estimateData.plinthBeams || [newProject.estimateData.plinthBeam]} 
                    updatePlinthBeams={updatePlinthBeams} 
                    estimate={liveEstimate} 
                  />
                  <BasementModule 
                    basement={newProject.estimateData.basement} 
                    updateBasement={updateBasement} 
                    estimate={liveEstimate} 
                    builtup={newProject.estimateData.builtup} 
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('meta')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      ← Back to Project Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('superstructure')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      <span>Continue to walls and RCC</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Superstructure Modules 5 to 7 */}
              {activeStepTab === 'superstructure' && (
                <div className="space-y-6">
                  <BrickworkModule 
                    brickwork={newProject.estimateData.brickwork} 
                    updateBrickwork={updateBrickwork} 
                    estimate={liveEstimate} 
                  />
                  <PlasteringModule 
                    plastering={newProject.estimateData.plastering} 
                    updatePlastering={updatePlastering} 
                    estimate={liveEstimate} 
                  />
                  <SillLintelModule 
                    sillLintel={newProject.estimateData.sillAndLintel || newProject.estimateData.sillLintel} 
                    sillAndLintel={newProject.estimateData.sillAndLintel || newProject.estimateData.sillLintel} 
                    updateSillLintel={updateSillLintel} 
                    estimate={liveEstimate} 
                    builtup={newProject.estimateData.builtup} 
                    brickwork={newProject.estimateData.brickwork} 
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('substructure')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      ← Back to Substructure
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('finishes')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      <span>Continue to finishes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Finishes & Trades Modules 8 to 13 */}
              {activeStepTab === 'finishes' && (
                <div className="space-y-6">
                  <TilesModule 
                    tiles={newProject.estimateData.tiles} 
                    updateTiles={updateTiles} 
                    estimate={liveEstimate} 
                  />
                  <JoineryModule 
                    joinery={newProject.estimateData.joinery} 
                    updateJoinery={updateJoinery} 
                    estimate={liveEstimate} 
                  />
                  <RoofSlabModule 
                    roofSlab={newProject.estimateData.roofSlab} 
                    updateRoofSlab={updateRoofSlab} 
                    estimate={liveEstimate} 
                    builtup={newProject.estimateData.builtup} 
                    plinthBeams={newProject.estimateData.plinthBeams} 
                  />
                  <PaintingModule 
                    painting={newProject.estimateData.painting} 
                    updatePainting={updatePainting} 
                    estimate={liveEstimate} 
                  />
                  <StaircaseModule 
                    staircase={newProject.estimateData.staircase} 
                    updateStaircase={updateStaircase} 
                    estimate={liveEstimate} 
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('superstructure')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      ← Back to Superstructure
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('infra')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      <span>Continue to extra works</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Site Infrastructure Modules 14 & 15 */}
              {activeStepTab === 'infra' && (
                <div className="space-y-6">
                  <OthersModule 
                    others={newProject.estimateData.others} 
                    updateOthers={updateOthers} 
                    estimate={liveEstimate} 
                  />
                  <AdditionalWorksModule 
                    additionalWorks={newProject.estimateData.additionalWorks} 
                    updateAdditionalWorks={updateAdditionalWorks} 
                    estimate={liveEstimate} 
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStepTab('finishes')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      ← Back to Finishes
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Check the live total below, then save the estimate.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Sticky Footer with Live Cost & Submit */}
            <div className="px-6 py-4 border-t border-[#e2e9e6] bg-[#f8faf9] flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl shrink-0">
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <span className="text-[#667772] block font-semibold text-[11px]">Built-Up Area:</span>
                  <span className="font-extrabold text-[#17211f] font-mono">
                    {Math.round(liveEstimate.totalBuiltupArea || 0).toLocaleString('en-IN')} Sq.ft
                  </span>
                </div>
                <div className="h-6 w-px bg-[#e2e9e6]" />
                <div>
                  <span className="text-[#667772] block font-semibold text-[11px]">Total Steel:</span>
                  <span className="font-extrabold text-[#0f766e] font-mono">
                    {(liveEstimate.totalSteelTons || 0).toFixed(2)} MT
                  </span>
                </div>
                <div className="h-6 w-px bg-[#e2e9e6]" />
                <div>
                  <span className="text-[#667772] block font-semibold text-[11px]">Grand Estimate Total:</span>
                  <span className="text-base font-black text-[#0f766e] font-mono">
                    ₹ {Math.round(liveEstimate.grandTotalCost || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[#667772] hover:bg-[#e2e9e6] font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-extrabold text-xs shadow-md shadow-[#0f766e]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Database...' : (editingProjectId ? 'Update Project & Recalculate' : 'Save Estimate & Open Quotation')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
