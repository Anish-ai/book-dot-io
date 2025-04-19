// src/components/bookings/BookingCard.js
import { ClockIcon, CalendarIcon, TagIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function BookingCard({ booking }) {
  const statusColors = {
    APPROVED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold truncate">
              {booking.description || 'Untitled Booking'}
            </h3>
            <span className={`text-sm px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            #{booking.requestId}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <TagIcon className="h-5 w-5 mr-2" />
            Category: {booking.category}
          </div>
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Room: {booking.roomId}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {new Date(booking.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            {new Date(booking.startDate).toLocaleTimeString()} - {' '}
            {new Date(booking.endDate).toLocaleTimeString()}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href={`/bookings/${booking.requestId}`}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}