import React from 'react';
import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { useErrorHandler, useApiErrorHandler } from '../hooks/useErrorHandler';
import ErrorDisplay from './ErrorDisplay';
import { ErrorHandler } from '../utils/errorHandler';
import { sdk } from '../../sdk/sdk';

/**
 * Example component demonstrating the new error handling system
 */
const ErrorHandlingExample: React.FC = () => {
  // Basic error handler
  const basicErrorHandler = useErrorHandler({
    autoClear: true,
    clearDelay: 5000,
  });

  // API error handler with retry logic
  const apiErrorHandler = useApiErrorHandler({
    maxRetries: 3,
    autoClear: false,
  });

  // Simulate different types of errors
  const simulateNetworkError = () => {
    const context = ErrorHandler.createContext('ErrorHandlingExample', 'simulateNetworkError');
    // Simulate a network error
    setTimeout(() => {
      basicErrorHandler.handleError(new Error('Network connection failed'), context);
    }, 100);
  };

  const simulateValidationError = () => {
    const context = ErrorHandler.createContext('ErrorHandlingExample', 'simulateValidationError');
    basicErrorHandler.handleError('Invalid input provided. Please check your data.', context);
  };

  const simulateServerError = () => {
    const context = ErrorHandler.createContext('ErrorHandlingExample', 'simulateServerError');
    basicErrorHandler.handleError('Internal server error occurred', context);
  };

  const simulateAuthError = () => {
    const context = ErrorHandler.createContext('ErrorHandlingExample', 'simulateAuthError');
    basicErrorHandler.handleError('Authentication failed. Please log in again.', context);
  };

  // Example API call with retry
  const fetchDataWithRetry = async () => {
    const context = ErrorHandler.createContext('ErrorHandlingExample', 'fetchDataWithRetry');
    
    await apiErrorHandler.executeWithRetry(async () => {
      // Simulate an API call that might fail
      const response = await fetch('/api/test-endpoint');
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      return await response.json();
    }, context);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Error Handling Examples
      </Typography>
      
      <Stack spacing={3}>
        {/* Basic Error Handler Example */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Error Handler
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This demonstrates basic error handling with auto-clear functionality.
          </Typography>
          
          <Stack direction="row" spacing={2} mb={2}>
            <Button variant="outlined" onClick={simulateNetworkError}>
              Network Error
            </Button>
            <Button variant="outlined" onClick={simulateValidationError}>
              Validation Error
            </Button>
            <Button variant="outlined" onClick={simulateServerError}>
              Server Error
            </Button>
            <Button variant="outlined" onClick={simulateAuthError}>
              Auth Error
            </Button>
          </Stack>

          <ErrorDisplay
            error={basicErrorHandler.error}
            variant="alert"
            showRetry={true}
            onRetry={basicErrorHandler.retry}
            onClose={basicErrorHandler.clearError}
          />
        </Paper>

        {/* API Error Handler Example */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            API Error Handler with Retry
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This demonstrates API error handling with automatic retry logic.
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={fetchDataWithRetry}
            disabled={apiErrorHandler.loading}
            sx={{ mb: 2 }}
          >
            {apiErrorHandler.loading ? 'Loading...' : 'Fetch Data (with retry)'}
          </Button>

          <ErrorDisplay
            error={apiErrorHandler.error}
            variant="alert"
            showRetry={true}
            showDetails={true}
            onRetry={apiErrorHandler.retry}
            onClose={apiErrorHandler.clearError}
          />
        </Paper>

        {/* Error Display Variants */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error Display Variants
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Alert Variant (Default)
              </Typography>
              <ErrorDisplay
                error="This is an example error message"
                variant="alert"
                showRetry={true}
                onRetry={() => console.log('Retry clicked')}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Chip Variant
              </Typography>
              <ErrorDisplay
                error="Compact error display"
                variant="chip"
                showRetry={true}
                onRetry={() => console.log('Retry clicked')}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Inline Variant
              </Typography>
              <ErrorDisplay
                error="Inline error message"
                variant="inline"
              />
            </Box>
          </Stack>
        </Paper>

        {/* Error Types Example */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Different Error Types
          </Typography>
          
          <Stack spacing={2}>
            <ErrorDisplay
              error="This is a validation error"
              variant="alert"
              severity="warning"
            />
            
            <ErrorDisplay
              error="This is an informational message"
              variant="alert"
              severity="info"
            />
            
            <ErrorDisplay
              error="This is a critical error"
              variant="alert"
              severity="error"
            />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ErrorHandlingExample; 