import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import GiftManager from './GiftManager';
import EventManager from './EventManager';
import ThankYouTracker from './ThankYouTracker';
import GiftHistory from './GiftHistory';
import GuestManager from './GuestManager';

type TabType = 'gifts' | 'events' | 'profile' | 'thank-you' | 'gift-history' | 'guests' | 
               'reminders' | 'reports' | 'wishlist' | 'collaborators' | 'dashboard';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
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
      case 'thank-you':
        return <ThankYouTracker />;
      case 'gift-history':
        return <GiftHistory />;
      case 'guests':
        return <GuestManager />;
      case 'reminders':
        return <div>Reminders Component</div>;
      case 'reports':
        return <div>Reports Component</div>;
      case 'wishlist':
        return <div>Wishlist Component</div>;
      case 'collaborators':
        return <div>Collaborators Component</div>;
      case 'dashboard':
      default:
        return <GiftManager />;
    }
  };

  // Handle tab switching
  const handleTabClick = (tab: TabType) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar navigation */}
      <nav className="bg-white shadow h-screen fixed left-0 w-64 flex flex-col">
        {/* Logo Section */}
        <div className="py-6 px-4 border-b border-gray-200">
          <a 
            href="#" 
            onClick={handleTabClick('dashboard')} 
            className="text-xl font-bold text-indigo-600"
          >
            Gift Tracker
          </a>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-grow py-6 px-4 space-y-4">
          <a
            href="#"
            onClick={handleTabClick('dashboard')}
            className={`${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Dashboard
          </a>
          <a
            href="#"
            onClick={handleTabClick('gifts')}
            className={`${
              activeTab === 'gifts'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Gifts
          </a>
          <a
            href="#"
            onClick={handleTabClick('events')}
            className={`${
              activeTab === 'events'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Events
          </a>
          <a
            href="#"
            onClick={handleTabClick('thank-you')}
            className={`${
              activeTab === 'thank-you'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Thank You Tracker
          </a>
          <a
            href="#"
            onClick={handleTabClick('gift-history')}
            className={`${
              activeTab === 'gift-history'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            History
          </a>
          <a
            href="#"
            onClick={handleTabClick('guests')}
            className={`${
              activeTab === 'guests'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Guests
          </a>
          <a
            href="#"
            onClick={handleTabClick('reminders')}
            className={`${
              activeTab === 'reminders'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Reminders
          </a>
          <a
            href="#"
            onClick={handleTabClick('reports')}
            className={`${
              activeTab === 'reports'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Reports
          </a>
          <a
            href="#"
            onClick={handleTabClick('wishlist')}
            className={`${
              activeTab === 'wishlist'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Wishlist
          </a>
          <a
            href="#"
            onClick={handleTabClick('collaborators')}
            className={`${
              activeTab === 'collaborators'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Collaborators
          </a>
        </div>
        
        {/* User Profile and Logout Section */}
        <div className="py-4 px-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <a 
              href="#"
              onClick={handleTabClick('profile')}
              className="text-gray-700 text-sm font-medium hover:text-indigo-600"
            >
              {user?.name || 'Profile'}
            </a>
            <button
              onClick={logout}
              className="logout-button bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main content area with margin to avoid sidebar overlap */}
      <div className="flex-1 ml-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Tab content */}
          <div className="bg-white shadow rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;