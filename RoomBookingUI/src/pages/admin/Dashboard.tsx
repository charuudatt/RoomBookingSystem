import { useMemo } from 'react';
import { format } from 'date-fns';
import { DoorOpen, Calendar, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCard } from '@/components/admin/StatsCard';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { rooms, bookings } = useBooking();

  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

    return {
      totalRooms: rooms.filter(r => r.isActive).length,
      todayBookings: todayBookings.length,
      pendingBookings: pendingBookings.length,
      totalCapacity
    };
  }, [rooms, bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return bookings
      .filter(b => b.date >= today && b.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 5);
  }, [bookings]);

  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your room booking system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Rooms"
            value={stats.totalRooms}
            icon={DoorOpen}
            variant="accent"
          />
          <StatsCard
            title="Today's Bookings"
            value={stats.todayBookings}
            icon={Calendar}
            variant="success"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingBookings}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Total Capacity"
            value={stats.totalCapacity}
            icon={Users}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{booking.roomName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.userName} • {format(new Date(booking.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No bookings yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-card rounded-xl border shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center p-2 rounded-lg bg-accent/10 min-w-[60px]">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.date), 'MMM')}
                      </p>
                      <p className="text-xl font-bold text-accent">
                        {format(new Date(booking.date), 'd')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{booking.roomName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.userName}
                      </p>
                    </div>
                    <Badge className={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Alert */}
        {stats.pendingBookings > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-4 animate-fade-in">
            <div className="p-2 rounded-lg bg-warning/20">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Pending Bookings Require Attention</p>
              <p className="text-sm text-muted-foreground">
                You have {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} waiting for approval.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
