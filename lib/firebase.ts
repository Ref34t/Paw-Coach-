import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../firebase.config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (if needed)
const connectEmulators = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment) return;

  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Emulators already connected
  }
};

// Uncomment to use emulators
// connectEmulators();

export default app;
