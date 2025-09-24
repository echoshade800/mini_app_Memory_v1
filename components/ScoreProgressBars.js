/**
 * ScoreProgressBars Component
 * Displays animated progress bars for Performance, Combo, and Time scores
 */

import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import useGameStore from '../store/useGameStore';

export default function ScoreProgressBars({ 
  scoreData, 
  levelId, 
  onAnimationComplete,
  onQuit,
  onRetry,
  onNext
}) {
  const performanceAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const timeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { gameData } = useGameStore();
  
  // 音频状态 - 使用ref来避免状态异步问题
  const accuracySoundRef = useRef(null);
  const comboSoundRef = useRef(null);
  const timeSoundRef = useRef(null);

  // Use the actual max scores from scoreData
  const maxAccuracyScore = scoreData.maxAccuracyScore || 10 * levelId;
  const maxComboScore = scoreData.maxComboScore || 10 * levelId;
  const maxTimeScore = scoreData.maxTimeScore || 10 * levelId;
  const isLastLevel = levelId === 25;

  // 加载音频文件
  const loadSounds = async () => {
    try {
      console.log('Loading sounds...');
      
      // 分别加载每个音频文件，避免并发问题
      const accuracySoundResult = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/d682018.mp3' 
      });
      accuracySoundRef.current = accuracySoundResult.sound;
      console.log('Accuracy sound loaded');
      
      const comboSoundResult = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/g682014.mp3' 
      });
      comboSoundRef.current = comboSoundResult.sound;
      console.log('Combo sound loaded');
      
      const timeSoundResult = await Audio.Sound.createAsync({ 
        uri: 'https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/a682015.mp3' 
      });
      timeSoundRef.current = timeSoundResult.sound;
      console.log('Time sound loaded');
      
      console.log('All sounds loaded successfully');
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };

  // 播放音效
  const playAccuracySound = async () => {
    console.log('Attempting to play accuracy sound...');
    if (accuracySoundRef.current && gameData.soundEffectsEnabled) {
      try {
        console.log('Playing accuracy sound (d#6)');
        await accuracySoundRef.current.replayAsync();
        console.log('Accuracy sound played successfully');
      } catch (error) {
        console.log('Error playing accuracy sound:', error);
      }
    } else if (!gameData.soundEffectsEnabled) {
      console.log('Sound effects disabled, skipping accuracy sound');
    } else {
      console.log('Accuracy sound not loaded yet');
    }
  };

  const playComboSound = async () => {
    console.log('Attempting to play combo sound...');
    if (comboSoundRef.current && gameData.soundEffectsEnabled) {
      try {
        console.log('Playing combo sound (g#6)');
        await comboSoundRef.current.replayAsync();
        console.log('Combo sound played successfully');
      } catch (error) {
        console.log('Error playing combo sound:', error);
      }
    } else if (!gameData.soundEffectsEnabled) {
      console.log('Sound effects disabled, skipping combo sound');
    } else {
      console.log('Combo sound not loaded yet');
    }
  };

  const playTimeSound = async () => {
    console.log('Attempting to play time sound...');
    if (timeSoundRef.current && gameData.soundEffectsEnabled) {
      try {
        console.log('Playing time sound (a#6)');
        await timeSoundRef.current.replayAsync();
        console.log('Time sound played successfully');
      } catch (error) {
        console.log('Error playing time sound:', error);
      }
    } else if (!gameData.soundEffectsEnabled) {
      console.log('Sound effects disabled, skipping time sound');
    } else {
      console.log('Time sound not loaded yet');
    }
  };

  // 卸载音频
  const unloadSounds = async () => {
    if (accuracySoundRef.current) await accuracySoundRef.current.unloadAsync();
    if (comboSoundRef.current) await comboSoundRef.current.unloadAsync();
    if (timeSoundRef.current) await timeSoundRef.current.unloadAsync();
  };

  useEffect(() => {
    // 加载音频并等待加载完成
    const initializeAudio = async () => {
      await loadSounds();
      // 等待音频加载完成后再开始动画
      setTimeout(() => {
        startAnimations();
      }, 1000); // 给音频更多时间加载
    };
    
    // Fade in the overlay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // 开始动画的函数
    const startAnimations = () => {
      console.log('Starting progress bar animations...');
      
      // Accuracy bar (yellow) - 播放 d#6 音效
      Animated.timing(performanceAnim, {
        toValue: (scoreData.accuracy || 0) / maxAccuracyScore,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        console.log('Accuracy bar animation completed');
        playAccuracySound(); // 播放 accuracy 音效
        
        // Combo bar (green) - 播放 g#6 音效
        Animated.timing(comboAnim, {
          toValue: scoreData.combo / maxComboScore,
          duration: 1000,
          useNativeDriver: false,
        }).start(() => {
          console.log('Combo bar animation completed');
          playComboSound(); // 播放 combo 音效
          
          // Time bar (blue) - 播放 a#6 音效
          Animated.timing(timeAnim, {
            toValue: scoreData.time / maxTimeScore,
            duration: 1000,
            useNativeDriver: false,
          }).start(() => {
            console.log('Time bar animation completed');
            playTimeSound(); // 播放 time 音效
          });
        });
      });
    };

    // 初始化音频和动画
    initializeAudio();
    
    // 清理函数
    return () => {
      unloadSounds();
    };
  }, [scoreData, maxAccuracyScore, maxComboScore, maxTimeScore]);

  const renderProgressBar = (label, score, maxScore, animatedValue, color) => {
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: color,
                width: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          <View pointerEvents="none" style={styles.progressBarOverlay}>
            <Text style={[styles.progressBarText, styles.progressBarLabel]}>{label}</Text>
            <Text style={[styles.progressBarText, styles.progressBarPercentage]}>{percentage}%</Text>
            <Text style={[styles.progressBarText, styles.progressBarScore]}>{score}/{maxScore}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Level Complete! 🎉</Text>
          <Text style={styles.totalScore}>
            Score: {scoreData.total}/{scoreData.maxPossible} ({scoreData.totalPercent}%)
          </Text>
        </View>

        <View style={styles.progressBarsContainer}>
          {renderProgressBar(
            'Accuracy',
            scoreData.accuracy,
            maxAccuracyScore,
            performanceAnim,
            '#F59E0B' // Yellow
          )}
          
          {renderProgressBar(
            'Combo',
            scoreData.combo,
            maxComboScore,
            comboAnim,
            '#10B981' // Green
          )}
          
          {renderProgressBar(
            'Time',
            scoreData.time,
            maxTimeScore,
            timeAnim,
            '#EF4444' // Red
          )}
        </View>

        {/* 三个按钮 */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Ionicons name="close" size={20} color="#6B7280" />
            <Text style={styles.quitButtonText}>Quit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Ionicons name="refresh" size={20} color="#F59E0B" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  totalScore: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressBarsContainer: {
    marginBottom: 30,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 50,
    backgroundColor: '#1F2937',
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 25,
    minWidth: 0,
  },
  progressBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressBarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBarLabel: {
    fontSize: 14,
    width: '33%',
    textAlign: 'left',
  },
  progressBarPercentage: {
    fontSize: 16,
    width: '34%',
    textAlign: 'center',
  },
  progressBarScore: {
    fontSize: 14,
    fontWeight: '600',
    width: '33%',
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  quitButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  quitButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  retryButtonText: {
    color: '#D97706',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});