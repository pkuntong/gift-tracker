import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Define types for our notifications and reminders
export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  message: string;
  triggerDate: Date;
  type: 'gift-logging' | 'thank-you' | 'custom';
  relatedItemId?: string; // Event ID or Gift ID
  status: 'pending' | 'sent' | 'dismissed';
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

/**
 * Create a new reminder in Firestore
 */
export const createReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'status'>): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('User must be logged in to create a reminder');
      return null;
    }
    
    const reminderData: Omit<Reminder, 'id'> = {
      ...reminder,
      userId: user.uid,
      status: 'pending',
      createdAt: new Date(),
    };
    
    // Convert JavaScript Date objects to Firestore Timestamps
    const firestoreReminder = {
      ...reminderData,
      triggerDate: Timestamp.fromDate(reminderData.triggerDate),
      createdAt: Timestamp.fromDate(reminderData.createdAt),
    };
    
    const docRef = await addDoc(collection(db, 'reminders'), firestoreReminder);
    return docRef.id;
  } catch (error) {
    console.error('Error creating reminder:', error);
    return null;
  }
};

/**
 * Get all reminders for the current user
 */
export const getUserReminders = async (): Promise<Reminder[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('User must be logged in to get reminders');
      return [];
    }
    
    const remindersQuery = query(collection(db, 'reminders'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(remindersQuery);
    
    const reminders: Reminder[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reminders.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        message: data.message,
        triggerDate: data.triggerDate.toDate(),
        type: data.type,
        relatedItemId: data.relatedItemId,
        status: data.status,
        repeat: data.repeat || 'none',
        createdAt: data.createdAt.toDate(),
      });
    });
    
    return reminders;
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

/**
 * Get all pending reminders for the current user that should be triggered now
 */
export const getPendingReminders = async (): Promise<Reminder[]> => {
  try {
    const reminders = await getUserReminders();
    const now = new Date();
    
    return reminders.filter(reminder => 
      reminder.status === 'pending' && reminder.triggerDate <= now
    );
  } catch (error) {
    console.error('Error getting pending reminders:', error);
    return [];
  }
};

/**
 * Update a reminder's status
 */
export const updateReminderStatus = async (reminderId: string, status: 'pending' | 'sent' | 'dismissed'): Promise<boolean> => {
  try {
    const reminderRef = doc(db, 'reminders', reminderId);
    await updateDoc(reminderRef, { status });
    
    // If this is a repeating reminder and it was sent, schedule the next occurrence
    if (status === 'sent') {
      const reminderSnap = await getDoc(reminderRef);
      const reminderData = reminderSnap.data() as any;
      
      if (reminderData && reminderData.repeat && reminderData.repeat !== 'none') {
        await scheduleNextReminder({
          id: reminderId,
          userId: reminderData.userId,
          title: reminderData.title,
          message: reminderData.message,
          triggerDate: reminderData.triggerDate.toDate(),
          type: reminderData.type,
          relatedItemId: reminderData.relatedItemId,
          status: 'sent',
          repeat: reminderData.repeat,
          createdAt: reminderData.createdAt.toDate(),
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating reminder status:', error);
    return false;
  }
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (reminderId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'reminders', reminderId));
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

/**
 * Schedule the next reminder based on repeat setting
 */
const scheduleNextReminder = async (reminder: Reminder): Promise<string | null> => {
  try {
    let nextDate = new Date(reminder.triggerDate);
    
    // Calculate the next trigger date based on repeat setting
    switch (reminder.repeat) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        return null; // No repeat
    }
    
    // Create the next reminder
    const nextReminder: Omit<Reminder, 'id' | 'createdAt' | 'status'> = {
      userId: reminder.userId,
      title: reminder.title,
      message: reminder.message,
      triggerDate: nextDate,
      type: reminder.type,
      relatedItemId: reminder.relatedItemId,
      repeat: reminder.repeat,
    };
    
    return await createReminder(nextReminder);
  } catch (error) {
    console.error('Error scheduling next reminder:', error);
    return null;
  }
};

/**
 * Create an automatic reminder for gift logging after an event
 */
export const createEventReminderForGiftLogging = async (
  eventId: string,
  eventName: string,
  eventDate: Date
): Promise<string | null> => {
  try {
    // Set reminder for the day after the event
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() + 1);
    reminderDate.setHours(10, 0, 0, 0); // 10:00 AM
    
    const reminder: Omit<Reminder, 'id' | 'createdAt' | 'status'> = {
      userId: '', // Will be set in createReminder
      title: 'Log Gifts for ' + eventName,
      message: `Don't forget to log gifts you received at ${eventName}!`,
      triggerDate: reminderDate,
      type: 'gift-logging',
      relatedItemId: eventId,
      repeat: 'none',
    };
    
    return await createReminder(reminder);
  } catch (error) {
    console.error('Error creating event reminder:', error);
    return null;
  }
};

/**
 * Create an automatic thank-you reminder for gifts
 */
export const createThankYouReminder = async (
  giftId: string,
  giftName: string,
  giverName: string
): Promise<string | null> => {
  try {
    // Set reminder for 3 days after gift is logged
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 3);
    reminderDate.setHours(10, 0, 0, 0); // 10:00 AM
    
    const reminder: Omit<Reminder, 'id' | 'createdAt' | 'status'> = {
      userId: '', // Will be set in createReminder
      title: 'Send Thank You Note',
      message: `Remember to thank ${giverName} for the ${giftName}!`,
      triggerDate: reminderDate,
      type: 'thank-you',
      relatedItemId: giftId,
      repeat: 'none',
    };
    
    return await createReminder(reminder);
  } catch (error) {
    console.error('Error creating thank you reminder:', error);
    return null;
  }
};

/**
 * Process and display pending notifications
 * This should be called when the app initializes
 */
export const processNotifications = async (): Promise<void> => {
  try {
    const pendingReminders = await getPendingReminders();
    
    for (const reminder of pendingReminders) {
      // Display notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(reminder.title, {
          body: reminder.message,
          icon: '/icons/icon-192x192.png',
        });
      }
      
      // Update status to sent
      await updateReminderStatus(reminder.id!, 'sent');
    }
  } catch (error) {
    console.error('Error processing notifications:', error);
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};
