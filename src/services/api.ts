import axios from 'axios';
import { env } from '../utils/env';
import { transformError, ApiError, isApiError, getUserFriendlyErrorMessage } from '../utils/api-error';

// API base URL from validated environment variables
let API_BASE_URL = env.VITE_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Token constant - must be the same key used in AuthContext.tsx
const AUTH_TOKEN_KEY = 'auth_token';

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(transformError(error));
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = transformError(error);
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (apiError.status === 401) {
      // Clear auth token
      localStorage.removeItem(AUTH_TOKEN_KEY);
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        // Store the current location to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(apiError);
  }
);

// Function to update the API base URL
export const updateApiBaseUrl = (newUrl: string) => {
  API_BASE_URL = newUrl;
  api.defaults.baseURL = newUrl;
};

/**
 * Safe request wrapper that handles errors consistently
 * @param requestFn The axios request function to execute
 * @returns Promise with the response data or a typed error
 */
/**
 * Safe request wrapper that handles errors consistently
 * @param requestFn The function that returns a promise
 * @returns Promise with the response data or a typed error
 */
async function handleApiRequest<T>(requestFn: () => Promise<any>): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    // If it's already an ApiError (from interceptor), rethrow it
    if (isApiError(error)) {
      throw error;
    }
    
    // Otherwise transform and throw
    throw transformError(error);
  }
}

export interface SignupData {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface PaymentIntent {
  clientSecret: string;
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    return handleApiRequest<AuthResponse>(() => api.post('/auth/signup', data));
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return handleApiRequest<AuthResponse>(() => api.post('/auth/login', { email, password }));
  },

  async verifyEmail(token: string): Promise<void> {
    return handleApiRequest<void>(() => api.post('/auth/verify-email', { token }));
  },

  async resetPassword(email: string): Promise<void> {
    return handleApiRequest<void>(() => api.post('/auth/reset-password', { email }));
  },

  async updatePassword(token: string, password: string): Promise<void> {
    return handleApiRequest<void>(() => api.post('/auth/update-password', { token, password }));
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  // Logout user
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

export const paymentService = {
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    return handleApiRequest<PaymentIntent>(() => api.post('/payments/create-intent', { amount, currency }));
  },

  async createSubscription(priceId: string): Promise<{ subscriptionId: string }> {
    return handleApiRequest<{ subscriptionId: string }>(() => api.post('/payments/create-subscription', { priceId }));
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return handleApiRequest<void>(() => api.post('/payments/cancel-subscription', { subscriptionId }));
  },
};

export const userService = {
  async getProfile(): Promise<any> {
    return handleApiRequest<any>(() => api.get('/user/profile'));
  },

  async updateProfile(data: any): Promise<any> {
    return handleApiRequest<any>(() => api.put('/user/profile', data));
  },
};

// Export helper functions for use in components
export { getUserFriendlyErrorMessage, isApiError, ApiError };

export default api; 