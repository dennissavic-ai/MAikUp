import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    userId: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface CatalogFilterQuery extends PaginationQuery {
  category?: string;
  subcategory?: string;
  tier?: string;
  search?: string;
  finish?: string;
  tags?: string;
}

export interface HairstyleFilterQuery extends PaginationQuery {
  category?: string;
  subcategory?: string;
  tier?: string;
  search?: string;
  length?: string;
  texture?: string;
  tags?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
