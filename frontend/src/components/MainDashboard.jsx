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
      color: 'from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/40 text-amber-300',
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
      colorText: 'text-emerald-400',
      badge: 'Profit'
    }
  ];

  // Quick module navigation cards
  const moduleCards = [
    { id: 'sec1', num: '01', title: 'Built-Up Area', desc: 'Outer-to-outer floors', val: `${Math.round(totalBuiltup)} Sq.ft`, icon: Maximize2, color: 'text-amber-400' },
    { id: 'sec2', num: '02', title: 'Footings & Column Stubs', desc: `${estimate.totalColumnsCount || 8} Isolated Footings`, val: `${Math.round(estimate.totalFootingConcreteCft || 0)} CFT`, icon: Box, color: 'text-indigo-400' },
    { id: 'sec3', num: '03', title: 'Plinth Beams', desc: `${Math.round(estimate.totalPbLength || 201)} RFT Beams`, val: `${Math.round(estimate.totalPlinthConcreteCft || 0)} CFT`, icon: Building2, color: 'text-emerald-400' },
    { id: 'sec4', num: '04', title: 'Basement & Backfilling', desc: 'Flyash masonry & gravel', val: `${Math.round(estimate.basementGravelCft || 0)} CFT`, icon: Grid, color: 'text-purple-400' },
    { id: 'sec5', num: '05', title: 'Superstructure Brickwork', desc: '9" & 4.5" Chamber Bricks', val: `${Math.round(estimate.brickwork?.chamberBricksNos || 0).toLocaleString()} Nos`, icon: Hammer, color: 'text-rose-400' },
    { id: 'sec6', num: '06', title: 'Plastering Works', desc: '1:3 Ceiling & 1:6 Walls', val: `${Math.round(estimate.plastering?.totalPlasteringSqft || 0)} Sq.ft`, icon: Layers, color: 'text-amber-400' },
    { id: 'sec7', num: '07', title: 'Sill & Lintel Bands', desc: 'Continuous RCC Bands', val: 'RCC Band', icon: ShieldCheck, color: 'text-teal-400' },
    { id: 'sec8', num: '08', title: 'Tiles & Finishes', desc: 'Vitrified & Granite', val: 'Finishes', icon: Grid, color: 'text-cyan-400' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* 1. ARCHITECTURAL HERO BANNER */}
      <div className="p-7 sm:p-9 rounded-3xl bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 text-white shadow-2xl relative overflow-hidden group">
        {/* Subtle grid pattern inside card */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md text-xs font-mono font-bold border border-slate-700/60">
              <GreetingIcon className={`w-3.5 h-3.5 ${greeting.color}`} />
              <span className="text-slate-300">{greeting.text}!</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">ENGINEERING SUITE</span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {greeting.text}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100">{clientName || "Valued Client"}</span> 👋
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Civil estimation and structural BOQ for <span className="font-semibold text-slate-200">{siteLocation || 'site location'}</span> strictly audited against <span className="font-mono text-amber-400">03-11-2026_BRICK_ESTIMATE.xlsm</span>.
            </p>
          </div>

          {/* Quick Deliverable Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setActiveTab('quotation')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Client Quotation</span>
            </button>
            <button
              onClick={() => setActiveTab('breakup')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-bold border border-slate-700/80 transition-all"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Profit Simulator</span>
            </button>
          </div>
        </div>

        {/* Project Meta Details Bar inside Banner */}
        <div className="mt-7 pt-5 border-t border-slate-800/90 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Client / Lead</span>
              <span className="font-bold text-white truncate">{clientName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Site Location</span>
              <span className="font-bold text-white truncate">{siteLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300 justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Contact</span>
                <span className="font-bold text-white font-mono">{contactNumber}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline"
            >
              {isEditingInfo ? 'Close' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Editable Form Drawer if editing */}
        {isEditingInfo && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">Site Location</label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl transition-colors shadow-sm"
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
                ? 'bg-gradient-to-br from-amber-500/15 via-[#0f172a] to-slate-950 border-amber-500/30 text-white shadow-xl shadow-amber-500/5'
                : 'bg-[#0f172a]/80 backdrop-blur-md border-slate-800/80 shadow-sm hover:border-slate-700/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${s.highlight ? 'text-amber-400' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {s.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    s.highlight 
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}>
                    {s.badge}
                  </span>
                )}
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${s.highlight ? 'text-amber-300' : s.colorText || 'text-white'}`}>
                {s.val}
              </div>
            </div>
            <div className={`text-xs mt-3 pt-2.5 border-t font-mono font-semibold ${
              s.highlight 
                ? 'border-amber-500/20 text-amber-200/80' 
                : 'border-slate-800 text-slate-400'
            }`}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 3. PROJECT PROGRESS MILESTONES & SPECIFIED MATERIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestone Phases */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Construction Milestone Roadmap</h3>
                <p className="text-xs text-slate-400">Milestone payment schedule based on official contract quote</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              4 STAGES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-400">Stage 1: Advance Token</span>
                <span className="font-mono font-black text-white px-2 py-0.5 rounded bg-slate-800">10%</span>
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Upon signing contract agreement and soil hard-stratum survey.
              </div>
              <div className="text-base font-black font-mono text-white pt-1">
                ₹ {Math.round(totalCost * 0.10).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-400">Stage 2: Plinth Level</span>
                <span className="font-mono font-black text-white px-2 py-0.5 rounded bg-slate-800">20%</span>
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Footings, column stubs, plinth beams, and basement gravel filling.
              </div>
              <div className="text-base font-black font-mono text-white pt-1">
                ₹ {Math.round(totalCost * 0.20).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-400">Stage 3: Roof Slab</span>
                <span className="font-mono font-black text-white px-2 py-0.5 rounded bg-slate-800">30%</span>
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Superstructure brickwork walls, lintel beams & RCC roof casting.
              </div>
              <div className="text-base font-black font-mono text-white pt-1">
                ₹ {Math.round(totalCost * 0.30).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-400">Stage 4: Handover</span>
                <span className="font-mono font-black text-white px-2 py-0.5 rounded bg-slate-800">40%</span>
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Plastering, vitrified flooring, doors/windows, MEP & painting.
              </div>
              <div className="text-base font-black font-mono text-white pt-1">
                ₹ {Math.round(totalCost * 0.40).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Standard Materials Card */}
        <div className="p-6 rounded-3xl bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Specified Materials</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              GRADE 53 DALMIA
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Cement:</span>
              <span className="font-bold text-white text-right">Dalmia / UltraTech Grade 53</span>
            </div>
            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Steel Rebar:</span>
              <span className="font-bold text-white text-right">ARS Fe550D ISI TMT</span>
            </div>
            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Basement Bricks:</span>
              <span className="font-bold text-white text-right">Flyash High Strength</span>
            </div>
            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Superstructure:</span>
              <span className="font-bold text-white text-right">Red Chamber 9" & 4.5"</span>
            </div>
            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Plastering Sand:</span>
              <span className="font-bold text-white text-right">Fine P-Sand</span>
            </div>
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-400 font-medium">Concrete Sand:</span>
              <span className="font-bold text-white text-right">M-Sand Zone II</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('bom')}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <span>View Full Materials BOM</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 4. QUICK MODULE NAVIGATION GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Quick Module Shortcuts (Modules 1 to 15)</h3>
          <button
            onClick={() => setActiveTab('inputs')}
            className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
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
                className="p-4 rounded-2xl bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/50 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-amber-400 transition-colors">
                    {m.num}
                  </span>
                </div>
                <div className="font-bold text-white truncate pt-1">
                  {m.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {m.desc}
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono font-extrabold text-amber-400">
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

