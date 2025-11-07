import axiosInstance from '@/lib/axios';
import { API_PATHS } from '@/lib/api-paths';

interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface ConfirmPaymentData {
  paymentIntentId: string;
  paymentMethodId: string;
}

interface PaymentConfirmationResponse {
  success: boolean;
  paymentIntentId: string;
  status: string;
}

export const paymentService = {
  // Create payment intent
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntentResponse> {
    const response = await axiosInstance.post<PaymentIntentResponse>(
      API_PATHS.PAYMENTS.CREATE_INTENT,
      {
        ...data,
        currency: data.currency || 'usd',
      }
    );
    return response.data;
  },

  // Confirm payment
  async confirmPayment(data: ConfirmPaymentData): Promise<PaymentConfirmationResponse> {
    const response = await axiosInstance.post<PaymentConfirmationResponse>(
      API_PATHS.PAYMENTS.CONFIRM,
      data
    );
    return response.data;
  },

  // Request refund (Admin)
  async requestRefund(paymentIntentId: string): Promise<void> {
    await axiosInstance.post(API_PATHS.PAYMENTS.REFUND(paymentIntentId));
  },
};
