// authStringUtils.ts in WS-API

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates the password according to the following rules:
 * 1. At least one lowercase letter
 * 2. At least one uppercase letter
 * 3. At least one digit
 * 4. No whitespace
 * 5. At least MIN_PASSWORD_LENGTH characters long
 */
export function isValidPassword(password: string): boolean {
  return (
    password.trim().length >= MIN_PASSWORD_LENGTH &&
    /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/.test(password)
  );
}

/**
 * Validates a string property (non-null, non-blank, any length).
 */
export function isValidStringProperty(
  property: string,
  minLength = 0,
  maxLength = Number.MAX_SAFE_INTEGER
): boolean {
  return (
    property.trim().length >= minLength &&
    property.trim().length <= maxLength
  );
}

/**
 * Validates an email address:
 * - Not null
 * - Not blank
 * - Matches email regex
 */
export function isValidEmailAddress(email: string): boolean {
  return (
    email.trim().length > 0 &&
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
  );
}
