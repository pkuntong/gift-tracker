import React from 'react';
import { Reminder } from '../firebase/notification-service';

interface ReminderCardProps {
  reminder: Reminder;
  onDismiss?: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ 
  reminder, 
  onDismiss, 
  onDelete 
}) => {
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

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'gift-logging':
        return 'bg-blue-100 text-blue-800';
      case 'thank-you':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-wrap justify-between items-start">
          <div className="mb-2 sm:mb-0">
            <div className="flex flex-wrap items-center">
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
            <div className="flex flex-wrap mt-2">
              <p className="text-sm text-gray-500 flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(reminder.triggerDate)}
              </p>
              {reminder.repeat && reminder.repeat !== 'none' && (
                <p className="text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Repeats {reminder.repeat}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            {reminder.status === 'pending' && onDismiss && (
              <button
                onClick={() => onDismiss(reminder.id!)}
                className="flex items-center px-2 py-1 text-sm rounded-md bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                aria-label="Dismiss reminder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Dismiss</span>
              </button>
            )}
            <button
              onClick={() => onDelete(reminder.id!)}
              className="flex items-center px-2 py-1 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100"
              aria-label="Delete reminder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
