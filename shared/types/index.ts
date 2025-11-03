export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
