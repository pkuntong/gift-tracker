import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createSubscription, getUserSubscriptions, cancelSubscription } from '../firebase/payment-service';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { env } from '../utils/env';
import type { SubscriptionData } from '../firebase/payment-service';

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY);

interface SubscribeFormProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ priceId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create the subscription
      const { clientSecret, subscriptionId } = await createSubscription(user.id, priceId);

      // Confirm the setup with Stripe
      const { error: setupError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email,
          },
        }
      });

      if (setupError) {
        throw new Error(setupError.message || 'An unknown error occurred');
      }

      // If we got here, the subscription was created successfully
      onSuccess();
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to create subscription');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-element">
          Payment Method
        </label>
        <div className="border border-gray-300 p-3 rounded">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`py-2 px-4 rounded ${!stripe || processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {processing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </span>
          ) : 'Subscribe'}
        </button>
      </div>
    </form>
  );
};

const PricingTable: React.FC<{
  onSelectPlan: (priceId: string) => void;
}> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: 'Pro',
      priceId: 'price_pro', // You would use actual Stripe price IDs here
      price: '$9.99',
      period: '/month',
      description: 'Best for regular gift givers',
      features: [
        'Unlimited gifts',
        'Advanced gift tracking',
        'Priority support',
        'Advanced analytics',
        'Custom categories',
        'Export data'
      ],
      highlighted: true
    },
    {
      name: 'Premium',
      priceId: 'price_premium', // You would use actual Stripe price IDs here
      price: '$19.99',
      period: '/month',
      description: 'For serious gift enthusiasts',
      features: [
        'Everything in Pro',
        'AI gift suggestions',
        'Collaboration features',
        'Integration with calendars',
        'Personalized reminders',
        'Premium templates'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {plans.map((plan) => (
        <div 
          key={plan.name}
          className={`rounded-lg shadow-lg p-6 ${plan.highlighted ? 'border-2 border-indigo-500' : 'border border-gray-200'}`}
        >
          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
          <p className="mt-4">
            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
            <span className="text-base text-gray-500">{plan.period}</span>
          </p>
          <p className="mt-3 text-gray-600">{plan.description}</p>
          
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => onSelectPlan(plan.priceId)}
            className={`mt-8 w-full py-2 px-4 rounded ${plan.highlighted ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
          >
            Subscribe Now
          </button>
        </div>
      ))}
    </div>
  );
};

const ActiveSubscriptions: React.FC<{
  subscriptions: SubscriptionData[];
  onCancel: (subscriptionId: string) => void;
}> = ({ subscriptions, onCancel }) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">You don't have any active subscriptions.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Your Subscriptions</h3>
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {subscription.priceId === 'price_pro' ? 'Pro Plan' : 
                   subscription.priceId === 'price_premium' ? 'Premium Plan' : 
                   'Subscription'}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className={`${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(subscription.createdAt).toLocaleDateString()}
                </p>
              </div>
              {subscription.status === 'active' && (
                <button
                  onClick={() => onCancel(subscription.subscriptionId || '')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 py-1 px-3 rounded text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userSubscriptions = await getUserSubscriptions(user.id);
        setSubscriptions(userSubscriptions);
        setError(null);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load your subscriptions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user, navigate]);

  const handleSelectPlan = (priceId: string) => {
    setSelectedPriceId(priceId);
    setShowSubscribeForm(true);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!user || !subscriptionId) return;
    
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      setLoading(true);
      await cancelSubscription(subscriptionId, user.id);
      
      // Refresh subscriptions
      const updatedSubscriptions = await getUserSubscriptions(user.id);
      setSubscriptions(updatedSubscriptions);
      
      alert('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionSuccess = async () => {
    setShowSubscribeForm(false);
    setSelectedPriceId(null);
    
    // Refresh subscriptions
    if (user) {
      const updatedSubscriptions = await getUserSubscriptions(user.id);
      setSubscriptions(updatedSubscriptions);
    }
    
    alert('Subscription created successfully!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Subscription Management</h2>
      
      {/* Show active subscriptions */}
      <ActiveSubscriptions 
        subscriptions={subscriptions} 
        onCancel={handleCancelSubscription} 
      />
      
      {!showSubscribeForm ? (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Available Plans</h3>
          <PricingTable onSelectPlan={handleSelectPlan} />
        </div>
      ) : (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Subscribe to Plan</h3>
          <div className="bg-white shadow-md rounded-lg p-6">
            <Elements stripe={stripePromise}>
              <SubscribeForm 
                priceId={selectedPriceId || ''}
                onSuccess={handleSubscriptionSuccess}
                onCancel={() => {
                  setShowSubscribeForm(false);
                  setSelectedPriceId(null);
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
