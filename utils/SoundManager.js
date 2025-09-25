/**
 * Global Sound Manager - Completely Rewritten
 * Manages all game sounds with new requirements:
 * - c6 sound for non-combo card matches
 * - d6, e6, f6, g6, a6, b6 sounds for 2-7x combos
 * - add sound for 8x+ combos
 * - No sounds on completion/settlement page
 * - Proper combo reset logic
 */

import { Audio } from 'expo-av';
import useGameStore from '../store/useGameStore';

class SoundManager {
  constructor() {
    this.soundInstances = new Map();
    this.currentLevelId = null;
    this.isCompletionPage = false;
    
    // Sound URLs
    this.soundUrls = {
      cardMatch: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/c6102822.mp3',
      combo2: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/d682020.mp3',
      combo3: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/e682016.mp3',
      combo4: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/f6102819.mp3',
      combo5: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/g682013.mp3',
      combo6: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/a6102820.mp3',
      combo7: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/b682017.mp3',
      combo8plus: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/add408457.mp3'
    };
  }

  // Initialize sound for a level
  async initializeLevel(levelId) {
    console.log(`🔊 SoundManager: Initializing sounds for level ${levelId}`);
    this.currentLevelId = levelId;
    this.isCompletionPage = false;
    
    // Preload all sounds for this level
    await this.preloadSounds();
  }

  // Preload all sound files
  async preloadSounds() {
    const loadPromises = [];
    
    for (const [soundKey, url] of Object.entries(this.soundUrls)) {
      const soundId = `${soundKey}-${this.currentLevelId}`;
      
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false, isLooping: false }
        );
        
        this.soundInstances.set(soundId, sound);
        console.log(`🔊 SoundManager: Preloaded sound ${soundKey}`);
      } catch (error) {
        console.log(`🔊 SoundManager: Error preloading ${soundKey}:`, error);
      }
    }
    
    await Promise.all(loadPromises);
  }

  // Play card match sound (c6) for non-combo matches
  async playCardMatchSound() {
    if (this.isCompletionPage || !this.isSoundEnabled()) return;
    
    try {
      const soundId = `cardMatch-${this.currentLevelId}`;
      const sound = this.soundInstances.get(soundId);
      
      if (sound) {
        await sound.replayAsync();
        console.log('🔊 SoundManager: Playing card match sound (c6)');
      }
    } catch (error) {
      console.log('🔊 SoundManager: Error playing card match sound:', error);
    }
  }

  // Play combo sound based on combo count
  async playComboSound(comboCount) {
    if (this.isCompletionPage || !this.isSoundEnabled()) return;
    
    let soundKey;
    
    if (comboCount >= 8) {
      soundKey = 'combo8plus';
    } else if (comboCount >= 2) {
      soundKey = `combo${comboCount}`;
    } else {
      // For combo 1, play card match sound
      return this.playCardMatchSound();
    }
    
    try {
      const soundId = `${soundKey}-${this.currentLevelId}`;
      const sound = this.soundInstances.get(soundId);
      
      if (sound) {
        await sound.replayAsync();
        console.log(`🔊 SoundManager: Playing combo sound for ${comboCount}x combo`);
      }
    } catch (error) {
      console.log(`🔊 SoundManager: Error playing combo sound:`, error);
    }
  }

  // Handle card match with proper sound logic
  async handleCardMatch(isCombo, comboCount) {
    if (this.isCompletionPage || !this.isSoundEnabled()) return;
    
    if (isCombo && comboCount > 1) {
      // Play combo sound
      await this.playComboSound(comboCount);
    } else {
      // Play regular card match sound
      await this.playCardMatchSound();
    }
  }

  // Set completion page flag (no sounds should play)
  setCompletionPage(isCompletion) {
    this.isCompletionPage = isCompletion;
    console.log(`🔊 SoundManager: Completion page flag set to ${isCompletion}`);
  }

  // Check if sound effects are enabled
  isSoundEnabled() {
    const gameData = useGameStore.getState().gameData;
    return gameData.soundEffectsEnabled;
  }

  // Stop all sounds for current level
  async stopLevelSounds() {
    if (!this.currentLevelId) return;
    
    console.log(`🔊 SoundManager: Stopping all sounds for level ${this.currentLevelId}`);
    
    const stopPromises = [];
    
    for (const [soundId, sound] of this.soundInstances) {
      if (soundId.includes(`-${this.currentLevelId}`) && sound) {
        try {
          await sound.stopAsync();
          stopPromises.push(sound.unloadAsync());
        } catch (error) {
          console.log(`🔊 SoundManager: Error stopping sound ${soundId}:`, error);
        }
      }
    }
    
    await Promise.all(stopPromises);
    
    // Clean up sound instances for this level
    for (const [soundId] of this.soundInstances) {
      if (soundId.includes(`-${this.currentLevelId}`)) {
        this.soundInstances.delete(soundId);
      }
    }
    
    console.log(`🔊 SoundManager: All sounds stopped for level ${this.currentLevelId}`);
  }

  // Stop all sounds globally
  async stopAllSounds() {
    console.log('🔊 SoundManager: Stopping all sounds globally');
    
    const stopPromises = [];
    
    for (const [soundId, sound] of this.soundInstances) {
      if (sound) {
        try {
          await sound.stopAsync();
          stopPromises.push(sound.unloadAsync());
        } catch (error) {
          console.log(`🔊 SoundManager: Error stopping sound ${soundId}:`, error);
        }
      }
    }
    
    await Promise.all(stopPromises);
    this.soundInstances.clear();
    
    console.log('🔊 SoundManager: All sounds stopped globally');
  }

  // Clean up all resources
  async cleanup() {
    await this.stopAllSounds();
    this.currentLevelId = null;
    this.isCompletionPage = false;
    console.log('🔊 SoundManager: Cleanup completed');
  }
}

// Create global instance
const soundManager = new SoundManager();

export default soundManager;