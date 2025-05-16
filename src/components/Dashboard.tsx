import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import GiftManager from './GiftManager';
import EventManager from './EventManager';

type TabType = 'profile' | 'gifts' | 'events';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('gifts');
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar navigation */}
      <nav className="bg-white shadow h-screen fixed left-0 w-64 flex flex-col">
        {/* Logo Section */}
        <div className="py-6 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
            Gift Tracker
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-grow py-6 px-4 space-y-4">
          <Link
            to="/dashboard"
            className={`${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Dashboard
          </Link>
          <Link
            to="/gifts"
            className={`${
              isActive('/gifts')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Gifts
          </Link>
          <Link
            to="/events"
            className={`${
              isActive('/events')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Events
          </Link>
          <Link
            to="/thank-you"
            className={`${
              isActive('/thank-you')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Thank You Tracker
          </Link>
          <Link
            to="/gift-history"
            className={`${
              isActive('/gift-history')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            History
          </Link>
          <Link
            to="/guests"
            className={`${
              isActive('/guests')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Guests
          </Link>
          <Link
            to="/reminders"
            className={`${
              isActive('/reminders')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Reminders
          </Link>
          <Link
            to="/reports"
            className={`${
              isActive('/reports')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Reports
          </Link>
          <Link
            to="/wishlist"
            className={`${
              isActive('/wishlist')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Wishlist
          </Link>
          <Link
            to="/collaborators"
            className={`${
              isActive('/collaborators')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            } flex items-center px-3 py-3 rounded-md text-sm font-medium`}
          >
            Collaborators
          </Link>
        </div>
        
        {/* User Profile and Logout Section */}
        <div className="py-4 px-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <span className="text-gray-700 text-sm font-medium">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
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
    </div>
  );
};

export default Dashboard; 