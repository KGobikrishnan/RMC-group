import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  Maximize2, 
  FileSpreadsheet, 
  PieChart, 
  FileText, 
  Sliders, 
  RotateCcw, 
  Moon, 
  Sun, 
  HardHat,
  Save,
  Check,
  Box,
  Compass,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Receipt,
  Grid,
  Paintbrush,
  Hammer,
  Home,
  Users,
  FolderGit2,
  LogOut,
  Database
} from 'lucide-react';

import rmcLogo from './assets/logo-rmc.png';

import { DEFAULT_RATES } from './data/initialData';
import { BLANK_PROJECT_DATA } from './data/blankProjectData';
import { calculateCivilEstimateComplete } from './utils/calculator';
import RateMasterModal from './components/RateMasterModal';
import { LoginPage } from './components/LoginPage';
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
} from './components/StepperForms';
import {
  FoundationDashboard,
  FoundationBOQView,
  FoundationBOMView,
  FoundationQuotationView,
  ProfitBreakupDashboard
} from './components/DeliverablesViews';
import { ProjectMainDashboard } from './components/MainDashboard';
import { ClientDirectoryPage } from './components/ClientDirectory';
import { ProjectDirectoryPage } from './components/ProjectDirectory';
import { saveProjectToBackend, checkBackendHealth } from './api/rmcApi';

const STORAGE_KEY_DATA = 'rmc_substructure_audit_v8';
const STORAGE_KEY_RATES = 'rmc_substructure_rates_v8';
const STORAGE_KEY_VERSION = 'rmc_dynamic_data_v1';

