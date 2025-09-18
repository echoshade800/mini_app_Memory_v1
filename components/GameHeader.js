/**
 * GameHeader Component
 * Shows game progress, timer, and controls during gameplay
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GameHeader({ 
  level, 
  timer, 
  pairs, 
  totalPairs, 
  attempts, 
  onMenuPress, 
  onBackPress,
  isPreview = false 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Text style={styles.levelTitle}>Level {level}</Text>
        
        <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
          <Ionicons name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {!isPreview && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color="#8B5CF6" />
            <Text style={styles.statValue}>{formatTime(timer)}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.statValue}>{pairs}/{totalPairs}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#06B6D4" />
            <Text style={styles.statValue}>{attempts}</Text>
          </View>
        </View>
      )}

      {isPreview && (
        <View style={styles.previewBanner}>
          <Ionicons name="eye" size={20} color="#F59E0B" />
          <Text style={styles.previewText}>Memorize the cards!</Text>
        </View>
      )}
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
    marginBottom: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
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
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 8,
  },
});