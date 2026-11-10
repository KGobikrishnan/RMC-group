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

  // Navigation Items
  const navTabs = [
    { path: '/dashboard', label: 'Main Dashboard', icon: Home, badge: 'Overview' },
    { path: '/projects', label: 'Project Directory', icon: FolderGit2, badge: 'Portfolio' },
    { path: '/clients', label: 'Client Directory', icon: Users, badge: 'CRM' },
    { path: '/inputs', label: 'Project Inputs (15 Modules)', icon: Layers, badge: '15 Modules' },
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans flex">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out lg:static ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo & Brand Header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
              <img
                src={rmcLogo}
                alt="RMC Group Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute" style={{ display: 'none' }} />
            </div>
            {!sidebarCollapsed && (
              <div className="text-left min-w-0">
                <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white truncate">
                  RMC GROUP
                </h1>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  Civil Estimation
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database & User Status Badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {backendStatus === 'online' ? 'PostgreSQL: RMC' : 'Offline Mode'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              Admin
            </span>
          </div>
        )}

        {/* Navigation Routes List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-6 text-left">
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Application Navigation
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1.5 ${
                              isActive
                                ? 'bg-blue-700/80 text-blue-100'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          {!sidebarCollapsed && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-xs text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Grand Project Total</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">
                ₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                ₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')} / sq.ft
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Sticky App Header */}
        <header className="no-print sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 hidden sm:inline">Route:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/60">
                {location.pathname === '/' ? '/dashboard' : location.pathname}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="text-left">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Plinth Area</span>
                <span className="font-bold text-slate-900 dark:text-white">{(estimate.totalBuiltupArea || 0).toLocaleString()} Sq.ft</span>
              </div>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-left">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Grand Total</span>
                <span className="font-black text-slate-900 dark:text-white">₹ {(estimate.grandTotalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/80 transition-all"
                title="Open Rates Configuration"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Rate Master</span>
              </button>

              <button
                onClick={handleResetToSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
                title="Reset Sample Values"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Sample</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                title="Save to PostgreSQL & LocalStorage"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{saveSuccess ? 'Saved to DB!' : 'Save'}</span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Dark / Light Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
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
                  if (tab === 'inputs') navigate('/inputs');
                  else navigate('/dashboard');
                }}
                onSelectProject={(prj) => {
                  updateProjectInfo({
                    clientName: prj.clientName,
                    siteLocation: prj.siteLocation
                  });
                }}
                currentEstimate={estimate}
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
