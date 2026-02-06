import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useDogs } from '../../hooks/useDogs';
import { useAuth } from '../../hooks/useAuth';
import { useSchedule } from '../../hooks/useSchedule';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const DAY_LABELS: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export default function ScheduleScreen() {
  const { activeDog, isLoading: dogsLoading } = useDogs();
  const { user } = useAuth();
  const { schedules, isLoading: scheduleLoading, fetchSchedules, removeSchedule } = useSchedule(
    user?.uid || '',
    activeDog?.id || ''
  );
  const router = useRouter();

  React.useEffect(() => {
    if (user && activeDog) {
      fetchSchedules();
    }
  }, [user, activeDog]);

  const handleDeleteSchedule = (scheduleId: string, title: string) => {
    Alert.alert('Delete Schedule', `Remove "${title}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await removeSchedule(scheduleId);
        },
        style: 'destructive',
      },
    ]);
  };

  if (dogsLoading || scheduleLoading) {
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

  const renderScheduleItem = ({ item }: { item: any }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View>
          <Text style={styles.scheduleTitle}>{item.title}</Text>
          <Text style={styles.scheduleTime}>{item.time}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteSchedule(item.id, item.title)}
          style={styles.deleteScheduleButton}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.daysContainer}>
        {item.days.map((day: string) => (
          <View key={day} style={styles.dayTag}>
            <Text style={styles.dayTagText}>{DAY_LABELS[day]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{activeDog.name}'s Schedule</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/schedule/add')}
          >
            <Ionicons name="add" size={24} color={COLORS.card} />
          </TouchableOpacity>
        </View>

        {schedules.length > 0 ? (
          <FlatList
            data={schedules}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
            <Text style={styles.emptyMessage}>
              No schedules yet. Create a training schedule to get reminders! 📅
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Tips</Text>
          <Text style={styles.tipText}>• Schedule training at consistent times</Text>
          <Text style={styles.tipText}>• Short sessions (5-15 min) are most effective</Text>
          <Text style={styles.tipText}>• Training works best when your dog is alert</Text>
          <Text style={styles.tipText}>• Always end on a positive note</Text>
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
    paddingBottom: 40,
  },
  listContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scheduleTime: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  deleteScheduleButton: {
    padding: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayTag: {
    backgroundColor: COLORS.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  dayTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
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
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
