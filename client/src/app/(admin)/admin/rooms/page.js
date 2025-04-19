"use client"

import { useEffect, useState } from 'react'
import api from '@/app/utils/api'
import { useAuth } from '@/app/context/AuthProvider'
import { HomeModernIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'

const ROOM_TYPES = [
  { id: 'conference', label: 'Conference Room' },
  { id: 'classroom', label: 'Classroom' },
  { id: 'office', label: 'Office' },
  { id: 'lab', label: 'Laboratory' }
]

const RoomForm = ({ initialData, buildings, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomName: initialData?.roomName || '',
    roomNumber: initialData?.roomNumber || '',
    buildingId: initialData?.buildingId || (buildings.length > 0 ? buildings[0].buildingId : ''),
    floor: initialData?.floor || '',
    capacity: initialData?.capacity || '',
    facilities: initialData?.facilities || '',
    roomType: initialData?.roomType || 'conference',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required'
    if (!formData.buildingId) newErrors.buildingId = 'Building is required'
    if (!formData.floor) newErrors.floor = 'Floor is required'
    if (!formData.capacity) newErrors.capacity = 'Capacity is required'
    else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number'
    }
    if (!formData.roomType) newErrors.roomType = 'Room type is required'
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        capacity: parseInt(formData.capacity),
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Room Name
          </label>
          <input
            type="text"
            id="roomName"
            name="roomName"
            placeholder="e.g. Conference Room A"
            value={formData.roomName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Room Number <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            placeholder="e.g. 101"
            value={formData.roomNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.roomNumber ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all`}
          />
          {errors.roomNumber && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.roomNumber}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="roomType" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Room Type <span className="text-[var(--destructive)]">*</span>
          </label>
          <select
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.roomType ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all`}
          >
            {ROOM_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.roomType && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.roomType}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="buildingId" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Building <span className="text-[var(--destructive)]">*</span>
          </label>
          <select
            id="buildingId"
            name="buildingId"
            value={formData.buildingId}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.buildingId ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all`}
          >
            {buildings.map(building => (
              <option key={building.buildingId} value={building.buildingId}>
                {building.buildingName}
              </option>
            ))}
          </select>
          {errors.buildingId && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.buildingId}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Floor <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="text"
            id="floor"
            name="floor"
            placeholder="e.g. 1st Floor"
            value={formData.floor}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.floor ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all`}
          />
          {errors.floor && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.floor}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Capacity <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="e.g. 20"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.capacity ? 'border-[var(--destructive)]' : 'border-[var(--border)]'} bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all`}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.capacity}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="facilities" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
            Facilities <span className="text-xs text-[var(--muted-foreground)]">(comma separated)</span>
          </label>
          <textarea
            id="facilities"
            name="facilities"
            placeholder="e.g. Projector, Whiteboard, Video Conference"
            value={formData.facilities}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center min-w-[80px]"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  )
}

export default function AdminRoomsPage() {
  const { role } = useAuth()
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [roomsRes, buildingsRes] = await Promise.all([
        api.get('/admin/rooms'),
        api.get('/admin/buildings')
      ])
      setRooms(roomsRes.data)
      setBuildings(buildingsRes.data)
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await api.post('/admin/rooms', data)
      fetchData()
      setIsModalOpen(false)
    } catch (err) {
      setError('Failed to create room: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleUpdate = async (data) => {
    try {
      await api.put(`/admin/rooms/${selectedRoom.roomId}`, data)
      fetchData()
      setIsModalOpen(false)
      setSelectedRoom(null)
    } catch (err) {
      setError('Failed to update room: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (roomId) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/admin/rooms/${roomId}`)
        fetchData()
      } catch (err) {
        setError('Failed to delete room: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const getBuildingName = (buildingId) => {
    const building = buildings.find((b) => b.buildingId === buildingId);
    return building ? building.name : 'Unknown';
  };

  const getRoomTypeName = (type) => {
    switch (type) {
      case 'conference': return 'Conference';
      case 'classroom': return 'Classroom';
      case 'office': return 'Office';
      case 'lab': return 'Laboratory';
      default: return 'Conference';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HomeModernIcon className="h-8 w-8 text-[var(--primary)]" />
          Manage Rooms
        </h1>
        <Button variant="primary" onClick={() => {
          setSelectedRoom(null)
          setIsModalOpen(true)
        }}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Room
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[var(--error-light)] text-[var(--error)] rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
          >
            <div 
              className={`relative h-24 flex items-center justify-center ${
                room.roomType === 'conference' ? 'room-gradient-conference' :
                room.roomType === 'classroom' ? 'room-gradient-classroom' :
                room.roomType === 'office' ? 'room-gradient-office' :
                room.roomType === 'lab' ? 'room-gradient-lab' :
                'room-gradient'
              }`}
            >
              <HomeModernIcon className="h-12 w-12 text-white/50" />
              <div className={`badge badge-${room.roomType || 'conference'} absolute top-2 right-2`}>
                {getRoomTypeName(room.roomType)}
              </div>
              <h3 className="absolute bottom-2 left-4 text-lg font-semibold text-white">
                {room.roomName || `Room ${room.roomNumber}`}
              </h3>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[var(--muted-foreground)] text-sm mb-1">{getBuildingName(room.buildingId)}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded">
                      Floor {room.floor}
                    </span>
                    <span className="text-sm font-medium bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" /> {room.capacity}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedRoom(room)
                      setIsModalOpen(true)
                    }}
                    className="p-2 text-[var(--primary)] hover:bg-[var(--primary-light)]/10 rounded-full transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="p-2 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-full transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {room.facilities && room.facilities.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {room.facilities.map((facility, index) => (
                      <span key={index} className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-0.5 rounded-full">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-[var(--card)] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            style={{ animationDuration: '0.3s' }}
          >
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedRoom ? 'Edit Room' : 'New Room'}</h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedRoom(null)
                  }}
                  className="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <RoomForm 
                initialData={selectedRoom} 
                buildings={buildings}
                onSubmit={selectedRoom ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsModalOpen(false)
                  setSelectedRoom(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}