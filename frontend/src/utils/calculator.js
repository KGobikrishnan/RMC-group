/**
 * Civil Engineering Estimation Engine
 * Mirrors formulas and material coefficients from 03-11-2026_BRICK_ESTIMATE.xlsm
 */

export function calculateCivilEstimate(data, rates) {
  const {
    builtup,
    substructure,
    masonry,
    beamsAndPlastering,
    finishes,
    additionalWorks,
  } = data;

  // 1. Builtup Area Calculations
  const floorAreas = builtup.floors.map(f => ({
    ...f,
    computedArea: (Number(f.length) || 0) * (Number(f.breadth) || 0),
  }));
  const sumFloorArea = floorAreas.reduce((acc, f) => acc + (f.computedArea || f.area || 0), 0);
  const totalBuiltupArea = builtup.totalContractArea || sumFloorArea || 1498;
  const gfArea = builtup.gfArea || floorAreas[0]?.computedArea || 858;

  // 2. Substructure Calculations
  // Footings excavation: sum of (footingL * footingB * depth * nos)
  let footingExcavationCft = 0;
  let footingPccCft = 0;
  let footingConcreteCft = 0;
  let columnConcreteCft = 0;

  substructure.footings.forEach(f => {
    const nos = Number(f.nos) || 0;
    const fL = Number(f.footingL) || 0;
    const fB = Number(f.footingB) || 0;
    const fD = Number(f.footingD) || 0;
    const depth = Number(f.depth) || 0;
    const pccD = Number(f.pccDepth) || 0;
    const cL = Number(f.colL) || 0;
    const cB = Number(f.colB) || 0;
    const cD = Number(f.colD) || 0;

    footingExcavationCft += nos * fL * fB * depth;
    footingPccCft += nos * fL * fB * pccD;
    footingConcreteCft += nos * fL * fB * fD;
    columnConcreteCft += nos * cL * cB * cD;
  });

  // Plinth Beam
  const pbExc = substructure.plinthBeam.excavation;
  const plinthExcavationCft = (Number(pbExc.L) || 0) * (Number(pbExc.B) || 0) * (Number(pbExc.D) || 0);

  const pbConc = substructure.plinthBeam.concrete;
  const plinthConcreteCft = (Number(pbConc.L) || 0) * (Number(pbConc.B) || 0) * (Number(pbConc.D) || 0);

  // Backfilling = Footing excavation - (PCC + Footing Conc + Column Conc)
  const backfillingCft = Math.max(0, footingExcavationCft - (footingPccCft + footingConcreteCft + columnConcreteCft));

  // Basement
  const bsm = substructure.basement;
  const basementBrickworkFlyashCft = (Number(bsm.flyashL) || 0) * (Number(bsm.flyashB) || 0) * (Number(bsm.flyashD) || 0);
  const basementGravelCft = Number(bsm.gravelFillingCft) || (Number(bsm.perimeter) || 122) * (Number(bsm.height) || 3) * 5.79;
  const basementMsandCft = Number(bsm.msandLayerCft) || (basementGravelCft * 0.11);
  const flooringPccSqft = Number(bsm.flooringPccSqft) || (gfArea * 0.824);
  const basementPlasteringSqft = Number(bsm.plasteringSqft) || ((Number(bsm.perimeter) || 122) * (Number(bsm.height) || 3) * 2);

  // 3. Superstructure Masonry & Openings
  let grossWallCft = 0;
  masonry.walls.forEach(w => {
    grossWallCft += (Number(w.length) || 0) * (Number(w.breadth) || 0) * (Number(w.height) || 0);
  });
  const parapetWallCft = (Number(masonry.parapet.length) || 0) * (Number(masonry.parapet.breadth) || 0.75) * (Number(masonry.parapet.height) || 3);

  let totalOpeningCft = 0;
  masonry.openings.forEach(op => {
    if (op.deductionCFT !== undefined && Number(op.deductionCFT) > 0) {
      totalOpeningCft += Number(op.deductionCFT);
    } else {
      totalOpeningCft += (Number(op.nos) || 1) * (Number(op.width) || 0) * (Number(op.height) || 0) * 0.75;
    }
  });

  const netSuperstructureBrickworkCft = Math.max(0, grossWallCft + parapetWallCft - totalOpeningCft);

  // 4. Beams, Slabs, Finishes
  const sillL = Number(beamsAndPlastering.sillBeam.length) || 122;
  const lintelL = Number(beamsAndPlastering.lintelBeam.length) || 245;

  // Loft & sunshades volume
  const lofts = beamsAndPlastering.loftsAndSunshades;
  const loftCft = (Number(lofts.loft.L) * Number(lofts.loft.B) * Number(lofts.loft.D)) +
                  (Number(lofts.sunshade.L) * Number(lofts.sunshade.B) * Number(lofts.sunshade.D)) +
                  (Number(lofts.counterSlab.L) * Number(lofts.counterSlab.B) * Number(lofts.counterSlab.D)) +
                  (Number(lofts.paranSlab.L) * Number(lofts.paranSlab.B) * Number(lofts.paranSlab.D));

  // Roof Beam & Slab
  const roof = beamsAndPlastering.roofSlab;
  const roofBeamCft = (Number(roof.roofBeamLength) || 201) * (Number(roof.roofBeamB) || 0.75) * (Number(roof.roofBeamD) || 0.583);
  const roofSlabCft = (Number(roof.gfBuiltupArea) || gfArea) * ((Number(roof.slabThicknessInch) || 5) / 12);
  const totalRoofBeamSlabCft = roofBeamCft + roofSlabCft;

  // Staircase
  const sc = finishes.staircase;
  const staircaseStepsCount = Number(sc.stepsCount) || 21;
  const staircaseBrickworkCft = staircaseStepsCount * (Number(sc.width) || 3) * (Number(sc.tread) || 1) * (Number(sc.riser) || 0.5) * 0.5 || 42.85;
  const staircaseConcreteCft = (Number(sc.waistSlabL) || 21) * (Number(sc.waistSlabB) || 6) * (Number(sc.waistSlabD) || 0.5);

  // Terrace Surkhi
  const terraceSurkhiCft = (Number(finishes.terraceWeathering.surkhiAreaSqft) || 766.5) * (Number(finishes.terraceWeathering.thicknessFt) || 0.25);

  // Plastering areas
  const ceilingPlasterSqft = Number(beamsAndPlastering.plastering.ceilingAreaSqft) || 808;
  const wallInnerPlasterSqft = Number(beamsAndPlastering.plastering.wallInnerSqft) || 3434.5;
  const wallOuterPlasterSqft = Number(beamsAndPlastering.plastering.wallOuterSqft) || 2276.25;

  // -------------------------------------------------------------
  // MATERIAL COEFFICIENTS & BOM GENERATION
  // -------------------------------------------------------------
  // M20 Concrete Constants: (Per Cu.m)
  // Cement = 8.064 bags, Steel = RCC volume (Cu.m) * 1.5% * 7850 kg/m3 (or standard RCC factor), Sand = 14.83 cft, Aggregate = 29.66 cft
  // Conversion CFT -> Cu.m = / 35.314

  // 1. PCC Foundation (1:4:8)
  const pcc148CementBags = (footingPccCft / 35.314) * 3.41169;
  const pcc148SandCft = pcc148CementBags * 6;
  const pcc148AggCft = pcc148CementBags * 10;
  const costPccFoundation = (pcc148CementBags * rates.cement) + (pcc148SandCft * rates.msand) + (pcc148AggCft * rates.aggregate);

  // 2. Footing Concrete (M20)
  const footingCementBags = (footingConcreteCft / 35.314) * 8.064;
  const footingSteelKg = footingConcreteCft * 0.95; // From sheet P4: 114 kg for 120 cft
  const footingSandCft = footingCementBags * 2.6667;
  const footingAggCft = footingCementBags * 3.3333;
  const costFootingConcrete = (footingCementBags * rates.cement) + (footingSteelKg * rates.steel) + (footingSandCft * rates.msand) + (footingAggCft * rates.aggregate);

  // 3. Column Concrete (M20)
  const colCementBags = (columnConcreteCft / 35.314) * 8.064;
  const colSteelKg = columnConcreteCft * 7.0; // P5: 164.06 kg
  const colSandCft = colCementBags * 2.6667;
  const colAggCft = colCementBags * 2.6667;
  const costColumnConcrete = (colCementBags * rates.cement) + (colSteelKg * rates.steel) + (colSandCft * rates.msand) + (colAggCft * rates.aggregate);

  // 4. Plinth Beam Concrete (M20)
  const plinthCementBags = (plinthConcreteCft / 35.314) * 8.064;
  const plinthSteelKg = plinthConcreteCft * 4.0; // P6: 753.75 kg
  const plinthSandCft = plinthCementBags * 2.6667;
  const plinthAggCft = plinthCementBags * 3.3333;
  const costPlinthConcrete = (plinthCementBags * rates.cement) + (plinthSteelKg * rates.steel) + (plinthSandCft * rates.msand) + (plinthAggCft * rates.aggregate);

  // 5. Basement Flyash Brickwork
  // 1 m3 brickwork needs 7.5 bags cement & 0.45 unit sand
  const bsmFlyashVolCuM = (basementBrickworkFlyashCft / 35.314);
  const bsmFlyashCementBags = (basementBrickworkFlyashCft / 35.314) * (1.54 / 7) * (1440 / 50) || 10.22;
  const bsmFlyashBricksCount = basementBrickworkFlyashCft * 12;
  const bsmFlyashSandCft = bsmFlyashCementBags * 6.6667;
  const costBasementFlyash = (bsmFlyashCementBags * rates.cement) + (bsmFlyashBricksCount * rates.brickFlyash) + (bsmFlyashSandCft * rates.msand);

  // 6. Basement Plastering (1:6)
  const bsmPlasterCementBags = ((basementPlasteringSqft * 0.05) / 35.314) * 7.5;
  const bsmPlasterSandCft = bsmPlasterCementBags * 6.6667;
  const costBasementPlastering = (bsmPlasterCementBags * rates.cement) + (bsmPlasterSandCft * rates.psand);

  // 7. Basement Gravel & Msand
  const costBasementGravel = basementGravelCft * rates.gravel;
  const costBasementMsand = basementMsandCft * rates.msand;

  // 8. Flooring PCC
  const flooringPccCementBags = (((flooringPccSqft * 0.375) / 35.314) * 3.41169);
  const flooringPccSandCft = flooringPccCementBags * 3.3333;
  const flooringPccAggCft = flooringPccCementBags * 4.0;
  const costFlooringPcc = (flooringPccCementBags * rates.cement) + (flooringPccSandCft * rates.msand) + (flooringPccAggCft * rates.aggregate);

  // 9. Superstructure Brickwork (Chamber Red Bricks 9")
  const totalChamberCft = netSuperstructureBrickworkCft + staircaseBrickworkCft;
  const chamberCementBags = (totalChamberCft / 35.314) * (1.54 / 7) * (1440 / 50) || 73.71;
  const chamberBricksCount = totalChamberCft * 12;
  const chamberSandCft = chamberCementBags * 8.0;
  const costChamberBrickwork = (chamberCementBags * rates.cement) + (chamberBricksCount * rates.brickChamber) + (chamberSandCft * rates.msand);

  // 10. Plastering: Ceiling (1:3) & Walls (1:6)
  const ceilingCementBags = ((ceilingPlasterSqft * 0.05) / 35.314) * 11.08;
  const ceilingSandCft = ceilingCementBags * 4.0;
  const costCeilingPlaster = (ceilingCementBags * rates.cement) + (ceilingSandCft * rates.psand);

  const totalWallPlasterSqft = wallInnerPlasterSqft + wallOuterPlasterSqft;
  const wallPlasterCementBags = ((totalWallPlasterSqft * 0.0625) / 35.314) * 7.5;
  const wallPlasterSandCft = wallPlasterCementBags * 6.6667;
  const costWallPlaster = (wallPlasterCementBags * rates.cement) + (wallPlasterSandCft * rates.psand);

  // 11. Sill Beam (M15: 1:2:4)
  const sillCementBags = ((sillL * 0.75 * 0.25) / 35.314) * 6.336;
  const sillSteelKg = (sillL * 0.75 * 0.5) * 3.2;
  const sillSandCft = sillCementBags * 3.3333;
  const sillAggCft = sillCementBags * 4.0;
  const costSillBeam = (sillCementBags * rates.cement) + (sillSteelKg * rates.steel) + (sillSandCft * rates.msand) + (sillAggCft * rates.aggregate);

  // 12. Lintel Beam (M15)
  const lintelCementBags = ((lintelL * 0.75 * 0.5) / 35.314) * 6.336;
  const lintelSteelKg = (lintelL * 0.75 * 0.5) * 3.8;
  const lintelSandCft = lintelCementBags * 3.3333;
  const lintelAggCft = lintelCementBags * 4.0;
  const costLintelBeam = (lintelCementBags * rates.cement) + (lintelSteelKg * rates.steel) + (lintelSandCft * rates.msand) + (lintelAggCft * rates.aggregate);

  // 13. Lofts, Sunshade, Counter slab
  const loftCementBags = (loftCft / 35.314) * 8.064;
  const loftSteelKg = loftCft * 3.2;
  const loftSandCft = loftCementBags * 2.6667;
  const loftAggCft = loftCementBags * 3.3333;
  const costLofts = (loftCementBags * rates.cement) + (loftSteelKg * rates.steel) + (loftSandCft * rates.msand) + (loftAggCft * rates.aggregate);

  // 14. Roof Beam & Roof Slab
  const roofCementBags = (totalRoofBeamSlabCft / 35.314) * 8.064;
  const roofSteelKg = (totalRoofBeamSlabCft / 35.314) * 0.015 * 7850; // 1.5% steel = 1483.18 kg
  const roofSandCft = roofCementBags * 2.6667;
  const roofAggCft = roofCementBags * 3.3333;
  const costRoofBeamSlab = (roofCementBags * rates.cement) + (roofSteelKg * rates.steel) + (roofSandCft * rates.msand) + (roofAggCft * rates.aggregate);

  // 15. Staircase Concrete
  const scCementBags = (staircaseConcreteCft / 35.314) * 8.064;
  const scSteelKg = staircaseConcreteCft * 2.5; // P20: 157.5 kg
  const scSandCft = scCementBags * 2.6667;
  const scAggCft = scCementBags * 3.3333;
  const costStaircaseConcrete = (scCementBags * rates.cement) + (scSteelKg * rates.steel) + (scSandCft * rates.msand) + (scAggCft * rates.aggregate);

  // 16. Terrace Surkhi
  const terraceLimeBags = (gfArea / 100) * 3;
  const costTerraceSurkhi = (terraceSurkhiCft * rates.brickBat) + (terraceLimeBags * rates.lime);

  // Total Direct Civil Material
  const totalDirectCivilMaterial = 
    costPccFoundation +
    costFootingConcrete +
    costColumnConcrete +
    costPlinthConcrete +
    costBasementFlyash +
    costBasementPlastering +
    costBasementGravel +
    costBasementMsand +
    costFlooringPcc +
    costChamberBrickwork +
    costCeilingPlaster +
    costWallPlaster +
    costSillBeam +
    costLintelBeam +
    costLofts +
    costRoofBeamSlab +
    costStaircaseConcrete +
    costTerraceSurkhi;

  // Civil Structure Labour = builtup area * labourSuperstructurePerSqft
  const civilLabourCost = totalBuiltupArea * rates.labourSuperstructurePerSqft;
  const totalCivilDirectCost = totalDirectCivilMaterial + civilLabourCost;
  const civilContractorMarkup = (totalCivilDirectCost * rates.contractorMarginPct) / 100;
  const civilTotalCostWithMarkup = totalCivilDirectCost + civilContractorMarkup;

  // -------------------------------------------------------------
  // TRADES & PACKAGES ESTIMATION
  // -------------------------------------------------------------
  
  // Electrical & Plumbing (858 sq.ft * (150 mat + 50 lab))
  const epDirectCost = gfArea * (rates.electricalPlumbingMatRate + rates.electricalPlumbingLabRate);
  const epTotalCostWithMarkup = epDirectCost * (1 + rates.contractorMarginPct / 100);

  // Doors & Windows
  const mainDoorArea = 22.75;
  const roomDoorsArea = 63.0;
  const poojaDoorArea = 21.0;
  const bathDoorsArea = 35.0;
  const windowsArea = 63.0;

  const costMainDoor = mainDoorArea * rates.doorMainRate;
  const costRoomDoors = roomDoorsArea * rates.doorRoomRate;
  const costPoojaDoor = poojaDoorArea * rates.doorPoojaRate;
  const costBathDoors = bathDoorsArea * rates.doorBathroomRate;
  const costWindows = windowsArea * rates.windowUPVCRate;
  const totalDoorsWindowsDirect = costMainDoor + costRoomDoors + costPoojaDoor + costBathDoors + costWindows;
  const totalDoorsWindowsWithMarkup = totalDoorsWindowsDirect * (1 + rates.contractorMarginPct / 100);

  // Tiles & Granite
  const t = finishes.tiles;
  const costFlooringTile = (Number(t.flooringSqft) || 532.5) * (rates.tileFlooringMat + rates.tileFlooringLab);
  const costSkirtingTile = (Number(t.skirtingRft) || 86.28) * (rates.tileSkirtingMat + rates.tileSkirtingLab);
  const costBathFloorTile = (Number(t.bathFloorSqft) || 60) * (rates.tileBathFloorMat + rates.tileBathFloorLab);
  const costBathWallTile = (Number(t.bathWallSqft) || 520) * (rates.tileBathWallMat + rates.tileBathWallLab);
  const costKitchenWallTile = (Number(t.kitchenWallSqft) || 64) * (rates.tileKitchenWallMat + rates.tileKitchenWallLab);
  const costParkingTile = (Number(t.parkingPorticoSqft) || 123) * (rates.tileParkingMat + rates.tileParkingLab);
  const costGraniteCounter = (Number(t.graniteCounterSqft) || 60) * (rates.graniteCounterMat + rates.graniteCounterLab);
  const costGraniteSteps = (Number(t.graniteStepsSqft) || 171.5) * rates.graniteStepsLab;
  const costTileChemicals = 901.78 * 15; // Araldite & Tile paste
  const costTileMortar = 947 * 32.55;  // 2.5" Mortar layer
  const totalTilesDirect = costFlooringTile + costSkirtingTile + costBathFloorTile + costBathWallTile + costKitchenWallTile + costParkingTile + costGraniteCounter + costGraniteSteps + costTileChemicals + costTileMortar;
  const totalTilesWithMarkup = totalTilesDirect * (1 + rates.contractorMarginPct / 100);

  // Painting Works
  const innerPaintArea = Math.max(0, wallInnerPlasterSqft - 808); // 2626.5 sq.ft
  const costInnerPaint = innerPaintArea * rates.paintInnerRate;
  const costOuterPaint = wallOuterPlasterSqft * rates.paintOuterRate;
  const costCeilingPaint = ceilingPlasterSqft * rates.paintCeilingRate;
  const totalPaintDirect = costInnerPaint + costOuterPaint + costCeilingPaint;
  const totalPaintWithMarkup = totalPaintDirect * (1 + rates.contractorMarginPct / 100);

  // Elevation Work (optional/custom)
  const totalElevationWithMarkup = 0;

  // Additional Civil Works
  const costSump = (Number(additionalWorks.sumpLitres) || 2500) * rates.sumpRatePerLitre;
  const costSeptic = (Number(additionalWorks.septicLitres) || 10200) * rates.septicRatePerLitre;
  const costOht = (Number(additionalWorks.ohtLitres) || 0) * rates.ohtRatePerLitre;
  const costCwall = (Number(additionalWorks.compoundWallRft) || 0) * rates.compoundWallRatePerRft;
  const costSoakpit = (Number(additionalWorks.soakpitCount) || 0) * rates.soakpitRatePerUnit;
  const costRamp = (Number(additionalWorks.rampWidthFt) || 0) * rates.rampRatePerWidth;
  const costSetback = (Number(additionalWorks.setbackAreaSqft) || 0) * rates.setbackPCCRatePerSqft;
  const costGate = (Number(additionalWorks.gateAreaSqft) || 0) * rates.gateRatePerSqft;
  const costAntiTermite = flooringPccSqft * rates.antiTermiteRatePerSqft;

  const totalAdditionalDirect = costSump + costSeptic + costOht + costCwall + costSoakpit + costRamp + costSetback + costGate + costAntiTermite;
  const totalAdditionalWithMarkup = totalAdditionalDirect * (1 + rates.contractorMarginPct / 100);

  // -------------------------------------------------------------
  // OVERALL BUILDING ESTIMATE SUMMARY
  // -------------------------------------------------------------
  const mainBuildingEstimateWithMarkup = 
    civilTotalCostWithMarkup +
    epTotalCostWithMarkup +
    totalDoorsWindowsWithMarkup +
    totalTilesWithMarkup +
    totalPaintWithMarkup +
    totalElevationWithMarkup;

  const overallTotalEstimate = mainBuildingEstimateWithMarkup + totalAdditionalWithMarkup;
  const costPerSqft = totalBuiltupArea > 0 ? (overallTotalEstimate / totalBuiltupArea) : 0;
  const mainBuildingCostPerSqft = totalBuiltupArea > 0 ? (mainBuildingEstimateWithMarkup / totalBuiltupArea) : 0;

  // -------------------------------------------------------------
  // BOM AGGREGATION (Total Bill of Materials)
  // -------------------------------------------------------------
  const totalCementBags = 
    pcc148CementBags +
    footingCementBags +
    colCementBags +
    plinthCementBags +
    bsmFlyashCementBags +
    bsmPlasterCementBags +
    flooringPccCementBags +
    chamberCementBags +
    ceilingCementBags +
    wallPlasterCementBags +
    sillCementBags +
    lintelCementBags +
    loftCementBags +
    roofCementBags +
    scCementBags +
    (costTileMortar / rates.cement / 2); // Mortar portion

  const totalSteelKg = 
    footingSteelKg +
    colSteelKg +
    plinthSteelKg +
    sillSteelKg +
    lintelSteelKg +
    loftSteelKg +
    roofSteelKg +
    scSteelKg;

  const totalSteelTons = totalSteelKg / 1000;

  const totalFlyashBricks = bsmFlyashBricksCount;
  const totalChamberBricks = chamberBricksCount;

  const totalMsandCft = 
    pcc148SandCft +
    footingSandCft +
    colSandCft +
    plinthSandCft +
    bsmFlyashSandCft +
    basementMsandCft +
    flooringPccSandCft +
    chamberSandCft +
    sillSandCft +
    lintelSandCft +
    loftSandCft +
    roofSandCft +
    scSandCft;

  const totalPsandCft = 
    bsmPlasterSandCft +
    ceilingSandCft +
    wallPlasterSandCft;

  const totalAggregateCft = 
    pcc148AggCft +
    footingAggCft +
    colAggCft +
    plinthAggCft +
    flooringPccAggCft +
    sillAggCft +
    lintelAggCft +
    loftAggCft +
    roofAggCft +
    scAggCft;

  const totalGravelCft = basementGravelCft;

  // Itemized BOQ Array for Table Display
  const boqSchedule = [
    { sno: 1, category: 'Foundation', desc: 'Earth excavation for footing', unit: 'cft', qty: footingExcavationCft, matRate: 0, labRate: 0, total: 0 },
    { sno: 2, category: 'Foundation', desc: 'PCC 1:4:8 in foundation', unit: 'cft', qty: footingPccCft, matRate: costPccFoundation / (footingPccCft || 1), labRate: 0, total: costPccFoundation },
    { sno: 3, category: 'Foundation', desc: 'Footing Concrete M20 with reinforcement', unit: 'cft', qty: footingConcreteCft, matRate: costFootingConcrete / (footingConcreteCft || 1), labRate: 0, total: costFootingConcrete },
    { sno: 4, category: 'Foundation', desc: 'Column Concrete M20 (up to Plinth)', unit: 'cft', qty: columnConcreteCft, matRate: costColumnConcrete / (columnConcreteCft || 1), labRate: 0, total: costColumnConcrete },
    { sno: 5, category: 'Foundation', desc: 'Earth Backfilling & Compaction', unit: 'cft', qty: backfillingCft, matRate: 0, labRate: 0, total: 0 },
    { sno: 6, category: 'Plinth Beam', desc: 'Plinth Beam Excavation', unit: 'cft', qty: plinthExcavationCft, matRate: 0, labRate: 0, total: 0 },
    { sno: 7, category: 'Plinth Beam', desc: 'Plinth Beam Concrete M20 with TMT Steel', unit: 'cft', qty: plinthConcreteCft, matRate: costPlinthConcrete / (plinthConcreteCft || 1), labRate: 0, total: costPlinthConcrete },
    { sno: 8, category: 'Basement', desc: 'Basement Brickwork (Flyash Bricks 1:6)', unit: 'cft', qty: basementBrickworkFlyashCft, matRate: costBasementFlyash / (basementBrickworkFlyashCft || 1), labRate: 0, total: costBasementFlyash },
    { sno: 9, category: 'Basement', desc: 'Basement Plastering (1:6 with Psand)', unit: 'sq.ft', qty: basementPlasteringSqft, matRate: costBasementPlastering / (basementPlasteringSqft || 1), labRate: 0, total: costBasementPlastering },
    { sno: 10, category: 'Basement', desc: 'Basement Gravel Filling & Rolling', unit: 'cft', qty: basementGravelCft, matRate: rates.gravel, labRate: 0, total: costBasementGravel },
    { sno: 11, category: 'Basement', desc: 'M-sand 4" Layer above Gravel', unit: 'cft', qty: basementMsandCft, matRate: rates.msand, labRate: 0, total: costBasementMsand },
    { sno: 12, category: 'Basement', desc: 'Flooring PCC (1:4:8 Bed Concrete)', unit: 'sq.ft', qty: flooringPccSqft, matRate: costFlooringPcc / (flooringPccSqft || 1), labRate: 0, total: costFlooringPcc },
    { sno: 13, category: 'Superstructure', desc: 'Superstructure Brickwork (Chamber 9" & 4.5")', unit: 'cft', qty: totalChamberCft, matRate: costChamberBrickwork / (totalChamberCft || 1), labRate: 0, total: costChamberBrickwork },
    { sno: 14, category: 'Plastering', desc: 'Ceiling Plastering (1:3 Cement Mortar)', unit: 'sq.ft', qty: ceilingPlasterSqft, matRate: costCeilingPlaster / (ceilingPlasterSqft || 1), labRate: 0, total: costCeilingPlaster },
    { sno: 15, category: 'Plastering', desc: 'Wall Plastering - Inner (1:6 Mortar)', unit: 'sq.ft', qty: wallInnerPlasterSqft, matRate: (costWallPlaster * 0.6) / (wallInnerPlasterSqft || 1), labRate: 0, total: (costWallPlaster * 0.6) },
    { sno: 16, category: 'Plastering', desc: 'Wall Plastering - Outer (1:6 Sponge)', unit: 'sq.ft', qty: wallOuterPlasterSqft, matRate: (costWallPlaster * 0.4) / (wallOuterPlasterSqft || 1), labRate: 0, total: (costWallPlaster * 0.4) },
    { sno: 17, category: 'Beams & Slabs', desc: 'Sill Beam (M15 with 8mm Bar reinforcement)', unit: 'rft', qty: sillL, matRate: costSillBeam / (sillL || 1), labRate: 0, total: costSillBeam },
    { sno: 18, category: 'Beams & Slabs', desc: 'Lintel Beam (M15 with 10mm TMT Bar)', unit: 'rft', qty: lintelL, matRate: costLintelBeam / (lintelL || 1), labRate: 0, total: costLintelBeam },
    { sno: 19, category: 'Beams & Slabs', desc: 'Loft, Sunshade, Counter Slab RCC', unit: 'cft', qty: loftCft, matRate: costLofts / (loftCft || 1), labRate: 0, total: costLofts },
    { sno: 20, category: 'Beams & Slabs', desc: 'Roof Beam & Roof Slab Concrete (M20 RCC)', unit: 'cft', qty: totalRoofBeamSlabCft, matRate: costRoofBeamSlab / (totalRoofBeamSlabCft || 1), labRate: 0, total: costRoofBeamSlab },
    { sno: 21, category: 'Staircase', desc: 'Staircase Brick Steps Volume', unit: 'cft', qty: staircaseBrickworkCft, matRate: 0, labRate: 0, total: 0 },
    { sno: 22, category: 'Terrace', desc: 'Terrace Surkhi (Brickbat weathering course + lime)', unit: 'cft', qty: terraceSurkhiCft, matRate: costTerraceSurkhi / (terraceSurkhiCft || 1), labRate: 0, total: costTerraceSurkhi },
    { sno: 23, category: 'Staircase', desc: 'Staircase Waist Slab Concrete (M20 RCC)', unit: 'cft', qty: staircaseConcreteCft, matRate: costStaircaseConcrete / (staircaseConcreteCft || 1), labRate: 0, total: costStaircaseConcrete },
    { sno: 24, category: 'Civil Labour', desc: 'Superstructure Civil Labour Execution', unit: 'sq.ft', qty: totalBuiltupArea, matRate: 0, labRate: rates.labourSuperstructurePerSqft, total: civilLabourCost },
    { sno: 25, category: 'MEP', desc: 'Electrical & Plumbing System Complete', unit: 'sq.ft', qty: gfArea, matRate: rates.electricalPlumbingMatRate, labRate: rates.electricalPlumbingLabRate, total: epDirectCost },
    { sno: 26, category: 'Doors & Windows', desc: 'Main Door (Kinza Teak finish)', unit: 'sq.ft', qty: mainDoorArea, matRate: rates.doorMainRate, labRate: 0, total: costMainDoor },
    { sno: 27, category: 'Doors & Windows', desc: 'Internal Room Doors (Sal Frame & Flush Door)', unit: 'sq.ft', qty: roomDoorsArea, matRate: rates.doorRoomRate, labRate: 0, total: costRoomDoors },
    { sno: 28, category: 'Doors & Windows', desc: 'Pooja Room Teak Door', unit: 'sq.ft', qty: poojaDoorArea, matRate: rates.doorPoojaRate, labRate: 0, total: costPoojaDoor },
    { sno: 29, category: 'Doors & Windows', desc: 'Bathroom PVC Doors & Frames', unit: 'sq.ft', qty: bathDoorsArea, matRate: rates.doorBathroomRate, labRate: 0, total: costBathDoors },
    { sno: 30, category: 'Doors & Windows', desc: 'UPVC Windows with MS Safety Grills', unit: 'sq.ft', qty: windowsArea, matRate: rates.windowUPVCRate, labRate: 0, total: costWindows },
    { sno: 31, category: 'Finishes', desc: 'Vitrified Tile Flooring (2x2)', unit: 'sq.ft', qty: Number(t.flooringSqft) || 532.5, matRate: rates.tileFlooringMat, labRate: rates.tileFlooringLab, total: costFlooringTile },
    { sno: 32, category: 'Finishes', desc: 'Tile Skirting 4" Band', unit: 'rft', qty: Number(t.skirtingRft) || 86.28, matRate: rates.tileSkirtingMat, labRate: rates.tileSkirtingLab, total: costSkirtingTile },
    { sno: 33, category: 'Finishes', desc: 'Anti-skid Bathroom Flooring Tiles', unit: 'sq.ft', qty: Number(t.bathFloorSqft) || 60, matRate: rates.tileBathFloorMat, labRate: rates.tileBathFloorLab, total: costBathFloorTile },
    { sno: 34, category: 'Finishes', desc: 'Glazed Bathroom Wall Dadoing (up to 7ft)', unit: 'sq.ft', qty: Number(t.bathWallSqft) || 520, matRate: rates.tileBathWallMat, labRate: rates.tileBathWallLab, total: costBathWallTile },
    { sno: 35, category: 'Finishes', desc: 'Kitchen Wall Ceramic Tiles (up to 2ft above slab)', unit: 'sq.ft', qty: Number(t.kitchenWallSqft) || 64, matRate: rates.tileKitchenWallMat, labRate: rates.tileKitchenWallLab, total: costKitchenWallTile },
    { sno: 36, category: 'Finishes', desc: 'Parking / Balcony Heavy-duty Tiles', unit: 'sq.ft', qty: Number(t.parkingPorticoSqft) || 123, matRate: rates.tileParkingMat, labRate: rates.tileParkingLab, total: costParkingTile },
    { sno: 37, category: 'Finishes', desc: 'Jet Black Granite Kitchen Countertop', unit: 'sq.ft', qty: Number(t.graniteCounterSqft) || 60, matRate: rates.graniteCounterMat, labRate: rates.graniteCounterLab, total: costGraniteCounter },
    { sno: 38, category: 'Finishes', desc: 'Granite Steps & Landing Finishing', unit: 'sq.ft', qty: Number(t.graniteStepsSqft) || 171.5, matRate: 0, labRate: rates.graniteStepsLab, total: costGraniteSteps },
    { sno: 39, category: 'Painting', desc: 'Interior Painting (White cement + 1 Primer + 2 Apex)', unit: 'sq.ft', qty: innerPaintArea, matRate: rates.paintInnerRate, labRate: 0, total: costInnerPaint },
    { sno: 40, category: 'Painting', desc: 'Exterior Painting (2 Putty + 1 Primer + 2 Premium)', unit: 'sq.ft', qty: wallOuterPlasterSqft, matRate: rates.paintOuterRate, labRate: 0, total: costOuterPaint },
    { sno: 41, category: 'Painting', desc: 'Ceiling Painting (1 Putty + 1 Primer + 2 Premium)', unit: 'sq.ft', qty: ceilingPlasterSqft, matRate: rates.paintCeilingRate, labRate: 0, total: costCeilingPaint },
    { sno: 42, category: 'Ancillary', desc: 'Under Ground Sump (Flyash Brickwork & Plaster)', unit: 'Litres', qty: Number(additionalWorks.sumpLitres) || 2500, matRate: rates.sumpRatePerLitre, labRate: 0, total: costSump },
    { sno: 43, category: 'Ancillary', desc: 'Septic Tank (Flyash Brickwork 3 Chambers)', unit: 'Litres', qty: Number(additionalWorks.septicLitres) || 10200, matRate: rates.septicRatePerLitre, labRate: 0, total: costSeptic },
  ];

  // Category Breakup for Charts & Tables
  const categoryBreakup = [
    { name: 'Civil Structure', cost: civilTotalCostWithMarkup, costPerSqft: totalBuiltupArea ? (civilTotalCostWithMarkup / totalBuiltupArea) : 0, color: '#3b82f6' },
    { name: 'Electrical & Plumbing', cost: epTotalCostWithMarkup, costPerSqft: totalBuiltupArea ? (epTotalCostWithMarkup / totalBuiltupArea) : 0, color: '#10b981' },
    { name: 'Doors & Windows', cost: totalDoorsWindowsWithMarkup, costPerSqft: totalBuiltupArea ? (totalDoorsWindowsWithMarkup / totalBuiltupArea) : 0, color: '#f59e0b' },
    { name: 'Tiles & Granite', cost: totalTilesWithMarkup, costPerSqft: totalBuiltupArea ? (totalTilesWithMarkup / totalBuiltupArea) : 0, color: '#8b5cf6' },
    { name: 'Painting Work', cost: totalPaintWithMarkup, costPerSqft: totalBuiltupArea ? (totalPaintWithMarkup / totalBuiltupArea) : 0, color: '#ec4899' },
    { name: 'Elevation Work', cost: totalElevationWithMarkup, costPerSqft: 0, color: '#6366f1' },
    { name: 'Additional Works (Sump & Septic)', cost: totalAdditionalWithMarkup, costPerSqft: totalBuiltupArea ? (totalAdditionalWithMarkup / totalBuiltupArea) : 0, color: '#14b8a6' },
  ];

  // Bill of Materials Item Summary
  const bomSummary = [
    { name: 'Cement (Dalmia / UltraTech)', unit: 'Bags (50kg)', qty: Math.round(totalCementBags * 10) / 10, unitRate: rates.cement, totalAmount: Math.round(totalCementBags * rates.cement) },
    { name: 'TMT Steel (ARS Fe550D ISI)', unit: 'Kg', qty: Math.round(totalSteelKg * 10) / 10, unitRate: rates.steel, totalAmount: Math.round(totalSteelKg * rates.steel), subNote: `${(totalSteelTons).toFixed(2)} Metric Tons` },
    { name: 'Flyash Bricks (Basement & Sumps)', unit: 'Pieces', qty: Math.round(totalFlyashBricks), unitRate: rates.brickFlyash, totalAmount: Math.round(totalFlyashBricks * rates.brickFlyash) },
    { name: 'Red Chamber Clay Bricks', unit: 'Pieces', qty: Math.round(totalChamberBricks), unitRate: rates.brickChamber, totalAmount: Math.round(totalChamberBricks * rates.brickChamber) },
    { name: 'M-Sand (Manufactured Sand)', unit: 'CFT', qty: Math.round(totalMsandCft * 10) / 10, unitRate: rates.msand, totalAmount: Math.round(totalMsandCft * rates.msand), subNote: `${(totalMsandCft / 100).toFixed(2)} Units` },
    { name: 'P-Sand (Plastering Sand)', unit: 'CFT', qty: Math.round(totalPsandCft * 10) / 10, unitRate: rates.psand, totalAmount: Math.round(totalPsandCft * rates.psand), subNote: `${(totalPsandCft / 100).toFixed(2)} Units` },
    { name: '20mm Blue Metal Aggregate', unit: 'CFT', qty: Math.round(totalAggregateCft * 10) / 10, unitRate: rates.aggregate, totalAmount: Math.round(totalAggregateCft * rates.aggregate), subNote: `${(totalAggregateCft / 100).toFixed(2)} Units` },
    { name: 'Gravel Filling', unit: 'CFT', qty: Math.round(totalGravelCft * 10) / 10, unitRate: rates.gravel, totalAmount: Math.round(totalGravelCft * rates.gravel) },
    { name: 'BrickBat for Terrace Surkhi', unit: 'CFT', qty: Math.round(terraceSurkhiCft * 10) / 10, unitRate: rates.brickBat, totalAmount: Math.round(terraceSurkhiCft * rates.brickBat) },
    { name: 'Lime Bags', unit: 'Bags', qty: Math.round(terraceLimeBags * 10) / 10, unitRate: rates.lime, totalAmount: Math.round(terraceLimeBags * rates.lime) },
  ];

  return {
    totalBuiltupArea,
    gfArea,
    civilTotalCostWithMarkup,
    epTotalCostWithMarkup,
    totalDoorsWindowsWithMarkup,
    totalTilesWithMarkup,
    totalPaintWithMarkup,
    totalAdditionalWithMarkup,
    mainBuildingEstimateWithMarkup,
    overallTotalEstimate,
    costPerSqft,
    mainBuildingCostPerSqft,
    totalCementBags,
    totalSteelTons,
    totalSteelKg,
    totalChamberBricks,
    totalFlyashBricks,
    totalMsandCft,
    totalPsandCft,
    totalAggregateCft,
    totalGravelCft,
    boqSchedule,
    categoryBreakup,
    bomSummary,
  };
}

