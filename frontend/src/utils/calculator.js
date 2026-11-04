/**
 * Focused Civil Engine: Total Area & Footing Foundation Calculator
 * Directly mirrors 03-11-2026_BRICK_ESTIMATE.xlsm ('DATA SHEET' & '1.FOUNDATION')
 */

export function calculateFootingAndArea(data, rates) {
  const { builtup, footings } = data;

  // 1. Built-Up Area Calculations
  const floorItems = (builtup?.floors || []).map((f, i) => {
    const l = Number(f.length) || 0;
    const b = Number(f.breadth) || 0;
    const area = l * b;
    return {
      ...f,
      computedArea: area,
    };
  });

  const totalBuiltupArea = floorItems.reduce((acc, f) => acc + (f.computedArea || 0), 0);
  const gfArea = floorItems[0]?.computedArea || 0;

  // 2. Footing & Column Foundation Schedule Calculations
  let totalColumnsCount = 0;
  let totalExcavationCft = 0;
  let totalPccCft = 0;
  let totalFootingConcreteCft = 0;
  let totalColumnConcreteCft = 0;
  let totalBackfillingCft = 0;

  const itemizedFootings = (footings || []).map((row, idx) => {
    const nos = Number(row.nos) || 0;
    const colL = Number(row.colL) || 0;
    const colB = Number(row.colB) || 0;
    const colD = Number(row.colD) || 0;
    const footingL = Number(row.footingL) || 0;
    const footingB = Number(row.footingB) || 0;
    const footingD = Number(row.footingD) || 0;
    const depth = Number(row.depth) || 0;
    const pccDepth = Number(row.pccDepth) || 0;

    // Excel Formulas from '1.FOUNDATION':
    // Excavation = Footing L * Footing B * Excavation Depth * Nos
    const excavationCft = footingL * footingB * depth * nos;

    // PCC Bed (1:4:8) = Footing L * Footing B * PCC Depth * Nos
    const pccCft = footingL * footingB * pccDepth * nos;

    // Footing Concrete (M20) = Footing L * Footing B * Footing D * Nos
    const footingConcreteCft = footingL * footingB * footingD * nos;

    // Column Stub Concrete (M20) = Column L * Column B * Column D * Nos
    const colConcreteCft = colL * colB * colD * nos;

    // Backfilling = Excavation - (PCC + Footing Concrete + (Nos * colL * colB * Depth))
    const colDeductionInExcavation = nos * colL * colB * depth;
    const backfillingCft = Math.max(0, excavationCft - (pccCft + footingConcreteCft + colDeductionInExcavation));

    totalColumnsCount += nos;
    totalExcavationCft += excavationCft;
    totalPccCft += pccCft;
    totalFootingConcreteCft += footingConcreteCft;
    totalColumnConcreteCft += colConcreteCft;
    totalBackfillingCft += backfillingCft;

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

  // 3. Materials Consumption & Mix Design (IS 456 Standards)
  // Conversion CFT -> Cu.m = / 35.314

  // PCC 1:4:8 Foundation Bed:
  // Cement = (PCC CFT / 35.314) * 3.41169 bags
  const pccCementBags = (totalPccCft / 35.314) * 3.41169;
  const pccSandCft = pccCementBags * 6.0;
  const pccAggCft = pccCementBags * 10.0;
  const pccMaterialCost = (pccCementBags * rates.cement) + (pccSandCft * rates.msand) + (pccAggCft * rates.aggregate);
  const pccLabourCost = totalPccCft * rates.labourPccPerCft;
  const pccTotalCost = pccMaterialCost + pccLabourCost;

  // Footing Concrete M20:
  // Cement = (Footing CFT / 35.314) * 8.064 bags
  // Steel = Footing CFT * 0.95 kg (standard footing mesh)
  const footingCementBags = (totalFootingConcreteCft / 35.314) * 8.064;
  const footingSteelKg = totalFootingConcreteCft * 0.95;
  const footingSandCft = footingCementBags * 2.6667;
  const footingAggCft = footingCementBags * 3.3333;
  const footingMaterialCost = (footingCementBags * rates.cement) + (footingSteelKg * rates.steel) + (footingSandCft * rates.msand) + (footingAggCft * rates.aggregate);
  const footingLabourCost = totalFootingConcreteCft * rates.labourFootingConcretePerCft;
  const footingTotalCost = footingMaterialCost + footingLabourCost;

  // Column Stub Concrete M20:
  // Steel = Column CFT * 7.0 kg (vertical reinforcement + rings)
  const colCementBags = (totalColumnConcreteCft / 35.314) * 8.064;
  const colSteelKg = totalColumnConcreteCft * 7.0;
  const colSandCft = colCementBags * 2.6667;
  const colAggCft = colCementBags * 2.6667;
  const colMaterialCost = (colCementBags * rates.cement) + (colSteelKg * rates.steel) + (colSandCft * rates.msand) + (colAggCft * rates.aggregate);
  const colLabourCost = totalColumnConcreteCft * rates.labourColumnStubPerCft;
  const colTotalCost = colMaterialCost + colLabourCost;

  // Earthwork Excavation & Backfilling Labour Costs
  const excavationLabourCost = totalExcavationCft * rates.labourExcavationPerCft;
  const backfillingLabourCost = totalBackfillingCft * rates.labourBackfillingPerCft;

  // Total Direct Foundation Cost
  const totalDirectFoundationCost = 
    excavationLabourCost +
    pccTotalCost +
    footingTotalCost +
    colTotalCost +
    backfillingLabourCost;

  // Contractor Margin / Markup
  const contractorMarkup = (totalDirectFoundationCost * rates.contractorMarginPct) / 100;
  const grandTotalFoundationCost = totalDirectFoundationCost + contractorMarkup;

  // Material Aggregation (BOM for Foundation)
  const totalCementBags = pccCementBags + footingCementBags + colCementBags;
  const totalSteelKg = footingSteelKg + colSteelKg;
  const totalSteelTons = totalSteelKg / 1000;
  const totalMsandCft = pccSandCft + footingSandCft + colSandCft;
  const totalAggregateCft = pccAggCft + footingAggCft + colAggCft;

  const costPerSqft = totalBuiltupArea > 0 ? (grandTotalFoundationCost / totalBuiltupArea) : 0;

  // Itemized Foundation Schedule for Table
  const foundationSchedule = [
    {
      sno: 1,
      item: 'Earth Excavation for Footing',
      unit: 'CFT',
      qty: Math.round(totalExcavationCft * 10) / 10,
      materialCost: 0,
      labourCost: excavationLabourCost,
      totalCost: excavationLabourCost,
      spec: 'Manual / JCB earth cutting up to required depth in hard stratum'
    },
    {
      sno: 2,
      item: 'PCC 1:4:8 Bed Concrete in Foundation',
      unit: 'CFT',
      qty: Math.round(totalPccCft * 10) / 10,
      materialCost: pccMaterialCost,
      labourCost: pccLabourCost,
      totalCost: pccTotalCost,
      spec: 'Bed leveling concrete using 40mm/20mm aggregate & M-Sand'
    },
    {
      sno: 3,
      item: 'Footing Concrete M20 (Isolated Trapezoidal/Box)',
      unit: 'CFT',
      qty: Math.round(totalFootingConcreteCft * 10) / 10,
      materialCost: footingMaterialCost,
      labourCost: footingLabourCost,
      totalCost: footingTotalCost,
      spec: 'Nominal mix M20 (1:1.5:3) with Fe550D rebar mesh mat'
    },
    {
      sno: 4,
      item: 'Column Stub Concrete M20 (Up to Plinth)',
      unit: 'CFT',
      qty: Math.round(totalColumnConcreteCft * 10) / 10,
      materialCost: colMaterialCost,
      labourCost: colLabourCost,
      totalCost: colTotalCost,
      spec: 'Column starter stubs with 7kg/cft steel (TMT bars + stirrups)'
    },
    {
      sno: 5,
      item: 'Backfilling & Compaction',
      unit: 'CFT',
      qty: Math.round(totalBackfillingCft * 10) / 10,
      materialCost: 0,
      labourCost: backfillingLabourCost,
      totalCost: backfillingLabourCost,
      spec: 'Refilling excavated earth in 6" layers with water compaction'
    },
  ];

  const bomSummary = [
    { name: 'Cement (Dalmia / UltraTech Grade)', unit: 'Bags (50kg)', qty: Math.round(totalCementBags * 10) / 10, rate: rates.cement, amount: Math.round(totalCementBags * rates.cement) },
    { name: 'TMT Steel (ARS Fe550D ISI)', unit: 'Kg', qty: Math.round(totalSteelKg * 10) / 10, rate: rates.steel, amount: Math.round(totalSteelKg * rates.steel), subNote: `${totalSteelTons.toFixed(2)} Metric Tons` },
    { name: 'M-Sand (Manufactured Sand)', unit: 'CFT', qty: Math.round(totalMsandCft * 10) / 10, rate: rates.msand, amount: Math.round(totalMsandCft * rates.msand), subNote: `${(totalMsandCft / 100).toFixed(2)} Units` },
    { name: '20mm Blue Metal Aggregate', unit: 'CFT', qty: Math.round(totalAggregateCft * 10) / 10, rate: rates.aggregate, amount: Math.round(totalAggregateCft * rates.aggregate), subNote: `${(totalAggregateCft / 100).toFixed(2)} Units` },
  ];

  return {
    totalBuiltupArea,
    gfArea,
    floorItems,
    totalColumnsCount,
    totalExcavationCft,
    totalPccCft,
    totalFootingConcreteCft,
    totalColumnConcreteCft,
    totalBackfillingCft,
    itemizedFootings,
    foundationSchedule,
    bomSummary,
    totalCementBags,
    totalSteelKg,
    totalSteelTons,
    totalMsandCft,
    totalAggregateCft,
    totalDirectFoundationCost,
    contractorMarkup,
    grandTotalFoundationCost,
    costPerSqft,
  };
}
