// guest-service.ts
import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';

export interface Guest {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  userId: string;
  eventIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GuestImport {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const getGuests = async (userId: string, eventId?: string): Promise<Guest[]> => {
  try {
    let guestQuery;
    
    if (eventId) {
      // Get guests for a specific event
      guestQuery = query(
        collection(db, 'guests'),
        where('userId', '==', userId),
        where('eventIds', 'array-contains', eventId)
      );
    } else {
      // Get all guests for the user
      guestQuery = query(
        collection(db, 'guests'),
        where('userId', '==', userId)
      );
    }
    
    const querySnapshot = await getDocs(guestQuery);
    const guests: Guest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Guest, 'id'>;
      guests.push({ id: doc.id, ...data });
    });
    
    return guests;
  } catch (error) {
    console.error('Error getting guests:', error);
    throw error;
  }
};

export const addGuest = async (guest: Omit<Guest, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'guests'), guest);
    return docRef.id;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const updateGuest = async (guestId: string, updates: Partial<Guest>): Promise<void> => {
  try {
    const guestRef = doc(db, 'guests', guestId);
    await updateDoc(guestRef, { ...updates, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
};

export const deleteGuest = async (guestId: string): Promise<void> => {
  try {
    const guestRef = doc(db, 'guests', guestId);
    await deleteDoc(guestRef);
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
};

export const importGuests = async (
  userId: string,
  eventId: string | null,
  guests: GuestImport[]
): Promise<string[]> => {
  try {
    const addedIds: string[] = [];
    const timestamp = new Date().toISOString();
    
    for (const importedGuest of guests) {
      // Check if guest already exists with this name/email
      let existingGuest: Guest | null = null;
      
      if (importedGuest.email) {
        const emailQuery = query(
          collection(db, 'guests'),
          where('userId', '==', userId),
          where('email', '==', importedGuest.email)
        );
        
        const querySnapshot = await getDocs(emailQuery);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          existingGuest = { id: doc.id, ...doc.data() as Omit<Guest, 'id'> };
        }
      }
      
      if (existingGuest) {
        // Update existing guest
        if (eventId && !existingGuest.eventIds.includes(eventId)) {
          await updateGuest(existingGuest.id!, {
            eventIds: [...existingGuest.eventIds, eventId],
            updatedAt: timestamp
          });
        }
        addedIds.push(existingGuest.id!);
      } else {
        // Add new guest
        const newGuest: Omit<Guest, 'id'> = {
          name: importedGuest.name,
          email: importedGuest.email,
          phone: importedGuest.phone,
          address: importedGuest.address,
          eventIds: eventId ? [eventId] : [],
          rsvpStatus: 'pending',
          userId,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        const id = await addGuest(newGuest);
        addedIds.push(id);
      }
    }
    
    return addedIds;
  } catch (error) {
    console.error('Error importing guests:', error);
    throw error;
  }
};

export const updateGuestRSVP = async (
  guestId: string,
  status: 'pending' | 'confirmed' | 'declined'
): Promise<void> => {
  try {
    await updateGuest(guestId, { rsvpStatus: status });
  } catch (error) {
    console.error('Error updating guest RSVP:', error);
    throw error;
  }
};

export const addGuestToEvent = async (guestId: string, eventId: string): Promise<void> => {
  try {
    const guestRef = doc(db, 'guests', guestId);
    const guestDoc = await getDoc(guestRef);
    
    if (guestDoc.exists()) {
      const guestData = guestDoc.data() as Guest;
      const updatedEventIds = [...guestData.eventIds];
      
      if (!updatedEventIds.includes(eventId)) {
        updatedEventIds.push(eventId);
        await updateDoc(guestRef, { 
          eventIds: updatedEventIds,
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Error adding guest to event:', error);
    throw error;
  }
};

export const removeGuestFromEvent = async (guestId: string, eventId: string): Promise<void> => {
  try {
    const guestRef = doc(db, 'guests', guestId);
    const guestDoc = await getDoc(guestRef);
    
    if (guestDoc.exists()) {
      const guestData = guestDoc.data() as Guest;
      const updatedEventIds = guestData.eventIds.filter(id => id !== eventId);
      
      await updateDoc(guestRef, { 
        eventIds: updatedEventIds,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error removing guest from event:', error);
    throw error;
  }
};

export const getGuestsByNameOrEmail = async (
  userId: string,
  searchTerm: string
): Promise<Guest[]> => {
  try {
    // Get all user's guests (we'll filter client-side for simplicity)
    const guestQuery = query(
      collection(db, 'guests'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(guestQuery);
    const guests: Guest[] = [];
    const lowercaseSearch = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Guest, 'id'>;
      if (
        data.name.toLowerCase().includes(lowercaseSearch) ||
        (data.email && data.email.toLowerCase().includes(lowercaseSearch))
      ) {
        guests.push({ id: doc.id, ...data });
      }
    });
    
    return guests;
  } catch (error) {
    console.error('Error searching guests:', error);
    throw error;
  }
};
