"use client"

import { useEffect, useState } from 'react'
import api from '@/app/utils/api'
import { useAuth } from '@/app/context/AuthProvider'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

export default function AdminRoomsPage() {
  const { role, deptId } = useAuth()
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [formState, setFormState] = useState({
    roomName: '',
    type: 'CLASSROOM',
    capacity: 30,
    buildingId: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, buildingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/buildings')
        ])
        setRooms(roomsRes.data)
        setBuildings(buildingsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedRoom) {
        await api.put(`/admin/rooms/${selectedRoom.roomId}`, formState)
      } else {
        await api.post('/admin/rooms', formState)
      }
      const res = await api.get('/admin/rooms')
      setRooms(res.data)
      setIsModalOpen(false)
      setSelectedRoom(null)
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const handleDelete = async (roomId) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/admin/rooms/${roomId}`)
        setRooms(rooms.filter(room => room.roomId !== roomId))
      } catch (error) {
        console.error('Error deleting room:', error)
      }
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BuildingLibraryIcon className="h-8 w-8 text-blue-600" />
          Manage Rooms
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Room
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Building</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.roomId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{room.roomName}</td>
                <td className="px-6 py-4">
                  <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {room.type.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4">{room.capacity}</td>
                <td className="px-6 py-4">Building {room.buildingId}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedRoom(room)
                      setFormState({
                        roomName: room.roomName,
                        type: room.type,
                        capacity: room.capacity,
                        buildingId: room.buildingId
                      })
                      setIsModalOpen(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.roomId)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">
              {selectedRoom ? 'Edit Room' : 'Create New Room'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formState.roomName}
                  onChange={(e) => setFormState({ ...formState, roomName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                >
                  <option value="CLASSROOM">Classroom</option>
                  <option value="LAB">Lab</option>
                  <option value="AUDITORIUM">Auditorium</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formState.capacity}
                  onChange={(e) => setFormState({ ...formState, capacity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Building</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formState.buildingId}
                  onChange={(e) => setFormState({ ...formState, buildingId: e.target.value })}
                  required
                >
                  <option value="">Select Building</option>
                  {buildings.map((building) => (
                    <option key={building.buildingId} value={building.buildingId}>
                      Building {building.buildingId} ({building.floors} floors)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedRoom(null)
                    setFormState({
                      roomName: '',
                      type: 'CLASSROOM',
                      capacity: 30,
                      buildingId: ''
                    })
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}