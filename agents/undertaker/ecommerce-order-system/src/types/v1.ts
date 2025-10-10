export interface V1User {
    user_id: string;
    user_name: string;
    user_email: string;
    created_timestamp: number;
    is_active: boolean;
  }
  
  export interface V1Product {
    product_id: string;
    product_name: string;
    product_price: number;
    product_category: string;
    in_stock: boolean;
  }
  
  export interface V1Order {
    order_id: string;
    user_id: string;
    order_date: number;
    order_total: number;
    order_status: V1OrderStatus;
  }
  
  export enum V1OrderStatus {
    NEW = 0,
    PROCESSING = 1,
    COMPLETED = 2,
    CANCELLED = 3
  }
  
  export interface V1Payment {
    payment_id: string;
    order_id: string;
    payment_method: string;
    payment_amount: number;
    payment_status: string;
    transaction_id?: string;
  }
  
  export interface V1Address {
    address_id: string;
    user_id: string;
    street_address: string;
    city_name: string;
    state_code: string;
    zip_code: string;
    country_code: string;
  }
  
  export type V1Role = 'user' | 'admin' | 'moderator' | 'guest';
  
  export interface V1Permissions {
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean;
    can_admin: boolean;
  }
  
  export interface V1ApiResponse<T> {
    success: boolean;
    data?: T;
    error_code?: number;
    error_message?: string;
    timestamp: number;
  }
  
  export interface V1PaginationMeta {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  }
  
  export interface V1SearchQuery {
    search_term: string;
    search_fields: string[];
    filters: V1FilterConfig[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }
  
  export interface V1FilterConfig {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'like';
    value: any;
  }
  
  export type V1ValidationRule = {
    field: string;
    required: boolean;
    type: 'string' | 'number' | 'boolean' | 'date';
    min?: number;
    max?: number;
    pattern?: string;
  };
  
  export interface V1Config {
    api_endpoint: string;
    api_key: string;
    timeout_ms: number;
    retry_attempts: number;
    enable_logging: boolean;
    log_level: 'debug' | 'info' | 'warn' | 'error';
  }
  
  export const V1_CONSTANTS = {
    MAX_RETRY: 3,
    DEFAULT_TIMEOUT: 30000,
    API_VERSION: '1.0',
    ENCRYPTION_ALGORITHM: 'AES-256'
  } as const;
  
  export function migrateUser(v1User: V1User): any {
    return {
      id: v1User.user_id,
      name: v1User.user_name,
      email: v1User.user_email,
      createdAt: new Date(v1User.created_timestamp),
      isActive: v1User.is_active
    };
  }
  
  export function migrateOrder(v1Order: V1Order): any {
    return {
      id: v1Order.order_id,
      userId: v1Order.user_id,
      orderDate: new Date(v1Order.order_date),
      total: v1Order.order_total,
      status: mapOrderStatus(v1Order.order_status)
    };
  }
  
  function mapOrderStatus(status: V1OrderStatus): string {
    switch (status) {
      case V1OrderStatus.NEW:
        return 'pending';
      case V1OrderStatus.PROCESSING:
        return 'processing';
      case V1OrderStatus.COMPLETED:
        return 'completed';
      case V1OrderStatus.CANCELLED:
        return 'cancelled';
      default:
        return 'unknown';
    }
  }