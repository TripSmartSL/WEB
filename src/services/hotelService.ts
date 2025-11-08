import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';
import type { Hotel } from '@/types';

interface HotelsListParams {
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface PaginatedResponse<T> {
  hotels: T[];
  pagination: {
    total: number;
  };
}

interface AvailabilityParams {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
}

interface AvailabilityResponse {
  available: boolean;
  price: number;
  roomsAvailable: number;
}

export const hotelService = {
  // Get all hotels with filters
  async getHotels(params?: HotelsListParams): Promise<PaginatedResponse<Hotel>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Hotel>>>(
      API_PATHS.HOTELS.LIST,
      { params }
    );
    if (response.data && response.data.success) {
      return response.data.data;
    }
    // Return an empty array on failure to prevent crashes
    return { hotels: [], pagination: { total: 0 } };
  },

  // Get single hotel by ID
  async getHotelById(id: string): Promise<Hotel | undefined> {
    const response = await axiosInstance.get<Hotel>(
      API_PATHS.HOTELS.DETAIL(id)
    );
    return response.data;
  },

  // Check room availability
  async checkAvailability(
    hotelId: string,
    params: AvailabilityParams
  ): Promise<AvailabilityResponse> {
    const response = await axiosInstance.post<AvailabilityResponse>(
      API_PATHS.HOTELS.CHECK_AVAILABILITY(hotelId),
      params
    );
    return response.data;
  },

  // Create new hotel (Admin)
  async createHotel(hotelData: Omit<Hotel, 'id'>): Promise<Hotel> {
    const response = await axiosInstance.post<Hotel>(
      API_PATHS.HOTELS.CREATE,
      hotelData
    );
    return response.data;
  },

  // Update hotel (Admin)
  async updateHotel(id: string, hotelData: Partial<Hotel>): Promise<Hotel> {
    const response = await axiosInstance.put<Hotel>(
      API_PATHS.HOTELS.UPDATE(id),
      hotelData
    );
    return response.data;
  },

  // Delete hotel (Admin)
  async deleteHotel(id: string): Promise<void> {
    await axiosInstance.delete(API_PATHS.HOTELS.DELETE(id));
  },
};
