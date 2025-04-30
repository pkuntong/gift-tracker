import React, { useState, useEffect } from 'react';

interface LiveChatProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen = false, onClose }) => {
  const [isChatOpen, setIsChatOpen] = useState(isOpen);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if support is available based on current time
  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      // Support available Monday-Friday, 9am-5pm
      const isWeekday = day >= 1 && day <= 5;
      const isBusinessHours = hour >= 9 && hour < 17;
      
      setIsAvailable(isWeekday && isBusinessHours);
      setCurrentTime(now);
    };
    
    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (onClose && isChatOpen) {
      onClose();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors z-50"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">Gift Tracker Support</h3>
              <p className="text-xs text-indigo-200">
                {isAvailable ? 'Available now' : 'Currently offline'}
              </p>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-96 overflow-y-auto">
            {!isFormSubmitted ? (
              <>
                {/* Pre-chat Form */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {isAvailable 
                      ? "Our support team is available to help you right now. Please fill out the form below to start chatting."
                      : "Our support team is currently offline. Leave us a message and we'll get back to you during business hours."}
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      {isAvailable ? 'Start Chat' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">GT</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hello {formData.name}! Thank you for contacting Gift Tracker support. How can we help you today?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-end">
                    <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">{formData.message}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">You</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">GT</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">I understand you're interested in {formData.subject}. One of our support agents will be with you shortly.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Availability */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                <p>Support Hours:</p>
                <p>Mon-Fri, 9am-5pm EST</p>
              </div>
              <div className="text-right">
                <p>Current time: {formatTime(currentTime)}</p>
                <p className={isAvailable ? "text-green-600" : "text-red-600"}>
                  {isAvailable ? "Support Available" : "Support Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat; 