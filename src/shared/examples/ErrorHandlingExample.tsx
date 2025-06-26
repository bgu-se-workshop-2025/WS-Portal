import React, { useState } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { enhancedSdk } from '../../sdk/enhancedSdk';
import { useFormErrorHandler, useAsyncOperation, useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay, InlineError } from '../components/error/ErrorDisplay';
import { useShowGlobalError } from '../providers/ErrorProvider';

/**
 * Example component demonstrating all error handling patterns
 * This shows how to implement the new error handling system
 */
export const ErrorHandlingExample: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Error Handling Examples
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. Form Error Handling
        </Typography>
        <FormExample />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          2. Async Operation with Loading
        </Typography>
        <AsyncOperationExample />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          3. Custom Error Handling
        </Typography>
        <CustomErrorExample />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          4. Global Error Example
        </Typography>
        <GlobalErrorExample />
      </Box>
    </Box>
  );
};

// Example 1: Form Error Handling
const FormExample: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    error,
    handleFormSubmit,
    clearError
  } = useFormErrorHandler({
    component: 'FormExample',
    operation: 'Login Example'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data } = await handleFormSubmit(async () => {
      return await enhancedSdk.enhancedLogin({ username, password });
    });

    setIsLoading(false);

    if (data) {
      alert('Login successful!');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ maxWidth: 400 }}>
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
      />
      
      <InlineError error={error} onDismiss={clearError} />
      
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};

// Example 2: Async Operation with Loading
const AsyncOperationExample: React.FC = () => {
  const { 
    data, 
    isLoading, 
    error, 
    execute, 
    retry, 
    clearError 
  } = useAsyncOperation({
    component: 'AsyncExample',
    operation: 'Load User Profile'
  });

  const loadUserProfile = () => {
    execute(async () => {
      // Simulate API call that might fail
      const random = Math.random();
      if (random < 0.3) {
        throw new Error('Simulated network error');
      }
      if (random < 0.6) {
        const response = new Response('Validation failed', { status: 400 });
        throw response;
      }
      return { name: 'John Doe', email: 'john@example.com' };
    });
  };

  return (
    <Box>
      <Button variant="outlined" onClick={loadUserProfile} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load User Profile'}
      </Button>

      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={retry} 
          onDismiss={clearError}
          showDetails
        />
      )}

      {data && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography>User loaded successfully!</Typography>
          <Typography variant="body2">Name: {data.name}</Typography>
          <Typography variant="body2">Email: {data.email}</Typography>
        </Box>
      )}
    </Box>
  );
};

// Example 3: Custom Error Handling
const CustomErrorExample: React.FC = () => {
  const { 
    error, 
    handleError, 
    clearError, 
    retry 
  } = useErrorHandler({
    context: { component: 'CustomExample' },
    autoRetry: true,
    maxRetries: 2
  });

  const performComplexOperation = async () => {
    try {
      // Simulate a complex operation that might fail
      const success = Math.random() > 0.5;
      
      if (!success) {
        throw new Error('Complex operation failed - this will auto-retry');
      }
      
      alert('Complex operation succeeded!');
      clearError();
    } catch (err) {
      await handleError(err);
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={performComplexOperation}>
        Perform Complex Operation (50% fail rate)
      </Button>

      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={retry} 
          onDismiss={clearError}
        />
      )}
    </Box>
  );
};

// Example 4: Global Error
const GlobalErrorExample: React.FC = () => {
  const showGlobalError = useShowGlobalError();

  const triggerGlobalError = () => {
    // This will show up as a global snackbar notification
    const response = new Response('Internal server error', { status: 500 });
    showGlobalError(response);
  };

  const triggerSuspensionError = () => {
    const response = new Response('You are suspended until 2024-12-31', { status: 403 });
    showGlobalError(response);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={triggerGlobalError} sx={{ mr: 1 }}>
        Trigger Server Error (Global)
      </Button>
      <Button variant="outlined" onClick={triggerSuspensionError}>
        Trigger Suspension Error
      </Button>
      <Typography variant="body2" sx={{ mt: 1 }}>
        These will show as global notifications at the top-right of the screen.
      </Typography>
    </Box>
  );
};

export default ErrorHandlingExample; 