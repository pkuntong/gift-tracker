import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from './api';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY || '');

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export const initializePayment = async (amount: number, currency: string = 'usd') => {
  try {
    const { clientSecret } = await paymentService.createPaymentIntent(amount, currency);
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.confirmCardPayment(clientSecret);
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};

export const createSubscription = async (priceId: string) => {
  try {
    const { subscriptionId } = await paymentService.createSubscription(priceId);
    return { subscriptionId };
  } catch (error) {
    console.error('Subscription creation failed:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    await paymentService.cancelSubscription(subscriptionId);
    return { success: true };
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    throw error;
  }
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const response = await fetch('/api/payment-methods', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    const { paymentMethods } = await response.json();

    return paymentMethods.map((pm: {
      id: string;
      type: string;
      card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      };
    }) => ({
      id: pm.id,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
      } : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch payment methods:', error);
    throw error;
  }
}; 