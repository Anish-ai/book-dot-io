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
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-[var(--error-bg)] rounded-xl text-center">
          <h2 className="text-xl font-semibold text-[var(--error)] mb-4">{error}</h2>
          <Link href="/bookings" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium">
            ← Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/bookings" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bookings
          </Link>
        </div>

        <div className="booking-detail-card">
          {/* Header Section */}
          <div className="booking-detail-section">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{booking.description || 'Untitled Booking'}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                  <span className="flex items-center text-[var(--muted)]">
                    <TagIcon className="h-5 w-5 mr-1" />
                    {booking.category}
                  </span>
                </div>
              </div>
              {booking.status === 'PENDING' && (
                <Link 
                  href={`/bookings/${id}/edit`}
                  className="btn-primary"
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
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Booking Information</h3>
                
                <div className="flex items-start">
                  <CalendarIcon className="h-6 w-6 text-[var(--muted)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Dates</p>
                    <p className="text-[var(--muted)]">
                      {new Date(booking.startDate).toLocaleDateString()} - {' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-[var(--muted)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Time Range</p>
                    <p className="text-[var(--muted)]">
                      {new Date(booking.startDate).toLocaleTimeString()} - {' '}
                      {new Date(booking.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-[var(--muted)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Location</p>
                    <p className="text-[var(--muted)]">
                      Room {booking.room?.roomName} (Capacity: {booking.room?.capacity})
                    </p>
                    <p className="text-sm text-[var(--muted)]">Building {booking.room?.buildingId}</p>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Description</h3>
                  <p className="text-[var(--muted)] whitespace-pre-line">{booking.description}</p>
                </div>
              )}
            </div>

            {/* Schedule Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Scheduled Sessions</h3>
              <div className="space-y-4">
                {booking.schedules?.map((schedule) => (
                  <div 
                    key={schedule.id}
                    className="p-4 bg-[var(--card-hover)] rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{schedule.day}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {new Date(schedule.startTime).toLocaleTimeString()} - {' '}
                          {new Date(schedule.endTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-sm text-[var(--muted)]">
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