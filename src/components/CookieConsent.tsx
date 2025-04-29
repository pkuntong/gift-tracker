import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and cannot be changed
    functional: false,
    analytics: false,
    advertising: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consentStatus = localStorage.getItem('cookieConsent');
    
    if (!consentStatus) {
      // Show the banner if no consent has been given
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    // Set all preferences to true (except necessary which is always true)
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
    });
    
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString(),
    }));
    
    // Hide the banner
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    
    // Hide the banner
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    // Set all preferences to false (except necessary which is always true)
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      advertising: false,
    });
    
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString(),
    }));
    
    // Hide the banner
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. 
              <Link to="/cookie-policy" className="text-indigo-600 hover:underline ml-1">
                Learn more
              </Link>
            </p>
            
            {showPreferences && (
              <div className="mb-4 space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="necessary"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="necessary" className="ml-2 block text-sm">
                    <span className="font-medium">Necessary</span>
                    <span className="text-gray-500 block">Required for the website to function properly. Cannot be disabled.</span>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="functional"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="functional" className="ml-2 block text-sm">
                    <span className="font-medium">Functional</span>
                    <span className="text-gray-500 block">Enable enhanced functionality and personalization.</span>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="analytics" className="ml-2 block text-sm">
                    <span className="font-medium">Analytics</span>
                    <span className="text-gray-500 block">Help us understand how visitors interact with our website.</span>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="advertising"
                    checked={preferences.advertising}
                    onChange={(e) => setPreferences({...preferences, advertising: e.target.checked})}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="advertising" className="ml-2 block text-sm">
                    <span className="font-medium">Advertising</span>
                    <span className="text-gray-500 block">Used to deliver personalized advertisements.</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {!showPreferences ? (
              <>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Accept All
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Preferences
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 