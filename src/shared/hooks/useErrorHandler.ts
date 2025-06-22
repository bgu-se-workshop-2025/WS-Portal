import { useState, useCallback, useRef } from 'react';
import { AppError, ErrorType, ErrorContext } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';

interface UseErrorHandlerOptions {
  onError?: (error: AppError) => void;
  autoClear?: boolean;
  clearDelay?: number;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  setError: (error: AppError | string | null) => void;
  clearError: () => void;
  handleError: (error: any, context?: ErrorContext) => Promise<void>;
  isError: boolean;
  errorType: ErrorType | null;
  retry: () => void;
  retryCount: number;
}

export const useErrorHandler = (
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn => {
  const { onError, autoClear = false, clearDelay = 5000 } = options;
  
  const [error, setErrorState] = useState<AppError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastOperationRef = useRef<(() => Promise<any>) | null>(null);

  const clearError = useCallback(() => {
    setErrorState(null);
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
  }, []);

  const setError = useCallback((error: AppError | string | null) => {
    if (error === null) {
      clearError();
      return;
    }

    const appError = typeof error === 'string' 
      ? new AppError(ErrorType.UNKNOWN_ERROR, error)
      : error;

    setErrorState(appError);
    setRetryCount(0);

    if (autoClear) {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      clearTimeoutRef.current = setTimeout(clearError, clearDelay);
    }

    if (onError) {
      onError(appError);
    }

    ErrorHandler.logError(appError);
  }, [autoClear, clearDelay, onError, clearError]);

  const handleError = useCallback(async (error: any, context?: ErrorContext) => {
    const appError = await ErrorHandler.processError(error, context);
    setError(appError);
  }, [setError]);

  const retry = useCallback(() => {
    if (lastOperationRef.current) {
      setRetryCount(prev => prev + 1);
      clearError();
      lastOperationRef.current();
    }
  }, [clearError]);

  return {
    error,
    setError,
    clearError,
    handleError,
    isError: error !== null,
    errorType: error?.type || null,
    retry,
    retryCount,
  };
};

/**
 * Hook for handling form validation errors
 */
export const useFormErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  return {
    fieldErrors,
    generalError,
    setFieldError,
    clearFieldError,
    setGeneralError,
    clearAllErrors,
    hasErrors: Object.keys(fieldErrors).length > 0 || !!generalError,
  };
}; 