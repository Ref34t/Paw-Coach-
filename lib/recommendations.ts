import { Command, Progress } from '../types';
import { TRAINING_PROGRAMS } from '../data/trainingPrograms';

export interface RecommendationItem {
  command: Command;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  score: number;
  icon: string;
}

/**
 * Generate personalized training recommendations based on dog's progress
 */
export const generateRecommendations = (
  progress: Progress[],
  totalSessions: number
): RecommendationItem[] => {
  const recommendations: RecommendationItem[] = [];

  // Group commands by status
  const notStarted = progress.filter((p) => p.level === 'not_started');
  const learning = progress.filter((p) => p.level === 'learning');
  const practicing = progress.filter((p) => p.level === 'practicing');
  const mastered = progress.filter((p) => p.level === 'mastered');

  // Rule 1: Finish learning commands (high priority)
  if (learning.length > 0) {
    learning.forEach((p) => {
      const command = TRAINING_PROGRAMS.find((c) => c.id === p.commandId);
      if (command) {
        recommendations.push({
          command,
          reason: `You're almost there! Keep training "${command.name}" to master it.`,
          priority: 'high',
          score: 90 - p.sessionsCompleted * 5, // Boost early in learning
          icon: '🎓',
        });
      }
    });
  }

  // Rule 2: Reinforce practicing commands
  if (practicing.length > 0) {
    practicing.forEach((p) => {
      const command = TRAINING_PROGRAMS.find((c) => c.id === p.commandId);
      if (command) {
        recommendations.push({
          command,
          reason: `Great progress! A few more sessions will master "${command.name}".`,
          priority: 'medium',
          score: 70 - p.sessionsCompleted,
          icon: '✨',
        });
      }
    });
  }

  // Rule 3: Suggest next not-started command based on difficulty progression
  if (notStarted.length > 0 && mastered.length > 0) {
    // Find next difficulty level to master
    const masteredDifficulties = mastered
      .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId)?.difficulty || 0)
      .filter((d) => d > 0);

    const maxDifficulty = Math.max(...masteredDifficulties);
    const nextDifficulty = Math.min(maxDifficulty + 1, 3);

    const nextCommand = notStarted
      .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId))
      .filter((c) => c && c.difficulty <= nextDifficulty)
      .sort((a, b) => (a?.difficulty || 0) - (b?.difficulty || 0))[0];

    if (nextCommand) {
      recommendations.push({
        command: nextCommand,
        reason: `Time to level up! Try "${nextCommand.name}" to expand your dog's skills.`,
        priority: 'high',
        score: 85,
        icon: '🚀',
      });
    }
  }

  // Rule 4: If few commands started, recommend starting from basics
  if (mastered.length === 0 && learning.length === 0 && notStarted.length > 0) {
    const basicCommand = notStarted
      .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId))
      .filter((c) => c && c.difficulty === 1)
      .sort((a, b) => (a?.difficulty || 0) - (b?.difficulty || 0))[0];

    if (basicCommand) {
      recommendations.push({
        command: basicCommand,
        reason: `Perfect starting point! "${basicCommand.name}" is an essential command.`,
        priority: 'high',
        score: 95,
        icon: '🐾',
      });
    }
  }

  // Rule 5: Suggest commands from different categories (variety)
  if (mastered.length >= 3) {
    const masteredCategories = mastered
      .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId)?.category)
      .filter((cat) => cat !== undefined);

    const categories = ['basic', 'manners', 'advanced'];
    for (const category of categories) {
      if (!masteredCategories.includes(category)) {
        const categoryCommand = notStarted
          .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId))
          .filter((c) => c && c.category === category)[0];

        if (categoryCommand) {
          recommendations.push({
            command: categoryCommand,
            reason: `Diversify! Try a ${category} command like "${categoryCommand.name}".`,
            priority: 'medium',
            score: 75,
            icon: '🎯',
          });
        }
      }
    }
  }

  // Rule 6: Streak maintenance - suggest quick command if on streak
  if (totalSessions > 0 && totalSessions % 5 === 0) {
    const quickCommand = mastered
      .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId))
      .filter((c) => c && c.estimatedMinutes <= 10)[0];

    if (quickCommand) {
      recommendations.push({
        command: quickCommand,
        reason: `Keep the streak alive! Do a quick "${quickCommand.name}" session.`,
        priority: 'high',
        score: 80,
        icon: '🔥',
      });
    }
  }

  // Sort by priority and score
  recommendations.sort((a, b) => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    const priorityDiff =
      priorityScore[b.priority] - priorityScore[a.priority];
    return priorityDiff !== 0 ? priorityDiff : b.score - a.score;
  });

  // Remove duplicates (keep highest scoring)
  const unique = new Map<string, RecommendationItem>();
  recommendations.forEach((rec) => {
    const key = rec.command.id;
    if (!unique.has(key) || unique.get(key)!.score < rec.score) {
      unique.set(key, rec);
    }
  });

  return Array.from(unique.values()).slice(0, 5); // Return top 5 recommendations
};

