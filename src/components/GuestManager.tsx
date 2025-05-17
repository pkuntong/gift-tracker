import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Guest,
  GuestImport,
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  importGuests,
  updateGuestRSVP,
} from '../firebase/guest-service';
// @ts-ignore - adding type declarations for papaparse
import Papa from 'papaparse';

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface GuestManagerProps {
  eventId?: string;
  showAllGuests?: boolean;
}

const GuestManager: React.FC<GuestManagerProps> = ({ eventId, showAllGuests = false }) => {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (user) {
      fetchGuests();
    }
  }, [user, eventId]);
  
  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        setError('Please log in to manage guests');
        return;
      }
      
      const fetchedGuests = await getGuests(user.id, showAllGuests ? undefined : eventId);
      setGuests(fetchedGuests);
    } catch (err: any) {
      console.error('Error fetching guests:', err);
      setError(err.message || 'Failed to fetch guests');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Guest name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const timestamp = new Date().toISOString();
      
      if (editingGuest) {
        // Update existing guest
        await updateGuest(editingGuest.id!, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
          updatedAt: timestamp
        });
        setSuccessMessage('Guest updated successfully');
      } else {
        // Add new guest
        const newGuest: Omit<Guest, 'id'> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
          eventIds: eventId ? [eventId] : [],
          rsvpStatus: 'pending',
          userId: user.id,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        await addGuest(newGuest);
        setSuccessMessage('Guest added successfully');
      }
      
      // Reset form and refresh
      resetForm();
      fetchGuests();
    } catch (err: any) {
      console.error('Error saving guest:', err);
      setError(err.message || 'Failed to save guest');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setEditingGuest(null);
    setIsAddingGuest(false);
  };

  const handleEdit = (guest: Guest) => {
    setFormData({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      address: guest.address || '',
      notes: guest.notes || ''
    });
    setEditingGuest(guest);
    setIsAddingGuest(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteGuest(guestId);
      setSuccessMessage('Guest deleted successfully');
      fetchGuests();
    } catch (err: any) {
      console.error('Error deleting guest:', err);
      setError(err.message || 'Failed to delete guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVPChange = async (guestId: string, status: 'pending' | 'confirmed' | 'declined') => {
    try {
      setIsLoading(true);
      setError(null);
      
      await updateGuestRSVP(guestId, status);
      setSuccessMessage(`RSVP status updated to ${status}`);
      fetchGuests();
    } catch (err: any) {
      console.error('Error updating RSVP:', err);
      setError(err.message || 'Failed to update RSVP status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      complete: async (results: Papa.ParseResult<any>) => {
        try {
          setIsLoading(true);
          setError(null);
          
          const importedGuests: GuestImport[] = results.data
            .filter((row: any) => row.name && row.name.trim() !== '')
            .map((row: any) => ({
              name: row.name,
              email: row.email,
              phone: row.phone,
              address: row.address || row.addressLine1 || ''
            }));
          
          if (importedGuests.length === 0) {
            setError('No valid guests found in the CSV file');
            return;
          }
          
          await importGuests(user!.id, eventId || null, importedGuests);
          setSuccessMessage(`Successfully imported ${importedGuests.length} guests`);
          setShowImportModal(false);
          fetchGuests();
        } catch (err: any) {
          console.error('Error importing guests:', err);
          setError(err.message || 'Failed to import guests');
        } finally {
          setIsLoading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error: Error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  };
  
  const filteredGuests = searchTerm
    ? guests.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase())))
    : guests;
    
  const handleBulkSelect = (guestId: string) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      } else {
        return [...prev, guestId];
      }
    });
  };
  
  const handleBulkDelete = async () => {
    if (selectedGuests.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedGuests.length} selected guests?`)) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      for (const guestId of selectedGuests) {
        await deleteGuest(guestId);
      }
      
      setSuccessMessage(`Successfully deleted ${selectedGuests.length} guests`);
      setSelectedGuests([]);
      fetchGuests();
    } catch (err: any) {
      console.error('Error deleting guests:', err);
      setError(err.message || 'Failed to delete guests');
    } finally {
      setIsLoading(false);
    }
  };

  // Render UI with appropriate states for loading, error, success
  return (
    <div className="guest-manager">
      {/* Alert messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-3 rounded flex items-center justify-between">
          <span className="text-red-700 text-sm">{error}</span>
          <button 
            type="button" 
            className="text-red-400 hover:text-red-600 ml-4" 
            onClick={() => setError(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-3 rounded flex items-center justify-between">
          <span className="text-green-700 text-sm">{successMessage}</span>
          <button 
            type="button" 
            className="text-green-400 hover:text-green-600 ml-4" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Guest management controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            onClick={() => setIsAddingGuest(true)}
            disabled={isLoading}
          >
            + Add Guest
          </button>
          <button 
            className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            onClick={handleImportClick}
            disabled={isLoading}
          >
            Import Guests
          </button>
          {selectedGuests.length > 0 && (
            <button 
              className="bg-red-100 text-red-700 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              Delete Selected ({selectedGuests.length})
            </button>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="search-guests" className="block text-sm font-medium text-gray-700 mb-1">Search Guests</label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="search-guests"
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
              placeholder="Type a name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guest Form */}
      {isAddingGuest && (
        <div className="card mb-4 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-gray-900">{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h5>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none" 
              onClick={resetForm}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter guest name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                className="block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any notes about this guest"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (editingGuest ? 'Update Guest' : 'Add Guest')}
            </button>
          </form>
        </div>
      )}
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Import Guests</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowImportModal(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <p>
              Upload a CSV file with guest information. The file should have columns for 
              <code>name</code>, <code>email</code>, <code>phone</code>, and <code>address</code>.
            </p>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            <div className="form-text mb-3">
              Example: <code>name,email,phone,address</code>
            </div>
          </div>
        </div>
      )}
      
      {/* Guest List */}
      <div className="card rounded-lg shadow overflow-hidden">
        <div className="card-header bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h5 className="mb-0 text-lg font-semibold text-gray-900">
            {showAllGuests 
              ? 'All Guests' 
              : eventId 
                ? 'Guests for this Event' 
                : 'Guests'}
          </h5>
        </div>
        
        {isLoading && !guests.length ? (
          <div className="card-body text-center py-10">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="mt-2 text-gray-500">Loading guests...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedGuests.length > 0 && selectedGuests.length === filteredGuests.length}
                      onChange={() => {
                        if (selectedGuests.length === filteredGuests.length) {
                          setSelectedGuests([]);
                        } else {
                          setSelectedGuests(filteredGuests.map(g => g.id!));
                        }
                      }}
                      disabled={isLoading || !filteredGuests.length}
                    />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Status</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        {searchTerm ? (
                          <>
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="mt-2 text-sm font-medium text-gray-900">No guests match your search.</p>
                            <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
                          </>
                        ) : (
                          <>
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <p className="mt-2 text-sm font-medium text-gray-900">No guests found.</p>
                            <p className="text-sm text-gray-500">Add your first guest!</p>
                            <button 
                              onClick={() => setIsAddingGuest(true)}
                              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Add Guest
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedGuests.includes(guest.id!)}
                          onChange={() => handleBulkSelect(guest.id!)}
                          disabled={isLoading}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                            {guest.address && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {guest.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {guest.email && (
                            <div className="text-xs text-gray-600 flex items-center">
                              <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {guest.email}
                            </div>
                          )}
                          {guest.phone && (
                            <div className="text-xs text-gray-600 flex items-center">
                              <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {guest.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${guest.rsvpStatus === 'confirmed' ? 'bg-green-100 text-green-800' : guest.rsvpStatus === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <svg className="-ml-0.5 mr-1.5 h-2 w-2 ${guest.rsvpStatus === 'confirmed' ? 'text-green-400' : guest.rsvpStatus === 'declined' ? 'text-red-400' : 'text-yellow-400'}" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            {guest.rsvpStatus === 'confirmed' ? 'Attending' : guest.rsvpStatus === 'declined' ? 'Not Attending' : 'Pending'}
                          </span>
                        </div>
                        <select
                          className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          value={guest.rsvpStatus}
                          onChange={(e) => handleRSVPChange(guest.id!, e.target.value as 'pending' | 'confirmed' | 'declined')}
                          disabled={isLoading}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Attending</option>
                          <option value="declined">Not Attending</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right space-x-1">
                        <button
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleEdit(guest)}
                          disabled={isLoading}
                        >
                          <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleDelete(guest.id!)}
                          disabled={isLoading}
                        >
                          <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManager;
