import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
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
          to="/history"
          className={`${
            isActive('/history')
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
  );
};

export default Navigation; 