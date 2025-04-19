"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPinIcon, CalendarIcon, ClockIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import BookingTimeline from '@/app/components/bookings/BookingTimeline'

export default function RoomDetails() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [bookings, setBookings] = useState([])
  const [building, setBuilding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, bookingsRes] = await Promise.all([
          api.get(`/rooms/${id}`),
          api.get(`/bookings/room/${id}`)
        ])
        
        setRoom(roomRes.data)
        setBookings(bookingsRes.data)
        
        // Fetch building details if not included in room response
        if (roomRes.data.buildingId) {
          const buildingRes = await api.get(`/user/buildings/${roomRes.data.buildingId}`)
          setBuilding(buildingRes.data)
        }
      } catch (error) {
        console.error('Error fetching room details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--error)]">
        Room not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/rooms" className="text-[var(--muted)] hover:text-[var(--foreground)]">
                Rooms
              </Link>
            </li>
            <li>
              <span className="text-[var(--muted)] mx-2">/</span>
            </li>
            <li className="text-[var(--primary)] font-medium" aria-current="page">
              {room.roomName}
            </li>
          </ol>
        </nav>

        {/* Room Header */}
        <div className="hover-card p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{room.roomName}</h1>
              <div className="flex items-center space-x-4 text-[var(--muted)]">
                <span className="inline-flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  {building?.floors ? `Floor ${building.floors}` : 'Building Info'}
                </span>
                <span className="inline-flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {room.capacity} people
                </span>
                <span className="room-feature-badge">
                  {room.type}
                </span>
              </div>
            </div>
            <Link
              href={`/bookings/room/${room.roomId}`}
              className="btn-primary mt-4 md:mt-0 flex items-center"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Book This Room
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Schedule */}
            <div className="hover-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-[var(--primary)]" />
                Booking Schedule
              </h2>
              <BookingTimeline bookings={bookings} />
            </div>

            {/* Room Description */}
            <div className="hover-card p-6">
              <h2 className="text-xl font-semibold mb-4">About This Space</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                {room.description || 'This modern space offers excellent facilities for meetings, workshops, and collaborative work. Equipped with state-of-the-art technology and comfortable seating.'}
              </p>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Building Card */}
            {building && (
              <div className="hover-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
                  Building Details
                </h3>
                <div className="space-y-2">
                  <p className="text-[var(--muted)]">Building ID: {building.buildingId}</p>
                  <p className="text-[var(--muted)]">Floors: {building.floors || 'N/A'}</p>
                  <Link
                    href={`/buildings/${building.buildingId}`}
                    className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)] mt-2"
                  >
                    View Building
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Upcoming Bookings */}
            <div className="hover-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Next Events
              </h3>
              <div className="space-y-4">
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking.requestId} className="gradient-border-left pl-4">
                    <p className="text-sm font-medium text-[var(--foreground)]">{booking.description}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {new Date(booking.startDate).toLocaleDateString()} •{' '}
                      {new Date(booking.startDate).toLocaleTimeString()} –{' '}
                      {new Date(booking.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-[var(--muted)] text-sm">No upcoming bookings</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}