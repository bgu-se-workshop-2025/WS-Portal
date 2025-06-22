import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { AppError, ErrorType } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the error
    const appError = new AppError(ErrorType.UNKNOWN_ERROR, error.message, {
      originalError: error,
      context: {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
        additionalInfo: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    ErrorHandler.logError(appError);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when props change (if enabled)
    if (this.props.resetOnPropsChange && prevProps !== this.props) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box mt={3} p={2} bgcolor="rgba(0,0,0,0.04)" borderRadius={1} textAlign="left">
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Only)
                </Typography>
                <Typography variant="body2" fontFamily="monospace" whiteSpace="pre-wrap">
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="body2" fontFamily="monospace" whiteSpace="pre-wrap" mt={2}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}

            <Box mt={4} display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block" mt={2}>
              If this problem persists, please contact support with error ID: {Date.now()}
            </Typography>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 