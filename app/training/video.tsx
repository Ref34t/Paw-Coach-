import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getVideoTutorial } from '../../data/videoTutorials';
import { getCommandById } from '../../data/trainingPrograms';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function VideoScreen() {
  const { commandId } = useLocalSearchParams();
  const router = useRouter();
  const video = typeof commandId === 'string' ? getVideoTutorial(commandId) : null;
  const command = typeof commandId === 'string' ? getCommandById(commandId) : null;

  if (!video || !command) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video not found</Text>
      </View>
    );
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;

  const handlePlayVideo = async () => {
    try {
      await Linking.openURL(youtubeUrl);
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Video Thumbnail & Play Button */}
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={handlePlayVideo}
          activeOpacity={0.8}
        >
          <View style={styles.thumbnail}>
            <Text style={styles.playIcon}>▶️</Text>
            <Text style={styles.durationBadge}>{video.duration}</Text>
          </View>
        </TouchableOpacity>

        {/* Video Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{video.title}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color={COLORS.primary} />
              <Text style={styles.statText}>{(video.views / 1000000).toFixed(1)}M views</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.statText}>{video.rating} rating</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={COLORS.secondary} />
              <Text style={styles.statText}>{video.duration}</Text>
            </View>
          </View>

          <View style={styles.instructorContainer}>
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>{video.instructor}</Text>
            </View>
          </View>
        </View>

        {/* Command Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About {command.name}</Text>
          <Text style={styles.description}>{command.description}</Text>

          <View style={styles.commandStats}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statLabel}>Est. Time</Text>
              <Text style={styles.statValue}>{command.estimatedMinutes}min</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{command.difficulty}/3</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statLabel}>Category</Text>
              <Text style={styles.statValue}>{command.category}</Text>
            </View>
          </View>
        </View>

        {/* Video Description */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Video Description</Text>
          <Text style={styles.videoDescription}>{video.description}</Text>
        </View>

        {/* Steps Overview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Training Steps</Text>
          {command.steps.slice(0, 3).map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          {command.steps.length > 3 && (
            <Text style={styles.seeMore}>+{command.steps.length - 3} more steps</Text>
          )}
        </View>

        {/* Tips */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
          {command.tips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>
              • {tip}
            </Text>
          ))}
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.primaryButton} onPress={handlePlayVideo}>
          <Ionicons name="play-circle" size={24} color={COLORS.card} />
          <Text style={styles.primaryButtonText}>Watch Full Video on YouTube</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push(`/training/${commandId}`)}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Back to Training</Text>
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
  videoContainer: {
    width: '100%',
    backgroundColor: COLORS.card,
    paddingBottom: 0,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playIcon: {
    fontSize: 60,
    opacity: 0.9,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.card,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  commandStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  videoDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  seeMore: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 40,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  primaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
