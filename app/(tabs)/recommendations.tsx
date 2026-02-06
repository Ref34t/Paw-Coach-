import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useDogs } from '../../hooks/useDogs';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useRecommendations } from '../../hooks/useRecommendations';
import { RecommendationCard } from '../../components/RecommendationCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Ionicons } from '@expo/vector-icons';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { activeDog, isLoading: dogsLoading } = useDogs();
  const { user } = useAuth();
  const { progress, isLoading: progressLoading, fetchProgress } = useProgress(
    user?.uid || '',
    activeDog?.id || ''
  );

  useEffect(() => {
    if (user && activeDog) {
      fetchProgress();
    }
  }, [user, activeDog]);

  const { topRecommendations, achievementProgress, insights, hasRecommendations } =
    useRecommendations(
      progress,
      activeDog?.totalSessionsCompleted || 0,
      activeDog?.currentStreak || 0
    );

  if (dogsLoading || progressLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!activeDog) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No dog selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Personalized Recommendations</Text>
        <Text style={styles.subtitle}>
          AI-powered suggestions for {activeDog.name}
        </Text>

        {/* Insights Section */}
        {insights.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📊 Your Progress Insights</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations Section */}
        {hasRecommendations ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🎯 What to Train Next</Text>
            </View>
            <View style={styles.recommendationsContainer}>
              {topRecommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  icon={rec.icon}
                  commandName={rec.command.name}
                  reason={rec.reason}
                  difficulty={rec.command.difficulty}
                  priority={rec.priority}
                  onPress={() => router.push(`/training/${rec.command.id}`)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.emptyMessage}>
              Start training to get personalized recommendations! 🚀
            </Text>
          </View>
        )}

        {/* Achievement Progress Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🏆 Achievement Progress</Text>
          {achievementProgress.map((achievement, index) => (
            <View key={index} style={styles.achievementProgress}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
              <ProgressBar
                progress={achievement.progress}
                label={`${achievement.current}/${achievement.target}`}
                showPercentage={false}
              />
              {achievement.remaining > 0 && (
                <Text style={styles.remaining}>
                  {achievement.remaining} more to go!
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Training Tips Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Smart Training Tips</Text>
          <Text style={styles.tip}>
            ✓ Train the recommended commands first - they're optimized for{' '}
            {activeDog.name}'s progress level
          </Text>
          <Text style={styles.tip}>
            ✓ Mix easy and challenging commands to keep {activeDog.name}
            engaged
          </Text>
          <Text style={styles.tip}>
            ✓ Focus on "High Priority" recommendations to make the fastest
            progress
          </Text>
          <Text style={styles.tip}>
            ✓ Maintain your streak by training at least one command daily
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  recommendationsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 10,
    paddingLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  achievementProgress: {
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  achievementDesc: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  remaining: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  tip: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 40,
  },
});
