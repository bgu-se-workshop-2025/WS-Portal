import React from 'react';
import {
  Alert,
  AlertTitle,
  AlertColor,
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { AppError } from '../../types/errors';
import { ErrorSeverity } from '../../types/errors';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

interface ErrorSnackbarProps {
  error: AppError | null;
  open: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

interface InlineErrorProps {
  error: AppError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

// Utility function to map error severity to Material-UI alert severity
const getSeverityColor = (severity: ErrorSeverity): AlertColor => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'error';
  }
};

// Utility function to get appropriate icon for severity
const getSeverityIcon = (severity: ErrorSeverity) => {
  switch (severity) {
    case 'critical':
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    default:
      return <ErrorIcon />;
  }
};

// Main error display component
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  compact = false,
  className
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const severity = getSeverityColor(error.severity);

  if (compact) {
    return (
      <Box className={className} sx={{ mb: 1 }}>
        <Alert severity={severity} variant="outlined">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body2">{error.userFriendlyMessage}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {error.retryable && onRetry && (
                <IconButton size="small" onClick={onRetry} color="inherit">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )}
              {onDismiss && (
                <IconButton size="small" onClick={onDismiss} color="inherit">
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ mb: 2 }}>
      <Alert severity={severity} variant="filled">
        <AlertTitle>{error.title}</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {error.userFriendlyMessage}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: error.suggestedActions?.length ? 1 : 0 }}>
          {error.retryable && onRetry && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ color: 'inherit', borderColor: 'currentColor' }}
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              size="small"
              variant="text"
              onClick={onDismiss}
              sx={{ color: 'inherit' }}
            >
              Dismiss
            </Button>
          )}
        </Box>

        {/* Suggested actions */}
        {error.suggestedActions && error.suggestedActions.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
              Suggestions:
            </Typography>
            <List dense sx={{ pt: 0 }}>
              {error.suggestedActions.map((action, index) => (
                <ListItem key={index} sx={{ py: 0, px: 0 }}>
                  <ListItemText
                    primary={action}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Details section */}
        {(showDetails || error.details) && (
          <Box>
            <Button
              size="small"
              variant="text"
              onClick={() => setDetailsOpen(!detailsOpen)}
              endIcon={detailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ color: 'inherit', p: 0, minHeight: 'auto' }}
            >
              {detailsOpen ? 'Hide Details' : 'Show Details'}
            </Button>
            <Collapse in={detailsOpen}>
              <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                  <strong>Error Type:</strong> {error.type}
                  <br />
                  <strong>Status Code:</strong> {error.statusCode || 'N/A'}
                  <br />
                  <strong>Timestamp:</strong> {new Date(error.timestamp).toLocaleString()}
                  <br />
                  {error.details && (
                    <>
                      <strong>Details:</strong>
                      <br />
                      {error.details}
                    </>
                  )}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

// Inline error component for forms and smaller spaces
export const InlineError: React.FC<InlineErrorProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false
}) => {
  if (!error) return null;

  return (
    <ErrorDisplay
      error={error}
      onRetry={onRetry}
      onDismiss={onDismiss}
      showDetails={showDetails}
      compact
    />
  );
};

// Snackbar error component for global notifications
export const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  error,
  open,
  onClose,
  onRetry
}) => {
  if (!error) return null;

  const severity = getSeverityColor(error.severity);

  return (
    <Snackbar
      open={open}
      autoHideDuration={error.severity === 'critical' ? null : 6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        severity={severity} 
        onClose={onClose}
        variant="filled"
        sx={{ minWidth: 300 }}
        action={
          error.retryable && onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{error.title}</AlertTitle>
        {error.userFriendlyMessage}
      </Alert>
    </Snackbar>
  );
};

// Error boundary fallback component
interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        p: 3,
        textAlign: 'center'
      }}
    >
      <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        An unexpected error occurred. Please try refreshing the page.
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary} startIcon={<RefreshIcon />}>
        Try Again
      </Button>
    </Box>
  );
}; 