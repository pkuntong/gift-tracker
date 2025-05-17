import { collection, addDoc, doc, updateDoc, where, query, getDocs } from 'firebase/firestore';
import { db } from './config';
import { env } from '../utils/env';
import { loadStripe } from '@stripe/stripe-js';

// Payment intent type definition for Firestore
// Using this type to enforce the shape of data stored in Firestore
export type PaymentIntentData = {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret?: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription type definition for Firestore
// Using this type to enforce the shape of data stored in Firestore
export type SubscriptionData = {
  id?: string;
  userId: string;
  priceId: string;
  status: 'active' | 'canceled' | 'past_due';
  subscriptionId: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize Stripe
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const stripePublicKey = env.VITE_STRIPE_PUBLIC_KEY;
    if (!stripePublicKey) {
      throw new Error('Stripe public key is not defined in environment variables');
    }
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

// Create a payment intent
export const createPaymentIntent = async (userId: string, amount: number, currency: string = 'usd'): Promise<{ clientSecret: string }> => {
  try {
    // Create a payment intent document in Firestore first
    const paymentIntentData: PaymentIntentData = {
      userId,
      amount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the payment intent to Firestore
    const paymentIntentRef = await addDoc(collection(db, 'paymentIntents'), paymentIntentData);
    
    // In a production app, you would have a serverless function or backend API to handle this
    // For this implementation, we'd use Firebase Functions to securely call Stripe API
    // Here's what that would look like:
    
    // Call to a serverless function or API endpoint
    // For production use, uncomment this code:
    // const response = await fetch('https://us-central1-your-project.cloudfunctions.net/createPaymentIntent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     amount,
    //     currency,
    //     userId,
    //     paymentIntentId: paymentIntentRef.id
    //   }),
    // });
    // const { clientSecret } = await response.json();
    
    // For development/demo purposes, we'll use a mock client secret
    // IMPORTANT: In production, remove this and use the actual Stripe response
    const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    
    // Update the Firestore document with the client secret
    await updateDoc(doc(db, 'paymentIntents', paymentIntentRef.id), {
      clientSecret,
      updatedAt: new Date().toISOString()
    });
    
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Create a subscription
export const createSubscription = async (userId: string, priceId: string): Promise<{ subscriptionId: string; clientSecret: string }> => {
  try {
    // Create subscription document in Firestore first
    const subscriptionData: SubscriptionData = {
      userId,
      priceId,
      status: 'active',
      subscriptionId: `sub_${Math.random().toString(36).substring(2)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to Firestore
    const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
    
    // In a production app, you would call a serverless function or backend API
    // Using Firebase Functions to securely interact with Stripe API
    // Example of what this would look like:
    
    // const response = await fetch('https://us-central1-your-project.cloudfunctions.net/createSubscription', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     priceId,
    //     userId,
    //     subscriptionId: subscriptionRef.id
    //   }),
    // });
    // const { subscriptionId, clientSecret } = await response.json();
    
    // For development purposes, generate mock values
    const clientSecret = `cs_${Math.random().toString(36).substring(2)}`;
    
    // Update Firestore with subscription ID
    await updateDoc(doc(db, 'subscriptions', subscriptionRef.id), {
      subscriptionId: subscriptionData.subscriptionId,
      updatedAt: new Date().toISOString()
    });
    
    return { subscriptionId: subscriptionData.subscriptionId, clientSecret };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Get user subscriptions
export const getUserSubscriptions = async (userId: string): Promise<SubscriptionData[]> => {
  try {
    const q = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        priceId: data.priceId,
        status: data.status as 'active' | 'canceled' | 'past_due',
        subscriptionId: data.subscriptionId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        id: doc.id
      };
    });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string, userId: string): Promise<void> => {
  try {
    // Find the subscription document in Firestore
    const q = query(
      collection(db, 'subscriptions'),
      where('subscriptionId', '==', subscriptionId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Subscription not found or not authorized');
    }
    
    const subscriptionDoc = querySnapshot.docs[0];
    
    // In production, you would call Stripe API through a secure backend
    // const response = await fetch('https://us-central1-your-project.cloudfunctions.net/cancelSubscription', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ subscriptionId }),
    // });
    
    // Update subscription status in Firestore
    await updateDoc(doc(db, 'subscriptions', subscriptionDoc.id), {
      status: 'canceled',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};
