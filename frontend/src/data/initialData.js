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
  brickChamber: 12.0,     // Rs/piece (Red Chamber Bricks for Superstructure)

  // Substructure Labour Rates
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

  // Superstructure (5, 6, 7) Labour & Contract Rates
  labourChamberBrickworkPerCft: 22,// Red Chamber Brickwork labour
  labourCeilingPlasterPerSqft: 42.5,// Ceiling Plastering (1:3 Mortar)
  labourInnerPlasterPerSqft: 39.5, // Inner Wall Plastering (1:6 Mortar)
  labourOuterPlasterPerSqft: 34,   // Outer Wall Plastering (1:6 Mortar)
  
  // Sill, Lintel & Lofts RCC Labour
  labourSillBeamPerRft: 45,        // Sill concrete beam
  labourLintelBeamPerRft: 65,      // Lintel beam RCC
  labourLoftsSunshadesPerCft: 35,  // Lofts, sunshades & counter slab

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
  // 3. Plinth Beams Schedule
  plinthBeams: [
    {
      id: 'pb1',
      name: 'PB1',
      length: 201,
      excavationB: 1.0,
      excavationD: 0.5,
      concreteB: 0.75,
      concreteD: 1.25,
    }
  ],
  // 4. Basement Flyash Brickwork & Earth Filling
  basement: {
    name: 'Basement Flyash Brickwork',
    flyashLength: 201,
    flyashBreadth: 0.75,
    flyashDepth: 1.25,
    outerPerimeter: 122,
    height: 3.0,
  },
  // 5. Superstructure Brickwork (Red Chamber Bricks 9" & 4.5" Walls) & Openings
  brickwork: {
    walls: [
      { id: 'w1', name: 'GF Vertical 9" Wall', length: 111, breadth: 0.75, height: 9 },
      { id: 'w2', name: 'GF Horizontal 9" Wall', length: 84, breadth: 0.75, height: 9 },
      { id: 'w3', name: 'GF Vertical 4.5" Wall', length: 0, breadth: 0.375, height: 9 },
      { id: 'w4', name: 'GF Horizontal 4.5" Wall', length: 50, breadth: 0.375, height: 9 },
    ],
    parapet: {
      length: 132,
      breadth: 0.75,
      height: 3.0,
    },
    openings: [
      { id: 'op1', type: 'Main Door Open', nos: 1, width: 3.25, thickness: 0.75, height: 7, deductionCft: 17.06 },
      { id: 'op2', type: 'Room Doors Open', nos: 3, width: 3.0, thickness: 0.75, height: 7, deductionCft: 47.25 },
      { id: 'op3', type: 'Toilet PVC Doors Open', nos: 2, width: 2.5, thickness: 0.375, height: 7, deductionCft: 14.44 },
      { id: 'op4', type: 'UPVC Windows Open', nos: 5, width: 3.0, thickness: 0.75, height: 4.2, deductionCft: 42.75 },
      { id: 'op5', type: 'Wall Opening Arch', nos: 1, width: 4.0, thickness: 0.75, height: 7, deductionCft: 42.75 },
      { id: 'op6', type: 'Ventilators Open', nos: 2, width: 2.0, thickness: 0.75, height: 1.5, deductionCft: 4.5 },
    ]
  },
  // 6. Wall & Ceiling Plastering (Inner & Outer)
  plastering: {
    rooms: [
      { id: 'r1', name: 'Hall', length: 10, breadth: 22.25, height: 10 },
      { id: 'r2', name: 'Kitchen', length: 10, breadth: 8.25, height: 10 },
      { id: 'r3', name: 'Bed room 1', length: 10, breadth: 11.25, height: 10 },
      { id: 'r4', name: 'Bed room 2', length: 10, breadth: 8.0, height: 10 },
      { id: 'r5', name: 'Pooja Room', length: 10, breadth: 3.5, height: 10 },
      { id: 'r6', name: 'Portico', length: 20.5, breadth: 6.0, height: 10 },
      { id: 'r7', name: 'Toilet 1', length: 10, breadth: 3.0, height: 10 },
      { id: 'r8', name: 'Toilet 2', length: 10, breadth: 3.0, height: 10 },
      { id: 'r9', name: 'Loft Slabs', length: 30, breadth: 1.75, height: 0 },
      { id: 'r10', name: 'Counter Slab', length: 16, breadth: 2.5, height: 0 },
    ],
    // Total opening deductions in plastering: 488.5 sq.ft
    innerDeductionsSqft: 488.5,
    outerSurfaces: [
      { id: 'o1', name: 'Building Outer Area', length: 122, height: 13.5, multiplier: 1 },
      { id: 'o2', name: 'Parapet Wall Inner & Top', length: 132, height: 4.0, multiplier: 1 },
      { id: 'o3', name: 'Sunshade Outer Plaster', length: 22.5, height: 2.25, multiplier: 2 },
    ]
  },
  // 7. Sill Beam, Lintel Beam & Lofts/Sunshades RCC (DATA SHEET 8)
  sillAndLintel: {
    lintelLength: 245,     // Lintel beam throughout building (245 rft)
    lintelB: 0.75,         // 9" width
    lintelD: 0.5,          // 6" depth
    sillLength: 122,       // Sill beam along window level (122 rft)
    sillB: 0.75,           // 9" width
    sillD: 0.25,           // 3" depth
    slabs: [
      { id: 's1', name: 'Kitchen Counter Slab', length: 16, breadth: 3.0, depth: 0.25 },
      { id: 's2', name: 'Bedrooms & Kitchen Lofts', length: 30, breadth: 1.75, depth: 0.25 },
      { id: 's3', name: 'Window Sunshades', length: 22.5, breadth: 2.25, depth: 0.25 },
      { id: 's4', name: 'Paran / Cupboard Slab', length: 6.5, breadth: 4.0, depth: 0.333 },
    ]
  }
};
