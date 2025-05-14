import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Handle install prompt for PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // We no longer need the prompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Gift Tracker</span>
              </Link>

              {/* Desktop menu (hidden on mobile) */}
              <div className="hidden md:ml-6 md:flex md:space-x-6">
                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`${isActive('/dashboard') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/gifts"
                      className={`${isActive('/gifts') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Gifts
                    </Link>
                    <Link
                      to="/events"
                      className={`${isActive('/events') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Events
                    </Link>
                    <Link
                      to="/thank-you"
                      className={`${isActive('/thank-you') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Thank You
                    </Link>
                    <Link
                      to="/gift-history"
                      className={`${isActive('/gift-history') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      History
                    </Link>
                    <Link
                      to="/guests"
                      className={`${isActive('/guests') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Guests
                    </Link>
                    <Link
                      to="/reminders"
                      className={`${isActive('/reminders') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Reminders
                    </Link>
                    <Link
                      to="/reports"
                      className={`${isActive('/reports') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Reports
                    </Link>
                    <Link
                      to="/wishlist"
                      className={`${isActive('/wishlist') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/collaborators"
                      className={`${isActive('/collaborators') 
                        ? 'border-indigo-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Collaborators
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right side navigation */}
            <div className="hidden md:flex md:items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center">
                  {showInstallButton && (
                    <button
                      onClick={handleInstallClick}
                      className="mr-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium"
                    >
                      Install App
                    </button>
                  )}
                  <span className="text-gray-700 mr-4">{user?.email}</span>
                  <button
                    onClick={logout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  {showInstallButton && (
                    <button
                      onClick={handleInstallClick}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium"
                    >
                      Install App
                    </button>
                  )}
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-indigo-600"
                  aria-label="Install App"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${isActive('/dashboard')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/gifts"
                    className={`${isActive('/gifts')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gifts
                  </Link>
                  <Link
                    to="/events"
                    className={`${isActive('/events')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/thank-you"
                    className={`${isActive('/thank-you')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Thank You
                  </Link>
                  <Link
                    to="/gift-history"
                    className={`${isActive('/gift-history')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    to="/guests"
                    className={`${isActive('/guests')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Guests
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`${isActive('/login')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`${isActive('/signup')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                      block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-4 flex items-center">
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content with padding for fixed navbar */}
      <main className="flex-grow mt-16 pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-6 h-16">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link
              to="/gifts"
              className={`flex flex-col items-center justify-center ${isActive('/gifts') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="text-xs mt-1">Gifts</span>
            </Link>

            <Link
              to="/events"
              className={`flex flex-col items-center justify-center ${isActive('/events') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs mt-1">Events</span>
            </Link>

            <Link
              to="/thank-you"
              className={`flex flex-col items-center justify-center ${isActive('/thank-you') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
              <span className="text-xs mt-1">Thank You</span>
            </Link>

            <Link
              to="/guests"
              className={`flex flex-col items-center justify-center ${isActive('/guests') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs mt-1">Guests</span>
            </Link>

            <Link
              to="/reminders"
              className={`flex flex-col items-center justify-center ${isActive('/reminders') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-xs mt-1">Reminders</span>
            </Link>

            <Link
              to="/reports"
              className={`flex flex-col items-center justify-center ${isActive('/reports') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs mt-1">Reports</span>
            </Link>

            <Link
              to="/wishlist"
              className={`flex flex-col items-center justify-center ${isActive('/wishlist') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>

            <Link
              to="/collaborators"
              className={`flex flex-col items-center justify-center ${isActive('/collaborators') ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs mt-1">Collaborate</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
