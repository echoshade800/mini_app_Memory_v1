/**
 * ComboDisplay Component
 * Shows combo multiplier when player makes consecutive correct matches
 */

import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import useGameStore from '../store/useGameStore';

export default function ComboDisplay({ combo, visible, onAnimationComplete }) {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const { gameData } = useGameStore();
  
  // 连击音效refs
  const combo2SoundRef = useRef(null);
  const combo3SoundRef = useRef(null);
  const combo4SoundRef = useRef(null);
  const combo5SoundRef = useRef(null);
  const combo6SoundRef = useRef(null);
  const combo7SoundRef = useRef(null);
  const combo8SoundRef = useRef(null);
  const combo9PlusSoundRef = useRef(null);

  // 加载连击音效
  const loadComboSounds = async () => {
    try {
      console.log('Loading combo sounds...');
      
      // 分别加载每个连击音效 - 按照规则映射
      // 第一次配对成功（未连击）时：c6
      const combo2Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/c6102822.mp3' // c6
      });
      combo2SoundRef.current = combo2Result.sound;
      
      // combo ✖️ 2: d6
      const combo3Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/d682020.mp3' // d6
      });
      combo3SoundRef.current = combo3Result.sound;
      
      // combo ✖️ 3: e6
      const combo4Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/e682016.mp3' // e6
      });
      combo4SoundRef.current = combo4Result.sound;
      
      // combo ✖️ 4: f6
      const combo5Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/f6102819.mp3' // f6
      });
      combo5SoundRef.current = combo5Result.sound;
      
      // combo ✖️ 5: g6
      const combo6Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/g682013.mp3' // g6
      });
      combo6SoundRef.current = combo6Result.sound;
      
      // combo ✖️ 6: a6
      const combo7Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/a6102820.mp3' // a6
      });
      combo7SoundRef.current = combo7Result.sound;
      
      // combo ✖️ 7: b6
      const combo8Result = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/b682017.mp3' // b6
      });
      combo8SoundRef.current = combo8Result.sound;
      
      // combo ✖️ 8+: add
      const combo9PlusResult = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/add408457.mp3' // add
      });
      combo9PlusSoundRef.current = combo9PlusResult.sound;
      
      console.log('All combo sounds loaded successfully');
    } catch (error) {
      console.log('Error loading combo sounds:', error);
    }
  };

  // 播放连击音效
  const playComboSound = async (comboCount) => {
    console.log(`Playing combo sound for combo ${comboCount}`);
    
    let soundRef = null;
    let soundName = '';
    
    switch (comboCount) {
      case 1:
        soundRef = combo2SoundRef.current; // c6 - 第一次配对成功（未连击）
        soundName = 'c6';
        break;
      case 2:
        soundRef = combo3SoundRef.current; // d6 - combo ✖️ 2
        soundName = 'd6';
        break;
      case 3:
        soundRef = combo4SoundRef.current; // e6 - combo ✖️ 3
        soundName = 'e6';
        break;
      case 4:
        soundRef = combo5SoundRef.current; // f6 - combo ✖️ 4
        soundName = 'f6';
        break;
      case 5:
        soundRef = combo6SoundRef.current; // g6 - combo ✖️ 5
        soundName = 'g6';
        break;
      case 6:
        soundRef = combo7SoundRef.current; // a6 - combo ✖️ 6
        soundName = 'a6';
        break;
      case 7:
        soundRef = combo8SoundRef.current; // b6 - combo ✖️ 7
        soundName = 'b6';
        break;
      default:
        if (comboCount >= 8) {
          soundRef = combo9PlusSoundRef.current; // add - combo ✖️ 8+
          soundName = 'add';
        }
        break;
    }
    
    if (soundRef && gameData.soundEffectsEnabled) {
      try {
        console.log(`Playing ${soundName} for combo ${comboCount}`);
        await soundRef.replayAsync();
        console.log(`Combo sound played successfully`);
      } catch (error) {
        console.log('Error playing combo sound:', error);
      }
    } else if (!gameData.soundEffectsEnabled) {
      console.log(`Sound effects disabled, skipping ${soundName} for combo ${comboCount}`);
    } else {
      console.log(`No sound loaded for combo ${comboCount}`);
    }
  };

  // 卸载音频
  const unloadComboSounds = async () => {
    if (combo2SoundRef.current) await combo2SoundRef.current.unloadAsync();
    if (combo3SoundRef.current) await combo3SoundRef.current.unloadAsync();
    if (combo4SoundRef.current) await combo4SoundRef.current.unloadAsync();
    if (combo5SoundRef.current) await combo5SoundRef.current.unloadAsync();
    if (combo6SoundRef.current) await combo6SoundRef.current.unloadAsync();
    if (combo7SoundRef.current) await combo7SoundRef.current.unloadAsync();
    if (combo8SoundRef.current) await combo8SoundRef.current.unloadAsync();
    if (combo9PlusSoundRef.current) await combo9PlusSoundRef.current.unloadAsync();
  };

  // 初始化音频
  useEffect(() => {
    loadComboSounds();
    return () => {
      unloadComboSounds();
    };
  }, []);

  useEffect(() => {
    if (visible && combo >= 1) {
      // 播放连击音效（包括第一次配对成功）
      playComboSound(combo);
      
      // Start animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(opacityAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    } else {
      // Reset animations
      scaleAnimation.setValue(0);
      opacityAnimation.setValue(0);
    }
  }, [visible, combo]);

  if (!visible || combo < 1) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnimation }],
          opacity: opacityAnimation,
        },
      ]}
    >
      <Text style={styles.comboText}>combo</Text>
      <Text style={styles.multiplierText}>✖️{combo}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -30 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  comboText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  multiplierText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginTop: 2,
  },
});
