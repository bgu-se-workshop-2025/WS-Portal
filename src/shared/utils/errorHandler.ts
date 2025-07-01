import type { AppError, ErrorContext } from '../types/errors';
import { AppErrorFactory, ErrorType } from '../types/errors';

export class ErrorHandler {
  private static errorSubscribers: Set<(error: AppError) => void> = new Set();

  /**
   * Process any error and convert it to a standardized AppError
   */
  static async processError(error: any, context?: ErrorContext): Promise<AppError> {
    let appError: AppError;

    if (error instanceof Response) {
      // HTTP Response error
      const responseBody = await error.text().catch(() => '');
      appError = AppErrorFactory.fromHttpError(error, responseBody, context);
    } else if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Network error
        appError = AppErrorFactory.fromNetworkError(error, context);
      } else {
        // Generic error
        appError = AppErrorFactory.fromGenericError(error, context);
      }
    } else if (typeof error === 'string') {
      // String error message
      appError = AppErrorFactory.fromGenericError(new Error(error), context);
    } else {
      // Unknown error type
      appError = AppErrorFactory.fromGenericError(
        new Error('Unknown error occurred'),
        context
      );
    }

    // Notify subscribers
    this.notifySubscribers(appError);

    return appError;
  }

  /**
   * Subscribe to error notifications
   */
  static subscribe(callback: (error: AppError) => void): () => void {
    this.errorSubscribers.add(callback);
    return () => this.errorSubscribers.delete(callback);
  }

  /**
   * Notify all subscribers of an error
   */
  private static notifySubscribers(error: AppError): void {
    this.errorSubscribers.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error in error subscriber:', e);
      }
    });
  }

  /**
   * Check if an error should trigger a logout
   */
  static shouldLogout(error: AppError): boolean {
    return error.type === ErrorType.AUTHENTICATION_FAILED;
  }

  /**
   * Check if an error should show a global notification
   */
  static shouldShowGlobalNotification(error: AppError): boolean {
    return [
      ErrorType.USER_SUSPENDED,
      ErrorType.INTERNAL_SERVER_ERROR,
      ErrorType.NETWORK_ERROR
    ].includes(error.type);
  }

  /**
   * Get retry delay based on error type (in milliseconds)
   */
  static getRetryDelay(error: AppError, attempt: number = 1): number {
    if (!error.retryable) return 0;

    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds

    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      case ErrorType.INTERNAL_SERVER_ERROR:
        return Math.min(baseDelay * attempt, maxDelay);
      case ErrorType.RESOURCE_NOT_FOUND:
        return baseDelay * 2; // Fixed delay for 404s
      default:
        return baseDelay;
    }
  }

  /**
   * Log error for debugging and monitoring
   */
  static logError(error: AppError, context?: ErrorContext): void {
    const logData = {
      type: error.type,
      severity: error.severity,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    switch (error.severity) {
      case 'critical':
        console.error('CRITICAL ERROR:', logData);
        break;
      case 'error':
        console.error('ERROR:', logData);
        break;
      case 'warning':
        console.warn('WARNING:', logData);
        break;
      case 'info':
        console.info('INFO:', logData);
        break;
      default:
        console.log('LOG:', logData);
    }
  }
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: ErrorContext
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await operation();
    return { data };
  } catch (err) {
    const error = await ErrorHandler.processError(err, context);
    ErrorHandler.logError(error, context);
    return { error };
  }
}

/**
 * Hook-friendly error handler
 */
export function createErrorHandler(context?: ErrorContext) {
  return async (error: any): Promise<AppError> => {
    const appError = await ErrorHandler.processError(error, context);
    ErrorHandler.logError(appError, context);
    return appError;
  };
} 