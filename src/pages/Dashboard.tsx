import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import GiftManager from '../components/GiftManager';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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
  );
};

export default Dashboard; 