import React, { useState, useEffect } from 'react';
import { Reminder, getUserReminders } from '../firebase/notification-service';
import ReminderCard from './ReminderCard';

interface DashboardRemindersProps {
  onAddReminder?: () => void;
}

const DashboardReminders: React.FC<DashboardRemindersProps> = ({ onAddReminder }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setIsLoading(true);
        const userReminders = await getUserReminders();
        
        // Sort reminders by date (upcoming first) and filter to show only pending
        const sortedReminders = userReminders
          .filter(reminder => reminder.status === 'pending')
          .sort((a, b) => a.triggerDate.getTime() - b.triggerDate.getTime())
          .slice(0, 3); // Only show the 3 most immediate reminders
        
        setReminders(sortedReminders);
      } catch (err) {
        setError('Failed to load reminders');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReminders();
  }, []);

  // Simple dummy handler - in dashboard we don't need full functionality
  const handleDelete = () => {
    // In the dashboard view, we'll just show a link to the full reminders page
    console.log('Redirecting to full reminders page for actions');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-24 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
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
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Reminders</h2>
        {onAddReminder && (
          <button
            onClick={onAddReminder}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Add Reminder
          </button>
        )}
      </div>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming reminders</h3>
            <p className="mt-1 text-sm text-gray-500">Create a reminder to get started.</p>
            {onAddReminder && (
              <div className="mt-3">
                <button
                  onClick={onAddReminder}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Reminder
                </button>
              </div>
            )}
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="dashboard-reminder">
              <ReminderCard
                reminder={reminder}
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardReminders;
