/**
 * Levels Screen - List and filter levels
 * Purpose: Browse and search levels with filtering by difficulty tier
 * Extension: Add search functionality, favorites, completion tracking
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LEVEL_CONFIGS, TIERS, TIER_COLORS } from '../../constants/levels';
import useGameStore from '../../store/useGameStore';

const TIER_FILTERS = [
  { key: 'all', label: 'All', color: '#6B7280' },
  { key: TIERS.EASY, label: 'Easy', color: TIER_COLORS[TIERS.EASY] },
  { key: TIERS.MEDIUM, label: 'Medium', color: TIER_COLORS[TIERS.MEDIUM] },
  { key: TIERS.HARD, label: 'Hard', color: TIER_COLORS[TIERS.HARD] },
  { key: TIERS.VERY_HARD, label: 'Very Hard', color: TIER_COLORS[TIERS.VERY_HARD] },
  { key: TIERS.EXTREME, label: 'Extreme', color: TIER_COLORS[TIERS.EXTREME] },
];

export default function LevelsScreen() {
  const router = useRouter();
  const { gameData } = useGameStore();
  const [searchText, setSearchText] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  const filteredLevels = useMemo(() => {
    let filtered = LEVEL_CONFIGS;

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(level =>
        level.id.toString().includes(searchText.trim()) ||
        level.tier.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by tier
    if (selectedTier !== 'all') {
      filtered = filtered.filter(level => level.tier === selectedTier);
    }

    return filtered;
  }, [searchText, selectedTier]);

  const handleLevelPress = (level) => {
    if (level.id <= gameData.maxLevel) {
      router.push(`/details/${level.id}`);
    }
  };

  const renderLevel = ({ item: level }) => {
    const isUnlocked = level.id <= gameData.maxLevel;
    const bestScore = gameData.scoresByLevel[level.id] || 0;
    const maxPossible = 30 * level.id;

    return (
      <TouchableOpacity
        style={[styles.levelCard, !isUnlocked && styles.levelCardLocked]}
        onPress={() => handleLevelPress(level)}
        disabled={!isUnlocked}
      >
        <View style={styles.levelHeader}>
          <View style={styles.levelNumber}>
            <Text style={[styles.levelNumberText, !isUnlocked && styles.lockedText]}>
              {level.id}
            </Text>
            {!isUnlocked && (
              <Ionicons name="lock-closed" size={16} color="#9CA3AF" style={styles.lockIcon} />
            )}
          </View>
          
          <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[level.tier] }]}>
            <Text style={styles.tierText}>{level.tier}</Text>
          </View>
        </View>

        <View style={styles.levelInfo}>
          <Text style={[styles.levelTitle, !isUnlocked && styles.lockedText]}>
            Level {level.id}
          </Text>
          <Text style={[styles.levelDetails, !isUnlocked && styles.lockedText]}>
            {level.cards} cards • {level.rows}×{level.cols} grid
          </Text>
          
          {isUnlocked && bestScore > 0 && (
            <View style={styles.scoreContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.scoreText}>
                {bestScore}/{maxPossible} pts
              </Text>
            </View>
          )}
        </View>

        <Ionicons 
          name={isUnlocked ? "chevron-forward" : "lock-closed"} 
          size={20} 
          color={isUnlocked ? "#6B7280" : "#9CA3AF"} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Levels</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search levels..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {TIER_FILTERS.map((tier) => (
            <TouchableOpacity
              key={tier.key}
              style={[
                styles.filterChip,
                selectedTier === tier.key && styles.filterChipActive,
                selectedTier === tier.key && { backgroundColor: tier.color }
              ]}
              onPress={() => setSelectedTier(tier.key)}
            >
              <Text style={[
                styles.filterChipText,
                selectedTier === tier.key && styles.filterChipTextActive
              ]}>
                {tier.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Levels List */}
      {filteredLevels.length > 0 ? (
        <FlatList
          data={filteredLevels}
          renderItem={renderLevel}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.levelsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No levels found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filter criteria
          </Text>
        </View>
      )}
    </View>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    marginHorizontal: -20,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  levelsList: {
    padding: 20,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelCardLocked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  levelHeader: {
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 8,
  },
  levelNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  lockIcon: {
    position: 'absolute',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  levelDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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