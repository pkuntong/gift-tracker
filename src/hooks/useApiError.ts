import { useState, useCallback } from 'react';
import { isApiError, getUserFriendlyErrorMessage } from '../utils/api-error';

/**
 * Custom hook for handling API errors consistently
 */
export function useApiError() {
  const [error, setError] = useState<string | null>(null);
  
  const handleError = useCallback((err: unknown) => {
    const message = getUserFriendlyErrorMessage(err);
    setError(message);
    return message;
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError,
    isApiError
  };
}
