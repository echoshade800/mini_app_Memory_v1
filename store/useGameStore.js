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
    scoresByLevel: {},
    timesByLevel: {},
    seenTutorial: false,
    showOnboarding: true, // 控制是否显示新手引导
    recentRuns: [],
    coins: 0, // 金币数量
  },
  
  // Loading state
  isLoading: false,
  error: null,

  // Initialize data from storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const userData = await StorageUtils.getUserData();
      const gameData = await StorageUtils.getData();
      
      // Ensure backward compatibility with old data structure
      const processedGameData = gameData ? {
        maxLevel: gameData.maxLevel || 1,
        scoresByLevel: gameData.scoresByLevel || {},
        timesByLevel: gameData.timesByLevel || {},
        seenTutorial: gameData.seenTutorial || false,
        showOnboarding: gameData.showOnboarding !== undefined ? gameData.showOnboarding : true,
        recentRuns: gameData.recentRuns || [],
        coins: gameData.coins || 0,
      } : {
        maxLevel: 1,
        scoresByLevel: {},
        timesByLevel: {},
        seenTutorial: false,
        showOnboarding: true,
        recentRuns: [],
        coins: 0,
      };
      
      set({
        userData,
        gameData: processedGameData,
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

  // Toggle onboarding visibility
  toggleOnboarding: async (show) => {
    await get().updateProgress({ showOnboarding: show });
  },

  // Complete a level
  completeLevel: async (levelId, score, durationSec) => {
    const currentData = get().gameData;
    const updates = {};
    
    // Update max level if this level unlocks the next
    if (levelId >= currentData.maxLevel && levelId <= 25) {
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
    
    // Update per-level best time
    const currentLevelBestTime = currentData.timesByLevel[levelId] || Infinity;
    if (durationSec < currentLevelBestTime) {
      updates.timesByLevel = {
        ...currentData.timesByLevel,
        [levelId]: durationSec
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
    
    // 根据得分获得金币，每1分获得1个金币
    updates.coins = currentData.coins + score.total;
    
    await get().updateProgress(updates);
  },

  // Reset level best score and time
  resetLevelBest: async (levelId) => {
    const currentData = get().gameData;
    const newScoresByLevel = { ...currentData.scoresByLevel };
    const newTimesByLevel = { ...currentData.timesByLevel };
    delete newScoresByLevel[levelId];
    delete newTimesByLevel[levelId];
    
    await get().updateProgress({ 
      scoresByLevel: newScoresByLevel,
      timesByLevel: newTimesByLevel
    });
  },

  // Clear error
  clearError: () => set({ error: null }),


  // 添加金币
  addCoins: async (amount) => {
    const currentData = get().gameData;
    const newCoins = currentData.coins + amount;
    await get().updateProgress({ coins: newCoins });
  },

  // 消费金币
  spendCoins: async (amount) => {
    const currentData = get().gameData;
    if (currentData.coins >= amount) {
      const newCoins = currentData.coins - amount;
      await get().updateProgress({ coins: newCoins });
      return true;
    }
    return false;
  },

}));

export default useGameStore;