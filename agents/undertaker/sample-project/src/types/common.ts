export type UUID = string;

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
  sort?: SortParams;
}

export type EntityStatus = 'active' | 'inactive' | 'archived';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';