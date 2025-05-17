import React, { useState, useEffect } from 'react';
import { Reminder } from '../firebase/notification-service';

interface ReminderFormProps {
  onSubmit: (reminderData: Partial<Reminder>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Reminder>;
  isEditing?: boolean;
}

const ReminderForm: React.FC<ReminderFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    date: '',
    time: '10:00',
    type: 'custom' as 'gift-logging' | 'thank-you' | 'custom',
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly'
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const triggerDate = initialData.triggerDate ? new Date(initialData.triggerDate) : new Date();
      
      setFormData({
        title: initialData.title || '',
        message: initialData.message || '',
        date: triggerDate.toISOString().split('T')[0],
        time: `${String(triggerDate.getHours()).padStart(2, '0')}:${String(triggerDate.getMinutes()).padStart(2, '0')}`,
        type: initialData.type || 'custom',
        repeat: initialData.repeat || 'none'
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!formData.title || !formData.message || !formData.date) {
        setError('Please fill all required fields');
        return;
      }

      // Combine date and time
      const [year, month, day] = formData.date.split('-').map(Number);
      const [hours, minutes] = formData.time.split(':').map(Number);
      const triggerDate = new Date(year, month - 1, day, hours, minutes);

      // Check if date is in the future
      if (triggerDate <= new Date()) {
        setError('Please select a future date and time');
        return;
      }

      console.log('Submitting reminder with data:', {
        title: formData.title.trim(),
        message: formData.message.trim(),
        triggerDate,
        type: formData.type,
        repeat: formData.repeat
      });

      // Create the reminder data
      const reminderData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        triggerDate,
        type: formData.type,
        repeat: formData.repeat
      };

      await onSubmit(reminderData);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        message: '',
        date: '',
        time: '10:00',
        type: 'custom',
        repeat: 'none'
      });
    } catch (err) {
      console.error('Error in ReminderForm submit:', err);
      setError(err instanceof Error ? err.message : 'Failed to save reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {isEditing ? 'Edit Reminder' : 'Create New Reminder'}
        </h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-center">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Reminder Title"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Reminder message..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Reminder Type
              </label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="custom">Custom</option>
                <option value="gift-logging">Gift Logging</option>
                <option value="thank-you">Thank You</option>
              </select>
            </div>

            <div>
              <label htmlFor="repeat" className="block text-sm font-medium text-gray-700">
                Repeat
              </label>
              <select
                name="repeat"
                id="repeat"
                value={formData.repeat}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="none">Don't repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
