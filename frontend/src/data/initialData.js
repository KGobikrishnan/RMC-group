// Enterprise Rates for Footing & Foundation civil calculations
export const DEFAULT_RATES = {
  // Material Rates
  cement: 310,            // Rs/Bag (Dalmia / UltraTech Grade)
  steel: 70,              // Rs/Kg (ARS Fe550D ISI)
  msand: 63,              // Rs/CFT (Manufactured Sand)
  psand: 73,              // Rs/CFT
  aggregate: 58,          // Rs/CFT (20mm Blue Metal)
  gravel: 22,             // Rs/CFT (Backfilling)
  
  // Foundation Work Labour Rates (Rs/cft or Lump Sum)
  labourExcavationPerCft: 8,       // Earth excavation labour
  labourPccPerCft: 18,             // Bed PCC labour
  labourFootingConcretePerCft: 25, // Footing RCC labour
  labourColumnStubPerCft: 35,      // Column stub RCC labour
  labourBackfillingPerCft: 5,      // Backfilling & compaction labour

  // Contractor Margin / Markup
  contractorMarginPct: 12,        // 10% Profit + 2% Wastage
};

export const INITIAL_PROJECT_DATA = {
  projectInfo: {
    clientName: "Er. M. Jahir Hussain Villa",
    siteLocation: "Building Doctor Complex, Uthamapalayam - 625533",
    contactNumber: "9489141122 / 9111493336",
    quoteDate: "2026-11-04",
  },
  builtup: {
    floors: [
      { id: '1', name: 'Ground Floor', length: 22, breadth: 39, area: 858 },
      { id: '2', name: 'First Floor', length: 20, breadth: 30, area: 600 },
      { id: '3', name: 'Second Floor', length: 10, breadth: 30, area: 300 },
    ],
    totalContractArea: 1758, // Total sum
  },
  footings: [
    { 
      id: 'f1', 
      colId: 'c1', 
      nos: 5, 
      colL: 0.75, 
      colB: 1.25, 
      colD: 5.0, 
      footingL: 4.0, 
      footingB: 4.0, 
      footingD: 1.5, 
      depth: 5.0, 
      pccDepth: 0.5 
    },
    { 
      id: 'f2', 
      colId: 'c2', 
      nos: 3, 
      colL: 1.0, 
      colB: 1.5, 
      colD: 5.0, 
      footingL: 5.0, 
      footingB: 5.0, 
      footingD: 2.0, 
      depth: 6.0, 
      pccDepth: 1.0 
    },
  ]
};
