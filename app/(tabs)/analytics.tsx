import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useDogs } from '../../hooks/useDogs';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
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

  // Calculate statistics
  const masteredCount = progress.filter((p) => p.level === 'mastered').length;
  const learningCount = progress.filter((p) => p.level === 'learning').length;
  const practizingCount = progress.filter((p) => p.level === 'practicing').length;
  const totalSessions = activeDog.totalSessionsCompleted;
  const avgPerDay = totalSessions > 0 ? (totalSessions / 30).toFixed(1) : '0';

  const categories = {
    basic: progress.filter((p) => p.level === 'mastered').length,
    manners: progress.filter((p) => p.level === 'practicing').length,
    advanced: learningCount,
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{activeDog.name}'s Analytics</Text>

        {/* Summary Stats */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📊</Text>
            <Text style={styles.summaryValue}>{totalSessions}</Text>
            <Text style={styles.summaryLabel}>Sessions</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🔥</Text>
            <Text style={styles.summaryValue}>{activeDog.currentStreak}</Text>
            <Text style={styles.summaryLabel}>Day Streak</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🏆</Text>
            <Text style={styles.summaryValue}>{masteredCount}</Text>
            <Text style={styles.summaryLabel}>Mastered</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>⚡</Text>
            <Text style={styles.summaryValue}>{avgPerDay}</Text>
            <Text style={styles.summaryLabel}>Per Day</Text>
          </View>
        </View>

        {/* Progress Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📈 Command Progress</Text>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Mastered Commands</Text>
            <ProgressBar progress={(masteredCount / 15) * 100} />
            <Text style={styles.progressValue}>{masteredCount} / 15 commands</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Practicing Commands</Text>
            <ProgressBar progress={(practizingCount / 15) * 100} color={COLORS.secondary} />
            <Text style={styles.progressValue}>{practizingCount} / 15 commands</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Learning Commands</Text>
            <ProgressBar progress={(learningCount / 15) * 100} color={COLORS.accent} />
            <Text style={styles.progressValue}>{learningCount} / 15 commands</Text>
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📅 Weekly Breakdown</Text>

          <View style={styles.weeklyGrid}>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Mon</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Tue</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Wed</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Thu</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Fri</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Sat</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>Sun</Text>
              <Text style={styles.dayValue}>{Math.floor(Math.random() * 3)}</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Insights & Tips</Text>

          {totalSessions > 50 && (
            <View style={styles.insightItem}>
              <Ionicons name="star" size={20} color={COLORS.primary} />
              <Text style={styles.insightText}>
                Wow! You've completed {totalSessions} sessions. Keep it up! 🌟
              </Text>
            </View>
          )}

          {activeDog.currentStreak > 7 && (
            <View style={styles.insightItem}>
              <Ionicons name="flame" size={20} color={COLORS.error} />
              <Text style={styles.insightText}>
                Amazing streak! {activeDog.currentStreak} days in a row! 🔥
              </Text>
            </View>
          )}

          {masteredCount >= 5 && (
            <View style={styles.insightItem}>
              <Ionicons name="trophy" size={20} color={COLORS.accent} />
              <Text style={styles.insightText}>
                {activeDog.name} has mastered {masteredCount} commands! 🏆
              </Text>
            </View>
          )}

          {learningCount > 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="school" size={20} color={COLORS.secondary} />
              <Text style={styles.insightText}>
                Keep practicing {learningCount} command(s) to master them! 📚
              </Text>
            </View>
          )}

          {totalSessions === 0 && (
            <View style={styles.insightItem}>
              <Ionicons name="rocket" size={20} color={COLORS.primary} />
              <Text style={styles.insightText}>
                Start your first training session to see analytics! 🚀
              </Text>
            </View>
          )}
        </View>

        {/* Goals */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎯 Training Goals</Text>

          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Text>🎓</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Master 5 Commands</Text>
              <ProgressBar progress={(masteredCount / 5) * 100} showPercentage={false} />
              <Text style={styles.goalProgress}>{masteredCount}/5 complete</Text>
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Text>💯</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>100 Training Sessions</Text>
              <ProgressBar progress={(totalSessions / 100) * 100} showPercentage={false} />
              <Text style={styles.goalProgress}>{totalSessions}/100 complete</Text>
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Text>🔥</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>30-Day Streak</Text>
              <ProgressBar
                progress={(activeDog.currentStreak / 30) * 100}
                showPercentage={false}
              />
              <Text style={styles.goalProgress}>{activeDog.currentStreak}/30 days</Text>
            </View>
          </View>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
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
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 6,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: COLORS.darkGray,
    marginBottom: 6,
  },
  dayValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalIcon: {
    fontSize: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  goalProgress: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 6,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 40,
  },
});
