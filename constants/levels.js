/**
 * Game constants including level configurations, emoji pool, and color palette
 */

// 200 emoji pool for card faces
export const EMOJI_POOL = [
  // Faces & creatures (38)
  '😀','😁','😂','🤣','😊','😉','😍','🥰','😘','😎','🥳','🤨','🧐','🤓','😒','😖','😫','🥺','😭','😠','🤬','🤯','🥵','🥶','😱','🤗','🤔','🤭','🤫','😶','🙄','😮','😲','🥱','😴','🤮','🤧','🤒',

  // Animals & nature (60)
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🕷','🦂','🐢','🐍','🦎','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒',

  // Food & drink (80)
  '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🍆','🥔','🥕','🌽','🌶','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰','🍞','🥐','🥖','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🍡','🥟','🥠','🥡','🍦','🍧','🍨',

  // Objects & symbols (22)
  '🏆','🎲','🎯','🎮','🎸','📚','✏️','📌','📎','🔑','🧭','🔥','💡','🌈','☀️','❄️','⚡','🪐','🚀','🚗','💗','💰'
];


// Card back colors (one per game)
export const CARD_COLORS = [
  '#FF6B6B', // red
  '#FF8C42', // orange  
  '#FFD93D', // yellow
  '#6BCF7F', // green
  '#4ECDC4', // cyan
  '#45B7D1', // blue
  '#9B59B6'  // purple
];

// Difficulty tiers
export const TIERS = {
  EASY: 'easy',
  MEDIUM: 'medium', 
  HARD: 'hard',
  VERY_HARD: 'very hard',
  EXTREME: 'extreme'
};

// Level configurations (1-25)
export const LEVEL_CONFIGS = [
  { id: 1, cards: 2, rows: 2, cols: 1, tier: TIERS.EASY },
  { id: 2, cards: 4, rows: 2, cols: 2, tier: TIERS.EASY },
  { id: 3, cards: 6, rows: 3, cols: 2, tier: TIERS.EASY },
  { id: 4, cards: 8, rows: 4, cols: 2, tier: TIERS.EASY },
  { id: 5, cards: 12, rows: 4, cols: 3, tier: TIERS.EASY },
  { id: 6, cards: 16, rows: 4, cols: 4, tier: TIERS.MEDIUM },
  { id: 7, cards: 18, rows: 6, cols: 3, tier: TIERS.MEDIUM },
  { id: 8, cards: 20, rows: 5, cols: 4, tier: TIERS.MEDIUM },
  { id: 9, cards: 24, rows: 6, cols: 4, tier: TIERS.MEDIUM },
  { id: 10, cards: 28, rows: 7, cols: 4, tier: TIERS.MEDIUM },
  { id: 11, cards: 30, rows: 6, cols: 5, tier: TIERS.HARD },
  { id: 12, cards: 32, rows: 8, cols: 4, tier: TIERS.HARD },
  { id: 13, cards: 36, rows: 6, cols: 6, tier: TIERS.HARD },
  { id: 14, cards: 40, rows: 8, cols: 5, tier: TIERS.HARD },
  { id: 15, cards: 42, rows: 7, cols: 6, tier: TIERS.HARD },
  { id: 16, cards: 48, rows: 8, cols: 6, tier: TIERS.VERY_HARD },
  { id: 17, cards: 50, rows: 10, cols: 5, tier: TIERS.VERY_HARD },
  { id: 18, cards: 54, rows: 9, cols: 6, tier: TIERS.VERY_HARD },
  { id: 19, cards: 56, rows: 8, cols: 7, tier: TIERS.VERY_HARD },
  { id: 20, cards: 60, rows: 10, cols: 6, tier: TIERS.VERY_HARD },
  { id: 21, cards: 64, rows: 8, cols: 8, tier: TIERS.EXTREME },
  { id: 22, cards: 66, rows: 11, cols: 6, tier: TIERS.EXTREME },
  { id: 23, cards: 70, rows: 10, cols: 7, tier: TIERS.EXTREME },
  { id: 24, cards: 72, rows: 9, cols: 8, tier: TIERS.EXTREME },
  { id: 25, cards: 78, rows: 13, cols: 6, tier: TIERS.EXTREME }
];

// Tier colors for UI - Updated color scheme
export const TIER_COLORS = {
  [TIERS.EASY]: '#4CAF50',      // Green
  [TIERS.MEDIUM]: '#2196F3',    // Blue  
  [TIERS.HARD]: '#FFC107',      // Yellow
  [TIERS.VERY_HARD]: '#FF9800', // Orange
  [TIERS.EXTREME]: '#F44336'    // Red
};