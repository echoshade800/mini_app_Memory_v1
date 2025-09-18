/**
 * Scoring system for Memory game
 * Implements performance, combo, and time scoring formulas
 */

/**
 * Calculate preview time for memorization phase
 * @param {number} N - Number of cards
 * @returns {number} Preview time in seconds
 */
export function previewTimeSec(N) {
  const P = N / 2;
  const raw = 2 + 0.35 * P;
  const clamped = Math.max(3, Math.min(12, raw));
  return Math.round(clamped * 2) / 2; // round to 0.5s
}

/**
 * Calculate performance score
 * @param {number} levelId - Level ID (1-based)
 * @param {number} pairs - Number of pairs (P)
 * @param {number} attempts - Number of attempts (A)
 * @returns {number} Performance score
 */
export function calculatePerformanceScore(levelId, pairs, attempts) {
  const CAP = 10 * levelId;
  const acc = pairs / attempts;
  const perf = Math.round(CAP * clamp((acc - 0.5) / 0.5, 0, 1));
  return perf;
}

/**
 * Calculate combo score
 * @param {number} levelId - Level ID (1-based)
 * @param {number} pairs - Number of pairs (P)
 * @param {Array} comboSegments - Array of combo segment lengths
 * @returns {number} Combo score
 */
export function calculateComboScore(levelId, pairs, comboSegments) {
  const CAP = 10 * levelId;
  
  // Debug logging
  console.log('calculateComboScore - levelId:', levelId, 'pairs:', pairs, 'comboSegments:', comboSegments);
  
  // Special case: For levels with P = 1 pair, award full combo = CAP(L) 
  // as soon as the single pair is matched
  if (pairs === 1) {
    // If there's any successful match and no failures, give full combo
    const hasSuccess = comboSegments.length > 0 && comboSegments[0] >= 1;
    const result = hasSuccess ? CAP : 0;
    console.log('P=1 special case - hasSuccess:', hasSuccess, 'result:', result);
    return result;
  }
  
  // For P ≥ 2, keep the weighted streak rule
  // New weighted combo calculation
  // W(s) = s * (s - 1) / 2 for streak length s
  const W = (s) => s * (s - 1) / 2;
  
  const C_weighted = comboSegments.reduce((sum, segment) => sum + W(segment), 0);
  const C_weighted_max = W(pairs); // theoretical max when entire game is single streak
  const combo = Math.round(CAP * C_weighted / Math.max(1, C_weighted_max));
  
  console.log('P>=2 calculation - W function results:', comboSegments.map(s => `W(${s})=${W(s)}`));
  console.log('C_weighted:', C_weighted, 'C_weighted_max:', C_weighted_max, 'combo:', combo);
  
  return combo;
}

/**
 * Calculate time score
 * @param {number} levelId - Level ID (1-based)
 * @param {number} pairs - Number of pairs (P)
 * @param {number} durationSec - Time taken in seconds
 * @returns {number} Time score
 */
export function calculateTimeScore(levelId, pairs, durationSec) {
  const CAP = 10 * levelId;
  const g = 3.0; // gold time multiplier
  const b = 6.0; // bronze time multiplier
  
  const T_gold = g * pairs;
  const T_bronze = b * pairs;
  
  if (durationSec <= T_gold) {
    return CAP;
  } else if (durationSec >= T_bronze) {
    return 0;
  } else {
    return Math.round(CAP * (T_bronze - durationSec) / (T_bronze - T_gold));
  }
}

/**
 * Calculate total score
 * @param {number} levelId - Level ID (1-based)
 * @param {number} pairs - Number of pairs
 * @param {number} attempts - Number of attempts
 * @param {number} durationSec - Time taken in seconds
 * @param {Array} comboSegments - Array of combo segment lengths
 * @returns {Object} Score breakdown
 */
export function calculateTotalScore(levelId, pairs, attempts, durationSec, comboSegments) {
  const TOTAL = 30 * levelId;
  
  const perf = calculatePerformanceScore(levelId, pairs, attempts);
  const combo = calculateComboScore(levelId, pairs, comboSegments);
  const time = calculateTimeScore(levelId, pairs, durationSec);
  
  const total = Math.min(TOTAL, perf + combo + time);
  const total_pct = Math.round(100 * total / TOTAL);
  
  return {
    performance: perf,
    combo,
    time,
    total,
    totalPercent: total_pct,
    maxPossible: TOTAL
  };
}

/**
 * Utility function to clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate combo segments from match history
 * @param {Array} matchHistory - Array of boolean values (true for correct match)
 * @returns {Array} Array of combo segment lengths
 */
export function calculateComboSegments(matchHistory) {
  const segments = [];
  let currentSegment = 0;
  
  for (const isCorrect of matchHistory) {
    if (isCorrect) {
      currentSegment++;
    } else {
      if (currentSegment > 0) {
        segments.push(currentSegment);
        currentSegment = 0;
      }
    }
  }
  
  if (currentSegment > 0) {
    segments.push(currentSegment);
  }
  
  return segments;
}