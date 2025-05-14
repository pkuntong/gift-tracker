import { auth, db } from './config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Test Firebase authentication connection
 */
export const testAuthConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log('Testing Firebase Auth connection...');
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Firebase Auth connection successful!');
        console.log('Current user:', user ? 'Signed in' : 'Not signed in');
        unsubscribe();
        resolve(true);
      }, (error) => {
        console.error('Firebase Auth connection error:', error);
        unsubscribe();
        resolve(false);
      });
    } catch (error) {
      console.error('Firebase Auth initialization error:', error);
      resolve(false);
    }
  });
};

/**
 * Test Firestore database connection
 */
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    // Try to access a collection (even if empty)
    const testCollection = collection(db, 'connection_test');
    await getDocs(testCollection);
    console.log('Firestore connection successful!');
    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};

/**
 * Run all Firebase connection tests
 */
export const testAllConnections = async (): Promise<{
  authConnected: boolean;
  firestoreConnected: boolean;
}> => {
  const authConnected = await testAuthConnection();
  const firestoreConnected = await testFirestoreConnection();
  
  return {
    authConnected,
    firestoreConnected
  };
};
