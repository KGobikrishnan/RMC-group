// Enterprise Rate Defaults based on 03-11-2026_BRICK_ESTIMATE.xlsm
export const DEFAULT_RATES = {
  // Material Rates
  cement: 310,            // Rs/Bag (Dalmia / UltraTech)
  steel: 70,              // Rs/Kg (ARS Fe550D ISI)
  msand: 63,              // Rs/cft
  psand: 73,              // Rs/cft
  aggregate: 58,          // Rs/cft (20mm)
  gravel: 22,             // Rs/cft (Backfilling)
  brickFlyash: 8.5,       // Rs/piece
  brickChamber: 12.0,     // Rs/piece (Red clay bricks)
  brickBat: 74,           // Rs/cft (Terrace weathering)
  lime: 180,              // Rs/bag

  // Labour Rates
  labourSuperstructurePerSqft: 450, // Rs/sq.ft for civil structure
  electricalPlumbingMatRate: 150,   // Rs/sq.ft
  electricalPlumbingLabRate: 50,    // Rs/sq.ft
  
  // Finish Rates (Per Sq.ft Material / Labour)
  tileFlooringMat: 60,
  tileFlooringLab: 24,
  tileSkirtingMat: 60,
  tileSkirtingLab: 72,
  tileBathFloorMat: 50,
  tileBathFloorLab: 24,
  tileBathWallMat: 50,
  tileBathWallLab: 30,
  tileKitchenWallMat: 50,
  tileKitchenWallLab: 24,
  tileParkingMat: 50,
  tileParkingLab: 24,
  graniteCounterMat: 160,
  graniteCounterLab: 160,
  graniteStepsLab: 160,

  // Painting Rates (Rs/sq.ft)
  paintInnerRate: 28,     // 1 coat white cement + 1 coat primer + 2 coat Apex emulsion
  paintOuterRate: 34,     // 1 coat white cement + 2 coat putty + 1 coat primer + 2 coat Premium
  paintCeilingRate: 25,   // 1 coat white cement + 1 coat putty + 1 coat primer + 2 coat Premium

  // Joinery Rates (Rs / sq.ft or Unit)
  doorMainRate: 1071,     // Kinza / Teak finish per sq.ft
  doorRoomRate: 428,      // Sal frame & flush door per sq.ft
  doorPoojaRate: 500,     // Teak door per sq.ft
  doorBathroomRate: 142,  // PVC door per sq.ft
  windowUPVCRate: 600,    // UPVC & safety grill fixing per sq.ft

  // Additional Works Rates
  sumpRatePerLitre: 12,        // Rs/Litre (UG Sump Flyash Brickwork)
  septicRatePerLitre: 17,      // Rs/Litre (3 chamber partition)
  ohtRatePerLitre: 17,         // Rs/Litre (PVC 3 layered with stand)
  compoundWallRatePerRft: 2000,// Rs/rft (5ft height solid block plastered)
  soakpitRatePerUnit: 10000,   // Rs/unit (RCC pre-fab rings)
  rampRatePerWidth: 1000,      // Rs/width
  setbackPCCRatePerSqft: 70,   // Rs/sq.ft
  gateRatePerSqft: 800,        // Rs/sq.ft (MS gate)
  antiTermiteRatePerSqft: 20,  // Rs/sq.ft

  // Markup
  contractorMarginPct: 12,    // 10% Profit + 2% Wastage
}

