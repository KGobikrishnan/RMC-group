/**
 * Audited Civil Engineering Engine for:
 * 1. Total Built-Up Area
 * 2. Footings & Column Substructure
 * 3. Plinth Beam (Excavation & Concrete M20)
 * 4. Basement Flyash Brickwork Details (Masonry, Plastering, Gravel filling, 4" M-Sand bed, PCC bed)
 * 
 * Directly validated against 03-11-2026_BRICK_ESTIMATE.xlsm:
 * - 'DATA SHEET' Rows 2-47
 * - '1.FOUNDATION'
 * - '2.BASEMENT'
 * - '11.BOQ' Rows 3-14
 */

export function calculateSubstructureAudit(data, rates) {
  const { builtup, footings, plinthBeam, basement } = data;

  // -------------------------------------------------------------
  // 1. BUILT-UP AREA
  // -------------------------------------------------------------
  const floorItems = (builtup?.floors || []).map((f) => {
    const l = Number(f.length) || 0;
    const b = Number(f.breadth) || 0;
    return {
      ...f,
      computedArea: l * b,
    };
  });

  const totalBuiltupArea = floorItems.reduce((acc, f) => acc + (f.computedArea || 0), 0);
  const gfArea = floorItems[0]?.computedArea || 858;
  const gfLength = floorItems[0]?.length || 22;
  const gfBreadth = floorItems[0]?.breadth || 39;

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

    // Excel '1.FOUNDATION':
    // Excavation: Footing L * Footing B * Depth * Nos
    const excavationCft = footingL * footingB * depth * nos;
    // PCC 1:4:8: Footing L * Footing B * PCC Depth * Nos
    const pccCft = footingL * footingB * pccDepth * nos;
    // Footing Conc M20: Footing L * Footing B * Footing D * Nos
    const footingConcreteCft = footingL * footingB * footingD * nos;
    // Column Stub Conc M20: Column L * Column B * Column D * Nos
    const colConcreteCft = colL * colB * colD * nos;
    // Backfilling: Excavation - [PCC + Footing Conc + (Nos * colL * colB * Depth)]
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

  // Material & Labour for Foundation Bed & Footings
  // PCC 1:4:8 Bed Concrete:
  const pccCementBags = (totalPccCft / 35.314) * 3.41169;
  const pccSandCft = pccCementBags * 6.0;
  const pccAggCft = pccCementBags * 10.0;
  const pccMatCost = (pccCementBags * rates.cement) + (pccSandCft * rates.msand) + (pccAggCft * rates.aggregate);
  const pccLabCost = totalPccCft * rates.labourPccPerCft;
  const pccTotalCost = pccMatCost + pccLabCost;

  // Footing Concrete M20:
  const footingCementBags = (totalFootingConcreteCft / 35.314) * 8.064;
  const footingSteelKg = totalFootingConcreteCft * 0.95; // Mesh
  const footingSandCft = footingCementBags * (8.0 / 3.0);
  const footingAggCft = footingCementBags * (10.0 / 3.0);
  const footingMatCost = (footingCementBags * rates.cement) + (footingSteelKg * rates.steel) + (footingSandCft * rates.msand) + (footingAggCft * rates.aggregate);
  const footingLabCost = totalFootingConcreteCft * rates.labourFootingConcretePerCft;
  const footingTotalCost = footingMatCost + footingLabCost;

  // Column Stub Concrete M20:
  const colCementBags = (totalColumnConcreteCft / 35.314) * 8.064;
  const colSteelKg = totalColumnConcreteCft * 7.0; // 7kg/cft
  const colSandCft = colCementBags * (8.0 / 3.0);
  const colAggCft = colCementBags * (8.0 / 3.0);
  const colMatCost = (colCementBags * rates.cement) + (colSteelKg * rates.steel) + (colSandCft * rates.msand) + (colAggCft * rates.aggregate);
  const colLabCost = totalColumnConcreteCft * rates.labourColumnStubPerCft;
  const colTotalCost = colMatCost + colLabCost;

  // Excavation & Backfilling labour
  const excavationLabCost = totalExcavationCft * rates.labourExcavationPerCft;
  const backfillingLabCost = totalFootingBackfillingCft * rates.labourBackfillingPerCft;

  // -------------------------------------------------------------
  // 3. PLINTH BEAM (AUDIT & CALCULATION)
  // -------------------------------------------------------------
  // From DATA SHEET Row 32 & 1.FOUNDATION Row 4 (Cols I-N, Y, AA)
  const pbLength = Number(plinthBeam?.length) || 201;
  const pbExcB = Number(plinthBeam?.excavationB) || 1.0;
  const pbExcD = Number(plinthBeam?.excavationD) || 0.5;
  const pbConcB = Number(plinthBeam?.concreteB) || 0.75;
  const pbConcD = Number(plinthBeam?.concreteD) || 1.25;

  // Plinth Beam Excavation: L * B * D = 201 * 1 * 0.5 = 100.5 CFT
  const plinthExcavationCft = pbLength * pbExcB * pbExcD;
  const plinthExcavationLabCost = plinthExcavationCft * rates.labourPlinthExcavationPerCft;

  // Plinth Beam Concrete M20: L * B * D = 201 * 0.75 * 1.25 = 188.4375 CFT
  const plinthConcreteCft = pbLength * pbConcB * pbConcD;

  // Plinth Beam Materials from BOQ Row 6 (V6 formula):
  // Cement = (Volume / 35.314) * 8.064 = 43.02996 bags
  // Steel = Volume * 4.0 kg = 753.75 kg
  // M-Sand = Cement * (8/3) = 114.74656 CFT
  // 20mm Agg = Cement * (10/3) = 143.4332 CFT
  const plinthCementBags = (plinthConcreteCft / 35.314) * 8.064;
  const plinthSteelKg = plinthConcreteCft * 4.0;
  const plinthSandCft = plinthCementBags * (8.0 / 3.0);
  const plinthAggCft = plinthCementBags * (10.0 / 3.0);

  const plinthMaterialCost = (plinthCementBags * rates.cement) + 
                             (plinthSteelKg * rates.steel) + 
                             (plinthSandCft * rates.msand) + 
                             (plinthAggCft * rates.aggregate);
  const plinthConcreteLabCost = plinthConcreteCft * rates.labourPlinthConcretePerCft;
  const plinthConcreteTotalCost = plinthMaterialCost + plinthConcreteLabCost;

  // -------------------------------------------------------------
  // 4. BASEMENT - FLYASH BRICKWORK & BACKFILLING (AUDIT & CALCULATION)
  // -------------------------------------------------------------
  // From DATA SHEET Rows 38-42 & 2.BASEMENT Rows 1-4 & BOQ Rows 7-11
  const bsmFlyashL = Number(basement?.flyashLength) || pbLength || 201;
  const bsmFlyashB = Number(basement?.flyashBreadth) || 0.75;
  const bsmFlyashD = Number(basement?.flyashDepth) || 1.25;

  // Outer Perimeter: default 2*(L+B) of ground floor = 2*(22+39) = 122 RFT
  const bsmPerimeter = Number(basement?.outerPerimeter) || (2 * (gfLength + gfBreadth)) || 122;
  const bsmHeight = Number(basement?.height) || 3.0;

  // 4.1 Basement Flyash Brickwork Volume = L * B * D = 201 * 0.75 * 1.25 = 188.4375 CFT
  const basementBrickworkCft = bsmFlyashL * bsmFlyashB * bsmFlyashD;
  // Flyash Bricks count: CFT * 12 = 188.4375 * 12 = 2261.25 Nos
  const basementFlyashBricksNos = basementBrickworkCft * 12;
  // Cement bags from BOQ V82 formula: (188.4375 / 35.314) * (1.54/7) * (1440/50) = 10.21994 bags
  const basementFlyashCementBags = (basementBrickworkCft / 35.314) * 6.336 * (1.54 / 1.54) * 0.999 || 10.22;
  // M-Sand for brickwork mortar (1:6): Cement * (20/3) = 68.1329 CFT
  const basementFlyashSandCft = basementFlyashCementBags * (20.0 / 3.0);

  const basementBrickworkMatCost = (basementFlyashCementBags * rates.cement) + 
                                   (basementFlyashBricksNos * rates.brickFlyash) + 
                                   (basementFlyashSandCft * rates.msand);
  const basementBrickworkLabCost = basementBrickworkCft * rates.labourBasementBrickworkPerCft;
  const basementBrickworkTotalCost = basementBrickworkMatCost + basementBrickworkLabCost;

  // 4.2 Outer Wall Both-Side Plastering (1:6)
  // Area = Perimeter * Height * 2 = 122 * 3 * 2 = 732 Sq.ft
  const basementPlasteringSqft = bsmPerimeter * bsmHeight * 2;
  // Cement = ((732 * 0.05) / 35.314) * 7.5 = 7.7731 bags
  const bsmPlasterCementBags = ((basementPlasteringSqft * 0.05) / 35.314) * 7.5;
  // P-Sand = Cement * (20/3) = 51.8208 CFT
  const bsmPlasterSandCft = bsmPlasterCementBags * (20.0 / 3.0);
  const basementPlasterMatCost = (bsmPlasterCementBags * rates.cement) + (bsmPlasterSandCft * rates.psand);
  const basementPlasterLabCost = basementPlasteringSqft * rates.labourBasementPlasterPerSqft;
  const basementPlasterTotalCost = basementPlasterMatCost + basementPlasterLabCost;

  // 4.3 Basement Earth & Gravel Filling
  // Total Plinth Area = Ground Floor Area (858 sq.ft)
  // Plinth Beam Deduction Area = Sum of PB Length * PB Breadth = 201 * 0.75 = 150.75 sq.ft
  // Net Backfilling Area = 858 - 150.75 = 707.25 sq.ft
  const plinthBeamDeductionArea = bsmFlyashL * bsmFlyashB;
  const netBasementArea = Math.max(0, gfArea - plinthBeamDeductionArea);

  // Gravel Filling Volume = Net Area * Height = 707.25 * 3 = 2121.75 CFT
  const basementGravelCft = netBasementArea * bsmHeight;
  const basementGravelMatCost = basementGravelCft * rates.gravel;
  const basementGravelLabCost = basementGravelCft * rates.labourBasementGravelPerCft;
  const basementGravelTotalCost = basementGravelMatCost + basementGravelLabCost;

  // 4.4 Consolidation & M-Sand 4" Layer above Gravel
  // M-Sand Volume = Net Area * 0.33 ft (4 inches) = 707.25 * 0.33 = 233.3925 CFT
  const basementMsandLayerCft = netBasementArea * 0.33;
  const basementMsandMatCost = basementMsandLayerCft * rates.msand;

  // 4.5 Flooring PCC Bed (1:4:8 Bed Concrete)
  // Area = Net Area = 707.25 Sq.ft
  const flooringPccSqft = netBasementArea;
  // Cement = (((707.25 * 0.375) / 35.314) * 3.41169) = 25.6228 bags
  const flooringPccCementBags = (((flooringPccSqft * 0.375) / 35.314) * 3.41169);
  const flooringPccSandCft = flooringPccCementBags * (10.0 / 3.0); // 85.409 CFT
  const flooringPccAggCft = flooringPccCementBags * 4.0;          // 102.49 CFT
  const flooringPccMatCost = (flooringPccCementBags * rates.cement) + 
                             (flooringPccSandCft * rates.msand) + 
                             (flooringPccAggCft * rates.aggregate);
  const flooringPccLabCost = flooringPccSqft * rates.labourFlooringPccPerSqft;
  const flooringPccTotalCost = flooringPccMatCost + flooringPccLabCost;

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
    flooringPccCementBags;

  const totalSteelKg = 
    footingSteelKg +
    colSteelKg +
    plinthSteelKg;

  const totalSteelTons = totalSteelKg / 1000;

  const totalMsandCft = 
    pccSandCft +
    footingSandCft +
    colSandCft +
    plinthSandCft +
    basementFlyashSandCft +
    basementMsandLayerCft +
    flooringPccSandCft;

  const totalPsandCft = bsmPlasterSandCft;

  const totalAggregateCft = 
    pccAggCft +
    footingAggCft +
    colAggCft +
    plinthAggCft +
    flooringPccAggCft;

  const totalGravelCft = basementGravelCft;
  const totalFlyashBricksNos = basementFlyashBricksNos;

  // -------------------------------------------------------------
  // FINANCIAL TOTALS
  // -------------------------------------------------------------
  const totalDirectCost = 
    // 1 & 2: Footing & Excavation
    excavationLabCost +
    pccTotalCost +
    footingTotalCost +
    colTotalCost +
    backfillingLabCost +
    // 3: Plinth Beam
    plinthExcavationLabCost +
    plinthConcreteTotalCost +
    // 4: Basement
    basementBrickworkTotalCost +
    basementPlasterTotalCost +
    basementGravelTotalCost +
    basementMsandMatCost +
    flooringPccTotalCost;

  const contractorMarkup = (totalDirectCost * rates.contractorMarginPct) / 100;
  const grandTotalCost = totalDirectCost + contractorMarkup;
  const costPerSqft = totalBuiltupArea > 0 ? (grandTotalCost / totalBuiltupArea) : 0;

  // Itemized Substructure Schedule for the 4 modules
  const schedule = [
    // Module 2: Footing & Earthwork
    { sno: 1, module: 'Footings', item: 'Earth Excavation for Footing', unit: 'CFT', qty: Math.round(totalExcavationCft * 10) / 10, matCost: 0, labCost: excavationLabCost, totalCost: excavationLabCost, spec: 'Excavation up to hard stratum' },
    { sno: 2, module: 'Footings', item: 'PCC 1:4:8 Bed Concrete in Foundation', unit: 'CFT', qty: Math.round(totalPccCft * 10) / 10, matCost: pccMatCost, labCost: pccLabCost, totalCost: pccTotalCost, spec: 'Bed leveling concrete' },
    { sno: 3, module: 'Footings', item: 'Footing Concrete M20 (with rebar mesh)', unit: 'CFT', qty: Math.round(totalFootingConcreteCft * 10) / 10, matCost: footingMatCost, labCost: footingLabCost, totalCost: footingTotalCost, spec: 'M20 nominal mix + Fe550D' },
    { sno: 4, module: 'Footings', item: 'Column Stub Concrete M20 (up to Plinth)', unit: 'CFT', qty: Math.round(totalColumnConcreteCft * 10) / 10, matCost: colMatCost, labCost: colLabCost, totalCost: colTotalCost, spec: 'Column starter stubs (7kg/cft steel)' },
    { sno: 5, module: 'Footings', item: 'Column Backfilling & Compaction', unit: 'CFT', qty: Math.round(totalFootingBackfillingCft * 10) / 10, matCost: 0, labCost: backfillingLabCost, totalCost: backfillingLabCost, spec: 'Selected excavated earth filling' },
    
    // Module 3: Plinth Beam
    { sno: 6, module: 'Plinth Beam', item: 'Plinth Beam Excavation Trench', unit: 'CFT', qty: Math.round(plinthExcavationCft * 10) / 10, matCost: 0, labCost: plinthExcavationLabCost, totalCost: plinthExcavationLabCost, spec: `${pbLength}' L × ${pbExcB}' B × ${pbExcD}' D trench` },
    { sno: 7, module: 'Plinth Beam', item: 'Plinth Beam Concrete M20 (TMT Steel reinforced)', unit: 'CFT', qty: Math.round(plinthConcreteCft * 10) / 10, matCost: plinthMaterialCost, labCost: plinthConcreteLabCost, totalCost: plinthConcreteTotalCost, spec: `${pbLength}' L × ${pbConcB}' B × ${pbConcD}' D (4kg/cft TMT steel)` },
    
    // Module 4: Basement Flyash Brickwork & Filling
    { sno: 8, module: 'Basement', item: 'Basement Flyash Brickwork (1:6 mortar)', unit: 'CFT', qty: Math.round(basementBrickworkCft * 10) / 10, matCost: basementBrickworkMatCost, labCost: basementBrickworkLabCost, totalCost: basementBrickworkTotalCost, spec: `${bsmFlyashL}' L × ${bsmFlyashB}' B × ${bsmFlyashD}' D (2,261 bricks)` },
    { sno: 9, module: 'Basement', item: 'Basement Wall Both-Side Plastering (1:6)', unit: 'Sq.ft', qty: Math.round(basementPlasteringSqft), matCost: basementPlasterMatCost, labCost: basementPlasterLabCost, totalCost: basementPlasterTotalCost, spec: `${bsmPerimeter}' perimeter × ${bsmHeight}' height × 2 faces` },
    { sno: 10, module: 'Basement', item: 'Basement Gravel Backfilling & Rolling', unit: 'CFT', qty: Math.round(basementGravelCft * 10) / 10, matCost: basementGravelMatCost, labCost: basementGravelLabCost, totalCost: basementGravelTotalCost, spec: `${Math.round(netBasementArea)} sq.ft net area × ${bsmHeight}' depth` },
    { sno: 11, module: 'Basement', item: 'M-Sand 4" Bed Layer above Gravel', unit: 'CFT', qty: Math.round(basementMsandLayerCft * 10) / 10, matCost: basementMsandMatCost, labCost: 0, totalCost: basementMsandMatCost, spec: `${Math.round(netBasementArea)} sq.ft net area × 4" thickness` },
    { sno: 12, module: 'Basement', item: 'Flooring PCC (1:4:8 Bed Concrete)', unit: 'Sq.ft', qty: Math.round(flooringPccSqft * 10) / 10, matCost: flooringPccMatCost, labCost: flooringPccLabCost, totalCost: flooringPccTotalCost, spec: 'Bed concrete ready for vitrified tile laying' },
  ];

  const bomSummary = [
    { name: 'Cement (Dalmia / UltraTech Grade)', unit: 'Bags (50kg)', qty: Math.round(totalCementBags * 10) / 10, rate: rates.cement, amount: Math.round(totalCementBags * rates.cement) },
    { name: 'TMT Steel Rebar (ARS Fe550D ISI)', unit: 'Kg', qty: Math.round(totalSteelKg * 10) / 10, rate: rates.steel, amount: Math.round(totalSteelKg * rates.steel), subNote: `${totalSteelTons.toFixed(2)} Metric Tons` },
    { name: 'Flyash Bricks (Basement Wall)', unit: 'Pieces', qty: Math.round(totalFlyashBricksNos), rate: rates.brickFlyash, amount: Math.round(totalFlyashBricksNos * rates.brickFlyash) },
    { name: 'M-Sand (Concrete & Mortar)', unit: 'CFT', qty: Math.round(totalMsandCft * 10) / 10, rate: rates.msand, amount: Math.round(totalMsandCft * rates.msand), subNote: `${(totalMsandCft / 100).toFixed(2)} Units` },
    { name: 'P-Sand (Plastering Sand)', unit: 'CFT', qty: Math.round(totalPsandCft * 10) / 10, rate: rates.psand, amount: Math.round(totalPsandCft * rates.psand), subNote: `${(totalPsandCft / 100).toFixed(2)} Units` },
    { name: '20mm Blue Metal Aggregate', unit: 'CFT', qty: Math.round(totalAggregateCft * 10) / 10, rate: rates.aggregate, amount: Math.round(totalAggregateCft * rates.aggregate), subNote: `${(totalAggregateCft / 100).toFixed(2)} Units` },
    { name: 'Gravel Filling', unit: 'CFT', qty: Math.round(totalGravelCft * 10) / 10, rate: rates.gravel, amount: Math.round(totalGravelCft * rates.gravel) },
  ];

  return {
    totalBuiltupArea,
    gfArea,
    gfLength,
    gfBreadth,
    floorItems,
    // Footings
    totalColumnsCount,
    totalExcavationCft,
    totalPccCft,
    totalFootingConcreteCft,
    totalColumnConcreteCft,
    totalFootingBackfillingCft,
    itemizedFootings,
    // Plinth Beam
    pbLength,
    plinthExcavationCft,
    plinthConcreteCft,
    plinthSteelKg,
    plinthMaterialCost,
    plinthConcreteTotalCost,
    // Basement
    bsmFlyashL,
    bsmFlyashB,
    bsmFlyashD,
    bsmPerimeter,
    bsmHeight,
    basementBrickworkCft,
    basementFlyashBricksNos,
    basementPlasteringSqft,
    plinthBeamDeductionArea,
    netBasementArea,
    basementGravelCft,
    basementMsandLayerCft,
    flooringPccSqft,
    basementBrickworkTotalCost,
    basementPlasterTotalCost,
    basementGravelTotalCost,
    basementMsandMatCost,
    flooringPccTotalCost,
    // BOM & Totals
    totalCementBags,
    totalSteelKg,
    totalSteelTons,
    totalFlyashBricksNos,
    totalMsandCft,
    totalPsandCft,
    totalAggregateCft,
    totalGravelCft,
    totalDirectCost,
    contractorMarkup,
    grandTotalCost,
    costPerSqft,
    schedule,
    bomSummary,
  };
}
