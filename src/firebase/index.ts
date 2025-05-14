// Export all Firebase services and configurations
import app, { auth, db, storage } from './config';
import * as authService from './auth-service';
import * as giftService from './gift-service';
import * as eventService from './event-service';
import * as paymentService from './payment-service';

export {
  app,          // Firebase app instance
  auth,          // Firebase authentication
  db,            // Firestore database
  storage,       // Firebase storage
  authService,   // Authentication service methods
  giftService,   // Gift service methods
  eventService,  // Event service methods
  paymentService // Payment service methods
};
