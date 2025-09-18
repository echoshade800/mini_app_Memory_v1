/**
 * ScoreProgressBars Component
 * Displays animated progress bars for Performance, Combo, and Time scores
 */

import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ScoreProgressBars({ 
  scoreData, 
  levelId, 
  onAnimationComplete 
}) {
  const performanceAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const timeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Use the actual max scores from scoreData
  const maxPerformanceScore = scoreData.maxPerformanceScore || 10 * levelId;
  const maxComboScore = scoreData.maxComboScore || 10 * levelId;
  const maxTimeScore = scoreData.maxTimeScore || 10 * levelId;
  const isLastLevel = levelId === 25;

  useEffect(() => {
    // Fade in the overlay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate progress bars sequentially
    const animateProgressBars = () => {
      // Performance bar (yellow)
      Animated.timing(performanceAnim, {
        toValue: scoreData.performance / maxScore,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        // Combo bar (green)
        Animated.timing(comboAnim, {
          toValue: scoreData.combo / maxScore,
          duration: 1000,
          useNativeDriver: false,
        }).start(() => {
          // Time bar (blue)
          Animated.timing(timeAnim, {
            toValue: scoreData.time / maxScore,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        });
      });
    };

    // Start animations after a short delay
    setTimeout(animateProgressBars, 500);
  }, [scoreData, maxScore]);

  const renderProgressBar = (label, score, maxScore, animatedValue, color) => {
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: color,
                width: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <Text style={styles.progressBarLabel}>{label}</Text>
            <Text style={styles.progressBarPercentage}>{percentage}%</Text>
            <Text style={styles.progressBarScore}>{score}/{maxScore}</Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Level Complete! 🎉</Text>
          <Text style={styles.totalScore}>
            Score: {scoreData.total}/{scoreData.maxPossible} ({scoreData.totalPercent}%)
          </Text>
        </View>

        <View style={styles.progressBarsContainer}>
          {renderProgressBar(
            'Performance',
            scoreData.performance,
            maxPerformanceScore,
            performanceAnim,
            '#F59E0B' // Yellow
          )}
          
          {renderProgressBar(
            'Combo',
            scoreData.combo,
            maxComboScore,
            comboAnim,
            '#10B981' // Green
          )}
          
          {renderProgressBar(
            'Time',
            scoreData.time,
            maxTimeScore,
            timeAnim,
            '#EF4444' // Red
          )}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={onAnimationComplete}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => {
          // 重新开始当前关卡的逻辑需要从父组件传入
          if (window.restartLevel) {
            window.restartLevel();
          }
        }}>
          <Text style={styles.secondaryButtonText}>Play Again</Text>
          <Ionicons name="refresh" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  totalScore: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressBarsContainer: {
    marginBottom: 30,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    minWidth: 120, // Ensure minimum width for text visibility
  },
  progressBarLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBarPercentage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBarScore: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});