/**
 * Game Screen - Main gameplay interface
 * Purpose: Full memory card game implementation with preview, scoring, and completion
 * Extension: Add power-ups, hints, different game modes, multiplayer
 */

import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { LEVEL_CONFIGS, EMOJI_POOL, CARD_COLORS } from '../../constants/levels';
import { previewTimeSec, calculateTotalScore, calculateComboSegments } from '../../utils/scoring';
import useGameStore from '../../store/useGameStore';
import GameHeader from '../../components/GameHeader';
import GameGrid from '../../components/GameGrid';

export default function GameScreen() {
  const router = useRouter();
  const { levelId, color } = useLocalSearchParams();
  const { completeLevel } = useGameStore();
  
  const level = LEVEL_CONFIGS.find(l => l.id === parseInt(levelId, 10));
  const cardColorIndex = color ? parseInt(color, 10) : Math.floor(Math.random() * CARD_COLORS.length);
  const cardColor = CARD_COLORS[cardColorIndex];
  
  // Game state
  const [gameState, setGameState] = useState('preview'); // 'preview', 'playing', 'completed', 'failed'
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [previewTimer, setPreviewTimer] = useState(0);
  const [matchHistory, setMatchHistory] = useState([]);
  
  // Refs
  const timerRef = useRef(null);
  const previewTimerRef = useRef(null);
  const flipTimeoutRef = useRef(null);
  
  if (!level) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Level not found</Text>
      </View>
    );
  }

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      clearAllTimers();
    };
  }, []);

  // Handle back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
  };

  const initializeGame = () => {
    // Generate random emojis for this level
    const pairCount = level.cards / 2;
    const shuffledEmojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffledEmojis.slice(0, pairCount);
    
    // Create pairs and shuffle
    const gameCards = [];
    selectedEmojis.forEach(emoji => {
      gameCards.push({ emoji, id: Math.random() });
      gameCards.push({ emoji, id: Math.random() });
    });
    gameCards.sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards(Array.from({ length: level.cards }, (_, i) => i)); // Show all cards initially
    setMatchedCards([]);
    setAttempts(0);
    setTimer(0);
    setMatchHistory([]);
    setGameState('preview');
    
    // Start preview timer
    const previewDuration = previewTimeSec(level.cards);
    setPreviewTimer(previewDuration);
    
    previewTimerRef.current = setInterval(() => {
      setPreviewTimer(prev => {
        if (prev <= 1) {
          clearInterval(previewTimerRef.current);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    setFlippedCards([]);
    setGameState('playing');
    
    // Start game timer
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const handleCardPress = (cardIndex) => {
    if (gameState !== 'playing' || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedIndices) => {
    const [first, second] = flippedIndices;
    const isMatch = cards[first].emoji === cards[second].emoji;
    
    setMatchHistory(prev => [...prev, isMatch]);

    if (isMatch) {
      // Match found - add haptic feedback
      if (Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      const newMatchedCards = [...matchedCards, first, second];
      setMatchedCards(newMatchedCards);
      setFlippedCards([]);
      
      // Check if game is complete
      if (newMatchedCards.length === level.cards) {
        completeGame();
      }
    } else {
      // No match - flip cards back after delay
      flipTimeoutRef.current = setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const completeGame = () => {
    clearInterval(timerRef.current);
    setGameState('completed');
    
    // Calculate final score
    const pairs = level.cards / 2;
    const comboSegments = calculateComboSegments(matchHistory);
    const finalScore = calculateTotalScore(level.id, pairs, attempts, timer, comboSegments);
    
    // Save progress
    completeLevel(level.id, finalScore, timer);
    
    // Show completion dialog
    setTimeout(() => {
      showCompletionDialog(finalScore);
    }, 1000);
  };

  const showCompletionDialog = (score) => {
    Alert.alert(
      'Level Complete! 🎉',
      `Score: ${score.total}/${score.maxPossible} (${score.totalPercent}%)\n\n` +
      `Performance: ${score.performance}\n` +
      `Combo: ${score.combo}\n` +
      `Time: ${score.time}`,
      [
        { 
          text: 'Play Again', 
          onPress: () => {
            clearAllTimers();
            initializeGame();
          }
        },
        { 
          text: 'Continue', 
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Game Menu',
      'Choose an option:',
      [
        { text: 'Tutorial', onPress: () => router.push('/onboarding') },
        { text: 'Restart Level', onPress: () => {
          clearAllTimers();
          initializeGame();
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert(
      'Leave Game?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Stay', style: 'cancel' },
        { 
          text: 'Leave', 
          onPress: () => {
            clearAllTimers();
            router.back();
          }
        }
      ]
    );
  };

  const isPreviewMode = gameState === 'preview';
  const isGameDisabled = gameState !== 'playing' || flippedCards.length >= 2;

  return (
    <View style={styles.container}>
      <GameHeader
        level={level.id}
        timer={timer}
        pairs={matchedCards.length / 2}
        totalPairs={level.cards / 2}
        attempts={attempts}
        onMenuPress={handleMenuPress}
        onBackPress={handleBackPress}
        isPreview={isPreviewMode}
      />

      {isPreviewMode && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTimer}>{previewTimer}</Text>
          <Text style={styles.previewText}>Memorize the positions!</Text>
        </View>
      )}

      <GameGrid
        cards={cards}
        flippedCards={flippedCards}
        matchedCards={matchedCards}
        onCardPress={handleCardPress}
        disabled={isGameDisabled}
        rows={level.rows}
        cols={level.cols}
        cardColor={cardColor}
      />

      {gameState === 'completed' && (
        <View style={styles.completedOverlay}>
          <Text style={styles.completedText}>🎉 Level Complete! 🎉</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  previewTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#92400E',
    fontWeight: '500',
  },
  completedOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#10B981',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});