"use client"

import { useEffect, useState } from 'react'
import api from '@/app/utils/api'
import RoomCard from '@/app/components/ui/RoomCard'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon, 
  BuildingOfficeIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [buildings, setBuildings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('all')
  const [buildingFilter, setBuildingFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('capacity')
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, buildingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/bookings'),
          api.get('/buildings')
        ])
        setRooms(roomsRes.data)
        setBookings(bookingsRes.data)
        setBuildings(buildingsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique room types from the available rooms
  const roomTypes = ['all', ...new Set(rooms.map(room => room.type.toLowerCase()))].filter(Boolean)

  const filteredRooms = rooms
    .filter(room => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        room.roomName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.facilities?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Room type filter
      const matchesType = roomType === 'all' ? true : 
        (room.type?.toLowerCase() === roomType)
      
      // Building filter
      const matchesBuilding = buildingFilter === 'all' ? true : 
        (room.buildingId?.toString() === buildingFilter)
      
      // Capacity filter
      let matchesCapacity = true
      if (capacityFilter === 'small') {
        matchesCapacity = room.capacity <= 10
      } else if (capacityFilter === 'medium') {
        matchesCapacity = room.capacity > 10 && room.capacity <= 30
      } else if (capacityFilter === 'large') {
        matchesCapacity = room.capacity > 30
      }
      
      return matchesSearch && matchesType && matchesBuilding && matchesCapacity
    })
    .sort((a, b) => {
      if (sortBy === 'capacity') return b.capacity - a.capacity
      if (sortBy === 'name') return (a.roomName || '').localeCompare(b.roomName || '')
      return 0
    })

  // Function to clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setRoomType('all')
    setBuildingFilter('all')
    setCapacityFilter('all')
    setSortBy('capacity')
  }

  // Function to generate loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-48 bg-[var(--card)] rounded-xl mb-8"></div>
      <div className="h-24 bg-[var(--card)] rounded-xl mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-[var(--card)] rounded-xl"></div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="relative hero-gradient hero-pattern py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeInDown">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 flex items-center justify-center gap-4">
              <BuildingOfficeIcon className="h-12 w-12" />
              Campus Rooms
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Explore and book available spaces across all buildings
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] p-6 mb-8 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rooms by name or features..."
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-[var(--muted)]" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3.5 text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="btn-outline flex items-center justify-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                {filtersOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <button
                onClick={clearFilters}
                className="btn-ghost text-[var(--primary)]"
                disabled={roomType === 'all' && buildingFilter === 'all' && capacityFilter === 'all' && sortBy === 'capacity' && searchQuery === ''}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Expanded filters */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 transition-all duration-300 ease-in-out overflow-hidden ${filtersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Room Type</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 pl-10 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {roomTypes.filter(type => type !== 'all').map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-[var(--muted)]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Building</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 pl-10 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                >
                  <option value="all">All Buildings</option>
                  {buildings.map(building => (
                    <option key={building.buildingId} value={building.buildingId.toString()}>
                      {building.buildingName || `Building #${building.buildingId}`}
                    </option>
                  ))}
                </select>
                <BuildingOfficeIcon className="h-5 w-5 absolute left-3 top-3 text-[var(--muted)]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Sort By</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 pl-10 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="capacity">Sort by Capacity</option>
                  <option value="name">Sort by Name</option>
                </select>
                <ArrowsUpDownIcon className="h-5 w-5 absolute left-3 top-3 text-[var(--muted)]" />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-[var(--foreground)]">Capacity</label>
              <div className="grid grid-cols-4 gap-4">
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    capacityFilter === 'all'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                  onClick={() => setCapacityFilter('all')}
                >
                  All
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    capacityFilter === 'small'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                  onClick={() => setCapacityFilter('small')}
                >
                  Small (1-10)
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    capacityFilter === 'medium'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                  onClick={() => setCapacityFilter('medium')}
                >
                  Medium (11-30)
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    capacityFilter === 'large'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                  onClick={() => setCapacityFilter('large')}
                >
                  Large (30+)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center animate-fadeIn">
            <span className="badge badge-primary mr-3">{filteredRooms.length}</span>
            Rooms Available
          </h2>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <div 
              key={room.roomId} 
              className="animate-fadeInUp"
              style={{ animationDelay: `${(index % 6) * 100}ms` }}
            >
              <RoomCard
                room={room}
                bookings={bookings.filter(b => b.roomId === room.roomId)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto text-[var(--muted)]/30 mb-4" />
            <div className="text-[var(--muted)] mb-4 text-lg">No rooms found matching your criteria</div>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}