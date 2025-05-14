import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  UserCredential 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types/user';

// Type for mapping Firebase user to app user
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  name: firebaseUser.displayName || 'User',
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
  photoURL: firebaseUser.photoURL || undefined
});

// Sign up new user
export const signup = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Create user in Firebase Authentication
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      name,
      createdAt: new Date()
    });
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Login user
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  return signOut(auth);
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Update password with reset code
export const updatePassword = async (code: string, newPassword: string): Promise<void> => {
  return confirmPasswordReset(auth, code, newPassword);
};

// Update user profile
export const updateUserProfile = async (name: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  // Update profile in Authentication
  await updateProfile(currentUser, { displayName: name });
  
  // Update profile in Firestore
  await setDoc(doc(db, 'users', currentUser.uid), { name }, { merge: true });
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore, if not create a new user document
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName || 'Google User',
        photoURL: result.user.photoURL,
        createdAt: new Date()
      });
    }
    
    return mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async (): Promise<User> => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore, if not create a new user document
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName || 'Facebook User',
        photoURL: result.user.photoURL,
        createdAt: new Date()
      });
    }
    
    return mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    throw error;
  }
};