function loadInitialProjectData() {
  const saved = localStorage.getItem(STORAGE_KEY_DATA);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const isOldSample = parsed.builtup?.clientName === 'Er. M. Jahir Hussain Villa'
        || parsed.builtup?.floors?.some((floor) => Number(floor.length) === 22 && Number(floor.breadth) === 39);
      if (!isOldSample) return parsed;
    } catch { /* discard malformed local estimate and start clean */ }
  }
  return JSON.parse(JSON.stringify(BLANK_PROJECT_DATA));
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication State (Session-only by default so refresh/new window lands on Login first)
  const [authToken, setAuthToken] = useState(() => {
    return sessionStorage.getItem('rmc_auth_token') || null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('rmc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth().then(res => {
      setBackendStatus(res.status === 'healthy' ? 'online' : 'offline');
    });
  }, []);

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('rmc_dark') === 'true' || false;
  });

  // Rates State
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RATES);
    if (saved) {
      try { return { ...DEFAULT_RATES, ...JSON.parse(saved) }; } catch (e) { /* ignore */ }
    }
    return DEFAULT_RATES;
  });

  // Project Input Data State
  const [data, setData] = useState(() => {
    return loadInitialProjectData();
  });

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY_VERSION) !== '1') {
      localStorage.setItem(STORAGE_KEY_VERSION, '1');
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    }
  }, []);

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rmc_dark', String(darkMode));
  }, [darkMode]);

  // Reactive Calculation Engine (Audited against Excel Sections 1 to 7)
  const estimate = useMemo(() => {
    return calculateCivilEstimateComplete(data, rates);
  }, [data, rates]);

  // Updaters
  const updateBuiltup = (newBuiltup) => {
    setData(prev => ({ ...prev, builtup: newBuiltup }));
  };

  const updateFootings = (newFootings) => {
    setData(prev => ({ ...prev, footings: newFootings }));
  };

  const updatePlinthBeams = (newPlinthBeams) => {
    setData(prev => ({ 
      ...prev, 
      plinthBeams: newPlinthBeams,
      plinthBeam: newPlinthBeams[0] || prev.plinthBeam
    }));
  };

  const updateBasement = (newBasement) => {
    setData(prev => ({ ...prev, basement: newBasement }));
  };

  const updateBrickwork = (newBrickwork) => {
    setData(prev => ({ ...prev, brickwork: newBrickwork }));
  };

  const updatePlastering = (newPlastering) => {
    setData(prev => ({ ...prev, plastering: newPlastering }));
  };

  const updateSillLintel = (newSillLintel) => {
    setData(prev => ({ ...prev, sillLintel: newSillLintel, sillAndLintel: newSillLintel }));
  };

  const updateTiles = (newTiles) => {
    setData(prev => ({ ...prev, tiles: newTiles }));
  };

  const updateJoinery = (newJoinery) => {
    setData(prev => ({ ...prev, joinery: newJoinery }));
  };

  const updateRoofSlab = (newRoofSlab) => {
    setData(prev => ({ ...prev, roofSlab: newRoofSlab }));
  };

  const updatePainting = (newPainting) => {
    setData(prev => ({ ...prev, painting: newPainting }));
  };

  const updateStaircase = (newStaircase) => {
    setData(prev => ({ ...prev, staircase: newStaircase }));
  };

  const updateOthers = (newOthers) => {
    setData(prev => ({ ...prev, others: newOthers }));
  };

  const updateAdditionalWorks = (newAdditionalWorks) => {
    setData(prev => ({ ...prev, additionalWorks: newAdditionalWorks }));
  };

  const updateProjectInfo = (newInfo) => {
    setData(prev => ({
      ...prev,
      builtup: {
        ...(prev.builtup || {}),
        ...newInfo
      }
    }));
  };

  // Save to LocalStorage + PostgreSQL Backend
  const handleSave = async () => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
      
      // Also sync to PostgreSQL database RMC
      const savedProject = await saveProjectToBackend({
        id: activeProject?.id || `proj_${Date.now()}`,
        title: data.builtup?.title || data.builtup?.clientName || 'Untitled Estimate',
        projectCode: activeProject?.project_code || activeProject?.projectCode || `RMC/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
        clientId: activeProject?.client_id || activeProject?.clientId || null,
        projectType: activeProject?.project_type || activeProject?.projectType,
        siteAddress: data.builtup?.siteLocation || '',
        status: 'In Progress',
        estimateData: data,
        scheduleRates: rates
      });

      if (savedProject.success) setActiveProject(savedProject.data);

      setSaveSuccess(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error('Failed to save to backend / local storage', e);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleResetEstimate = () => {
    if (window.confirm('Clear the active estimate and start a new blank estimate?')) {
      setData(JSON.parse(JSON.stringify(BLANK_PROJECT_DATA)));
      setActiveProject(null);
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(BLANK_PROJECT_DATA));
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('rmc_auth_token');
    sessionStorage.removeItem('rmc_user');
    localStorage.removeItem('rmc_auth_token');
    localStorage.removeItem('rmc_user');
    setAuthToken(null);
    setCurrentUser(null);
    navigate('/login');
  };

  const handleLoginSuccess = (user, token) => {
    setAuthToken(token);
    setCurrentUser(user);
    navigate('/dashboard');
  };

  // Navigation Items (Project inputs is now fully integrated inside Project Directory estimation popup)
  const navTabs = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/breakup', label: 'Cost & Margin', icon: Sliders },
    { path: '/foundation-summary', label: 'Foundation', icon: PieChart },
    { path: '/boq', label: 'BOQ', icon: FileSpreadsheet },
    { path: '/bom', label: 'Materials', icon: Box },
    { path: '/quotation', label: 'Quotation', icon: FileText },
  ];

  const scrollToModule = (modId) => {
    navigate('/inputs');
    setTimeout(() => {
      const el = document.getElementById(modId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // If user is not authenticated and is on /login
  if (!authToken) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // When authenticated, render enterprise application shell
  return (
    <div className="app-shell min-h-screen text-slate-800 font-sans flex antialiased selection:bg-teal-200 selection:text-teal-950">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-[260px]'
        } ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo & Brand Header */}
        <div className="h-[76px] px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3.5 overflow-hidden cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="relative flex-shrink-0 w-11 h-11 rounded-2xl bg-teal-50 p-2 border border-teal-100 flex items-center justify-center group-hover:bg-teal-100 transition-all">
              <img
                src={rmcLogo}
                alt="RMC Group Logo"
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <HardHat className="w-5 h-5 text-amber-400 absolute" style={{ display: 'none' }} />
            </div>
            {!sidebarCollapsed && (
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                    RMC GROUP
                  </h1>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  Project workspace
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Core Badge */}
        {!sidebarCollapsed && (
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${backendStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                {backendStatus === 'online' ? 'Connected' : 'Offline mode'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{backendStatus === 'online' ? 'Live' : 'Local'}</span>
          </div>
        )}

        {/* Navigation Routes List */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 text-left">
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Workspace
              </div>
            )}
            <div className="space-y-1">
              {navTabs.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileSidebarOpen(false);
                    }}
                    title={item.label}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left relative ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ml-1.5 ${
                              isActive
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-slate-800/80 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {!sidebarCollapsed && (
            <div className="p-4 rounded-2xl bg-slate-900 text-xs text-left shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current estimate</span>
                <span className="text-[10px] font-bold text-teal-300">{rates.contractorMarginPct || 0}%</span>
              </div>
              <span className="text-lg font-black text-white tracking-tight block">
                ₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700">
                <span>{(estimate.totalBuiltupArea || 0).toLocaleString()} Sq.ft</span>
                <span className="text-teal-300 font-bold">₹ {Math.round(estimate.costPerSqft || 0).toLocaleString('en-IN')}/sq.ft</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
        />
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Sticky App Header */}
        <header className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 h-[76px] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400 hidden sm:inline">Workspace</span>
              <span className="font-bold text-slate-900 text-base">
                {navTabs.find((item) => item.path === location.pathname)?.label || 'Overview'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-5 text-xs">
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Built-up area</span>
                <span className="font-extrabold text-slate-800">{(estimate.totalBuiltupArea || 0).toLocaleString()} Sq.ft</span>
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Estimate</span>
                <span className="font-black text-teal-700">₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRateModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all"
                title="Open Rates Configuration"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden sm:inline">Rate Master</span>
              </button>

              <button
                onClick={handleResetEstimate}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all"
                title="Clear active estimate"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">New Estimate</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all active:scale-95"
                title="Save to PostgreSQL & LocalStorage"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{saveSuccess ? 'Saved' : 'Save estimate'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content Area */}
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-10 py-7 flex-1 w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* /dashboard */}
            <Route path="/dashboard" element={
              <ProjectMainDashboard 
                data={data}
                estimate={estimate}
                rates={rates}
                setActiveTab={(tab) => {
                  const pathMap = {
                    'dashboard_home': '/dashboard',
                    'projects': '/projects',
                    'clients': '/clients',
                    'inputs': '/inputs',
                    'breakup': '/breakup',
                    'dashboard': '/foundation-summary',
                    'boq': '/boq',
                    'bom': '/bom',
                    'quotation': '/quotation'
                  };
                  navigate(pathMap[tab] || '/dashboard');
                }}
                scrollToModule={scrollToModule}
                updateProjectInfo={updateProjectInfo}
              />
            } />

            {/* /projects */}
            <Route path="/projects" element={
              <ProjectDirectoryPage
                setActiveTab={(tab) => {
                  if (tab === 'quotation') navigate('/quotation');
                  else if (tab === 'breakup') navigate('/breakup');
                  else navigate('/dashboard');
                }}
                onSelectProject={(prj) => {
                  setActiveProject(prj);
                  if (prj.estimateData) {
                    const projectEstimate = typeof prj.estimateData === 'string' ? JSON.parse(prj.estimateData) : prj.estimateData;
                    setData(projectEstimate);
                    if (prj.scheduleRates) {
                      const projectRates = typeof prj.scheduleRates === 'string' ? JSON.parse(prj.scheduleRates) : prj.scheduleRates;
                      setRates({ ...DEFAULT_RATES, ...projectRates });
                    }
                  } else {
                    updateProjectInfo({
                      clientName: prj.clientName || prj.client_name,
                      siteLocation: prj.siteLocation || prj.site_address,
                      title: prj.title,
                      projectCode: prj.projectCode || prj.project_code,
                      clientId: prj.clientId || prj.client_id
                    });
                  }
                }}
                currentEstimate={estimate}
                appRates={rates}
              />
            } />

            {/* /clients */}
            <Route path="/clients" element={
              <ClientDirectoryPage
                setActiveTab={(tab) => {
                  if (tab === 'projects') navigate('/projects');
                  else if (tab === 'inputs') navigate('/inputs');
                  else navigate('/dashboard');
                }}
                onSelectClient={(cli) => {
                  updateProjectInfo({
                    clientName: cli.name,
                    siteLocation: cli.location,
                    contactNumber: cli.phone
                  });
                }}
              />
            } />

            {/* /inputs (Modules 1 to 15) */}
            <Route path="/inputs" element={
              <div className="space-y-6">
                {/* Active Project & Client Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                      <FolderGit2 className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Active Estimate</span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {activeProject?.project_code || activeProject?.projectCode || data.builtup?.projectCode || 'Not saved'}
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-white">
                        {data.builtup?.title || `${data.builtup?.clientName || 'Standard'} Residence Estimate`}
                      </h2>
                      <p className="text-xs text-slate-300">
                        Client: <b className="text-blue-300">{data.builtup?.clientName || 'Not linked'}</b> • Site: {data.builtup?.siteLocation || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      onClick={() => navigate('/projects')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                    >
                      Change Project
                    </button>
                    <button
                      onClick={() => navigate('/quotation')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95"
                    >
                      View Quotation →
                    </button>
                  </div>
                </div>

                {/* Live Substructure Quantities Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-left">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Built-Up Area</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {(estimate.totalBuiltupArea || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Sq.ft
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Footing Concrete (M20)</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {(estimate.totalFootingConcreteCft || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CFT
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Plinth Concrete (M20)</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {(estimate.totalPlinthConcreteCft || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CFT
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Basement Flyash</span>
                    <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                      {(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Superstructure Bricks</span>
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {(estimate.brickwork?.chamberBricksNos || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Nos
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Plastering Total</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {(estimate.plastering?.totalPlasteringSqft || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Sq.ft
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Steel Rebar</span>
                    <span className="text-lg font-black text-teal-600 dark:text-teal-400">
                      {(estimate.totalSteelTons || 0).toFixed(2)} MT
                    </span>
                  </div>
                </div>

                {/* MODULE 1: Total Built-Up Area */}
                <div id="sec1">
                  <TotalAreaModule builtup={data.builtup} updateBuiltup={updateBuiltup} estimate={estimate} />
                </div>

                {/* MODULE 2: Footing & Column Schedule */}
                <div id="sec2">
                  <FootingModule footings={data.footings} updateFootings={updateFootings} estimate={estimate} />
                </div>

                {/* MODULE 3: Plinth Beam Calculation */}
                <div id="sec3">
                  <PlinthBeamModule
                    plinthBeams={data.plinthBeams || [data.plinthBeam]}
                    updatePlinthBeams={updatePlinthBeams}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 4: Basement Flyash Brickwork Details */}
                <div id="sec4">
                  <BasementModule
                    basement={data.basement}
                    updateBasement={updateBasement}
                    estimate={estimate}
                    builtup={data.builtup}
                  />
                </div>

                {/* MODULE 5: Superstructure Brickwork (9" & 4.5" Walls) */}
                <div id="sec5">
                  <BrickworkModule
                    brickwork={data.brickwork}
                    updateBrickwork={updateBrickwork}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 6: Plastering */}
                <div id="sec6">
                  <PlasteringModule
                    plastering={data.plastering}
                    updatePlastering={updatePlastering}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 7: Sill, Lintel & Lofts */}
                <div id="sec7">
                  <SillLintelModule 
                    sillLintel={data.sillAndLintel || data.sillLintel} 
                    sillAndLintel={data.sillAndLintel || data.sillLintel}
                    updateSillLintel={updateSillLintel} 
                    estimate={estimate} 
                    builtup={data.builtup}
                    brickwork={data.brickwork}
                  />
                </div>

                {/* MODULE 8: Tiles & Granite Work */}
                <div id="sec8">
                  <TilesModule
                    tiles={data.tiles}
                    updateTiles={updateTiles}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 10: Doors & Windows Joinery */}
                <div id="sec10">
                  <JoineryModule
                    joinery={data.joinery}
                    updateJoinery={updateJoinery}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 11: Roof Slab & Beams Concrete */}
                <div id="sec11">
                  <RoofSlabModule
                    roofSlab={data.roofSlab}
                    updateRoofSlab={updateRoofSlab}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 12: Painting Work */}
                <div id="sec12">
                  <PaintingModule
                    painting={data.painting}
                    updatePainting={updatePainting}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 13: Staircase Works */}
                <div id="sec13">
                  <StaircaseModule
                    staircase={data.staircase}
                    updateStaircase={updateStaircase}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 14: MEP & Terrace Surkhi */}
                <div id="sec14">
                  <OthersModule
                    others={data.others}
                    updateOthers={updateOthers}
                    estimate={estimate}
                  />
                </div>

                {/* MODULE 15: Additional Works & Compound Wall */}
                <div id="sec15">
                  <AdditionalWorksModule
                    additionalWorks={data.additionalWorks}
                    updateAdditionalWorks={updateAdditionalWorks}
                    estimate={estimate}
                  />
                </div>
              </div>
            } />

            {/* /breakup */}
            <Route path="/breakup" element={
              <ProfitBreakupDashboard 
                estimate={estimate} 
                rates={rates} 
                setRates={setRates}
                builtupSqft={estimate.totalBuiltupArea || 0}
              />
            } />

            {/* /foundation-summary */}
            <Route path="/foundation-summary" element={
              <FoundationDashboard estimate={estimate} rates={rates} />
            } />

            {/* /boq */}
            <Route path="/boq" element={
              <FoundationBOQView estimate={estimate} rates={rates} />
            } />

            {/* /bom */}
            <Route path="/bom" element={
              <FoundationBOMView bomSummary={estimate.bomSummary || []} />
            } />

            {/* /quotation */}
            <Route path="/quotation" element={
              <FoundationQuotationView 
                estimate={estimate} 
                rates={rates} 
                projectInfo={{
                  clientName: data.builtup?.clientName || '',
                  siteLocation: data.builtup?.siteLocation || '',
                  quoteDate: data.builtup?.quoteDate || data.projectInfo?.quoteDate || '',
                  projectCode: activeProject?.project_code || activeProject?.projectCode || data.builtup?.projectCode || ''
                }} 
              />
            } />

            {/* Catch-all redirect to /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 text-center no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Built with React & Tailwind CSS • Audited from <span className="font-semibold text-slate-700 dark:text-slate-300">03-11-2026_BRICK_ESTIMATE.xlsm</span>
            </div>
            <div>
              RMC Group • Structural Engineering Consultancy & PostgreSQL Powered Suite
            </div>
          </div>
        </footer>
      </div>

      {/* Global Rate Master Modal */}
      <RateMasterModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        rates={rates}
        setRates={setRates}
        onResetRates={() => setRates(DEFAULT_RATES)}
      />
    </div>
  );
}
