/**
 * GameGrid Component
 * Renders the grid layout for memory game cards
 */

import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  levelId = 1, // Add levelId to identify problem levels
  headerBottomY = 0 // Y position of header bottom edge (倒计时/提示条的下边缘)
}) {
  // Get safe area insets
  const insets = useSafeAreaInsets();
  
  // Check if this level needs special handling (rows >= 1.8 * cols)
  const isTallLevel = rows >= 1.8 * cols;
  
  // Calculate safe area bounds for card container (黑线标出的区域)
  const calculateSafeAreaBounds = () => {
    // 上边界 = 倒计时/提示条的下边缘
    const topBound = headerBottomY;
    
    // 下边界 = SafeAreaView 的底部 inset 上边缘，减去底部边距
    const bottomMargin = 20; // 底部留白间距
    const bottomBound = screenHeight - insets.bottom - bottomMargin;
    
    // 计算左右边距，设置为0px让网格完全贴合屏幕边缘
    const horizontalMargin = 0; // 左右留白间距设为0
    const leftBound = insets.left + horizontalMargin;
    const rightBound = screenWidth - insets.right - horizontalMargin;
    
    // 计算安全区域内的可用尺寸
    const safeAreaWidth = rightBound - leftBound;
    const safeAreaHeight = bottomBound - topBound;
    
    return {
      top: topBound,
      bottom: bottomBound,
      left: leftBound,
      right: rightBound,
      width: safeAreaWidth,
      height: safeAreaHeight
    };
  };
  
  // Calculate optimal spacing based on safe area
  const getOptimalSpacing = () => {
    const totalCards = rows * cols;
    const safeArea = calculateSafeAreaBounds();
    
    // Calculate total available area for cards within safe area
    const totalAvailableArea = safeArea.width * safeArea.height;
    
    // Calculate target visual area per card (黑线区域面积 / 卡牌总数)
    const targetVisualAreaPerCard = totalAvailableArea / totalCards;
    
    // Calculate optimal grid padding (内部留白，为了美观)
    const basePadding = Math.min(6, Math.max(2, Math.floor(safeArea.width * 0.01)));
    
    // Calculate optimal card margin based on card density
    const cardDensity = totalCards / (safeArea.width * safeArea.height / 10000);
    const baseCardMargin = cardDensity > 3 ? 1 : 2;
    
    return {
      gridPadding: basePadding,
      cardMargin: baseCardMargin,
      targetVisualAreaPerCard: targetVisualAreaPerCard,
      safeArea: safeArea
    };
  };
  
  const spacing = getOptimalSpacing();
  const gridPadding = spacing.gridPadding;
  const cardMargin = spacing.cardMargin;
  const targetVisualAreaPerCard = spacing.targetVisualAreaPerCard;
  const safeArea = spacing.safeArea;
  
  // Calculate available space within safe area
  const availableWidth = safeArea.width - (gridPadding * 2);
  const availableHeight = safeArea.height - (gridPadding * 2);
  
  // Calculate card dimensions based on target visual area per card
  const cardInternalMargin = 2; // Internal margin from GameCard component
  
  // Calculate optimal card dimensions to fill the safe area
  const gridAspectRatio = cols / rows;
  const availableAspectRatio = availableWidth / availableHeight;
  
  // Calculate base card dimensions within safe area
  let baseCardWidth = Math.floor((availableWidth - (cardMargin * (cols - 1))) / cols);
  let baseCardHeight = Math.floor((availableHeight - (cardMargin * (rows - 1))) / rows);
  
  // Calculate target area per card (黑线区域面积 / 卡牌总数)
  const targetCardArea = targetVisualAreaPerCard;
  
  // Adjust dimensions to match target visual area
  const currentCardArea = baseCardWidth * baseCardHeight;
  const areaRatio = Math.sqrt(targetCardArea / currentCardArea);
  
  let optimizedCardWidth = Math.floor(baseCardWidth * areaRatio);
  let optimizedCardHeight = Math.floor(baseCardHeight * areaRatio);
  
  // Ensure cards fit within safe area
  const maxWidth = Math.floor((availableWidth - (cardMargin * (cols - 1))) / cols);
  const maxHeight = Math.floor((availableHeight - (cardMargin * (rows - 1))) / rows);
  
  optimizedCardWidth = Math.min(optimizedCardWidth, maxWidth);
  optimizedCardHeight = Math.min(optimizedCardHeight, maxHeight);
  
  // For tall levels, prioritize vertical space utilization
  if (isTallLevel) {
    // Try to use more vertical space while maintaining aspect ratio
    const optimalAspectRatio = gridAspectRatio;
    
    // Calculate dimensions that better utilize vertical space
    const verticalOptimizedHeight = Math.min(maxHeight, Math.floor(maxWidth / optimalAspectRatio));
    const verticalOptimizedWidth = Math.floor(verticalOptimizedHeight * optimalAspectRatio);
    
    // Use the option that provides better space utilization
    const currentUtilization = optimizedCardWidth * optimizedCardHeight;
    const verticalUtilization = verticalOptimizedWidth * verticalOptimizedHeight;
    
    if (verticalUtilization > currentUtilization) {
      optimizedCardWidth = verticalOptimizedWidth;
      optimizedCardHeight = verticalOptimizedHeight;
    }
  }
  
  // Ensure minimum dimensions for usability
  optimizedCardWidth = Math.max(optimizedCardWidth, 30);
  optimizedCardHeight = Math.max(optimizedCardHeight, 30);
  
  // Calculate space utilization within safe area
  const squareSize = Math.min(optimizedCardWidth, optimizedCardHeight);
  const squareArea = squareSize * squareSize * rows * cols;
  const totalSafeArea = safeArea.width * safeArea.height;
  const squareUtilization = squareArea / totalSafeArea;
  
  // Calculate rectangular card dimensions
  const rectWidth = optimizedCardWidth;
  const rectHeight = optimizedCardHeight;
  const rectArea = rectWidth * rectHeight * rows * cols;
  const rectUtilization = rectArea / totalSafeArea;
  
  // Determine if we should use rectangular cards for better space utilization
  const shouldUseRectangular = rectUtilization > squareUtilization * 1.02 || 
                              Math.abs(availableAspectRatio - gridAspectRatio) > 0.1 ||
                              squareUtilization < 0.8;
  
  // Debug logging (uncomment for debugging)
  // if (__DEV__) {
  //   console.log(`Level ${levelId}: ${rows}x${cols}, Available: ${availableWidth}x${availableHeight}`);
  //   console.log(`  Square: ${squareSize}x${squareSize}, Utilization: ${(squareUtilization * 100).toFixed(1)}%`);
  //   console.log(`  Rect: ${rectWidth}x${rectHeight}, Utilization: ${(rectUtilization * 100).toFixed(1)}%`);
  //   console.log(`  Using: ${shouldUseRectangular ? 'Rectangular' : 'Square'}`);
  // }
  
  let finalCardWidth = optimizedCardWidth;
  let finalCardHeight = optimizedCardHeight;
  
  if (isTallLevel) {
    // For tall levels, use the optimized dimensions we calculated above
    finalCardWidth = optimizedCardWidth;
    finalCardHeight = optimizedCardHeight;
  } else if (shouldUseRectangular) {
    // For rectangular layouts, optimize card dimensions to better fill available space
    // Calculate the optimal aspect ratio based on grid layout
    const optimalAspectRatio = gridAspectRatio;
    
    // Calculate dimensions that maintain the grid's aspect ratio while maximizing space usage
    const maxWidth = Math.floor((availableWidth - (cardMargin * (cols - 1))) / cols);
    const maxHeight = Math.floor((availableHeight - (cardMargin * (rows - 1))) / rows);
    
    // Try to use the full width first
    finalCardWidth = maxWidth;
    finalCardHeight = Math.floor(maxWidth / optimalAspectRatio);
    
    // If height exceeds available space, scale down based on height
    if (finalCardHeight > maxHeight) {
      finalCardWidth = Math.floor(maxHeight * optimalAspectRatio);
      finalCardHeight = maxHeight;
    }
    
    // If we still have space, try to maximize the smaller dimension
    const remainingWidth = availableWidth - (finalCardWidth * cols + cardMargin * (cols - 1));
    const remainingHeight = availableHeight - (finalCardHeight * rows + cardMargin * (rows - 1));
    
    if (remainingWidth > 0 && remainingHeight > 0) {
      // Distribute remaining space proportionally
      const widthPerCard = Math.floor(remainingWidth / cols);
      const heightPerCard = Math.floor(remainingHeight / rows);
      
      finalCardWidth += widthPerCard;
      finalCardHeight += heightPerCard;
    }
    
    // Ensure minimum dimensions
    finalCardWidth = Math.max(finalCardWidth, 30);
    finalCardHeight = Math.max(finalCardHeight, 30);
  } else {
    // For square-like layouts, use square cards
    finalCardWidth = squareSize;
    finalCardHeight = squareSize;
  }

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
        cardWidth={finalCardWidth}
        cardHeight={finalCardHeight}
        cardColor={cardColor}
      />
    );
  };

  const renderRow = (rowIndex) => {
    const startIndex = rowIndex * cols;
    const rowCards = cards.slice(startIndex, startIndex + cols);

    return (
      <View key={rowIndex} style={[styles.row, {
        marginBottom: rowIndex < rows - 1 ? cardMargin : 0, // Add margin between rows
      }]}>
        {rowCards.map((card, colIndex) => 
          <View key={startIndex + colIndex} style={{
            marginRight: colIndex < cols - 1 ? cardMargin : 0, // Add margin between cards
          }}>
            {renderCard(card, startIndex + colIndex)}
          </View>
        )}
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    isTallLevel && styles.tallLevelContainer
  ];
  
  const gridStyle = [
    styles.grid,
    isTallLevel && styles.tallLevelGrid
  ];

  return (
    <View style={[containerStyle, {
      position: 'absolute',
      top: safeArea.top + gridPadding,
      left: safeArea.left + gridPadding,
      right: safeArea.right - gridPadding,
      bottom: safeArea.bottom - gridPadding,
    }]}>
      <View style={[gridStyle, {
        width: availableWidth,
        height: availableHeight,
      }]}>
        {Array.from({ length: rows }, (_, index) => renderRow(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 and centering to prevent overlap
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tallLevelContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  grid: {
    // Use flexbox to arrange rows properly
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tallLevelGrid: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 0, // Remove vertical margin to prevent gaps
  },
});