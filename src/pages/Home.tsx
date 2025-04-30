import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LiveChat from '../components/LiveChat';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleSeeDemo = () => {
    // For now, just navigate to the dashboard
    // In a real app, this would show a demo or tour
    navigate('/dashboard');
  };

  const handleComparePlans = () => {
    navigate('/pricing');
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
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navigation */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Never forget a gift</span>
                    <span className="block text-indigo-600">with Gift Tracker</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    Keep track of all your gift ideas, purchases, and thank you notes in one place. Perfect for holidays, birthdays, and special occasions.
                  </p>
                  
                  {/* Enhanced CTA Section */}
                  <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={handleGetStarted}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Start Free Trial
                    </button>
                    <button
                      onClick={handleSeeDemo}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      See Demo
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={handleComparePlans}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Compare Plans →
                    </button>
                  </div>
                </div>
              </main>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Add gift recipients</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Create profiles for friends, family, and colleagues to keep track of their preferences.
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Track gift ideas</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Add gift ideas with notes, links, and prices. Mark items as purchased when you buy them.
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

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage gifts
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Gift Ideas</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Keep track of gift ideas for friends and family. Add notes, links, and prices.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Event Planning</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Plan for upcoming events and never miss a birthday or holiday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What our users say
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Join thousands of satisfied users who trust Gift Tracker for their gift-giving needs.
            </p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">10,000+</div>
              <div className="text-lg font-medium text-gray-900">Happy Users</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">50,000+</div>
              <div className="text-lg font-medium text-gray-900">Gifts Tracked</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">4.8/5</div>
              <div className="text-lg font-medium text-gray-900">Average Rating</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src="/testimonials/user1.svg"
                  alt="Sarah Johnson"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-500">Event Planner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "Gift Tracker has completely transformed how I manage gifts for my clients. It's a game-changer!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src="/testimonials/user2.svg"
                  alt="Michael Chen"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-gray-500">Business Owner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "The best gift tracking app I've ever used. Simple, intuitive, and incredibly helpful."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src="/testimonials/user3.svg"
                  alt="Emily Rodriguez"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Emily Rodriguez</h4>
                  <p className="text-gray-500">Teacher</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "I love how easy it is to keep track of gifts for my students and family. Highly recommended!"
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-8">Trusted by Users Worldwide</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md mb-2">
                  <svg className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">SSL Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md mb-2">
                  <svg className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Data Protected</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md mb-2">
                  <svg className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">99.9% Uptime</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md mb-2">
                  <svg className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Logos Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Integrations</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Works with your favorite platforms
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Connect Gift Tracker with the tools you already use to streamline your gift-giving process.
            </p>
          </div>

          {/* Calendar Apps */}
          <div className="mt-12">
            <h3 className="text-xl font-medium text-gray-900 text-center mb-6">Calendar Apps</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Google Calendar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Apple Calendar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Outlook</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Yahoo Calendar</span>
              </div>
            </div>
          </div>

          {/* E-commerce Platforms */}
          <div className="mt-12">
            <h3 className="text-xl font-medium text-gray-900 text-center mb-6">E-commerce Platforms</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Amazon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">eBay</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Walmart</span>
              </div>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div className="mt-12">
            <h3 className="text-xl font-medium text-gray-900 text-center mb-6">Social Media Platforms</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63-.771-1.63-1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Facebook</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Twitter</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Instagram</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Find answers to common questions about Gift Tracker.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-8">
              {/* Question 1 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <dt className="text-lg font-medium text-gray-900">
                  How secure is my data?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Your data security is our top priority. We use industry-standard encryption to protect your information, and we never share your personal data with third parties without your explicit consent. All data is stored on secure servers with regular backups and monitoring.
                </dd>
              </div>

              {/* Question 2 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <dt className="text-lg font-medium text-gray-900">
                  Can I share my gift lists with family members?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes! Gift Tracker makes it easy to collaborate with family members. You can share specific lists with family members, allowing them to view and contribute gift ideas. This is perfect for coordinating group gifts or planning surprises together.
                </dd>
              </div>

              {/* Question 3 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <dt className="text-lg font-medium text-gray-900">
                  Is there a mobile app available?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Gift Tracker is fully responsive and works great on all mobile devices. While we don't currently have a dedicated mobile app, our web application is optimized for mobile use and can be added to your home screen for an app-like experience. We're working on native mobile apps for iOS and Android, coming soon!
                </dd>
              </div>

              {/* Question 4 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <dt className="text-lg font-medium text-gray-900">
                  How do I cancel my subscription?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  You can cancel your subscription at any time from your account settings. Simply go to your profile, select "Subscription," and click "Cancel Subscription." Your access will continue until the end of your current billing period. We don't charge any cancellation fees, and you can reactivate your subscription whenever you'd like.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Blog/Resources Preview Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Resources</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Gift Giving Tips & Resources
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover helpful guides and tips to make your gift-giving experience even better.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Gift Giving Guide */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover bg-gray-50"
                  src="/blog/gift-guide.svg"
                  alt="Gift Giving Guide"
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    Guide
                  </p>
                  <Link to="/blog/gift-giving-guide" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                      The Ultimate Gift Giving Guide
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      Learn the art of thoughtful gift-giving with our comprehensive guide covering everything from budgeting to presentation.
                    </p>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    to="/blog/gift-giving-guide"
                    className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Holiday Planning Tips */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover bg-gray-50"
                  src="/blog/holiday-planning.svg"
                  alt="Holiday Planning Tips"
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    Tips & Tricks
                  </p>
                  <Link to="/blog/holiday-planning" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                      Holiday Planning Made Easy
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      Master the art of holiday gift planning with our expert tips for staying organized and within budget.
                    </p>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    to="/blog/holiday-planning"
                    className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Birthday Gift Ideas */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover bg-gray-50"
                  src="/blog/birthday-ideas.svg"
                  alt="Birthday Gift Ideas"
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    Ideas
                  </p>
                  <Link to="/blog/birthday-ideas" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                      Creative Birthday Gift Ideas
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      Discover unique and memorable birthday gift ideas for everyone in your life, from kids to adults.
                    </p>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    to="/blog/birthday-ideas"
                    className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View all resources
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile App Preview Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Mobile App</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Take Gift Tracker with you
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Access your gift lists, track purchases, and manage events on the go with our mobile app.
            </p>
          </div>

          <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            {/* App Screenshots */}
            <div className="relative">
              <div className="relative mx-auto w-full max-w-md">
                {/* Phone Frame */}
                <div className="relative mx-auto w-72 h-[600px] bg-gray-900 rounded-[3rem] shadow-xl overflow-hidden">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-10"></div>
                  
                  {/* App Screenshot */}
                  <div className="absolute inset-0 bg-white">
                    <img
                      className="w-full h-full object-cover"
                      src="/app/screenshot-dashboard.svg"
                      alt="Gift Tracker Mobile App Dashboard"
                    />
                  </div>
                  
                  {/* Home Button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Floating Screenshots */}
                <div className="absolute -bottom-10 -right-10 w-48 h-80 bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-6">
                  <img
                    className="w-full h-full object-cover"
                    src="/app/screenshot-gifts.svg"
                    alt="Gift Tracker Mobile App Gifts"
                  />
                </div>
                
                <div className="absolute -top-10 -left-10 w-48 h-80 bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-6">
                  <img
                    className="w-full h-full object-cover"
                    src="/app/screenshot-events.svg"
                    alt="Gift Tracker Mobile App Events"
                  />
                </div>
              </div>
            </div>

            {/* App Features & Download Links */}
            <div className="mt-10 lg:mt-0">
              <div className="space-y-8">
                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Key Mobile Features</h3>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        <span className="font-medium text-gray-900">Offline Access</span> - View your gift lists and ideas even without internet connection
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        <span className="font-medium text-gray-900">Barcode Scanner</span> - Scan product barcodes to quickly add items to your gift lists
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        <span className="font-medium text-gray-900">Push Notifications</span> - Get reminders for upcoming birthdays and events
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">
                        <span className="font-medium text-gray-900">Photo Capture</span> - Take photos of gift ideas on the go and attach them to your lists
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Download Links */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Download Now</h3>
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <a
                      href="#"
                      className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                    >
                      <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.57-.84 1.51.18 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.88 4.18-3.74 4.25z"/>
                      </svg>
                      App Store
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                    >
                      <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.5 20.5v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5zm14 0v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5zm-7-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-17z"/>
                      </svg>
                      Google Play
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Stay Updated with Gift Tracker
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Subscribe to our newsletter for gift-giving tips, feature updates, and exclusive offers.
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <form className="sm:flex justify-center">
              <div className="w-full">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center">
              <input
                id="privacy-policy"
                name="privacy-policy"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy-policy" className="ml-2 block text-sm text-indigo-200">
                I agree to the{' '}
                <Link to="/privacy" className="text-white underline hover:text-indigo-200">
                  Privacy Policy
                </Link>
                {' '}and consent to receiving marketing communications.
              </label>
            </div>
            <p className="mt-3 text-sm text-indigo-200 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link to="/privacy" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-gray-500">
                Cookie Policy
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