"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, MapPinIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { useAuth } from '@/app/context/AuthProvider'

export default function MyBookings() {
  const { isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/user/bookings/my')
        setBookings(response.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) fetchBookings()
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            My Bookings
          </h1>
          <p className="mt-2 text-gray-600">View and manage all your room booking requests</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <Link
              href="/bookings"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Booking
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.requestId}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{booking.description}</h3>
                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                    #{booking.requestId}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Room {booking.roomId}
                  </div>
                  <div className="flex items-center capitalize">
                    {booking.status === 'APPROVED' ? (
                      <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    {booking.category.toLowerCase()}
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}