/**
 * GameGrid Component
 * Renders the grid layout for memory game cards
 */

import { View, StyleSheet, Dimensions } from 'react-native';
import GameCard from './GameCard';

const { width: screenWidth } = Dimensions.get('window');

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
  const gridPadding = 40;
  const cardMargin = 4;
  const availableWidth = screenWidth - gridPadding;
  const cardSize = Math.floor((availableWidth - (cardMargin * (cols - 1))) / cols);

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
        cardSize={cardSize}
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
    paddingHorizontal: 20,
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
});