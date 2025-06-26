# Error Handling System Guide

This guide explains how to use the new comprehensive error handling system in the WS-Portal frontend.

## Overview

The error handling system provides:
- Consistent error formats mapped to backend responses
- User-friendly error messages with suggested actions
- Automatic retry mechanisms for recoverable errors
- Global error notifications
- Form-specific error handling
- Detailed error logging and debugging information

## Components

### 1. Error Types and Factory (`shared/types/errors.ts`)

Defines standardized error types that map to backend HTTP responses:

```typescript
import { AppError, AppErrorFactory, ErrorType } from '../shared/types/errors';

// Example: Converting a backend error
const appError = AppErrorFactory.fromHttpError(response, responseBody, context);
```

### 2. Error Handler Utility (`shared/utils/errorHandler.ts`)

Central error processing and management:

```typescript
import { ErrorHandler, withErrorHandling } from '../shared/utils/errorHandler';

// Wrap async operations
const { data, error } = await withErrorHandling(
  () => api.someOperation(),
  { component: 'MyComponent', operation: 'Some Operation' }
);
```

### 3. Error Display Components (`shared/components/error/ErrorDisplay.tsx`)

Reusable UI components for displaying errors:

```tsx
import { ErrorDisplay, InlineError, ErrorSnackbar } from '../shared/components/error/ErrorDisplay';

// Full error display
<ErrorDisplay error={error} onRetry={handleRetry} onDismiss={clearError} />

// Compact inline error for forms
<InlineError error={error} onRetry={handleRetry} />

// Global notification
<ErrorSnackbar error={error} open={isOpen} onClose={handleClose} />
```

### 4. Error Handling Hooks (`shared/hooks/useErrorHandler.ts`)

React hooks for different error handling scenarios:

```tsx
import { useErrorHandler, useFormErrorHandler, useAsyncOperation } from '../shared/hooks/useErrorHandler';
```

### 5. Enhanced SDK (`sdk/enhancedSdk.ts`)

SDK wrapper with integrated error handling:

```typescript
import { enhancedSdk } from '../sdk/enhancedSdk';

// Automatic error conversion and context
const result = await enhancedSdk.enhancedLogin({ username, password });
```

## Usage Patterns

### 1. Form Error Handling

For forms and user input validation:

```tsx
import { useFormErrorHandler } from '../shared/hooks/useErrorHandler';
import { InlineError } from '../shared/components/error/ErrorDisplay';

const MyForm: React.FC = () => {
  const { error, handleFormSubmit, clearError } = useFormErrorHandler({
    component: 'MyForm',
    operation: 'Submit Form'
  });

  const handleSubmit = async (formData: any) => {
    const { data, error } = await handleFormSubmit(async () => {
      return await enhancedSdk.someOperation(formData);
    });

    if (data) {
      // Success handling
    }
    // Error is automatically handled by the hook
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <InlineError error={error} onDismiss={clearError} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### 2. Async Operation with Loading States

For API calls with loading states:

```tsx
import { useAsyncOperation } from '../shared/hooks/useErrorHandler';
import { ErrorDisplay } from '../shared/components/error/ErrorDisplay';

const MyComponent: React.FC = () => {
  const { data, isLoading, error, execute, retry, clearError } = useAsyncOperation({
    component: 'MyComponent',
    operation: 'Load Data'
  });

  const loadData = () => {
    execute(async () => {
      return await enhancedSdk.getData();
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={retry} 
          onDismiss={clearError} 
        />
      )}
      {data && <div>{/* Render data */}</div>}
      <button onClick={loadData}>Load Data</button>
    </div>
  );
};
```

### 3. Global Error Provider

Wrap your app with the error provider for global error handling:

```tsx
import { ErrorProvider } from '../shared/providers/ErrorProvider';

const App: React.FC = () => {
  return (
    <ErrorProvider>
      {/* Your app components */}
    </ErrorProvider>
  );
};
```

### 4. Custom Error Handling

For custom error scenarios:

```tsx
import { useErrorHandler } from '../shared/hooks/useErrorHandler';

const MyComponent: React.FC = () => {
  const { error, handleError, clearError, retry } = useErrorHandler({
    context: { component: 'MyComponent' },
    autoRetry: true,
    maxRetries: 3
  });

  const performOperation = async () => {
    try {
      const result = await someAsyncOperation();
      // Success
    } catch (err) {
      await handleError(err);
    }
  };

  return (
    <div>
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={retry} 
          onDismiss={clearError} 
        />
      )}
    </div>
  );
};
```

## Error Types and Backend Mapping

The system automatically maps backend HTTP responses to user-friendly errors:

| HTTP Status | Error Type | User Message | Suggested Actions |
|-------------|------------|--------------|-------------------|
| 400 | `VALIDATION_ERROR` | "Please check your input and try again." | Check required fields, Verify input format |
| 401 | `AUTHENTICATION_FAILED` | "Please log in to continue." | Log in again, Clear browser cache |
| 403 (suspended) | `USER_SUSPENDED` | "Your account has been temporarily suspended." | None (non-actionable) |
| 403 (username not found) | `USERNAME_NOT_FOUND` | "The username you entered was not found." | Check username spelling, Register new account |
| 403 (other) | `AUTHORIZATION_DENIED` | "You don't have permission to perform this action." | None |
| 404 | `RESOURCE_NOT_FOUND` | "The item you're looking for could not be found." | Check URL, Go back and try again |
| 412 (payment) | `PAYMENT_FAILED` | "Your payment could not be processed." | Check payment details, Try different method |
| 412 (supply) | `SUPPLY_FAILED` | "The order could not be fulfilled due to supply issues." | Try again later, Choose different products |
| 500 | `INTERNAL_SERVER_ERROR` | "Something went wrong on our end. Please try again later." | Try again later, Contact support |

## Error Context

Provide context for better debugging and user experience:

```typescript
const context: ErrorContext = {
  operation: 'Create Order',
  component: 'OrderPage',
  userId: currentUser.id,
  resourceId: productId,
  additionalData: { orderValue: 150.00 }
};
```

## Best Practices

1. **Always provide context** when calling SDK methods or handling errors
2. **Use appropriate error display components** for different UI scenarios
3. **Handle success cases explicitly** after async operations
4. **Provide retry mechanisms** for recoverable errors
5. **Clear errors** when operations succeed or when users dismiss them
6. **Use enhanced SDK methods** for automatic error handling
7. **Wrap your app** with ErrorProvider for global error handling

## Migration from Old Error Handling

### Before:
```tsx
const [error, setError] = useState('');

try {
  await sdk.login({ username, password });
  // success
} catch (err) {
  setError(err.message);
}

{error && <Typography color="error">{error}</Typography>}
```

### After:
```tsx
const { error, handleFormSubmit, clearError } = useFormErrorHandler();

const { data } = await handleFormSubmit(async () => {
  return await enhancedSdk.enhancedLogin({ username, password });
});

<InlineError error={error} onDismiss={clearError} />
```

## Debugging

The system provides detailed logging for debugging:

- Error type and severity
- HTTP status codes
- Full error context
- Stack traces for development
- User agent and URL information

Check the browser console for detailed error information during development. 