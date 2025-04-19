// src/components/bookings/BookingCard.js
import { useState } from 'react';
import { 
  ClockIcon, 
  CalendarIcon, 
  TagIcon, 
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  XCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BookingCard({ booking }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success-light)]/20 text-[var(--success)]">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--warning-light)]/20 text-[var(--warning)]">
            <PendingIcon className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--error-light)]/20 text-[var(--error)]">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--secondary-light)]/20 text-[var(--secondary)]">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link
      href={`/bookings/${booking.requestId}`}
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        h-full bg-[var(--card)] rounded-xl overflow-hidden shadow-md border border-[var(--border)]
        transition-all duration-300 relative
        ${isHovered ? 'shadow-lg scale-[1.02] border-[var(--primary-light)]' : ''}
      `}>
        {/* Status indicator bar at top */}
        <div className={`h-1.5 w-full 
          ${booking.status === 'APPROVED' ? 'bg-[var(--success)]' : 
            booking.status === 'PENDING' ? 'bg-[var(--warning)]' : 
            'bg-[var(--error)]'}`}
        />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                {booking.description || 'Untitled Booking'}
              </h3>
              <div className="mt-1.5">
                {getStatusBadge(booking.status)}
              </div>
            </div>
            <span className="text-[var(--muted)] text-sm bg-[var(--background)]/80 px-2 py-1 rounded">
              #{booking.requestId}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {booking.category && (
              <div className="flex items-center text-sm text-[var(--muted)]">
                <TagIcon className="h-4 w-4 mr-2 text-[var(--primary)]" />
                <span>{booking.category}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-[var(--muted)]">
              <BuildingOfficeIcon className="h-4 w-4 mr-2 text-[var(--primary)]" />
              <span>Room {booking.roomId}</span>
            </div>
            
            <div className="flex items-center text-sm text-[var(--muted)]">
              <CalendarIcon className="h-4 w-4 mr-2 text-[var(--primary)]" />
              <span>{formatDate(booking.startDate)}</span>
            </div>
            
            <div className="flex items-center text-sm text-[var(--muted)]">
              <ClockIcon className="h-4 w-4 mr-2 text-[var(--primary)]" />
              <span>{formatTime(booking.startDate)} - {formatTime(booking.endDate)}</span>
            </div>
          </div>

          <div 
            className={`
              pt-4 border-t border-[var(--border)] flex justify-end items-center
              text-[var(--primary)] text-sm font-medium
              transition-all duration-300
            `}
          >
            <span>View Details</span>
            <ArrowRightIcon className={`h-4 w-4 ml-1.5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}