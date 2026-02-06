import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useDogs } from '../../hooks/useDogs';
import { useSchedule } from '../../hooks/useSchedule';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddScheduleScreen() {
  const router = useRouter();
  const { scheduleId } = useLocalSearchParams();
  const { user } = useAuth();
  const { activeDog } = useDogs();
  const { createSchedule, editSchedule, schedules } = useSchedule(user?.uid || '', activeDog?.id || '');

  const [title, setTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'wed', 'fri']);
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [isLoading, setIsLoading] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    if (!user || !activeDog) {
      Alert.alert('Error', 'User or dog not found');
      return;
    }

    setIsLoading(true);
    try {
      const scheduleData = {
        userId: user.uid,
        dogId: activeDog.id,
        title,
        days: selectedDays,
        time: `${hour}:${minute}`,
        enabled: true,
        notificationId: null,
        programId: null,
      };

      await createSchedule(scheduleData);
      Alert.alert('Success', 'Schedule created!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create schedule');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Training Schedule</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{title || 'E.g., Morning Training'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Select Days</Text>
          <View style={styles.daysGrid}>
            {DAYS.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonActive,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextActive,
                  ]}
                >
                  {DAY_LABELS[index]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>{hour}</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>{minute}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Quick Tips</Text>
          <Text style={styles.tip}>✓ Choose consistent times for best results</Text>
          <Text style={styles.tip}>✓ Morning sessions often work best</Text>
          <Text style={styles.tip}>✓ Enable notifications to stay on track</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.card} />
          ) : (
            <>
              <Ionicons name="save" size={20} color={COLORS.card} />
              <Text style={styles.buttonText}>Create Schedule</Text>
            </>
          )}
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
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dayButtonTextActive: {
    color: COLORS.card,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tip: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
