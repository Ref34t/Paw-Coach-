import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { getCommandById } from '../../data/trainingPrograms';
import { updateCommandProgress, updateDog } from '../../lib/firestore';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SessionScreen() {
  const { programId, dogId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const program = typeof programId === 'string' ? getCommandById(programId) : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteSession = async () => {
    if (!user || typeof dogId !== 'string' || !program) {
      Alert.alert('Error', 'Missing information');
      return;
    }

    setIsCompleting(true);
    try {
      // Update progress
      await updateCommandProgress(user.uid, dogId, program.id, {
        commandId: program.id,
        userId: user.uid,
        dogId,
        sessionsCompleted: 1,
        lastPracticed: new Date(),
        level: 'learning',
        notes: '',
      });

      Alert.alert('Great Job! 🎉', `Session completed in ${formatTime(seconds)}`, [
        {
          text: 'Done',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save session');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!program) {
    return (
      <View style={styles.container}>
        <Text>Program not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.programName}>{program.name}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <Text style={styles.timerLabel}>Elapsed Time</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionTitle}>Remember:</Text>
        {program.tips.slice(0, 2).map((tip, index) => (
          <Text key={index} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.pauseButton : styles.playButton]}
          onPress={() => setIsRunning(!isRunning)}
          disabled={isCompleting}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={24}
            color={COLORS.card}
          />
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={() => {
            setSeconds(0);
            setIsRunning(false);
          }}
          disabled={isCompleting}
        >
          <Ionicons name="refresh" size={24} color={COLORS.card} />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.completeButton, isCompleting && styles.completeButtonDisabled]}
        onPress={handleCompleteSession}
        disabled={isCompleting || seconds === 0}
      >
        {isCompleting ? (
          <ActivityIndicator color={COLORS.card} />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.card} />
            <Text style={styles.completeButtonText}>Complete Session</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={isCompleting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
  },
  programName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.card,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timerLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  playButton: {
    backgroundColor: COLORS.success,
  },
  pauseButton: {
    backgroundColor: COLORS.warning,
  },
  resetButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 14,
  },
});
