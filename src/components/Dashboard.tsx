import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import GiftManager from './GiftManager';
import EventManager from './EventManager';

type TabType = 'profile' | 'gifts' | 'events';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('gifts');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'gifts':
        return <GiftManager />;
      case 'events':
        return <EventManager />;
      default:
        return <GiftManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        {/* Tab navigation */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('gifts')}
            className={`${
              activeTab === 'gifts'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } pb-4 pt-2 px-1 border-b-2 text-sm font-medium`}
          >
            Gifts
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${
              activeTab === 'events'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } pb-4 pt-2 px-1 border-b-2 text-sm font-medium`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } pb-4 pt-2 px-1 border-b-2 text-sm font-medium`}
          >
            Profile
          </button>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 