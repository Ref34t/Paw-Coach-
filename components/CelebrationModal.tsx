import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { playSound } from '../lib/sounds';

interface CelebrationModalProps {
  visible: boolean;
  sessionTime: string;
  commandName: string;
  streakCount: number;
  totalSessions: number;
  newAchievements?: string[];
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  sessionTime,
  commandName,
  streakCount,
  totalSessions,
  newAchievements,
  onClose,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      playSound('celebration');
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Confetti-like decorations */}
        <View style={styles.confettiContainer}>
          <Text style={styles.confetti}>🎉</Text>
          <Text style={styles.confetti}>🏆</Text>
          <Text style={styles.confetti}>⭐</Text>
          <Text style={styles.confetti}>🐾</Text>
          <Text style={styles.confetti}>🎉</Text>
        </View>

        {/* Main content */}
        <Text style={styles.celebrationText}>🎉 YOU DID IT! 🎉</Text>

        <Text style={styles.commandName}>{commandName}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{sessionTime}</Text>
            <Text style={styles.statLabel}>Session Time</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
        </View>

        {/* Achievement unlocks */}
        {newAchievements && newAchievements.length > 0 && (
          <View style={styles.achievementSection}>
            <Text style={styles.achievementTitle}>🏅 NEW ACHIEVEMENTS!</Text>
            {newAchievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Encouragement message */}
        <View style={styles.messageContainer}>
          <Text style={styles.encouragementText}>
            Amazing work! Keep it up to unlock more achievements! 🚀
          </Text>
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Continue Training</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  confettiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  confetti: {
    fontSize: 24,
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  commandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  achievementSection: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  achievementText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  messageContainer: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  encouragementText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
