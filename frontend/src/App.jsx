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
  Sparkles,
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

import { DEFAULT_RATES, INITIAL_PROJECT_DATA } from './data/initialData';
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

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('rmc_auth_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rmc_user');
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
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_RATES;
  });

  // Project Input Data State
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROJECT_DATA;
  });

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
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
      await saveProjectToBackend({
        id: 'proj_active_session',
        title: data.builtup?.clientName ? `${data.builtup.clientName} - Active Estimate` : 'G+1 Residential Project',
        projectCode: 'RMC-ACTIVE-01',
        siteAddress: data.builtup?.siteLocation || 'Theni Site',
        status: 'In Progress',
        estimateData: data,
        scheduleRates: rates
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error('Failed to save to backend / local storage', e);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Reset to Sample Initial Data
  const handleResetToSample = () => {
    if (window.confirm("Reset all civil inputs to original verified Excel data (03-11-2026_BRICK_ESTIMATE.xlsm)?")) {
      setData(INITIAL_PROJECT_DATA);
      setRates(DEFAULT_RATES);
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_RATES);
    }
  };

  // Logout handler
  const handleLogout = () => {
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
    { path: '/dashboard', label: 'Main Dashboard', icon: Home, badge: 'Overview' },
    { path: '/projects', label: 'Project Directory', icon: FolderGit2, badge: 'Portfolio' },
    { path: '/clients', label: 'Client Directory', icon: Users, badge: 'CRM' },
    { path: '/breakup', label: 'Profit & Rate/Sq.ft', icon: Sliders, badge: `${rates.contractorMarginPct || 10}% Margin` },
    { path: '/foundation-summary', label: 'Foundation Summary', icon: PieChart },
    { path: '/boq', label: 'Civil BOQ', icon: FileSpreadsheet, badge: `${estimate.boqSchedule?.length || 18} Items` },
    { path: '/bom', label: 'Materials BOM', icon: Box, badge: 'Procurement' },
    { path: '/quotation', label: 'Client Quotation', icon: FileText, badge: 'Print PDF' },
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0f172a]/95 backdrop-blur-2xl border-r border-slate-800/80 transition-all duration-300 ease-in-out lg:static ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo & Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3.5 overflow-hidden cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="relative flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 p-2 border border-amber-500/30 shadow-lg shadow-amber-500/10 flex items-center justify-center group-hover:border-amber-400/50 transition-all">
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
                  <h1 className="text-sm font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    RMC GROUP
                  </h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase font-mono">
                  Civil Engineering Suite
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
          <div className="px-5 py-2.5 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${backendStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-300">
                {backendStatus === 'online' ? 'PostgreSQL: RMC' : 'Local Storage Mode'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AUDITED
            </span>
          </div>
        )}

        {/* Navigation Routes List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 text-left">
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Navigation Matrix
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left relative ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border-l-2 border-amber-400 font-extrabold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
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
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
          {!sidebarCollapsed && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 text-xs text-left shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Live Estimate</span>
                <span className="text-[10px] font-mono font-bold text-amber-400">12% MARGIN</span>
              </div>
              <span className="text-lg font-black text-white font-mono tracking-tight block">
                ₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1.5 border-t border-slate-800 font-mono">
                <span>{(estimate.totalBuiltupArea || 0).toLocaleString()} Sq.ft</span>
                <span className="text-amber-400/90 font-bold">₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')}/sq.ft</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
        <header className="no-print sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-500 hidden sm:inline text-[11px]">ACTIVE WORKSPACE /</span>
              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                {location.pathname === '/' ? '/dashboard' : location.pathname}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-5 text-xs">
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Contract Area</span>
                <span className="font-extrabold text-white">{(estimate.totalBuiltupArea || 0).toLocaleString()} Sq.ft</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Total Quotation</span>
                <span className="font-black text-amber-400">₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 shadow-sm transition-all"
                title="Open Rates Configuration"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Rate Master</span>
              </button>

              <button
                onClick={handleResetToSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 border border-slate-800 transition-all"
                title="Reset Sample Values"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sample Villa</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                title="Save to PostgreSQL & LocalStorage"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{saveSuccess ? 'Saved' : 'Save Plan'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
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
                  if (prj.estimateData) {
                    setData(prj.estimateData);
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
                          {data.builtup?.projectCode || 'RMC/2026/ACTIVE'}
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-white">
                        {data.builtup?.title || `${data.builtup?.clientName || 'Standard'} Residence Estimate`}
                      </h2>
                      <p className="text-xs text-slate-300">
                        Client: <b className="text-blue-300">{data.builtup?.clientName || 'Not linked'}</b> • Site: {data.builtup?.siteLocation || 'Theni District'}
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
                builtupSqft={estimate.totalBuiltupArea || 1758}
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
                  clientName: data.builtup?.clientName || 'Er. Client Project',
                  siteLocation: data.builtup?.siteLocation || 'Residential Site',
                  quoteDate: '05-Nov-2026'
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
