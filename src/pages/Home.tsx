import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            What our users say
          </h2>
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
              <p className="text-gray-600">
                "I love how easy it is to keep track of gifts for my students and family. Highly recommended!"
              </p>
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
                  <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Etsy</span>
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
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
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
                  <svg className="h-8 w-8 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
    </div>
  );
};

export default Home; 