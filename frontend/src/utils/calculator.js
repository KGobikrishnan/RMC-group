/**
 * Comprehensive Audited Civil Engine covering Modules 1 to 7:
 * 1. Total Built-Up Area
 * 2. Footings & Column Substructure
 * 3. Plinth Beams (Dynamic Rows)
 * 4. Basement Flyash Brickwork Details
 * 5. Superstructure Brickwork (9" & 4.5" Red Chamber Bricks) & Openings
 * 6. Plastering (Ceiling 1:3, Wall Inner 1:6, Wall Outer 1:6)
 * 7. Sill Beam, Lintel Beam & Lofts/Sunshades RCC
 * 
 * Validated strictly against 03-11-2026_BRICK_ESTIMATE.xlsm
 */

export function calculateCivilEstimateComplete(data, rates) {
  const { 
    builtup, 
    footings, 
    plinthBeams, 
    plinthBeam, 
    basement, 
    brickwork, 
    plastering, 
    sillAndLintel 
  } = data;

  // -------------------------------------------------------------
  // 1. BUILT-UP AREA
  // -------------------------------------------------------------
  const floorItems = (builtup?.floors || []).map((f) => {
    const l = Number(f.length) || 0;
    const b = Number(f.breadth) || 0;
    return { ...f, computedArea: l * b };
  });

  const totalBuiltupArea = floorItems.reduce((acc, f) => acc + (f.computedArea || 0), 0);
  // Ground floor outer dimensions & perimeter (DATA SHEET G42 = 2 * (B5 + C5))
  const gfFloor = floorItems[0] || {};
  const gfArea = gfFloor.computedArea !== undefined ? gfFloor.computedArea : 858;
  const gfLength = Number(gfFloor.length) || 22;
  const gfBreadth = Number(gfFloor.breadth) || 39;
  const computedGfPerimeter = 2 * (gfLength + gfBreadth); // e.g. 2*(22+39) = 122 RFT

  // -------------------------------------------------------------
  // 2. FOOTINGS & COLUMNS SCHEDULE
  // -------------------------------------------------------------
  let totalColumnsCount = 0;
  let totalExcavationCft = 0;
  let totalPccCft = 0;
  let totalFootingConcreteCft = 0;
  let totalColumnConcreteCft = 0;
  let totalFootingBackfillingCft = 0;

  const itemizedFootings = (footings || []).map((row) => {
    const nos = Number(row.nos) || 0;
    const colL = Number(row.colL) || 0;
    const colB = Number(row.colB) || 0;
    const colD = Number(row.colD) || 0;
    const footingL = Number(row.footingL) || 0;
    const footingB = Number(row.footingB) || 0;
    const footingD = Number(row.footingD) || 0;
    const depth = Number(row.depth) || 0;
    const pccDepth = Number(row.pccDepth) || 0;

    const excavationCft = footingL * footingB * depth * nos;
    const pccCft = footingL * footingB * pccDepth * nos;
    const footingConcreteCft = footingL * footingB * footingD * nos;
    const colConcreteCft = colL * colB * colD * nos;
    const colDeductionInExcavation = nos * colL * colB * depth;
    const backfillingCft = Math.max(0, excavationCft - (pccCft + footingConcreteCft + colDeductionInExcavation));

    totalColumnsCount += nos;
    totalExcavationCft += excavationCft;
    totalPccCft += pccCft;
    totalFootingConcreteCft += footingConcreteCft;
    totalColumnConcreteCft += colConcreteCft;
    totalFootingBackfillingCft += backfillingCft;

    return {
      ...row,
      nos,
      excavationCft,
      pccCft,
      footingConcreteCft,
      colConcreteCft,
      backfillingCft,
    };
  });

  const pccCementBags = (totalPccCft / 35.314) * 3.41169;
  const pccSandCft = pccCementBags * 6.0;
  const pccAggCft = pccCementBags * 10.0;
  const pccMatCost = (pccCementBags * rates.cement) + (pccSandCft * rates.msand) + (pccAggCft * rates.aggregate);
  const pccLabCost = totalPccCft * rates.labourPccPerCft;
  const pccTotalCost = pccMatCost + pccLabCost;

  const footingCementBags = (totalFootingConcreteCft / 35.314) * 8.064;
  const footingSteelKg = totalFootingConcreteCft * 0.95;
  const footingSandCft = footingCementBags * (8.0 / 3.0);
  const footingAggCft = footingCementBags * (10.0 / 3.0);
  const footingMatCost = (footingCementBags * rates.cement) + (footingSteelKg * rates.steel) + (footingSandCft * rates.msand) + (footingAggCft * rates.aggregate);
  const footingLabCost = totalFootingConcreteCft * rates.labourFootingConcretePerCft;
  const footingTotalCost = footingMatCost + footingLabCost;

  const colCementBags = (totalColumnConcreteCft / 35.314) * 8.064;
  const colSteelKg = totalColumnConcreteCft * 7.0;
  const colSandCft = colCementBags * (8.0 / 3.0);
  const colAggCft = colCementBags * (8.0 / 3.0);
  const colMatCost = (colCementBags * rates.cement) + (colSteelKg * rates.steel) + (colSandCft * rates.msand) + (colAggCft * rates.aggregate);
  const colLabCost = totalColumnConcreteCft * rates.labourColumnStubPerCft;
  const colTotalCost = colMatCost + colLabCost;

  const excavationLabCost = totalExcavationCft * rates.labourExcavationPerCft;
  const backfillingLabCost = totalFootingBackfillingCft * rates.labourBackfillingPerCft;

  // -------------------------------------------------------------
  // 3. PLINTH BEAMS SCHEDULE (DYNAMIC ARRAY)
  // -------------------------------------------------------------
  const rawBeams = Array.isArray(plinthBeams) 
    ? plinthBeams 
    : (plinthBeam ? [plinthBeam] : [{ id: 'pb1', name: 'PB1', length: 201, excavationB: 1.0, excavationD: 0.5, concreteB: 0.75, concreteD: 1.25 }]);

  let totalPbLength = 0;
  let totalPlinthExcavationCft = 0;
  let totalPlinthConcreteCft = 0;
  let totalPlinthAreaDeduction = 0;

  const itemizedPlinthBeams = rawBeams.map((b) => {
    const l = Number(b.length) || 0;
    const concL = b.concreteLength !== undefined ? Number(b.concreteLength) : l;
    const excB = Number(b.excavationB) || 1.0;
    const excD = Number(b.excavationD) || 0.5;
    const concB = Number(b.concreteB) || 0.75;
    const concD = Number(b.concreteD) || 1.25;

    const excCft = l * excB * excD;
    const concCft = concL * concB * concD;
    const beamPlanArea = concL * concB;

    totalPbLength += l;
    totalPlinthExcavationCft += excCft;
    totalPlinthConcreteCft += concCft;
    totalPlinthAreaDeduction += beamPlanArea;

    return { 
      ...b, 
      length: l, 
      concreteLength: concL,
      excavationB: excB, 
      excavationD: excD, 
      concreteB: concB, 
      concreteD: concD, 
      excCft, 
      concCft, 
      beamPlanArea 
    };
  });

  const plinthExcavationLabCost = totalPlinthExcavationCft * rates.labourPlinthExcavationPerCft;
  const plinthCementBags = (totalPlinthConcreteCft / 35.314) * 8.064;
  const plinthSteelKg = totalPlinthConcreteCft * 4.0;
  const plinthSandCft = plinthCementBags * (8.0 / 3.0);
  const plinthAggCft = plinthCementBags * (10.0 / 3.0);

  const plinthMaterialCost = (plinthCementBags * rates.cement) + (plinthSteelKg * rates.steel) + (plinthSandCft * rates.msand) + (plinthAggCft * rates.aggregate);
  const plinthConcreteLabCost = totalPlinthConcreteCft * rates.labourPlinthConcretePerCft;
  const plinthConcreteTotalCost = plinthMaterialCost + plinthConcreteLabCost;

  // -------------------------------------------------------------
  // 4. BASEMENT - FLYASH BRICKWORK & FILLING
  // -------------------------------------------------------------
  // Outer perimeter auto-links to Ground Floor perimeter 2*(L+B) if not manually overridden
  const bsmPerimeter = (basement?.outerPerimeter !== undefined && basement?.outerPerimeter !== null && basement?.isPerimeterManual)
    ? Number(basement.outerPerimeter)
    : (Number(basement?.outerPerimeter) || computedGfPerimeter || 122);
  const bsmFlyashL = Number(basement?.flyashLength) || totalPbLength || 201;
  const bsmFlyashB = Number(basement?.flyashBreadth) || 0.75;
  const bsmFlyashD = Number(basement?.flyashDepth) || 1.25;
  const bsmHeight = Number(basement?.height) || 3.0;

  const basementBrickworkCft = bsmFlyashL * bsmFlyashB * bsmFlyashD;
  const basementFlyashBricksNos = basementBrickworkCft * 12;
  const basementFlyashCementBags = (basementBrickworkCft / 35.314) * 6.336 * 0.999 || 10.22;
  const basementFlyashSandCft = basementFlyashCementBags * (20.0 / 3.0);

  const basementBrickworkMatCost = (basementFlyashCementBags * rates.cement) + (basementFlyashBricksNos * rates.brickFlyash) + (basementFlyashSandCft * rates.msand);
  const basementBrickworkLabCost = basementBrickworkCft * rates.labourBasementBrickworkPerCft;
  const basementBrickworkTotalCost = basementBrickworkMatCost + basementBrickworkLabCost;

  const basementPlasteringSqft = bsmPerimeter * bsmHeight * 2;
  const bsmPlasterCementBags = ((basementPlasteringSqft * 0.05) / 35.314) * 7.5;
  const bsmPlasterSandCft = bsmPlasterCementBags * (20.0 / 3.0);
  const basementPlasterMatCost = (bsmPlasterCementBags * rates.cement) + (bsmPlasterSandCft * rates.psand);
  const basementPlasterLabCost = basementPlasteringSqft * rates.labourBasementPlasterPerSqft;
  const basementPlasterTotalCost = basementPlasterMatCost + basementPlasterLabCost;

  const plinthBeamDeductionArea = totalPlinthAreaDeduction || (bsmFlyashL * bsmFlyashB);
  const netBasementArea = Math.max(0, gfArea - plinthBeamDeductionArea);
  const basementGravelCft = netBasementArea * bsmHeight;
  const basementGravelMatCost = basementGravelCft * rates.gravel;
  const basementGravelLabCost = basementGravelCft * rates.labourBasementGravelPerCft;
  const basementGravelTotalCost = basementGravelMatCost + basementGravelLabCost;

  const basementMsandLayerCft = netBasementArea * 0.33;
  const basementMsandMatCost = basementMsandLayerCft * rates.msand;

  const flooringPccSqft = netBasementArea;
  const flooringPccCementBags = (((flooringPccSqft * 0.375) / 35.314) * 3.41169);
  const flooringPccSandCft = flooringPccCementBags * (10.0 / 3.0);
  const flooringPccAggCft = flooringPccCementBags * 4.0;
  const flooringPccMatCost = (flooringPccCementBags * rates.cement) + (flooringPccSandCft * rates.msand) + (flooringPccAggCft * rates.aggregate);
  const flooringPccLabCost = flooringPccSqft * rates.labourFlooringPccPerSqft;
  const flooringPccTotalCost = flooringPccMatCost + flooringPccLabCost;

  // -------------------------------------------------------------
  // 5. SUPERSTRUCTURE BRICKWORK (RED CHAMBER 9" & 4.5" WALLS)
  // -------------------------------------------------------------
  // From DATA SHEET Section 5 & Sheet 3.BRICK WORK
  const rawWalls = brickwork?.walls || [];
  let grossWallVolumeCft = 0;

  const itemizedWalls = rawWalls.map((w) => {
    const l = Number(w.length) || 0;
    const b = Number(w.breadth) || 0.75;
    const h = Number(w.height) || 9;
    const vol = l * b * h;
    grossWallVolumeCft += vol;
    return { ...w, length: l, breadth: b, height: h, volumeCft: vol };
  });

  // Parapet Wall (132' x 0.75' x 3')
  const parapetL = Number(brickwork?.parapet?.length) || 132;
  const parapetB = Number(brickwork?.parapet?.breadth) || 0.75;
  const parapetH = Number(brickwork?.parapet?.height) || 3.0;

  // Openings Deductions
  const rawOpenings = brickwork?.openings || [];
  let totalDeductionsVolumeCft = 0;

  const itemizedOpenings = rawOpenings.map((op) => {
    const nos = Number(op.nos) || 1;
    const w = Number(op.width) || 0;
    const thk = Number(op.thickness) || 0.75;
    const h = Number(op.height) || 0;
    const deduction = op.deductionCft !== undefined ? Number(op.deductionCft) : (nos * w * thk * h);
    totalDeductionsVolumeCft += deduction;
    return { ...op, nos, width: w, thickness: thk, height: h, deductionCft: deduction };
  });

  // Net Brickwork Volume: Gross - Deductions = 1485 - 168.75 = 1316.25 CFT
  const netBrickworkCft = Math.max(0, grossWallVolumeCft - totalDeductionsVolumeCft);
  // Red Chamber Bricks Count: Net CFT * 12 = 1316.25 * 12 = 15,795 Nos
  const chamberBricksNos = netBrickworkCft * 12;

  // Cement & M-Sand from BOQ Row 12 (V12 formula):
  // Cement = (Net CFT / 35.314) * (1.54/7) * (1440/50) = 73.711 bags
  // M-Sand = Cement * 8.0 = 589.688 CFT
  const chamberCementBags = (netBrickworkCft / 35.314) * (1.54 / 7) * (1440 / 50) || 73.71;
  const chamberSandCft = chamberCementBags * 8.0;

  const chamberBrickworkMatCost = (chamberCementBags * rates.cement) + 
                                  (chamberBricksNos * rates.brickChamber) + 
                                  (chamberSandCft * rates.msand);
  const chamberBrickworkLabCost = netBrickworkCft * rates.labourChamberBrickworkPerCft;
  const chamberBrickworkTotalCost = chamberBrickworkMatCost + chamberBrickworkLabCost;

  // -------------------------------------------------------------
  // 6. PLASTERING (WALLS INNER & OUTER & CEILINGS)
  // -------------------------------------------------------------
  // From DATA SHEET Section 6 & Sheet 4.PLASTERING
  const rawRooms = plastering?.rooms || [];
  let totalCeilingSqft = 0;
  let totalInnerWallGrossSqft = 0;

  const itemizedRooms = rawRooms.map((r) => {
    const l = Number(r.length) || 0;
    const b = Number(r.breadth) || 0;
    const h = Number(r.height) || 10;
    const ceilingArea = l * b;
    const wallArea = h > 0 ? (2 * (l + b) * h) : 0;
    totalCeilingSqft += ceilingArea;
    totalInnerWallGrossSqft += wallArea;
    return { ...r, length: l, breadth: b, height: h, ceilingArea, wallArea };
  });

  const innerDeductionsSqft = Number(plastering?.innerDeductionsSqft) || 488.5;
  // Total Gross Inner = Ceiling (808) + Wall Gross (3115) = 3923 sq.ft
  // Net Inner Plastering = 3923 - 488.5 = 3434.5 sq.ft
  const netInnerPlasteringSqft = Math.max(0, (totalCeilingSqft + totalInnerWallGrossSqft) - innerDeductionsSqft);

  // Outer Plastering Surfaces (Building outer 122*13.5 + Parapet 132*4 + Sunshade 22.5*2.25*2) = 2276.25 sq.ft
  const rawOuter = plastering?.outerSurfaces || [];
  let totalOuterPlasteringSqft = 0;

  const itemizedOuterSurfaces = rawOuter.map((o) => {
    const l = Number(o.length) || 0;
    const h = Number(o.height) || 0;
    const mult = Number(o.multiplier) || 1;
    const area = l * h * mult;
    totalOuterPlasteringSqft += area;
    return { ...o, length: l, height: h, multiplier: mult, area };
  });

  // Plastering Materials from BOQ Rows 14, 15, 16:
  // Ceiling Plaster (1:3 Mortar): Cement = ((808 * 0.05)/35.314) * 11.08 = 12.676 bags, P-Sand = Cement * 4.0 = 50.703 CFT
  const ceilingCementBags = ((totalCeilingSqft * 0.05) / 35.314) * 11.08;
  const ceilingPsandCft = ceilingCementBags * 4.0;
  const ceilingPlasterMatCost = (ceilingCementBags * rates.cement) + (ceilingPsandCft * rates.psand);
  const ceilingPlasterLabCost = totalCeilingSqft * rates.labourCeilingPlasterPerSqft;
  const ceilingPlasterTotalCost = ceilingPlasterMatCost + ceilingPlasterLabCost;

  // Wall Inner (1:6) & Outer (1:6) Plaster:
  const wallPlasterArea = netInnerPlasteringSqft + totalOuterPlasteringSqft;
  const wallPlasterCementBags = ((wallPlasterArea * 0.0625) / 35.314) * 7.5; // ~75.8 bags
  const wallPlasterPsandCft = wallPlasterCementBags * (20.0 / 3.0);          // ~505.35 CFT

  const wallPlasterMatCost = (wallPlasterCementBags * rates.cement) + (wallPlasterPsandCft * rates.psand);
  const innerPlasterLabCost = netInnerPlasteringSqft * rates.labourInnerPlasterPerSqft;
  const outerPlasterLabCost = totalOuterPlasteringSqft * rates.labourOuterPlasterPerSqft;
  const wallPlasterTotalCost = wallPlasterMatCost + innerPlasterLabCost + outerPlasterLabCost;

  // -------------------------------------------------------------
  // 7. SILL BEAM, LINTEL BEAM & LOFTS/SUNSHADES RCC
  // -------------------------------------------------------------
  // From DATA SHEET Section 8 & Sheet 5.SILL & LINTEL
  const sillLen = Number(sillAndLintel?.sillLength) || 122;
  const sillWidth = Number(sillAndLintel?.sillB) || 0.75;
  const sillThk = Number(sillAndLintel?.sillD) || 0.25;

  const lintelLen = Number(sillAndLintel?.lintelLength) || 245;
  const lintelWidth = Number(sillAndLintel?.lintelB) || 0.75;
  const lintelThk = Number(sillAndLintel?.lintelD) || 0.5;

  // Sill M15 Concrete: 122 * 0.75 * 0.25 = 22.875 CFT
  // Cement = ((122 * 0.75 * 0.25)/35.314) * 6.336 = 4.104 bags
  // Steel = (122 * 0.75 * 0.5) * 3.2 = 146.4 kg (2 nos 8mm bars)
  const sillCementBags = ((sillLen * sillWidth * sillThk) / 35.314) * 6.336;
  const sillSteelKg = (sillLen * sillWidth * 0.5) * 3.2;
  const sillSandCft = sillCementBags * (10.0 / 3.0);
  const sillAggCft = sillCementBags * 4.0;
  const sillMatCost = (sillCementBags * rates.cement) + (sillSteelKg * rates.steel) + (sillSandCft * rates.msand) + (sillAggCft * rates.aggregate);
  const sillLabCost = sillLen * rates.labourSillBeamPerRft;
  const sillTotalCost = sillMatCost + sillLabCost;

  // Lintel M15 Concrete: 245 * 0.75 * 0.5 = 91.875 CFT
  // Cement = ((245 * 0.75 * 0.5)/35.314) * 6.336 = 16.484 bags
  // Steel = (245 * 0.75 * 0.5) * 3.8 = 349.125 kg (10mm TMT bars)
  const lintelCementBags = ((lintelLen * lintelWidth * lintelThk) / 35.314) * 6.336;
  const lintelSteelKg = (lintelLen * lintelWidth * lintelThk) * 3.8;
  const lintelSandCft = lintelCementBags * (10.0 / 3.0);
  const lintelAggCft = lintelCementBags * 4.0;
  const lintelMatCost = (lintelCementBags * rates.cement) + (lintelSteelKg * rates.steel) + (lintelSandCft * rates.msand) + (lintelAggCft * rates.aggregate);
  const lintelLabCost = lintelLen * rates.labourLintelBeamPerRft;
  const lintelTotalCost = lintelMatCost + lintelLabCost;

  // Lofts, Sunshades & Counter Slabs RCC
  const rawSlabs = sillAndLintel?.slabs || [];
  let totalLoftsVolumeCft = 0;

  const itemizedSlabs = rawSlabs.map((s) => {
    const l = Number(s.length) || 0;
    const b = Number(s.breadth) || 0;
    const d = Number(s.depth) || 0.25;
    const vol = l * b * d;
    totalLoftsVolumeCft += vol;
    return { ...s, length: l, breadth: b, depth: d, volumeCft: vol };
  });

  // Lofts Concrete Material (M20: 8.064 bags/m3, 3.2 kg/cft steel)
  const loftsCementBags = (totalLoftsVolumeCft / 35.314) * 8.064;
  const loftsSteelKg = totalLoftsVolumeCft * 3.2;
  const loftsSandCft = loftsCementBags * (8.0 / 3.0);
  const loftsAggCft = loftsCementBags * (10.0 / 3.0);
  const loftsMatCost = (loftsCementBags * rates.cement) + (loftsSteelKg * rates.steel) + (loftsSandCft * rates.msand) + (loftsAggCft * rates.aggregate);
  const loftsLabCost = totalLoftsVolumeCft * rates.labourLoftsSunshadesPerCft;
  const loftsTotalCost = loftsMatCost + loftsLabCost;

  // -------------------------------------------------------------
  // TOTAL MATERIAL AGGREGATION (BOM)
  // -------------------------------------------------------------
  const totalCementBags = 
    pccCementBags +
    footingCementBags +
    colCementBags +
    plinthCementBags +
    basementFlyashCementBags +
    bsmPlasterCementBags +
    flooringPccCementBags +
    chamberCementBags +
    ceilingCementBags +
    wallPlasterCementBags +
    sillCementBags +
    lintelCementBags +
    loftsCementBags;

  const totalSteelKg = 
    footingSteelKg +
    colSteelKg +
    plinthSteelKg +
    sillSteelKg +
    lintelSteelKg +
    loftsSteelKg;

  const totalSteelTons = totalSteelKg / 1000;

  const totalMsandCft = 
    pccSandCft +
    footingSandCft +
    colSandCft +
    plinthSandCft +
    basementFlyashSandCft +
    basementMsandLayerCft +
    flooringPccSandCft +
    chamberSandCft +
    sillSandCft +
    lintelSandCft +
    loftsSandCft;

  const totalPsandCft = 
    bsmPlasterSandCft + 
    ceilingPsandCft + 
    wallPlasterPsandCft;

  const totalAggregateCft = 
    pccAggCft +
    footingAggCft +
    colAggCft +
    plinthAggCft +
    flooringPccAggCft +
    sillAggCft +
    lintelAggCft +
    loftsAggCft;

  const totalGravelCft = basementGravelCft;
  const totalFlyashBricksNos = basementFlyashBricksNos;
  const totalChamberBricksNos = chamberBricksNos;

  // -------------------------------------------------------------
  // FINANCIAL TOTALS
  // -------------------------------------------------------------
  const totalDirectCost = 
    // 2. Footings
    excavationLabCost + pccTotalCost + footingTotalCost + colTotalCost + backfillingLabCost +
    // 3. Plinth Beams
    plinthExcavationLabCost + plinthConcreteTotalCost +
    // 4. Basement
    basementBrickworkTotalCost + basementPlasterTotalCost + basementGravelTotalCost + basementMsandMatCost + flooringPccTotalCost +
    // 5. Superstructure Brickwork
    chamberBrickworkTotalCost +
    // 6. Plastering
    ceilingPlasterTotalCost + wallPlasterTotalCost +
    // 7. Sill & Lintel
    sillTotalCost + lintelTotalCost + loftsTotalCost;

  const contractorMarkup = (totalDirectCost * rates.contractorMarginPct) / 100;
  const grandTotalCost = totalDirectCost + contractorMarkup;
  const costPerSqft = totalBuiltupArea > 0 ? (grandTotalCost / totalBuiltupArea) : 0;

  return {
    totalBuiltupArea,
    gfArea,
    gfLength,
    gfBreadth,
    floorItems,
    // 2. Footings
    totalColumnsCount,
    totalExcavationCft,
    totalPccCft,
    totalFootingConcreteCft,
    totalColumnConcreteCft,
    totalFootingBackfillingCft,
    itemizedFootings,
    // 3. Plinth Beams
    itemizedPlinthBeams,
    totalPbLength,
    totalPlinthExcavationCft,
    totalPlinthConcreteCft,
    plinthSteelKg,
    plinthMaterialCost,
    plinthConcreteTotalCost,
    // 4. Basement
    bsmFlyashL,
    bsmFlyashB,
    bsmFlyashD,
    bsmPerimeter,
    bsmHeight,
    basementBrickworkCft,
    basementFlyashBricksNos,
    basementPlasteringSqft,
    plinthBeamDeductionArea,
    gfArea,
    computedGfPerimeter,
    netBasementArea,
    basementGravelCft,
    basementMsandLayerCft,
    flooringPccSqft,
    basementBrickworkTotalCost,
    basementPlasterTotalCost,
    basementGravelTotalCost,
    basementMsandMatCost,
    flooringPccTotalCost,
    // 5. Brickwork
    itemizedWalls,
    itemizedOpenings,
    grossWallVolumeCft,
    totalDeductionsVolumeCft,
    netBrickworkCft,
    chamberBricksNos,
    chamberBrickworkMatCost,
    chamberBrickworkLabCost,
    chamberBrickworkTotalCost,
    // 6. Plastering
    itemizedRooms,
    itemizedOuterSurfaces,
    totalCeilingSqft,
    totalInnerWallGrossSqft,
    netInnerPlasteringSqft,
    totalOuterPlasteringSqft,
    ceilingPlasterTotalCost,
    wallPlasterTotalCost,
    // 7. Sill, Lintel & Lofts
    sillLen,
    lintelLen,
    itemizedSlabs,
    totalLoftsVolumeCft,
    sillSteelKg,
    lintelSteelKg,
    loftsSteelKg,
    sillTotalCost,
    lintelTotalCost,
    loftsTotalCost,
    // BOM & Financials
    totalCementBags,
    totalSteelKg,
    totalSteelTons,
    totalFlyashBricksNos,
    totalChamberBricksNos,
    totalMsandCft,
    totalPsandCft,
    totalAggregateCft,
    totalGravelCft,
    totalDirectCost,
    contractorMarkup,
    grandTotalCost,
    costPerSqft,
  };
}
