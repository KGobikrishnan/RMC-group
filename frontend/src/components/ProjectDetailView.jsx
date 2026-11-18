import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  Printer, 
  FileText, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Box, 
  Hammer, 
  Grid, 
  Sliders, 
  ChevronRight,
  ChevronDown,
  Download,
  ShieldCheck,
  PackageCheck,
  Zap,
  Droplets,
  Paintbrush,
  ListOrdered,
  Eye,
  Check,
  ChevronUp,
  Sparkles,
  Info,
  Clock,
  Compass,
  FileCheck2
} from 'lucide-react';
import { calculateCivilEstimateComplete } from '../utils/calculator';
import { DEFAULT_RATES } from '../data/initialData';

export function ProjectDetailView({ project, onBack, onOpenQuotation, onEditProject }) {
  if (!project) return null;

  const estimateData = project.estimate_data || project.estimateData || {};
  const rates = { ...DEFAULT_RATES, ...(project.schedule_rates || project.scheduleRates || {}) };
  
  // Recalculate using audited engine to ensure 100% precision
  const estimate = calculateCivilEstimateComplete(estimateData, rates);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sections' | 'boq' | 'materials'
  const [openSections, setOpenSections] = useState({
    'sec-1': true,
    'sec-2': false,
    'sec-3': false,
    'sec-4': false,
    'sec-5': false,
    'sec-6': false,
    'sec-7': false,
    'sec-8': false,
    'sec-9': false,
    'sec-10': false,
    'sec-11': false,
    'sec-12': false,
    'sec-13': false,
    'sec-14': false,
    'sec-15': false,
  });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllSections = (expand) => {
    const newState = {};
    for (let i = 1; i <= 15; i++) {
      newState[`sec-${i}`] = expand;
    }
    setOpenSections(newState);
  };

  const clientName = project.client_name || estimateData.builtup?.clientName || 'Valued Client';
  const siteAddress = project.site_address || estimateData.builtup?.siteLocation || 'Site Location';
  const projectCode = project.project_code || 'RMC-EST';
  const projectTitle = project.title || 'Civil Estimate Project';
  const totalCost = Number(project.total_cost) || estimate.grandTotalCost || 0;
  const directCost = Number(project.direct_cost) || estimate.totalDirectCost || 0;
  const builtupSqft = Number(project.total_builtup_sqft) || estimate.totalBuiltupArea || 0;
  const gfArea = Number(project.gf_plinth_sqft) || estimate.gfArea || 0;
  const ratePerSqft = builtupSqft > 0 ? (totalCost / builtupSqft) : 0;
  const marginPct = rates.contractorMarginPct ?? 10;
  const marginAmount = totalCost - directCost;

  // 15 Stage modules summarized
  const modulesList = [
    {
      id: 'sec-1',
      no: '01',
      title: 'Built-Up Area & Plinth Footprint',
      category: 'Planning & Footprint',
      cost: null,
      summary: `${Math.round(builtupSqft).toLocaleString('en-IN')} Sq.ft Total`,
      highlight: `GF: ${Math.round(gfArea).toLocaleString('en-IN')} Sq.ft`,
      desc: 'Outer-to-outer AutoCAD measurements floor by floor'
    },
    {
      id: 'sec-2',
      no: '02',
      title: 'Footings & Column Substructure',
      category: 'Foundation',
      cost: Math.round((estimate.footingTotalCost || 0) + (estimate.colTotalCost || 0) + (estimate.pccTotalCost || 0) + (estimate.excavationLabCost || 0) + (estimate.backfillingLabCost || 0)),
      summary: `${estimate.totalColumnsCount || 8} Columns (${(estimate.totalFootingConcreteCft || 0).toFixed(1)} CFT M20)`,
      highlight: `${(estimate.footingRebarKg || 0).toFixed(0)} kg Rebar`,
      desc: 'Excavation, PCC 1:4:8 bed, trapezoidal footings & column stubs'
    },
    {
      id: 'sec-3',
      no: '03',
      title: 'Plinth Ring & Tie Beams',
      category: 'Foundation',
      cost: Math.round((estimate.plinthConcreteTotalCost || 0) + (estimate.plinthExcavationLabCost || 0)),
      summary: `${estimate.totalPbLength || 0} RFT Beam Length`,
      highlight: `${(estimate.totalPlinthConcreteCft || 0).toFixed(1)} CFT Concrete`,
      desc: 'Trench excavation, M20 beam concrete and continuous steel cage'
    },
    {
      id: 'sec-4',
      no: '04',
      title: 'Basement Masonry & Plinth Filling',
      category: 'Substructure',
      cost: Math.round((estimate.basementBrickworkTotalCost || 0) + (estimate.basementPlasterTotalCost || 0) + (estimate.basementGravelTotalCost || 0) + (estimate.basementMsandMatCost || 0) + (estimate.flooringPccTotalCost || 0)),
      summary: `${(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} Flyash Bricks`,
      highlight: `${(estimate.basementGravelCft || 0).toFixed(0)} CFT Gravel`,
      desc: 'Flyash brick masonry, both side plastering, morrum/gravel filling & flooring PCC'
    },
    {
      id: 'sec-5',
      no: '05',
      title: 'Superstructure Brickwork (9" & 4.5")',
      category: 'Masonry',
      cost: Math.round(estimate.chamberBrickworkTotalCost || 0),
      summary: `${(estimate.chamberBricksNos || 0).toLocaleString('en-IN')} Chamber Bricks`,
      highlight: `${(estimate.netBrickworkCft || 0).toFixed(1)} CFT Masonry`,
      desc: 'First class red chamber bricks in CM 1:6 after openings deduction'
    },
    {
      id: 'sec-6',
      no: '06',
      title: 'Plastering Work (Ceiling & Walls)',
      category: 'Finishes',
      cost: Math.round((estimate.ceilingPlasterTotalCost || 0) + (estimate.wallPlasterTotalCost || 0)),
      summary: `${Math.round((estimate.totalCeilingSqft || 0) + (estimate.netInnerPlasteringSqft || 0) + (estimate.totalOuterPlasteringSqft || 0)).toLocaleString('en-IN')} Sq.ft Total`,
      highlight: `Ceiling 1:3 + Walls 1:6`,
      desc: 'Internal smooth sponge finish & external weatherproof sand face'
    },
    {
      id: 'sec-7',
      no: '07',
      title: 'Sill Beam, Lintel Beam & Lofts',
      category: 'RCC Elements',
      cost: Math.round((estimate.sillTotalCost || 0) + (estimate.lintelTotalCost || 0) + (estimate.loftsTotalCost || 0)),
      summary: `${estimate.lintelLen || 0} RFT Lintel + ${estimate.sillLen || 0} RFT Sill`,
      highlight: `${(estimate.loftsSteelKg || 0 + estimate.lintelSteelKg || 0).toFixed(0)} kg Steel`,
      desc: 'Continuous sill band, full perimeter lintel beam and kitchen/room lofts'
    },
    {
      id: 'sec-8',
      no: '08',
      title: 'Tiles & Granite Work',
      category: 'Flooring & Wall',
      cost: Math.round(estimate.totalTilesCost || 0),
      summary: `${Math.round(estimate.tileFlooringSqft || 0)} Sq.ft Flooring`,
      highlight: `Granite + Dadoing`,
      desc: 'Vitrified living/bed tiles, anti-skid toilet tiles, 7ft dadoing & kitchen granite'
    },
    {
      id: 'sec-9',
      no: '09',
      title: 'Doors & Windows Joinery',
      category: 'Carpentry & UPVC',
      cost: Math.round(estimate.totalJoineryCost || 0),
      summary: `${estimate.itemizedJoinery?.length || 5} Fixture Types`,
      highlight: `Teak + UPVC`,
      desc: 'Main Teak door, flush doors, waterproof PVC bathroom doors & UPVC sliding windows'
    },
    {
      id: 'sec-10',
      no: '10',
      title: 'Roof Slab & Roof Beams (M20)',
      category: 'RCC Structure',
      cost: Math.round(estimate.totalRoofConcreteCost || 0),
      summary: `${(estimate.totalRoofConcreteVolumeCft || 0).toFixed(1)} CFT Concrete`,
      highlight: `${(estimate.roofSteelKg || 0).toFixed(0)} kg Rebar`,
      desc: '5" RCC monolithic roof slab and roof beams with ARS Fe550D TMT reinforcement'
    },
    {
      id: 'sec-11',
      no: '11',
      title: 'Painting Work',
      category: 'Finishes',
      cost: Math.round(estimate.totalPaintingCost || 0),
      summary: `Inner, Outer & Ceiling`,
      highlight: `Apex Weatherproof`,
      desc: '2 coats interior putty, primer, emulsion and exterior weatherproof Apex'
    },
    {
      id: 'sec-12',
      no: '12',
      title: 'Staircase Works',
      category: 'Circulation',
      cost: Math.round(estimate.totalStaircaseCost || 0),
      summary: `${estimate.scStepsCount || 18} Steps + Handrail`,
      highlight: `Black Granite + SS`,
      desc: 'Brickwork steps, 6" RCC waist slab, granite cladding and SS 304 safety railing'
    },
    {
      id: 'sec-13',
      no: '13',
      title: 'Electrical & Plumbing MEP',
      category: 'Services',
      cost: Math.round(estimate.electricalTotalCost || 0),
      summary: `Turnkey Concealed MEP`,
      highlight: `₹${rates.electricalPlumbingRate || 200}/sq.ft`,
      desc: 'Concealed wiring, modular switches, CPVC water distribution & sanitary fittings'
    },
    {
      id: 'sec-14',
      no: '14',
      title: 'Terrace Weathering & Surkhi',
      category: 'Roof Finishes',
      cost: Math.round(estimate.terraceSurkhiTotalCost || 0),
      summary: `${(estimate.terraceSurkhiSqft || 0).toFixed(0)} Sq.ft Slab Area`,
      highlight: `3" Chips Bed`,
      desc: 'Brickbat surkhi concrete bed with waterproofing slope and rainwater drains'
    },
    {
      id: 'sec-15',
      no: '15',
      title: 'Site Infrastructure & External',
      category: 'External Works',
      cost: Math.round(estimate.totalAdditionalCost || 0),
      summary: `${estimate.itemizedAdditional?.length || 8} Site Items`,
      highlight: `Sump, Tank, Wall`,
      desc: 'UG Sump, Septic tank, overhead tank stand, compound wall, soakpit, ramp & gate'
    }
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-[#f1f5f3] hover:bg-[#e2e9e6] text-[#293936] transition-colors shrink-0 mt-0.5"
            title="Back to Project Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                {projectCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#f1f5f3] text-[#293936] font-semibold border border-[#e2e9e6]">
                {project.project_type || 'Residential Villa'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Audited Excel Formulas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#17211f] tracking-tight">
              {projectTitle}
            </h1>
            <div className="flex items-center gap-4 text-xs text-[#667772] pt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#0f766e]" />
                <b>{clientName}</b>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0f766e]" />
                <span>{siteAddress}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          {onEditProject && (
            <button
              onClick={() => onEditProject(project)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#f1f5f3] hover:bg-[#e2e9e6] text-[#17211f] border border-[#e2e9e6] text-xs font-bold transition-all shadow-sm"
              title="Open the 15-module modal to edit measurements"
            >
              <Sliders className="w-4 h-4 text-[#0f766e]" />
              <span>Edit Measurements</span>
            </button>
          )}
          <button
            onClick={() => onOpenQuotation && onOpenQuotation(project)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-extrabold shadow-md shadow-[#0f766e]/20 transition-all"
            title="Generate Client PDF Quotation"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Quote</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS DASHBOARD (4 Key Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cost Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0f766e] to-[#115e59] text-white shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/80 font-bold uppercase tracking-wider">
            <span>Total Estimated Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-white">
            ₹ {Math.round(totalCost).toLocaleString('en-IN')}
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
            <span>Direct Works Cost:</span>
            <span className="font-mono font-bold">₹ {Math.round(directCost).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-white/90">
            <span>Contractor Margin:</span>
            <span className="font-mono font-bold text-amber-200">+{marginPct}% (₹ {Math.round(marginAmount).toLocaleString('en-IN')})</span>
          </div>
        </div>

        {/* Built-up & Square Foot Rate */}
        <div className="p-5 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#667772] font-bold uppercase tracking-wider">
            <span>Built-Up Area & Rate</span>
            <Maximize2 className="w-4 h-4 text-[#0f766e]" />
          </div>
          <div className="text-2xl font-black text-[#17211f] font-mono">
            {Math.round(builtupSqft).toLocaleString('en-IN')} <span className="text-sm font-semibold text-[#667772]">Sq.ft</span>
          </div>
          <div className="pt-2 border-t border-[#e2e9e6] flex items-center justify-between text-xs text-[#667772]">
            <span>Average Rate:</span>
            <b className="text-[#0f766e] font-mono">₹ {Math.round(ratePerSqft).toLocaleString('en-IN')} / sq.ft</b>
          </div>
          <div className="flex items-center justify-between text-xs text-[#667772]">
            <span>Ground Floor:</span>
            <span className="font-mono font-bold text-[#293936]">{Math.round(gfArea).toLocaleString('en-IN')} Sq.ft plinth</span>
          </div>
        </div>

        {/* Steel & Cement Materials Highlights */}
        <div className="p-5 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#667772] font-bold uppercase tracking-wider">
            <span>Major Structural Materials</span>
            <Box className="w-4 h-4 text-[#0f766e]" />
          </div>
          <div className="text-2xl font-black text-[#0f766e] font-mono">
            {(estimate.totalSteelTons || 0).toFixed(2)} <span className="text-sm font-semibold text-[#667772]">Tons Steel</span>
          </div>
          <div className="pt-2 border-t border-[#e2e9e6] flex items-center justify-between text-xs text-[#667772]">
            <span>Cement Bags:</span>
            <b className="text-[#17211f] font-mono">{Math.round(estimate.totalCementBags || 0).toLocaleString('en-IN')} Bags</b>
          </div>
          <div className="flex items-center justify-between text-xs text-[#667772]">
            <span>Chamber Bricks:</span>
            <b className="text-[#17211f] font-mono">{(estimate.totalChamberBricksNos || 0).toLocaleString('en-IN')} Nos</b>
          </div>
        </div>

        {/* Column & Structural Layout */}
        <div className="p-5 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#667772] font-bold uppercase tracking-wider">
            <span>Structure & Schedule</span>
            <Building2 className="w-4 h-4 text-[#0f766e]" />
          </div>
          <div className="text-2xl font-black text-[#17211f] font-mono">
            {estimate.totalColumnsCount || 8} <span className="text-sm font-semibold text-[#667772]">Columns</span>
          </div>
          <div className="pt-2 border-t border-[#e2e9e6] flex items-center justify-between text-xs text-[#667772]">
            <span>Floors:</span>
            <b className="text-[#293936]">{project.floors || 'G + 1 Floors'}</b>
          </div>
          <div className="flex items-center justify-between text-xs text-[#667772]">
            <span>Plinth Ring Beam:</span>
            <b className="text-[#0f766e] font-mono">{estimate.totalPbLength || 0} RFT</b>
          </div>
        </div>

      </div>

      {/* 3. CLEAN USER NAVIGATION TABS */}
      <div className="p-2 bg-white border border-[#e2e9e6] rounded-2xl flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-[#0f766e] text-white shadow-sm font-black'
                : 'text-[#667772] hover:text-[#17211f] hover:bg-[#f1f5f3]'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>15-Stage Summary Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'sections'
                ? 'bg-[#0f766e] text-white shadow-sm font-black'
                : 'text-[#667772] hover:text-[#17211f] hover:bg-[#f1f5f3]'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Detailed Section Accordions (1 to 15)</span>
          </button>

          <button
            onClick={() => setActiveTab('boq')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'boq'
                ? 'bg-[#0f766e] text-white shadow-sm font-black'
                : 'text-[#667772] hover:text-[#17211f] hover:bg-[#f1f5f3]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Full Civil BOQ ({estimate.boqSchedule?.length || 26} Items)</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'materials'
                ? 'bg-[#0f766e] text-white shadow-sm font-black'
                : 'text-[#667772] hover:text-[#17211f] hover:bg-[#f1f5f3]'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Materials Takeoff (BOM)</span>
          </button>
        </div>

        {activeTab === 'sections' && (
          <div className="hidden sm:flex items-center gap-2 pr-2">
            <button
              onClick={() => expandAllSections(true)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#f1f5f3] hover:bg-[#e2e9e6] text-[#293936] transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => expandAllSections(false)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#f1f5f3] hover:bg-[#e2e9e6] text-[#293936] transition-colors"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: EXECUTIVE 15-STAGE OVERVIEW CARDS (EASY & INTUITIVE) */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#eaf6f4] border border-[#c8e7e2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#0f766e]">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                Click on any module to inspect detailed measurements, formulas, and material breakups.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('sections')}
              className="font-bold text-[#0f766e] hover:underline flex items-center gap-1"
            >
              <span>View full technical breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {modulesList.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setActiveTab('sections');
                  setOpenSections(prev => ({ ...prev, [m.id]: true }));
                  setTimeout(() => {
                    const el = document.getElementById(m.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="p-5 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm hover:shadow-md hover:border-[#0f766e]/40 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-[#f1f5f3] text-[#0f766e] group-hover:bg-[#0f766e] group-hover:text-white transition-colors">
                    Stage #{m.no}
                  </span>
                  <span className="text-[11px] font-semibold text-[#667772]">
                    {m.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-[#17211f] group-hover:text-[#0f766e] transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#667772] mt-0.5 line-clamp-1">
                    {m.desc}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8faf9] border border-[#e2e9e6] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Quantity</span>
                    <span className="font-mono font-bold text-[#17211f]">{m.summary}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Key Spec</span>
                    <span className="font-mono font-bold text-[#0f766e]">{m.highlight}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f1f5f3] flex items-center justify-between text-xs">
                  <span className="text-xs text-[#667772]">Stage Cost:</span>
                  <span className="font-mono font-black text-sm text-[#17211f]">
                    {m.cost !== null ? `₹ ${m.cost.toLocaleString('en-IN')}` : 'Base Reference'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DETAILED SECTION ACCORDIONS (COLLAPSIBLE & INTUITIVE) */}
      {/* ============================================================== */}
      {activeTab === 'sections' && (
        <div className="space-y-3">
          
          {/* SECTION 1: BUILT-UP AREA */}
          <div id="sec-1" className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('sec-1')}
              className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                  01
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                    1. Total Built-Up Area (AutoCAD Outer-to-Outer)
                  </h3>
                  <p className="text-xs text-[#667772]">
                    Floor-wise outer length & breadth measurements
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#0f766e]">
                  {Math.round(builtupSqft).toLocaleString('en-IN')} Sq.ft
                </span>
                {openSections['sec-1'] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
              </div>
            </button>

            {openSections['sec-1'] && (
              <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-3 text-xs bg-[#f8faf9]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e2e9e6] text-[#667772] font-bold uppercase">
                      <th className="py-2 px-3">Floor Level</th>
                      <th className="py-2 px-3 text-right">Length (ft)</th>
                      <th className="py-2 px-3 text-right">Breadth (ft)</th>
                      <th className="py-2 px-3 text-right">Area (Sq.ft)</th>
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e9e6] font-semibold">
                    {(estimateData.builtup?.floors || []).map((f, i) => (
                      <tr key={i} className="hover:bg-white">
                        <td className="py-2 px-3 font-bold text-[#17211f]">{f.name || `Floor ${i+1}`}</td>
                        <td className="py-2 px-3 text-right font-mono">{f.length} ft</td>
                        <td className="py-2 px-3 text-right font-mono">{f.breadth} ft</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#0f766e]">
                          {Math.round((Number(f.length) || 0) * (Number(f.breadth) || 0)).toLocaleString('en-IN')} Sq.ft
                        </td>
                        <td className="py-2 px-3 text-[#667772] text-[11px]">
                          {i === 0 ? 'Ground Floor Plinth Footprint' : `Upper Storey Superstructure (${f.name})`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 2: FOOTINGS & COLUMNS */}
          <div id="sec-2" className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('sec-2')}
              className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                  02
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                    2. Footing & Column Substructure Schedule
                  </h3>
                  <p className="text-xs text-[#667772]">
                    Excavation, PCC bed, M20 footings & column stubs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#0f766e]">
                  ₹ {Math.round((estimate.footingTotalCost || 0) + (estimate.colTotalCost || 0) + (estimate.pccTotalCost || 0) + (estimate.excavationLabCost || 0) + (estimate.backfillingLabCost || 0)).toLocaleString('en-IN')}
                </span>
                {openSections['sec-2'] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
              </div>
            </button>

            {openSections['sec-2'] && (
              <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-4 text-xs bg-[#f8faf9]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#e2e9e6] text-[#667772] font-bold uppercase">
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3 text-center">Nos</th>
                        <th className="py-2 px-3 text-center">Col Size</th>
                        <th className="py-2 px-3 text-center">Footing Size</th>
                        <th className="py-2 px-3 text-right">Excavation</th>
                        <th className="py-2 px-3 text-right">PCC 1:4:8</th>
                        <th className="py-2 px-3 text-right">Footing M20</th>
                        <th className="py-2 px-3 text-right">Backfill</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e9e6] font-semibold">
                      {(estimate.itemizedFootings || []).map((row, i) => (
                        <tr key={i} className="hover:bg-white">
                          <td className="py-2 px-3 font-bold text-[#17211f]">
                            {row.type || `F${i+1}`} / {row.colType || `C${i+1}`}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold">{row.nos}</td>
                          <td className="py-2 px-3 text-center font-mono text-[#667772]">{row.colL}' × {row.colB}' × {row.colD}'</td>
                          <td className="py-2 px-3 text-center font-mono text-[#667772]">{row.footingL}' × {row.footingB}' × {row.footingD}'</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#17211f]">{(row.excavationCft || 0).toFixed(1)} CFT</td>
                          <td className="py-2 px-3 text-right font-mono text-[#667772]">{(row.pccCft || 0).toFixed(1)} CFT</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#0f766e]">{(row.footingConcreteCft || 0).toFixed(1)} CFT</td>
                          <td className="py-2 px-3 text-right font-mono text-[#667772]">{(row.backfillingCft || 0).toFixed(1)} CFT</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-[#e2e9e6]">
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Total Excavation</span>
                    <span className="font-mono font-bold text-[#17211f]">{(estimate.totalExcavationCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Footing Concrete</span>
                    <span className="font-mono font-bold text-[#0f766e]">{(estimate.totalFootingConcreteCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Footing Steel</span>
                    <span className="font-mono font-bold text-[#17211f]">{(estimate.footingRebarKg || 0).toFixed(0)} kg Rebar</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Column Stubs</span>
                    <span className="font-mono font-bold text-[#0f766e]">{(estimate.totalColumnConcreteCft || 0).toFixed(1)} CFT M20</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: PLINTH BEAMS */}
          <div id="sec-3" className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('sec-3')}
              className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                  03
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                    3. Plinth Beams (Ring & Tie Beams)
                  </h3>
                  <p className="text-xs text-[#667772]">
                    Total length: {estimate.totalPbLength || 0} RFT • Master-linked to Basement & Roof Beams
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#0f766e]">
                  ₹ {Math.round((estimate.plinthConcreteTotalCost || 0) + (estimate.plinthExcavationLabCost || 0)).toLocaleString('en-IN')}
                </span>
                {openSections['sec-3'] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
              </div>
            </button>

            {openSections['sec-3'] && (
              <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-3 text-xs bg-[#f8faf9]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e2e9e6] text-[#667772] font-bold uppercase">
                      <th className="py-2 px-3">Beam</th>
                      <th className="py-2 px-3 text-right">Length (RFT)</th>
                      <th className="py-2 px-3 text-right">Breadth (ft)</th>
                      <th className="py-2 px-3 text-right">Depth (ft)</th>
                      <th className="py-2 px-3 text-right">Concrete (CFT)</th>
                      <th className="py-2 px-3 text-right">Steel (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e9e6] font-semibold">
                    {(estimate.itemizedPlinthBeams || []).map((pb, i) => (
                      <tr key={i} className="hover:bg-white">
                        <td className="py-2 px-3 font-bold text-[#17211f]">
                          {pb.name || `PB${i+1}`}
                          {pb.name === 'PB1' && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#eaf6f4] text-[#0f766e] font-normal">Auto Linked</span>}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#17211f]">{pb.length} RFT</td>
                        <td className="py-2 px-3 text-right font-mono">{pb.breadth} ft</td>
                        <td className="py-2 px-3 text-right font-mono">{pb.depth} ft</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#0f766e]">{(pb.concreteCft || 0).toFixed(2)} CFT</td>
                        <td className="py-2 px-3 text-right font-mono text-[#17211f]">{(pb.steelKg || 0).toFixed(1)} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 4: BASEMENT FLYASH & FILLING */}
          <div id="sec-4" className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('sec-4')}
              className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                  04
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                    4. Basement Masonry & Plinth Filling
                  </h3>
                  <p className="text-xs text-[#667772]">
                    Flyash bricks, 2-side plastering, gravel filling & flooring PCC
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#0f766e]">
                  ₹ {Math.round((estimate.basementBrickworkTotalCost || 0) + (estimate.basementPlasterTotalCost || 0) + (estimate.basementGravelTotalCost || 0) + (estimate.basementMsandMatCost || 0) + (estimate.flooringPccTotalCost || 0)).toLocaleString('en-IN')}
                </span>
                {openSections['sec-4'] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
              </div>
            </button>

            {openSections['sec-4'] && (
              <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-3 text-xs bg-[#f8faf9]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#e2e9e6] space-y-1">
                    <span className="text-[10px] text-[#667772] uppercase font-bold block">Flyash Bricks</span>
                    <span className="text-base font-black font-mono text-[#0f766e]">{(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} Nos</span>
                    <span className="text-[11px] text-[#667772] block">Vol: {(estimate.basementBrickworkCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#e2e9e6] space-y-1">
                    <span className="text-[10px] text-[#667772] uppercase font-bold block">Basement Plastering</span>
                    <span className="text-base font-black font-mono text-[#17211f]">{(estimate.basementPlasteringSqft || 0).toFixed(1)} Sq.ft</span>
                    <span className="text-[11px] text-[#667772] block">Both Sides in CM 1:6</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#e2e9e6] space-y-1">
                    <span className="text-[10px] text-[#667772] uppercase font-bold block">Gravel Filling</span>
                    <span className="text-base font-black font-mono text-[#0f766e]">{(estimate.basementGravelCft || 0).toFixed(1)} CFT</span>
                    <span className="text-[11px] text-[#667772] block">Net Area: {Math.round(estimate.netBasementArea || 0)} Sq.ft</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#e2e9e6] space-y-1">
                    <span className="text-[10px] text-[#667772] uppercase font-bold block">Flooring PCC (1:4:8)</span>
                    <span className="text-base font-black font-mono text-[#17211f]">{(estimate.flooringPccSqft || 0).toFixed(1)} Sq.ft</span>
                    <span className="text-[11px] text-[#667772] block">Underbed for Tiles</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: SUPERSTRUCTURE BRICKWORK */}
          <div id="sec-5" className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('sec-5')}
              className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                  05
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                    5. Superstructure Brickwork (Red Chamber 9" & 4.5")
                  </h3>
                  <p className="text-xs text-[#667772]">
                    {(estimate.chamberBricksNos || 0).toLocaleString('en-IN')} Chamber Bricks • Openings deducted automatically
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#0f766e]">
                  ₹ {Math.round(estimate.chamberBrickworkTotalCost || 0).toLocaleString('en-IN')}
                </span>
                {openSections['sec-5'] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
              </div>
            </button>

            {openSections['sec-5'] && (
              <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-3 text-xs bg-[#f8faf9]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-[#e2e9e6]">
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Gross Wall Vol</span>
                    <span className="font-mono font-bold text-[#17211f]">{(estimate.grossWallVolumeCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Openings Deduction</span>
                    <span className="font-mono font-bold text-red-600">-{(estimate.totalDeductionsVolumeCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Net Masonry Vol</span>
                    <span className="font-mono font-bold text-[#0f766e]">{(estimate.netBrickworkCft || 0).toFixed(1)} CFT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667772] uppercase block font-bold">Total Red Bricks</span>
                    <span className="font-mono font-bold text-[#17211f]">{(estimate.chamberBricksNos || 0).toLocaleString('en-IN')} Nos</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTIONS 6 to 15 (Streamlined Collapsible Accordions) */}
          {[
            { id: 'sec-6', no: '06', title: '6. Plastering Work (Ceiling & Walls)', cost: Math.round((estimate.ceilingPlasterTotalCost || 0) + (estimate.wallPlasterTotalCost || 0)), desc: `Ceiling ${(estimate.totalCeilingSqft || 0).toFixed(0)} Sq.ft + Inner/Outer Walls` },
            { id: 'sec-7', no: '07', title: '7. Sill Beam, Lintel Beam & Lofts RCC', cost: Math.round((estimate.sillTotalCost || 0) + (estimate.lintelTotalCost || 0) + (estimate.loftsTotalCost || 0)), desc: `Lintel ${estimate.lintelLen || 0} RFT • Sill ${estimate.sillLen || 0} RFT` },
            { id: 'sec-8', no: '08', title: '8. Tiles & Granite Work', cost: Math.round(estimate.totalTilesCost || 0), desc: `Living/Bed ${Math.round(estimate.tileFlooringSqft || 0)} Sq.ft, Dadoing & Kitchen Counter` },
            { id: 'sec-9', no: '09', title: '9. Doors & Windows Joinery', cost: Math.round(estimate.totalJoineryCost || 0), desc: `${estimate.itemizedJoinery?.length || 5} Fixture types (Main Teak, Room, UPVC)` },
            { id: 'sec-10', no: '10', title: '10. Roof Slab & Roof Beams Concrete (M20)', cost: Math.round(estimate.totalRoofConcreteCost || 0), desc: `5" Slab ${estimate.roofSlabArea || 0} Sq.ft • Concrete ${(estimate.totalRoofConcreteVolumeCft || 0).toFixed(1)} CFT` },
            { id: 'sec-11', no: '11', title: '11. Painting Work (Inner, Outer, Ceiling)', cost: Math.round(estimate.totalPaintingCost || 0), desc: `Apex Weatherproof Exterior + Interior Premium Emulsion` },
            { id: 'sec-12', no: '12', title: '12. Staircase Works (Brick Steps & Granite)', cost: Math.round(estimate.totalStaircaseCost || 0), desc: `${estimate.scStepsCount || 18} Steps, 6" Waist slab & SS 304 handrail` },
            { id: 'sec-13', no: '13', title: '13. Electrical & Plumbing Works', cost: Math.round(estimate.electricalTotalCost || 0), desc: `Turnkey MEP @ ₹${rates.electricalPlumbingRate || 200}/sq.ft` },
            { id: 'sec-14', no: '14', title: '14. Terrace Weathering & Surkhi Course', cost: Math.round(estimate.terraceSurkhiTotalCost || 0), desc: `3" Chips concrete bed ${(estimate.terraceSurkhiSqft || 0).toFixed(0)} Sq.ft` },
            { id: 'sec-15', no: '15', title: '15. Additional External Infrastructure', cost: Math.round(estimate.totalAdditionalCost || 0), desc: `UG Sump, Septic tank, Compound wall, Ramp, Gate & Setback PCC` },
          ].map((sec) => (
            <div key={sec.id} id={sec.id} className="rounded-3xl bg-white border border-[#e2e9e6] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-5 flex items-center justify-between bg-white hover:bg-[#f8faf9] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#eaf6f4] text-[#0f766e] border border-[#c8e7e2]">
                    {sec.no}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#17211f]">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#667772]">
                      {sec.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-sm text-[#0f766e]">
                    ₹ {sec.cost.toLocaleString('en-IN')}
                  </span>
                  {openSections[sec.id] ? <ChevronUp className="w-5 h-5 text-[#667772]" /> : <ChevronDown className="w-5 h-5 text-[#667772]" />}
                </div>
              </button>

              {openSections[sec.id] && (
                <div className="p-5 pt-0 border-t border-[#e2e9e6] space-y-3 text-xs bg-[#f8faf9]">
                  <div className="p-4 rounded-2xl bg-white border border-[#e2e9e6] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#17211f] block text-sm">{sec.title}</span>
                      <span className="text-[#667772]">{sec.desc}</span>
                    </div>
                    <div className="text-right font-mono font-bold text-base text-[#0f766e]">
                      ₹ {sec.cost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ITEMIZED CIVIL BOQ (PROFESSIONAL & CLEAN) */}
      {/* ============================================================== */}
      {activeTab === 'boq' && (
        <div className="p-6 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e9e6]">
            <div>
              <h3 className="text-base font-black text-[#17211f]">
                Itemized Bill of Quantities (Civil BOQ)
              </h3>
              <p className="text-xs text-[#667772]">
                Official contract item schedule audited from 03-11-2026_BRICK_ESTIMATE.xlsm
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e2e9e6] text-[#667772] font-bold uppercase bg-[#f8faf9]">
                  <th className="py-3 px-3">Item #</th>
                  <th className="py-3 px-3">Description of Work</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Quantity</th>
                  <th className="py-3 px-3 text-right">Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e9e6] font-semibold">
                {(estimate.boqSchedule || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf9]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#667772]">{item.sno || idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#17211f]">
                      {item.item}
                      {item.spec && <span className="block text-[11px] font-normal text-[#667772]">{item.spec}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-[#667772]">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#17211f]">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#667772]">
                      ₹ {item.qty > 0 ? Math.round(item.totalCost / item.qty).toLocaleString('en-IN') : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-[#0f766e]">
                      ₹ {Math.round(item.totalCost || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#e2e9e6] bg-[#f8faf9] font-bold">
                  <td colSpan="5" className="py-3 px-3 text-right text-[#667772]">Total Direct Works Cost:</td>
                  <td className="py-3 px-3 text-right font-mono text-base font-black text-[#17211f]">
                    ₹ {Math.round(estimate.totalDirectCost || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-[#f8faf9] font-bold">
                  <td colSpan="5" className="py-2 px-3 text-right text-[#0f766e]">Contractor Margin ({marginPct}%):</td>
                  <td className="py-2 px-3 text-right font-mono text-sm font-black text-[#0f766e]">
                    ₹ {Math.round(estimate.contractorMarkup || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="border-t border-[#e2e9e6] bg-[#eaf6f4] font-black">
                  <td colSpan="5" className="py-3 px-3 text-right text-[#0f766e] uppercase tracking-wider">Grand Project BOQ Total:</td>
                  <td className="py-3 px-3 text-right font-mono text-lg font-black text-[#0f766e]">
                    ₹ {Math.round(totalCost).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: MATERIALS BILL OF MATERIALS (BOM) */}
      {/* ============================================================== */}
      {activeTab === 'materials' && (
        <div className="p-6 rounded-3xl bg-white border border-[#e2e9e6] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e9e6]">
            <div>
              <h3 className="text-base font-black text-[#17211f]">
                Materials Requisition & Takeoff (BOM)
              </h3>
              <p className="text-xs text-[#667772]">
                Cement, M-Sand, P-Sand, 20mm Blue Metal, and Rebar steel takeoff
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e2e9e6] text-[#667772] font-bold uppercase bg-[#f8faf9]">
                  <th className="py-3 px-3">Material Name & Specification</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Computed Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Total Material Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e9e6] font-semibold">
                {(estimate.bomSummary || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf9]">
                    <td className="py-2.5 px-3 font-bold text-[#17211f]">
                      {item.name}
                      {item.spec && <span className="block text-[11px] font-normal text-[#667772]">{item.spec}</span>}
                      {item.subNote && <span className="block text-[11px] font-normal text-[#0f766e]">{item.subNote}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-[#667772]">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#17211f]">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#667772]">
                      ₹ {item.rate}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-[#0f766e]">
                      ₹ {Math.round(item.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
