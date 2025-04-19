import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  UsersIcon, 
  HomeModernIcon,
  ClockIcon, 
  CheckCircleIcon,
  MapPinIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

export default function RoomCard({ room, bookings = [] }) {
  const [nextAvailable, setNextAvailable] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  // Process the facilities into an array
  const facilities = room.facilities 
    ? room.facilities.split(',').map(facility => facility.trim()) 
    : []

  useEffect(() => {
    // Get the next available time slot
    if (bookings && bookings.length > 0) {
      const now = new Date()
      const upcomingBookings = bookings
        .filter(booking => new Date(booking.endTime) > now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      
      if (upcomingBookings.length > 0) {
        setNextAvailable(new Date(upcomingBookings[0].startTime))
      } else {
        setNextAvailable(now)
      }
    } else {
      setNextAvailable(new Date())
    }
  }, [bookings])

  // Get room status
  const getRoomStatus = () => {
    if (!bookings || bookings.length === 0) return 'available'
    
    const now = new Date()
    const currentBooking = bookings.find(
      booking => 
        new Date(booking.startTime) <= now && 
        new Date(booking.endTime) > now
    )
    
    return currentBooking ? 'occupied' : 'available'
  }

  const status = getRoomStatus()

  return (
    <Link 
      href={`/rooms/${room.roomId}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        h-full bg-[var(--card)] rounded-xl overflow-hidden shadow-md border border-[var(--border)]
        transition-all duration-300 relative
        ${isHovered ? 'shadow-lg scale-[1.02] border-[var(--primary-light)]' : ''}
      `}>
        {/* Status Indicator */}
        <div className={`
          absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium
          transition-colors
          ${status === 'available' 
            ? 'bg-[var(--success-light)]/20 text-[var(--success)]' 
            : 'bg-[var(--destructive-light)]/20 text-[var(--destructive)]'}
        `}>
          {status === 'available' ? 'Available' : 'Occupied'}
        </div>
        
        {/* Room Image or Gradient Placeholder */}
        <div className="h-48 relative overflow-hidden">
          {room.imageUrl ? (
            <img 
              src={room.imageUrl} 
              alt={room.roomName || `Room ${room.roomNumber}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1.01)' }}
            />
          ) : (
            <div className="w-full h-full room-gradient flex items-center justify-center">
              <HomeModernIcon className="h-16 w-16 text-white/70" />
            </div>
          )}
          
          {/* Room type badge */}
          {room.type && (
            <div className="absolute bottom-4 left-4 bg-[var(--background)]/80 backdrop-blur-sm text-[var(--foreground)] px-3 py-1 rounded-full text-xs">
              {room.type}
            </div>
          )}
        </div>
        
        <div className="p-5">
          {/* Room Name & Number */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold line-clamp-1">
              {room.roomName || `Room ${room.roomNumber}`}
            </h3>
            <div className="text-sm text-[var(--muted)] flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {room.buildingName || 'Building'} • Room {room.roomNumber}
            </div>
          </div>
          
          {/* Room Details */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-[var(--muted)]">
                <UsersIcon className="h-4 w-4 mr-2" />
                Capacity
              </div>
              <span className="font-medium">{room.capacity} people</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-[var(--muted)]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Next Available
              </div>
              <span className="font-medium">
                {status === 'available' 
                  ? 'Now' 
                  : nextAvailable 
                    ? format(nextAvailable, 'MMM d, h:mm a')
                    : 'Unknown'
                }
              </span>
            </div>
          </div>
          
          {/* Facilities Tags */}
          {facilities.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {facilities.slice(0, 3).map((facility, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[var(--accent)]/20 text-[var(--accent-foreground)]"
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    {facility}
                  </span>
                ))}
                {facilities.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[var(--muted-background)]/80 text-[var(--muted-foreground)]">
                    <InformationCircleIcon className="h-3 w-3 mr-1" />
                    +{facilities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* View Details Link */}
          <div 
            className={`
              mt-4 pt-4 border-t border-[var(--border)] text-[var(--primary)]
              flex items-center justify-between text-sm font-medium
              transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-80'}
            `}
          >
            <span>View Details</span>
            <svg 
              className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
} 