import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  Box, 
  Hammer, 
  Paintbrush, 
  PlusCircle, 
  FileSpreadsheet, 
  PieChart, 
  FileText, 
  Sliders, 
  RotateCcw, 
  Moon, 
  Sun, 
  Printer, 
  ChevronRight, 
  HardHat,
  Sparkles,
  Save,
  Check
} from 'lucide-react';

import { DEFAULT_RATES, INITIAL_PROJECT_DATA } from './data/initialData';
import { calculateCivilEstimate } from './utils/calculator';
import RateMasterModal from './components/RateMasterModal';
import { 
  ProjectStep, 
  SubstructureStep, 
  SuperstructureStep, 
  BeamsPlasteringStep, 
  FinishesStep, 
  AdditionalWorksStep 
} from './components/StepperForms';
import { 
  DashboardView, 
  BOQView, 
  BOMView, 
  CostBreakupView, 
  QuotationView 
} from './components/DeliverablesViews';

const STORAGE_KEY_DATA = 'rmc_estimate_data_v1';
const STORAGE_KEY_RATES = 'rmc_estimate_rates_v1';

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

  // UI Navigation
  const [activeTab, setActiveTab] = useState('dashboard'); // 'inputs' | 'dashboard' | 'boq' | 'bom' | 'breakup' | 'quotation'
  const [activeStep, setActiveStep] = useState(1);
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

  // Reactive Calculation Engine
  const estimate = useMemo(() => {
    return calculateCivilEstimate(data, rates);
  }, [data, rates]);

  // Generic Data Updater
  const updateData = (section, payload) => {
    setData(prev => {
      const updated = { ...prev, [section]: payload };
      return updated;
    });
  };

  // Save to LocalStorage
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Reset to Default Sample
  const handleResetToSample = () => {
    if (window.confirm("Reload standard 1,748 sq.ft engineering sample dataset? Any unsaved edits will be refreshed.")) {
      setData(INITIAL_PROJECT_DATA);
      setRates(DEFAULT_RATES);
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_RATES);
    }
  };

  const steps = [
    { num: 1, name: 'Project & Built-Up', desc: 'Outer dimensions', icon: Building2 },
    { num: 2, name: 'Substructure', desc: 'Footings & Plinth', icon: Layers },
    { num: 3, name: 'Masonry & Openings', desc: '9" walls & Doors', icon: Box },
    { num: 4, name: 'Beams & Slabs', desc: 'Lintels & Roof RCC', icon: Hammer },
    { num: 5, name: 'Finishes & Stairs', desc: 'Tiles, Granite, Paint', icon: Paintbrush },
    { num: 6, name: 'Ancillary Works', desc: 'Sump & Septic Tank', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  RMC Civil Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  v2.6 Enterprise
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                AutoCAD Plan to BOQ / BOM / Cost-Per-Sq.ft Engine
              </div>
            </div>
          </div>

          {/* Quick Header Metric Badge */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Estimate</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                ₹ {Math.round(estimate.overallTotalEstimate).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Rate / Sq.ft</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                ₹ {Math.round(estimate.costPerSqft).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Rate Master Drawer Trigger */}
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/80 transition-all"
              title="Open Rate Master & Unit Config"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Rate Master</span>
            </button>

            {/* Load Sample Button */}
            <button
              onClick={handleResetToSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
              title="Reset to 1,748 sq.ft Sample Estimate"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sample Data</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
              title="Save changes to LocalStorage"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>

            {/* Dark Mode Toggle */}
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

      {/* Main Tab Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <nav className="flex space-x-2 py-2">
            {[
              { id: 'dashboard', label: 'Summary Dashboard', icon: PieChart },
              { id: 'inputs', label: 'AutoCAD Inputs', icon: Layers, badge: `${estimate.totalBuiltupArea} sq.ft` },
              { id: 'boq', label: 'BOQ Civil Schedule', icon: FileSpreadsheet, badge: '43 Items' },
              { id: 'bom', label: 'BOM Procurement', icon: Box, badge: 'Materials' },
              { id: 'breakup', label: 'Cost / Sq.ft Breakup', icon: Building2 },
              { id: 'quotation', label: 'Client Quotation', icon: FileText, badge: 'PDF' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
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
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setActiveTab('quotation')}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Review Client Quotation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <DashboardView estimate={estimate} projectInfo={data.projectInfo} rates={rates} />
        )}

        {/* TAB 2: AUTOCAD PLAN STEPPER INPUTS */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            {/* Stepper Progress Header */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {steps.map((st) => {
                  const Icon = st.icon;
                  const isCurrent = activeStep === st.num;
                  const isDone = activeStep > st.num;
                  return (
                    <button
                      key={st.num}
                      onClick={() => setActiveStep(st.num)}
                      className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                        isCurrent 
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-2 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Step 0{st.num}</span>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{st.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{st.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Form Rendering */}
            <div>
              {activeStep === 1 && <ProjectStep data={data} updateData={updateData} />}
              {activeStep === 2 && <SubstructureStep data={data} updateData={updateData} />}
              {activeStep === 3 && <SuperstructureStep data={data} updateData={updateData} />}
              {activeStep === 4 && <BeamsPlasteringStep data={data} updateData={updateData} />}
              {activeStep === 5 && <FinishesStep data={data} updateData={updateData} />}
              {activeStep === 6 && <AdditionalWorksStep data={data} updateData={updateData} />}
            </div>

            {/* Stepper Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveStep(s => Math.max(1, s - 1))}
                disabled={activeStep === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous Step
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Summary Dashboard →
                </button>
                {activeStep < 6 ? (
                  <button
                    onClick={() => setActiveStep(s => Math.min(6, s + 1))}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('boq')}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    Generate BOQ Schedule →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOQ SCHEDULE VIEW */}
        {activeTab === 'boq' && (
          <BOQView boqSchedule={estimate.boqSchedule} />
        )}

        {/* TAB 4: BOM PROCUREMENT REQUISITION VIEW */}
        {activeTab === 'bom' && (
          <BOMView bomSummary={estimate.bomSummary} rates={rates} />
        )}

        {/* TAB 5: COST PER SQ.FT BREAKUP VIEW */}
        {activeTab === 'breakup' && (
          <CostBreakupView estimate={estimate} rates={rates} />
        )}

        {/* TAB 6: FORMAL CLIENT QUOTATION VIEW */}
        {activeTab === 'quotation' && (
          <QuotationView estimate={estimate} projectInfo={data.projectInfo} rates={rates} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built with React & Tailwind CSS • Modeled from <span className="font-semibold text-slate-700 dark:text-slate-300">03-11-2026_BRICK_ESTIMATE.xlsm</span>
          </div>
          <div>
            RM Construction & Structural Engineering Consultancy • Client-Side Reactive Engine
          </div>
        </div>
      </footer>

      {/* Global Rate Master Drawer / Modal */}
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
