"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.cancelSubscription = exports.createSubscription = exports.createPaymentIntent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors = __importStar(require("cors"));
const stripe_1 = __importDefault(require("stripe"));
admin.initializeApp();
// Initialize Stripe with your secret key
const stripeApiKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new stripe_1.default(stripeApiKey, {
    apiVersion: '2022-11-15',
});
const corsHandler = cors.default({ origin: true });
// Create a payment intent - simplified version for testing
exports.createPaymentIntent = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        try {
            // Verify the request method
            if (request.method !== 'POST') {
                response.status(405).send({ error: 'Method Not Allowed' });
                return;
            }
            const { amount, userId, paymentIntentId } = request.body;
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
                }
                catch (stripeError) {
                    console.error('Stripe API error:', stripeError);
                    // Fall back to mock response if Stripe fails
                }
            }
            // For development purposes, just return a mock client secret
            console.log('Using mock payment intent client secret for development');
            response.status(200).send({ clientSecret });
        }
        catch (error) {
            console.error('Error creating payment intent:', error);
            response.status(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
});
// Create a subscription - simplified version for testing
exports.createSubscription = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        try {
            // Verify the request method
            if (request.method !== 'POST') {
                response.status(405).send({ error: 'Method Not Allowed' });
                return;
            }
            const { priceId, userId, subscriptionId } = request.body;
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
                }
                catch (firestoreError) {
                    console.error('Firestore error:', firestoreError);
                }
            }
            response.status(200).send({
                clientSecret: mockClientSecret,
                subscriptionId: mockSubscriptionId,
            });
        }
        catch (error) {
            console.error('Error creating subscription:', error);
            response.status(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
});
// Cancel a subscription - simplified version for testing
exports.cancelSubscription = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        try {
            // Verify the request method
            if (request.method !== 'POST') {
                response.status(405).send({ error: 'Method Not Allowed' });
                return;
            }
            const { subscriptionId } = request.body;
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
            }
            else {
                console.warn(`Subscription not found: ${subscriptionId}`);
            }
            response.status(200).send({ success: true });
        }
        catch (error) {
            console.error('Error canceling subscription:', error);
            response.status(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
});
// Simplified webhook for testing
exports.stripeWebhook = functions.https.onRequest((request, response) => {
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
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        response.status(400).send({
            error: 'Webhook error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
//# sourceMappingURL=index.js.map