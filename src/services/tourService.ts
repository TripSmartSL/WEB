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
    try {
      const response = await axiosInstance.get<ApiResponse<Tour>>(
        API_PATHS.TOURS.DETAIL(id)
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch tour with id ${id}:`, error);
      throw error; // Re-throw for the component to handle
    }
  },

  // Create new tour (Admin)
  async createTour(tourData: Omit<Tour, 'id' | 'rating' | 'reviewsCount'>): Promise<Tour> {
    try {
      const response = await axiosInstance.post<ApiResponse<Tour>>(
        API_PATHS.TOURS.CREATE,
        tourData
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to create tour:', error);
      throw error; // Re-throw for the component to handle
    }
  },

  // Update tour (Admin)
  async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
    try {
      const response = await axiosInstance.put<ApiResponse<Tour>>(
        API_PATHS.TOURS.UPDATE(id),
        tourData
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update tour with id ${id}:`, error);
      throw error; // Re-throw for the component to handle
    }
  },

  // Delete tour (Admin)
  async deleteTour(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_PATHS.TOURS.DELETE(id));
    } catch (error) {
      console.error(`Failed to delete tour with id ${id}:`, error);
      throw error; // Re-throw for the component to handle
    }
  },

  // Get tour categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<{ categories: string[] }>(
        API_PATHS.TOURS.CATEGORIES
      );
      return response.data.categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return []; // Return empty array on error
    }
  },

  // Upload an image
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
        API_PATHS.UPLOAD.IMAGE, // You'll need to add this path to your api-paths.ts
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error; // Re-throw for the component to handle
    }
  },
};
