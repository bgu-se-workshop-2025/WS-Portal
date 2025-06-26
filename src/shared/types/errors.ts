export enum ErrorType {
  // Authentication & Authorization
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  AUTHORIZATION_DENIED = 'AUTHORIZATION_DENIED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USERNAME_NOT_FOUND = 'USERNAME_NOT_FOUND',
  
  // Validation & Business Logic
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUPPLY_FAILED = 'SUPPLY_FAILED',
  
  // Inventory & Stock Management
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PRODUCT_OUT_OF_STOCK = 'PRODUCT_OUT_OF_STOCK',
  
  // Store Creation & Management
  STORE_NAME_REQUIRED = 'STORE_NAME_REQUIRED',
  STORE_NAME_INVALID = 'STORE_NAME_INVALID',
  STORE_ALREADY_EXISTS = 'STORE_ALREADY_EXISTS',
  
  // Product Creation & Management
  PRODUCT_NAME_REQUIRED = 'PRODUCT_NAME_REQUIRED',
  PRODUCT_PRICE_INVALID = 'PRODUCT_PRICE_INVALID',
  PRODUCT_QUANTITY_INVALID = 'PRODUCT_QUANTITY_INVALID',
  PRODUCT_AUCTION_DATE_INVALID = 'PRODUCT_AUCTION_DATE_INVALID',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Resource Not Found
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  
  // Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  title: string;
  message: string;
  details?: string;
  statusCode?: number;
  timestamp: number;
  userFriendlyMessage: string;
  actionable: boolean;
  suggestedActions?: string[];
  retryable: boolean;
}

export interface ErrorContext {
  operation?: string;
  component?: string;
  userId?: string;
  resourceId?: string;
  additionalData?: Record<string, any>;
}

export class AppErrorFactory {
  private static createBaseError(
    type: ErrorType,
    severity: ErrorSeverity,
    title: string,
    message: string,
    userFriendlyMessage: string,
    actionable: boolean = false,
    retryable: boolean = false
  ): Omit<AppError, 'timestamp'> {
    return {
      type,
      severity,
      title,
      message,
      userFriendlyMessage,
      actionable,
      retryable
    };
  }

