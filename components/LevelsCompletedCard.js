import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LevelsCompletedCard({ count = 0 }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="trophy" size={24} color="#F59E0B" />
      </View>

      <View style={styles.textRow}>
        <Text style={styles.count} allowFontScaling>{String(count)}</Text>
      </View>
      
      <View style={styles.labelContainer}>
        <Text style={styles.label} numberOfLines={1} allowFontScaling>
          Levels Completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245,158,11,0.12)', // amber tint
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    color: '#111827',
  },
  label: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600',
    color: '#6B7280',
    flexShrink: 1, // prevent overflow on small screens
    textAlign: 'center',
  },
});
