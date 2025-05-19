export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  photoURL?: string;
  emailVerified?: boolean;
  trialStart?: string;
  trialEnd?: string;
} 