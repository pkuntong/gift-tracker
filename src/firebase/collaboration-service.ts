import { db } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';

// Collaboration types
export type CollaborationRole = 'viewer' | 'editor' | 'admin';
export type CollaborationStatus = 'pending' | 'accepted' | 'declined';

// Interface for collaboration/sharing
export interface Collaboration {
  id?: string;
  ownerId: string;     // Original owner's userId
  collaboratorId?: string; // The user ID of the collaborator (if registered)
  collaboratorEmail: string; // Email to invite
  role: CollaborationRole; // Access level
  status: CollaborationStatus;
  createdAt?: Date;
  updatedAt?: Date;
  lastAccessed?: Date;
  inviteMessage?: string;
}

/**
 * Get all collaborations where the current user is the owner
 */
export const getOwnedCollaborations = async (userId: string): Promise<Collaboration[]> => {
  try {
    const q = query(collection(db, 'collaborations'), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Collaboration, 'id'>
    }));
  } catch (error) {
    console.error('Error getting owned collaborations:', error);
    throw error;
  }
};

/**
 * Get all collaborations where the current user is a collaborator
 */
export const getActiveCollaborations = async (userId: string, email: string): Promise<Collaboration[]> => {
  try {
    // Query by userId if available
    const userIdQuery = query(
      collection(db, 'collaborations'), 
      where('collaboratorId', '==', userId),
      where('status', '==', 'accepted')
    );
    
    // Query by email for pending invitations
    const emailQuery = query(
      collection(db, 'collaborations'),
      where('collaboratorEmail', '==', email)
    );
    
    const [userIdSnapshot, emailSnapshot] = await Promise.all([
      getDocs(userIdQuery),
      getDocs(emailQuery)
    ]);
    
    // Combine results, removing duplicates
    const collaborations: Collaboration[] = [];
    const processedIds = new Set<string>();
    
    userIdSnapshot.docs.forEach(doc => {
      if (!processedIds.has(doc.id)) {
        collaborations.push({
          id: doc.id,
          ...doc.data() as Omit<Collaboration, 'id'>
        });
        processedIds.add(doc.id);
      }
    });
    
    emailSnapshot.docs.forEach(doc => {
      if (!processedIds.has(doc.id)) {
        collaborations.push({
          id: doc.id,
          ...doc.data() as Omit<Collaboration, 'id'>
        });
        processedIds.add(doc.id);
      }
    });
    
    return collaborations;
  } catch (error) {
    console.error('Error getting active collaborations:', error);
    throw error;
  }
};

/**
 * Invite a new collaborator by email
 */
export const inviteCollaborator = async (collaboration: Omit<Collaboration, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Collaboration> => {
  try {
    // Check if collaboration already exists
    const existingQuery = query(
      collection(db, 'collaborations'),
      where('ownerId', '==', collaboration.ownerId),
      where('collaboratorEmail', '==', collaboration.collaboratorEmail)
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      // Collaboration already exists, update it
      const existingDoc = existingSnapshot.docs[0];
      const existingCollaboration = {
        id: existingDoc.id,
        ...existingDoc.data() as Omit<Collaboration, 'id'>
      };
      
      if (existingCollaboration.status === 'declined') {
        // If previously declined, allow re-invitation
        await updateDoc(doc(db, 'collaborations', existingDoc.id), {
          role: collaboration.role,
          status: 'pending',
          updatedAt: new Date(),
          inviteMessage: collaboration.inviteMessage
        });
        
        return {
          ...existingCollaboration,
          role: collaboration.role,
          status: 'pending',
          inviteMessage: collaboration.inviteMessage
        };
      } else {
        // Return existing collaboration
        return existingCollaboration;
      }
    }
    
    // Create new collaboration
    const now = new Date();
    const newCollaboration = {
      ...collaboration,
      status: 'pending' as CollaborationStatus,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'collaborations'), newCollaboration);
    
    // Send invitation email
    try {
      // You would implement a proper email service here
      console.log(`Invitation email sent to ${collaboration.collaboratorEmail}`);
      // Placeholder for email notification service call
      // await sendEmailNotification({
      //   to: collaboration.collaboratorEmail,
      //   subject: 'Gift Tracker Invitation',
      //   message: `You've been invited to collaborate on Gift Tracker by ${ownerName}. ${collaboration.inviteMessage || ''}`
      // });
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Continue despite email error
    }
    
    return {
      id: docRef.id,
      ...newCollaboration
    };
  } catch (error) {
    console.error('Error inviting collaborator:', error);
    throw error;
  }
};

/**
 * Update collaboration status (accept/decline invitation)
 */
export const updateCollaborationStatus = async (
  collaborationId: string, 
  userId: string, 
  status: CollaborationStatus
): Promise<void> => {
  try {
    const collaborationRef = doc(db, 'collaborations', collaborationId);
    const collaborationSnapshot = await getDoc(collaborationRef);
    
    if (!collaborationSnapshot.exists()) {
      throw new Error('Collaboration not found');
    }
    
    const collaboration = collaborationSnapshot.data() as Omit<Collaboration, 'id'>;
    
    // Verify this user is the intended collaborator
    if (collaboration.collaboratorEmail !== userId) {
      throw new Error('Unauthorized to update this collaboration');
    }
    
    await updateDoc(collaborationRef, {
      status,
      collaboratorId: userId, // Link to user account when accepting
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating collaboration status:', error);
    throw error;
  }
};

/**
 * Update collaboration role
 */
export const updateCollaborationRole = async (
  collaborationId: string, 
  role: CollaborationRole
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'collaborations', collaborationId), {
      role,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating collaboration role:', error);
    throw error;
  }
};

/**
 * Remove a collaborator
 */
export const removeCollaborator = async (collaborationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'collaborations', collaborationId));
  } catch (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }
};

/**
 * Check if a user has access to a specific resource
 */
export const checkCollaborationAccess = async (
  resourceOwnerId: string,
  currentUserId: string,
  requiredRole: CollaborationRole = 'viewer'
): Promise<boolean> => {
  // If user is the owner, they have full access
  if (resourceOwnerId === currentUserId) {
    return true;
  }
  
  try {
    // Check if user has collaboration with required role
    const q = query(
      collection(db, 'collaborations'),
      where('ownerId', '==', resourceOwnerId),
      where('collaboratorId', '==', currentUserId),
      where('status', '==', 'accepted')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false;
    }
    
    // Check role permissions (viewer < editor < admin)
    const collaboration = querySnapshot.docs[0].data() as Collaboration;
    
    if (collaboration.role === 'admin') {
      return true; // Admin can do anything
    } else if (collaboration.role === 'editor' && (requiredRole === 'editor' || requiredRole === 'viewer')) {
      return true; // Editor can edit and view
    } else if (collaboration.role === 'viewer' && requiredRole === 'viewer') {
      return true; // Viewer can only view
    }
    
    return false;
  } catch (error) {
    console.error('Error checking collaboration access:', error);
    return false; // Default to no access on error
  }
};
