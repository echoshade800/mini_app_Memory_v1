/**
 * PowerupBar Component
 * 道具使用栏，显示当前拥有的道具并允许使用或购买
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Dimensions 
} from 'react-native';
import useGameStore from '../store/useGameStore';

const { width: screenWidth } = Dimensions.get('window');

const POWERUP_CONFIGS = {
  bomb: {
    name: 'Bomb',
    emoji: '💣',
    description: 'Randomly removes one pair of unmatched cards',
    price: 50
  },
  clock: {
    name: 'Glimpse',
    emoji: '👀',
    description: 'Reveals all cards for 5 seconds then flips them back',
    price: 100
  },
  skip: {
    name: 'Skip',
    emoji: '⏭️',
    description: 'Instantly completes the current level',
    price: 600
  }
};

export default function PowerupBar({ 
  onUsePowerup, 
  gameState, 
  disabled = false 
}) {
  const { gameData, buyPowerup, usePowerup } = useGameStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePowerupAction = async (powerupType) => {
    if (disabled || gameState !== 'playing' || isProcessing) return;
    
    const config = POWERUP_CONFIGS[powerupType];
    const count = gameData.powerups[powerupType];
    const canAfford = gameData.coins >= config.price;
    
    if (count > 0) {
      // Have powerup, use directly
      Alert.alert(
        `Use ${config.name}`,
        `${config.description}\n\nAre you sure you want to use this powerup?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Use', 
            onPress: async () => {
              setIsProcessing(true);
              try {
                const success = await usePowerup(powerupType);
                if (success) {
                  await onUsePowerup(powerupType);
                }
              } finally {
                setIsProcessing(false);
              }
            }
          }
        ]
      );
    } else if (canAfford) {
      // No powerup but have coins, ask to buy
      Alert.alert(
        `Use ${config.name}?`,
        `${config.description}\n\nPrice: ${config.price} coins`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Use', 
            onPress: async () => {
              setIsProcessing(true);
              try {
                const buySuccess = await buyPowerup(powerupType);
                if (buySuccess) {
                  const useSuccess = await usePowerup(powerupType);
                  if (useSuccess) {
                    await onUsePowerup(powerupType);
                  }
                } else {
                  Alert.alert('Purchase Failed', 'Not enough coins!');
                }
              } finally {
                setIsProcessing(false);
              }
            }
          }
        ]
      );
    } else {
      // No powerup and no coins
      Alert.alert(
        'Powerup Unavailable',
        `You don't have ${config.name} powerup and don't have enough coins!\n\nNeed ${config.price} coins to buy.`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderPowerupButton = (powerupType) => {
    const config = POWERUP_CONFIGS[powerupType];
    const count = gameData.powerups[powerupType];
    const hasPowerup = count > 0;
    const canAfford = gameData.coins >= config.price;
    const canUse = !disabled && gameState === 'playing' && !isProcessing;
    
    let buttonStyle = styles.powerupButton;
    let emojiStyle = styles.powerupEmoji;
    let countStyle = styles.powerupCount;
    
    if (!canUse) {
      buttonStyle = [styles.powerupButton, styles.powerupButtonDisabled];
    } else if (hasPowerup) {
      buttonStyle = [styles.powerupButton, styles.powerupButtonOwned];
    } else if (canAfford) {
      buttonStyle = [styles.powerupButton, styles.powerupButtonCanBuy];
    } else {
      buttonStyle = [styles.powerupButton, styles.powerupButtonEmpty];
      emojiStyle = [styles.powerupEmoji, styles.powerupEmojiEmpty];
      countStyle = [styles.powerupCount, styles.powerupCountEmpty];
    }
    
    return (
      <TouchableOpacity
        key={powerupType}
        style={buttonStyle}
        onPress={() => handlePowerupAction(powerupType)}
        disabled={!canUse}
      >
        <Text style={emojiStyle}>
          {config.emoji}
        </Text>
        <Text style={countStyle}>
          {hasPowerup ? count : (canAfford ? '💰' : '❌')}
        </Text>
        {!hasPowerup && (
          <Text style={styles.priceText}>
            {config.price}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.powerupGrid}>
        {Object.keys(POWERUP_CONFIGS).map(renderPowerupButton)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  powerupGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  powerupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  powerupButtonOwned: {
    backgroundColor: 'rgba(220, 252, 231, 0.9)',
    borderColor: '#10B981',
  },
  powerupButtonCanBuy: {
    backgroundColor: 'rgba(254, 243, 199, 0.9)',
    borderColor: '#F59E0B',
  },
  powerupButtonEmpty: {
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    borderColor: '#E5E7EB',
  },
  powerupButtonDisabled: {
    opacity: 0.5,
  },
  powerupEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  powerupEmojiEmpty: {
    opacity: 0.3,
  },
  powerupCount: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
  powerupCountEmpty: {
    color: '#9CA3AF',
  },
  priceText: {
    fontSize: 7,
    color: '#6B7280',
    marginTop: 1,
  },
});