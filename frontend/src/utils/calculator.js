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
  const gfArea = gfFloor.computedArea !== undefined ? gfFloor.computedArea : 0;
  const gfLength = Number(gfFloor.length) || 0;
  const gfBreadth = Number(gfFloor.breadth) || 0;
  const computedGfPerimeter = (gfLength > 0 && gfBreadth > 0) ? (2 * (gfLength + gfBreadth)) : 0;

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
    // Backfilling = Excavation Volume - (PCC Volume + Footing Concrete Volume + Column Concrete Volume)
    const backfillingCft = Math.max(0, excavationCft - (pccCft + footingConcreteCft + colConcreteCft));

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

  const pccCementBags = (totalPccCft / 35.314) * 3.8644076657;
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
  const rawBeams = Array.isArray(plinthBeams) ? plinthBeams : (plinthBeam ? [plinthBeam] : []);

  let totalPbLength = 0;
  let totalPlinthExcavationCft = 0;
  let totalPlinthConcreteCft = 0;
  let totalPlinthAreaDeduction = 0;

  const itemizedPlinthBeams = rawBeams.map((b) => {
    const l = Number(b.length) || 0;
    const concL = b.concreteLength !== undefined ? Number(b.concreteLength) : l;
    const excB = Number(b.excavationB) || 0;
    const excD = Number(b.excavationD) || 0;
    const concB = Number(b.concreteB) || 0;
    const concD = Number(b.concreteD) || 0;

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
  // Outer perimeter:
  // 1. If basement.outerPerimeter is explicitly set and different from default, or marked manual, prioritize it
  // 2. Otherwise auto-link to Ground Floor perimeter 2*(L+B)
  const bsmPerimeter = (basement?.outerPerimeter !== undefined && basement?.outerPerimeter !== null && (basement?.isPerimeterManual || Number(basement.outerPerimeter) > 0))
    ? Number(basement.outerPerimeter)
    : (computedGfPerimeter || Number(basement?.outerPerimeter) || 0);

  // In Excel DATA SHEET C42: =+F32 (links to PB1 length or total plinth beam length).
  // If user explicitly modified flyashLength in basement, use it; otherwise auto-link to PB1 or totalPbLength
  const pb1Length = Number(rawBeams?.[0]?.length) || 0;
  const activePbMasterLength = pb1Length > 0 ? pb1Length : totalPbLength;

  const bsmFlyashL = (basement?.flyashLength !== undefined && basement?.flyashLength !== null && basement?.isFlyashLengthManual)
    ? Number(basement.flyashLength)
    : (activePbMasterLength || Number(basement?.flyashLength) || 0);

  const bsmFlyashB = Number(basement?.flyashBreadth) || 0;
  const bsmFlyashD = Number(basement?.flyashDepth) || 0;
  const bsmHeight = Number(basement?.height) || 0;

  const basementBrickworkCft = bsmFlyashL * bsmFlyashB * bsmFlyashD;
  const basementFlyashBricksNos = basementBrickworkCft * 12;
  const basementFlyashCementBags = basementBrickworkCft > 0 ? ((basementBrickworkCft / 35.314) * 6.336 * 0.999) : 0;
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

  // In Excel DATA SHEET L42 = SUM(F32:F35)*G32 (Plinth beam deduction area)
  // If user manually changed Masonry Length in Section 4, the deduction area follows bsmFlyashL * bsmFlyashB;
  // otherwise it links directly to Section 3's totalPlinthAreaDeduction
  const plinthBeamDeductionArea = (basement?.flyashLength !== undefined && basement?.flyashLength !== null && basement?.isFlyashLengthManual)
    ? (bsmFlyashL * bsmFlyashB)
    : (totalPlinthAreaDeduction > 0 ? totalPlinthAreaDeduction : (bsmFlyashL * bsmFlyashB));

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
  const basementTotalCost = basementBrickworkTotalCost + basementPlasterTotalCost + basementGravelTotalCost + basementMsandMatCost + flooringPccTotalCost;

  // -------------------------------------------------------------
  // 5. SUPERSTRUCTURE BRICKWORK (RED CHAMBER 9" & 4.5" WALLS)
  // -------------------------------------------------------------
  // From DATA SHEET Section 5 & Sheet 3.BRICK WORK
  const rawWalls = brickwork?.walls || [];
  let grossWallVolumeCft = 0;

  const itemizedWalls = rawWalls.map((w) => {
    const l = Number(w.length) || 0;
    const b = Number(w.breadth) || 0;
    const h = Number(w.height) || 0;
    const vol = l * b * h;
    grossWallVolumeCft += vol;
    return { ...w, length: l, breadth: b, height: h, volumeCft: vol };
  });

  // Parapet Wall (132' x 0.75' x 3')
  const parapetL = Number(brickwork?.parapet?.length) || 0;
  const parapetB = Number(brickwork?.parapet?.breadth) || 0;
  const parapetH = Number(brickwork?.parapet?.height) || 0;

  // Openings Deductions
  const rawOpenings = brickwork?.openings || [];
  let totalDeductionsVolumeCft = 0;

  const itemizedOpenings = rawOpenings.map((op) => {
    const nos = Number(op.nos) || 0;
    const w = Number(op.width) || 0;
    const thk = Number(op.thickness) || 0;
    const h = Number(op.height) || 0;
    // Compute dynamic volume nos * w * thk * h
    const computedVol = nos * w * thk * h;
    const deduction = op.deductionCft !== undefined && op.deductionCft !== null && !isNaN(op.deductionCft)
      ? Number(op.deductionCft)
      : computedVol;
    totalDeductionsVolumeCft += deduction;
    return { ...op, nos, width: w, thickness: thk, height: h, deductionCft: deduction };
  });

  // Net Brickwork Volume: Gross - Deductions = 1485 - 168.75 = 1316.25 CFT
  const netBrickworkCft = grossWallVolumeCft > 0 ? Math.max(0, grossWallVolumeCft - totalDeductionsVolumeCft) : 0;
  // Red Chamber Bricks Count: Net CFT * 12 = 1316.25 * 12 = 15,795 Nos
  const chamberBricksNos = netBrickworkCft * 12;

  // Cement & M-Sand from BOQ Row 12 (V12 formula):
  // Cement = (Net CFT / 35.314) * (1.54/7) * (1440/50) = 73.711 bags
  // M-Sand = Cement * 8.0 = 589.688 CFT
  const chamberCementBags = netBrickworkCft > 0 ? ((netBrickworkCft / 35.314) * (1.54 / 7) * (1440 / 50)) : 0;
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
    const h = r.height !== undefined && r.height !== null && r.height !== '' ? Number(r.height) : 10;
    const ceilingArea = l * b;
    const wallArea = h > 0 ? (2 * (l + b) * h) : 0;
    totalCeilingSqft += ceilingArea;
    totalInnerWallGrossSqft += wallArea;
    return { ...r, length: l, breadth: b, height: h, ceilingArea, wallArea };
  });

  // Inner Wall Plaster Area (1:6) = Wall Area (2*(L+B)*H) = 3115 sq.ft
  const netInnerPlasteringSqft = Math.max(0, totalInnerWallGrossSqft - (Number(plastering?.innerDeductionsSqft) || 0));

  // Outer Plastering Surfaces (Building outer 122*13.5 + Parapet 132*4 + Sunshade 22.5*2.25*2) = 2276.25 sq.ft
  const rawOuter = plastering?.outerSurfaces || [];
  let totalOuterPlasteringSqft = 0;

  const itemizedOuterSurfaces = rawOuter.map((o) => {
    const l = Number(o.length) || 0;
    const h = Number(o.height) || 0;
    const mult = Number(o.multiplier) || 0;
    const area = l * h * mult;
    totalOuterPlasteringSqft += area;
    return { ...o, length: l, height: h, multiplier: mult, area };
  });

  // Plastering Materials from BOQ Rows 14, 15, 16:
  // Ceiling Plaster (1:3 Mortar): Cement = ((808 * 0.05)/35.314) * 11.08 = 12.676 bags, P-Sand = Cement * 4.0 = 50.703 CFT
  const ceilingCementBags = ((totalCeilingSqft * 0.05) / 35.314) * 11.08;
  const ceilingPsandCft = ceilingCementBags * 4.0;
  const ceilingPlasterMatCost = (ceilingCementBags * rates.cement) + (ceilingPsandCft * rates.psand);
  const ceilingPlasterLabCost = totalCeilingSqft * (Number(rates.labourCeilingPlasterPerSqft ?? 0));
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
  // Brickwork wall length sum for lintel default (DATA SHEET D116 = +C51+C52+C53+C54 = 245 rft)
  const totalBrickworkWallLength = (brickwork?.walls || []).reduce((acc, w) => acc + (Number(w.length) || 0), 0);

  const currentSillLintel = sillAndLintel || data?.sillLintel || {};

  // Sill length defaults to computed ground floor perimeter (2*(L+B) = 122 RFT) unless isSillManual is true
  const sillLen = (currentSillLintel?.isSillManual && currentSillLintel?.sillLength !== undefined && currentSillLintel?.sillLength !== '')
    ? Number(currentSillLintel.sillLength)
    : (computedGfPerimeter || bsmPerimeter || Number(currentSillLintel?.sillLength) || 0);
  const sillWidth = Number(currentSillLintel?.sillB) || 0;
  const sillThk = Number(currentSillLintel?.sillD) || 0;

  // Lintel length defaults to total superstructure wall runs length (245 RFT) unless isLintelManual is true
  const lintelLen = (currentSillLintel?.isLintelManual && currentSillLintel?.lintelLength !== undefined && currentSillLintel?.lintelLength !== '')
    ? Number(currentSillLintel.lintelLength)
    : (totalBrickworkWallLength || Number(currentSillLintel?.lintelLength) || 0);
  const lintelWidth = Number(currentSillLintel?.lintelB) || 0;
  const lintelThk = Number(currentSillLintel?.lintelD) || 0;

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
  const rawSlabs = Array.isArray(currentSillLintel?.slabs) ? currentSillLintel.slabs : [];
  let totalLoftsVolumeCft = 0;

  const itemizedSlabs = rawSlabs.map((s) => {
    const l = Number(s.length) || 0;
    const b = Number(s.breadth) || 0;
    const d = Number(s.depth) || 0;
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
  // 8. TILES & GRANITE WORK (Sheet 6.TILES WORK & BOQ Items 30-38)
  // -------------------------------------------------------------
  const tilesInput = data?.tiles || {};
  const scInput = data?.staircase || {};
  
  // Calculate dynamic room areas from plastering.rooms if user altered rooms:
  const roomsList = plastering?.rooms || [];
  const hallRoom = roomsList.find(r => /hall/i.test(r.name)) || {};
  const bedRooms = roomsList.filter(r => /bed/i.test(r.name));
  const poojaRoom = roomsList.find(r => /pooja/i.test(r.name)) || {};
  const kitchenRoom = roomsList.find(r => /kitchen/i.test(r.name)) || {};
  const toiletRooms = roomsList.filter(r => /toilet|bath/i.test(r.name));
  const porticoRoom = roomsList.find(r => /portico|parking/i.test(r.name)) || {};

  const dynFlooringSqft = ((Number(hallRoom.length)||0)*(Number(hallRoom.breadth)||0)) +
    bedRooms.reduce((acc, r) => acc + ((Number(r.length)||0)*(Number(r.breadth)||0)), 0) +
    ((Number(poojaRoom.length)||0)*(Number(poojaRoom.breadth)||0)) +
    ((Number(kitchenRoom.length)||0)*(Number(kitchenRoom.breadth)||0));

  const dynBathroomFloorSqft = toiletRooms.reduce((acc, r) => acc + ((Number(r.length)||0)*(Number(r.breadth)||0)), 0);
  const dynParkingSqft = ((Number(porticoRoom.length)||0)*(Number(porticoRoom.breadth)||0));
  const dynKitchenWallSqft = ((Number(kitchenRoom.length)||0) + (Number(kitchenRoom.breadth)||0)) > 0 ? ((Number(kitchenRoom.length)||10) * 4) : 0;
  const dynBathroomWallSqft = toiletRooms.reduce((acc, r) => acc + (2 * ((Number(r.length)||0) + (Number(r.breadth)||0)) * 7), 0); // 7ft dadoing
  const dynCountertopSqft = ((Number(kitchenRoom.length)||0) * (Number(kitchenRoom.breadth)||0) > 0) ? 60 : 0;

  const tileFlooringSqft = (tilesInput?.isFlooringManual && tilesInput.flooringArea !== undefined && tilesInput.flooringArea !== '') 
    ? Number(tilesInput.flooringArea) 
    : (dynFlooringSqft > 0 ? dynFlooringSqft : (Number(tilesInput?.flooringArea) || 0));

  const tileBathroomFloorSqft = (tilesInput?.isBathroomFloorManual && tilesInput.bathroomFloorArea !== undefined && tilesInput.bathroomFloorArea !== '') 
    ? Number(tilesInput.bathroomFloorArea) 
    : (dynBathroomFloorSqft > 0 ? dynBathroomFloorSqft : (Number(tilesInput?.bathroomFloorArea) || 0));

  const tileParkingSqft = (tilesInput?.isParkingManual && tilesInput.parkingArea !== undefined && tilesInput.parkingArea !== '') 
    ? Number(tilesInput.parkingArea) 
    : (dynParkingSqft > 0 ? dynParkingSqft : (Number(tilesInput?.parkingArea) || 0));

  const tileKitchenWallSqft = (tilesInput?.isKitchenWallManual && tilesInput.kitchenWallArea !== undefined && tilesInput.kitchenWallArea !== '') 
    ? Number(tilesInput.kitchenWallArea) 
    : (dynKitchenWallSqft > 0 ? dynKitchenWallSqft : (Number(tilesInput?.kitchenWallArea) || 0));

  const tileBathroomWallSqft = (tilesInput?.isBathroomWallManual && tilesInput.bathroomWallArea !== undefined && tilesInput.bathroomWallArea !== '') 
    ? Number(tilesInput.bathroomWallArea) 
    : (dynBathroomWallSqft > 0 ? dynBathroomWallSqft : (Number(tilesInput?.bathroomWallArea) || 0));

  const tileSkirtingRft = (tilesInput?.isSkirtingManual && tilesInput.skirtingLength !== undefined && tilesInput.skirtingLength !== '') 
    ? Number(tilesInput.skirtingLength) 
    : (dynFlooringSqft > 0 ? (dynFlooringSqft / 6.17) : (Number(tilesInput?.skirtingLength) || 0));

  const tileCountertopSqft = (tilesInput.countertopArea !== undefined && tilesInput.countertopArea !== '') 
    ? Number(tilesInput.countertopArea) 
    : 0;

  // Tile Material Costs (Supply)
  const tileFlooringMatCost = tileFlooringSqft * (rates.rateFlooringTile ?? 60);
  const tileBathroomFloorMatCost = tileBathroomFloorSqft * (rates.rateBathroomFloorTile ?? 50);
  const tileParkingMatCost = tileParkingSqft * (rates.rateParkingTile ?? 50);
  const tileKitchenWallMatCost = tileKitchenWallSqft * (rates.rateKitchenWallTile ?? 50);
  const tileBathroomWallMatCost = tileBathroomWallSqft * (rates.rateBathroomWallTile ?? 50);
  const tileSkirtingMatCost = tileSkirtingRft * (rates.rateSkirtingTile ?? 60);
  const tileCountertopMatCost = tileCountertopSqft * (rates.rateCountertopGranite ?? 160);

  // Tile Laying Labour Costs
  const tileFlooringLabCost = tileFlooringSqft * (rates.tileFlooringLabour ?? 0);
  const tileBathroomFloorLabCost = tileBathroomFloorSqft * (rates.tileBathroomFloorLabour ?? 0);
  const tileParkingLabCost = tileParkingSqft * (rates.tileParkingLabour ?? 0);
  const tileKitchenWallLabCost = tileKitchenWallSqft * (rates.tileKitchenWallLabour ?? 0);
  const tileBathroomWallLabCost = tileBathroomWallSqft * (rates.tileBathroomWallLabour ?? 0);
  const tileSkirtingLabCost = (tileSkirtingRft / 8) * 6 * 4 * (rates.tileSkirtingLabour ?? 0);
  const tileCountertopLabCost = tileCountertopSqft * (rates.graniteCountertopLabour ?? 0);

  // Araldite & Tile Paste (Paste for wall tiles, skirting & countertops)
  // Area = kitchen wall (64) + bath wall (520) + countertop (60) + skirting (86.28) + steps granite (171.5) = 901.78 sq.ft
  const calculatedStepGraniteArea = (((Number(scInput.width) || 0) * (Number(scInput.tread) || 0)) + ((Number(scInput.width) || 0) * (Number(scInput.riser) || 0))) * (Number(scInput.stepsCount) || 0) + (Number(scInput.landingArea) || 0);
  const tilePasteAreaSqft = (tileKitchenWallSqft + tileBathroomWallSqft + tileCountertopSqft + tileSkirtingRft > 0)
    ? (tileKitchenWallSqft + tileBathroomWallSqft + tileCountertopSqft + tileSkirtingRft + calculatedStepGraniteArea)
    : 0;
  const tilePasteCost = tilePasteAreaSqft * (rates.rateTilePasteAraldite ?? 0);

  // Tile Underbed Mortar (2.5" thick mortar bed = 0.21 ft)
  // Area = flooring (532.5) + bath floor (60) + parking (123) + countertop (60) + steps (171.5) = 947 sq.ft
  const tileMortarAreaSqft = (tileFlooringSqft + tileBathroomFloorSqft + tileParkingSqft + tileCountertopSqft > 0)
    ? (tileFlooringSqft + tileBathroomFloorSqft + tileParkingSqft + tileCountertopSqft + calculatedStepGraniteArea)
    : 0;
  const tileMortarVolumeCft = tileMortarAreaSqft * 0.21;
  const tileMortarCementBags = (tileMortarVolumeCft / 35.314) * 7.5; // Mortar cement
  const tileMortarSandCft = tileMortarVolumeCft * 1.155;
  const tileMortarCost = (tileMortarCementBags * rates.cement) + (tileMortarSandCft * rates.msand);

  // Total Tiles Material & Labour
  const totalTilesMatCost = tileFlooringMatCost + tileBathroomFloorMatCost + tileParkingMatCost + 
    tileKitchenWallMatCost + tileBathroomWallMatCost + tileSkirtingMatCost + tileCountertopMatCost + 
    tilePasteCost + tileMortarCost;
  const totalTilesLabCost = tileFlooringLabCost + tileBathroomFloorLabCost + tileParkingLabCost + 
    tileKitchenWallLabCost + tileBathroomWallLabCost + tileSkirtingLabCost + tileCountertopLabCost;
  const totalTilesCost = totalTilesMatCost + totalTilesLabCost;

  // -------------------------------------------------------------
  // 10. DOORS & WINDOWS JOINERY (Sheet 7.DOOR & WINDOW & BOQ Items 25-29)
  // -------------------------------------------------------------
  const rawJoinery = Array.isArray(data?.joinery?.items) ? data.joinery.items : [];

  let totalJoineryCost = 0;
  let totalJoineryAreaSqft = 0;
  const itemizedJoinery = rawJoinery.map(j => {
    const l = Number(j.length) || 0;
    const h = Number(j.height) || 0;
    const nos = j.nos !== undefined && j.nos !== null ? Number(j.nos) : 0;
    const area = l * h * nos;
    const rate = Number(j.rate) || 0;
    const cost = area * rate;
    totalJoineryCost += cost;
    totalJoineryAreaSqft += area;
    return { ...j, length: l, height: h, nos, area, rate, cost };
  });

  // -------------------------------------------------------------
  // 11. ROOF SLAB & ROOF BEAM CONCRETE (Sheet 8.SLAB CONCRETE & BOQ Item 20)
  // -------------------------------------------------------------
  const roofSlabInput = data?.roofSlab || {};
  // If user hasn't explicitly set isBeamManual, auto-link to activePbMasterLength (PB1 or totalPbLength) from Section 3!
  const roofBeamLength = (roofSlabInput?.isBeamManual && roofSlabInput?.beamLength !== undefined && roofSlabInput?.beamLength !== '')
    ? Number(roofSlabInput.beamLength)
    : (activePbMasterLength || Number(roofSlabInput?.beamLength) || 0);
  const roofBeamBreadth = Number(roofSlabInput.beamBreadth) || 0;
  const roofBeamDepth = Number(roofSlabInput.beamDepth) || 0;
  const roofBeamVolumeCft = roofBeamLength * roofBeamBreadth * roofBeamDepth;
  const roofBeamCost = roofBeamVolumeCft * (rates.rateRoofBeamConcretePerCft ?? 0);

  // If user hasn't explicitly set isSlabManual, auto-link to Ground Floor Area (gfArea) from Section 1!
  const roofSlabArea = (roofSlabInput?.isSlabManual && roofSlabInput?.slabArea !== undefined && roofSlabInput?.slabArea !== '')
    ? Number(roofSlabInput.slabArea)
    : (gfArea || Number(roofSlabInput?.slabArea) || 0);
  const roofSlabThickness = Number(roofSlabInput.slabThickness) || 0; // 5 inches
  const roofSlabVolumeCft = roofSlabArea * roofSlabThickness;
  const roofSlabCost = roofSlabVolumeCft * (rates.rateRoofSlabConcretePerCft ?? 0);

  const totalRoofConcreteVolumeCft = roofBeamVolumeCft + roofSlabVolumeCft;
  const totalRoofConcreteCost = roofBeamCost + roofSlabCost;

  // Roof Concrete BOM Breakdown (M20 grade: 8.064 bags/m3, 3.2 kg steel/cft)
  const roofCementBags = (totalRoofConcreteVolumeCft / 35.314) * 8.064;
  const roofSteelKg = totalRoofConcreteVolumeCft * 3.5; // Beam + slab reinforcement
  const roofSandCft = roofCementBags * (8.0 / 3.0);
  const roofAggCft = roofCementBags * (10.0 / 3.0);

  // -------------------------------------------------------------
  // 12. PAINTING WORK (Sheet 9.PAINTING & BOQ Items 39-41)
  // -------------------------------------------------------------
  const paintingInput = data?.painting || {};
  // Dynamically linked to plastering unless isManual
  const paintInnerSqft = (paintingInput?.isInnerManual && paintingInput.innerWallArea !== undefined && paintingInput.innerWallArea !== '')
    ? Number(paintingInput.innerWallArea)
    : (netInnerPlasteringSqft > 0 ? netInnerPlasteringSqft : (Number(paintingInput?.innerWallArea) || 0));

  const paintOuterSqft = (paintingInput?.isOuterManual && paintingInput.outerWallArea !== undefined && paintingInput.outerWallArea !== '')
    ? Number(paintingInput.outerWallArea)
    : (totalOuterPlasteringSqft > 0 ? totalOuterPlasteringSqft : (Number(paintingInput?.outerWallArea) || 0));

  const paintCeilingSqft = (paintingInput?.isCeilingManual && paintingInput.ceilingArea !== undefined && paintingInput.ceilingArea !== '')
    ? Number(paintingInput.ceilingArea)
    : (totalCeilingSqft > 0 ? totalCeilingSqft : (Number(paintingInput?.ceilingArea) || 0));

  const paintInnerCost = paintInnerSqft * (rates.rateInnerWallPainting ?? 0);
  const paintOuterCost = paintOuterSqft * (rates.rateOuterWallPainting ?? 0);
  const paintCeilingCost = paintCeilingSqft * (rates.rateCeilingPainting ?? 0);
  const totalPaintingCost = paintInnerCost + paintOuterCost + paintCeilingCost;

  // -------------------------------------------------------------
  // 13. STAIRCASE WORKS (Sheet 10.STAIRCASE & BOQ Items 21, 23)
  // -------------------------------------------------------------
  const scWidth = Number(scInput.width) || 0;
  const scTread = Number(scInput.tread) || 0;
  const scRiser = Number(scInput.riser) || 0;
  const scStepsCount = Number(scInput.stepsCount) || 0;
  const scLandingArea = Number(scInput.landingArea) || 0;
  const scHandrailLength = Number(scInput.handrailLength) || 0;

  // Brick Steps: Width * Tread * Riser * No. of steps
  const scBrickworkVolumeCft = scWidth * scTread * scRiser * scStepsCount;
  const scBrickworkCost = scBrickworkVolumeCft * (rates.rateStaircaseBrickSteps ?? 0);

  // Steps Granite: ((Width * Tread) + (Width * Riser)) * Steps + Landing
  const scStepGraniteArea = ((scWidth * scTread) + (scWidth * scRiser)) * scStepsCount + scLandingArea;
  const scGraniteCost = scStepGraniteArea * (rates.rateStaircaseGranite ?? 0);

  // Handrail
  const scHandrailCost = scHandrailLength * (rates.rateStaircaseHandrail ?? 0);

  // Waist Slab Concrete: L * B * D
  const scWaistL = Number(scInput.waistSlabLength) || 0;
  const scWaistB = Number(scInput.waistSlabBreadth) || 0;
  const scWaistD = Number(scInput.waistSlabDepth) || 0;
  const scConcreteVolumeCft = scWaistL * scWaistB * scWaistD;
  const scConcreteCost = scConcreteVolumeCft * (rates.rateStaircaseConcrete ?? 0);

  const totalStaircaseCost = scBrickworkCost + scGraniteCost + scHandrailCost + scConcreteCost;

  // Staircase Concrete BOM (M20)
  const scCementBags = (scConcreteVolumeCft / 35.314) * 8.064;
  const scSteelKg = scConcreteVolumeCft * 3.2;
  const scSandCft = scCementBags * (8.0 / 3.0);
  const scAggCft = scCementBags * (10.0 / 3.0);

  // -------------------------------------------------------------
  // 14. OTHERS: ELECTRICAL, PLUMBING & TERRACE SURKHI (DATA SHEET Row 167)
  // -------------------------------------------------------------
  const othersInput = data?.others || {};
  // Electrical dynamically linked to totalBuiltupArea
  const electricalSqft = (othersInput?.isElectricalManual && othersInput.electricalArea !== undefined && othersInput.electricalArea !== '')
    ? Number(othersInput.electricalArea)
    : (totalBuiltupArea || gfArea || 0);

  // Terrace Surkhi dynamically linked to roofSlabArea minus outer perimeter parapet
  const dynamicSurkhiArea = Math.max(0, (roofSlabArea || gfArea) - (bsmPerimeter * 0.75));
  const terraceSurkhiSqft = (othersInput?.isSurkhiManual && othersInput.terraceSurkhiArea !== undefined && othersInput.terraceSurkhiArea !== '')
    ? Number(othersInput.terraceSurkhiArea)
    : (dynamicSurkhiArea > 0 ? dynamicSurkhiArea : 0);

  const electricalTotalCost = electricalSqft * (rates.rateElectricalPlumbing ?? 0);
  const terraceSurkhiVolumeCft = terraceSurkhiSqft * 0.25; // 3 inches chips concrete bed
  const terraceLimeBags = (terraceSurkhiSqft / 100) * 3;
  const terraceSurkhiTotalCost = (terraceSurkhiVolumeCft * (rates.rateTerraceBrickbatPerCft ?? 0)) + (terraceLimeBags * (rates.rateTerraceLimePerBag ?? 0));

  const totalOthersCost = electricalTotalCost + terraceSurkhiTotalCost;

  // -------------------------------------------------------------
  // 15. ADDITIONAL WORKS (DATA SHEET Row 173 & Sheet 12.Breakup)
  // -------------------------------------------------------------
  const rawAdditional = Array.isArray(data?.additionalWorks) ? data.additionalWorks : [];

  let totalAdditionalCost = 0;
  const itemizedAdditional = rawAdditional.map(item => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const cost = qty * rate;
    totalAdditionalCost += cost;
    return { ...item, qty, rate, cost };
  });

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
    loftsCementBags +
    roofCementBags +
    scCementBags +
    tileMortarCementBags;

  const totalSteelKg = 
    footingSteelKg +
    colSteelKg +
    plinthSteelKg +
    sillSteelKg +
    lintelSteelKg +
    loftsSteelKg +
    roofSteelKg +
    scSteelKg;

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
    (excavationLabCost + pccTotalCost + footingTotalCost + colTotalCost + backfillingLabCost) +
    // 3. Plinth Beams
    plinthExcavationLabCost + plinthConcreteTotalCost +
    // 4. Basement
    basementBrickworkTotalCost + basementPlasterTotalCost + basementGravelTotalCost + basementMsandMatCost + flooringPccTotalCost +
    // 5. Superstructure Brickwork
    chamberBrickworkTotalCost +
    // 6. Plastering
    ceilingPlasterTotalCost + wallPlasterTotalCost +
    // 7. Sill & Lintel
    sillTotalCost + lintelTotalCost + loftsTotalCost +
    // 8. Tiles & Granite
    totalTilesCost +
    // 10. Joinery
    totalJoineryCost +
    // 11. Roof Slab & Beams
    totalRoofConcreteCost +
    // 12. Painting
    totalPaintingCost +
    // 13. Staircase
    totalStaircaseCost +
    // 14. Others (Electrical, Plumbing, Terrace Surkhi)
    totalOthersCost +
    // 15. Additional Works
    totalAdditionalCost;

  const contractorMarkup = (totalDirectCost * Number(rates.contractorMarginPct ?? 0)) / 100;
  const grandTotalCost = totalDirectCost + contractorMarkup;
  const costPerSqft = totalBuiltupArea > 0 ? (grandTotalCost / totalBuiltupArea) : 0;

  // -------------------------------------------------------------
  // ITEMIZED CIVIL BOQ SCHEDULE (Excel 11.BOQ Sheet Items 1 to 19)
  // -------------------------------------------------------------
  const boqSchedule = [
    {
      sno: 1,
      item: 'Earth excavation for footing',
      unit: 'CFT',
      qty: Math.round(totalExcavationCft * 10) / 10,
      materialCost: 0,
      labourCost: excavationLabCost,
      totalCost: excavationLabCost,
      spec: 'Manual/JCB excavation up to hard stratum'
    },
    {
      sno: 2,
      item: 'PCC 1:4:8 in foundation',
      unit: 'CFT',
      qty: Math.round(totalPccCft * 10) / 10,
      materialCost: pccMatCost,
      labourCost: pccLabCost,
      totalCost: pccTotalCost,
      spec: 'Plain cement concrete bed for footings'
    },
    {
      sno: 3,
      item: 'Footing Concrete M20 (1:1.5:3)',
      unit: 'CFT',
      qty: Math.round(totalFootingConcreteCft * 10) / 10,
      materialCost: footingMatCost,
      labourCost: footingLabCost,
      totalCost: footingTotalCost,
      spec: 'M20 RCC isolated footing sloped/box concrete'
    },
    {
      sno: 4,
      item: 'Column Concrete M20 (Stub)',
      unit: 'CFT',
      qty: Math.round(totalColumnConcreteCft * 100) / 100,
      materialCost: colMatCost,
      labourCost: colLabCost,
      totalCost: colTotalCost,
      spec: 'Column stubs from footing bed to plinth beam level'
    },
    {
      sno: 5,
      item: 'Back-Filling in Foundation',
      unit: 'CFT',
      qty: Math.round(totalFootingBackfillingCft * 10) / 10,
      materialCost: 0,
      labourCost: backfillingLabCost,
      totalCost: backfillingLabCost,
      spec: 'Refilling excavated pits with selected earth'
    },
    {
      sno: 6,
      item: 'Plinth Beam Excavation',
      unit: 'CFT',
      qty: Math.round(totalPlinthExcavationCft * 10) / 10,
      materialCost: 0,
      labourCost: plinthExcavationLabCost,
      totalCost: plinthExcavationLabCost,
      spec: 'Trench excavation for plinth tie beams'
    },
    {
      sno: 7,
      item: 'Plinth Beam Concrete M20',
      unit: 'CFT',
      qty: Math.round(totalPlinthConcreteCft * 100) / 100,
      materialCost: plinthMaterialCost,
      labourCost: plinthConcreteLabCost,
      totalCost: plinthConcreteTotalCost,
      spec: 'Reinforced cement concrete for plinth tie beams'
    },
    {
      sno: 8,
      item: 'Basement Brickwork (Flyash 1:6)',
      unit: 'CFT',
      qty: Math.round(basementBrickworkCft * 10) / 10,
      materialCost: basementBrickworkMatCost,
      labourCost: basementBrickworkLabCost,
      totalCost: basementBrickworkTotalCost,
      spec: 'Flyash brick masonry in CM 1:6 up to basement level'
    },
    {
      sno: 9,
      item: 'Basement Plastering (1:6 Both Sides)',
      unit: 'Sq.ft',
      qty: Math.round(basementPlasteringSqft * 10) / 10,
      materialCost: basementPlasterMatCost,
      labourCost: basementPlasterLabCost,
      totalCost: basementPlasterTotalCost,
      spec: 'Cement plastering for basement inner & outer faces'
    },
    {
      sno: 10,
      item: 'Basement Gravel Filling',
      unit: 'CFT',
      qty: Math.round(basementGravelCft * 10) / 10,
      materialCost: basementGravelMatCost,
      labourCost: basementGravelLabCost,
      totalCost: basementGravelTotalCost,
      spec: 'Selected quarry gravel filling in layers and consolidation'
    },
    {
      sno: 11,
      item: 'M-Sand 4" Cushion Layer above Gravel',
      unit: 'CFT',
      qty: Math.round(basementMsandLayerCft * 10) / 10,
      materialCost: basementMsandMatCost,
      labourCost: 0,
      totalCost: basementMsandMatCost,
      spec: 'Uniform 4 inch M-sand bedding layer'
    },
    {
      sno: 12,
      item: 'Flooring PCC 1:4:8',
      unit: 'Sq.ft',
      qty: Math.round(flooringPccSqft * 10) / 10,
      materialCost: flooringPccMatCost,
      labourCost: flooringPccLabCost,
      totalCost: flooringPccTotalCost,
      spec: 'PCC bed for ground floor tile/granite underbed'
    },
    {
      sno: 13,
      item: 'Superstructure Brickwork (Red Chamber 9" & 4.5")',
      unit: 'CFT',
      qty: Math.round(netBrickworkCft * 10) / 10,
      materialCost: chamberBrickworkMatCost,
      labourCost: chamberBrickworkLabCost,
      totalCost: chamberBrickworkTotalCost,
      spec: 'First class red chamber bricks in CM 1:6 after openings deduction'
    },
    {
      sno: 14,
      item: 'Ceiling Plastering (1:3 mix)',
      unit: 'Sq.ft',
      qty: Math.round(totalCeilingSqft * 10) / 10,
      materialCost: (ceilingPlasterTotalCost * 0.45),
      labourCost: (ceilingPlasterTotalCost * 0.55),
      totalCost: ceilingPlasterTotalCost,
      spec: 'Smooth ceiling plastering with CM 1:3 ratio'
    },
    {
      sno: 15,
      item: 'Wall Plastering (Inner & Outer 1:6)',
      unit: 'Sq.ft',
      qty: Math.round((netInnerPlasteringSqft + totalOuterPlasteringSqft) * 10) / 10,
      materialCost: (wallPlasterTotalCost * 0.45),
      labourCost: (wallPlasterTotalCost * 0.55),
      totalCost: wallPlasterTotalCost,
      spec: 'Internal smooth sponge finish & external sand face plastering'
    },
    {
      sno: 16,
      item: 'Sill Concrete Beam (M15)',
      unit: 'RFT',
      qty: Math.round(sillLen * 10) / 10,
      materialCost: (sillTotalCost * 0.65),
      labourCost: (sillTotalCost * 0.35),
      totalCost: sillTotalCost,
      spec: 'Continuous sill band concrete with 2 nos 8mm steel bars'
    },
    {
      sno: 17,
      item: 'Lintel Concrete Beam (M15)',
      unit: 'RFT',
      qty: Math.round(lintelLen * 10) / 10,
      materialCost: (lintelTotalCost * 0.65),
      labourCost: (lintelTotalCost * 0.35),
      totalCost: lintelTotalCost,
      spec: 'Continuous lintel beam throughout building with 10mm rebar'
    },
    {
      sno: 18,
      item: 'Lofts, Sunshades & RCC Slabs (M20)',
      unit: 'CFT',
      qty: Math.round(totalLoftsVolumeCft * 10) / 10,
      materialCost: (loftsTotalCost * 0.65),
      labourCost: (loftsTotalCost * 0.35),
      totalCost: loftsTotalCost,
      spec: 'Cantilever sunshades, kitchen lofts and cupboard slabs'
    },
    {
      sno: 19,
      item: 'Roof Beams & Roof Slab Concrete (M20)',
      unit: 'CFT',
      qty: Math.round(totalRoofConcreteVolumeCft * 10) / 10,
      materialCost: (totalRoofConcreteCost * 0.65),
      labourCost: (totalRoofConcreteCost * 0.35),
      totalCost: totalRoofConcreteCost,
      spec: 'RCC M20 mix roof slab (5" depth) and monolithic roof beams'
    },
    {
      sno: 20,
      item: 'Staircase Works (Brick Steps, Waist Slab & Granite)',
      unit: 'Unit',
      qty: scStepsCount,
      materialCost: (totalStaircaseCost * 0.65),
      labourCost: (totalStaircaseCost * 0.35),
      totalCost: totalStaircaseCost,
      spec: 'Brick masonry steps, 6" RCC waist slab, granite treads and SS handrail'
    },
    {
      sno: 21,
      item: 'Terrace Surkhi & Weathering Course',
      unit: 'CFT',
      qty: Math.round(terraceSurkhiVolumeCft * 10) / 10,
      materialCost: (terraceSurkhiTotalCost * 0.60),
      labourCost: (terraceSurkhiTotalCost * 0.40),
      totalCost: terraceSurkhiTotalCost,
      spec: 'Brickbat surkhi concrete with terracotta tiles / lime mortar slope'
    },
    {
      sno: 22,
      item: 'Doors & Windows Joinery',
      unit: 'Sq.ft',
      qty: Math.round(totalJoineryAreaSqft * 10) / 10,
      materialCost: (totalJoineryCost * 0.85),
      labourCost: (totalJoineryCost * 0.15),
      totalCost: totalJoineryCost,
      spec: 'Main teak door, flush room doors, PVC bathroom doors & UPVC windows'
    },
    {
      sno: 23,
      item: 'Tiles & Granite Flooring & Dadoing',
      unit: 'Sq.ft',
      qty: Math.round((tileFlooringSqft + tileBathroomFloorSqft + tileParkingSqft + tileKitchenWallSqft + tileBathroomWallSqft) * 10) / 10,
      materialCost: totalTilesMatCost,
      labourCost: totalTilesLabCost,
      totalCost: totalTilesCost,
      spec: 'Vitrified tiles, anti-skid bathroom tiles, wall dadoing & granite counters'
    },
    {
      sno: 24,
      item: 'Painting Work (Internal & External)',
      unit: 'Sq.ft',
      qty: Math.round((paintInnerSqft + paintOuterSqft + paintCeilingSqft) * 10) / 10,
      materialCost: (totalPaintingCost * 0.45),
      labourCost: (totalPaintingCost * 0.55),
      totalCost: totalPaintingCost,
      spec: 'Asian Paints Apex / Premium emulsion with primer and putty'
    },
    {
      sno: 25,
      item: 'Electrical & Plumbing Works',
      unit: 'Sq.ft',
      qty: Math.round(electricalSqft * 10) / 10,
      materialCost: (electricalTotalCost * 0.70),
      labourCost: (electricalTotalCost * 0.30),
      totalCost: electricalTotalCost,
      spec: 'Concealed wiring, modular switches, PVC conduits, CPVC plumbing & sanitary'
    },
    {
      sno: 26,
      item: 'Additional External Infrastructure Works',
      unit: 'LS',
      qty: itemizedAdditional.length,
      materialCost: (totalAdditionalCost * 0.70),
      labourCost: (totalAdditionalCost * 0.30),
      totalCost: totalAdditionalCost,
      spec: 'UG Sump, Septic Tank, OHT Stand, Compound Wall, Soakpit, Ramp, Setback PCC & Gate'
    }
  ];

  const foundationSchedule = boqSchedule.slice(0, 5);
  const totalDirectFoundationCost = foundationSchedule.reduce((a, b) => a + b.totalCost, 0);
  const grandTotalFoundationCost = totalDirectFoundationCost * (1 + rates.contractorMarginPct / 100);

  // Bill of Materials Summary (All trades raw requirements)
  const bomSummary = [
    { name: 'OPC / PPC 53 Grade Cement', spec: 'Dalmia / UltraTech', unit: 'Bags', qty: Math.round(totalCementBags), rate: rates.cement, amount: totalCementBags * rates.cement },
    { name: 'Fe550D TMT Reinforcement Steel', spec: 'ARS / Tata Tiscon / JSW', unit: 'Kg', qty: Math.round(totalSteelKg), rate: rates.steel, amount: totalSteelKg * rates.steel, subNote: `${totalSteelTons.toFixed(2)} Metric Tons` },
    { name: 'First Class Red Chamber Bricks', spec: 'Superstructure Walls (9" & 4.5")', unit: 'Pieces', qty: Math.round(totalChamberBricksNos), rate: rates.brickChamber, amount: totalChamberBricksNos * rates.brickChamber },
    { name: 'Flyash Masonry Bricks', spec: 'Basement Wall Masonry', unit: 'Pieces', qty: Math.round(totalFlyashBricksNos), rate: rates.brickFlyash, amount: totalFlyashBricksNos * rates.brickFlyash },
    { name: 'Manufactured Sand (M-Sand)', spec: 'Zone II for RCC Concrete & Masonry', unit: 'CFT', qty: Math.round(totalMsandCft), rate: rates.msand, amount: totalMsandCft * rates.msand, subNote: `${(totalMsandCft / 100).toFixed(2)} Units` },
    { name: 'Plastering Sand (P-Sand)', spec: 'Fine Sifted Sand for Plastering', unit: 'CFT', qty: Math.round(totalPsandCft), rate: rates.psand, amount: totalPsandCft * rates.psand, subNote: `${(totalPsandCft / 100).toFixed(2)} Units` },
    { name: '20mm Graded Blue Metal Aggregate', spec: 'Hard Granite Metal for Concrete', unit: 'CFT', qty: Math.round(totalAggregateCft), rate: rates.aggregate, amount: totalAggregateCft * rates.aggregate, subNote: `${(totalAggregateCft / 100).toFixed(2)} Units` },
    { name: 'Quarry Gravel / Morrum', spec: 'Basement Backfilling & Consolidation', unit: 'CFT', qty: Math.round(totalGravelCft), rate: rates.gravel, amount: totalGravelCft * rates.gravel, subNote: `${(totalGravelCft / 100).toFixed(2)} Units` }
  ];

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
    footingTotalCost,
    colTotalCost,
    pccTotalCost,
    excavationLabCost,
    backfillingLabCost,
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
    basementTotalCost,
    basementGrandTotalCost: basementTotalCost,
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
    // 8. Tiles & Granite Work
    tileFlooringSqft,
    tileBathroomFloorSqft,
    tileParkingSqft,
    tileKitchenWallSqft,
    tileBathroomWallSqft,
    tileSkirtingRft,
    tileCountertopSqft,
    tilePasteAreaSqft,
    tileMortarAreaSqft,
    totalTilesMatCost,
    totalTilesLabCost,
    totalTilesCost,
    // 10. Doors & Windows Joinery
    itemizedJoinery,
    totalJoineryAreaSqft,
    totalJoineryCost,
    // 11. Roof Slab & Beams Concrete
    roofBeamLength,
    roofBeamBreadth,
    roofBeamDepth,
    roofBeamVolumeCft,
    roofBeamCost,
    roofSlabArea,
    roofSlabThickness,
    roofSlabVolumeCft,
    roofSlabCost,
    totalRoofConcreteVolumeCft,
    totalRoofConcreteCost,
    roofSteelKg,
    // 12. Painting Work
    paintInnerSqft,
    paintOuterSqft,
    paintCeilingSqft,
    paintInnerCost,
    paintOuterCost,
    paintCeilingCost,
    totalPaintingCost,
    // 13. Staircase Works
    scWidth,
    scTread,
    scRiser,
    scStepsCount,
    scBrickworkVolumeCft,
    scBrickworkCost,
    scStepGraniteArea,
    scGraniteCost,
    scHandrailLength,
    scHandrailCost,
    scConcreteVolumeCft,
    scConcreteCost,
    totalStaircaseCost,
    // 14. Others (Electrical, Plumbing, Terrace Surkhi)
    electricalSqft,
    electricalTotalCost,
    terraceSurkhiSqft,
    terraceSurkhiVolumeCft,
    terraceSurkhiTotalCost,
    totalOthersCost,
    // 15. Additional Works
    itemizedAdditional,
    totalAdditionalCost,
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
    boqSchedule,
    foundationSchedule,
    totalDirectFoundationCost,
    grandTotalFoundationCost,
    bomSummary,
  };
}
