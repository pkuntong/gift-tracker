import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
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

interface AuthResponse {
  user: User;
  token: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Import environment variables
import { env } from '../utils/env';

// API base URL from validated environment variables
const API_URL = env.VITE_API_URL;

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
      // Enhanced debugging information
      console.log('%c Authentication Debug Info:', 'background: #222; color: #bada55; font-size: 12px;');
      console.log('Login attempt with email:', email);
      console.log('Password provided:', password ? '********' : 'No password provided');
      console.log('API URL:', API_URL);
      console.log('Full endpoint:', `${API_URL}/auth/login`);
      
      // Make sure email and password are properly trimmed and passed 
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      if (!trimmedEmail || !trimmedPassword) {
        throw new Error('Email and password are required');
      }
      
      // Log request details before sending
      console.log('Request payload:', { email: trimmedEmail, password: '********' });
      
      // Try with the simplest form of request to ensure compatibility with the mock API
      const payload = { email: trimmedEmail, password: trimmedPassword };
      console.log('Using direct payload:', JSON.stringify(payload));
      
      // Use direct axios post call with simple request body
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, payload);
      
      // Log successful response
      console.log('%c Login Success! Response:', 'background: green; color: white;');
      console.log('Status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      
      // Verify response has the expected structure
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response format from server');
      }
      
      // Destructure the response data (not response directly)
      const { token, user } = response.data;
      console.log('Token received:', token ? '✅ Yes' : '❌ No');
      console.log('User received:', user ? '✅ Yes' : '❌ No');
      
      // Clear any existing token first
      localStorage.removeItem(AUTH_TOKEN_KEY);
      
      // Store auth token
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('Auth token saved to localStorage:', AUTH_TOKEN_KEY);
      
      // Test retrieving token
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      console.log('Token verification from localStorage:', savedToken === token ? '✅ Matched' : '❌ Mismatch');
      
      setUser(user as User);
      setIsLoading(false);
      console.log('Login process completed successfully');
    } catch (error: unknown) {
      console.error('%c Login Error! 🚨', 'background: red; color: white; font-size: 12px;');
      console.error('Original error object:', error);
      
      // Extract useful error information
      const axiosError = error as { 
        response?: { status?: number, data?: any, headers?: any },
        request?: any,
        message?: string,
        config?: any
      };
      
      if (axiosError.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Error status:', axiosError.response.status);
        console.error('Error data:', axiosError.response.data);
        console.error('Error headers:', axiosError.response.headers);
        
        // Try to provide a more specific error message
        if (axiosError.response.status === 401) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(axiosError.response?.data?.message || `Server error: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error('No response received from server. Network error?');
        console.error('Request sent:', axiosError.request);
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', axiosError.message);
        console.error('Request config:', axiosError.config);
        setError(axiosError.message || 'An unexpected error occurred during login.');
      }
      
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
      setUser(response.data as User);
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