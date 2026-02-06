import { useState, useCallback } from 'react';
import { Progress } from '../types';
import { getProgress, updateCommandProgress } from '../lib/firestore';

export const useProgress = (userId: string, dogId: string) => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!userId || !dogId) return;
    setIsLoading(true);
    try {
      const data = await getProgress(userId, dogId);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, dogId]);

  const updateProgress = useCallback(
    async (commandId: string, updates: Partial<Progress>) => {
      if (!userId || !dogId) return;
      try {
        await updateCommandProgress(userId, dogId, commandId, updates);
        // Update local state
        setProgress((prev) =>
          prev.map((p) => (p.commandId === commandId ? { ...p, ...updates } : p))
        );
      } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
      }
    },
    [userId, dogId]
  );

  const getCommandProgress = useCallback(
    (commandId: string): Progress | undefined => {
      return progress.find((p) => p.commandId === commandId);
    },
    [progress]
  );

  const getStreak = useCallback((): number => {
    if (progress.length === 0) return 0;
    const lastPracticed = progress
      .map((p) => p.lastPracticed)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    if (!lastPracticed) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastPracticed.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastPracticed.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 1 ? 1 : 0;
  }, [progress]);

  return {
    progress,
    isLoading,
    fetchProgress,
    updateProgress,
    getCommandProgress,
    getStreak,
  };
};
