import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Gift interface (should match your existing type)
interface Gift {
  id: string;
  userId: string;
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
  notes: string;
  photoURL?: string;       // URL to the gift photo
  giverPhotoURL?: string;  // URL to the giver's photo
  eventPhotoURL?: string;  // URL to the event photo
}

// Import the collaboration checking utilities
import { checkCollaborationAccess } from './collaboration-service';

// Get all gifts for a user, including those shared with them
export const getUserGifts = async (userId: string): Promise<Gift[]> => {
  try {
    // Get gifts owned by the user
    const ownedGiftsQuery = query(
      collection(db, 'gifts'),
      where('userId', '==', userId)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(ownedGiftsQuery);
    
    // Get gifts shared with the user through collaboration
    // This requires a more complex implementation in a production app
    // as you would need to query all collaborations where this user has access
    // and then query all gifts for those owners
    
    // For simplicity, we're showing just the user's own gifts
    // A complete implementation would merge owned and shared gifts
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Gift));
  } catch (error) {
    console.error('Error getting gifts:', error);
    throw error;
  }
};

// Get a single gift by ID
export const getGift = async (giftId: string, currentUserId: string): Promise<Gift | null> => {
  try {
    const giftRef = doc(db, 'gifts', giftId);
    const giftSnap = await getDoc(giftRef);
    
    if (!giftSnap.exists()) {
      return null;
    }
    
    const giftData = giftSnap.data() as Gift;
    
    // Verify that the gift either belongs to the user requesting it
    // or the user has collaboration access
    if (giftData.userId !== currentUserId) {
      // Check if user has collaboration access to this gift
      const hasAccess = await checkCollaborationAccess(
        giftData.userId, // owner ID
        currentUserId,   // current user ID
        'viewer'         // minimum required role
      );
      
      if (!hasAccess) {
        console.error('Unauthorized access to gift');
        return null;
      }
    }
    
    return {
      ...giftData,
      id: giftSnap.id
    };
  } catch (error) {
    console.error('Error getting gift:', error);
    throw error;
  }
};

// Add a new gift
export const addGift = async (gift: Omit<Gift, 'id'>): Promise<Gift> => {
  try {
    const giftWithTimestamp = {
      ...gift,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'gifts'), giftWithTimestamp);
    
    return {
      id: docRef.id,
      ...gift
    };
  } catch (error) {
    console.error('Error adding gift:', error);
    throw error;
  }
};

// Update an existing gift
export const updateGift = async (giftId: string, currentUserId: string, updates: Partial<Omit<Gift, 'id' | 'userId'>>): Promise<void> => {
  try {
    const giftRef = doc(db, 'gifts', giftId);
    const giftSnap = await getDoc(giftRef);
    
    if (!giftSnap.exists()) {
      throw new Error('Gift not found');
    }
    
    const giftData = giftSnap.data() as Gift;
    
    // Verify the gift belongs to the user or user has edit permission via collaboration
    if (giftData.userId !== currentUserId) {
      // Check if user has collaboration edit access to this gift
      const hasEditAccess = await checkCollaborationAccess(
        giftData.userId, // owner ID
        currentUserId,   // current user ID
        'editor'         // minimum required role for editing
      );
      
      if (!hasEditAccess) {
        throw new Error('Unauthorized to update this gift');
      }
    }
    
    // Add updated timestamp
    await updateDoc(giftRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating gift:', error);
    throw error;
  }
};

// Delete a gift
export const deleteGift = async (giftId: string, currentUserId: string): Promise<void> => {
  try {
    const giftRef = doc(db, 'gifts', giftId);
    const giftSnap = await getDoc(giftRef);
    
    if (!giftSnap.exists()) {
      throw new Error('Gift not found');
    }
    
    const giftData = giftSnap.data() as Gift;
    
    // Verify the gift belongs to the user or user has admin permissions via collaboration
    if (giftData.userId !== currentUserId) {
      // Check if user has collaboration admin access to this gift
      const hasAdminAccess = await checkCollaborationAccess(
        giftData.userId, // owner ID
        currentUserId,   // current user ID
        'admin'         // admin role required for deletion
      );
      
      if (!hasAdminAccess) {
        throw new Error('Unauthorized to delete this gift');
      }
    }
    
    await deleteDoc(giftRef);
  } catch (error) {
    console.error('Error deleting gift:', error);
    throw error;
  }
};
