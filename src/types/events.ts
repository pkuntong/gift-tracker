export interface Event {
  id: string;
  userId: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  location?: string;
  guestIds?: string[];
  giftIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
