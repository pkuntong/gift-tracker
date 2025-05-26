import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GiftManager from '../components/GiftManager';
import Navigation from '../components/Navigation';
import DashboardReminders from '../components/DashboardReminders';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Timestamp } from 'firebase/firestore';
import WishlistPage from '../pages/WishlistPage';
import CollaboratorsPage from '../pages/CollaboratorsPage';
import ReportsPage from '../pages/ReportsPage';
import GuestManagerPage from '../pages/GuestManagerPage';
import GiftHistoryPage from '../pages/GiftHistoryPage';
import ThankYouTrackerPage from '../pages/ThankYouTrackerPage';
import EventManager from '../components/EventManager';
import { Link } from 'react-router-dom';

const Reminders: React.FC = () => (
  <div>
    <h2 className="text-2xl font-medium mb-4">Reminders</h2>
    <DashboardReminders />
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gifts, setGifts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'gifts'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGifts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'events'),
      where('userId', '==', user.id),
      orderBy('date', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gifts':
        return <GiftManager />;
      case 'events':
        return <EventManager />;
      case 'thank-you':
        return <ThankYouTrackerPage />;
      case 'gift-history':
        return <GiftHistoryPage />;
      case 'guests':
        return <GuestManagerPage />;
      case 'reminders':
        return <Reminders />;
      case 'reports':
        return <ReportsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'collaborators':
        return <CollaboratorsPage />;
      default:
        return (
          <div>
            <h2 className="text-2xl font-medium mb-4">Dashboard Overview</h2>
            <p className="mb-6">Welcome to your dashboard. Use the tabs to navigate between sections.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <DashboardReminders />
              </div>
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Recent Gifts</h2>
                {gifts.length === 0 ? (
                  <div>Your recent gift activity will appear here.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {gifts.map(gift => (
                      <li key={gift.id} className="py-2">
                        <span className="font-medium">{gift.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
                {events.length === 0 ? (
                  <p className="text-gray-500">Your upcoming events will appear here.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {events.map(event => (
                      <li key={event.id} className="py-2">
                        <span className="font-medium">{event.name}</span>
                        {event.date && (
                          <span className="ml-2 text-gray-500 text-sm">
                            {event.date instanceof Timestamp
                              ? event.date.toDate().toLocaleDateString()
                              : new Date(event.date).toLocaleDateString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64">
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Top bar navigation */}
            <div className="flex items-center space-x-6 mb-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium">Pricing</Link>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;