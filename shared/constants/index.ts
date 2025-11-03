export const JWT_EXPIRES_IN = '7d';
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  INVALID_USERNAME: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error'
} as const;
