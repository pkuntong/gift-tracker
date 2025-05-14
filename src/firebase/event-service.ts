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
import { createEventReminderForGiftLogging } from './notification-service';

// Event interface (should match your existing type)
interface Event {
  id: string;
  userId: string;
  name: string;
  date: string;
  type: string;
  description: string;
}

// Get all events for a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEvent = async (eventId: string, userId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return null;
    }
    
    const eventData = eventSnap.data() as Omit<Event, 'id'>;
    
    // Verify the event belongs to the user
    if (eventData.userId !== userId) {
      return null;
    }
    
    return {
      id: eventSnap.id,
      ...eventData
    };
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

// Add a new event
export const addEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const eventWithTimestamp = {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'events'), eventWithTimestamp);
    
    const newEvent = {
      id: docRef.id,
      ...event
    };
    
    // Create a reminder to log gifts after the event
    try {
      // Parse the event date to create the reminder
      const eventDate = new Date(newEvent.date);
      
      // Only create reminder if the event is in the future
      if (eventDate > new Date()) {
        await createEventReminderForGiftLogging(
          newEvent.id,
          newEvent.name,
          eventDate
        );
        console.log('Gift logging reminder created for event:', newEvent.name);
      }
    } catch (reminderError) {
      // Don't fail the entire operation if reminder creation fails
      console.error('Error creating event reminder:', reminderError);
    }
    
    return newEvent;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (eventId: string, userId: string, updates: Partial<Omit<Event, 'id' | 'userId'>>): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // Verify the event belongs to the user
    if (eventData.userId !== userId) {
      throw new Error('Unauthorized access to event');
    }
    
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // Verify the event belongs to the user
    if (eventData.userId !== userId) {
      throw new Error('Unauthorized access to event');
    }
    
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
