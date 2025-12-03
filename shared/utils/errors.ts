export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, "AUTH_ERROR", 401)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, "AUTHZ_ERROR", 403)
    this.name = "AuthorizationError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details)
    this.name = "ValidationError"
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network request failed") {
    super(message, "NETWORK_ERROR", 0)
    this.name = "NetworkError"
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", 500)
  }

  return new AppError("An unknown error occurred", "UNKNOWN_ERROR", 500)
}
