import React from 'react';
import { Reminder } from '../firebase/notification-service';
import ReminderCard from './ReminderCard';

interface ReminderListProps {
  reminders: Reminder[];
  isLoading: boolean;
  onDismiss: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddReminder: () => void;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  isLoading,
  onDismiss,
  onDelete,
  onAddReminder
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-600">Loading your reminders...</span>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium text-gray-900">You don't have any reminders yet.</p>
        <p className="text-gray-500 mt-1">Create one to get started!</p>
        <button 
          onClick={onAddReminder}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Reminder
        </button>
      </div>
    );
  }

  // Group reminders by status
  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const otherReminders = reminders.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {pendingReminders.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">Pending Reminders</h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {pendingReminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onDismiss={onDismiss}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {otherReminders.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">Other Reminders</h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {otherReminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onDismiss={onDismiss}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button 
          onClick={onAddReminder}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Reminder
        </button>
      </div>
    </div>
  );
};

export default ReminderList;
