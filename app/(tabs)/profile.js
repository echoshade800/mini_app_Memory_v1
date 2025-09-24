/**
 * Profile & Settings Screen
 * Purpose: User profile, preferences, and app settings
 * Extension: Add theme customization, sound settings, data export, account management
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useGameStore from '../../store/useGameStore';
import StorageUtils from '../../storage/StorageUtils';

export default function ProfileScreen() {
  const router = useRouter();
  const { gameData, updateProgress, toggleSoundEffects } = useGameStore();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleTutorial = () => {
    router.push('/onboarding');
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your game progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            updateProgress({
              maxLevel: 1,
              maxScore: 0,
              bestTime: Infinity,
              scoresByLevel: {},
              recentRuns: []
            });
            Alert.alert('Success', 'Progress has been reset.');
          }
        }
      ]
    );
  };

  const completionRate = Math.round(((gameData.maxLevel - 1) / 25) * 100);

  // Save maxLevel and completionRate to localStorage when they change
  useEffect(() => {
    const savePlayerStats = async () => {
      try {
        await StorageUtils.setData({
          maxLevel: gameData.maxLevel,
          completionRate: completionRate
        });
        console.log('Player stats saved to localStorage:', {
          maxLevel: gameData.maxLevel,
          completionRate: completionRate
        });
      } catch (error) {
        console.error('Failed to save player stats:', error);
      }
    };

    savePlayerStats();
  }, [gameData.maxLevel, completionRate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Stats</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#F59E0B" />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{gameData.maxLevel - 1}/25</Text>
              <Text style={styles.statLabel}>Levels Completed</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="pie-chart" size={24} color="#06B6D4" />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Game Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={20} color="#6B7280" />
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color="#6B7280" />
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={gameData.soundEffectsEnabled}
              onValueChange={toggleSoundEffects}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* App Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem} onPress={handleTutorial}>
            <Ionicons name="help-circle" size={20} color="#6B7280" />
            <Text style={styles.actionLabel}>View Tutorial</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleResetProgress}>
          <Ionicons name="trash" size={20} color="#EF4444" />
          <Text style={styles.dangerButtonText}>Reset All Progress</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statText: {
    marginLeft: 16,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});