/**
 * GameHeader Component
 * Shows game progress, timer, and controls during gameplay
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GameHeader({ 
  level, 
  onMenuPress, 
  onBackPress,
  isPreview = false,
  previewTimer = 0,
  coins = 0
}) {

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
          {/* 移除时间和得分显示 */}
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.coinDisplay}>
            <Text style={styles.coinText}>🪙 {coins}</Text>
          </View>
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
  coinDisplay: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  coinText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
  },
});