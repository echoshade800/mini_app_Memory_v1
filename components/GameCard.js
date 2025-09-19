/**
 * GameCard Component
 * Renders individual memory cards with flip animations and emoji faces
 */

import { TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

const { width: screenWidth } = Dimensions.get('window');

export default function GameCard({ 
  emoji, 
  isFlipped, 
  isMatched, 
  onPress, 
  disabled, 
  cardSize, 
  cardColor 
}) {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  useEffect(() => {
    if (isMatched) {
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isMatched]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const cardStyle = {
    width: cardSize,
    height: cardSize,
    transform: [{ scale: scaleAnimation }]
  };

  const frontStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
    backgroundColor: cardColor,
  };

  const backStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, cardStyle]}
      onPress={onPress}
      disabled={disabled || isFlipped || isMatched}
      activeOpacity={0.8}
    >
      {/* Card Back (face down) */}
      <Animated.View style={[styles.card, styles.cardBack, frontStyle]}>
      </Animated.View>

      {/* Card Front (emoji face) */}
      <Animated.View style={[styles.card, styles.cardFront, backStyle]}>
        <Text style={[styles.emoji, { fontSize: cardSize * 0.8 }]}>
          {emoji}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 2,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cardPattern: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  emoji: {
    fontWeight: 'normal',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});