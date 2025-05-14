import { db } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';

// Wishlist item interface
export interface WishlistItem {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  price?: number;
  priority: 'low' | 'medium' | 'high';
  url?: string;  // URL to external site (Amazon, etc.)
  imageUrl?: string;
  category?: string;
  eventId?: string; // Optional association with an event
  purchased?: boolean;
  purchasedBy?: string;
  dateAdded?: Timestamp | Date;
  dateUpdated?: Timestamp | Date;
}

// Get all wishlist items for a user
export const getUserWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
  try {
    const q = query(collection(db, 'wishlistItems'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as WishlistItem;
      return {
        ...data,
        id: doc.id
      };
    });
  } catch (error) {
    console.error('Error getting wishlist items:', error);
    throw error;
  }
};

// Get wishlist items for a specific event
export const getEventWishlistItems = async (eventId: string): Promise<WishlistItem[]> => {
  try {
    const q = query(collection(db, 'wishlistItems'), where('eventId', '==', eventId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as WishlistItem;
      return {
        ...data,
        id: doc.id
      };
    });
  } catch (error) {
    console.error('Error getting event wishlist items:', error);
    throw error;
  }
};

// Add a new wishlist item
export const addWishlistItem = async (item: WishlistItem): Promise<WishlistItem> => {
  try {
    // Add timestamps
    const now = new Date();
    const itemWithTimestamp = {
      ...item,
      dateAdded: now,
      dateUpdated: now,
      purchased: item.purchased || false
    };

    const docRef = await addDoc(collection(db, 'wishlistItems'), itemWithTimestamp);
    return {
      id: docRef.id,
      ...item
    };
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    throw error;
  }
};

// Update a wishlist item
export const updateWishlistItem = async (id: string, item: Partial<WishlistItem>): Promise<void> => {
  try {
    const now = new Date();
    const itemWithTimestamp = {
      ...item,
      dateUpdated: now
    };

    const docRef = doc(db, 'wishlistItems', id);
    await updateDoc(docRef, itemWithTimestamp);
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    throw error;
  }
};

// Mark a wishlist item as purchased
export const markItemPurchased = async (id: string, purchasedBy: string): Promise<void> => {
  try {
    const docRef = doc(db, 'wishlistItems', id);
    await updateDoc(docRef, {
      purchased: true,
      purchasedBy: purchasedBy,
      dateUpdated: new Date()
    });
  } catch (error) {
    console.error('Error marking item as purchased:', error);
    throw error;
  }
};

// Delete a wishlist item
export const deleteWishlistItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'wishlistItems', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    throw error;
  }
};

// Import wishlist from external URL (placeholder function)
export const importWishlistFromUrl = async (url: string, userId: string): Promise<WishlistItem[]> => {
  try {
    // This would integrate with external APIs like Amazon's API
    // For now, we'll return a mock implementation
    console.log(`Importing wishlist from ${url} for user ${userId}`);
    
    // In a real implementation, you would:
    // 1. Parse the external wishlist URL
    // 2. Make API calls to retrieve item data
    // 3. Format the data as WishlistItem objects
    // 4. Save them to Firestore
    
    // Mock implementation returns empty array
    return [];
  } catch (error) {
    console.error('Error importing wishlist:', error);
    throw error;
  }
};

// Generate a shareable wishlist link
export const createShareableWishlist = async (userId: string, eventId?: string): Promise<string> => {
  try {
    // In a real implementation, this would create a shareable link
    // possibly using Firebase Dynamic Links or similar
    
    // For now, return a placeholder URL
    const baseUrl = 'https://gift-tracker-app.com/shared-wishlist';
    if (eventId) {
      return `${baseUrl}/event/${eventId}`;
    } else {
      return `${baseUrl}/user/${userId}`;
    }
  } catch (error) {
    console.error('Error creating shareable wishlist:', error);
    throw error;
  }
};
