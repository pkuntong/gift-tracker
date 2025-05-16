import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  // Function to check if a tab is active
  const isActive = (tab: string) => activeTab === tab;
  
  // Function to handle tab click
  const handleTabClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    setActiveTab(tab);
  };

  return (
    <nav className="bg-white shadow h-screen fixed left-0 w-64 flex flex-col">
      {/* Logo Section */}
      <div className="py-6 px-4 border-b border-gray-200">
        <span 
          onClick={handleTabClick('dashboard')} 
          className="text-xl font-bold text-indigo-600 cursor-pointer"
        >
          Gift Tracker
        </span>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-grow py-6 px-4 space-y-4">
        <a
          href="#"
          onClick={handleTabClick('dashboard')}
          className={`${
            isActive('dashboard')
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
            isActive('gifts')
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
            isActive('events')
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
            isActive('thank-you')
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
            isActive('gift-history')
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
            isActive('guests')
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
            isActive('reminders')
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
            isActive('reports')
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
            isActive('wishlist')
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
            isActive('collaborators')
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
            {user?.name}
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
  );
};

export default Navigation;