  static fromHttpError(response: Response, responseBody: string, context?: ErrorContext): AppError {
    const timestamp = Date.now();
    const statusCode = response.status;

    switch (statusCode) {
      case 400:
        // Check if this is a login operation with invalid credentials
        if ((context?.operation === 'User Login' || context?.component === 'LoginPage') && 
            responseBody.toLowerCase().includes('invalid')) {
          return {
            ...this.createBaseError(
              ErrorType.INVALID_CREDENTIALS,
              ErrorSeverity.WARNING,
              'Invalid Credentials',
              'The username or password you entered is incorrect',
              'The username or password you entered is incorrect. Please check your credentials and try again.',
              true,
              true
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
          };
        }

        // Check for inventory-related errors in cart operations
        if ((context?.operation === 'Add Product to Cart' || context?.operation === 'Update Product in Cart') &&
            (responseBody.toLowerCase().includes('insufficient stock') || 
             responseBody.toLowerCase().includes('not enough') ||
             responseBody.toLowerCase().includes('quantity exceeds') ||
             responseBody.toLowerCase().includes('stock limit'))) {
          return {
            ...this.createBaseError(
              ErrorType.INSUFFICIENT_STOCK,
              ErrorSeverity.WARNING,
              'Insufficient Stock',
              responseBody,
              'There isn\'t enough stock available for the quantity you requested.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Reduce the quantity', 'Check available stock', 'Try again later when restocked']
          };
        }

        if ((context?.operation === 'Add Product to Cart' || context?.operation === 'Update Product in Cart') &&
            (responseBody.toLowerCase().includes('out of stock') || 
             responseBody.toLowerCase().includes('no stock') ||
             responseBody.toLowerCase().includes('unavailable') ||
             responseBody.toLowerCase().includes('product not available'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_OUT_OF_STOCK,
              ErrorSeverity.WARNING,
              'Product Out of Stock',
              responseBody,
              'This product is currently out of stock.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Choose a different product', 'Try again later', 'Contact the store for restock information']
          };
        }

        // Check for store creation/management errors
        if (context?.operation === 'Create Store' &&
            (responseBody.toLowerCase().includes('store must have a non-empty name') ||
             responseBody.toLowerCase().includes('store name') ||
             responseBody.toLowerCase().includes('non-empty name'))) {
          return {
            ...this.createBaseError(
              ErrorType.STORE_NAME_REQUIRED,
              ErrorSeverity.WARNING,
              'Store Name Required',
              responseBody,
              'Store name is required and cannot be empty.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Enter a valid store name', 'Make sure the name is not just spaces']
          };
        }

        if (context?.operation === 'Create Store' &&
            (responseBody.toLowerCase().includes('store already exists') ||
             responseBody.toLowerCase().includes('already exists'))) {
          return {
            ...this.createBaseError(
              ErrorType.STORE_ALREADY_EXISTS,
              ErrorSeverity.WARNING,
              'Store Already Exists',
              responseBody,
              'A store with this information already exists.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Choose a different store name', 'Check if you already own this store']
          };
        }

        // Check for product creation/management errors
        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('product must have a non-empty name') ||
             responseBody.toLowerCase().includes('product name') ||
             responseBody.toLowerCase().includes('non-empty name'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_NAME_REQUIRED,
              ErrorSeverity.WARNING,
              'Product Name Required',
              responseBody,
              'Product name is required and cannot be empty.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Enter a valid product name', 'Make sure the name is not just spaces']
          };
        }

        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('product already exists') ||
             responseBody.toLowerCase().includes('already exists'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_ALREADY_EXISTS,
              ErrorSeverity.WARNING,
              'Product Already Exists',
              responseBody,
              'A product with this information already exists.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Choose a different product name', 'Check if this product already exists in the store']
          };
        }

        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('price must be positive') ||
             responseBody.toLowerCase().includes('positive price') ||
             responseBody.toLowerCase().includes('invalid price'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_PRICE_INVALID,
              ErrorSeverity.WARNING,
              'Invalid Product Price',
              responseBody,
              'Product price must be a positive number greater than zero.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Enter a price greater than 0', 'Check that the price is a valid number']
          };
        }

        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('quantity cannot be negative') ||
             responseBody.toLowerCase().includes('negative quantity') ||
             responseBody.toLowerCase().includes('invalid quantity'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_QUANTITY_INVALID,
              ErrorSeverity.WARNING,
              'Invalid Product Quantity',
              responseBody,
              'Product quantity cannot be negative.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Enter a quantity of 0 or greater', 'Check that the quantity is a valid number']
          };
        }

        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('auction end date must be in the future') ||
             responseBody.toLowerCase().includes('future date') ||
             responseBody.toLowerCase().includes('invalid auction date'))) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_AUCTION_DATE_INVALID,
              ErrorSeverity.WARNING,
              'Invalid Auction End Date',
              responseBody,
              'Auction end date must be set to a future date and time.',
              true,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Set a future date for auction end', 'Remove auction date if not creating an auction product']
          };
        }

        return {
          ...this.createBaseError(
            ErrorType.VALIDATION_ERROR,
            ErrorSeverity.WARNING,
            'Invalid Request',
            responseBody || 'Bad request',
            'Please check your input and try again.',
            true,
            false
          ),
          statusCode,
          timestamp,
          details: responseBody,
          suggestedActions: ['Check all required fields', 'Verify input format']
        };

      case 401:
        // Check if this is a login operation with invalid credentials
        if (context?.operation === 'User Login' || context?.component === 'LoginPage') {
          return {
            ...this.createBaseError(
              ErrorType.INVALID_CREDENTIALS,
              ErrorSeverity.WARNING,
              'Invalid Credentials',
              'The username or password you entered is incorrect',
              'The username or password you entered is incorrect. Please check your credentials and try again.',
              true,
              true
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
          };
        }

        // Generic authentication failure (token expired, etc.)
        return {
          ...this.createBaseError(
            ErrorType.AUTHENTICATION_FAILED,
            ErrorSeverity.ERROR,
            'Authentication Required',
            'Authentication failed or token expired',
            'Please log in to continue.',
            true,
            false
          ),
          statusCode,
          timestamp,
          suggestedActions: ['Log in again', 'Clear browser cache']
        };

      case 403:
        if (responseBody.includes('suspended')) {
          return {
            ...this.createBaseError(
              ErrorType.USER_SUSPENDED,
              ErrorSeverity.CRITICAL,
              'Account Suspended',
              responseBody,
              'Your account has been temporarily suspended.',
              false,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody
          };
        }
        
        if (responseBody.includes('not found')) {
          return {
            ...this.createBaseError(
              ErrorType.USERNAME_NOT_FOUND,
              ErrorSeverity.WARNING,
              'User Not Found',
              responseBody,
              'The username you entered was not found.',
              true,
              false
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Check username spelling', 'Register a new account']
          };
        }

        // Check if this is a login operation for better messaging
        if (context?.operation === 'User Login' || context?.component === 'LoginPage') {
          return {
            ...this.createBaseError(
              ErrorType.INVALID_CREDENTIALS,
              ErrorSeverity.WARNING,
              'Invalid Credentials',
              'The username or password you entered is incorrect',
              'The username or password you entered is incorrect. Please check your credentials and try again.',
              true,
              true
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
          };
        }

        // Check for product creation permission errors
        if (context?.operation === 'Create Product' &&
            (responseBody.toLowerCase().includes('permission') ||
             responseBody.toLowerCase().includes('unauthorized') ||
             responseBody.toLowerCase().includes('not authorized'))) {
          return {
            ...this.createBaseError(
              ErrorType.INSUFFICIENT_PERMISSIONS,
              ErrorSeverity.ERROR,
              'Insufficient Permissions',
              responseBody,
              'You don\'t have permission to create products in this store.',
              false,
              false
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Contact the store owner', 'Check if you are a manager/owner of this store']
          };
        }

        return {
          ...this.createBaseError(
            ErrorType.AUTHORIZATION_DENIED,
            ErrorSeverity.ERROR,
            'Access Denied',
            responseBody || 'You do not have permission to perform this action',
            'You don\'t have permission to perform this action.',
            false,
            false
          ),
          statusCode,
          timestamp
        };

      case 404:
        // Check if this is a login operation (username not found)
        if (context?.operation === 'User Login' || context?.component === 'LoginPage') {
          return {
            ...this.createBaseError(
              ErrorType.INVALID_CREDENTIALS,
              ErrorSeverity.WARNING,
              'Invalid Credentials',
              'The username or password you entered is incorrect',
              'The username or password you entered is incorrect. Please check your credentials and try again.',
              true,
              true
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
          };
        }

        return {
          ...this.createBaseError(
            ErrorType.RESOURCE_NOT_FOUND,
            ErrorSeverity.WARNING,
            'Not Found',
            'The requested resource was not found',
            'The item you\'re looking for could not be found.',
            true,
            true
          ),
          statusCode,
          timestamp,
          suggestedActions: ['Check the URL', 'Go back and try again', 'Contact support if this persists']
        };

      case 412:
        if (responseBody.includes('payment')) {
          return {
            ...this.createBaseError(
              ErrorType.PAYMENT_FAILED,
              ErrorSeverity.ERROR,
              'Payment Failed',
              responseBody,
              'Your payment could not be processed.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Check payment details', 'Try a different payment method', 'Contact your bank']
          };
        }

        if (responseBody.includes('supply')) {
          return {
            ...this.createBaseError(
              ErrorType.SUPPLY_FAILED,
              ErrorSeverity.ERROR,
              'Supply Failed',
              responseBody,
              'The order could not be fulfilled due to supply issues.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Try again later', 'Choose different products', 'Contact the store']
          };
        }

        if (responseBody.toLowerCase().includes('insufficient stock') || 
            responseBody.toLowerCase().includes('not enough') ||
            responseBody.toLowerCase().includes('quantity exceeds')) {
          return {
            ...this.createBaseError(
              ErrorType.INSUFFICIENT_STOCK,
              ErrorSeverity.WARNING,
              'Insufficient Stock',
              responseBody,
              'There isn\'t enough stock available for the quantity you requested.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Reduce the quantity', 'Check available stock', 'Try again later when restocked']
          };
        }

        if (responseBody.toLowerCase().includes('out of stock') || 
            responseBody.toLowerCase().includes('no stock') ||
            responseBody.toLowerCase().includes('unavailable')) {
          return {
            ...this.createBaseError(
              ErrorType.PRODUCT_OUT_OF_STOCK,
              ErrorSeverity.WARNING,
              'Product Out of Stock',
              responseBody,
              'This product is currently out of stock.',
              true,
              true
            ),
            statusCode,
            timestamp,
            details: responseBody,
            suggestedActions: ['Choose a different product', 'Try again later', 'Contact the store for restock information']
          };
        }

        return {
          ...this.createBaseError(
            ErrorType.VALIDATION_ERROR,
            ErrorSeverity.WARNING,
            'Precondition Failed',
            responseBody,
            'The operation could not be completed due to current conditions.',
            true,
            true
          ),
          statusCode,
          timestamp,
          details: responseBody
        };

      case 500:
        // Check if this is a login operation (invalid credentials causing server error)
        if (context?.operation === 'User Login' || context?.component === 'LoginPage') {
          return {
            ...this.createBaseError(
              ErrorType.INVALID_CREDENTIALS,
              ErrorSeverity.WARNING,
              'Invalid Credentials',
              'The username or password you entered is incorrect',
              'The username or password you entered is incorrect. Please check your credentials and try again.',
              true,
              true
            ),
            statusCode,
            timestamp,
            suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
          };
        }

        return {
          ...this.createBaseError(
            ErrorType.INTERNAL_SERVER_ERROR,
            ErrorSeverity.CRITICAL,
            'Server Error',
            'An internal server error occurred',
            'Something went wrong on our end. Please try again later.',
            false,
            true
          ),
          statusCode,
          timestamp,
          suggestedActions: ['Try again later', 'Contact support if the problem persists']
        };

      default:
        return {
          ...this.createBaseError(
            ErrorType.UNKNOWN_ERROR,
            ErrorSeverity.ERROR,
            'Unexpected Error',
            `HTTP ${statusCode}: ${responseBody}`,
            'An unexpected error occurred.',
            false,
            true
          ),
          statusCode,
          timestamp,
          details: responseBody,
          suggestedActions: ['Try again', 'Contact support if the problem persists']
        };
    }
  }

  static fromNetworkError(error: Error, context?: ErrorContext): AppError {
    return {
      ...this.createBaseError(
        ErrorType.NETWORK_ERROR,
        ErrorSeverity.ERROR,
        'Network Error',
        error.message,
        'Unable to connect to the server. Please check your internet connection.',
        true,
        true
      ),
      timestamp: Date.now(),
      details: error.stack,
      suggestedActions: ['Check internet connection', 'Try again', 'Contact support if the problem persists']
    };
  }

  static fromGenericError(error: Error, context?: ErrorContext): AppError {
    return {
      ...this.createBaseError(
        ErrorType.UNKNOWN_ERROR,
        ErrorSeverity.ERROR,
        'Unexpected Error',
        error.message,
        'An unexpected error occurred.',
        false,
        true
      ),
      timestamp: Date.now(),
      details: error.stack,
      suggestedActions: ['Try again', 'Contact support if the problem persists']
    };
  }
} 