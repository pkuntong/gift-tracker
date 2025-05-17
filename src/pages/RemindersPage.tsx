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
import ReminderList from '../components/ReminderList';
import ReminderForm from '../components/ReminderForm';

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

  // Note: formatDate logic moved to ReminderCard component

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

  const handleCreateReminder = async (reminderData: Partial<Reminder>) => {
    try {
      setError(null);
      const reminderId = await createReminder({
        title: reminderData.title || '',
        message: reminderData.message || '',
        triggerDate: reminderData.triggerDate || new Date(),
        type: reminderData.type || 'custom',
        repeat: reminderData.repeat || 'none',
        userId: '' // This will be set in createReminder
      });

      if (!reminderId) {
        throw new Error('Failed to create reminder');
      }

      // Reload reminders
      const userReminders = await getUserReminders();
      setReminders(userReminders);
      setShowNewReminderForm(false);
      
      // Reset form
      setNewReminder({
        title: '',
        message: '',
        date: '',
        time: '10:00',
        type: 'custom',
        repeat: 'none'
      });
    } catch (err) {
      setError('Failed to create reminder. Please try again.');
      console.error(err);
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <div className="flex space-x-4">
          {!notificationPermission && (
            <button
              onClick={handleRequestPermission}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Enable Notifications
            </button>
          )}
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
            initialData={newReminder}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <ReminderList 
          reminders={reminders}
          isLoading={loading}
          onDismiss={handleDismiss}
          onDelete={handleDelete}
          onAddReminder={() => setShowNewReminderForm(true)}
        />
      </div>
    </div>
  );
};

export default RemindersPage;
