import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import GiftManager from './GiftManager';
import EventManager from './EventManager';
import ThankYouTracker from './ThankYouTracker';
import GiftHistory from './GiftHistory';
import GuestManager from './GuestManager';
import DashboardReminders from './DashboardReminders';
import ReminderForm from './ReminderForm';
import { Reminder, createReminder, getUserReminders } from '../firebase/notification-service';
import { getAuth } from 'firebase/auth';

type TabType = 'gifts' | 'events' | 'profile' | 'thank-you' | 'gift-history' | 'guests' | 
               'reminders' | 'reports' | 'wishlist' | 'collaborators' | 'dashboard';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateReminder = async (reminderData: Partial<Reminder>) => {
    try {
      setError(null);

      console.log('Dashboard: Creating reminder with data:', reminderData);

      // Ensure we have all required fields
      if (!reminderData.title || !reminderData.message || !reminderData.triggerDate) {
        console.error('Missing required fields:', reminderData);
        throw new Error('Please fill in all required fields');
      }

      // Validate the date is in the future
      if (reminderData.triggerDate <= new Date()) {
        console.error('Invalid date:', reminderData.triggerDate);
        throw new Error('Please select a future date and time');
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('You must be logged in to create a reminder');
      }

      // Create the reminder with proper data structure
      const reminderId = await createReminder({
        title: reminderData.title.trim(),
        message: reminderData.message.trim(),
        triggerDate: reminderData.triggerDate,
        type: reminderData.type || 'custom',
        repeat: reminderData.repeat || 'none',
        userId: user.uid // Set the user ID here
      });

      console.log('Dashboard: Reminder created with ID:', reminderId);

      if (!reminderId) {
        throw new Error('Failed to create reminder');
      }

      // Reload reminders
      const userReminders = await getUserReminders();
      console.log('Dashboard: Loaded reminders:', userReminders);
      setShowNewReminderForm(false);
    } catch (err) {
      console.error('Dashboard: Error creating reminder:', err);
      setError(err instanceof Error ? err.message : 'Failed to create reminder. Please try again.');
    }
  };

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
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Reminders</h2>
              <button
                onClick={() => setShowNewReminderForm(!showNewReminderForm)}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {showNewReminderForm ? 'Cancel' : 'Add Reminder'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {showNewReminderForm && (
              <div className="mb-8">
                <ReminderForm 
                  onSubmit={handleCreateReminder}
                  onCancel={() => setShowNewReminderForm(false)}
                  initialData={{
                    title: '',
                    message: '',
                    type: 'custom',
                    repeat: 'none'
                  }}
                />
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <DashboardReminders onAddReminder={() => setShowNewReminderForm(true)} />
            </div>
          </div>
        );
      case 'reports':
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Reports & Analytics</h2>
            <p className="mb-6 text-gray-600">View analytics and reports about your gifts, reminders, and activity.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Gift Activity</h3>
                <div className="h-32 flex items-center justify-center text-gray-400">[Gift activity chart coming soon]</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Reminders Overview</h3>
                <div className="h-32 flex items-center justify-center text-gray-400">[Reminders analytics coming soon]</div>
              </div>
            </div>
            <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <ul className="text-gray-500 list-disc ml-6">
                <li>Gift added: [placeholder]</li>
                <li>Reminder created: [placeholder]</li>
                <li>Thank you sent: [placeholder]</li>
              </ul>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Wishlist</h2>
            <p className="mb-6 text-gray-600">Keep track of gifts you'd like to receive or give in the future.</p>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-medium mb-2">Add to Wishlist</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a gift idea... (feature coming soon)"
                  disabled
                />
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                  disabled
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Wishlist management coming soon.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Your Wishlist</h3>
              <ul className="list-disc ml-6 text-gray-500">
                <li>New headphones [placeholder]</li>
                <li>Cookbook [placeholder]</li>
                <li>Board game [placeholder]</li>
              </ul>
              <p className="text-gray-400 mt-4">Start adding items to your wishlist to keep track of gift ideas!</p>
            </div>
          </div>
        );
      case 'collaborators':
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Collaborators</h2>
            <p className="mb-6 text-gray-600">Invite friends or family to help you manage gifts, events, and reminders.</p>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-medium mb-2">Invite a Collaborator</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email address... (feature coming soon)"
                  disabled
                />
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                  disabled
                >
                  Invite
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Collaborator invitations coming soon.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Your Collaborators</h3>
              <ul className="list-disc ml-6 text-gray-500">
                <li>Jane Doe (jane@example.com) [placeholder]</li>
                <li>John Smith (john@example.com) [placeholder]</li>
              </ul>
              <p className="text-gray-400 mt-4">Invite others to help you manage your gift tracking and events!</p>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Dashboard Overview</h2>
            <p className="mb-6">Welcome to your dashboard. Use the tabs to navigate between sections.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <DashboardReminders onAddReminder={() => setShowNewReminderForm(true)} />
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Gifts</h3>
                <p className="text-gray-500">Your recent gift activity will appear here.</p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
                <p className="text-gray-500">Your upcoming events will appear here.</p>
              </div>
            </div>
          </div>
        );
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
          <Link 
            to="/" 
            className="text-xl font-bold text-indigo-600"
          >
            Gift Tracker
          </Link>
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