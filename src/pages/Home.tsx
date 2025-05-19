import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LiveChat from '../components/LiveChat';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="Gift Tracker"
                />
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="logout-button ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Gift Tracker</span>
                    <span className="block text-indigo-600">Never forget who gave what – track gifts with ease.</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    The perfect solution for organizing gifts, tracking thank-you notes, and planning events. Keep everything in one place and make gift management simple.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Problem Statement Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Still using Excel to track birthday gifts?
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                You're not alone. But there's a better way.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center">
                <div className="inline-flex rounded-md shadow">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Try Free for 7 Days
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-500">No credit card required</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Simple steps to get started
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Gift Tracker makes it easy to manage all your gift-giving needs in one place.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold">
                    1
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto mb-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">Create an account</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Sign up in seconds with your email address and start organizing your gift ideas.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold">
                    2
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto mb-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">Add your gifts</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Keep track of gifts given and received with detailed information and photos.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold">
                    3
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto mb-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">Track thank you notes</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Never forget to send a thank you note again with our built-in tracking system.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold">
                    4
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto mb-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">Manage events</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Set reminders for upcoming birthdays, holidays, and special occasions to never miss a gift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pricing</h2>
              <p className="mt-4 text-xl text-gray-600">Simple, transparent pricing for everyone. Start free, upgrade anytime.</p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {/* Free Plan */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col p-8">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2 text-center">Free</h3>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </div>
                <ul className="mt-6 mb-8 space-y-3 text-gray-600 flex-1">
                  <li>Track up to 20 gifts</li>
                  <li>Basic reminders</li>
                  <li>Thank you note tracking</li>
                  <li>Email support</li>
                  <li>7-day free trial</li>
                </ul>
                <button
                  onClick={handleGetStarted}
                  className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Get Started
                </button>
              </div>
              {/* Pro Plan */}
              <div className="bg-white border-2 border-indigo-600 rounded-lg shadow-lg flex flex-col p-8 scale-105 z-10">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2 text-center">Pro</h3>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-gray-900">$5</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </div>
                <ul className="mt-6 mb-8 space-y-3 text-gray-700 flex-1">
                  <li>Unlimited gifts</li>
                  <li>Advanced reminders & recurring events</li>
                  <li>Gift history & analytics</li>
                  <li>Priority email support</li>
                  <li>Team collaboration</li>
                </ul>
                <button
                  onClick={handleGetStarted}
                  className="w-full py-2 px-4 rounded-md bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition shadow"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link to="/privacy" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </Link>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              © 2025 Gift Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
};

export default Home;
