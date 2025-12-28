import { useEffect, useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { Room } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/rooms/RoomCard';
import { BookingModal } from '@/components/booking/BookingModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROOMS_API_URL = 'https://localhost:7253/api/Rooms';

export default function Index() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');

  // 🔹 Fetch rooms from API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(ROOMS_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data: Room[] = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔹 Only active rooms
  const activeRooms = rooms.filter(room => room.isActive);

  // 🔹 Search + capacity filters
  const filteredRooms = activeRooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCapacity =
      capacityFilter === 'all' ||
      (capacityFilter === 'small' && room.capacity <= 6) ||
      (capacityFilter === 'medium' && room.capacity > 6 && room.capacity <= 15) ||
      (capacityFilter === 'large' && room.capacity > 15);

    return matchesSearch && matchesCapacity;
  });

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl font-bold text-primary-foreground mb-6">
              Book Your Perfect Meeting Space
            </h1>
            <p className="text-primary-foreground/80 mb-10">
              Find and reserve the ideal room for meetings and collaboration
            </p>

            <div className="flex justify-center gap-10">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {activeRooms.length}
                </div>
                <p className="text-primary-foreground/60">Available Rooms</p>
              </div>

              <div>
                <div className="text-3xl font-bold text-accent">
                  {activeRooms.reduce((sum, r) => sum + r.capacity, 0)}
                </div>
                <p className="text-primary-foreground/60">Total Capacity</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER */}
        <section className="py-8 bg-muted/30 border-y">
          <div className="container flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="w-[180px]">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (1–6)</SelectItem>
                <SelectItem value="medium">Medium (7–15)</SelectItem>
                <SelectItem value="large">Large (16+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* ROOMS GRID */}
        <section className="py-12">
          <div className="container">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading rooms...</p>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleSelectRoom}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rooms found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setCapacityFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* BOOKING MODAL */}
      <BookingModal
        room={selectedRoom}
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedRoom(null);
        }}
      />
    </div>
  );
}
