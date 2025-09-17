import { create } from 'zustand';
import StorageUtils from '../storage/StorageUtils';

/**
 * Global game state using Zustand
 * Manages user data, game progress, and current game state
 */
const useGameStore = create((set, get) => ({
  // User data
  userData: null,
  
  // Game progress
  gameData: {
    maxLevel: 1,
    maxScore: 0,
    bestTime: Infinity,
    scoresByLevel: {},
    seenTutorial: false,
    recentRuns: []
  },
  
  // Current game state
  currentGame: null,
  isLoading: false,
  error: null,

  // Initialize data from storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const userData = await StorageUtils.getUserData();
      const gameData = await StorageUtils.getData();
      
      set({
        userData,
        gameData: gameData || {
          maxLevel: 1,
          maxScore: 0,
          bestTime: Infinity,
          scoresByLevel: {},
          seenTutorial: false,
          recentRuns: []
        },
        isLoading: false
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Update game progress
  updateProgress: async (updates) => {
    const currentData = get().gameData;
    const newData = { ...currentData, ...updates };
    
    set({ gameData: newData });
    await StorageUtils.setData(newData);
  },

  // Save user data
  saveUserData: async (userData) => {
    set({ userData });
    await StorageUtils.saveUserData(userData);
  },

  // Set tutorial as seen
  setTutorialSeen: async () => {
    await get().updateProgress({ seenTutorial: true });
  },

  // Complete a level
  completeLevel: async (levelId, score, durationSec) => {
    const currentData = get().gameData;
    const updates = {};
    
    // Update max score if this is better
    if (score.total > currentData.maxScore) {
      updates.maxScore = score.total;
    }
    
    // Update best time if this is better
    if (durationSec < currentData.bestTime) {
      updates.bestTime = durationSec;
    }
    
    // Update max level if this level unlocks the next
    if (levelId >= currentData.maxLevel && levelId < 25) {
      updates.maxLevel = levelId + 1;
    }
    
    // Update per-level best score
    const currentLevelBest = currentData.scoresByLevel[levelId] || 0;
    if (score.total > currentLevelBest) {
      updates.scoresByLevel = {
        ...currentData.scoresByLevel,
        [levelId]: score.total
      };
    }
    
    // Add to recent runs
    const newRun = {
      id: Date.now(),
      levelId,
      score: score.total,
      duration: durationSec,
      completedAt: new Date().toISOString()
    };
    
    updates.recentRuns = [newRun, ...(currentData.recentRuns || [])].slice(0, 10);
    
    await get().updateProgress(updates);
  },

  // Reset level best score
  resetLevelBest: async (levelId) => {
    const currentData = get().gameData;
    const newScoresByLevel = { ...currentData.scoresByLevel };
    delete newScoresByLevel[levelId];
    
    await get().updateProgress({ scoresByLevel: newScoresByLevel });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set current game
  setCurrentGame: (game) => set({ currentGame: game }),

  // Clear current game
  clearCurrentGame: () => set({ currentGame: null })
}));

export default useGameStore;