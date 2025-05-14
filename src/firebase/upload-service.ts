import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * @param file The file to upload
 * @param path The storage path where the file should be stored
 * @param fileName Optional custom filename, if not provided, the original filename is used
 * @returns Promise that resolves with the download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  fileName?: string
): Promise<string> => {
  try {
    // Generate a unique filename if not provided
    const finalFileName = fileName || `${Date.now()}-${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `${path}/${finalFileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Uploads a gift photo to Firebase Storage
 * @param file The image file to upload
 * @param userId The ID of the user who owns the gift
 * @returns Promise that resolves with the download URL
 */
export const uploadGiftPhoto = async (file: File, userId: string): Promise<string> => {
  return uploadFile(file, `users/${userId}/gifts`);
};

/**
 * Uploads a giver (guest) photo to Firebase Storage
 * @param file The image file to upload
 * @param userId The ID of the user who owns the contact
 * @param giverId The ID of the gift giver (guest)
 * @returns Promise that resolves with the download URL
 */
export const uploadGiverPhoto = async (
  file: File, 
  userId: string,
  giverId: string
): Promise<string> => {
  return uploadFile(file, `users/${userId}/givers`, `giver-${giverId}`);
};

/**
 * Uploads an event photo to Firebase Storage
 * @param file The image file to upload
 * @param userId The ID of the user who owns the event
 * @param eventId The ID of the event
 * @returns Promise that resolves with the download URL
 */
export const uploadEventPhoto = async (
  file: File, 
  userId: string,
  eventId: string
): Promise<string> => {
  return uploadFile(file, `users/${userId}/events`, `event-${eventId}`);
};
