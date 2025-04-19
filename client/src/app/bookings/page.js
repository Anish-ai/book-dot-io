// src/app/bookings/page.js
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import api from '@/app/utils/api'
import BookingForm from '@/app/components/bookings/BookingForm'
import Modal from '@/app/components/ui/Modal'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import BookingCard from '@/app/components/bookings/BookingCard'

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings')
        setBookings(response.data)
      } catch (err) {
        setError('Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookings()
  }, [])

  const handleFormSubmit = async (formData) => {
    try {
      console.log(formData);
      const response = await api.post('/user/bookings', formData)
      console.log(response.data) // Log the response data
      setBookings([...bookings, response.data]) // Update bookings state with the new booking
      setShowForm(false) // Close the form after submission
    } catch (err) {
      setError(err.response?.data?.message || 'Booking creation failed')
    }
  }

  // Filter bookings based on filter status and search query
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus;
    const matchesSearch = searchQuery === '' || 
      booking.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative hero-gradient hero-pattern py-12 px-6 rounded-xl mb-8 overflow-hidden">
          <div className="max-w-4xl relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 animate-fadeInDown">
              <CalendarIcon className="h-8 w-8" />
              Your Bookings
            </h1>
            <p className="mt-2 text-xl opacity-90 animate-fadeInUp delay-100">
              Manage all your room bookings in one place
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] p-6 mb-8 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings by title or description..."
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
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Booking
              </button>
            </div>
          </div>
          
          {/* Expanded filters */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 transition-all duration-300 ease-in-out overflow-hidden ${filtersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Status</label>
              <div className="grid grid-cols-4 gap-4">
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    filterStatus === 'all'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 text-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    filterStatus === 'approved'
                      ? 'border-[var(--success)] bg-[var(--success-light)]/20 text-[var(--success)]'
                      : 'border-[var(--border)] hover:border-[var(--success)]/50'
                  }`}
                  onClick={() => setFilterStatus('approved')}
                >
                  Approved
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    filterStatus === 'pending'
                      ? 'border-[var(--warning)] bg-[var(--warning-light)]/20 text-[var(--warning)]'
                      : 'border-[var(--border)] hover:border-[var(--warning)]/50'
                  }`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </button>
                <button
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    filterStatus === 'rejected'
                      ? 'border-[var(--destructive)] bg-[var(--destructive-light)]/20 text-[var(--destructive)]'
                      : 'border-[var(--border)] hover:border-[var(--destructive)]/50'
                  }`}
                  onClick={() => setFilterStatus('rejected')}
                >
                  Rejected
                </button>
              </div>
            </div>
            
            <div className="col-span-2 flex justify-end items-end">
              <button
                onClick={clearFilters}
                className="btn-ghost text-[var(--primary)]"
                disabled={filterStatus === 'all' && searchQuery === ''}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[var(--destructive-light)]/20 border border-[var(--destructive)] text-[var(--destructive)] px-4 py-3 rounded-lg mb-6 animate-fadeIn">
            {error}
          </div>
        )}

        {/* Results info */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center animate-fadeIn">
            <span className="badge badge-primary mr-3">{filteredBookings.length}</span>
            Bookings Found
          </h2>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking, index) => (
            <div 
              key={booking.requestId} 
              className="animate-fadeInUp"
              style={{ animationDelay: `${(index % 6) * 100}ms` }}
            >
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-16 bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] animate-fadeIn">
            <CalendarIcon className="h-16 w-16 mx-auto text-[var(--muted)]/30 mb-4" />
            <p className="text-[var(--muted)] mb-4 text-lg">No bookings found matching your criteria</p>
            {(filterStatus !== 'all' || searchQuery !== '') && (
              <button
                onClick={clearFilters}
                className="btn-primary inline-flex"
              >
                Clear Filters
              </button>
            )}
            {filterStatus === 'all' && searchQuery === '' && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Booking
              </button>
            )}
          </div>
        )}

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Booking</h2>
            <BookingForm 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </Modal>
      </div>
    </div>
  )
}