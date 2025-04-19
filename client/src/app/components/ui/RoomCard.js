// src/components/ui/RoomCard.js
import { MapPinIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RoomCard({ room, bookings }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{room.roomName}</h3>
            <p className="text-gray-600">Type: {room.type}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            #{room.roomId}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Capacity: {room.capacity} people
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Bookings: {bookings.length} scheduled
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Link 
            href={`/rooms/${room.roomId}`}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link 
            href={`/bookings/room/${room.roomId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}