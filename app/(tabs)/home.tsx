import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useDogs } from '../../hooks/useDogs';
import { useProgress } from '../../hooks/useProgress';
import { useRecommendations } from '../../hooks/useRecommendations';
import { COLORS } from '../../constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
  const { userData, user } = useAuth();
  const { activeDog, isLoading } = useDogs();
  const { progress, fetchProgress } = useProgress(user?.uid || '', activeDog?.id || '');
  const { topRecommendations } = useRecommendations(
    progress,
    activeDog?.totalSessionsCompleted || 0,
    activeDog?.currentStreak || 0
  );
  const router = useRouter();

  React.useEffect(() => {
    if (user && activeDog) {
      fetchProgress();
    }
  }, [user, activeDog]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!activeDog) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.welcomeText}>Welcome, {userData?.displayName}!</Text>
          <Text style={styles.emptyText}>No dogs yet. Let's add your first dog!</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/dogs/add')}
          >
            <Text style={styles.buttonText}>Add Your First Dog</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, {userData?.displayName}!</Text>

        <View style={styles.dogCard}>
          <Text style={styles.dogName}>{activeDog.name}</Text>
          <Text style={styles.dogInfo}>{activeDog.breed} • {activeDog.age} months</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{activeDog.currentStreak}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValue}>{activeDog.totalSessionsCompleted}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Text style={styles.statValue}>{activeDog.longestStreak}</Text>
            </View>
          </View>
        </View>

        {topRecommendations.length > 0 && (
          <View style={styles.recommendationSection}>
            <Text style={styles.sectionTitle}>🤖 AI Recommendation</Text>
            <TouchableOpacity
              style={styles.recommendationCard}
              onPress={() => router.push(`/training/${topRecommendations[0].command.id}`)}
            >
              <View>
                <Text style={styles.recommendationIcon}>
                  {topRecommendations[0].icon}
                </Text>
                <Text style={styles.recommendationName}>
                  {topRecommendations[0].command.name}
                </Text>
                <Text style={styles.recommendationReason}>
                  {topRecommendations[0].reason}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)/training')}
        >
          <Text style={styles.buttonText}>Start Training 🎓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(tabs)/recommendations')}
        >
          <Text style={styles.secondaryButtonText}>View AI Recommendations</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 30,
    textAlign: 'center',
  },
  recommendationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 13,
    color: COLORS.darkGray,
    lineHeight: 18,
  },
  dogCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dogName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dogInfo: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 4,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
