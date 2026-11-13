// Blank Template for Creating New Project Estimates from Scratch
export const BLANK_PROJECT_DATA = {
  projectInfo: {
    clientName: '',
    siteLocation: '',
    contactNumber: '',
    quoteDate: new Date().toISOString().split('T')[0],
  },
  // 1. Built-Up Area
  builtup: {
    floors: [
      { id: '1', name: 'Ground Floor', length: 0, breadth: 0, area: 0 },
    ],
    totalContractArea: 0,
  },
  // 2. Footing & Column Schedule
  footings: [
    { 
      id: 'f1', 
      colId: 'c1', 
      nos: 0, 
      colL: 0.75, 
      colB: 1.25, 
      colD: 5.0, 
      footingL: 4.0, 
      footingB: 4.0, 
      footingD: 1.5, 
      depth: 5.0, 
      pccDepth: 0.5 
    }
  ],
  // 3. Plinth Beams Schedule
  plinthBeams: [
    {
      id: 'pb1',
      name: 'PB1',
      length: 0,
      excavationB: 1.0,
      excavationD: 0.5,
      concreteB: 0.75,
      concreteD: 1.25,
    }
  ],
  // 4. Basement Flyash Brickwork & Earth Filling
  basement: {
    name: 'Basement Flyash Brickwork',
    flyashLength: 0,
    flyashBreadth: 0.75,
    flyashDepth: 1.25,
    outerPerimeter: null,
    isPerimeterManual: false,
    height: 3.0,
  },
  // 5. Superstructure Brickwork (Red Chamber Bricks 9" & 4.5" Walls) & Openings
  brickwork: {
    walls: [
      { id: 'w1', name: 'GF Vertical 9" Wall', length: 0, breadth: 0.75, height: 9 },
      { id: 'w2', name: 'GF Horizontal 9" Wall', length: 0, breadth: 0.75, height: 9 },
      { id: 'w3', name: 'GF Vertical 4.5" Wall', length: 0, breadth: 0.375, height: 9 },
      { id: 'w4', name: 'GF Horizontal 4.5" Wall', length: 0, breadth: 0.375, height: 9 },
    ],
    parapet: {
      length: 0,
      breadth: 0.75,
      height: 3.0,
    },
    openings: [
      { id: 'op1', type: 'Main Door Open', nos: 0, width: 3.25, thickness: 0.75, height: 7, deductionCft: 0 },
      { id: 'op2', type: 'Room Doors Open', nos: 0, width: 3.0, thickness: 0.75, height: 7, deductionCft: 0 },
      { id: 'op3', type: 'Toilet PVC Doors Open', nos: 0, width: 2.5, thickness: 0.375, height: 7, deductionCft: 0 },
      { id: 'op4', type: 'UPVC Windows Open', nos: 0, width: 3.0, thickness: 0.75, height: 4.0, deductionCft: 0 },
      { id: 'op5', type: 'Wall Opening Arch', nos: 0, width: 4.0, thickness: 0.75, height: 9.0, deductionCft: 0 },
      { id: 'op6', type: 'Ventilators Open', nos: 0, width: 2.0, thickness: 0.75, height: 1.5, deductionCft: 0 },
    ]
  },
  // 6. Wall & Ceiling Plastering (Inner & Outer)
  plastering: {
    rooms: [
      { id: 'r1', name: 'Hall', length: 0, breadth: 0, height: 10 },
      { id: 'r2', name: 'Kitchen', length: 0, breadth: 0, height: 10 },
      { id: 'r3', name: 'Bed room 1', length: 0, breadth: 0, height: 10 },
    ],
    innerDeductionsSqft: 0,
    outerSurfaces: [
      { id: 'o1', name: 'Building Outer Area', length: 0, height: 13.5, multiplier: 1 },
      { id: 'o2', name: 'Parapet Wall Inner & Top', length: 0, height: 4.0, multiplier: 1 },
    ]
  },
  // 7. Sill Beam, Lintel Beam & Lofts/Sunshades RCC
  sillAndLintel: {
    lintelLength: 0,
    lintelB: 0.75,
    lintelD: 0.5,
    sillLength: 0,
    sillB: 0.75,
    sillD: 0.25,
    slabs: [
      { id: 's1', name: 'Kitchen Counter Slab', length: 0, breadth: 3.0, depth: 0.25 },
      { id: 's2', name: 'Bedrooms & Kitchen Lofts', length: 0, breadth: 1.75, depth: 0.25 },
      { id: 's3', name: 'Window Sunshades', length: 0, breadth: 2.25, depth: 0.25 },
    ]
  },
  sillLintel: {
    lintelLength: 0,
    lintelB: 0.75,
    lintelD: 0.5,
    sillLength: 0,
    sillB: 0.75,
    sillD: 0.25,
    slabs: [
      { id: 's1', name: 'Kitchen Counter Slab', length: 0, breadth: 3.0, depth: 0.25 },
      { id: 's2', name: 'Bedrooms & Kitchen Lofts', length: 0, breadth: 1.75, depth: 0.25 },
      { id: 's3', name: 'Window Sunshades', length: 0, breadth: 2.25, depth: 0.25 },
    ]
  },
  // 8. Tiles & Granite Work
  tiles: {
    flooringArea: 0,
    bathroomFloorArea: 0,
    parkingArea: 0,
    kitchenWallArea: 0,
    bathroomWallArea: 0,
    skirtingLength: 0,
    countertopArea: 0,
  },
  // 10. Doors & Windows Joinery
  joinery: {
    items: [
      { id: 'j1', name: 'Main Door (Kinza Teak Wood)', length: 3.25, height: 7, nos: 0, rate: 1071, spec: 'Teak frame & carved panel shutter' },
      { id: 'j2', name: 'Room & Outer Doors', length: 3.0, height: 7, nos: 0, rate: 428, spec: 'Sal / Mahogany frame with flush door' },
      { id: 'j3', name: 'Pooja Door (Teak Wood)', length: 3.0, height: 7, nos: 0, rate: 500, spec: 'Teak frame & CNC pooja design shutter' },
      { id: 'j4', name: 'Bathroom PVC Doors', length: 2.5, height: 7, nos: 0, rate: 142, spec: 'FRP / PVC water-resistant door' },
      { id: 'j5', name: 'UPVC Windows with Safety MS Grill', length: 3.0, height: 4.2, nos: 0, rate: 600, spec: '3-track UPVC sliding with mosquito mesh & grill' },
    ]
  },
  // 11. Roof Slab & Roof Beams Concrete
  roofSlab: {
    beamLength: 0,
    beamBreadth: 0.75,
    beamDepth: 0.583,
    slabArea: 0,
    slabThickness: 0.416,
  },
  // 12. Painting Work
  painting: {
    innerWallArea: 0,
    outerWallArea: 0,
    ceilingArea: 0,
  },
  // 13. Staircase Work
  staircase: {
    width: 3.5,
    tread: 1.0,
    riser: 0.583,
    stepsCount: 0,
    landingArea: 0,
    handrailLength: 0,
    waistSlabLength: 0,
    waistSlabBreadth: 6.0,
    waistSlabDepth: 0.5,
  },
  // 14. Others (Electrical, Plumbing, Terrace Surkhi)
  others: {
    electricalArea: 0,
    terraceSurkhiArea: 0,
    surkhiThickness: 0.25,
  },
  // 15. Additional Works
  additionalWorks: [
    { id: 'add1', name: 'Underground Water Sump', unit: 'Litres', qty: 0, rate: 12, spec: 'Flyash brickwork + waterproof plastering' },
    { id: 'add2', name: 'Septic Tank (3-Chamber Partition)', unit: 'Litres', qty: 0, rate: 17, spec: 'Flyash brickwork with 3 chambers' },
    { id: 'add3', name: 'Overhead Tank (OHT) with MS Stand', unit: 'Litres', qty: 0, rate: 17, spec: 'PVC 3-layer tank with 4ft height MS frame stand' },
    { id: 'add4', name: 'Compound Wall (Solid Block)', unit: 'RFT', qty: 0, rate: 2000, spec: '5ft height solid blocks + bottom belt beam + RCC columns @ 10ft' },
    { id: 'add5', name: 'Rainwater Soakpit', unit: 'Each', qty: 0, rate: 10000, spec: 'RCC precast rings 2ft dia x 6ft depth with heavy cover' },
    { id: 'add6', name: 'Ramp for Car Parking & Steps', unit: 'Unit', qty: 0, rate: 1000, spec: 'Backfilling, PCC, and grooved mortar finish' },
    { id: 'add7', name: 'Setback Flooring PCC', unit: 'Sq.ft', qty: 0, rate: 70, spec: 'PCC bed & smooth mortar finish around villa' },
    { id: 'add8', name: 'Architectural Main MS Gate', unit: 'Sq.ft', qty: 0, rate: 800, spec: 'MS gate fabrication + primer + polyurethane enamel paint' },
  ]
};
