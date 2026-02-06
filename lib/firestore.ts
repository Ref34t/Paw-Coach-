import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';
import { db } from './firebase';
import { Dog, Progress, Schedule, Achievement } from '../types';

// ===== DOGS =====
export const getDogs = async (userId: string): Promise<Dog[]> => {
  try {
    const dogsRef = collection(db, 'users', userId, 'dogs') as CollectionReference<Dog>;
    const snapshot = await getDocs(dogsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return [];
  }
};

export const getDog = async (userId: string, dogId: string): Promise<Dog | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'dogs', dogId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Dog) : null;
  } catch (error) {
    console.error('Error fetching dog:', error);
    return null;
  }
};

export const addDog = async (userId: string, dogData: Omit<Dog, 'id'>): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'users', userId, 'dogs'));
    await setDoc(docRef, dogData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding dog:', error);
    throw error;
  }
};

export const updateDog = async (userId: string, dogId: string, updates: Partial<Dog>) => {
  try {
    const docRef = doc(db, 'users', userId, 'dogs', dogId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating dog:', error);
    throw error;
  }
};

export const deleteDog = async (userId: string, dogId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'dogs', dogId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting dog:', error);
    throw error;
  }
};

// ===== PROGRESS =====
export const getProgress = async (userId: string, dogId: string): Promise<Progress[]> => {
  try {
    const progressRef = collection(db, 'users', userId, 'dogs', dogId, 'progress') as CollectionReference<Progress>;
    const snapshot = await getDocs(progressRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching progress:', error);
    return [];
  }
};

export const getCommandProgress = async (
  userId: string,
  dogId: string,
  commandId: string
): Promise<Progress | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'dogs', dogId, 'progress', commandId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Progress) : null;
  } catch (error) {
    console.error('Error fetching command progress:', error);
    return null;
  }
};

export const updateCommandProgress = async (
  userId: string,
  dogId: string,
  commandId: string,
  updates: Partial<Progress>
) => {
  try {
    const docRef = doc(db, 'users', userId, 'dogs', dogId, 'progress', commandId);
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      await updateDoc(docRef, updates);
    } else {
      await setDoc(docRef, { ...updates, commandId, userId, dogId });
    }
  } catch (error) {
    console.error('Error updating command progress:', error);
    throw error;
  }
};

// ===== SCHEDULES =====
export const getSchedules = async (userId: string, dogId: string): Promise<Schedule[]> => {
  try {
    const schedulesRef = collection(db, 'users', userId, 'schedules') as CollectionReference<Schedule>;
    const q = query(schedulesRef, where('dogId', '==', dogId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};

export const addSchedule = async (userId: string, scheduleData: Omit<Schedule, 'id'>): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'users', userId, 'schedules'));
    await setDoc(docRef, scheduleData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding schedule:', error);
    throw error;
  }
};

export const updateSchedule = async (userId: string, scheduleId: string, updates: Partial<Schedule>) => {
  try {
    const docRef = doc(db, 'users', userId, 'schedules', scheduleId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

export const deleteSchedule = async (userId: string, scheduleId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'schedules', scheduleId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

// ===== ACHIEVEMENTS =====
export const getAchievements = async (userId: string, dogId: string): Promise<Achievement[]> => {
  try {
    const achievementsRef = collection(db, 'users', userId, 'achievements') as CollectionReference<Achievement>;
    const q = query(achievementsRef, where('dogId', '==', dogId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

export const unlockAchievement = async (
  userId: string,
  dogId: string,
  achievementId: string
): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'users', userId, 'achievements'));
    const achievement: Achievement = {
      id: docRef.id,
      userId,
      dogId,
      achievementId,
      unlockedAt: new Date(),
    };
    await setDoc(docRef, achievement);
    return docRef.id;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
};
