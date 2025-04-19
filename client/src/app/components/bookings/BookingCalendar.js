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
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {Object.entries(groupByDate).map(([date, dailyBookings]) => (
        <div 
          key={date}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="text-sm font-semibold mb-2">
            {format(parseISO(date), 'MMM dd')}
          </div>
          <div className="space-y-2">
            {dailyBookings.map(booking => (
              <div 
                key={booking.requestId}
                className="p-2 bg-blue-100 rounded text-sm text-blue-800"
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