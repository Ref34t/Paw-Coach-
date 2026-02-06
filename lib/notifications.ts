import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const initializeNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission to receive notifications was denied');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

export const scheduleDailyNotification = async (
  title: string,
  body: string,
  time: string, // "HH:MM" format
  days: string[] // ['mon', 'tue', 'wed', ...]
): Promise<string> => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        badge: 1,
      },
      trigger: {
        type: 'daily',
        hour: hours,
        minute: minutes,
      },
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

export const cancelNotification = async (identifier: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

export const sendLocalNotification = async (title: string, body: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        badge: 1,
      },
      trigger: {
        seconds: 2,
      },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const scheduleTrainingReminder = async (
  dogName: string,
  time: string, // "HH:MM" format
  days: string[], // ['mon', 'tue', 'wed', ...]
  activity: string // e.g., "Sit Training", "Fetch Session"
): Promise<string> => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${dogName}'s Training Time! 🐾`,
        body: `Time for ${activity}! Let's make it a great session!`,
        badge: 1,
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour: hours,
        minute: minutes,
      },
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling training reminder:', error);
    throw error;
  }
};

export const scheduleStreakAlert = async (dogName: string): Promise<string> => {
  try {
    // Schedule for 8 PM each day
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Don't Break the Streak! 🔥`,
        body: `${dogName} is counting on you! Complete one quick training session today to keep the streak alive.`,
        badge: 1,
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour: 20,
        minute: 0,
      },
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling streak alert:', error);
    throw error;
  }
};

export const sendAchievementNotification = async (
  achievementName: string,
  dogName: string
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Achievement Unlocked! 🏆`,
        body: `${dogName} earned "${achievementName}"! Incredible progress!`,
        badge: 1,
        sound: true,
      },
      trigger: {
        seconds: 1,
      },
    });
  } catch (error) {
    console.error('Error sending achievement notification:', error);
    throw error;
  }
};

export const sendMilestoneNotification = async (
  milestone: number,
  type: 'sessions' | 'streak' | 'commands',
  dogName: string
): Promise<void> => {
  try {
    const milestoneText = {
      sessions: `${milestone} training sessions completed!`,
      streak: `${milestone}-day streak reached!`,
      commands: `${milestone} commands mastered!`,
    };

    const emoji = {
      sessions: '💪',
      streak: '🔥',
      commands: '⭐',
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Milestone Reached! ${emoji[type]}`,
        body: `${dogName} has ${milestoneText[type]} Amazing work!`,
        badge: 1,
        sound: true,
      },
      trigger: {
        seconds: 1,
      },
    });
  } catch (error) {
    console.error('Error sending milestone notification:', error);
    throw error;
  }
};
