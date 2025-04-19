// src/components/bookings/BookingCalendar.js
import { format, parseISO, isSameDay } from 'date-fns'

export default function BookingCalendar({ bookings }) {
  const groupByDate = bookings.reduce((acc, booking) => {
    const dateKey = format(parseISO(booking.startDate), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(booking)
    return acc
  }, {})

  return (
    <div className="calendar-grid">
      {Object.entries(groupByDate).map(([date, dailyBookings]) => (
        <div 
          key={date}
          className="bg-[var(--card-hover)] p-4 rounded-lg border border-[var(--border)]"
        >
          <div className="text-sm font-semibold mb-2">
            {format(parseISO(date), 'MMM dd')}
          </div>
          <div className="space-y-2">
            {dailyBookings.map(booking => (
              <div 
                key={booking.requestId}
                className="p-2 bg-[var(--primary-hover)/10] rounded text-sm text-[var(--primary)]"
              >
                <div className="font-medium">
                  {format(parseISO(booking.startDate), 'HH:mm')} - {' '}
                  {format(parseISO(booking.endDate), 'HH:mm')}
                </div>
                <div className="truncate">{booking.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}