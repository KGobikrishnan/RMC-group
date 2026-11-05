import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sunset, 
  Sparkles, 
  Building2, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Sliders, 
  Hammer, 
  Grid, 
  Box, 
  Percent, 
  ChevronRight,
  Clock,
  HardHat
} from 'lucide-react';

export function ProjectMainDashboard({ data, estimate, rates, setActiveTab, scrollToModule, updateProjectInfo }) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [clientName, setClientName] = useState(data.projectInfo?.clientName || "Er. M. Jahir Hussain");
  const [siteLocation, setSiteLocation] = useState(data.projectInfo?.siteLocation || "Building Doctor Complex, Uthamapalayam - 625533");
  const [contactNumber, setContactNumber] = useState(data.projectInfo?.contactNumber || "9489141122 / 9111493336");

  // Determine dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: 'Good Morning', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-500/10' };
    } else if (hour < 17) {
      return { text: 'Good Afternoon', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500/10' };
    } else {
      return { text: 'Good Evening', icon: Sunset, color: 'text-orange-400', bg: 'bg-orange-500/10' };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const handleSaveInfo = () => {
    if (updateProjectInfo) {
      updateProjectInfo({
        clientName,
        siteLocation,
        contactNumber,
      });
    }
    setIsEditingInfo(false);
  };

  const totalCost = estimate.grandTotalCost || 0;
  const directCivil = estimate.totalDirectCost || (totalCost / (1 + (rates.contractorMarginPct || 10) / 100));
  const profitMarkup = totalCost - directCivil;
  const gfArea = estimate.gfArea || 858;
  const totalBuiltup = estimate.totalBuiltupArea || 1758;
  const ratePerSqft = gfArea > 0 ? (totalCost / gfArea) : 0;

  // Key quick metrics cards
  const stats = [
    {
      label: 'Total Project Estimate',
      val: `₹ ${(totalCost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `₹ ${Math.round(ratePerSqft).toLocaleString('en-IN')} / sq.ft`,
      highlight: true,
      color: 'from-blue-600 via-indigo-600 to-indigo-800 text-white',
      badge: `${rates.contractorMarginPct || 10}% Markup Incl.`
    },
    {
      label: 'Contract Plinth Area',
      val: `${Math.round(gfArea)} Sq.ft`,
      sub: `Total Built-Up: ${Math.round(totalBuiltup)} Sq.ft`,
      icon: Maximize2,
      badge: 'Ground Floor'
    },
    {
      label: 'Direct Construction Cost',
      val: `₹ ${(directCivil).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: 'Base Material + Labour',
      icon: Hammer,
      badge: 'Direct'
    },
    {
      label: 'Contractor Profit Yield',
      val: `+ ₹ ${(profitMarkup).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `${rates.contractorMarginPct || 10}% Contractor Margin`,
      icon: TrendingUp,
      colorText: 'text-emerald-600 dark:text-emerald-400',
      badge: 'Profit'
    }
  ];

  // Quick module navigation cards
  const moduleCards = [
    { id: 'sec1', num: '1', title: 'Built-Up Area', desc: 'Outer-to-outer floors', val: `${Math.round(totalBuiltup)} Sq.ft`, icon: Maximize2, color: 'text-blue-500' },
    { id: 'sec2', num: '2', title: 'Footings & Column Stubs', desc: `${estimate.totalColumnsCount || 8} Isolated Footings`, val: `${Math.round(estimate.totalFootingConcreteCft || 0)} CFT`, icon: Box, color: 'text-indigo-500' },
    { id: 'sec3', num: '3', title: 'Plinth Beams', desc: `${Math.round(estimate.totalPbLength || 201)} RFT Beams`, val: `${Math.round(estimate.totalPlinthConcreteCft || 0)} CFT`, icon: Building2, color: 'text-emerald-500' },
    { id: 'sec4', num: '4', title: 'Basement & Backfilling', desc: 'Flyash masonry & gravel', val: `${Math.round(estimate.basementGravelCft || 0)} CFT`, icon: Grid, color: 'text-purple-500' },
    { id: 'sec5', num: '5', title: 'Superstructure Brickwork', desc: '9" & 4.5" Chamber Bricks', val: `${Math.round(estimate.brickwork?.chamberBricksNos || 0).toLocaleString()} Nos`, icon: Hammer, color: 'text-rose-500' },
    { id: 'sec6', num: '6', title: 'Plastering Works', desc: '1:3 Ceiling & 1:6 Walls', val: `${Math.round(estimate.plastering?.totalPlasteringSqft || 0)} Sq.ft`, icon: Layers, color: 'text-amber-500' },
    { id: 'sec7', num: '7', title: 'Sill & Lintel Bands', desc: 'Continuous RCC Bands', val: 'RCC Band', icon: ShieldCheck, color: 'text-teal-500' },
    { id: 'sec8', num: '8', title: 'Tiles & Finishes', desc: 'Vitrified & Granite', val: 'Finishes', icon: Grid, color: 'text-cyan-500' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* 1. GREETING HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/10">
              <GreetingIcon className={`w-4 h-4 ${greeting.color}`} />
              <span className="text-indigo-200">{greeting.text}!</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-300">Welcome to RMC Civil Engine</span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {greeting.text}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-300">{clientName || "Valued Client"}</span> 👋
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              Your civil estimation and construction prototype for <span className="font-bold text-white">{siteLocation || 'your residential site'}</span> is fully synchronized with audited Excel standards.
            </p>
          </div>

          {/* Quick Deliverable Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('quotation')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Client Quotation</span>
            </button>
            <button
              onClick={() => setActiveTab('breakup')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Profit Simulator</span>
            </button>
          </div>
        </div>

        {/* Project Meta Details Bar inside Banner */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-200">
            <User className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-indigo-300/70 block uppercase font-bold">Client / Lead</span>
              <span className="font-bold text-white truncate">{clientName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-indigo-200">
            <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-indigo-300/70 block uppercase font-bold">Site Location</span>
              <span className="font-bold text-white truncate">{siteLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-indigo-200 justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-indigo-300/70 block uppercase font-bold">Contact</span>
                <span className="font-bold text-white">{contactNumber}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline"
            >
              {isEditingInfo ? 'Close' : 'Edit Info'}
            </button>
          </div>
        </div>

        {/* Editable Form Drawer if editing */}
        {isEditingInfo && (
          <div className="mt-4 p-4 rounded-2xl bg-white/10 border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">Site Location</label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>
              <button
                onClick={handleSaveInfo}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. STATS KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              s.highlight
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-blue-500/10 border-transparent'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${s.highlight ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {s.label}
                </span>
                {s.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    s.highlight 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {s.badge}
                  </span>
                )}
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${s.highlight ? 'text-white' : s.colorText || 'text-slate-900 dark:text-white'}`}>
                {s.val}
              </div>
            </div>
            <div className={`text-xs mt-3 pt-2.5 border-t font-semibold ${
              s.highlight 
                ? 'border-white/20 text-blue-100' 
                : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 3. PROJECT PROGRESS MILESTONES & QUICK SPECS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestone Phases */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Construction Milestone Roadmap</h3>
                <p className="text-xs text-slate-500">Milestone payment schedule based on official contract quote</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg">
              4 Stages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-600">Stage 1: Advance Token</span>
                <span className="font-black text-slate-900 dark:text-white">10%</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                Upon signing contract agreement and soil hard-stratum survey.
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                ₹ {Math.round(totalCost * 0.10).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-600">Stage 2: Plinth Level</span>
                <span className="font-black text-slate-900 dark:text-white">20%</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                Footings, column stubs, plinth beams, and basement gravel filling.
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                ₹ {Math.round(totalCost * 0.20).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-600">Stage 3: Roof Slab</span>
                <span className="font-black text-slate-900 dark:text-white">30%</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                Superstructure brickwork walls, lintel beams & RCC roof casting.
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                ₹ {Math.round(totalCost * 0.30).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-600">Stage 4: Handover</span>
                <span className="font-black text-slate-900 dark:text-white">40%</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                Plastering, vitrified flooring, doors/windows, MEP & painting.
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                ₹ {Math.round(totalCost * 0.40).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Standard Materials Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Specified Materials</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              Grade 53 Dalmia
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Cement:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">Dalmia / UltraTech Grade 53</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Steel Rebar:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">ARS Fe550D ISI TMT</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Basement Bricks:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">Flyash High Strength</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Superstructure:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">Red Chamber 9" & 4.5"</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Plastering Sand:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">Fine P-Sand</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-semibold">Concrete Sand:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">M-Sand Zone II</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('bom')}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Full Materials BOM</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. QUICK MODULE NAVIGATION GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Module Shortcuts (Modules 1 to 15)</h3>
          <button
            onClick={() => setActiveTab('inputs')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open All Project Inputs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-xs">
          {moduleCards.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => scrollToModule(m.id)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-500 transition-colors">
                    #{m.num}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white truncate">
                  {m.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {m.desc}
                </div>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                  {m.val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

