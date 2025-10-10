export interface ErrorResponse {
    error: string;
    status: number;
    timestamp: Date;
    path?: string;
  }
  
  export function handleError(error: Error, path?: string): ErrorResponse {
    console.error('Error occurred:', error);
  
    return {
      error: error.message || 'Internal server error',
      status: 500,
      timestamp: new Date(),
      path
    };
  }
  
  export function notFoundError(resource: string): ErrorResponse {
    return {
      error: `${resource} not found`,
      status: 404,
      timestamp: new Date()
    };
  }
  
  export function validationError(message: string): ErrorResponse {
    return {
      error: message,
      status: 400,
      timestamp: new Date()
    };
  }
  
  export function authenticationError(): ErrorResponse {
    return {
      error: 'Unauthorized',
      status: 401,
      timestamp: new Date()
    };
  }
  
  function trackError(error: Error): void {
    console.log('Logging to monitoring service:', error);
  }
  
  const ERROR_STACK_LIMIT = 500;