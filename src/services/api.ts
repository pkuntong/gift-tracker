import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to update the API base URL
export const updateApiBaseUrl = (newUrl: string) => {
  API_BASE_URL = newUrl;
  api.defaults.baseURL = newUrl;
};

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
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  },

  async updatePassword(token: string, password: string): Promise<void> {
    await api.post('/auth/update-password', { token, password });
  },
};

export const paymentService = {
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    const response = await api.post<PaymentIntent>('/payments/create-intent', { amount, currency });
    return response.data;
  },

  async createSubscription(priceId: string): Promise<{ subscriptionId: string }> {
    const response = await api.post<{ subscriptionId: string }>('/payments/create-subscription', { priceId });
    return response.data;
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await api.post('/payments/cancel-subscription', { subscriptionId });
  },
};

export const userService = {
  async getProfile(): Promise<any> {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: any): Promise<void> {
    await api.put('/user/profile', data);
  },
};

export default api; 