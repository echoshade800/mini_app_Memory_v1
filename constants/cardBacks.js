/**
 * Card back images configuration for different difficulty tiers
 */

import { TIERS } from './levels';

// Card back image mappings for each difficulty tier
export const CARD_BACK_IMAGES = {
  [TIERS.EASY]: require('../assets/images/card-backs/easy.png'),
  [TIERS.MEDIUM]: require('../assets/images/card-backs/medium.png'),
  [TIERS.HARD]: require('../assets/images/card-backs/hard.png'),
  [TIERS.VERY_HARD]: require('../assets/images/card-backs/veryHard.png'),
  [TIERS.EXTREME]: require('../assets/images/card-backs/extreme.png'),
};

// Fallback card back image (if the difficulty-specific image fails to load)
export const FALLBACK_CARD_BACK = require('../assets/images/card-backs/easy.png');

/**
 * Get the card back image for a specific difficulty tier
 * @param {string} tier - The difficulty tier
 * @returns {any} The card back image resource
 */
export function getCardBackImage(tier) {
  return CARD_BACK_IMAGES[tier] || FALLBACK_CARD_BACK;
}