export const INITIAL_PROJECT_DATA = {
  projectInfo: {
    clientName: "Er. M. Jahir Hussain Villa",
    siteLocation: "Building Doctor Complex, Uthamapalayam - 625533",
    contactNumber: "9489141122 / 9111493336",
    quoteDate: "2026-11-04",
    floorsCount: 3,
  },
  builtup: {
    floors: [
      { id: '1', name: 'Ground Floor', length: 22, breadth: 39, area: 858 },
      { id: '2', name: 'First Floor', length: 20, breadth: 30, area: 600 },
      { id: '3', name: 'Second Floor', length: 10, breadth: 30, area: 300 },
    ],
    // D5 in excel is total contract area (1498 sq.ft)
    totalContractArea: 1498,
    gfArea: 858,
  },
  substructure: {
    footings: [
      { id: 'f1', colId: 'c1', nos: 5, colL: 0.75, colB: 1.25, colD: 5.0, footingL: 4.0, footingB: 4.0, footingD: 1.5, depth: 5.0, pccDepth: 0.5 },
      { id: 'f2', colId: 'c2', nos: 3, colL: 1.0, colB: 1.5, colD: 5.0, footingL: 5.0, footingB: 5.0, footingD: 2.0, depth: 6.0, pccDepth: 1.0 },
    ],
    plinthBeam: {
      excavation: { L: 201, B: 1.0, D: 0.5 },
      concrete: { L: 201, B: 0.75, D: 1.25 },
    },
    basement: {
      perimeter: 122,
      height: 3.0,
      flyashL: 201,
      flyashB: 0.75,
      flyashD: 1.25,
      gravelFillingCft: 2121.75,
      msandLayerCft: 233.39,
      flooringPccSqft: 707.25,
      plasteringSqft: 732,
    }
  },
  masonry: {
    // 9" and 4.5" walls
    walls: [
      { id: 'w1', name: 'Ground Floor Vertical 9"', length: 111, breadth: 0.75, height: 9 },
      { id: 'w2', name: 'Ground Floor Horizontal 9"', length: 84, breadth: 0.75, height: 9 },
      { id: 'w3', name: 'Ground Floor Vertical 4.5"', length: 0, breadth: 0.375, height: 9 },
      { id: 'w4', name: 'Ground Floor Horizontal 4.5"', length: 50, breadth: 0.375, height: 9 },
    ],
    parapet: { length: 132, breadth: 0.75, height: 3 },
    openings: [
      { id: 'op1', type: 'Main Door', nos: 1, width: 3.25, height: 7, deductionCFT: 17.06 },
      { id: 'op2', type: 'Room Doors', nos: 3, width: 3.0, height: 7, deductionCFT: 47.25 },
      { id: 'op3', type: 'Pooja Door', nos: 1, width: 3.0, height: 7, deductionCFT: 15.75 },
      { id: 'op4', type: 'Bathroom PVC Doors', nos: 2, width: 2.5, height: 7, deductionCFT: 13.12 },
      { id: 'op5', type: 'UPVC Windows', nos: 5, width: 3.0, height: 4.2, deductionCFT: 47.25 },
    ]
  },
  beamsAndPlastering: {
    sillBeam: { length: 122, breadth: 0.75, depth: 0.25 },
    lintelBeam: { length: 245, breadth: 0.75, depth: 0.5 },
    loftsAndSunshades: {
      counterSlab: { L: 16, B: 3, D: 0.25 },
      loft: { L: 30, B: 1.75, D: 0.25 },
      sunshade: { L: 22.5, B: 2.25, D: 0.25 },
      paranSlab: { L: 6.5, B: 4, D: 0.25 },
    },
    roofSlab: {
      gfBuiltupArea: 858,
      slabThicknessInch: 5, // 0.416 ft
      roofBeamLength: 201,
      roofBeamB: 0.75,
      roofBeamD: 0.583,
    },
    plastering: {
      ceilingAreaSqft: 808,
      wallInnerSqft: 3434.5,
      wallOuterSqft: 2276.25,
    }
  },
  finishes: {
    staircase: {
      tread: 1.0,
      riser: 0.5,
      width: 3.0,
      stepsCount: 21,
      landingAreaSqft: 24.5,
      waistSlabL: 21,
      waistSlabB: 6,
      waistSlabD: 0.5,
      handrailRft: 21,
    },
    tiles: {
      flooringSqft: 532.5,
      skirtingRft: 86.28,
      bathFloorSqft: 60,
      bathWallSqft: 520,
      kitchenWallSqft: 64,
      parkingPorticoSqft: 123,
      graniteCounterSqft: 60,
      graniteStepsSqft: 171.5,
    },
    terraceWeathering: {
      surkhiAreaSqft: 766.5,
      thicknessFt: 0.25, // 3 inches
    }
  },
  additionalWorks: {
    sumpLitres: 2500,
    septicLitres: 10200,
    ohtLitres: 0,
    compoundWallRft: 0,
    soakpitCount: 0,
    rampWidthFt: 0,
    setbackAreaSqft: 0,
    gateAreaSqft: 0,
  }
}

