import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useDogs } from '../../hooks/useDogs';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleScreen() {
  const { activeDog, isLoading } = useDogs();
  const router = useRouter();

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
        <Text style={styles.emptyText}>No dog selected</Text>
      </View>
    );
  }

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
          <Text style={styles.emptyMessage}>
            No schedules yet. Create a training schedule to get reminders! 📅
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tips</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
