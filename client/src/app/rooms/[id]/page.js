"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPinIcon, CalendarIcon, ClockIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/utils/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import BookingTimeline from '@/components/bookings/BookingTimeline'

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
          api.get(`/user/rooms/${id}`),
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
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Room not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/rooms" className="text-gray-500 hover:text-gray-700">
                Rooms
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li className="text-blue-600 font-medium" aria-current="page">
              {room.roomName}
            </li>
          </ol>
        </nav>

        {/* Room Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.roomName}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="inline-flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  {building?.floors ? `Floor ${building.floors}` : 'Building Info'}
                </span>
                <span className="inline-flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {room.capacity} people
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {room.type}
                </span>
              </div>
            </div>
            <Link
              href={`/bookings/room/${room.roomId}`}
              className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                Booking Schedule
              </h2>
              <BookingTimeline bookings={bookings} />
            </div>

            {/* Room Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About This Space</h2>
              <p className="text-gray-600 leading-relaxed">
                {room.description || 'This modern space offers excellent facilities for meetings, workshops, and collaborative work. Equipped with state-of-the-art technology and comfortable seating.'}
              </p>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Building Card */}
            {building && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Building Details
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">Building ID: {building.buildingId}</p>
                  <p className="text-gray-600">Floors: {building.floors || 'N/A'}</p>
                  <Link
                    href={`/buildings/${building.buildingId}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-2"
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Next Events
              </h3>
              <div className="space-y-4">
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking.requestId} className="border-l-4 border-blue-600 pl-4">
                    <p className="text-sm font-medium text-gray-900">{booking.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(booking.startDate).toLocaleDateString()} •{' '}
                      {new Date(booking.startDate).toLocaleTimeString()} –{' '}
                      {new Date(booking.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-sm">No upcoming bookings</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}