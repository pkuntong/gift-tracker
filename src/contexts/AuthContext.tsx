import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, applyActionCode } from 'firebase/auth';
import { User } from '../types/user';
import { auth } from '../firebase/config';
import * as authService from '../firebase/auth-service';
import { mapFirebaseUser } from '../firebase/auth-service';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Fetch user document from Firestore for trial info
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let trialStart, trialEnd;
        if (userDoc.exists()) {
          const data = userDoc.data();
          trialStart = data.trialStart;
          trialEnd = data.trialEnd;
        }
        // Map Firebase user to our app User type
        const mappedUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          emailVerified: firebaseUser.emailVerified,
          trialStart,
          trialEnd
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign up new user
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signup(email, password, name);
      setIsLoading(false);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string, message?: string };
      console.error('Signup error:', firebaseError);
      setError(firebaseError.message || 'Signup failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Enhanced debugging information
      console.log('%c Authentication Debug Info:', 'background: #222; color: #bada55; font-size: 12px;');
      console.log('Login attempt with email:', email);
      console.log('Password provided:', password ? '********' : 'No password provided');
      
      // Make sure email and password are properly trimmed and passed 
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      if (!trimmedEmail || !trimmedPassword) {
        throw new Error('Email and password are required');
      }
      
      // Log request details before sending
      console.log('Login attempt with:', { email: trimmedEmail, password: '********' });
      
      // Use Firebase authentication service
      await authService.login(trimmedEmail, trimmedPassword);
      console.log('Login process completed successfully');
      setIsLoading(false);
    } catch (error: unknown) {
      console.error('%c Login Error! 🚨', 'background: red; color: white; font-size: 12px;');
      console.error('Original error object:', error);
      
      // Extract useful error information
      const firebaseError = error as { 
        code?: string,
        message?: string
      };
      
      // Provide user-friendly error messages based on Firebase error codes
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or reset your password.');
      } else if (firebaseError.code === 'auth/network-request-failed') {
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else {
        setError(firebaseError.message || 'An unexpected error occurred during login.');
      }
      
      setIsLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
      // Firebase Auth state change listener will handle updating the state
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out');
    }
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Apply the email verification code
      await applyActionCode(auth, token);
      
      // Reload the user to get updated email verification status
      await user.reload();
      
      // Update the user state with the new verification status
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        setUser(mapFirebaseUser(updatedUser));
      }

      setIsLoading(false);
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Email verification failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Password reset request failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Update password
  const updatePassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.updatePassword(token, password);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Password update failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update Firebase Auth display name
      await authService.updateUserProfile(name);

      // Update Firestore user document
      if (user) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { name });
        // Reload user from Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser({ ...user, name: userDoc.data().name });
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Profile update failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Update user email
  const updateEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update Firebase Auth email
      await authService.updateEmail(email);
      // Update Firestore user document
      if (user) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { email });
        // Reload user from Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser({ ...user, email: userDoc.data().email });
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Email update failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting to sign in with Google');
      await authService.signInWithGoogle();
      console.log('Google sign-in successful');
      setIsLoading(false);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    verifyEmail,
    resetPassword,
    updatePassword,
    updateProfile,
    updateEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom  to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 