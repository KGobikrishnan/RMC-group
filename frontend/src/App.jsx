import React, { useState, useEffect, useMemo } from 'react';
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
  Compass
} from 'lucide-react';

import { DEFAULT_RATES, INITIAL_PROJECT_DATA } from './data/initialData';
import { calculateSubstructureAudit } from './utils/calculator';
import RateMasterModal from './components/RateMasterModal';
import { 
  TotalAreaModule, 
  FootingModule, 
  PlinthBeamModule, 
  BasementModule 
} from './components/StepperForms';

const STORAGE_KEY_DATA = 'rmc_substructure_audit_v3';
const STORAGE_KEY_RATES = 'rmc_substructure_rates_v3';

// Deliverables tabs (disabled for now, can be toggled on anytime)
const ENABLE_DELIVERABLES_TABS = false;

export default function App() {
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

  const [activeTab, setActiveTab] = useState('inputs');
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rmc_dark', String(darkMode));
  }, [darkMode]);

  // Reactive Calculation Engine (Audited against Excel)
  const estimate = useMemo(() => {
    return calculateSubstructureAudit(data, rates);
  }, [data, rates]);

  // Updaters
  const updateBuiltup = (newBuiltup) => {
    setData(prev => ({ ...prev, builtup: newBuiltup }));
  };

  const updateFootings = (newFootings) => {
    setData(prev => ({ ...prev, footings: newFootings }));
  };

  const updatePlinthBeam = (newPlinthBeam) => {
    setData(prev => ({ ...prev, plinthBeam: newPlinthBeam }));
  };

  const updateBasement = (newBasement) => {
    setData(prev => ({ ...prev, basement: newBasement }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetToSample = () => {
    if (window.confirm("Standard sample data (Area + Footings + Plinth + Basement) reload panna poroma?")) {
      setData(INITIAL_PROJECT_DATA);
      setRates(DEFAULT_RATES);
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_RATES);
    }
  };

  const allTabs = [
    { id: 'inputs', label: 'Civil Inputs (4 Modules)', icon: Layers, badge: 'Active', disabled: false },
    { id: 'dashboard', label: 'Foundation Summary', icon: PieChart, disabled: !ENABLE_DELIVERABLES_TABS },
    { id: 'boq', label: 'Foundation BOQ', icon: FileSpreadsheet, badge: '12 Items', disabled: !ENABLE_DELIVERABLES_TABS },
    { id: 'bom', label: 'Materials BOM', icon: Box, badge: 'Procurement', disabled: !ENABLE_DELIVERABLES_TABS },
    { id: 'quotation', label: 'Client Quotation', icon: FileText, badge: 'Print PDF', disabled: !ENABLE_DELIVERABLES_TABS },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                  RMC Substructure Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Modules 1 to 4 Audited
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                AutoCAD Plan: Total Area, Footings, Plinth Beam & Basement Flyash Masonry
              </div>
            </div>
          </div>

          {/* Quick Header Metric Badges */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Built-Up</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {Math.round(estimate.totalBuiltupArea)} Sq.ft
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Plinth Beam Conc</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(estimate.plinthConcreteCft * 10) / 10} CFT
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Basement Flyash</span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {Math.round(estimate.basementFlyashBricksNos).toLocaleString()} Bricks
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Substructure Total</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                ₹ {Math.round(estimate.grandTotalCost).toLocaleString('en-IN')}
              </span>
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
              title="Save to LocalStorage"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saveSuccess ? 'Saved!' : 'Save'}</span>
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

      {/* Tab Navigation (Disabled Deliverable Tabs Shown as Inactive / Locked) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <nav className="flex space-x-2 py-2">
            {allTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDisabled = tab.disabled;

              return (
                <button
                  key={tab.id}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  title={isDisabled ? 'Disabled for now (can be enabled later)' : ''}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isDisabled
                        ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive 
                        ? 'bg-blue-700/80 text-blue-100' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isDisabled && (
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider ml-1 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ACTIVE TAB: All 4 Substructure Modules */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            {/* Quick Live Substructure Quantities Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Built-Up Area</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                  {Math.round(estimate.totalBuiltupArea)} Sq.ft
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Footing Concrete (M20)</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {Math.round(estimate.totalFootingConcreteCft)} CFT
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Plinth Concrete (M20)</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round(estimate.plinthConcreteCft * 10) / 10} CFT
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Basement Flyash Bricks</span>
                <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                  {Math.round(estimate.basementFlyashBricksNos).toLocaleString()} Nos
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Basement Gravel Filling</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {Math.round(estimate.basementGravelCft)} CFT
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Substructure Quote</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹ {Math.round(estimate.grandTotalCost).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* MODULE 1: Total Built-Up Area */}
            <TotalAreaModule builtup={data.builtup} updateBuiltup={updateBuiltup} />

            {/* MODULE 2: Footing & Column Schedule */}
            <FootingModule footings={data.footings} updateFootings={updateFootings} />

            {/* MODULE 3: Plinth Beam Calculation */}
            <PlinthBeamModule 
              plinthBeam={data.plinthBeam} 
              updatePlinthBeam={updatePlinthBeam} 
              estimate={estimate} 
            />

            {/* MODULE 4: Basement Flyash Brickwork Details */}
            <BasementModule 
              basement={data.basement} 
              updateBasement={updateBasement} 
              estimate={estimate} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built with React & Tailwind CSS • Audited from <span className="font-semibold text-slate-700 dark:text-slate-300">03-11-2026_BRICK_ESTIMATE.xlsm</span>
          </div>
          <div>
            RM Construction & Structural Engineering Consultancy • Modules 1, 2, 3 & 4
          </div>
        </div>
      </footer>

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
