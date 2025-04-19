"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthProvider'
import api from '@/app/utils/api'
import { CalendarIcon, ClockIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import Button from '@/app/components/ui/Button'
import { formatTime, parseTime } from '@/app/utils/dateUtils'

export default function BookingForm({ roomId }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [roomData, setRoomData] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    description: '',
    attendees: 1
  })
  const [availableSlots, setAvailableSlots] = useState([])

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const { data } = await api.get(`/rooms/${roomId}`)
        setRoomData(data)
        setBookingData(prev => ({ ...prev, attendees: Math.min(prev.attendees, data.capacity) }))
      } catch (err) {
        setError('Failed to load room details')
        console.error(err)
      }
    }

    fetchRoomData()
  }, [roomId])

  useEffect(() => {
    if (bookingData.date) {
      fetchAvailability()
    }
  }, [bookingData.date])

  const fetchAvailability = async () => {
    try {
      const { data } = await api.get(`/rooms/${roomId}/availability?date=${bookingData.date}`)
      setAvailableSlots(data)
    } catch (err) {
      console.error('Failed to fetch availability:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'attendees') {
      const attendees = parseInt(value)
      if (roomData && attendees > roomData.capacity) {
        return // Don't update if exceeds capacity
      }
      setBookingData({ ...bookingData, [name]: attendees })
    } else {
      setBookingData({ ...bookingData, [name]: value })
    }
  }

  const validateTimeSlot = () => {
    if (!availableSlots.length) return true // No bookings yet

    const start = parseTime(bookingData.startTime)
    const end = parseTime(bookingData.endTime)
    
    if (start >= end) {
      setError('End time must be after start time')
      return false
    }

    // Check for conflicts with existing bookings
    const hasConflict = availableSlots.some(slot => {
      const slotStart = parseTime(slot.startTime)
      const slotEnd = parseTime(slot.endTime)
      
      // Check if our booking overlaps with this slot
      return (start < slotEnd && end > slotStart)
    })

    if (hasConflict) {
      setError('This time slot conflicts with an existing booking')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateTimeSlot()) {
      return
    }

    setLoading(true)
    
    try {
      await api.post('/bookings', {
        roomId: parseInt(roomId),
        userId: user.id,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        title: bookingData.title,
        description: bookingData.description,
        attendees: bookingData.attendees
      })
      
      toast.success('Booking created successfully!')
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!roomData) {
    return <div className="p-6 text-center">Loading room details...</div>
  }

  return (
    <div className="bg-[var(--background-light)] rounded-xl shadow-md p-6 mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Book Room</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-[var(--error-light)] text-[var(--error)] rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]">
        <div className="flex-1">
          <h3 className="text-xl font-medium mb-2">{roomData.roomName || `Room #${roomData.roomId}`}</h3>
          <div className="flex items-center text-[var(--foreground-muted)] mb-1">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span>Building {roomData.buildingId}, Floor {roomData.floor}</span>
          </div>
          <div className="flex items-center text-[var(--foreground-muted)]">
            <UsersIcon className="h-4 w-4 mr-2" />
            <span>Capacity: {roomData.capacity} people</span>
          </div>
        </div>
        <div className="flex-1">
          {roomData.facilities && (
            <div>
              <h4 className="font-medium mb-1">Facilities:</h4>
              <p className="text-[var(--foreground-muted)]">{roomData.facilities}</p>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Booking Title*</label>
          <input
            type="text"
            name="title"
            value={bookingData.title}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            placeholder="e.g. Team Meeting"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date*
            </label>
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <UsersIcon className="h-4 w-4 inline mr-1" />
              Number of Attendees*
            </label>
            <input
              type="number"
              name="attendees"
              value={bookingData.attendees}
              onChange={handleInputChange}
              required
              min="1"
              max={roomData.capacity}
              className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            />
            <p className="text-xs text-[var(--foreground-muted)] mt-1">Max: {roomData.capacity}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              Start Time*
            </label>
            <input
              type="time"
              name="startTime"
              value={bookingData.startTime}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              End Time*
            </label>
            <input
              type="time"
              name="endTime"
              value={bookingData.endTime}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
          <textarea
            name="description"
            value={bookingData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            placeholder="Optional details about your booking"
          ></textarea>
        </div>
        
        {availableSlots.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Existing Bookings on {bookingData.date}</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-[var(--border)] rounded-lg">
              {availableSlots.map((slot, index) => (
                <div key={index} className="p-2 bg-[var(--background)] rounded border border-[var(--border)]">
                  <p className="font-medium">{slot.title}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Book Room'}
          </Button>
        </div>
      </form>
    </div>
  )
} 