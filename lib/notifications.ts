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
