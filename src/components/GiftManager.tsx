import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addGift, getUserGifts, updateGift, deleteGift } from '../firebase/gift-service';
import { createThankYouReminder, requestNotificationPermission } from '../firebase/notification-service';
import ImageUploader from './ImageUploader';

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
  photoURL?: string;        // URL to the gift photo
  giverPhotoURL?: string;   // URL to the giver's photo
  eventPhotoURL?: string;   // URL to the event photo
}

const GiftManager: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    giver: '',
    occasion: '',
    date: '',
    notes: '',
    photoURL: '',
    giverPhotoURL: '',
    eventPhotoURL: ''
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Fetching gifts...');
      fetchGifts();
    }
  }, [isAuthenticated, user]);

  const fetchGifts = async () => {
    if (!user) {
      console.error('No authenticated user found');
      setError('Please log in to view gifts');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching gifts from Firebase for user:', user.id);
      
      const userGifts = await getUserGifts(user.id);
      console.log('Firebase gifts response:', userGifts);
      
      // Map the database gifts to include the new fields if they don't exist
      const updatedGifts = userGifts.map(gift => ({
        ...gift,
        acknowledged: gift.acknowledged ?? false,
        reminderSet: gift.reminderSet ?? false,
        // Add other default values for new fields
      }));
      
      setGifts(updatedGifts);
    } catch (err: any) {
      console.error('Error fetching gifts from Firebase:', err);
      setError(err.message || 'Failed to fetch gifts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any error messages when user starts typing
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Gift name is required');
      return false;
    }
    if (!formData.giver.trim()) {
      setError('Giver name is required');
      return false;
    }
    if (!formData.occasion.trim()) {
      setError('Occasion is required');
      return false;
    }
    if (formData.price && isNaN(parseFloat(formData.price))) {
      setError('Price must be a valid number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      const giftData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        thankYouSent: false,
        acknowledged: false,
        reminderSet: false,
        userId: user.id
      };

      if (editingGift) {
        // Update existing gift
        await updateGift(editingGift.id, user.id, {
          name: giftData.name,
          price: giftData.price,
          giver: giftData.giver,
          occasion: giftData.occasion,
          date: giftData.date,
          notes: giftData.notes,
          photoURL: giftData.photoURL,
          giverPhotoURL: giftData.giverPhotoURL,
          eventPhotoURL: giftData.eventPhotoURL
        });
        setSuccessMessage('Gift updated successfully');
      } else {
        // Add new gift
        const newGift = await addGift(giftData);
        setSuccessMessage('Gift added successfully');
        
        // Check notification permission and create a thank-you reminder
        const hasPermission = await requestNotificationPermission();
        if (hasPermission && newGift && newGift.id) {
          // Create a thank-you reminder for the new gift
          await createThankYouReminder(
            newGift.id,
            newGift.name,
            newGift.giver
          );
          console.log('Thank you reminder created for', newGift.name);
        }
      }

      // Reset form and refresh gifts
      setFormData({
        name: '',
        price: '',
        giver: '',
        occasion: '',
        date: '',
        notes: '',
        photoURL: '',
        giverPhotoURL: '',
        eventPhotoURL: ''
      });
      setIsAddingGift(false);
      setEditingGift(null);
      fetchGifts();
    } catch (err: any) {
      console.error('Error saving gift:', err);
      setError(err.message || (editingGift ? 'Failed to update gift' : 'Failed to add gift'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (gift: Gift) => {
    setFormData({
      name: gift.name,
      price: gift.price.toString(),
      giver: gift.giver,
      occasion: gift.occasion,
      date: gift.date,
      notes: gift.notes || '',
      photoURL: gift.photoURL || '',
      giverPhotoURL: gift.giverPhotoURL || '',
      eventPhotoURL: gift.eventPhotoURL || ''
    });
    setEditingGift(gift);
    setIsAddingGift(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this gift?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteGift(id, user.id);
      setSuccessMessage('Gift deleted successfully');
      fetchGifts();
    } catch (err: any) {
      setError('Failed to delete gift');
      console.error('Error deleting gift:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleThankYou = async (gift: Gift) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await updateGift(gift.id, user.id, { thankYouSent: !gift.thankYouSent });
      setSuccessMessage(`Thank you ${gift.thankYouSent ? 'unmarked' : 'marked'} as sent`);
      fetchGifts();
    } catch (err: any) {
      setError('Failed to update thank you status');
      console.error('Error updating thank you status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to manage your gifts</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Gifts</h2>
          <button
            onClick={() => {
              setIsAddingGift(true);
              setEditingGift(null);
              setFormData({
                name: '',
                price: '',
                giver: '',
                occasion: '',
                date: '',
                notes: '',
                photoURL: '',
                giverPhotoURL: '',
                eventPhotoURL: ''
              });
              setError(null);
              setSuccessMessage(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Gift
          </button>
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

        {isAddingGift && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingGift ? 'Edit Gift' : 'Add New Gift'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Gift Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., KitchenAid Mixer"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 299.99"
                    />
                  </div>
                  <div>
                    <label htmlFor="giver" className="block text-sm font-medium text-gray-700">
                      Giver *
                    </label>
                    <input
                      type="text"
                      name="giver"
                      id="giver"
                      required
                      value={formData.giver}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Aunt Sarah"
                    />
                  </div>
                  <div>
                    <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">
                      Occasion *
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      id="occasion"
                      required
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Wedding"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <h5 className="mb-3">Photos (Optional)</h5>
                  
                  <div className="mb-3">
                    <label className="form-label d-block">Gift Photo</label>
                    <ImageUploader
                      onImageUploaded={(url) => setFormData(prev => ({ ...prev, photoURL: url }))}
                      existingImageUrl={formData.photoURL}
                      path={`users/${user?.id}/gifts`}
                      buttonText="Upload Gift Photo"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Giver Photo</label>
                    <ImageUploader
                      onImageUploaded={(url) => setFormData(prev => ({ ...prev, giverPhotoURL: url }))}
                      existingImageUrl={formData.giverPhotoURL}
                      path={`users/${user?.id}/givers`}
                      buttonText="Upload Giver Photo"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Event Photo</label>
                    <ImageUploader
                      onImageUploaded={(url) => setFormData(prev => ({ ...prev, eventPhotoURL: url }))}
                      existingImageUrl={formData.eventPhotoURL}
                      path={`users/${user?.id}/events`}
                      buttonText="Upload Event Photo"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingGift(false);
                      setEditingGift(null);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingGift ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingGift ? 'Update Gift' : 'Add Gift'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">No gifts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Add your first gift to get started</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {gifts.map((gift) => (
                <li key={gift.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="col-md-4 d-flex">
                        {gift.photoURL && (
                          <div className="me-3">
                            <img 
                              src={gift.photoURL} 
                              alt={gift.name} 
                              className="img-thumbnail" 
                              style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div>
                          <strong>{gift.name}</strong>
                          <div className="text-muted d-flex align-items-center">
                            {gift.giverPhotoURL && (
                              <img 
                                src={gift.giverPhotoURL} 
                                alt={gift.giver} 
                                className="rounded-circle me-1" 
                                style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                              />
                            )}
                            <span>From: {gift.giver}</span>
                          </div>
                          <div className="text-muted small">
                            {gift.occasion} - {gift.date}
                            {gift.eventPhotoURL && (
                              <img 
                                src={gift.eventPhotoURL} 
                                alt={gift.occasion} 
                                className="rounded ms-1" 
                                style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          {gift.price > 0 && (
                            <div className="small text-primary">
                              ${gift.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                        {gift.price > 0 && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${gift.price.toFixed(2)}
                          </span>
                        )}
                        <button
                          onClick={() => handleToggleThankYou(gift)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            gift.thankYouSent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {gift.thankYouSent ? 'Thank You Sent' : 'Send Thank You'}
                        </button>
                        <button
                          onClick={() => handleEdit(gift)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(gift.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {gift.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{gift.notes}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftManager; 