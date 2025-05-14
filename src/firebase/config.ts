import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Analytics } from 'firebase/analytics';
import { env } from '../utils/env';

// Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase using a singleton pattern to prevent duplicate initializations
const getFirebaseApp = () => {
  // Check if there are existing Firebase apps
  if (getApps().length > 0) {
    console.log('Using existing Firebase app instance');
    return getApp(); // Return the existing app instance
  }
  
  // Initialize a new app if none exists
  console.log('Initializing new Firebase app');
  return initializeApp(firebaseConfig);
};

// Get the Firebase app instance
const app = getFirebaseApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add debugging for authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});

// Conditionally initialize analytics only in browser environment and if measurement ID exists
let analyticsInstance: Analytics | null = null;

// Function to initialize analytics
const initAnalytics = async (): Promise<void> => {
  try {
    // Only initialize analytics if running in browser and measurement ID is provided
    if (typeof window !== 'undefined' && env.VITE_FIREBASE_MEASUREMENT_ID) {
      try {
        const { getAnalytics } = await import('firebase/analytics');
        analyticsInstance = getAnalytics(app);
        console.log('Firebase Analytics initialized');
      } catch (e) {
        console.warn('Failed to initialize analytics:', e);
        // Don't rethrow - allow app to function without analytics
      }
    }
  } catch (e) {
    console.warn('Analytics initialization skipped:', e);
  }
};

// Initialize analytics but don't wait for it
initAnalytics().catch(e => console.warn('Analytics initialization failed:', e));

// Export analytics getter to ensure it's always up to date
export const getAnalyticsInstance = (): Analytics | null => analyticsInstance;

// Export for debugging purposes
export const debugFirebaseConfig = () => {
  console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '****' + firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4) : 'not set',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    analyticsEnabled: !!analyticsInstance,
    initialized: getApps().length > 0
  });
};

export default app;
