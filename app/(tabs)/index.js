/**
 * Home Screen (Dashboard)
 * Purpose: Overview and quick actions for the Memory game
 * Extension: Add stats widgets, achievements, daily challenges
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useGameStore from '../../store/useGameStore';
import { LEVEL_CONFIGS } from '../../constants/levels';

export default function HomeScreen() {
  const router = useRouter();
  const { gameData, isLoading, error, initialize } = useGameStore();

  useEffect(() => {
    // Show onboarding if first time
    if (!gameData.seenTutorial) {
      router.push('/onboarding');
    }
  }, [gameData.seenTutorial]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initialize}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nextLevel = Math.min(gameData.maxLevel, 25);
  const nextLevelConfig = LEVEL_CONFIGS.find(level => level.id === nextLevel);

  const handlePlayNext = () => {
    if (nextLevelConfig) {
      router.push(`/details/${nextLevel}`);
    }
  };

  const handleTutorial = () => {
    router.push('/onboarding');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memory</Text>
        <Text style={styles.subtitle}>Flip, match, and climb 25 levels of emoji mayhem</Text>
        
        <TouchableOpacity style={styles.tutorialButton} onPress={handleTutorial}>
          <Ionicons name="help-circle-outline" size={20} color="#3B82F6" />
          <Text style={styles.tutorialText}>Tutorial</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="trophy" size={24} color="#F59E0B" />
          <Text style={styles.summaryValue}>{gameData.maxLevel - 1}</Text>
          <Text style={styles.summaryLabel}>Levels Completed</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="star" size={24} color="#10B981" />
          <Text style={styles.summaryValue}>{gameData.maxScore}</Text>
          <Text style={styles.summaryLabel}>Best Score</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="time" size={24} color="#8B5CF6" />
          <Text style={styles.summaryValue}>
            {gameData.bestTime === Infinity ? '--' : `${Math.round(gameData.bestTime)}s`}
          </Text>
          <Text style={styles.summaryLabel}>Best Time</Text>
        </View>
      </View>

      {/* Primary CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handlePlayNext}>
          <Ionicons name="play" size={24} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            Play Level {nextLevel}
          </Text>
        </TouchableOpacity>
        
        {nextLevelConfig && (
          <Text style={styles.levelInfo}>
            {nextLevelConfig.cards} cards • {nextLevelConfig.tier}
          </Text>
        )}
      </View>

      {/* Recent Runs */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Games</Text>
        
        {gameData.recentRuns && gameData.recentRuns.length > 0 ? (
          gameData.recentRuns.slice(0, 5).map((run, index) => (
            <View key={run.id} style={styles.runItem}>
              <View style={styles.runInfo}>
                <Text style={styles.runLevel}>Level {run.levelId}</Text>
                <Text style={styles.runScore}>{run.score} pts</Text>
              </View>
              <Text style={styles.runTime}>{Math.round(run.duration)}s</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="game-controller-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No games yet</Text>
            <Text style={styles.emptySubtext}>Start playing to see your recent games here</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  tutorialText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  levelInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  runItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  runInfo: {
    flex: 1,
  },
  runLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  runScore: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  runTime: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});