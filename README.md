# Memory Card Game

A React Native Expo memory card matching game with 25 challenging levels, advanced scoring, and smooth gameplay.

## 🎮 Game Features

- **25 Levels**: Progressive difficulty across 5 tiers (Easy, Medium, Hard, Very Hard, Extreme)
- **200 Emoji Pool**: Unique emoji cards for endless variety
- **Advanced Scoring**: Performance, combo, and time-based scoring system
- **Haptic Feedback**: Tactile responses for matches and interactions
- **Progress Tracking**: Persistent best scores and level unlocking
- **Responsive Design**: Works on iOS, Android, and Web

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Platform-Specific Commands

```bash
# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android

# Run on Web
npx expo start --web

# Build for production
npx expo build
```

## 📱 How to Play

1. **Memorize Phase**: Cards are shown face-up for a few seconds
2. **Matching Phase**: Flip two cards to find matching emoji pairs
3. **Win Condition**: Clear all pairs within the optimal time
4. **Progression**: Complete levels to unlock new challenges

## 🏗 Project Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.js           # Home dashboard
│   ├── levels.js          # Levels browser
│   └── profile.js         # User profile & settings
├── game/[levelId].js      # Main gameplay screen
├── onboarding.js          # Tutorial & welcome
└── about.js               # About & help

components/
├── GameCard.js            # Individual memory card
├── GameGrid.js            # Grid layout for cards
└── GameHeader.js          # Game UI header

constants/
└── levels.js              # Level configurations & game data

store/
└── useGameStore.js        # Zustand global state

storage/
└── StorageUtils.js        # AsyncStorage utilities

utils/
└── scoring.js             # Scoring algorithms

hooks/
└── useBootstrap.js        # App initialization
```

## 🎯 Adding New Features

### New Screen
1. Create file in `app/` directory
2. Expo Router auto-registers the route
3. Add navigation if needed in `_layout.js`

### New Component
1. Create in `components/` directory
2. Export default function
3. Import where needed

### Game Mechanics
- Modify `utils/scoring.js` for scoring changes
- Update `constants/levels.js` for level configurations
- Use `store/useGameStore.js` for state management

## 📊 Scoring System

### Accuracy Score (0 - CAP)
- Based on accuracy: correct matches / total attempts
- Higher accuracy = higher accuracy score

### Combo Score (0 - CAP) 
- Rewards consecutive matches without mistakes
- Longer streaks = higher combo bonuses

### Time Score (0 - CAP)
- Faster completion = higher time score
- Gold time (3s per pair) = maximum points
- Bronze time (6s per pair) = minimum points

### Total Score
- Sum of Performance + Combo + Time (capped at 30 × Level)
- Percentage calculated against maximum possible

## 📈 Next Steps

1. **Remote Saves & Accounts**: Add user authentication and cloud synchronization
2. **Level Editor & Daily Challenges**: Allow custom levels and daily content
3. **Adaptive Difficulty**: Dynamic timing based on player accuracy
4. **Advanced Filters & Stats Dashboard**: Enhanced level browsing and analytics
5. **Rich Animations & Sound Effects**: Polished visual and audio feedback
6. **Leaderboards & Social Features**: Global rankings and sharing
7. **A/B Testing & Telemetry**: Data-driven optimization and insights
8. **Localization & Accessibility**: Multi-language support and inclusive design

## 🛠 Development

### Dependencies
- **Expo SDK 54.0.7**: React Native framework
- **Zustand**: Lightweight state management
- **AsyncStorage**: Local data persistence
- **Expo Haptics**: Tactile feedback
- **Expo Router**: File-based navigation

### Scripts
- `npm run dev`: Start development server
- `npm run build:web`: Build for web deployment
- `npm run lint`: Run ESLint checks

## 📄 License

© 2025 Memory Game. All rights reserved.