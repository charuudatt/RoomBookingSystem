import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, AlertCircle, Check } from 'lucide-react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const BOOKINGS_API = 'https://localhost:7253/api/Bookings';

const timeSlots = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00'
];

export function BookingModal({ room, isOpen, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    purpose: '',
    attendees: 1,
    startTime: '',
    endTime: ''
  });

  if (!room) return null;

  /* -------------------- VALIDATION -------------------- */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!formData.userName.trim()) e.userName = 'Name required';
    if (!formData.userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.userEmail = 'Valid email required';
    if (!formData.startTime) e.startTime = 'Start time required';
    if (!formData.endTime) e.endTime = 'End time required';
    if (formData.endTime <= formData.startTime)
      e.endTime = 'End time must be after start time';
    if (!formData.purpose.trim()) e.purpose = 'Purpose required';
    if (formData.attendees < 1 || formData.attendees > room.capacity)
      e.attendees = `Max ${room.capacity} people`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
const handleSubmit = async () => {
  if (!room || !date) {
    toast.error('Room or date missing');
    return;
  }

  if (!validate()) return;

  setIsSubmitting(true);

  try {
    const response = await fetch(BOOKINGS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: String(room.id),   // FORCE string (important)
        roomName: room.name,
        userName: formData.userName,
        userEmail: formData.userEmail,
        date: date.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        attendees: formData.attendees,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    toast.success('Booking submitted successfully');
    onClose();

  } catch (error) {
    console.error(error);
    toast.error('Failed to submit booking');
  } finally {
    setIsSubmitting(false);
  }
};



  /* -------------------- UI -------------------- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {bookingSuccess ? (
          <div className="py-10 text-center">
            <Check className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-xl font-semibold">Booking Submitted</h3>
            <p className="text-muted-foreground">Await admin approval</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book {room.name}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5">
              {/* Date */}
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start</Label>
                  <Select onValueChange={(v) => setFormData(p => ({ ...p, startTime: v }))}>
                    <SelectTrigger><SelectValue placeholder="Start" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(0, -1).map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>End</Label>
                  <Select onValueChange={(v) => setFormData(p => ({ ...p, endTime: v }))}>
                    <SelectTrigger><SelectValue placeholder="End" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(1).map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* User */}
              <Input placeholder="Your Name"
                onChange={e => setFormData(p => ({ ...p, userName: e.target.value }))} />
              <Input placeholder="Email"
                onChange={e => setFormData(p => ({ ...p, userEmail: e.target.value }))} />

              <Input type="number"
                min={1}
                max={room.capacity}
                placeholder="Attendees"
                onChange={e => setFormData(p => ({ ...p, attendees: +e.target.value }))} />

              <Textarea placeholder="Purpose"
                onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))} />

              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
