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
        <div className="alert alert-danger mb-3" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success mb-3" role="alert">
          {successMessage}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {/* Guest management controls */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <button 
            className="btn btn-primary me-2" 
            onClick={() => setIsAddingGuest(true)}
            disabled={isLoading}
          >
            Add Guest
          </button>
          
          <button 
            className="btn btn-outline-primary me-2" 
            onClick={handleImportClick}
            disabled={isLoading}
          >
            Import Guests
          </button>
          
          {selectedGuests.length > 0 && (
            <button 
              className="btn btn-danger" 
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              Delete Selected ({selectedGuests.length})
            </button>
          )}
        </div>
        
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Guest Form */}
      {isAddingGuest && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={resetForm}
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingGuest ? 'Update Guest' : 'Add Guest')}
              </button>
            </form>
          </div>
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
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            {showAllGuests 
              ? 'All Guests' 
              : eventId 
                ? 'Guests for this Event' 
                : 'Guests'}
          </h5>
        </div>
        
        {isLoading && !guests.length ? (
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading guests...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
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
                  <th>Name</th>
                  <th>Contact</th>
                  <th>RSVP Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      {searchTerm 
                        ? 'No guests match your search.' 
                        : 'No guests found. Add your first guest!'}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedGuests.includes(guest.id!)}
                          onChange={() => handleBulkSelect(guest.id!)}
                          disabled={isLoading}
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{guest.name}</div>
                        {guest.address && (
                          <small className="text-muted d-block">{guest.address}</small>
                        )}
                      </td>
                      <td>
                        {guest.email && (
                          <div>
                            <small>
                              <i className="bi bi-envelope me-1"></i>
                              {guest.email}
                            </small>
                          </div>
                        )}
                        {guest.phone && (
                          <div>
                            <small>
                              <i className="bi bi-telephone me-1"></i>
                              {guest.phone}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm ${
                            guest.rsvpStatus === 'confirmed' 
                              ? 'text-success' 
                              : guest.rsvpStatus === 'declined' 
                                ? 'text-danger' 
                                : ''
                          }`}
                          value={guest.rsvpStatus}
                          onChange={(e) => handleRSVPChange(guest.id!, e.target.value as 'pending' | 'confirmed' | 'declined')}
                          disabled={isLoading}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Attending</option>
                          <option value="declined">Not Attending</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEdit(guest)}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(guest.id!)}
                          disabled={isLoading}
                        >
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
