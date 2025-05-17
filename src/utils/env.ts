/**
 * Environment variable validation utility
 * Ensures required environment variables are present
 */

interface EnvVars {
  // Firebase Configuration
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID?: string;
  
  // Stripe Configuration
  VITE_STRIPE_PUBLIC_KEY?: string;
  VITE_STRIPE_SECRET_KEY?: string;
  
  // Analytics
  VITE_ANALYTICS_ID?: string;

  // API URL
  VITE_API_URL?: string;
}

/**
 * Validates that required environment variables are defined
 * @returns The validated environment variables
 * @throws Error if a required environment variable is missing
 */
export function validateEnv(): EnvVars {
  const env: Partial<EnvVars> = {};
  
  // Required variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  // Optional variables
  const optionalVars = [
    'VITE_STRIPE_PUBLIC_KEY',
    'VITE_STRIPE_SECRET_KEY',
    'VITE_ANALYTICS_ID',
    'VITE_API_URL'
  ];

  // Check required variables
  for (const varName of requiredVars) {
    const value = import.meta.env[varName];
    if (!value) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
    env[varName as keyof EnvVars] = value;
  }

  // Add optional variables if they exist
  for (const varName of optionalVars) {
    const value = import.meta.env[varName];
    if (value) {
      env[varName as keyof EnvVars] = value;
    }
  }

  return env as EnvVars;
}

// Export the validated environment variables
export const env = validateEnv();
