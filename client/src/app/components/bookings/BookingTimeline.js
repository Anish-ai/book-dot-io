// src/components/bookings/BookingTimeline.js
import { ClockIcon } from '@heroicons/react/24/outline'

export default function BookingTimeline({ bookings }) {
  return (
    <div className="relative mt-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No scheduled bookings
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.requestId} className="relative pl-8 border-l-2 border-blue-200">
              <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-4" />
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{booking.description}</h4>
                    <p className="text-sm text-gray-500 capitalize">{booking.category.toLowerCase()}</p>
                  </div>
                  <span className="text-sm bg-white px-2 py-1 rounded-md shadow-sm">
                    {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}