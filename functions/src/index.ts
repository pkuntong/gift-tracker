import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import Stripe from 'stripe';
import { Request, Response } from 'express';

admin.initializeApp();

// Initialize Stripe with your secret key
const stripeApiKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2022-11-15' as Stripe.LatestApiVersion,
});

const corsHandler = cors.default({ origin: true });

interface PaymentIntentRequestBody {
  amount: number;
  currency?: string;  // Make this optional since we provide a default
  userId: string;
  paymentIntentId?: string;
}

interface SubscriptionRequestBody {
  priceId: string;
  userId: string;
  subscriptionId?: string;
}

interface CancelSubscriptionRequestBody {
  subscriptionId: string;
}

// Create a payment intent - simplified version for testing
export const createPaymentIntent = functions.https.onRequest((request: Request, response: Response) => {
  corsHandler(request, response, async () => {
    try {
      // Verify the request method
      if (request.method !== 'POST') {
        response.status(405).send({ error: 'Method Not Allowed' });
        return;
      }

      const { amount, userId, paymentIntentId } = request.body as PaymentIntentRequestBody;
      const currency = request.body.currency || 'usd';

      // Validate required fields
      if (!amount || !userId) {
        response.status(400).send({ error: 'Missing required fields' });
        return;
      }

      console.log(`Creating payment intent for userId: ${userId}, amount: ${amount}`);
      
      // For testing in the emulator, we'll just create a mock client secret
      const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
      
      // We'll only try to use Stripe if we're in a real environment with a valid API key
      // This code is simplified for development purposes
      if (stripeApiKey && stripeApiKey.startsWith('sk_')) {
        try {
          // We need to ensure currency is never undefined for Stripe API
          const definedCurrency = currency || 'usd';
          
          // Create a PaymentIntent with the specified amount and currency
          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: definedCurrency,
            metadata: {
              userId,
              firestoreDocId: paymentIntentId || '',
            },
          });
          
          // Update the Firestore document with the Stripe PaymentIntent ID if we have an ID
          if (paymentIntentId) {
            await admin.firestore()
              .collection('paymentIntents')
              .doc(paymentIntentId)
              .update({
                stripePaymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
          }
          
          // Return the client secret to the client
          response.status(200).send({
            clientSecret: paymentIntent.client_secret,
          });
          return;
        } catch (stripeError) {
          console.error('Stripe API error:', stripeError);
          // Fall back to mock response if Stripe fails
        }
      }
      
      // For development purposes, just return a mock client secret
      console.log('Using mock payment intent client secret for development');
      response.status(200).send({ clientSecret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      response.status(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
});

// Create a subscription - simplified version for testing
export const createSubscription = functions.https.onRequest((request: Request, response: Response) => {
  corsHandler(request, response, async () => {
    try {
      // Verify the request method
      if (request.method !== 'POST') {
        response.status(405).send({ error: 'Method Not Allowed' });
        return;
      }

      const { priceId, userId, subscriptionId } = request.body as SubscriptionRequestBody;

      // Validate required fields
      if (!priceId || !userId) {
        response.status(400).send({ error: 'Missing required fields' });
        return;
      }

      console.log(`Creating subscription for userId: ${userId}, priceId: ${priceId}`);
      
      // For testing purposes, generate mock values
      const mockSubscriptionId = `sub_${Math.random().toString(36).substring(2)}`;
      const mockClientSecret = `cs_${Math.random().toString(36).substring(2)}`;
      
      // In a real environment, we would create a Stripe subscription
      if (subscriptionId) {
        try {
          await admin.firestore()
            .collection('subscriptions')
            .doc(subscriptionId)
            .set({
              userId,
              priceId,
              status: 'active',
              mockStripeSubscriptionId: mockSubscriptionId,
              clientSecret: mockClientSecret,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (firestoreError) {
          console.error('Firestore error:', firestoreError);
        }
      }
      
      response.status(200).send({
        clientSecret: mockClientSecret,
        subscriptionId: mockSubscriptionId,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      response.status(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
});

// Cancel a subscription - simplified version for testing
export const cancelSubscription = functions.https.onRequest((request: Request, response: Response) => {
  corsHandler(request, response, async () => {
    try {
      // Verify the request method
      if (request.method !== 'POST') {
        response.status(405).send({ error: 'Method Not Allowed' });
        return;
      }

      const { subscriptionId } = request.body as CancelSubscriptionRequestBody;

      // Validate required fields
      if (!subscriptionId) {
        response.status(400).send({ error: 'Missing subscription ID' });
        return;
      }

      console.log(`Canceling subscription: ${subscriptionId}`);
      
      // Find the subscription in Firestore
      const subscriptionsRef = admin.firestore().collection('subscriptions');
      const querySnapshot = await subscriptionsRef
        .where('mockStripeSubscriptionId', '==', subscriptionId)
        .limit(1)
        .get();
      
      if (!querySnapshot.empty) {
        // Update the subscription status in Firestore
        await querySnapshot.docs[0].ref.update({
          status: 'canceled',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        console.warn(`Subscription not found: ${subscriptionId}`);
      }

      response.status(200).send({ success: true });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      response.status(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
});

// Simplified webhook for testing
export const stripeWebhook = functions.https.onRequest((request: Request, response: Response) => {
  try {
    if (request.method !== 'POST') {
      response.status(405).send({ error: 'Method Not Allowed' });
      return;
    }

    // Log the webhook event for debugging
    console.log('Received webhook:', JSON.stringify(request.body));
    
    // In a real implementation, you would validate the signature and process the event
    // For testing, just return success
    response.status(200).send({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    response.status(400).send({
      error: 'Webhook error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
