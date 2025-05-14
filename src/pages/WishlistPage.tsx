import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  WishlistItem,
  getUserWishlistItems,
  addWishlistItem,
  deleteWishlistItem,
  markItemPurchased,
  importWishlistFromUrl,
  createShareableWishlist
} from '../firebase/wishlist-service';
import { getUserEvents } from '../firebase/event-service';
import { Event } from '../types/events';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [shareableLink, setShareableLink] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Form state for adding new items
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
    title: '',
    description: '',
    price: undefined,
    priority: 'medium',
    url: '',
    imageUrl: '',
    category: '',
    eventId: '',
    purchased: false
  });
  
  // Import form state
  const [importUrl, setImportUrl] = useState('');
  
  // Filter states
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterPurchased, setFilterPurchased] = useState<string>('all');
  
  // Load wishlist items and events when the component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(true);
        const items = await getUserWishlistItems(user.id);
        const userEvents = await getUserEvents(user.id);
        
        setWishlistItems(items);
        setEvents(userEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading wishlist data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, user, navigate]);
  
  // Filter wishlist items based on selected filters
  const filteredItems = wishlistItems.filter(item => {
    // Filter by event
    if (filterEvent !== 'all' && item.eventId !== filterEvent) return false;
    
    // Filter by purchase status
    if (filterPurchased === 'purchased' && !item.purchased) return false;
    if (filterPurchased === 'not-purchased' && item.purchased) return false;
    
    return true;
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };
  
  // Add a new wishlist item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.title) return;
    
    try {
      const itemToAdd: WishlistItem = {
        userId: user.id,
        title: newItem.title!,
        description: newItem.description,
        price: newItem.price,
        priority: (newItem.priority as 'low' | 'medium' | 'high') || 'medium',
        url: newItem.url,
        imageUrl: newItem.imageUrl,
        category: newItem.category,
        eventId: newItem.eventId || undefined,
        purchased: false
      };
      
      await addWishlistItem(itemToAdd);
      
      // Refresh wishlist
      const updatedItems = await getUserWishlistItems(user.id);
      setWishlistItems(updatedItems);
      
      // Reset form and close modal
      setNewItem({
        title: '',
        description: '',
        price: undefined,
        priority: 'medium',
        url: '',
        imageUrl: '',
        category: '',
        eventId: '',
        purchased: false
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding wishlist item:', error);
    }
  };
  
  // Import wishlist from URL
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !importUrl) return;
    
    try {
      await importWishlistFromUrl(importUrl, user.id);
      
      // Refresh wishlist
      const updatedItems = await getUserWishlistItems(user.id);
      setWishlistItems(updatedItems);
      
      // Reset form and close modal
      setImportUrl('');
      setShowImportModal(false);
    } catch (error) {
      console.error('Error importing wishlist:', error);
    }
  };
  
  // Delete wishlist item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteWishlistItem(id);
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
    }
  };
  
  // Mark item as purchased
  const handleMarkPurchased = async (id: string) => {
    try {
      await markItemPurchased(id, user.id);
      
      // Update local state
      setWishlistItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, purchased: true, purchasedBy: user.id } : item
        )
      );
    } catch (error) {
      console.error('Error marking item as purchased:', error);
    }
  };
  
  // Generate shareable link for selected event or user's full wishlist
  const handleCreateShareableLink = async () => {
    if (!user) return;
    
    try {
      // When creating a shareable link, we'll use the current filter selection
      if (filterEvent !== 'all' && filterEvent !== 'none') {
        setSelectedEventId(filterEvent);
      } else {
        setSelectedEventId('');
      }
      
      const link = await createShareableWishlist(user.id, selectedEventId || undefined);
      setShareableLink(link);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error creating shareable link:', error);
    }
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        alert('Link copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy link: ', err);
      }
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Import Wishlist
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Event</label>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Events</option>
              <option value="none">No Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Status</label>
            <select
              value={filterPurchased}
              onChange={(e) => setFilterPurchased(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Items</option>
              <option value="purchased">Purchased</option>
              <option value="not-purchased">Not Purchased</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto flex items-end">
            <button
              onClick={handleCreateShareableLink}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Create Shareable Link
            </button>
          </div>
        </div>
      </div>
      
      {/* Wishlist Items */}
      {loading ? (
        <div className="text-center py-4">Loading wishlist items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No wishlist items found. Add some items to your wishlist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`bg-white rounded-lg shadow p-4 ${item.purchased ? 'border-l-4 border-green-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}
                  >
                    {item.priority} priority
                  </span>
                </div>
              </div>
              
              {item.description && (
                <p className="text-gray-600 mb-2">{item.description}</p>
              )}
              
              {item.price && (
                <p className="font-medium text-gray-900 mb-2">${item.price.toFixed(2)}</p>
              )}
              
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 inline-block mb-2"
                >
                  View on external site
                </a>
              )}
              
              {item.eventId && (
                <p className="text-sm text-gray-500 mb-2">
                  Event: {events.find(e => e.id === item.eventId)?.name || 'Unknown'}
                </p>
              )}
              
              {item.purchased ? (
                <div className="bg-green-50 text-green-800 p-2 rounded text-sm">
                  Purchased ✓
                </div>
              ) : (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleMarkPurchased(item.id!)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Mark Purchased
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id!)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Wishlist Item</h2>
            
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={newItem.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL (Amazon or other site)</label>
                <input
                  type="url"
                  name="url"
                  value={newItem.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={newItem.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event (optional)</label>
                <select
                  name="eventId"
                  value={newItem.eventId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">No Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Import Wishlist Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Import Wishlist</h2>
            
            <form onSubmit={handleImport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amazon or Other Registry URL</label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://www.amazon.com/registry/wishlist/..."
                  required
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Note: This feature allows you to import items from external registries. 
                Currently supported: Amazon Wishlist, Target Registry
              </p>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Import Items
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Shareable Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Share Your Wishlist</h2>
            
            <p className="text-sm text-gray-700 mb-4">
              Share this link with friends and family so they can view your wishlist:
            </p>
            
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={copyLinkToClipboard}
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
