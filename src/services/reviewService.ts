import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';
import type { Review, HotelReview } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ReviewsResponse {
  items: Review[] | HotelReview[];
  total: number;
  page: number;
  limit: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface CreateReviewData {
  tourId?: string | number;
  hotelId?: string | number;
  rating?: number;
  overallRating?: number;
  locationRating?: number;
  cleanlinessRating?: number;
  serviceRating?: number;
  valueRating?: number;
  comment: string;
}

export const reviewService = {
  async getAllReviews(options: { 
    page?: number;
    limit?: number;
    minRating?: number;
    status?: 'pending' | 'approved' | 'rejected';

  } = {}): Promise<ReviewsResponse> {
    try {
      const { page = 1, limit = 100, minRating, status } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(minRating && { minRating: minRating.toString() }),
        ...(status && { status })
      });

      const response = await axiosInstance.get<ApiResponse<ReviewsResponse>>(
        `${API_PATHS.REVIEWS.LIST}?${params.toString()}`
      );
      
      if (!response.data.success) {
  throw new Error(response.data.message || 'Failed to fetch reviews');
}

    const { items = [], pagination } = response.data.data || {};
    return {
      items,
      total: pagination?.total || items.length,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
    };

    } catch (error: any) {
      console.error('Failed to fetch all reviews:', error);
      
      // Handle 401 errors by redirecting to login
      if (error?.response?.status === 401) {
        window.location.href = '/login';
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to load reviews');
    }
  },
  

  async getTourReviews(tourId?: string | number): Promise<Review[]> {
    try {
      const url = tourId
        ? `${API_PATHS.REVIEWS.TOUR_REVIEWS(tourId)}`
        : API_PATHS.REVIEWS.LIST;

      const response = await axiosInstance.get<ApiResponse<{ reviews: Review[] }>>(url);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tour reviews');
      }
      
      return response.data.data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch tour reviews:', error);
      return [];
    }
  },

  async getHotelReviews(hotelId?: string | number): Promise<HotelReview[]> {
    try {
      const url = hotelId
        ? `${API_PATHS.REVIEWS.HOTEL_REVIEWS(hotelId)}`
        : API_PATHS.REVIEWS.LIST;

      const response = await axiosInstance.get<ApiResponse<{ reviews: HotelReview[] }>>(url);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch hotel reviews');
      }
      
      return response.data.data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch hotel reviews:', error);
      return [];
    }
  },

  async createReview(reviewData: CreateReviewData): Promise<Review | HotelReview> {
    const response = await axiosInstance.post<ApiResponse<Review | HotelReview>>(
      API_PATHS.REVIEWS.CREATE,
      reviewData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create review');
    }
    
    return response.data.data;
  },

  async updateReview(id: string | number, data: Partial<Review | HotelReview>) {
    const response = await axiosInstance.put<ApiResponse<Review | HotelReview>>(
      API_PATHS.REVIEWS.UPDATE(id),
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update review');
    }
    
    return response.data.data;
  },

  async deleteReview(id: string | number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_PATHS.REVIEWS.DELETE(id)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete review');
    }
  },
};
