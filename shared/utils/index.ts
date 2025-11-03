export class CustomError extends Error implements AppError {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function safeValue<T>(value: T | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

export function validateString(value: string | undefined, fieldName: string): string {
  if (!value) {
    throw new CustomError(`${fieldName} is required`, 400);
  }
  return value;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatDate(date: Date): string {
  return date.toISOString();
}
