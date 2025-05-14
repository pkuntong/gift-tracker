import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Collaboration,
  CollaborationRole,
  getOwnedCollaborations,
  getActiveCollaborations,
  inviteCollaborator,
  updateCollaborationRole,
  removeCollaborator,
  updateCollaborationStatus
} from '../firebase/collaboration-service';

const CollaboratorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // State for collaborations
  const [ownedCollaborations, setOwnedCollaborations] = useState<Collaboration[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for invitation form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaborationRole>('viewer');
  const [inviteMessage, setInviteMessage] = useState('');
  
  // Load collaborations when component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    const loadCollaborations = async () => {
      try {
        setLoading(true);
        
        // Get collaborations where user is the owner
        const owned = await getOwnedCollaborations(user.id);
        setOwnedCollaborations(owned);
        
        // Get collaborations where user is a collaborator
        const active = await getActiveCollaborations(user.id, user.email);
        setActiveCollaborations(active);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading collaborations:', error);
        setLoading(false);
      }
    };
    
    loadCollaborations();
  }, [isAuthenticated, user, navigate]);
  
  // Handle invitation form submission
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !inviteEmail) return;
    
    try {
      await inviteCollaborator({
        ownerId: user.id,
        collaboratorEmail: inviteEmail,
        role: inviteRole,
        inviteMessage
      });
      
      // Refresh owned collaborations
      const owned = await getOwnedCollaborations(user.id);
      setOwnedCollaborations(owned);
      
      // Reset form
      setInviteEmail('');
      setInviteRole('viewer');
      setInviteMessage('');
      setShowInviteForm(false);
      
      alert(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };
  
  // Handle updating collaboration role
  const handleRoleChange = async (collaborationId: string, newRole: CollaborationRole) => {
    try {
      await updateCollaborationRole(collaborationId, newRole);
      
      // Update the local state
      setOwnedCollaborations(prev => 
        prev.map(collab => 
          collab.id === collaborationId ? { ...collab, role: newRole } : collab
        )
      );
    } catch (error) {
      console.error('Error updating collaboration role:', error);
      alert('Failed to update role. Please try again.');
    }
  };
  
  // Handle removing a collaborator
  const handleRemoveCollaborator = async (collaborationId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email} as a collaborator?`)) {
      return;
    }
    
    try {
      await removeCollaborator(collaborationId);
      
      // Update the local state
      setOwnedCollaborations(prev => 
        prev.filter(collab => collab.id !== collaborationId)
      );
    } catch (error) {
      console.error('Error removing collaborator:', error);
      alert('Failed to remove collaborator. Please try again.');
    }
  };
  
  // Handle accepting or declining an invitation
  const handleInvitationResponse = async (collaborationId: string, status: 'accepted' | 'declined') => {
    if (!user) return;
    
    try {
      await updateCollaborationStatus(collaborationId, user.id, status);
      
      // Update the local state
      setActiveCollaborations(prev => 
        prev.map(collab => 
          collab.id === collaborationId ? { ...collab, status } : collab
        )
      );
    } catch (error) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'declining'} invitation:`, error);
      alert(`Failed to ${status === 'accepted' ? 'accept' : 'decline'} invitation. Please try again.`);
    }
  };
  
  // Get role display text with color
  const getRoleDisplay = (role: CollaborationRole) => {
    switch (role) {
      case 'admin':
        return <span className="text-red-600 font-medium">Admin</span>;
      case 'editor':
        return <span className="text-blue-600 font-medium">Editor</span>;
      case 'viewer':
        return <span className="text-green-600 font-medium">Viewer</span>;
      default:
        return <span className="text-gray-600">Unknown</span>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Collaborators</h1>
        <button
          onClick={() => setShowInviteForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Invite Collaborator
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading collaborations...</div>
      ) : (
        <div className="space-y-8">
          {/* People you've invited */}
          <div>
            <h2 className="text-xl font-semibold mb-4">People You've Invited</h2>
            {ownedCollaborations.length === 0 ? (
              <p className="text-gray-600 italic">You haven't invited anyone yet.</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ownedCollaborations.map((collab) => (
                      <tr key={collab.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{collab.collaboratorEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={collab.role}
                            onChange={(e) => handleRoleChange(collab.id!, e.target.value as CollaborationRole)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            disabled={collab.status !== 'accepted'}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${collab.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveCollaborator(collab.id!, collab.collaboratorEmail)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Collaborations you're part of */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Collaborations You're Part Of</h2>
            {activeCollaborations.length === 0 ? (
              <p className="text-gray-600 italic">You haven't been invited to any collaborations.</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Your Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeCollaborations.map((collab) => (
                      <tr key={collab.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{collab.ownerId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleDisplay(collab.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${collab.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {collab.status === 'pending' && (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleInvitationResponse(collab.id!, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleInvitationResponse(collab.id!, 'declined')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Invite Collaborator</h2>
            
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as CollaborationRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="viewer">Viewer (can only view)</option>
                  <option value="editor">Editor (can view and edit)</option>
                  <option value="admin">Admin (full access)</option>
                </select>
                
                <div className="mt-2 text-sm text-gray-500">
                  <p><strong>Viewer:</strong> Can view all your gift and event data but cannot make changes.</p>
                  <p><strong>Editor:</strong> Can view and edit data, but cannot invite or manage other collaborators.</p>
                  <p><strong>Admin:</strong> Has full access to view, edit, and manage your gift tracker data.</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Add a personal message to your invitation"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsPage;
