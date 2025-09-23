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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const { gameData, spendCoins } = useGameStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePowerupAction = async (powerupType) => {
    if (disabled || gameState !== 'playing' || isProcessing) return;
    
    const config = POWERUP_CONFIGS[powerupType];
    const canAfford = gameData.coins >= config.price;
    
    if (canAfford) {
      // Show confirmation dialog
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
                const spendSuccess = await spendCoins(config.price);
                if (spendSuccess) {
                  await onUsePowerup(powerupType);
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
      // Not enough coins
      Alert.alert(
        'Insufficient Coins',
        `You need ${config.price} coins to use ${config.name}.`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderPowerupButton = (powerupType) => {
    const config = POWERUP_CONFIGS[powerupType];
    const canAfford = gameData.coins >= config.price;
    const canUse = !disabled && gameState === 'playing' && !isProcessing;
    
    let buttonStyle = styles.powerupButton;
    let emojiStyle = styles.powerupEmoji;
    let countStyle = styles.powerupCount;
    
    if (!canUse) {
      buttonStyle = [styles.powerupButton, styles.powerupButtonDisabled];
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
          💰
        </Text>
        <Text style={styles.priceText}>
          {config.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom + 16, 16) }]}>
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