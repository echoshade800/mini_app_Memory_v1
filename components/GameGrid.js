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
  isPreview = false
}) {
  const gridPadding = 20;
  const cardMargin = 4;
  
  // Calculate available space considering UI components
  // In preview mode, we need more space to avoid overlapping with the countdown timer
  const headerHeight = isPreview ? 120 : 140; // Increased space in preview mode to avoid countdown overlap
  const bottomSafeArea = 120; // Increased bottom safe area for better spacing
  const availableHeight = screenHeight - headerHeight - bottomSafeArea;
  const availableWidth = screenWidth - (gridPadding * 2);
  
  // Calculate card size based on both width and height constraints
  const cardSizeByWidth = Math.floor((availableWidth - (cardMargin * 2 * (cols - 1))) / cols);
  const cardSizeByHeight = Math.floor((availableHeight - (cardMargin * 2 * (rows - 1))) / rows);
  
  // Use the smaller of the two to ensure cards fit in both dimensions
  const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);
  
  // Dynamic card size calculation based on level complexity
  const totalCards = rows * cols;
  let maxCardSize, minCardSize;
  
  if (totalCards <= 4) {
    // Early levels (1-2): Larger cards, don't feel empty
    maxCardSize = Math.min(160, screenWidth * 0.4);
    minCardSize = 80;
  } else if (totalCards <= 16) {
    // Easy levels (3-6): Medium-large cards
    maxCardSize = Math.min(120, screenWidth * 0.25);
    minCardSize = 60;
  } else if (totalCards <= 36) {
    // Medium levels (7-13): Medium cards
    maxCardSize = Math.min(100, screenWidth * 0.2);
    minCardSize = 50;
  } else if (totalCards <= 64) {
    // Hard levels (14-21): Smaller cards, more precision needed
    maxCardSize = Math.min(80, screenWidth * 0.15);
    minCardSize = 40;
  } else {
    // Extreme levels (22-25): Very small cards, fit many on screen without overlapping
    maxCardSize = Math.min(60, screenWidth * 0.1);
    minCardSize = 30;
  }
  
  // Apply size constraints while ensuring cards don't overlap with UI elements
  const finalCardSize = Math.max(Math.min(cardSize, maxCardSize), minCardSize);

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

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
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
    paddingHorizontal: 10,
    paddingBottom: 20, // Add bottom padding to prevent cutoff
  },
  grid: {
    alignItems: 'center',
    maxHeight: screenHeight * 0.65, // Increased slightly for better card visibility
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
});