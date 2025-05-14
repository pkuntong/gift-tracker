import React from 'react';
import ThankYouTracker from '../components/ThankYouTracker';

const ThankYouTrackerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            Thank You Tracker
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-xl text-gray-500">
            Keep track of your gifts, acknowledge them, and never forget to send a thank you note.
          </p>
        </div>
        
        <ThankYouTracker />
      </div>
    </div>
  );
};

export default ThankYouTrackerPage;
