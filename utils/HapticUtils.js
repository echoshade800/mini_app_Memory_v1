/**
 * Haptic Feedback Utility
 * Manages haptic feedback with respect to user settings
 */

import * as Haptics from 'expo-haptics';
import useGameStore from '../store/useGameStore';

class HapticUtils {
  // Check if haptic feedback is enabled
  static isHapticEnabled() {
    const gameData = useGameStore.getState().gameData;
    return gameData.hapticFeedbackEnabled;
  }

  // Trigger haptic feedback if enabled
  static async triggerHaptic(type = Haptics.ImpactFeedbackStyle.Heavy) {
    if (!this.isHapticEnabled()) return;
    
    try {
      if (Haptics.impactAsync) {
        await Haptics.impactAsync(type);
      }
    } catch (error) {
      console.log('HapticUtils: Error triggering haptic feedback:', error);
    }
  }

  // Trigger heavy haptic feedback
  static async triggerHeavy() {
    await this.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Trigger light haptic feedback
  static async triggerLight() {
    await this.triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  // Trigger medium haptic feedback
  static async triggerMedium() {
    await this.triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export default HapticUtils;
