/**
 * Level Details Screen
 * Purpose: Show full info of selected level with actions to start, reset, or share
 * Extension: Add level statistics, leaderboards, custom difficulty settings
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LEVEL_CONFIGS, TIER_COLORS } from '../../constants/levels';
import { previewTimeSec } from '../../utils/scoring';
import useGameStore from '../../store/useGameStore';

export default function LevelDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { gameData, resetLevelBest } = useGameStore();
  
  const levelId = parseInt(id, 10);
  const level = LEVEL_CONFIGS.find(l => l.id === levelId);
  
  if (!level) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Level not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const isUnlocked = levelId <= gameData.maxLevel;
  const bestScore = gameData.scoresByLevel[levelId] || 0;
  const maxPossible = 30 * levelId;
  const previewTime = previewTimeSec(level.cards);
  const bestPercentage = maxPossible > 0 ? Math.round((bestScore / maxPossible) * 100) : 0;
  
  const handleStart = () => {
    if (!isUnlocked) {
      Alert.alert('Level Locked', 'Complete previous levels to unlock this one.');
      return;
    }
    router.push(`/game/${levelId}`);
  };

  const handleResetBest = () => {
    if (bestScore === 0) {
      Alert.alert('No Score', 'No best score to reset for this level.');
      return;
    }
    
    Alert.alert(
      'Reset Best Score',
      `Are you sure you want to reset your best score of ${bestScore} points for Level ${levelId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await resetLevelBest(levelId);
            Alert.alert('Success', 'Best score has been reset.');
          }
        }
      ]
    );
  };

  const handleShare = () => {
    const shareText = bestScore > 0 
      ? `I scored ${bestScore}/${maxPossible} points (${bestPercentage}%) on Level ${levelId} in Memory! Can you beat that?`
      : `Check out Level ${levelId} in Memory - ${level.cards} cards of emoji matching fun!`;
      
    Alert.alert(
      'Share Level',
      shareText,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share:', shareText) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Level Details</Text>
      </View>

      {/* Level Info Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelNumber}>
            <Text style={[styles.levelNumberText, !isUnlocked && styles.lockedText]}>
              {levelId}
            </Text>
            {!isUnlocked && (
              <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.lockIcon} />
            )}
          </View>
          
          <View style={styles.levelInfo}>
            <Text style={[styles.levelTitle, !isUnlocked && styles.lockedText]}>
              Level {levelId}
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[level.tier] }]}>
              <Text style={styles.tierText}>{level.tier}</Text>
            </View>
          </View>
        </View>

        {/* Level Specifications */}
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="grid-outline" size={20} color="#6B7280" />
            <Text style={styles.specLabel}>Grid Size</Text>
            <Text style={styles.specValue}>{level.rows} × {level.cols}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Ionicons name="card-outline" size={20} color="#6B7280" />
            <Text style={styles.specLabel}>Total Cards</Text>
            <Text style={styles.specValue}>{level.cards}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Ionicons name="heart-outline" size={20} color="#6B7280" />
            <Text style={styles.specLabel}>Pairs to Match</Text>
            <Text style={styles.specValue}>{level.cards / 2}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Ionicons name="eye-outline" size={20} color="#6B7280" />
            <Text style={styles.specLabel}>Preview Time</Text>
            <Text style={styles.specValue}>{previewTime}s</Text>
          </View>
        </View>
      </View>

      {/* Performance Stats */}
      {isUnlocked && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Performance</Text>
          
          {bestScore > 0 ? (
            <View style={styles.statsContent}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreValue}>{bestScore}</Text>
                <Text style={styles.scoreMax}>/ {maxPossible}</Text>
              </View>
              
              <View style={styles.percentageContainer}>
                <View style={styles.percentageBar}>
                  <View 
                    style={[
                      styles.percentageFill, 
                      { width: `${bestPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.percentageText}>{bestPercentage}%</Text>
              </View>
              
              <Text style={styles.statsSubtext}>
                Best score achieved • Play again to improve
              </Text>
            </View>
          ) : (
            <View style={styles.noStatsContent}>
              <Ionicons name="play-circle-outline" size={48} color="#9CA3AF" />
              <Text style={styles.noStatsText}>Not played yet</Text>
              <Text style={styles.noStatsSubtext}>Complete this level to see your performance</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, !isUnlocked && styles.primaryButtonDisabled]}
          onPress={handleStart}
          disabled={!isUnlocked}
        >
          <Ionicons 
            name={isUnlocked ? "play" : "lock-closed"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.primaryButtonText}>
            {isUnlocked ? 'Start Level' : 'Locked'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.secondaryButton, bestScore === 0 && styles.secondaryButtonDisabled]}
            onPress={handleResetBest}
            disabled={bestScore === 0}
          >
            <Ionicons name="refresh" size={16} color={bestScore > 0 ? "#EF4444" : "#9CA3AF"} />
            <Text style={[styles.secondaryButtonText, bestScore === 0 && styles.disabledText]}>
              Reset Best
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Ionicons name="share" size={16} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backIcon: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  levelNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  lockIcon: {
    position: 'absolute',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  specsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContent: {
    alignItems: 'center',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scoreMax: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 4,
  },
  percentageContainer: {
    width: '100%',
    marginBottom: 12,
  },
  percentageBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  percentageFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    textAlign: 'center',
  },
  statsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  noStatsContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noStatsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 8,
  },
  noStatsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 4,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});