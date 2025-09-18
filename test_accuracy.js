const { calculateAccuracyScore, calculateTotalScore } = require('./utils/scoring.js');

console.log('Testing Accuracy calculation:');
console.log('');

// Test case 1: Level 9, 12 successful pairs, 24 attempts
console.log('Test Case 1: Level 9');
const levelId1 = 9;
const successfulPairs1 = 12;
const attempts1 = 24;
const durationSec1 = 0;
const comboSegments1 = [2, 3]; // Some combo segments

const accuracy1 = calculateAccuracyScore(levelId1, successfulPairs1, attempts1);
const totalScore1 = calculateTotalScore(levelId1, successfulPairs1, attempts1, durationSec1, comboSegments1);

console.log(`  Level: ${levelId1}`);
console.log(`  Successful pairs: ${successfulPairs1}`);
console.log(`  Attempts: ${attempts1}`);
console.log(`  CAP: ${10 * levelId1}`);
console.log(`  Accuracy rate: ${successfulPairs1}/${attempts1} = ${(successfulPairs1/attempts1*100).toFixed(1)}%`);
console.log(`  Accuracy score: ${accuracy1}`);
console.log(`  Expected: 45 (50% of 90)`);
console.log(`  Match: ${accuracy1 === 45 ? '✅' : '❌'}`);
console.log(`  Total score breakdown:`, totalScore1);
console.log('');

// Test case 2: Level 1, 1 successful pair, 1 attempt (perfect)
console.log('Test Case 2: Level 1 Perfect');
const levelId2 = 1;
const successfulPairs2 = 1;
const attempts2 = 1;
const durationSec2 = 0;
const comboSegments2 = [1];

const accuracy2 = calculateAccuracyScore(levelId2, successfulPairs2, attempts2);
const totalScore2 = calculateTotalScore(levelId2, successfulPairs2, attempts2, durationSec2, comboSegments2);

console.log(`  Level: ${levelId2}`);
console.log(`  Successful pairs: ${successfulPairs2}`);
console.log(`  Attempts: ${attempts2}`);
console.log(`  CAP: ${10 * levelId2}`);
console.log(`  Accuracy rate: ${successfulPairs2}/${attempts2} = ${(successfulPairs2/attempts2*100).toFixed(1)}%`);
console.log(`  Accuracy score: ${accuracy2}`);
console.log(`  Expected: 10 (100% of 10)`);
console.log(`  Match: ${accuracy2 === 10 ? '✅' : '❌'}`);
console.log('');

// Test case 3: Level 5, 6 successful pairs, 12 attempts (50% accuracy)
console.log('Test Case 3: Level 5 50% Accuracy');
const levelId3 = 5;
const successfulPairs3 = 6;
const attempts3 = 12;
const durationSec3 = 0;
const comboSegments3 = [2, 1, 1];

const accuracy3 = calculateAccuracyScore(levelId3, successfulPairs3, attempts3);
const totalScore3 = calculateTotalScore(levelId3, successfulPairs3, attempts3, durationSec3, comboSegments3);

console.log(`  Level: ${levelId3}`);
console.log(`  Successful pairs: ${successfulPairs3}`);
console.log(`  Attempts: ${attempts3}`);
console.log(`  CAP: ${10 * levelId3}`);
console.log(`  Accuracy rate: ${successfulPairs3}/${attempts3} = ${(successfulPairs3/attempts3*100).toFixed(1)}%`);
console.log(`  Accuracy score: ${accuracy3}`);
console.log(`  Expected: 25 (50% of 50)`);
console.log(`  Match: ${accuracy3 === 25 ? '✅' : '❌'}`);
console.log('');

// Test case 4: Level 3, 3 successful pairs, 6 attempts (50% accuracy)
console.log('Test Case 4: Level 3 50% Accuracy');
const levelId4 = 3;
const successfulPairs4 = 3;
const attempts4 = 6;
const durationSec4 = 0;
const comboSegments4 = [1, 1, 1];

const accuracy4 = calculateAccuracyScore(levelId4, successfulPairs4, attempts4);
const totalScore4 = calculateTotalScore(levelId4, successfulPairs4, attempts4, durationSec4, comboSegments4);

console.log(`  Level: ${levelId4}`);
console.log(`  Successful pairs: ${successfulPairs4}`);
console.log(`  Attempts: ${attempts4}`);
console.log(`  CAP: ${10 * levelId4}`);
console.log(`  Accuracy rate: ${successfulPairs4}/${attempts4} = ${(successfulPairs4/attempts4*100).toFixed(1)}%`);
console.log(`  Accuracy score: ${accuracy4}`);
console.log(`  Expected: 15 (50% of 30)`);
console.log(`  Match: ${accuracy4 === 15 ? '✅' : '❌'}`);
console.log('');

console.log('Summary:');
console.log('- Accuracy calculation: acc = successfulPairs / attempts');
console.log('- Accuracy score = round(acc * CAP) where CAP = 10 * levelId');
console.log('- All test cases should show ✅ if calculation is correct');
