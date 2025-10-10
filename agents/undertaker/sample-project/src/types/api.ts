export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
  }
  
  export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: any;
  }
  
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  export interface RequestConfig {
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
  }
  
  export interface WebhookPayload {
    event: string;
    timestamp: Date;
    data: any;
    signature?: string;
  }
  
  export type ApiVersion = 'v1' | 'v2' | 'v3';
  
  export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: Date;
  }