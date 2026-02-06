import { useMemo } from 'react';
import { Progress } from '../types';
import {
  generateRecommendations,
  getAchievementProgress,
  getTrainingInsights,
  RecommendationItem,
} from '../lib/recommendations';

interface RecommendationsData {
  topRecommendations: RecommendationItem[];
  achievementProgress: ReturnType<typeof getAchievementProgress>;
  insights: string[];
  hasRecommendations: boolean;
}

export const useRecommendations = (
  progress: Progress[],
  totalSessions: number,
  streak: number
): RecommendationsData => {
  const topRecommendations = useMemo(
    () => generateRecommendations(progress, totalSessions),
    [progress, totalSessions]
  );

  const achievementProgress = useMemo(
    () => getAchievementProgress(progress, totalSessions, streak),
    [progress, totalSessions, streak]
  );

  const insights = useMemo(
    () => getTrainingInsights(progress, totalSessions),
    [progress, totalSessions]
  );

  return {
    topRecommendations,
    achievementProgress,
    insights,
    hasRecommendations: topRecommendations.length > 0,
  };
};
