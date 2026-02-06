import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCommandById } from '../../data/trainingPrograms';
import { getVideoTutorial } from '../../data/videoTutorials';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useDogs } from '../../hooks/useDogs';

export default function ProgramDetailScreen() {
  const { programId } = useLocalSearchParams();
  const router = useRouter();
  const { activeDog } = useDogs();
  const program = typeof programId === 'string' ? getCommandById(programId) : null;

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Program not found</Text>
      </View>
    );
  }

  const video = typeof programId === 'string' ? getVideoTutorial(programId) : null;

  const startSession = () => {
    if (!activeDog) {
      return;
    }
    router.push({
      pathname: '/training/session',
      params: { programId: program.id, dogId: activeDog.id },
    });
  };

  const watchVideo = () => {
    router.push({
      pathname: '/training/video',
      params: { commandId: program.id },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{program.name}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {'⭐'.repeat(program.difficulty)} Difficulty {program.difficulty}/3
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>{program.description}</Text>
          <Text style={styles.time}>⏱ {program.estimatedMinutes} minutes</Text>
        </View>

        {video && (
          <View style={styles.videoCard}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoTitle}>📹 Video Tutorial Available</Text>
              <Text style={styles.videoInstructor}>{video.instructor}</Text>
            </View>
            <Text style={styles.videoDescription}>{video.description}</Text>
            <TouchableOpacity style={styles.videoButton} onPress={watchVideo}>
              <Ionicons name="play-circle" size={20} color={COLORS.card} />
              <Text style={styles.videoButtonText}>Watch Video ({video.duration})</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <FlatList
            data={program.steps}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{item}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
          {program.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipText}>• {tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>⚠️ Common Mistakes</Text>
          {program.commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeItem}>
              <Text style={styles.mistakeText}>• {mistake}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startSession}>
          <Ionicons name="play-circle" size={24} color={COLORS.card} />
          <Text style={styles.startButtonText}>Start Training Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.card,
    marginBottom: 12,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  difficultyText: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.card,
    margin: 12,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  videoCard: {
    backgroundColor: COLORS.secondary,
    margin: 12,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  videoHeader: {
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.card,
    marginBottom: 4,
  },
  videoInstructor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  videoDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 12,
  },
  videoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  time: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: COLORS.card,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  mistakeItem: {
    marginBottom: 8,
  },
  mistakeText: {
    fontSize: 14,
    color: COLORS.error,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: COLORS.success,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  startButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 40,
  },
});
