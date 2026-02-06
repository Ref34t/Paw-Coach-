export type User = {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  activeDogId: string | null;
};

export type Dog = {
  id: string;
  userId: string;
  name: string;
  breed: string;
  age: number;
  photoUrl: string | null;
  createdAt: Date;
  totalSessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: Date | null;
};

export type Command = {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'manners' | 'advanced';
  difficulty: 1 | 2 | 3;
  estimatedMinutes: number;
  steps: string[];
  tips: string[];
  commonMistakes: string[];
};

export type Progress = {
  id: string;
  userId: string;
  dogId: string;
  commandId: string;
  level: 'not_started' | 'learning' | 'practicing' | 'mastered';
  sessionsCompleted: number;
  lastPracticed: Date | null;
  notes: string;
};

export type Schedule = {
  id: string;
  userId: string;
  dogId: string;
  title: string;
  days: string[];
  time: string;
  enabled: boolean;
  notificationId: string | null;
  programId: string | null;
};

export type Achievement = {
  id: string;
  userId: string;
  dogId: string;
  achievementId: string;
  unlockedAt: Date;
};

export type AchievementDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
};
