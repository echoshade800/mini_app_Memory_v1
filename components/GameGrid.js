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
  cardColor 
}) {
  const gridPadding = 20;
  const cardMargin = 4;
  
  // Calculate available space considering UI components
  const headerHeight = 140; // Reduced GameHeader + preview banner space
  const bottomSafeArea = 120; // Increased bottom safe area for better spacing
  const availableHeight = screenHeight - headerHeight - bottomSafeArea;
  const availableWidth = screenWidth - (gridPadding * 2);
  
  // Calculate card size based on both width and height constraints
  const cardSizeByWidth = Math.floor((availableWidth - (cardMargin * 2 * (cols - 1))) / cols);
  const cardSizeByHeight = Math.floor((availableHeight - (cardMargin * 2 * (rows - 1))) / rows);
  
  // Use the smaller of the two to ensure cards fit in both dimensions
  const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);
  
  // Ensure minimum card size for usability, but also set a maximum to prevent oversized cards
  const finalCardSize = Math.max(Math.min(cardSize, 120), 50);

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