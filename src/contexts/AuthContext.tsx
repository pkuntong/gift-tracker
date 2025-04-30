import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { User } from '../types/user';

// Define types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Token key constant
const AUTH_TOKEN_KEY = 'auth_token';

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      // Validate token and get user profile
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Validate token and get user profile
  const validateToken = async (token: string) => {
    try {
      const response = await axios.get<{ user: User }>(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsLoading(false);
    } catch (err) {
      console.error('Token validation failed:', err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsLoading(false);
    }
  };

  // Sign up new user
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, {
        email,
        password,
        name
      });
    
      const { token, user } = response.data;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setUser(user as User);
      setIsLoading(false);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Signup failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Login attempt with email:', email);
      console.log('API URL:', API_URL);
      
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      console.log('Token received:', token);
      
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('Token stored in localStorage');
      
      setUser(user as User);
      setIsLoading(false);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error('Error response:', axiosError.response);
      setError(axiosError.response?.data?.message || 'Login failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/verify-email`, { token });
      const userData = response.data.user;
      
      // Type guard to ensure userData matches User type
      const isValidUser = (data: unknown): data is User => {
        return data !== null && 
               typeof data === 'object' && 
               'id' in data &&
               typeof (data as any).id === 'string';
      };
      
      if (isValidUser(userData)) {
        setUser(userData);
      } else {
        throw new Error('Invalid user data received');
      }
      setIsLoading(false);
    } catch (error) {
      const err = error as Error & { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || err.message || 'Email verification failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email });
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset request failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Update password
  const updatePassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/update-password`, { token, password });
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password update failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const response = await axios.put(
        `${API_URL}/user/profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
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
    logout,
    verifyEmail,
    resetPassword,
    updatePassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 