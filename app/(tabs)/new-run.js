/**
 * New Run Screen - Create/Start new game flow
 * Purpose: Form to start a new game run with level and color selection
 * Extension: Add difficulty suggestions, quick start options, game modes
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LEVEL_CONFIGS, CARD_COLORS } from '../../constants/levels';
import useGameStore from '../../store/useGameStore';

export default function NewRunScreen() {
  const router = useRouter();
  const { gameData } = useGameStore();
  const [selectedLevel, setSelectedLevel] = useState(gameData.maxLevel > 1 ? gameData.maxLevel - 1 : 1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableLevels = LEVEL_CONFIGS.filter(level => level.id <= gameData.maxLevel);
  const selectedLevelConfig = LEVEL_CONFIGS.find(level => level.id === selectedLevel);

  const handleStartGame = async () => {
    if (!selectedLevelConfig) {
      Alert.alert('Error', 'Please select a valid level');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Show success state briefly
      setShowSuccess(true);
      
      // Navigate to game after short delay
      setTimeout(() => {
        router.push(`/game/${selectedLevel}?color=${selectedColor || 0}`);
        setShowSuccess(false);
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to start game. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedLevel(gameData.maxLevel > 1 ? gameData.maxLevel - 1 : 1);
    setSelectedColor(null);
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        <Text style={styles.successTitle}>Game Starting!</Text>
        <Text style={styles.successSubtitle}>
          Level {selectedLevel} • {selectedLevelConfig?.cards} cards
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Start New Game</Text>
        <Text style={styles.subtitle}>Choose your level and card theme</Text>
      </View>

      {/* Level Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Level</Text>
        <Text style={styles.sectionSubtitle}>
          You can play any level up to {gameData.maxLevel}
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.levelScroll}
          contentContainerStyle={styles.levelScrollContent}
        >
          {availableLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelOption,
                selectedLevel === level.id && styles.levelOptionSelected
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              <Text style={[
                styles.levelOptionNumber,
                selectedLevel === level.id && styles.levelOptionTextSelected
              ]}>
                {level.id}
              </Text>
              <Text style={[
                styles.levelOptionLabel,
                selectedLevel === level.id && styles.levelOptionTextSelected
              ]}>
                Level {level.id}
              </Text>
              <Text style={[
                styles.levelOptionDetails,
                selectedLevel === level.id && styles.levelOptionDetailsSelected
              ]}>
                {level.cards} cards
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Level Info */}
      {selectedLevelConfig && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Details</Text>
          <View style={styles.levelInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="grid-outline" size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                {selectedLevelConfig.rows}×{selectedLevelConfig.cols} grid
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                {selectedLevelConfig.cards} cards ({selectedLevelConfig.cards / 2} pairs)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="star-outline" size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                Difficulty: {selectedLevelConfig.tier}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Color Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Theme (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a color for your card backs, or leave blank for random
        </Text>
        
        <View style={styles.colorGrid}>
          {CARD_COLORS.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === index && styles.colorOptionSelected
              ]}
              onPress={() => setSelectedColor(selectedColor === index ? null : index)}
            >
              {selectedColor === index && (
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.startButton, isSubmitting && styles.startButtonDisabled]}
          onPress={handleStartGame}
          disabled={isSubmitting}
        >
          <Ionicons 
            name={isSubmitting ? "hourglass" : "play"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.startButtonText}>
            {isSubmitting ? 'Starting...' : 'Start Game'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={16} color="#6B7280" />
          <Text style={styles.resetButtonText}>Reset</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  levelScroll: {
    marginHorizontal: -20,
  },
  levelScrollContent: {
    paddingHorizontal: 20,
  },
  levelOption: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  levelOptionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  levelOptionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  levelOptionDetails: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  levelOptionTextSelected: {
    color: '#FFFFFF',
  },
  levelOptionDetailsSelected: {
    color: '#E5E7EB',
  },
  levelInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorOptionSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});