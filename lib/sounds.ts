import { Audio } from 'expo-av';

let soundObjects: Record<string, Audio.Sound> = {};

const SOUND_URLS = {
  achievement: require('../assets/sounds/achievement.mp3'),
  success: require('../assets/sounds/success.mp3'),
  unlock: require('../assets/sounds/unlock.mp3'),
  streak: require('../assets/sounds/streak.mp3'),
  celebration: require('../assets/sounds/celebration.mp3'),
};

/**
 * Initialize audio for the app
 */
export const initializeAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

/**
 * Load a sound file
 */
const loadSound = async (soundKey: string) => {
  try {
    if (!soundObjects[soundKey]) {
      const { sound } = await Audio.Sound.createAsync(
        SOUND_URLS[soundKey as keyof typeof SOUND_URLS]
      );
      soundObjects[soundKey] = sound;
    }
    return soundObjects[soundKey];
  } catch (error) {
    console.error(`Error loading sound ${soundKey}:`, error);
    return null;
  }
};

/**
 * Play a sound effect
 */
export const playSound = async (soundKey: 'achievement' | 'success' | 'unlock' | 'streak' | 'celebration') => {
  try {
    const sound = await loadSound(soundKey);
    if (sound) {
      // Reset position if already playing
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch (error) {
    console.error(`Error playing sound ${soundKey}:`, error);
  }
};

/**
 * Stop all sounds
 */
export const stopAllSounds = async () => {
  try {
    for (const sound of Object.values(soundObjects)) {
      if (sound) {
        await sound.stopAsync();
      }
    }
  } catch (error) {
    console.error('Error stopping sounds:', error);
  }
};

/**
 * Unload all sounds
 */
export const unloadAllSounds = async () => {
  try {
    for (const sound of Object.values(soundObjects)) {
      if (sound) {
        await sound.unloadAsync();
      }
    }
    soundObjects = {};
  } catch (error) {
    console.error('Error unloading sounds:', error);
  }
};
