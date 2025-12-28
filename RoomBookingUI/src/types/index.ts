export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  amenities: string[];
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface BookingFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
  userEmail: string;
  purpose: string;
  attendees: number;
}
