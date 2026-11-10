import { calculateCivilEstimateComplete } from './frontend/src/utils/calculator.js';
import { INITIAL_PROJECT_DATA, DEFAULT_RATES } from './frontend/src/data/initialData.js';

const testData = JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA));
// Change Section 4 Basement Masonry Length to 301
testData.basement.flyashLength = 301;

console.log('Testing with flyashLength = 301:');
const res = calculateCivilEstimateComplete(testData, DEFAULT_RATES);
console.log('totalPlinthAreaDeduction:', res.totalPbLength, 'plinth deduction:', res.plinthBeamDeductionArea);
console.log('bsmFlyashL:', res.bsmFlyashL);
console.log('Net Basement Area:', res.netBasementArea);
