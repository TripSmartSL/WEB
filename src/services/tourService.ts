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

interface PaginatedResponse<T> {
  tours: T[]; // Based on your tour.repository.ts, the key is 'tours'
  pagination: {
    total: number;
  };
}

export const tourService = {
  // Get all tours with filters, now returning full paginated response
  async getTours(params?: ToursListParams): Promise<PaginatedResponse<Tour>> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Tour>>>( // The backend returns a paginated response
        API_PATHS.TOURS.LIST,
        { params }
      );
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      // Return an empty paginated response on failure or no data
      return { tours: [], pagination: { total: 0 } };
    } catch (error: any) {
      console.error('Failed to fetch tours:', error);
      // Return an empty array on error to prevent crashes in the UI
      return { tours: [], pagination: { total: 0 } };
    }
  },

  // Get single tour by ID
  async getTourById(id: string): Promise<Tour | undefined> {
    const response = await axiosInstance.get<ApiResponse<Tour>>(
      API_PATHS.TOURS.DETAIL(id)
    );
    return response.data.data;
  },

  // Create new tour (Admin)
  async createTour(tourData: Omit<Tour, 'id' | 'rating' | 'reviewsCount'>): Promise<Tour> {
    const response = await axiosInstance.post<ApiResponse<Tour>>(
      API_PATHS.TOURS.CREATE,
      tourData
    );
    return response.data.data;
  },

  // Update tour (Admin)
  async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
    const response = await axiosInstance.put<ApiResponse<Tour>>(
      API_PATHS.TOURS.UPDATE(id),
      tourData
    );
    return response.data.data;
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
