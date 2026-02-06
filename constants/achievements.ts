import { AchievementDefinition } from '../types';

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  first_training: {
    id: 'first_training',
    name: 'First Step',
    description: 'Complete your first training session',
    icon: '🐾',
    condition: 'sessionsCompleted >= 1',
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day training streak',
    icon: '🔥',
    condition: 'streak >= 7',
  },
  month_master: {
    id: 'month_master',
    name: 'Month Master',
    description: 'Maintain a 30-day training streak',
    icon: '⭐',
    condition: 'streak >= 30',
  },
  command_expert: {
    id: 'command_expert',
    name: 'Command Expert',
    description: 'Master 5 different commands',
    icon: '🎓',
    condition: 'masteredCommands >= 5',
  },
  all_master: {
    id: 'all_master',
    name: 'All Master',
    description: 'Master all basic commands',
    icon: '👑',
    condition: 'allBasicMastered',
  },
  multi_dog: {
    id: 'multi_dog',
    name: 'Pack Leader',
    description: 'Train 3 or more dogs',
    icon: '🐕‍🦺',
    condition: 'dogsCount >= 3',
  },
  hundred_sessions: {
    id: 'hundred_sessions',
    name: 'Centennial',
    description: 'Complete 100 training sessions',
    icon: '💯',
    condition: 'sessionsCompleted >= 100',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Train every day for a week',
    icon: '✨',
    condition: 'perfectWeek',
  },
};
