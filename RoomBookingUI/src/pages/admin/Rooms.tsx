import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, Check, X } from 'lucide-react';
import { Room } from '@/types';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RoomForm } from '@/components/admin/RoomForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const API_URL = 'https://localhost:7253/api/Rooms'; // Your API URL

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data: Room[] = await res.json();
      setRooms(data);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Create room
  const handleCreateRoom = async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create room');
      toast.success('Room created successfully!');
      setIsFormOpen(false);
      fetchRooms();
    } catch (err: any) {
      toast.error(err.message || 'Error creating room');
    }
  };

  // Update room
  const handleUpdateRoom = async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingRoom) return;
    try {
      const res = await fetch(`${API_URL}/${editingRoom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update room');
      toast.success('Room updated successfully!');
      setEditingRoom(null);
      fetchRooms();
    } catch (err: any) {
      toast.error(err.message || 'Error updating room');
    }
  };

  // Delete room
  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;
    try {
      const res = await fetch(`${API_URL}/${deletingRoom.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete room');
      toast.success('Room deleted successfully!');
      setDeletingRoom(null);
      fetchRooms();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting room');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Rooms</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage your meeting rooms
            </p>
          </div>
          <Button variant="accent" onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        </div>

        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Room Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    Loading rooms...
                  </TableCell>
                </TableRow>
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow key={room.id} className="group">
                    <TableCell>
                      <img src={room.image} alt={room.name} className="w-16 h-12 object-cover rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{room.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {room.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          room.isActive
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {room.isActive ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setEditingRoom(room)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingRoom(room)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="text-muted-foreground">
                      <p className="mb-2">No rooms available</p>
                      <Button variant="outline" onClick={() => setIsFormOpen(true)}>
                        Create your first room
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Create/Edit Room Modal */}
      <RoomForm
        room={editingRoom}
        isOpen={isFormOpen || !!editingRoom}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRoom(null);
        }}
        onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingRoom} onOpenChange={() => setDeletingRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRoom?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRooms;
