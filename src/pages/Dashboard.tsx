import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GiftManager from '../components/GiftManager';
import Navigation from '../components/Navigation';

// Import or create placeholder components for different tabs
// These are temporary placeholders - you should replace with actual components
const EventManager: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Event Management</h2>
    <p>This is where you'll manage your events.</p>
  </div>
);

const ThankYouTracker: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Thank You Tracker</h2>
    <p>Track your thank you notes here.</p>
  </div>
);

const GiftHistory: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Gift History</h2>
    <p>View your gift history here.</p>
  </div>
);

const GuestManager: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Guest Management</h2>
    <p>Manage your guests here.</p>
  </div>
);

const Reminders: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Reminders</h2>
    <p>Set and manage your reminders here.</p>
  </div>
);

const Reports: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Reports</h2>
    <p>View your reports here.</p>
  </div>
);

const Wishlist: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Wishlist</h2>
    <p>Manage your wishlist here.</p>
  </div>
);

const Collaborators: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Collaborators</h2>
    <p>Manage your collaborators here.</p>
  </div>
);

const UserProfile: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">User Profile</h2>
    <p>Manage your profile here.</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
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
        return <Reminders />;
      case 'reports':
        return <Reports />;
      case 'wishlist':
        return <Wishlist />;
      case 'collaborators':
        return <Collaborators />;
      case 'profile':
        return <UserProfile />;
      default:
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Dashboard Overview</h2>
            <p>Welcome to your dashboard. Use the tabs to navigate between sections.</p>
          </div>
        );
    }
  };

  // We'll address any duplicate tabs in a different way
  // No CSS hiding is needed

  return (
    <div className="min-h-screen bg-gray-50 flex">      
      {/* Modified Navigation component to pass activeTab and setActiveTab */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content - with left margin to accommodate the sidebar */}
      <div className="flex-1 ml-64">
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                activeTab === 'gifts' ? 'Gifts' :
                activeTab === 'events' ? 'Events' :
                activeTab === 'thank-you' ? 'Thank You Tracker' :
                activeTab === 'gift-history' ? 'Gift History' :
                activeTab === 'guests' ? 'Guests' :
                activeTab === 'reminders' ? 'Reminders' :
                activeTab === 'reports' ? 'Reports' :
                activeTab === 'wishlist' ? 'Wishlist' :
                activeTab === 'collaborators' ? 'Collaborators' :
                activeTab === 'profile' ? 'User Profile' : 'Dashboard'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;