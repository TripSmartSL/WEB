import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';
import type { Tour } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface TourQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface PaginatedToursResponse {
  tours: Tour[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const tourService = {
  async getTours(params?: TourQuery): Promise<PaginatedToursResponse> {
    const response = await axiosInstance.get<ApiResponse<PaginatedToursResponse>>(API_PATHS.TOURS.LIST, { params });
    return response.data.data;
  },
  async getCategories(): Promise<string[]> {
    const response = await axiosInstance.get<ApiResponse<{ categories: string[] }>>(API_PATHS.TOURS.CATEGORIES);
    if (response.data.success && response.data.data.categories) {
      return response.data.data.categories;
    } else {
      console.error("Failed to parse categories from response:", response.data);
      return [];
    }
  },
  async getTourById(id: string): Promise<Tour> {
    const response = await axiosInstance.get<ApiResponse<Tour>>(API_PATHS.TOURS.DETAIL(id));
    return response.data.data;
  },
};