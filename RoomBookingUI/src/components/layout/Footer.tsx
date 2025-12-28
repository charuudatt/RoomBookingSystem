import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md gradient-accent">
              <Building2 className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-semibold">RoomBook</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Sachin Technologies LLC, Oman. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