/**
 * Get achievement progress recommendations
 */
export const getAchievementProgress = (
  progress: Progress[],
  totalSessions: number,
  streak: number
) => {
  const achievements = [
    {
      name: 'Week Warrior',
      current: streak,
      target: 7,
      icon: '🔥',
      description: 'Train for 7 consecutive days',
    },
    {
      name: 'Month Master',
      current: streak,
      target: 30,
      icon: '⭐',
      description: 'Train for 30 consecutive days',
    },
    {
      name: 'Centennial',
      current: totalSessions,
      target: 100,
      icon: '💯',
      description: 'Complete 100 training sessions',
    },
    {
      name: 'Command Expert',
      current: progress.filter((p) => p.level === 'mastered').length,
      target: 5,
      icon: '🎓',
      description: 'Master 5 different commands',
    },
  ];

  return achievements.map((ach) => ({
    ...ach,
    progress: Math.min((ach.current / ach.target) * 100, 100),
    remaining: Math.max(ach.target - ach.current, 0),
  }));
};

/**
 * Get insights about training patterns
 */
export const getTrainingInsights = (
  progress: Progress[],
  totalSessions: number
): string[] => {
  const insights: string[] = [];

  const mastered = progress.filter((p) => p.level === 'mastered').length;
  const learning = progress.filter((p) => p.level === 'learning').length;

  // Insight 1: Command mastery rate
  if (mastered > 0) {
    const masteryRate = ((mastered / progress.length) * 100).toFixed(0);
    insights.push(
      `🏆 You've mastered ${mastered} commands (${masteryRate}% mastery rate)!`
    );
  }

  // Insight 2: Learning momentum
  if (learning > 0 && learning > mastered) {
    insights.push(
      `📈 Great momentum! You're actively learning ${learning} commands. Keep it up!`
    );
  }

  // Insight 3: Session efficiency
  if (totalSessions > 0) {
    const sessionsPerCommand = (totalSessions / progress.length).toFixed(1);
    insights.push(
      `⚡ Average ${sessionsPerCommand} sessions per command. You're an efficient trainer!`
    );
  }

  // Insight 4: Next milestone
  if (mastered === 5) {
    insights.push(`🌟 You've reached 5 mastered commands! Advanced training awaits.`);
  }

  if (totalSessions === 50) {
    insights.push(`💪 50 sessions complete! You're a dedicated trainer.`);
  }

  // Insight 5: Category balance
  const categories = progress
    .map((p) => TRAINING_PROGRAMS.find((c) => c.id === p.commandId)?.category)
    .filter((c) => c !== undefined);

  const basicCount = categories.filter((c) => c === 'basic').length;
  const mannersCount = categories.filter((c) => c === 'manners').length;
  const advancedCount = categories.filter((c) => c === 'advanced').length;

  if (basicCount > 0 && mannersCount === 0) {
    insights.push(`🎯 Next step: Try some manners commands like "Leave It"`);
  }

  if (basicCount > 0 && mannersCount > 0 && advancedCount === 0) {
    insights.push(`🚀 Ready for advanced commands? Try "Shake" or "Spin"`);
  }

  return insights;
};
