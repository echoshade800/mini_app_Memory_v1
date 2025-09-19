/**
 * GameGrid Component
 * Renders the grid layout for memory game cards
 */

import { View, StyleSheet, Dimensions } from 'react-native';
import GameCard from './GameCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameGrid({ 
  cards, 
  flippedCards, 
  matchedCards, 
  onCardPress, 
  disabled, 
  rows, 
  cols,
  cardColor,
  isPreview = false,
  levelId = 1 // Add levelId to identify problem levels
}) {
  // Problematic levels that need special handling
  const problemLevels = [1, 4, 7, 12, 17, 22];
  const isProblemLevel = problemLevels.includes(levelId);
  
  // Special adjustments for different problem levels
  const getSpecialAdjustments = () => {
    switch(levelId) {
      case 1: // 2 rows, 1 col - very tall cards
        return { gridPadding: 20, cardMargin: 3, bottomMargin: 30 };
      case 4: // 4 rows, 2 cols
        return { gridPadding: 16, cardMargin: 2, bottomMargin: 25 };
      case 7: // 6 rows, 3 cols
        return { gridPadding: 12, cardMargin: 1, bottomMargin: 20 };
      case 12: // 8 rows, 4 cols
        return { gridPadding: 10, cardMargin: 1, bottomMargin: 15 };
      case 17: // 10 rows, 5 cols
        return { gridPadding: 8, cardMargin: 1, bottomMargin: 10 };
      case 22: // 11 rows, 6 cols
        return { gridPadding: 6, cardMargin: 1, bottomMargin: 8 };
      default:
        return { gridPadding: 16, cardMargin: 2, bottomMargin: 0 };
    }
  };
  
  const adjustments = getSpecialAdjustments();
  const gridPadding = adjustments.gridPadding;
  const cardMargin = adjustments.cardMargin;
  const bottomMargin = adjustments.bottomMargin;
  
  // Calculate available space - only account for header, use all remaining space
  const headerHeight = isPreview ? 140 : 120; // Header height including safe area
  const availableHeight = screenHeight - headerHeight;
  const availableWidth = screenWidth - (gridPadding * 2);
  
  // For problem levels, add extra bottom margin to prevent overflow
  const effectiveHeight = availableHeight - bottomMargin;
  
  // Calculate card size to fill all available space
  const cardSizeByWidth = Math.floor((availableWidth - (cardMargin * (cols - 1))) / cols);
  const cardSizeByHeight = Math.floor((effectiveHeight - (cardMargin * (rows - 1))) / rows);
  
  // Use the smaller of the two to ensure cards fit in both dimensions
  const finalCardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

  const renderCard = (card, index) => {
    const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
    const isMatched = matchedCards.includes(index);

    return (
      <GameCard
        key={index}
        emoji={card.emoji}
        isFlipped={isFlipped}
        isMatched={isMatched}
        onPress={() => onCardPress(index)}
        disabled={disabled}
        cardSize={finalCardSize}
        cardColor={cardColor}
      />
    );
  };

  const renderRow = (rowIndex) => {
    const startIndex = rowIndex * cols;
    const rowCards = cards.slice(startIndex, startIndex + cols);

    return (
      <View key={rowIndex} style={styles.row}>
        {rowCards.map((card, colIndex) => 
          renderCard(card, startIndex + colIndex)
        )}
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    isProblemLevel && styles.problemLevelContainer
  ];
  
  const gridStyle = [
    styles.grid,
    isProblemLevel && styles.problemLevelGrid
  ];

  return (
    <View style={containerStyle}>
      <View style={gridStyle}>
        {Array.from({ length: rows }, (_, index) => renderRow(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  problemLevelContainer: {
    paddingTop: 8, // Reduce top padding for problem levels
    paddingBottom: 8, // Reduce bottom padding for problem levels
    paddingHorizontal: 6, // Reduce horizontal padding for problem levels
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemLevelGrid: {
    justifyContent: 'flex-start', // Align to top for problem levels
    paddingTop: 4, // Small top padding
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
});