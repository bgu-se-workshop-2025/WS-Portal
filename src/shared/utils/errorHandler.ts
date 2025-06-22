import { AppError, ErrorType, ErrorContext, ApiErrorResponse, ERROR_MESSAGES } from '../types/errors';

export class ErrorHandler {
  /**
   * Process an error and convert it to an AppError if it isn't already
   */
  static async processError(error: any, context?: ErrorContext): Promise<AppError> {
    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return error;
    }

    // If it's a fetch response error, try to parse it
    if (error instanceof Response) {
      return await this.handleResponseError(error, context);
    }

    // If it's a network error
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      return AppError.fromNetworkError(error, context);
    }

    // If it's a string, create a generic error
    if (typeof error === 'string') {
      return new AppError(ErrorType.UNKNOWN_ERROR, error, { context });
    }

    // If it has a message property, use it
    if (error.message) {
      return new AppError(ErrorType.UNKNOWN_ERROR, error.message, {
        context,
        originalError: error,
      });
    }

    // Fallback to generic error
    return new AppError(ErrorType.UNKNOWN_ERROR, 'An unexpected error occurred', {
      context,
      originalError: error,
    });
  }

  /**
   * Handle HTTP response errors
   */
  static async handleResponseError(response: Response, context?: ErrorContext): Promise<AppError> {
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json() as ApiErrorResponse;
        return AppError.fromApiResponse(errorData, context);
      } else {
        const errorText = await response.text();
        const message = errorText && errorText.trim() !== '' 
          ? errorText 
          : this.getDefaultMessageForStatus(response.status);
        
        return new AppError(
          this.mapStatusToErrorType(response.status, context),
          message,
          { context }
        );
      }
    } catch (parseError) {
      return new AppError(
        this.mapStatusToErrorType(response.status, context),
        this.getDefaultMessageForStatus(response.status),
        { context, originalError: parseError }
      );
    }
  }

  /**
   * Map HTTP status codes to error types
   */
  static mapStatusToErrorType(status: number, context?: ErrorContext): ErrorType {
    const action = context?.action?.toLowerCase();
    
    switch (status) {
      case 400:
        return ErrorType.VALIDATION_ERROR;
      case 401:
        return ErrorType.UNAUTHORIZED;
      case 403:
        return ErrorType.FORBIDDEN;
      case 404:
        if (action === 'getuserorders') return ErrorType.NO_ORDERS_FOUND;
        if (action === 'addseller') return ErrorType.USER_NOT_FOUND;
        if (action === 'login' || action === 'register') return ErrorType.INVALID_CREDENTIALS;
        return ErrorType.RESOURCE_NOT_FOUND;
      case 409:
        return ErrorType.RESOURCE_ALREADY_EXISTS;
      case 412:
        return ErrorType.PAYMENT_FAILED;
      case 429:
        return ErrorType.RATE_LIMIT_EXCEEDED;
      case 500:
        return ErrorType.SERVER_ERROR;
      case 502:
      case 503:
      case 504:
        return ErrorType.NETWORK_ERROR;
      default:
        return ErrorType.UNKNOWN_ERROR;
    }
  }

  /**
   * Get default error message for HTTP status codes
   */
  static getDefaultMessageForStatus(status: number): string {
    const messages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Please log in to continue.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This resource already exists.',
      412: 'Unable to process your request. Please try again.',
      429: 'Too many requests. Please wait before trying again.',
      500: 'Server error occurred. Please try again later.',
      502: 'Service temporarily unavailable. Please try again later.',
      503: 'Service temporarily unavailable. Please try again later.',
      504: 'Service temporarily unavailable. Please try again later.',
    };
    
    return messages[status] || 'An unexpected error occurred.';
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: AppError): string {
    // If the error has a message from the backend, use it as the primary message
    if (error.message && error.message.trim() !== '') {
      return error.message;
    }

    // Special handling for specific contexts
    if (error.context?.action === 'addSeller' && error.type === ErrorType.USER_NOT_FOUND) {
      return `User "${error.context.additionalInfo?.username || 'unknown'}" does not exist. Please check the username and try again.`;
    }

    // Fallback to predefined messages
    return ERROR_MESSAGES[error.type] || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Check if an error is retryable
   */
  static isRetryable(error: AppError): boolean {
    const retryableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.SERVER_ERROR,
      ErrorType.RATE_LIMIT_EXCEEDED,
    ];
    return retryableTypes.includes(error.type);
  }

  /**
   * Get retry delay in milliseconds
   */
  static getRetryDelay(error: AppError, attempt: number): number {
    const baseDelay = 1000;
    const maxDelay = 30000;
    
    if (error.type === ErrorType.RATE_LIMIT_EXCEEDED) {
      return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    }
    
    return Math.min(baseDelay * attempt, maxDelay);
  }

  /**
   * Log error for debugging
   */
  static logError(error: AppError, additionalContext?: Record<string, any>): void {
    const errorDetails = {
      ...error.toDetails(),
      additionalContext,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.error('Application Error:', errorDetails);
  }

  /**
   * Handle authentication errors specifically
   */
  static handleAuthError(error: AppError): void {
    if ([ErrorType.UNAUTHORIZED, ErrorType.TOKEN_EXPIRED, ErrorType.AUTHENTICATION_FAILED].includes(error.type)) {
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  }

  /**
   * Create a context object for error tracking
   */
  static createContext(component: string, action: string, additionalInfo?: Record<string, any>): ErrorContext {
    return {
      component,
      action,
      userId: this.getCurrentUserId(),
      additionalInfo,
    };
  }

  /**
   * Get current user ID if available
   */
  private static getCurrentUserId(): string | undefined {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
      }
    } catch {
      // Ignore errors in getting user ID
    }
    return undefined;
  }
}

/**
 * Utility function to wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  onError?: (error: AppError) => void
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const appError = await ErrorHandler.processError(error, context);
    ErrorHandler.logError(appError);
    
    if (onError) {
      onError(appError);
    }
    
    throw appError;
  }
}

/**
 * Utility function to retry operations with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  maxAttempts: number = 3,
  onError?: (error: AppError, attempt: number) => void
): Promise<T> {
  let lastError: AppError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = await ErrorHandler.processError(error, context);
      
      if (onError) {
        onError(lastError, attempt);
      }
      
      if (!ErrorHandler.isRetryable(lastError) || attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = ErrorHandler.getRetryDelay(lastError, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
} 