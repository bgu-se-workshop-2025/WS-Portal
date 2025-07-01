import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppError } from '../types/errors';
import { ErrorType } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';
import { ErrorSnackbar } from '../components/error/ErrorDisplay';

interface ErrorContextType {
  globalError: AppError | null;
  showGlobalError: (error: AppError) => void;
  hideGlobalError: () => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [globalError, setGlobalError] = useState<AppError | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showGlobalError = useCallback((error: AppError) => {
    setGlobalError(error);
    setSnackbarOpen(true);

    // Handle specific error types
    if (ErrorHandler.shouldLogout(error)) {
      // Clear auth tokens and redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000); // Give user time to see the error
    }
  }, []);

  const hideGlobalError = useCallback(() => {
    setSnackbarOpen(false);
    // Keep the error in state for a bit longer to allow animations
    setTimeout(() => setGlobalError(null), 300);
  }, []);

  const clearAllErrors = useCallback(() => {
    setGlobalError(null);
    setSnackbarOpen(false);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!globalError || !globalError.retryable) return;

    // For global errors, we might not have a specific operation to retry
    // This could be extended to support retry callbacks in the future
    hideGlobalError();
  }, [globalError, hideGlobalError]);

  // Subscribe to global error notifications
  useEffect(() => {
    const unsubscribe = ErrorHandler.subscribe((error: AppError) => {
      if (ErrorHandler.shouldShowGlobalNotification(error)) {
        showGlobalError(error);
      }
    });

    return unsubscribe;
  }, [showGlobalError]);

  const contextValue: ErrorContextType = {
    globalError,
    showGlobalError,
    hideGlobalError,
    clearAllErrors
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      
      <ErrorSnackbar
        error={globalError}
        open={snackbarOpen}
        onClose={hideGlobalError}
        onRetry={globalError?.retryable ? handleRetry : undefined}
      />
    </ErrorContext.Provider>
  );
};

export const useGlobalError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useGlobalError must be used within an ErrorProvider');
  }
  return context;
};

// Hook for components that want to show global errors
export const useShowGlobalError = () => {
  const { showGlobalError } = useGlobalError();
  
  return useCallback((error: any) => {
    if (error instanceof AppError) {
      showGlobalError(error);
    } else {
      // Convert other error types to AppError
      ErrorHandler.processError(error).then(showGlobalError);
    }
  }, [showGlobalError]);
}; 