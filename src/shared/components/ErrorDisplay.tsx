import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AppError, ErrorType } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';

interface ErrorDisplayProps {
  error: AppError | string | null;
  title?: string;
  showDetails?: boolean;
  showRetry?: boolean;
  showClose?: boolean;
  onRetry?: () => void;
  onClose?: () => void;
  variant?: 'alert' | 'chip' | 'inline';
  severity?: 'error' | 'warning' | 'info';
  maxWidth?: string | number;
  sx?: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  showDetails = false,
  showRetry = false,
  showClose = false,
  onRetry,
  onClose,
  variant = 'alert',
  severity = 'error',
  maxWidth = '100%',
  sx,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!error) return null;

  const appError = typeof error === 'string' 
    ? new AppError(ErrorType.UNKNOWN_ERROR, error)
    : error;

  const getSeverity = (type: ErrorType): 'error' | 'warning' | 'info' => {
    switch (type) {
      case ErrorType.USER_SUSPENDED:
      case ErrorType.FORBIDDEN:
      case ErrorType.PAYMENT_FAILED:
      case ErrorType.SUPPLY_FAILED:
        return 'error';
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.INVALID_INPUT:
      case ErrorType.MISSING_REQUIRED_FIELD:
        return 'warning';
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT_ERROR:
      case ErrorType.RATE_LIMIT_EXCEEDED:
        return 'info';
      default:
        return severity;
    }
  };

  const getIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.INVALID_INPUT:
        return <WarningIcon />;
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT_ERROR:
        return <InfoIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  const getErrorTitle = (type: ErrorType) => {
    switch (type) {
      case ErrorType.USER_SUSPENDED:
        return 'Account Suspended';
      case ErrorType.FORBIDDEN:
        return 'Access Denied';
      case ErrorType.VALIDATION_ERROR:
        return 'Validation Error';
      case ErrorType.NETWORK_ERROR:
        return 'Connection Error';
      case ErrorType.PAYMENT_FAILED:
        return 'Payment Failed';
      case ErrorType.SUPPLY_FAILED:
        return 'Order Processing Failed';
      default:
        return title || 'Error';
    }
  };

  if (variant === 'chip') {
    return (
      <Chip
        icon={<ErrorIcon />}
        label={ErrorHandler.getUserFriendlyMessage(appError)}
        color={getSeverity(appError.type)}
        variant="outlined"
        onDelete={onClose}
        deleteIcon={onRetry ? <RefreshIcon /> : <CloseIcon />}
        onClick={onRetry}
        sx={{ maxWidth: '100%' }}
      />
    );
  }

  if (variant === 'inline') {
    return (
      <Typography
        color="error"
        variant="body2"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}
      >
        <ErrorIcon fontSize="small" />
        {ErrorHandler.getUserFriendlyMessage(appError)}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth, ...sx }}>
      <Alert
        severity={getSeverity(appError.type)}
        icon={getIcon(appError.type)}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showRetry && onRetry && (
              <IconButton
                size="small"
                onClick={onRetry}
                color="inherit"
                aria-label="Retry"
              >
                <RefreshIcon />
              </IconButton>
            )}
            {showDetails && (
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                color="inherit"
                aria-label="Toggle details"
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            {showClose && onClose && (
              <IconButton
                size="small"
                onClick={onClose}
                color="inherit"
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        }
      >
        <AlertTitle>{getErrorTitle(appError.type)}</AlertTitle>
        {ErrorHandler.getUserFriendlyMessage(appError)}
        
        {showDetails && (
          <Collapse in={expanded}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Error Details:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" fontSize="0.875rem">
                Type: {appError.type}
              </Typography>
              {appError.code && (
                <Typography variant="body2" fontFamily="monospace" fontSize="0.875rem">
                  Code: {appError.code}
                </Typography>
              )}
              {appError.field && (
                <Typography variant="body2" fontFamily="monospace" fontSize="0.875rem">
                  Field: {appError.field}
                </Typography>
              )}
              {appError.context && (
                <Typography variant="body2" fontFamily="monospace" fontSize="0.875rem">
                  Context: {JSON.stringify(appError.context, null, 2)}
                </Typography>
              )}
            </Box>
          </Collapse>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay; 