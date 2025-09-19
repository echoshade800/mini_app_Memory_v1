/**
 * GameHeader Component
 * Shows game progress, timer, and controls during gameplay
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateTotalScore, calculateComboSegments } from '../utils/scoring';

export default function GameHeader({ 
  level, 
  timer, 
  pairs, 
  totalPairs, 
  attempts, 
  matchHistory = [],
  onMenuPress, 
  onBackPress,
  isPreview = false,
  previewTimer = 0
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate current total score
  const getCurrentScore = () => {
    if (!isPreview && matchHistory.length > 0) {
      const comboSegments = calculateComboSegments(matchHistory);
      const scoreData = calculateTotalScore(level, totalPairs, attempts, timer, comboSegments);
      return scoreData.total;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.levelTitle}>Level {level}</Text>
        </View>
        
        <View style={styles.centerInfo}>
          {!isPreview && (
            <View style={styles.statsInline}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#8B5CF6" />
                <Text style={styles.statValue}>{formatTime(timer)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.statValue}>{getCurrentScore()}</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {isPreview && (
            <View style={styles.previewTimerContainer}>
              <Text style={styles.previewTimer}>{previewTimer}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    marginRight: 'auto',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    marginLeft: 'auto',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  centerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  statsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  previewTimerContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    marginRight: 12,
  },
  previewTimer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706',
  },
});