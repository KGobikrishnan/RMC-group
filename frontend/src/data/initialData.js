// Enterprise Rate Defaults based on 03-11-2026_BRICK_ESTIMATE.xlsm
export const DEFAULT_RATES = {
  // Material Rates
  cement: 310,            // Rs/Bag (Dalmia / UltraTech Grade)
  steel: 70,              // Rs/Kg (ARS Fe550D ISI)
  msand: 63,              // Rs/CFT (Manufactured Sand)
  psand: 73,              // Rs/CFT (Plastering Sand)
  aggregate: 58,          // Rs/CFT (20mm Blue Metal)
  gravel: 22,             // Rs/CFT (Basement Gravel Backfilling)
  brickFlyash: 8.5,       // Rs/piece (Flyash Bricks for Basement)

  // Foundation & Substructure Labour Rates (Rs/CFT or Rs/Sq.ft)
  labourExcavationPerCft: 8,       // Earth excavation labour
  labourPccPerCft: 18,             // Bed PCC labour
  labourFootingConcretePerCft: 25, // Footing RCC labour
  labourColumnStubPerCft: 35,      // Column stub RCC labour
  labourBackfillingPerCft: 5,      // Backfilling & compaction labour
  labourPlinthExcavationPerCft: 8, // Plinth beam excavation labour
  labourPlinthConcretePerCft: 25,  // Plinth beam RCC labour
  labourBasementBrickworkPerCft: 20,// Flyash brickwork labour
  labourBasementPlasterPerSqft: 12,// 1:6 Plastering labour
  labourBasementGravelPerCft: 4,   // Gravel spreading & rolling
  labourFlooringPccPerSqft: 10,    // Flooring PCC bed labour

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
  // 1. Built-Up Area
  builtup: {
    floors: [
      { id: '1', name: 'Ground Floor', length: 22, breadth: 39, area: 858 },
      { id: '2', name: 'First Floor', length: 20, breadth: 30, area: 600 },
      { id: '3', name: 'Second Floor', length: 10, breadth: 30, area: 300 },
    ],
    totalContractArea: 1758,
  },
  // 2. Footing & Column Schedule
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
  ],
  // 3. Plinth Beam
  plinthBeam: {
    name: 'PB1',
    // In excel Row 32: Length = 201 ft (from 28*3 + 39*3 or outer runs)
    length: 201,
    excavationB: 1.0,
    excavationD: 0.5,
    concreteB: 0.75,
    concreteD: 1.25,
  },
  // 4. Basement Flyash Brickwork & Earth Filling Details
  basement: {
    name: 'Basement Flyash Brickwork',
    // In excel Row 42: L=201, B=0.75, D=1.25 (added 3" for 1 layer below P.Beam)
    flyashLength: 201,
    flyashBreadth: 0.75,
    flyashDepth: 1.25,
    // Outer perimeter: (22*2 + 39*2) = 122 ft, Height = 3 ft
    outerPerimeter: 122,
    height: 3.0,
    // Auto calculated in sheet:
    // Plinth Beam area = 201 * 0.75 = 150.75 sq.ft
    // Net Filling Area = 858 - 150.75 = 707.25 sq.ft
    // Backfilling Gravel = 707.25 * 3 = 2121.75 CFT
    // M-sand 4" layer = 707.25 * 0.33 = 233.39 CFT
    // Flooring PCC Area = 707.25 sq.ft
    // Plastering Area = 122 * 3 * 2 = 732 sq.ft
  }
};
