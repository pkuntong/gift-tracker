import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import GiftManager from '../components/GiftManager';
import Navigation from '../components/Navigation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Include the sidebar navigation */}
      <Navigation />
      
      {/* Main content - with left margin to accommodate the sidebar */}
      <div className="flex-1 ml-64">
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <GiftManager />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 