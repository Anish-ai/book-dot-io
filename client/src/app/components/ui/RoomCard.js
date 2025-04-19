// src/components/ui/RoomCard.js
import { MapPinIcon, UserGroupIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RoomCard({ room, bookings }) {
  // Generate a random pastel color for the room card accent
  const generateRandomColor = (id) => {
    const colors = [
      'from-blue-400 to-indigo-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-violet-500',
      'from-amber-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-cyan-400 to-sky-500',
    ];
    
    return colors[id % colors.length];
  };

  return (
    <div className="hover-card animate-fadeIn group h-full flex flex-col">
      {/* Colorful top accent bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${generateRandomColor(room.roomId)}`}></div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold group-hover:text-[var(--primary)] transition-colors">
              {room.roomName || `Room ${room.roomNumber}`}
            </h3>
            <p className="text-[var(--muted)] text-sm">
              {room.type ? (
                <span className="badge badge-secondary mt-1 capitalize">{room.type.toLowerCase()}</span>
              ) : 'General Purpose'}
            </p>
          </div>
          <span className="room-feature-badge flex items-center">
            #{room.roomId}
          </span>
        </div>
        
        <div className="space-y-3 text-sm flex-grow">
          <div className="flex items-center text-[var(--muted)]">
            <UserGroupIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
            <span>Capacity: <span className="font-medium text-[var(--foreground)]">{room.capacity} people</span></span>
          </div>
          <div className="flex items-center text-[var(--muted)]">
            <MapPinIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
            <span>Building <span className="font-medium text-[var(--foreground)]">{room.buildingId}</span>, Floor <span className="font-medium text-[var(--foreground)]">{room.floor || 1}</span></span>
          </div>
          <div className="flex items-center text-[var(--muted)]">
            <CalendarIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
            <span><span className="font-medium text-[var(--foreground)]">{bookings.length}</span> upcoming bookings</span>
          </div>
          
          {room.facilities && (
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--muted)] line-clamp-2">{room.facilities}</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <Link 
            href={`/rooms/${room.roomId}`}
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium flex items-center transition-all group-hover:translate-x-1"
          >
            View Details
            <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href={`/rooms/${room.roomId}/booking-form`}
            className="btn-primary"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}