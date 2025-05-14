import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Reminder,
  getUserReminders,
  updateReminderStatus,
  deleteReminder,
  createReminder,
  requestNotificationPermission
} from '../firebase/notification-service';
import { useAuth } from '../contexts/AuthContext';

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);
  const [showNewReminderForm, setShowNewReminderForm] = useState<boolean>(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    date: '',
    time: '10:00',
    type: 'custom' as 'gift-logging' | 'thank-you' | 'custom',
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly'
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load reminders and check notification permission
  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const userReminders = await getUserReminders();
        setReminders(userReminders);
        
        // Check notification permission
        if ('Notification' in window) {
          const hasPermission = Notification.permission === 'granted';
          setNotificationPermission(hasPermission);
        }
      } catch (err) {
        setError('Failed to load reminders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  // Request notification permission
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle dismiss reminder
  const handleDismiss = async (reminderId: string) => {
    try {
      await updateReminderStatus(reminderId, 'dismissed');
      setReminders(reminders.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, status: 'dismissed' } 
          : reminder
      ));
    } catch (err) {
      setError('Failed to dismiss reminder');
      console.error(err);
    }
  };

  // Handle delete reminder
  const handleDelete = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId);
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    } catch (err) {
      setError('Failed to delete reminder');
      console.error(err);
    }
  };

  // Handle create new reminder
  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newReminder.title || !newReminder.message || !newReminder.date) {
        setError('Please fill all required fields');
        return;
      }

      // Combine date and time
      const [year, month, day] = newReminder.date.split('-').map(Number);
      const [hours, minutes] = newReminder.time.split(':').map(Number);
      const triggerDate = new Date(year, month - 1, day, hours, minutes);

      const reminderData = {
        title: newReminder.title,
        message: newReminder.message,
        triggerDate,
        type: newReminder.type,
        repeat: newReminder.repeat,
        userId: '' // This will be set in the createReminder function
      };

      await createReminder(reminderData);
      
      // Reset form and refresh reminders
      setNewReminder({
        title: '',
        message: '',
        date: '',
        time: '10:00',
        type: 'custom',
        repeat: 'none'
      });
      setShowNewReminderForm(false);
      
      // Reload reminders
      const userReminders = await getUserReminders();
      setReminders(userReminders);
    } catch (err) {
      setError('Failed to create reminder');
      console.error(err);
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'gift-logging':
        return 'bg-green-100 text-green-800';
      case 'thank-you':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Reminders & Notifications</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reminders & Notifications</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Notification Permission Banner */}
      {!notificationPermission && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <p>
            Enable notifications to receive timely reminders about gift logging and thank you notes!
          </p>
          <button
            onClick={handleRequestPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* Create New Reminder Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewReminderForm(!showNewReminderForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showNewReminderForm ? 'Cancel' : 'Create New Reminder'}
        </button>
      </div>

      {/* New Reminder Form */}
      {showNewReminderForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Reminder</h2>
          <form onSubmit={handleCreateReminder}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Reminder Type
                </label>
                <select
                  id="type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value as any})}
                >
                  <option value="custom">Custom</option>
                  <option value="gift-logging">Gift Logging</option>
                  <option value="thank-you">Thank You</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeat">
                  Repeat
                </label>
                <select
                  id="repeat"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newReminder.repeat}
                  onChange={(e) => setNewReminder({...newReminder, repeat: e.target.value as any})}
                >
                  <option value="none">Do not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowNewReminderForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Reminder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold">Your Reminders</h2>
        </div>

        {reminders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>You don't have any reminders yet.</p>
            <p className="mt-1">Create one to get started!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="px-6 py-4">
                <div className="flex flex-wrap justify-between items-start">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{reminder.title}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(reminder.type)}`}>
                        {reminder.type === 'gift-logging' ? 'Gift Logging' : 
                         reminder.type === 'thank-you' ? 'Thank You' : 'Custom'}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(reminder.status)}`}>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{reminder.message}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(reminder.triggerDate)}
                    </p>
                    {reminder.repeat && reminder.repeat !== 'none' && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Repeats {reminder.repeat}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {reminder.status === 'pending' && (
                      <button
                        onClick={() => handleDismiss(reminder.id!)}
                        className="flex items-center text-yellow-600 hover:text-yellow-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-1">Dismiss</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(reminder.id!)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-1">Delete</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;
