export enum ErrorType {
  // Authentication & Authorization
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  USER_SUSPENDED = 'USER_SUSPENDED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation & Input Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource Errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NO_ORDERS_FOUND = 'NO_ORDERS_FOUND',
  
  // Business Logic Errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUPPLY_FAILED = 'SUPPLY_FAILED',
  AUCTION_ENDED = 'AUCTION_ENDED',
  BID_TOO_LOW = 'BID_TOO_LOW',
  
  // Network & System Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string;
  field?: string;
  timestamp: Date;
  context?: Record<string, any>;
  originalError?: any;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  field?: string;
  details?: string[];
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  resourceId?: string;
  additionalInfo?: Record<string, any>;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly field?: string;
  public readonly context?: ErrorContext;
  public readonly timestamp: Date;
  public readonly originalError?: any;

  constructor(
    type: ErrorType,
    message: string,
    options?: {
      code?: string;
      field?: string;
      context?: ErrorContext;
      originalError?: any;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = options?.code;
    this.field = options?.field;
    this.context = options?.context;
    this.timestamp = new Date();
    this.originalError = options?.originalError;
  }

  public toDetails(): ErrorDetails {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      field: this.field,
      timestamp: this.timestamp,
      context: this.context,
      originalError: this.originalError,
    };
  }

  public static fromApiResponse(response: ApiErrorResponse, context?: ErrorContext): AppError {
    const type = AppError.mapApiErrorToType(response, context);
    
    // For authentication errors, use predefined messages for consistent UX
    if ([ErrorType.INVALID_CREDENTIALS, ErrorType.AUTHENTICATION_FAILED].includes(type) && 
        (context?.action === 'login' || context?.action === 'register')) {
      return new AppError(type, ERROR_MESSAGES[type], {
        code: response.code,
        field: response.field,
        context,
      });
    }
    
    // For all other errors, use the backend message
    return new AppError(type, response.message, {
      code: response.code,
      field: response.field,
      context,
    });
  }

  public static fromNetworkError(error: any, context?: ErrorContext): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new AppError(ErrorType.NETWORK_ERROR, 'Network connection failed. Please check your internet connection.', {
        context,
        originalError: error,
      });
    }
    
    if (error.name === 'AbortError') {
      return new AppError(ErrorType.TIMEOUT_ERROR, 'Request timed out. Please try again.', {
        context,
        originalError: error,
      });
    }

    return new AppError(ErrorType.UNKNOWN_ERROR, 'An unexpected error occurred.', {
      context,
      originalError: error,
    });
  }

  private static mapApiErrorToType(response: ApiErrorResponse, context?: ErrorContext): ErrorType {
    const message = response.message.toLowerCase();
    const code = response.code?.toLowerCase();
    const action = context?.action?.toLowerCase();

    // Context-specific error mapping
    if (action === 'getuserorders' && (message.includes('not found') || code === '404')) {
      return ErrorType.NO_ORDERS_FOUND;
    }
    
    if (action === 'addseller' && (message.includes('not found') || code === '404')) {
      return ErrorType.USER_NOT_FOUND;
    }

    if (action === 'login' || action === 'register') {
      if (message.includes('username') && message.includes('not found')) {
        return ErrorType.INVALID_CREDENTIALS;
      }
      if (message.includes('invalid username') || message.includes('invalid password')) {
        return ErrorType.INVALID_CREDENTIALS;
      }
      if (message.includes('already in use')) {
        return ErrorType.RESOURCE_ALREADY_EXISTS;
      }
    }

    // General error mapping
    if (message.includes('unauthorized') || code === '401') {
      return ErrorType.UNAUTHORIZED;
    }
    if (message.includes('forbidden') || code === '403') {
      return ErrorType.FORBIDDEN;
    }
    if (message.includes('suspended')) {
      return ErrorType.USER_SUSPENDED;
    }
    if (message.includes('not found') || code === '404') {
      return ErrorType.RESOURCE_NOT_FOUND;
    }
    if (message.includes('already exists')) {
      return ErrorType.RESOURCE_ALREADY_EXISTS;
    }
    if (message.includes('out of stock') || message.includes('insufficient')) {
      return ErrorType.INSUFFICIENT_STOCK;
    }
    if (message.includes('payment failed')) {
      return ErrorType.PAYMENT_FAILED;
    }
    if (message.includes('supply failed')) {
      return ErrorType.SUPPLY_FAILED;
    }
    if (message.includes('auction ended')) {
      return ErrorType.AUCTION_ENDED;
    }
    if (message.includes('bid price') && message.includes('lower')) {
      return ErrorType.BID_TOO_LOW;
    }
    if (message.includes('invalid') || code === '400') {
      return ErrorType.VALIDATION_ERROR;
    }
    if (code === '500' || message.includes('internal server error')) {
      return ErrorType.SERVER_ERROR;
    }

    return ErrorType.UNKNOWN_ERROR;
  }
}

export const ERROR_MESSAGES = {
  [ErrorType.AUTHENTICATION_FAILED]: 'Authentication failed. Please log in again.',
  [ErrorType.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ErrorType.FORBIDDEN]: 'Access denied. You do not have permission to perform this action.',
  [ErrorType.USER_SUSPENDED]: 'Your account has been suspended. Please contact support.',
  [ErrorType.INVALID_CREDENTIALS]: 'Invalid username or password. Please try again.',
  [ErrorType.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorType.INVALID_INPUT]: 'The provided input is invalid.',
  [ErrorType.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [ErrorType.INVALID_FORMAT]: 'The input format is incorrect.',
  [ErrorType.RESOURCE_NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.RESOURCE_ALREADY_EXISTS]: 'This resource already exists.',
  [ErrorType.USER_NOT_FOUND]: 'User not found. Please check the username and try again.',
  [ErrorType.INSUFFICIENT_STOCK]: 'Sorry, this item is out of stock.',
  [ErrorType.PAYMENT_FAILED]: 'Payment processing failed. Please try again.',
  [ErrorType.SUPPLY_FAILED]: 'Unable to process your order. Please try again later.',
  [ErrorType.AUCTION_ENDED]: 'This auction has already ended.',
  [ErrorType.BID_TOO_LOW]: 'Your bid must be higher than the current price.',
  [ErrorType.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ErrorType.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ErrorType.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ErrorType.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait before trying again.',
  [ErrorType.NO_ORDERS_FOUND]: 'No orders found. Please check your account or try again later.',
} as const; 