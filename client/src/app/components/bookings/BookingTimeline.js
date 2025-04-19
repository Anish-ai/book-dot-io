// src/components/bookings/BookingTimeline.js
import { ClockIcon } from '@heroicons/react/24/outline'

export default function BookingTimeline({ bookings }) {
  return (
    <div className="relative mt-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-[var(--muted)]">
          <ClockIcon className="h-12 w-12 mx-auto mb-4 text-[var(--muted)]/30" />
          No scheduled bookings
        </div>
      ) : (
        <div className="booking-timeline">
          {bookings.map(booking => (
            <div key={booking.requestId} className="booking-timeline-item">
              <div className="bg-[var(--primary-hover)/10] rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">{booking.description}</h4>
                    <p className="text-sm text-[var(--muted)] capitalize">{booking.category.toLowerCase()}</p>
                  </div>
                  <span className="booking-time-range">
                    {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm mt-2 text-[var(--muted)]">
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