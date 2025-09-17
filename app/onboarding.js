/**
 * Onboarding Screen - Tutorial and welcome flow
 * Purpose: Introduce game rules and mechanics to new players
 * Extension: Add animated examples, difficulty selection, preferences setup
 */

import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useGameStore from '../store/useGameStore';

const { width: screenWidth } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    title: 'Welcome to Memory!',
    subtitle: 'Flip, match, and climb 25 levels of emoji mayhem',
    icon: '🧠',
    content: 'Test your memory skills with our challenging card matching game. Match pairs of emoji cards to clear each level and unlock new challenges!'
  },
  {
    title: 'How to Play',
    subtitle: 'Simple rules, endless fun',
    icon: '🃏',
    content: 'Flip two cards at a time to find matching pairs. Remember where cards are located and clear the entire board to win. Each level gets progressively harder!'
  },
  {
    title: 'Scoring System',
    subtitle: 'Performance, combo, and time matter',
    icon: '⭐',
    content: 'Earn points based on your accuracy, consecutive matches, and completion time. The faster and more accurate you are, the higher your score!'
  },
  {
    title: 'Ready to Start?',
    subtitle: 'Your memory adventure awaits',
    icon: '🚀',
    content: 'Start with Level 1 and work your way through 25 increasingly challenging levels. Good luck, and have fun!'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setTutorialSeen } = useGameStore();
  const [currentPage, setCurrentPage] = useState(0);

  const handleGetStarted = async () => {
    await setTutorialSeen();
    router.back();
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Tutorial?',
      'You can always view the tutorial again from your profile.',
      [
        { text: 'Continue Tutorial', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: handleGetStarted
        }
      ]
    );
  };

  const handleNext = () => {
    if (currentPage < ONBOARDING_SLIDES.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Page Content */}
      <View style={styles.content}>
        <View style={styles.pageContainer}>
          <View style={styles.page}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{ONBOARDING_SLIDES[currentPage].icon}</Text>
            </View>
            
            <Text style={styles.title}>{ONBOARDING_SLIDES[currentPage].title}</Text>
            <Text style={styles.subtitle}>{ONBOARDING_SLIDES[currentPage].subtitle}</Text>
            <Text style={styles.description}>{ONBOARDING_SLIDES[currentPage].content}</Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index && styles.indicatorActive
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttons}>
          {currentPage > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
              <Ionicons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.spacer} />
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentPage === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentPage < ONBOARDING_SLIDES.length - 1 && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy Link */}
      <TouchableOpacity style={styles.privacyLink}>
        <Text style={styles.privacyText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 80,
  },
  pageContainer: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigation: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 4,
  },
  privacyLink: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  privacyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
});