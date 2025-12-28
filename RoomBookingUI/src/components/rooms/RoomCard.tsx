import { Users } from 'lucide-react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Image */}
      <CardHeader className="p-0">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
          <img
            src={room.image || '/placeholder-room.jpg'}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-3 pt-4">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-muted-foreground">
            {room.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{room.capacity} people</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect(room)}
          disabled={!room.isActive}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
