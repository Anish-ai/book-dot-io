"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ClockIcon, CalendarIcon, UserCircleIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

export default function RoomBookingsPage() {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, bookingsRes] = await Promise.all([
          api.get(`/rooms/${roomId}`),
          api.get(`/bookings/room/${roomId}`)
        ])
        setRoom(roomRes.data)
        setBookings(bookingsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roomId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Room Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.roomName}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  Building {room.buildingId}
                </span>
                <span className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                  {room.capacity} people
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {room.type}
                </span>
              </div>
            </div>
            <Link
              href={`/bookings?roomId=${roomId}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <CalendarIcon className="h-5 w-5" />
              Book This Room
            </Link>
          </div>
        </div>

        {/* Bookings Timeline */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ClockIcon className="h-6 w-6 text-blue-600" />
              Scheduled Bookings
            </h2>
          </div>

          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No upcoming bookings for this room
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.requestId}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.description || 'Room Booking'}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(booking.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-sm">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(booking.startDate).toLocaleTimeString()} -{' '}
                            {new Date(booking.endDate).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.user && (
                      <div className="mt-2 flex items-center text-gray-500 text-sm">
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Booked by {booking.user.email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Rooms Link */}
        <div className="mt-8 text-center">
          <Link
            href="/rooms"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All Rooms
          </Link>
        </div>
      </div>
    </div>
  )
}