// src/app/bookings/page.js
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Room Bookings
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Booking
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.requestId} booking={booking} />
          ))}
        </div>

        {bookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No approved bookings found</p>
          </div>
        )}

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <div className="bg-white p-6 rounded-xl">
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