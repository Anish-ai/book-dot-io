"use client"

import { useEffect, useState } from 'react'
import api from '@/app/utils/api'
import RoomCard from '@/app/components/ui/RoomCard'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('all')
  const [sortBy, setSortBy] = useState('capacity')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/bookings')
        ])
        setRooms(roomsRes.data)
        setBookings(bookingsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredRooms = rooms
    .filter(room => {
      const matchesSearch = room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = roomType === 'all' ? true : room.type === roomType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'capacity') return b.capacity - a.capacity
      if (sortBy === 'name') return a.roomName.localeCompare(b.roomName)
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6">
              Campus Rooms
            </h1>
            <p className="text-xl mb-8">
              Explore and book available spaces across all buildings
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="lecture">Lecture Hall</option>
                <option value="lab">Laboratory</option>
                <option value="meeting">Meeting Room</option>
                <option value="auditorium">Auditorium</option>
              </select>
              <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="capacity">Sort by Capacity</option>
                <option value="name">Sort by Name</option>
              </select>
              <ArrowsUpDownIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.roomId}
              room={room}
              bookings={bookings.filter(b => b.roomId === room.roomId)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No rooms found matching your criteria</div>
            <button
              onClick={() => {
                setSearchQuery('')
                setRoomType('all')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
        </div>
      </div>
  )
}