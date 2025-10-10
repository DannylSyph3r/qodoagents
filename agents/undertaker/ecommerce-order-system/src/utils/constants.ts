export const API_BASE_URL = 'https://api.example.com';
export const API_TIMEOUT = 30000;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const FALLBACK_API_URL = 'https://backup-api.example.com';

export const EXTENDED_TIMEOUT = 60000;

export const ENCRYPTION_SALT = 'salt-value-2024';

export const EXPERIMENTAL_FEATURES = {
  USE_NEW_CHECKOUT: false,
  ENABLE_RECOMMENDATIONS: false,
  ENABLE_WISHLIST: false
};

const INTERNAL_BUILD = '2.1.0';
const DEBUG_ENABLED = false;