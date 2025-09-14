export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly originalError: any;

  constructor(message: string, statusCode: number, originalError?: any) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  static fromAxiosError(error: any): HttpError {
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const message = error.response.data?.message
        || error.response.data?.error
        || `HTTP ${statusCode} error occurred`;
      return new HttpError(message, statusCode, error);
    } else if (error.request) {
      // Network error
      return new HttpError('Unable to connect to the service. Please try again later.', 503, error);
    } else {
      // Request setup error
      return new HttpError('An unexpected error occurred. Please try again.', 500, error);
    }
  }
}