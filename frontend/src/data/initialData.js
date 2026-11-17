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
  labourCeilingPlasterPerSqft: 80,  // BOQ combined rate in Excel row 60
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
  tileFlooringLabour: 24,
  tileBathroomFloorLabour: 24,
  tileParkingLabour: 24,
  tileKitchenWallLabour: 24,
  tileBathroomWallLabour: 30,
  tileSkirtingLabour: 24,
  graniteCountertopLabour: 160,

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
  rateTerraceBrickbatPerCft: 74,   // Rs/CFT (Brickbat quantity rate in BOQ)
  rateTerraceLimePerBag: 180,      // Rs/Bag (Lime rate in BOQ)

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
