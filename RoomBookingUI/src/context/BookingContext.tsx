import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, Booking, BookingFormData } from '@/types';

interface BookingContextType {
  rooms: Room[];
  bookings: Booking[];
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addBooking: (booking: BookingFormData) => Booking;
  cancelBooking: (id: string) => void;
  confirmBooking: (id: string) => void;
  getAvailableSlots: (roomId: string, date: string) => string[];
  isSlotAvailable: (roomId: string, date: string, startTime: string, endTime: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Initial demo data
const initialRooms: Room[] = [
  {
    id: '1',
    name: 'Executive Boardroom',
    capacity: 20,
    description: 'Premium meeting room with video conferencing and presentation equipment',
    amenities: ['Video Conferencing', 'Whiteboard', 'Projector', 'Coffee Machine'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Innovation Lab',
    capacity: 12,
    description: 'Creative space for brainstorming and collaborative work sessions',
    amenities: ['Standing Desks', 'Writable Walls', 'Smart TV', 'Bean Bags'],
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Training Center',
    capacity: 30,
    description: 'Large room perfect for training sessions and workshops',
    amenities: ['Multiple Screens', 'Microphone System', 'Recording Equipment', 'Breakout Areas'],
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Focus Pod',
    capacity: 4,
    description: 'Private space for small team discussions and focused work',
    amenities: ['Noise Cancellation', 'Video Call Setup', 'Charging Ports'],
    image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&auto=format&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const initialBookings: Booking[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Executive Boardroom',
    userName: 'John Smith',
    userEmail: 'john@company.com',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    purpose: 'Quarterly Review Meeting',
    attendees: 15,
    status: 'confirmed',
    createdAt: new Date()
  },
  {
    id: '2',
    roomId: '2',
    roomName: 'Innovation Lab',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@company.com',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Product Brainstorming',
    attendees: 8,
    status: 'pending',
    createdAt: new Date()
  }
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addRoom = (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === id
          ? { ...room, ...roomData, updatedAt: new Date() }
          : room
      )
    );
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    // Also cancel related bookings
    setBookings(prev =>
      prev.map(booking =>
        booking.roomId === id
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
  };

  const addBooking = (bookingData: BookingFormData): Booking => {
    const room = rooms.find(r => r.id === bookingData.roomId);
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...bookingData,
      roomName: room?.name || '',
      status: 'pending',
      createdAt: new Date()
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
  };

  const confirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id
          ? { ...booking, status: 'confirmed' as const }
          : booking
      )
    );
  };

  const getAvailableSlots = (roomId: string, date: string): string[] => {
    const allSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const bookedSlots = bookings
      .filter(b => b.roomId === roomId && b.date === date && b.status !== 'cancelled')
      .flatMap(b => {
        const slots: string[] = [];
        const startHour = parseInt(b.startTime.split(':')[0]);
        const endHour = parseInt(b.endTime.split(':')[0]);
        for (let h = startHour; h < endHour; h++) {
          slots.push(`${h.toString().padStart(2, '0')}:00`);
        }
        return slots;
      });

    return allSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const isSlotAvailable = (roomId: string, date: string, startTime: string, endTime: string): boolean => {
    const conflicting = bookings.filter(
      b =>
        b.roomId === roomId &&
        b.date === date &&
        b.status !== 'cancelled' &&
        !(endTime <= b.startTime || startTime >= b.endTime)
    );
    return conflicting.length === 0;
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        bookings,
        addRoom,
        updateRoom,
        deleteRoom,
        addBooking,
        cancelBooking,
        confirmBooking,
        getAvailableSlots,
        isSlotAvailable
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
