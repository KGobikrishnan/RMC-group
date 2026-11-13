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
  Download,
  ShieldCheck,
  PackageCheck,
  Zap,
  Droplets,
  Paintbrush,
  ListOrdered,
  Eye,
  Check
} from 'lucide-react';
import { calculateCivilEstimateComplete } from '../utils/calculator';
import { DEFAULT_RATES } from '../data/initialData';

export function ProjectDetailView({ project, onBack, onOpenQuotation, onEditProject }) {
  if (!project) return null;

  const estimateData = project.estimate_data || project.estimateData || {};
  const rates = project.schedule_rates || project.scheduleRates || DEFAULT_RATES;
  
  // Recalculate using audited engine to ensure 100% precision
  const estimate = calculateCivilEstimateComplete(estimateData, rates);

  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'boq' | 'bom'
  const [activeSectionFilter, setActiveSectionFilter] = useState('all');

  const clientName = project.client_name || estimateData.builtup?.clientName || 'Valued Client';
  const siteAddress = project.site_address || estimateData.builtup?.siteLocation || 'Site Location';
  const projectCode = project.project_code || 'RMC-EST';
  const projectTitle = project.title || 'Civil Estimate Project';
  const totalCost = Number(project.total_cost) || estimate.grandTotalCost || 0;
  const builtupSqft = Number(project.total_builtup_sqft) || estimate.totalBuiltupArea || 0;
  const gfArea = Number(project.gf_plinth_sqft) || estimate.gfArea || 0;
  const ratePerSqft = builtupSqft > 0 ? (totalCost / builtupSqft) : 0;

  // Jump to specific section element
  const scrollToSection = (id) => {
    setActiveSectionFilter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sectionsNav = [
    { id: 'sec-1', no: '01', title: 'Built-Up Area' },
    { id: 'sec-2', no: '02', title: 'Footings & Columns' },
    { id: 'sec-3', no: '03', title: 'Plinth Beams' },
    { id: 'sec-4', no: '04', title: 'Basement Masonry' },
    { id: 'sec-5', no: '05', title: 'Brickwork (9" & 4.5")' },
    { id: 'sec-6', no: '06', title: 'Plastering Work' },
    { id: 'sec-7', no: '07', title: 'Sill & Lintel RCC' },
    { id: 'sec-8', no: '08', title: 'Tiles & Granite' },
    { id: 'sec-9', no: '09', title: 'Doors & Windows' },
    { id: 'sec-10', no: '10', title: 'Roof Slab & Beams' },
    { id: 'sec-11', no: '11', title: 'Painting Work' },
    { id: 'sec-12', no: '12', title: 'Staircase Works' },
    { id: 'sec-13', no: '13', title: 'Electrical & Plumbing' },
    { id: 'sec-14', no: '14', title: 'Terrace Surkhi' },
    { id: 'sec-15', no: '15', title: 'Site Infrastructure' },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-card border border-surface-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-surface-base hover:bg-surface-elevated text-text-primary transition-colors border border-surface-border"
            title="Back to Project Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                {projectCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-accent-teal/15 text-accent-teal border border-accent-teal/30 font-bold">
                Detailed Technical Take-off
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mt-1">
              {projectTitle}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onEditProject && (
            <button
              onClick={() => onEditProject(project)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-elevated hover:bg-accent-gold/20 text-accent-gold border border-accent-gold/30 text-xs font-bold transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span>Edit Project Inputs</span>
            </button>
          )}
          <button
            onClick={() => onOpenQuotation && onOpenQuotation(project)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-accent-gold to-accent-gold-dark hover:brightness-110 text-surface-ground text-xs font-extrabold shadow-lg shadow-accent-gold/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Quote</span>
          </button>
        </div>
      </div>

      {/* Project Meta Metrics & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Client & Location */}
        <div className="p-5 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Client & Location</span>
          <div className="font-extrabold text-base text-text-primary truncate">{clientName}</div>
          <div className="text-xs text-text-muted flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-accent-gold flex-shrink-0" />
            <span className="truncate">{siteAddress}</span>
          </div>
          <div className="text-[11px] text-text-muted pt-2 border-t border-surface-border flex items-center justify-between">
            <span>Structure:</span>
            <b className="text-accent-gold">{estimateData.builtup?.floors?.length || 2} Floors (G+{Math.max(0, (estimateData.builtup?.floors?.length || 2) - 1)})</b>
          </div>
        </div>

        {/* Built-up & Dimensions */}
        <div className="p-5 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Built-Up Area</span>
          <div className="text-2xl font-black text-text-primary font-mono">
            {Math.round(builtupSqft).toLocaleString('en-IN')} <span className="text-sm font-semibold text-text-muted">Sq.ft</span>
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between pt-2 border-t border-surface-border">
            <span>Ground Floor:</span>
            <b className="text-text-primary font-mono">{Math.round(gfArea).toLocaleString('en-IN')} Sq.ft</b>
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Isolated Columns:</span>
            <b className="text-accent-teal font-mono">{estimate.totalColumnsCount} Columns</b>
          </div>
        </div>

        {/* Structural BOM Highlights */}
        <div className="p-5 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Key Structural Materials</span>
          <div className="text-2xl font-black text-accent-teal font-mono">
            {(estimate.totalSteelTons || 0).toFixed(2)} <span className="text-sm font-semibold text-text-muted">MT Steel</span>
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between pt-2 border-t border-surface-border">
            <span>Total Cement:</span>
            <b className="text-text-primary font-mono">{Math.round(estimate.totalCementBags || 0).toLocaleString('en-IN')} Bags</b>
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Chamber Bricks:</span>
            <b className="text-text-primary font-mono">{(estimate.totalChamberBricksNos || 0).toLocaleString('en-IN')} Nos</b>
          </div>
        </div>

        {/* Total Cost & Rate/Sq.ft */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-surface-card via-surface-elevated to-surface-card text-text-primary shadow-xl border border-accent-gold/30 space-y-2">
          <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider block">Total Estimated Cost</span>
          <div className="text-2xl font-black text-accent-gold font-mono">
            ₹ {Math.round(totalCost).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between pt-2 border-t border-surface-border">
            <span>Estimated Rate:</span>
            <b className="text-text-primary font-mono font-bold">₹ {Math.round(ratePerSqft).toLocaleString('en-IN')} / sq.ft</b>
          </div>
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Contractor Margin:</span>
            <b className="text-accent-teal font-mono">{rates.contractorMarginPct || 10}% Included</b>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-surface-card border border-surface-border rounded-2xl text-xs font-bold no-print">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'sections'
                ? 'bg-accent-gold text-surface-ground shadow-md font-black'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Section-by-Section Details (1 - 15)</span>
          </button>
          <button
            onClick={() => setActiveTab('boq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'boq'
                ? 'bg-accent-gold text-surface-ground shadow-md font-black'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Civil BOQ Items ({estimate.boqSchedule?.length || 26})</span>
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bom'
                ? 'bg-accent-gold text-surface-ground shadow-md font-black'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Materials Take-off (BOM)</span>
          </button>
        </div>

        {activeTab === 'sections' && (
          <span className="text-[11px] font-mono text-text-muted hidden md:inline-block px-3">
            Click any section below or scroll through all 15 modules
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: SECTION-BY-SECTION COMPLETE DETAILED VIEW (1 to 15) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {/* Quick Jump Horizontal Pills */}
          <div className="p-3 bg-surface-card border border-surface-border rounded-2xl flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex-shrink-0 px-2">Jump to:</span>
            {sectionsNav.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  activeSectionFilter === sec.id
                    ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/50 shadow-sm'
                    : 'bg-surface-base text-text-muted hover:text-text-primary border-surface-border hover:border-surface-elevated'
                }`}
              >
                <span className="font-mono text-[10px] text-accent-gold mr-1.5">#{sec.no}</span>
                {sec.title}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* SECTION 01: TOTAL BUILT-UP AREA */}
          {/* ========================================================= */}
          <div id="sec-1" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 01
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    1. Total Built-Up Area (AutoCAD Outer-to-Outer)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Floor-wise outer length & breadth measurements used for plinth area and multi-story takeoff
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Total Area</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  {Math.round(builtupSqft).toLocaleString('en-IN')} Sq.ft
                </span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Floor Level</th>
                    <th className="py-2.5 px-3 text-right">Outer Length (ft)</th>
                    <th className="py-2.5 px-3 text-right">Outer Breadth (ft)</th>
                    <th className="py-2.5 px-3 text-right">Floor Area (Sq.ft)</th>
                    <th className="py-2.5 px-3">Structural Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  {(estimateData.builtup?.floors || []).map((f, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/40">
                      <td className="py-2.5 px-3 font-bold text-text-primary">{f.name || `Floor ${i+1}`}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{f.length} ft</td>
                      <td className="py-2.5 px-3 text-right font-mono">{f.breadth} ft</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-accent-teal">
                        {Math.round((Number(f.length) || 0) * (Number(f.breadth) || 0)).toLocaleString('en-IN')} Sq.ft
                      </td>
                      <td className="py-2.5 px-3 text-text-muted text-[11px]">
                        {i === 0 ? 'Primary plinth footprint & basement reference' : `Upper storey superstructure (${f.name})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 02: FOOTINGS & COLUMNS SCHEDULE */}
          {/* ========================================================= */}
          <div id="sec-2" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 02
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    2. Footing & Column Schedule
                  </h3>
                  <p className="text-xs text-text-muted">
                    Nos, Column size (L × B × D), Footing size (L × B × D), Excavation Depth & PCC Bed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Columns & Footing Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round((estimate.footingTotalCost || 0) + (estimate.colTotalCost || 0) + (estimate.pccTotalCost || 0) + (estimate.excavationLabCost || 0) + (estimate.backfillingLabCost || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Footing Rows Table */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Nos</th>
                    <th className="py-2.5 px-3 text-center">Col Size (L×B×D)</th>
                    <th className="py-2.5 px-3 text-center">Footing Size (L×B×D)</th>
                    <th className="py-2.5 px-3 text-right">Excv Depth</th>
                    <th className="py-2.5 px-3 text-right">Excavation (CFT)</th>
                    <th className="py-2.5 px-3 text-right">PCC 1:4:8</th>
                    <th className="py-2.5 px-3 text-right">Footing M20</th>
                    <th className="py-2.5 px-3 text-right">Backfill (CFT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  {(estimate.itemizedFootings || []).map((row, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/40">
                      <td className="py-2.5 px-3 font-bold text-text-primary">
                        <span className="text-accent-gold font-mono">{row.type || `F${i+1}`}</span> / <span className="text-accent-teal font-mono">{row.colType || `C${i+1}`}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{row.nos}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-text-muted">
                        {row.colL}' × {row.colB}' × {row.colD}'
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-text-muted">
                        {row.footingL}' × {row.footingB}' × {row.footingD}'
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{row.depth}' (PCC {row.pccDepth}')</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">
                        {(row.excavationCft || 0).toFixed(1)} CFT
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                        {(row.pccCft || 0).toFixed(1)} CFT
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-accent-teal">
                        {(row.footingConcreteCft || 0).toFixed(1)} CFT
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                        {(row.backfillingCft || 0).toFixed(1)} CFT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Computed Section 2 Totals Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-surface-border text-xs">
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total Excavation</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.totalExcavationCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Bed PCC (1:4:8)</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.totalPccCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Footing Concrete (M20)</span>
                <span className="font-mono font-bold text-accent-gold">{(estimate.totalFootingConcreteCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Column Stub (M20)</span>
                <span className="font-mono font-bold text-accent-teal">{(estimate.totalColumnConcreteCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Footing Rebar Steel</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.footingRebarKg || 0).toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 03: PLINTH BEAMS */}
          {/* ========================================================= */}
          <div id="sec-3" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 03
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    3. Plinth Beams (Ring & Tie Beams)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Dynamic Plinth Beam Schedule with 2-way master linkage to Basement Flyash & Roof Beams
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Plinth Beam Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round((estimate.plinthConcreteTotalCost || 0) + (estimate.plinthExcavationLabCost || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Beam Type</th>
                    <th className="py-2.5 px-3 text-right">Length (RFT)</th>
                    <th className="py-2.5 px-3 text-right">Breadth (ft)</th>
                    <th className="py-2.5 px-3 text-right">Depth (ft)</th>
                    <th className="py-2.5 px-3 text-right">Concrete (CFT)</th>
                    <th className="py-2.5 px-3 text-right">Steel Rebar (kg)</th>
                    <th className="py-2.5 px-3 text-right">Excavation (CFT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  {(estimate.itemizedPlinthBeams || []).map((pb, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/40">
                      <td className="py-2.5 px-3 font-bold text-text-primary">
                        <span className="font-mono text-accent-gold">{pb.name || `PB${i+1}`}</span>
                        {pb.name === 'PB1' && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent-teal/15 text-accent-teal border border-accent-teal/30">Master Linked</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">{pb.length} RFT</td>
                      <td className="py-2.5 px-3 text-right font-mono">{pb.breadth} ft</td>
                      <td className="py-2.5 px-3 text-right font-mono">{pb.depth} ft</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-accent-teal">
                        {(pb.concreteCft || 0).toFixed(2)} CFT
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-primary">
                        {(pb.steelKg || 0).toFixed(1)} kg
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                        {(pb.excavationCft || 0).toFixed(1)} CFT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs">
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total PB Length</span>
                <span className="font-mono font-bold text-text-primary">{estimate.totalPbLength} RFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total PB Concrete</span>
                <span className="font-mono font-bold text-accent-gold">{(estimate.totalPlinthConcreteCft || 0).toFixed(2)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total PB Steel</span>
                <span className="font-mono font-bold text-accent-teal">{(estimate.plinthSteelKg || 0).toFixed(1)} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Trench Excavation</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.totalPlinthExcavationCft || 0).toFixed(1)} CFT</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 04: BASEMENT FLYASH BRICKWORK & FILLING */}
          {/* ========================================================= */}
          <div id="sec-4" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 04
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    4. Basement Masonry & Plinth Filling
                  </h3>
                  <p className="text-xs text-text-muted">
                    Flyash brick masonry, both side plastering, quarry gravel filling, 4" M-sand layer & flooring PCC
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Basement Total Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round((estimate.basementBrickworkTotalCost || 0) + (estimate.basementPlasterTotalCost || 0) + (estimate.basementGravelTotalCost || 0) + (estimate.basementMsandMatCost || 0) + (estimate.flooringPccTotalCost || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block font-bold">1. FLYASH BRICKWORK</span>
                <div className="text-base font-black text-accent-teal font-mono">
                  {(estimate.basementFlyashBricksNos || 0).toLocaleString('en-IN')} <span className="text-xs font-semibold">Nos</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Length: <b>{estimate.bsmFlyashL} ft</b> × Height: <b>{estimate.bsmFlyashD} ft</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-1 border-t border-surface-border">
                  Vol: {(estimate.basementBrickworkCft || 0).toFixed(1)} CFT
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block font-bold">2. BASEMENT PLASTERING</span>
                <div className="text-base font-black text-text-primary font-mono">
                  {(estimate.basementPlasteringSqft || 0).toFixed(1)} <span className="text-xs font-semibold">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Both Sides (Inner + Outer) in CM 1:6
                </div>
                <div className="text-text-primary font-mono font-bold pt-1 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.basementPlasterTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block font-bold">3. QUARRY GRAVEL FILLING</span>
                <div className="text-base font-black text-accent-gold font-mono">
                  {(estimate.basementGravelCft || 0).toFixed(1)} <span className="text-xs font-semibold">CFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Net Plinth Area: <b>{Math.round(estimate.netBasementArea || 0)} Sq.ft</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-1 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.basementGravelTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block font-bold">4. FLOORING PCC (1:4:8)</span>
                <div className="text-base font-black text-accent-teal font-mono">
                  {(estimate.flooringPccSqft || 0).toFixed(1)} <span className="text-xs font-semibold">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Underbed Bedding for Tiles & Granite
                </div>
                <div className="text-accent-teal font-mono font-bold pt-1 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.flooringPccTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 05: SUPERSTRUCTURE BRICKWORK (9" & 4.5") */}
          {/* ========================================================= */}
          <div id="sec-5" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 05
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    5. Superstructure Brickwork (Red Chamber 9" & 4.5")
                  </h3>
                  <p className="text-xs text-text-muted">
                    Wall schedules with openings deductions (doors, windows, ventilators, openings)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Superstructure Brickwork</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.chamberBrickworkTotalCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Wall Elements Schedule */}
              <div className="space-y-2">
                <span className="font-bold text-text-muted uppercase text-[11px] block">Wall Groups</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-surface-border text-text-muted bg-surface-base/50">
                        <th className="py-2 px-2.5">Wall</th>
                        <th className="py-2 px-2.5 text-right">Length</th>
                        <th className="py-2 px-2.5 text-right">Height</th>
                        <th className="py-2 px-2.5 text-center">Thick</th>
                        <th className="py-2 px-2.5 text-right">Gross Vol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border font-semibold">
                      {(estimate.itemizedWalls || []).map((w, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 font-bold text-text-primary">{w.name}</td>
                          <td className="py-2 px-2.5 text-right font-mono">{w.length} ft</td>
                          <td className="py-2 px-2.5 text-right font-mono">{w.height} ft</td>
                          <td className="py-2 px-2.5 text-center font-mono text-accent-gold">{w.thickness === 0.375 ? '4.5"' : '9"'}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-text-primary">{(w.volumeCft || 0).toFixed(1)} CFT</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions Schedule */}
              <div className="space-y-2">
                <span className="font-bold text-text-muted uppercase text-[11px] block">Openings Deductions</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-surface-border text-text-muted bg-surface-base/50">
                        <th className="py-2 px-2.5">Opening Item</th>
                        <th className="py-2 px-2.5 text-center">Nos</th>
                        <th className="py-2 px-2.5 text-center">Size (L × H)</th>
                        <th className="py-2 px-2.5 text-right">Deduction (CFT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border font-semibold">
                      {(estimate.itemizedOpenings || []).map((op, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 font-bold text-text-primary">{op.name}</td>
                          <td className="py-2 px-2.5 text-center font-mono">{op.nos}</td>
                          <td className="py-2 px-2.5 text-center font-mono text-text-muted">{op.length} × {op.height}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-accent-gold">
                            -{(op.deductionCft || 0).toFixed(1)} CFT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs">
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Gross Volume</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.grossWallVolumeCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Openings Deduction</span>
                <span className="font-mono font-bold text-accent-gold">-{(estimate.totalDeductionsVolumeCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Net Masonry Volume</span>
                <span className="font-mono font-bold text-accent-teal">{(estimate.netBrickworkCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Red Chamber Bricks</span>
                <span className="font-mono font-bold text-accent-gold">{(estimate.chamberBricksNos || 0).toLocaleString('en-IN')} Nos</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 06: PLASTERING WORK */}
          {/* ========================================================= */}
          <div id="sec-6" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 06
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    6. Plastering Work (Ceiling, Inner & Outer Walls)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Ceiling plastering (CM 1:3), Internal smooth sponge plastering (CM 1:6) & Outer sand face (CM 1:6)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Plastering Total Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round((estimate.ceilingPlasterTotalCost || 0) + (estimate.wallPlasterTotalCost || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-accent-gold uppercase text-[11px]">Ceiling Plaster (1:3)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-accent-gold/15 text-accent-gold font-mono">Smooth</span>
                </div>
                <div className="text-xl font-black font-mono text-text-primary">
                  {(estimate.totalCeilingSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Covers all room ceilings & portico slabs
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.ceilingPlasterTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-accent-teal uppercase text-[11px]">Inner Wall Plaster (1:6)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-accent-teal/15 text-accent-teal font-mono">Sponge</span>
                </div>
                <div className="text-xl font-black font-mono text-text-primary">
                  {(estimate.netInnerPlasteringSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Net inner area after door/window deduction
                </div>
                <div className="text-accent-teal font-mono font-bold pt-2 border-t border-surface-border">
                  Rate: ₹ {rates.plasterWallInnerRate || 19} / sq.ft
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary uppercase text-[11px]">Outer Wall Plaster (1:6)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-text-primary font-mono">Weather</span>
                </div>
                <div className="text-xl font-black font-mono text-text-primary">
                  {(estimate.totalOuterPlasteringSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  External facade including parapet walls
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Total Walls Cost: ₹ {Math.round(estimate.wallPlasterTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 07: SILL BEAM, LINTEL BEAM & LOFTS/SUNSHADES RCC */}
          {/* ========================================================= */}
          <div id="sec-7" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 07
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    7. Sill Beam, Lintel Beam & Lofts/Sunshades RCC
                  </h3>
                  <p className="text-xs text-text-muted">
                    Continuous sill concrete band, lintel beam around building & RCC lofts / chajjas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Sill, Lintel & Lofts Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round((estimate.sillTotalCost || 0) + (estimate.lintelTotalCost || 0) + (estimate.loftsTotalCost || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-gold uppercase text-[11px] block">1. Sill Concrete Band (M15)</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {estimate.sillLen} <span className="text-xs font-semibold text-text-muted">RFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Continuous below all window openings
                </div>
                <div className="text-accent-teal font-mono text-[11px] pt-1">
                  Steel: <b>{(estimate.sillSteelKg || 0).toFixed(1)} kg</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.sillTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-teal uppercase text-[11px] block">2. Lintel Concrete Beam (M15)</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {estimate.lintelLen} <span className="text-xs font-semibold text-text-muted">RFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Ring lintel across entire masonry level
                </div>
                <div className="text-accent-teal font-mono text-[11px] pt-1">
                  Steel: <b>{(estimate.lintelSteelKg || 0).toFixed(1)} kg</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.lintelTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-text-primary uppercase text-[11px] block">3. Lofts & Sunshades (M20)</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.totalLoftsVolumeCft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">CFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Kitchen lofts, bedroom cupboards & sunshades
                </div>
                <div className="text-accent-teal font-mono text-[11px] pt-1">
                  Steel: <b>{(estimate.loftsSteelKg || 0).toFixed(1)} kg</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.loftsTotalCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 08: TILES & GRANITE WORK */}
          {/* ========================================================= */}
          <div id="sec-8" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 08
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    8. Tiles & Granite Work (Flooring & Dadoing)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Vitrified living/bed flooring, anti-skid toilet tiles, 7ft wall dadoing, kitchen granite & skirting
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Total Tiles & Granite</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalTilesCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Trade / Area</th>
                    <th className="py-2.5 px-3 text-right">Computed Quantity</th>
                    <th className="py-2.5 px-3 text-right">Material Supply (₹)</th>
                    <th className="py-2.5 px-3 text-right">Laying Labour (₹)</th>
                    <th className="py-2.5 px-3 text-right">Combined Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  <tr className="hover:bg-surface-elevated/40">
                    <td className="py-2 px-3 font-bold text-text-primary">Vitrified Floor Tiles (Living, Bed, Pooja)</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-teal">{(estimate.tileFlooringSqft || 0).toFixed(1)} Sq.ft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileFlooringRate || 60}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileFlooringLabour || 24}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-gold">
                      ₹ {Math.round((estimate.tileFlooringSqft || 0) * ((rates.tileFlooringRate || 60) + (rates.tileFlooringLabour || 24))).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-elevated/40">
                    <td className="py-2 px-3 font-bold text-text-primary">Bathroom Anti-skid Flooring</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-teal">{(estimate.tileBathroomFloorSqft || 0).toFixed(1)} Sq.ft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileBathroomFloorRate || 50}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileBathroomFloorLabour || 24}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-gold">
                      ₹ {Math.round((estimate.tileBathroomFloorSqft || 0) * ((rates.tileBathroomFloorRate || 50) + (rates.tileBathroomFloorLabour || 24))).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-elevated/40">
                    <td className="py-2 px-3 font-bold text-text-primary">Bathroom Wall Dadoing (7ft Height)</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-teal">{(estimate.tileBathroomWallSqft || 0).toFixed(1)} Sq.ft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileBathroomWallRate || 50}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono">₹ {rates.tileBathroomWallLabour || 30}/sqft</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-gold">
                      ₹ {Math.round((estimate.tileBathroomWallSqft || 0) * ((rates.tileBathroomWallRate || 50) + (rates.tileBathroomWallLabour || 30))).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-elevated/40">
                    <td className="py-2 px-3 font-bold text-text-primary">Kitchen Wall Tiles & Granite Slab Countertop</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-teal">{(estimate.tileKitchenWallSqft || 0) + (estimate.tileCountertopSqft || 0)} Sq.ft</td>
                    <td className="py-2 px-3 text-right font-mono">Granite ₹{rates.graniteCountertopRate || 160}</td>
                    <td className="py-2 px-3 text-right font-mono">Labour ₹{rates.graniteCountertopLabour || 160}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-gold">
                      ₹ {Math.round(((estimate.tileKitchenWallSqft || 0) * 74) + ((estimate.tileCountertopSqft || 0) * 320)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-elevated/40">
                    <td className="py-2 px-3 font-bold text-text-primary">Skirting & Araldite Paste / Mortar Underbed</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-teal">{(estimate.tileSkirtingRft || 0).toFixed(1)} RFT</td>
                    <td className="py-2 px-3 text-right font-mono" colSpan="2">Tile paste + 2.5" thick mortar bed</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-accent-gold">
                      ₹ {Math.round((estimate.tilePasteCost || 0) + (estimate.tileMortarCost || 0)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 09: DOORS & WINDOWS JOINERY */}
          {/* ========================================================= */}
          <div id="sec-9" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 09
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    9. Doors & Windows Joinery Schedule
                  </h3>
                  <p className="text-xs text-text-muted">
                    Main teak door, flush room doors, PVC bathroom doors & UPVC windows with safety grill
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Total Joinery Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalJoineryCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Joinery Item & Specification</th>
                    <th className="py-2.5 px-3 text-center">Nos</th>
                    <th className="py-2.5 px-3 text-center">Size (L × H)</th>
                    <th className="py-2.5 px-3 text-right">Area (Sq.ft)</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  {(estimate.itemizedJoinery || []).map((j, idx) => (
                    <tr key={idx} className="hover:bg-surface-elevated/40">
                      <td className="py-2.5 px-3 font-bold text-text-primary">
                        {j.name}
                        {j.spec && <span className="block text-[11px] font-normal text-text-muted">{j.spec}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{j.nos}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-text-muted">{j.length}' × {j.height}'</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-accent-teal">{(j.area || 0).toFixed(1)} Sq.ft</td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-muted">₹ {j.rate}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-accent-gold">
                        ₹ {Math.round(j.cost || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 10: ROOF SLAB & ROOF BEAMS CONCRETE */}
          {/* ========================================================= */}
          <div id="sec-10" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 10
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    10. Roof Slab & Roof Beams Concrete (M20)
                  </h3>
                  <p className="text-xs text-text-muted">
                    5" thick RCC roof slab, monolithic roof beams & ARS Fe550D TMT reinforcement
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Roof Concrete Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalRoofConcreteCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-gold uppercase text-[11px] block">1. Roof Beams (M20)</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.roofBeamVolumeCft || 0).toFixed(2)} <span className="text-xs font-semibold text-text-muted">CFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Length: <b>{estimate.roofBeamLength} RFT</b> × Breadth: <b>{estimate.roofBeamBreadth}'</b> × Depth: <b>{estimate.roofBeamDepth}'</b>
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.roofBeamCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-teal uppercase text-[11px] block">2. Roof Slab (5" Depth - M20)</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.roofSlabVolumeCft || 0).toFixed(2)} <span className="text-xs font-semibold text-text-muted">CFT</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Slab Area: <b>{estimate.roofSlabArea} Sq.ft</b> × Thickness: <b>5" (0.416 ft)</b>
                </div>
                <div className="text-accent-teal font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.roofSlabCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-surface-border text-xs">
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total Concrete Volume</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.totalRoofConcreteVolumeCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Roof Slab Steel</span>
                <span className="font-mono font-bold text-accent-teal">{(estimate.roofSteelKg || 0).toFixed(1)} kg Rebar</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Total Roof Cost</span>
                <span className="font-mono font-bold text-accent-gold">₹ {Math.round(estimate.totalRoofConcreteCost || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 11: PAINTING WORK */}
          {/* ========================================================= */}
          <div id="sec-11" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 11
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    11. Painting Work (Inner, Outer & Ceiling)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Interior 2 coats putty, primer + tractor emulsion; Exterior weatherproof apex emulsion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Total Painting Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalPaintingCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-gold uppercase text-[11px] block">Inner Wall Painting</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.paintInnerSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Rate: <b>₹ {rates.paintInnerRate || 28} / sq.ft</b> (Putty + Primer + Emulsion)
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.paintInnerCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-accent-teal uppercase text-[11px] block">Outer Wall Painting</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.paintOuterSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Rate: <b>₹ {rates.paintOuterRate || 34} / sq.ft</b> (Apex Weatherproof)
                </div>
                <div className="text-accent-teal font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.paintOuterCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-base border border-surface-border space-y-2">
                <span className="font-bold text-text-primary uppercase text-[11px] block">Ceiling Painting</span>
                <div className="text-lg font-black font-mono text-text-primary">
                  {(estimate.paintCeilingSqft || 0).toFixed(1)} <span className="text-xs font-semibold text-text-muted">Sq.ft</span>
                </div>
                <div className="text-text-muted text-[11px]">
                  Rate: <b>₹ {rates.paintCeilingRate || 25} / sq.ft</b> (White Emulsion)
                </div>
                <div className="text-accent-gold font-mono font-bold pt-2 border-t border-surface-border">
                  Cost: ₹ {Math.round(estimate.paintCeilingCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 12: STAIRCASE WORKS */}
          {/* ========================================================= */}
          <div id="sec-12" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 12
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    12. Staircase Works (Brick Steps, Granite & SS Handrail)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Brickwork steps, 6" RCC waist slab, black granite cladding and stainless steel handrail
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Staircase Total Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalStaircaseCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block">Steps Brickwork</span>
                <div className="font-mono font-bold text-text-primary">
                  {estimate.scStepsCount} Steps ({estimate.scTread}" × {estimate.scRiser}")
                </div>
                <div className="text-accent-gold font-mono font-bold pt-1 border-t border-surface-border">
                  ₹ {Math.round(estimate.scBrickworkCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block">Steps Granite Finish</span>
                <div className="font-mono font-bold text-text-primary">
                  {(estimate.scStepGraniteArea || 0).toFixed(1)} Sq.ft
                </div>
                <div className="text-accent-teal font-mono font-bold pt-1 border-t border-surface-border">
                  ₹ {Math.round(estimate.scGraniteCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block">SS 304 Handrail</span>
                <div className="font-mono font-bold text-text-primary">
                  {estimate.scHandrailLength} RFT
                </div>
                <div className="text-accent-gold font-mono font-bold pt-1 border-t border-surface-border">
                  ₹ {Math.round(estimate.scHandrailCost || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-base border border-surface-border space-y-1">
                <span className="text-[10px] text-text-muted block">RCC Waist Slab</span>
                <div className="font-mono font-bold text-text-primary">
                  {(estimate.scConcreteVolumeCft || 0).toFixed(1)} CFT
                </div>
                <div className="text-accent-teal font-mono font-bold pt-1 border-t border-surface-border">
                  ₹ {Math.round(estimate.scConcreteCost || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 13: ELECTRICAL & PLUMBING */}
          {/* ========================================================= */}
          <div id="sec-13" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 13
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    13. Electrical & Plumbing Works
                  </h3>
                  <p className="text-xs text-text-muted">
                    Concealed piping, modular switches, copper wiring, CPVC water supply & sanitary lines
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Electrical & Plumbing Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.electricalTotalCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-base border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-text-primary text-sm">
                  Turnkey MEP (Mechanical, Electrical, Plumbing) Package
                </div>
                <div className="text-text-muted">
                  Finolex / RR Kabel wires, Anchor Roma modular switches, Ashirvad CPVC pipes & Parryware sanitaryware
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-text-muted">Rate @ ₹{rates.electricalPlumbingRate || 200}/sq.ft × {Math.round(estimate.electricalSqft || 0)} Sq.ft</div>
                <div className="text-base font-black text-accent-gold">₹ {Math.round(estimate.electricalTotalCost || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 14: TERRACE WEATHERING & SURKHI */}
          {/* ========================================================= */}
          <div id="sec-14" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 14
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    14. Terrace Surkhi & Weathering Course
                  </h3>
                  <p className="text-xs text-text-muted">
                    3" thick brickbat surkhi concrete bed with waterproofing slope and rainwater outlets
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Terrace Surkhi Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.terraceSurkhiTotalCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Terrace Slab Area</span>
                <span className="font-mono font-bold text-text-primary">{(estimate.terraceSurkhiSqft || 0).toFixed(1)} Sq.ft</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Chips Bed Volume</span>
                <span className="font-mono font-bold text-accent-teal">{(estimate.terraceSurkhiVolumeCft || 0).toFixed(1)} CFT</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border">
                <span className="text-[10px] text-text-muted block">Weathering Rate</span>
                <span className="font-mono font-bold text-accent-gold">₹ {rates.terraceSurkhiRate || 98.2} / CFT</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 15: ADDITIONAL EXTERNAL INFRASTRUCTURE */}
          {/* ========================================================= */}
          <div id="sec-15" className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                  SECTION 15
                </span>
                <div>
                  <h3 className="text-base font-black text-text-primary">
                    15. Additional Site Infrastructure & External Works
                  </h3>
                  <p className="text-xs text-text-muted">
                    UG sump, septic tank, compound wall, rainwater soakpit, parking ramp, setback PCC & main gate
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Additional Works Cost</span>
                <span className="text-lg font-black font-mono text-accent-gold">
                  ₹ {Math.round(estimate.totalAdditionalCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                    <th className="py-2.5 px-3">Infrastructure Item</th>
                    <th className="py-2.5 px-3 text-center">Unit</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Total Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-semibold">
                  {(estimate.itemizedAdditional || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-elevated/40">
                      <td className="py-2.5 px-3 font-bold text-text-primary">
                        {item.name}
                        {item.spec && <span className="block text-[11px] font-normal text-text-muted">{item.spec}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center uppercase font-bold text-text-muted">{item.unit}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">
                        {item.qty?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-muted">₹ {item.rate}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-accent-gold">
                        ₹ {Math.round(item.cost || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CIVIL BOQ TABLE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'boq' && (
        <div className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-base font-black text-text-primary">
                Itemized Bill of Quantities (Civil BOQ)
              </h3>
              <p className="text-xs text-text-muted">
                Audited item schedule matching 03-11-2026_BRICK_ESTIMATE.xlsm
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                  <th className="py-3 px-3">Item #</th>
                  <th className="py-3 px-3">Description of Work</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-semibold">
                {(estimate.boqSchedule || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-text-muted">{item.sno || idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-text-primary">
                      {item.item}
                      {item.spec && <span className="block text-[11px] font-normal text-text-muted">{item.spec}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-text-muted">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                      ₹ {item.qty > 0 ? Math.round(item.totalCost / item.qty).toLocaleString('en-IN') : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-accent-gold">
                      ₹ {Math.round(item.totalCost || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-surface-border bg-surface-base font-bold">
                  <td colSpan="5" className="py-3 px-3 text-right text-text-muted">
                    Total Direct Works Cost:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base font-black text-text-primary">
                    ₹ {Math.round(estimate.totalDirectCost || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-surface-base font-bold">
                  <td colSpan="5" className="py-2 px-3 text-right text-accent-teal">
                    Contractor Margin ({rates.contractorMarginPct || 10}%):
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-sm font-black text-accent-teal">
                    ₹ {Math.round(estimate.contractorMarkup || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="border-t border-surface-border bg-surface-elevated/80 font-black">
                  <td colSpan="5" className="py-3 px-3 text-right text-accent-gold uppercase tracking-wider">
                    Grand Project BOQ Total:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-lg font-black text-accent-gold">
                    ₹ {Math.round(totalCost).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: MATERIALS TAKE-OFF (BOM) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bom' && (
        <div className="p-6 rounded-3xl bg-surface-card border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-base font-black text-text-primary">
                Materials Bill of Materials (BOM)
              </h3>
              <p className="text-xs text-text-muted">
                Cement, M-Sand, P-Sand, 20mm Blue Metal, and Rebar steel takeoff
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-border text-text-muted font-bold uppercase bg-surface-base/50">
                  <th className="py-3 px-3">Material Name & Specification</th>
                  <th className="py-3 px-3 text-center">Unit</th>
                  <th className="py-3 px-3 text-right">Computed Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Total Material Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-semibold">
                {(estimate.bomSummary || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/40">
                    <td className="py-2.5 px-3 font-bold text-text-primary">
                      {item.name}
                      {item.spec && <span className="block text-[11px] font-normal text-text-muted">{item.spec}</span>}
                      {item.subNote && <span className="block text-[11px] font-normal text-accent-teal">{item.subNote}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-text-muted">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">
                      {typeof item.qty === 'number' ? item.qty.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-muted">
                      ₹ {item.rate}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-accent-gold">
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
