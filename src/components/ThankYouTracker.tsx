import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserGifts, updateGift } from '../firebase/gift-service';

interface Gift {
  id: string;
  name: string;
  price: number;
  giver: string;
  occasion: string;
  date: string;
  thankYouSent: boolean;
  acknowledged: boolean;
  acknowledgedDate?: string;
  reminderDate?: string;
  reminderSet: boolean;
  notes?: string;
  userId?: string;
}

const ThankYouTracker: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'acknowledged' | 'thanked'>('all');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [reminderDate, setReminderDate] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchGifts();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterGifts();
  }, [gifts, filter]);

  const fetchGifts = async () => {
    if (!user) {
      setError('Please log in to view your thank you tracker');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const userGifts = await getUserGifts(user.id);
      
      // Map the database gifts to include the new fields if they don't exist
      const updatedGifts = userGifts.map(gift => ({
        ...gift,
        acknowledged: gift.acknowledged ?? false,
        reminderSet: gift.reminderSet ?? false,
      }));
      
      setGifts(updatedGifts);
    } catch (err: any) {
      console.error('Error fetching gifts:', err);
      setError(err.message || 'Failed to fetch gifts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterGifts = () => {
    switch (filter) {
      case 'pending':
        setFilteredGifts(gifts.filter(gift => !gift.acknowledged && !gift.thankYouSent));
        break;
      case 'acknowledged':
        setFilteredGifts(gifts.filter(gift => gift.acknowledged && !gift.thankYouSent));
        break;
      case 'thanked':
        setFilteredGifts(gifts.filter(gift => gift.thankYouSent));
        break;
      default:
        setFilteredGifts(gifts);
    }
  };

  const handleMarkAcknowledged = async (gift: Gift) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await updateGift(gift.id, user.id, { 
        acknowledged: true, 
        acknowledgedDate: new Date().toISOString() 
      });
      setSuccessMessage(`Gift from ${gift.giver} marked as acknowledged`);
      fetchGifts();
    } catch (err: any) {
      setError('Failed to update acknowledgment status');
      console.error('Error updating acknowledgment status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkThankYouSent = async (gift: Gift) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await updateGift(gift.id, user.id, { 
        thankYouSent: true,
        reminderSet: false // Clear any reminders
      });
      setSuccessMessage(`Thank you for gift from ${gift.giver} marked as sent`);
      fetchGifts();
    } catch (err: any) {
      setError('Failed to update thank you status');
      console.error('Error updating thank you status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetReminder = async (gift: Gift) => {
    if (!user || !reminderDate) return;
    
    try {
      setIsLoading(true);
      await updateGift(gift.id, user.id, { 
        reminderSet: true,
        reminderDate: reminderDate
      });
      setSuccessMessage(`Reminder set for ${new Date(reminderDate).toLocaleDateString()}`);
      setReminderDate('');
      fetchGifts();
    } catch (err: any) {
      setError('Failed to set reminder');
      console.error('Error setting reminder:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateThankYouTemplate = (gift: Gift) => {
    const templates = [
      `Dear ${gift.giver},\n\nThank you so much for the ${gift.name}! It was so thoughtful of you to give this for my ${gift.occasion}. I really appreciate your generosity and kindness.\n\nWarmly,\n[Your Name]`,
      
      `Dear ${gift.giver},\n\nI wanted to take a moment to express my sincere thanks for the wonderful ${gift.name}. Your gift made my ${gift.occasion} even more special, and I'm truly grateful for your thoughtfulness.\n\nWith appreciation,\n[Your Name]`,
      
      `Dear ${gift.giver},\n\nWhat a lovely surprise to receive the ${gift.name} for my ${gift.occasion}! It was exactly what I wanted, and I can't thank you enough for your generosity. Your thoughtfulness means the world to me.\n\nMany thanks,\n[Your Name]`
    ];
    
    // Randomly select a template
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to use the Thank You Tracker</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Thank You Tracker</h2>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              All Gifts
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-300`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('acknowledged')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'acknowledged' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-300`}
            >
              Acknowledged
            </button>
            <button
              onClick={() => setFilter('thanked')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${filter === 'thanked' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              Thanked
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredGifts.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No gifts found. Add some gifts to start tracking thank you notes.'
                : filter === 'pending'
                ? 'No pending gifts found. All your gifts have been acknowledged or thanked!'
                : filter === 'acknowledged'
                ? 'No acknowledged gifts found. Mark some gifts as acknowledged to see them here.'
                : 'No thanked gifts found. Send some thank you notes to see them here.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredGifts.map((gift) => (
                <li key={gift.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        {gift.name}
                      </p>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">
                          From: <span className="font-medium">{gift.giver}</span> • 
                          Occasion: <span className="font-medium">{gift.occasion}</span> • 
                          Date: <span className="font-medium">{new Date(gift.date).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        {gift.acknowledged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Acknowledged {gift.acknowledgedDate && `on ${new Date(gift.acknowledgedDate).toLocaleDateString()}`}
                          </span>
                        )}
                        {gift.thankYouSent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Thank You Sent
                          </span>
                        )}
                        {gift.reminderSet && gift.reminderDate && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Reminder: {new Date(gift.reminderDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      {!gift.acknowledged && (
                        <button
                          onClick={() => handleMarkAcknowledged(gift)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Acknowledge
                        </button>
                      )}
                      
                      {!gift.thankYouSent && (
                        <button
                          onClick={() => {
                            setSelectedGift(gift);
                            setShowTemplateModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Generate Thank You
                        </button>
                      )}
                      
                      {!gift.reminderSet && !gift.thankYouSent && (
                        <div className="relative inline-block">
                          <input
                            type="date"
                            className="pl-3 pr-10 py-1.5 border border-gray-300 text-xs rounded-md"
                            min={new Date().toISOString().split('T')[0]}
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                          />
                          <button
                            onClick={() => handleSetReminder(gift)}
                            disabled={!reminderDate}
                            className="ml-1 inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Set Reminder
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Thank You Template Modal */}
      {showTemplateModal && selectedGift && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Thank You Note Template
                    </h3>
                    <div className="mt-4">
                      <textarea
                        className="w-full h-60 p-3 border border-gray-300 rounded-md"
                        value={generateThankYouTemplate(selectedGift)}
                        readOnly
                      ></textarea>
                      <p className="mt-2 text-sm text-gray-500">
                        Copy this template and personalize it for your thank you note. You can edit it as needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleMarkThankYouSent(selectedGift);
                    setShowTemplateModal(false);
                    setSelectedGift(null);
                  }}
                >
                  Mark as Sent
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedGift(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYouTracker;
