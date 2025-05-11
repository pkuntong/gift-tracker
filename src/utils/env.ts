/**
 * Environment variable validation utility
 * Ensures required environment variables are present
 */

interface EnvVars {
  VITE_API_URL: string;
  VITE_STRIPE_PUBLIC_KEY?: string;
  VITE_STRIPE_SECRET_KEY?: string;
  VITE_ANALYTICS_ID?: string;
}

/**
 * Validates that required environment variables are defined
 * @returns The validated environment variables
 * @throws Error if a required environment variable is missing
 */
export function validateEnv(): EnvVars {
  const env: Partial<EnvVars> = {};
  
  // Required variables
  const requiredVars = ['VITE_API_URL'];
  
  // Optional variables
  const optionalVars = [
    'VITE_STRIPE_PUBLIC_KEY',
    'VITE_STRIPE_SECRET_KEY',
    'VITE_ANALYTICS_ID'
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
