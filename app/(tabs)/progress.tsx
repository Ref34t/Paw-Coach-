import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useDogs } from '../../hooks/useDogs';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { StreakCounter } from '../../components/StreakCounter';
import { AchievementBadge } from '../../components/AchievementBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { TRAINING_PROGRAMS } from '../../data/trainingPrograms';

export default function ProgressScreen() {
  const { activeDog, isLoading: dogsLoading } = useDogs();
  const { user } = useAuth();
  const { progress, isLoading: progressLoading, fetchProgress } = useProgress(
    user?.uid || '',
    activeDog?.id || ''
  );

  React.useEffect(() => {
    if (user && activeDog) {
      fetchProgress();
    }
  }, [user, activeDog]);

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

  const masteredCount = progress.filter((p) => p.level === 'mastered').length;
  const learningCount = progress.filter((p) => p.level === 'learning').length;
  const masteryPercentage = (masteredCount / TRAINING_PROGRAMS.length) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{activeDog.name}'s Progress</Text>

        <View style={styles.streakSection}>
          <StreakCounter count={activeDog.currentStreak} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overall Mastery</Text>
          <ProgressBar
            progress={masteryPercentage}
            label={`${masteredCount} of ${TRAINING_PROGRAMS.length} commands mastered`}
          />
          <View style={styles.masteryStats}>
            <View style={styles.masteryStat}>
              <Text style={styles.masteryLabel}>Learning</Text>
              <Text style={styles.masteryValue}>{learningCount}</Text>
            </View>
            <View style={styles.masteryStat}>
              <Text style={styles.masteryLabel}>Mastered</Text>
              <Text style={styles.masteryValue}>{masteredCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Training History</Text>
          <Text style={styles.historyText}>
            Total Sessions: {activeDog.totalSessionsCompleted}
          </Text>
          {activeDog.lastTrainingDate && (
            <Text style={styles.historyText}>
              Last Trained: {new Date(activeDog.lastTrainingDate).toLocaleDateString()}
            </Text>
          )}
          <Text style={styles.historyText}>
            Best Streak: {activeDog.longestStreak} days
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Achievements 🏆</Text>
          <View style={styles.achievementGrid}>
            {Object.values(ACHIEVEMENTS).map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <AchievementBadge
                  icon={achievement.icon}
                  name={achievement.name}
                  description={achievement.description}
                  unlocked={false}
                />
              </View>
            ))}
          </View>
          {Object.keys(ACHIEVEMENTS).length === 0 && (
            <Text style={styles.emptyMessage}>Keep training to unlock achievements! 🎉</Text>
          )}
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
    marginBottom: 20,
  },
  streakSection: {
    alignItems: 'center',
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
  masteryStats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  masteryStat: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  masteryLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  masteryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  historyText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    width: '48%',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
});
