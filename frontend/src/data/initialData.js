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

  // Sections 8 to 15 Trade Unit Rates (From Excel sheets 6 to 10 & DATA SHEET)
  // 8. Tiles & Granite Work (Sheet 6.TILES WORK)
  rateFlooringTile: 60,            // Rs/sq.ft (Flooring 2x2 vitrified tiles)
  rateBathroomFloorTile: 50,       // Rs/sq.ft (Anti-skid floor tiles)
  rateParkingTile: 50,             // Rs/sq.ft (Heavy-duty parking tiles)
  rateKitchenWallTile: 50,         // Rs/sq.ft (Glazed ceramic dadoing)
  rateBathroomWallTile: 50,        // Rs/sq.ft (Wall tiles up to 7ft)
  rateSkirtingTile: 60,            // Rs/sq.ft (Matching wall skirting)
  rateCountertopGranite: 160,      // Rs/sq.ft (Jet Black Granite slab)
  rateStaircaseGranite: 160,       // Rs/sq.ft (Moulded step granite)
  rateTilePasteAraldite: 15,       // Rs/sq.ft (Adhesive paste)
  rateTileMortarBed: 32.5,         // Rs/sq.ft (2.5" CM 1:5 underbed)

  // 10. Doors & Windows (Sheet 7.DOOR & WINDOW)
  rateMainDoor: 1071,              // Rs/sq.ft (Teak wood frame & ornate panel door)
  rateRoomDoor: 428,               // Rs/sq.ft (Sal / Mahogany frame + flush door)
  ratePoojaDoor: 500,              // Rs/sq.ft (Teak frame & pooja shutters)
  ratePvcDoor: 142,                // Rs/sq.ft (PVC water-resistant bathroom door)
  rateUpvcWindows: 600,            // Rs/sq.ft (UPVC sliding windows + safety MS grill)

  // 11. Roof Slab & Beams Concrete (Sheet 8.SLAB CONCRETE)
  rateRoofBeamConcretePerCft: 748.1,// Rs/CFT (M20 concrete + steel + shuttering)
  rateRoofSlabConcretePerCft: 523.8,// Rs/CFT (M20 concrete + steel + prop staging)

  // 12. Painting Work (Sheet 9.PAINTING)
  rateInnerWallPainting: 28,       // Rs/sq.ft (1 coat white cement + 1 primer + 2 coats Apex Emulsion)
  rateOuterWallPainting: 34,       // Rs/sq.ft (1 coat white cement + 2 putty + 1 primer + 2 coats Premium)
  rateCeilingPainting: 25,         // Rs/sq.ft (1 coat white cement + 1 putty + 1 primer + 2 coats Premium)

  // 13. Staircase Work (Sheet 10.STAIRCASE)
  rateStaircaseBrickSteps: 250,    // Rs/CFT (Brick masonry steps)
  rateStaircaseConcrete: 523.8,    // Rs/CFT (Waist slab M20 RCC)
  rateStaircaseHandrail: 1000,     // Rs/RFT (SS 304 Grade architectural handrail)

  // 14. Others (Electrical, Plumbing, Terrace Surkhi)
  rateElectricalPlumbing: 200,     // Rs/sq.ft (Material 150 + Labour 50)
  rateTerraceSurkhiPerCft: 98.2,   // Rs/CFT (Waterproofing chips concrete & surkhi)

  // 15. Additional Works (DATA SHEET Row 173-183)
  rateUgSumpPerLitre: 12,          // Rs/Litre (UG Sump Flyash Brickwork + Plastering)
  rateSepticTankPerLitre: 17,      // Rs/Litre (3 Chamber Septic Tank)
  rateOhtPerLitre: 17,             // Rs/Litre (PVC 3 layer tank + 4ft MS Stand)
  rateCompoundWallPerRft: 2000,    // Rs/RFT (5ft height solid block + belt beam + columns)
  rateSoakpitEach: 10000,          // Rs/Each (RCC precast rings 2' dia 6' depth)
  rateRampEach: 1000,              // Rs/Unit (PCC, backfilling, mortar finish)
  rateSetbackPccPerSqft: 70,       // Rs/sq.ft (Setback PCC & mortar finish)
  rateMsGatePerSqft: 800,          // Rs/sq.ft (Architectural MS gate + painting)

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
    outerPerimeter: null,
    isPerimeterManual: false,
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
      { id: 'op1', type: 'Main Door Open', nos: 1, width: 3.25, thickness: 0.75, height: 7, deductionCft: 17.0625 },
      { id: 'op2', type: 'Room Doors Open', nos: 3, width: 3.0, thickness: 0.75, height: 7, deductionCft: 47.25 },
      { id: 'op3', type: 'Toilet PVC Doors Open', nos: 2, width: 2.5, thickness: 0.375, height: 7, deductionCft: 13.125 },
      { id: 'op4', type: 'UPVC Windows Open', nos: 4, width: 3.0, thickness: 0.75, height: 4.0, deductionCft: 36.0 },
      { id: 'op5', type: 'Wall Opening Arch', nos: 1, width: 4.0, thickness: 0.75, height: 9.0, deductionCft: 27.0 },
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
  },
  sillLintel: {
    lintelLength: 245,
    lintelB: 0.75,
    lintelD: 0.5,
    sillLength: 122,
    sillB: 0.75,
    sillD: 0.25,
    slabs: [
      { id: 's1', name: 'Kitchen Counter Slab', length: 16, breadth: 3.0, depth: 0.25 },
      { id: 's2', name: 'Bedrooms & Kitchen Lofts', length: 30, breadth: 1.75, depth: 0.25 },
      { id: 's3', name: 'Window Sunshades', length: 22.5, breadth: 2.25, depth: 0.25 },
      { id: 's4', name: 'Paran / Cupboard Slab', length: 6.5, breadth: 4.0, depth: 0.333 },
    ]
  },
  // 8. Tiles & Granite Work (Sheet 6.TILES WORK)
  tiles: {
    flooringArea: 532.5,
    bathroomFloorArea: 60,
    parkingArea: 123,
    kitchenWallArea: 64,
    bathroomWallArea: 520,
    skirtingLength: 86.28,
    countertopArea: 60,
  },
  // 10. Doors & Windows Joinery (Sheet 7.DOOR & WINDOW & DATA SHEET Row 123)
  joinery: {
    items: [
      { id: 'j1', name: 'Main Door (Kinza Teak Wood)', length: 3.25, height: 7, nos: 1, rate: 1071, spec: 'Teak frame & carved panel shutter' },
      { id: 'j2', name: 'Room & Outer Doors', length: 3.0, height: 7, nos: 3, rate: 428, spec: 'Sal / Mahogany frame with flush door' },
      { id: 'j3', name: 'Pooja Door (Teak Wood)', length: 3.0, height: 7, nos: 1, rate: 500, spec: 'Teak frame & CNC pooja design shutter' },
      { id: 'j4', name: 'Bathroom PVC Doors', length: 2.5, height: 7, nos: 2, rate: 142, spec: 'FRP / PVC water-resistant door' },
      { id: 'j5', name: 'UPVC Windows with Safety MS Grill', length: 3.0, height: 4.2, nos: 5, rate: 600, spec: '3-track UPVC sliding with mosquito mesh & grill' },
    ]
  },
  // 11. Roof Slab & Roof Beams Concrete (Sheet 8.SLAB CONCRETE & DATA SHEET Row 135)
  roofSlab: {
    beamLength: 201,       // Auto-linked from Section 3 Plinth Beams (201 rft)
    beamBreadth: 0.75,     // 9" width
    beamDepth: 0.583,      // 7" projection below slab
    slabArea: 858,         // Auto-linked from Ground Floor area (858 sq.ft)
    slabThickness: 0.416,  // 5" slab thickness (0.416 ft)
  },
  // 12. Painting Work (Sheet 9.PAINTING & DATA SHEET Row 148)
  painting: {
    innerWallArea: 2626.5, // Inner wall plaster area minus deductions
    outerWallArea: 2276.25,// Auto-linked from plastering outer surfaces
    ceilingArea: 808,      // Auto-linked from rooms ceiling area
  },
  // 13. Staircase Work (Sheet 10.STAIRCASE & DATA SHEET Row 153)
  staircase: {
    width: 3.5,            // Width of flight (3.5 ft)
    tread: 1.0,            // Tread (12 inches)
    riser: 0.583,          // Riser (7 inches)
    stepsCount: 21,        // 21 steps
    landingArea: 24.5,     // 3.5ft x 7ft landing slab
    handrailLength: 21,    // 21 RFT SS 304 handrail
    waistSlabLength: 21,   // Waist slab length (21 ft)
    waistSlabBreadth: 6.0, // Waist slab breadth (6 ft)
    waistSlabDepth: 0.5,   // 6" waist slab concrete
  },
  // 14. Others (Electrical, Plumbing, Terrace Surkhi - DATA SHEET Row 167)
  others: {
    electricalArea: 858,   // Auto-linked from total builtup area
    terraceSurkhiArea: 766.5, // Built-up area minus parapet thickness
    surkhiThickness: 0.25, // 3" thickness chips concrete & surkhi
  },
  // 15. Additional Works (DATA SHEET Row 173-183)
  additionalWorks: [
    { id: 'add1', name: 'Underground Water Sump', unit: 'Litres', qty: 2500, rate: 12, spec: 'Flyash brickwork + waterproof plastering (Capacity in Litres)' },
    { id: 'add2', name: 'Septic Tank (3-Chamber Partition)', unit: 'Litres', qty: 10200, rate: 17, spec: 'Flyash brickwork with 3 chambers (Capacity in Litres)' },
    { id: 'add3', name: 'Overhead Tank (OHT) with MS Stand', unit: 'Litres', qty: 1000, rate: 17, spec: 'PVC 3-layer tank with 4ft height MS frame stand' },
    { id: 'add4', name: 'Compound Wall (Solid Block)', unit: 'RFT', qty: 80, rate: 2000, spec: '5ft height solid blocks + bottom belt beam + RCC columns @ 10ft' },
    { id: 'add5', name: 'Rainwater Soakpit', unit: 'Each', qty: 1, rate: 10000, spec: 'RCC precast rings 2ft dia x 6ft depth with heavy cover' },
    { id: 'add6', name: 'Ramp for Car Parking & Steps', unit: 'Unit', qty: 1, rate: 1000, spec: 'Backfilling, PCC, and grooved mortar finish' },
    { id: 'add7', name: 'Setback Flooring PCC', unit: 'Sq.ft', qty: 250, rate: 70, spec: 'PCC bed & smooth mortar finish around villa' },
    { id: 'add8', name: 'Architectural Main MS Gate', unit: 'Sq.ft', qty: 60, rate: 800, spec: 'MS gate fabrication + primer + polyurethane enamel paint' },
  ]
};
