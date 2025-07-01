import { useState, useCallback, useEffect } from 'react';
import type { AppError, ErrorContext } from '../types/errors';
import { ErrorHandler, withErrorHandling } from '../utils/errorHandler';
import { TokenService } from '../utils/token';

interface UseErrorHandlerOptions {
  context?: ErrorContext;
  autoRetry?: boolean;
  maxRetries?: number;
  showGlobalNotification?: boolean;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  isRetrying: boolean;
  retryCount: number;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  handleError: (error: any) => Promise<void>;
  retry: () => Promise<void>;
  withErrorHandling: <T>(operation: () => Promise<T>) => Promise<{ data?: T; error?: AppError }>;
}

export function useErrorHandler(
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn {
  const {
    context,
    autoRetry = false,
    maxRetries = 3,
    showGlobalNotification = false
  } = options;

  const [error, setError] = useState<AppError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastOperation, setLastOperation] = useState<(() => Promise<any>) | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setLastOperation(null);
  }, []);

  const handleError = useCallback(async (err: any) => {
    const appError = await ErrorHandler.processError(err, context);
    setError(appError);
    ErrorHandler.logError(appError, context);

    // Handle logout if needed
    if (ErrorHandler.shouldLogout(appError)) {
      // Clear auth tokens using TokenService and redirect to login
      TokenService.clearToken();
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    // Auto retry for certain error types
    if (
      autoRetry && 
      appError.retryable && 
      retryCount < maxRetries &&
      lastOperation
    ) {
      const delay = ErrorHandler.getRetryDelay(appError, retryCount + 1);
      setTimeout(() => {
        retry();
      }, delay);
    }
  }, [context, autoRetry, maxRetries, retryCount, lastOperation]);

  const retry = useCallback(async () => {
    if (!lastOperation || !error?.retryable) return;

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      await lastOperation();
      clearError();
    } catch (err) {
      await handleError(err);
    } finally {
      setIsRetrying(false);
    }
  }, [lastOperation, error, handleError, clearError]);

  const wrappedWithErrorHandling = useCallback(
    async <T>(operation: () => Promise<T>): Promise<{ data?: T; error?: AppError }> => {
      setLastOperation(() => operation);
      
      const result = await withErrorHandling(operation, context);
      
      if (result.error) {
        setError(result.error);
        ErrorHandler.logError(result.error, context);
      } else {
        clearError();
      }

      return result;
    },
    [context, clearError]
  );

  // Global error notification effect
  useEffect(() => {
    if (error && showGlobalNotification && ErrorHandler.shouldShowGlobalNotification(error)) {
      // This could trigger a global notification system
      // For now, we'll just log it
      console.warn('Global notification should be shown for error:', error);
    }
  }, [error, showGlobalNotification]);

  return {
    error,
    isRetrying,
    retryCount,
    setError,
    clearError,
    handleError,
    retry,
    withErrorHandling: wrappedWithErrorHandling
  };
}

// Specialized hook for form error handling
export function useFormErrorHandler(context?: ErrorContext) {
  const {
    error,
    setError,
    clearError,
    handleError,
    withErrorHandling
  } = useErrorHandler({ context, autoRetry: false });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const handleFormSubmit = useCallback(
    async <T>(submitOperation: () => Promise<T>): Promise<{ data?: T; error?: AppError }> => {
      clearAllFieldErrors();
      clearError();
      
      return withErrorHandling(submitOperation);
    },
    [clearAllFieldErrors, clearError, withErrorHandling]
  );

  return {
    error,
    fieldErrors,
    setError,
    clearError,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    handleError,
    handleFormSubmit
  };
}

// Hook for API operations with loading states
export function useAsyncOperation<T = any>(
  context?: ErrorContext
) {
  const {
    error,
    isRetrying,
    setError,
    clearError,
    retry,
    withErrorHandling
  } = useErrorHandler({ context, autoRetry: false });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (operation: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      clearError();

      const result = await withErrorHandling(operation);

      if (result.data) {
        setData(result.data);
      }

      setIsLoading(false);
      return result.data || null;
    },
    [withErrorHandling, clearError]
  );

  const reset = useCallback(() => {
    setData(null);
    clearError();
    setIsLoading(false);
  }, [clearError]);

  return {
    data,
    isLoading,
    error,
    isRetrying,
    execute,
    retry,
    reset,
    setError,
    clearError
  };
} 