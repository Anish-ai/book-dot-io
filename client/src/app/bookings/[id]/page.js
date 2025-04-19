// src/app/bookings/[id]/page.js
"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ClockIcon, CalendarIcon, UserCircleIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import Link from 'next/link'

export default function BookingDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/user/bookings/${id}`)
        setBooking(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking details')
        if(err.response?.status === 403) {
          router.push('/bookings/my')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooking()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-50 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">{error}</h2>
          <Link href="/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/bookings" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bookings
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{booking.description || 'Untitled Booking'}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <TagIcon className="h-5 w-5 mr-1" />
                    {booking.category}
                  </span>
                </div>
              </div>
              {booking.status === 'PENDING' && (
                <Link 
                  href={`/bookings/${id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Request
                </Link>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Booking Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Booking Information</h3>
                
                <div className="flex items-start">
                  <CalendarIcon className="h-6 w-6 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Dates</p>
                    <p className="text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} - {' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Time Range</p>
                    <p className="text-gray-600">
                      {new Date(booking.startDate).toLocaleTimeString()} - {' '}
                      {new Date(booking.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      Room {booking.room?.roomName} (Capacity: {booking.room?.capacity})
                    </p>
                    <p className="text-sm text-gray-500">Building {booking.room?.buildingId}</p>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{booking.description}</p>
                </div>
              )}
            </div>

            {/* Schedule Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Sessions</h3>
              <div className="space-y-4">
                {booking.schedules?.map((schedule) => (
                  <div 
                    key={schedule.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{schedule.day}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(schedule.startTime).toLocaleTimeString()} - {' '}
                          {new Date(schedule.endTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        Room {schedule.roomId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}