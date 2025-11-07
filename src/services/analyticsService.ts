import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  averageRating: number;
}

interface IncomeData {
  date: string;
  amount: number;
  bookings: number;
}

interface BookingAnalytics {
  tourBookings: number;
  hotelBookings: number;
  totalBookings: number;
  byStatus: Record<string, number>;
}

export const analyticsService = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosInstance.get<DashboardStats>(
      API_PATHS.ANALYTICS.DASHBOARD
    );
    return response.data;
  },

  // Get income analytics
  async getIncomeAnalytics(params?: { 
    startDate?: string; 
    endDate?: string;
    granularity?: 'day' | 'week' | 'month';
  }): Promise<IncomeData[]> {
    const response = await axiosInstance.get<{ data: IncomeData[] }>(
      API_PATHS.ANALYTICS.INCOME,
      { params }
    );
    return response.data.data;
  },

  // Get booking analytics
  async getBookingAnalytics(params?: { 
    startDate?: string; 
    endDate?: string;
  }): Promise<BookingAnalytics> {
    const response = await axiosInstance.get<BookingAnalytics>(
      API_PATHS.ANALYTICS.BOOKINGS,
      { params }
    );
    return response.data;
  },
};
