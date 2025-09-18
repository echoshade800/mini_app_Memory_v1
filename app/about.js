/**
 * About & Help Screen
 * Purpose: App information, version, support links, and FAQs
 * Extension: Add detailed FAQ, contact form, feedback system, changelog
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FAQ_ITEMS = [
  {
    question: 'How do I unlock new levels?',
    answer: 'Complete the current level to unlock the next one. You must finish all 25 levels in order.'
  },
  {
    question: 'How is my score calculated?',
    answer: 'Your score is based on three factors: Performance (accuracy), Combo (consecutive matches), and Time (how fast you complete the level).'
  },
  {
    question: 'What happens if I run out of time?',
    answer: 'There\'s no strict time limit, but faster completion gives you better time scores. Take your time to memorize the cards!'
  },
  {
    question: 'Can I replay completed levels?',
    answer: 'Yes! You can replay any completed level to improve your score. Your best score is always saved.'
  },
  {
    question: 'How do I reset my progress?',
    answer: 'Go to Profile > Reset All Progress. Warning: this cannot be undone and will erase all your game data.'
  }
];

export default function AboutScreen() {
  const router = useRouter();

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact us at support@memorygame.com',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Linking.openURL('mailto:support@memorygame.com')
        }
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy feature coming soon.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service feature coming soon.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About & Help</Text>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>🧠</Text>
          </View>
          <Text style={styles.appName}>Memory</Text>
          <Text style={styles.appTagline}>Flip, match, and climb 25 levels of emoji mayhem</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="trophy" size={20} color="#F59E0B" />
            <Text style={styles.featureText}>25 challenging levels across 5 difficulty tiers</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
            <Text style={styles.featureText}>Advanced scoring system with accuracy tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="color-palette" size={20} color="#8B5CF6" />
            <Text style={styles.featureText}>200 unique emoji cards and 7 color themes</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="phone-portrait" size={20} color="#06B6D4" />
            <Text style={styles.featureText}>Haptic feedback and smooth animations</Text>
          </View>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        ))}
      </View>

      {/* Support Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkItem} onPress={handleSupport}>
            <Ionicons name="mail" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handlePrivacy}>
            <Ionicons name="shield-checkmark" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handleTerms}>
            <Ionicons name="document-text" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Credits */}
      <View style={styles.section}>
        <Text style={styles.creditsText}>
          Made with ❤️ for puzzle game enthusiasts
        </Text>
        <Text style={styles.copyrightText}>
          © 2025 Memory Game. All rights reserved.
        </Text>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  appInfo: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  version: {
    fontSize: 14,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 16,
    flex: 1,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  linksContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  creditsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});