import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Track up to 20 gifts',
      'Basic reminders',
      'Thank you note tracking',
      'Email support',
      '7-day free trial'
    ],
    priceId: '', // No Stripe price for free
  },
  {
    name: 'Pro',
    price: 5,
    features: [
      'Unlimited gifts',
      'Advanced reminders & recurring events',
      'Gift history & analytics',
      'Priority email support',
      'Team collaboration'
    ],
    priceId: 'price_1RQx6HRp30Oo5mnQSRfohJ5g', // Replace with your Stripe Price ID
  }
];

const PricingPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    const stripe = await stripePromise;
    // TODO: Replace with your backend endpoint to create a Checkout Session
    const res = await fetch('http://localhost:4242/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    if (!res.ok) {
      console.error('Failed to create checkout session');
      setLoading(null);
      return;
    }
    const session = await res.json();
    if (stripe && session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Pricing</h1>
        <p className="text-lg text-gray-600">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <div className="text-4xl font-extrabold text-indigo-600 mb-4">
              {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
            </div>
            <ul className="mb-6 space-y-2 text-gray-700 text-left w-full">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            {plan.price === 0 ? (
              <button className="w-full bg-gray-200 text-gray-500 font-semibold py-2 rounded cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading === plan.priceId}
              >
                {loading === plan.priceId ? 'Redirecting...' : 'Subscribe'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage; 