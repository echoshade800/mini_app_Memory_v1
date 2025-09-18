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
  // New simple combo calculation: max combo segment * 10
  const maxComboSegment = comboSegments.length > 0 ? Math.max(...comboSegments) : 0;
  return maxComboSegment * 10;
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
  
  // 计算各项满分
  const maxPerformanceScore = 10 * levelId;
  const maxComboScore = pairs * 10; // 连击满分 = 总对数 * 10（完美连击所有配对）
  const maxTimeScore = 10 * levelId;
  
  const total = Math.min(TOTAL, perf + combo + time);
  const total_pct = Math.round(100 * total / TOTAL);
  
  return {
    performance: perf,
    combo,
    time,
    total,
    totalPercent: total_pct,
    maxPossible: TOTAL,
    maxPerformanceScore,
    maxComboScore,
    maxTimeScore
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
  // 从配对历史中计算连击段
  // matchHistory: [true, false, true, true] 表示 成功-失败-成功-成功
  // 返回连击段长度数组，如 [1, 2] 表示第一段连击1次，第二段连击2次
  const segments = [];
  let currentSegment = 0;
  
  for (const isCorrect of matchHistory) {
    if (isCorrect) {
      // 成功配对，当前连击段长度+1
      currentSegment++;
    } else {
      // 配对失败，连击中断
      if (currentSegment > 0) {
        segments.push(currentSegment);
        currentSegment = 0;
      }
    }
  }
  
  // 处理最后一个连击段（如果游戏以成功配对结束）
  if (currentSegment > 0) {
    segments.push(currentSegment);
  }
  
  return segments;
}