import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';
import type { Tour } from '@/types';

interface ToursListParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

interface ToursListResponse {
  tours: Tour[];
  total: number;
  page: number;
  totalPages: number;
  items: Tour[];
}

export const tourService = {
  // Get all tours with filters
  async getTours(params?: ToursListParams): Promise<Tour[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<ToursListResponse>>(
        API_PATHS.TOURS.LIST,
        { params }
      );
      
     if (!response.data.success || !response.data.data?.items) {
  console.error('Invalid tours response:', response.data);
  throw new Error(response.data.message || 'Failed to fetch tours');
}

return response.data.data.items;

    } catch (error: any) {
      console.error('Failed to fetch tours:', error);
      // Re-throw the error with a user-friendly message
      throw new Error(error?.response?.data?.message || 'Failed to load tours. Please try again later.');
    }
  },

  // Get single tour by ID
  async getTourById(id: string): Promise<Tour | undefined> {
    const response = await axiosInstance.get<Tour>(
      API_PATHS.TOURS.DETAIL(id)
    );
    return response.data;
  },

  // Create new tour (Admin)
  async createTour(tourData: Omit<Tour, 'id'>): Promise<Tour> {
    const response = await axiosInstance.post<Tour>(
      API_PATHS.TOURS.CREATE,
      tourData
    );
    return response.data;
  },

  // Update tour (Admin)
  async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
    const response = await axiosInstance.put<Tour>(
      API_PATHS.TOURS.UPDATE(id),
      tourData
    );
    return response.data;
  },

  // Delete tour (Admin)
  async deleteTour(id: string): Promise<void> {
    await axiosInstance.delete(API_PATHS.TOURS.DELETE(id));
  },

  // Get tour categories
  async getCategories(): Promise<string[]> {
    const response = await axiosInstance.get<{ categories: string[] }>(
      API_PATHS.TOURS.CATEGORIES
    );
    return response.data.categories;
  },
};
