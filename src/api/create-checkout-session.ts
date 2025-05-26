import Stripe from 'stripe';
import { env } from '../utils/env';

const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export async function createCheckoutSession(priceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/pricing`,
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
} 