/**
 * Custom error types for API requests
 */

// Base API error class
export class ApiError extends Error {
  public status: number;
  public data: any;
  public isApiError = true;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Specific error classes for different status codes
export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', data?: any) {
    super(message, 400, data);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', data?: any) {
    super(message, 401, data);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', data?: any) {
    super(message, 403, data);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', data?: any) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict', data?: any) {
    super(message, 409, data);
    this.name = 'ConflictError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Internal Server Error', data?: any) {
    super(message, 500, data);
    this.name = 'ServerError';
  }
}

// Type guard to check if an error is an API error
export function isApiError(error: any): error is ApiError {
  return error && error.isApiError === true;
}

/**
 * Transforms any error into a specific API error type based on status code
 * @param error The error to transform
 * @returns A typed API error
 */
export function transformError(error: any): ApiError {
  // If it's already an ApiError instance, return it
  if (isApiError(error)) {
    return error;
  }

  // Handle Axios errors or other errors with response property
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || error.message || 'An error occurred';

    switch (status) {
      case 400:
        return new BadRequestError(message, data);
      case 401:
        return new UnauthorizedError(message, data);
      case 403:
        return new ForbiddenError(message, data);
      case 404:
        return new NotFoundError(message, data);
      case 409:
        return new ConflictError(message, data);
      case 500:
      case 501:
      case 502:
      case 503:
        return new ServerError(message, data);
      default:
        return new ApiError(message, status, data);
    }
  }

  // Handle network errors
  if (error.request && !error.response) {
    return new ApiError('Network Error: Unable to connect to the server', 0, error);
  }

  // Handle any other errors
  return new ApiError(error.message || 'Unknown error', 0, error);
}

/**
 * Gets a user-friendly error message from an error
 * @param error The error object
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  const apiError = isApiError(error) ? error : transformError(error);

  // Return custom messages based on error type and status
  switch (apiError.status) {
    case 0:
      return 'Unable to connect to the server. Please check your internet connection.';
    case 400:
      return apiError.message || 'Invalid request. Please check your data and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return apiError.message || 'The requested resource was not found.';
    case 409:
      return apiError.message || 'There was a conflict with the current state of the resource.';
    case 500:
    case 501:
    case 502:
    case 503:
      return 'We\'re experiencing technical difficulties. Please try again later.';
    default:
      return apiError.message || 'An unexpected error occurred. Please try again.';
  }
}
