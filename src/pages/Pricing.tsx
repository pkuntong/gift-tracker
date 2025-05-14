import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionManager from '../components/SubscriptionManager';
import PaymentCheckout from '../components/PaymentCheckout';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showOneTimePayment, setShowOneTimePayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      priceId: '',
      oneTimePrice: 0,
      description: 'Perfect for getting started',
      features: [
        'Up to 50 gifts',
        'Basic gift tracking',
        'Email support',
        'Basic analytics'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      priceId: 'price_pro', // This would be a real Stripe price ID in production
      oneTimePrice: 9999, // $99.99 for annual payment (in cents)
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
      name: 'Enterprise',
      price: 'Custom',
      priceId: 'price_premium', // This would be a real Stripe price ID in production
      oneTimePrice: 19999, // $199.99 for annual payment (in cents)
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration',
        'Custom branding',
        'API access'
      ]
    }
  ];

  const handleSelectPlan = (tierName: string, isSubscription: boolean) => {
    setSelectedTier(tierName);
    if (isSubscription) {
      setShowSubscriptions(true);
      setShowOneTimePayment(false);
    } else {
      setShowOneTimePayment(true);
      setShowSubscriptions(false);
    }
  };

  const handleSuccess = () => {
    alert('Thank you for your purchase!');
    setShowSubscriptions(false);
    setShowOneTimePayment(false);
    setSelectedTier(null);
  };

  const handleCancel = () => {
    setShowSubscriptions(false);
    setShowOneTimePayment(false);
    setSelectedTier(null);
  };

  // If showing subscription management or one-time payment, render that component
  if (showSubscriptions) {
    return <SubscriptionManager />;
  }

  if (showOneTimePayment && selectedTier) {
    const tier = tiers.find(t => t.name === selectedTier);
    if (!tier || !tier.oneTimePrice) return null;
    
    return (
      <PaymentCheckout
        amount={tier.oneTimePrice}
        description={`Annual ${tier.name} Plan - Gift Tracker`}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the plan that's right for you and start tracking your gifts today.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                tier.highlighted ? 'border-2 border-indigo-500' : 'border border-gray-200'
              }`}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{tier.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                  {tier.period && (
                    <span className="text-base font-medium text-gray-500">{tier.period}</span>
                  )}
                </p>
                <p className="mt-5 text-lg text-gray-500">{tier.description}</p>
                
                {tier.price !== 'Free' ? (
                  user ? (
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => handleSelectPlan(tier.name, true)}
                        className={`w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                          tier.highlighted
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        Subscribe Monthly
                      </button>
                      
                      <button
                        onClick={() => handleSelectPlan(tier.name, false)}
                        className="w-full py-3 px-6 border border-gray-300 rounded-md text-center font-medium bg-white text-gray-700 hover:bg-gray-50"
                      >
                        Pay Annually (Save 15%)
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/signup"
                      className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                        tier.highlighted
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      Sign Up to Subscribe
                    </Link>
                  )
                ) : (
                  <Link
                    to={user ? '/dashboard' : '/signup'}
                    className="mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                  </Link>
                )}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            Need a custom plan?{' '}
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">
              Contact us
            </Link>
          </p>
        </div>
        
        {user && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowSubscriptions(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Manage Your Subscriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;