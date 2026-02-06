import { useState, useCallback } from 'react';
import { Schedule } from '../types';
import { getSchedules, addSchedule, updateSchedule, deleteSchedule } from '../lib/firestore';

export const useSchedule = (userId: string, dogId: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!userId || !dogId) return;
    setIsLoading(true);
    try {
      const data = await getSchedules(userId, dogId);
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, dogId]);

  const createSchedule = useCallback(
    async (scheduleData: Omit<Schedule, 'id'>) => {
      if (!userId) return;
      try {
        const id = await addSchedule(userId, scheduleData);
        setSchedules((prev) => [...prev, { ...scheduleData, id }]);
        return id;
      } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
      }
    },
    [userId]
  );

  const editSchedule = useCallback(
    async (scheduleId: string, updates: Partial<Schedule>) => {
      if (!userId) return;
      try {
        await updateSchedule(userId, scheduleId, updates);
        setSchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, ...updates } : s))
        );
      } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
      }
    },
    [userId]
  );

  const removeSchedule = useCallback(
    async (scheduleId: string) => {
      if (!userId) return;
      try {
        await deleteSchedule(userId, scheduleId);
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
        throw error;
      }
    },
    [userId]
  );

  return {
    schedules,
    isLoading,
    fetchSchedules,
    createSchedule,
    editSchedule,
    removeSchedule,
  };
};
