"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BuildingOfficeIcon, MapPinIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import RoomCard from '@/app/components/ui/RoomCard'

export default function BuildingDetails() {
  const { id } = useParams()
  const [building, setBuilding] = useState(null)
  const [departments, setDepartments] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingRes, departmentsRes, roomsRes] = await Promise.all([
          api.get(`/user/buildings/${id}`),
          api.get('/departments'),
          api.get('/rooms')
        ])
        
        setBuilding(buildingRes.data)
        
        // Filter related data
        const buildingDepts = departmentsRes.data.filter(
          d => d.buildingId === buildingRes.data.buildingId
        )
        const buildingRooms = roomsRes.data.filter(
          r => r.buildingId === buildingRes.data.buildingId
        )
        
        setDepartments(buildingDepts)
        setRooms(buildingRooms)
      } catch (error) {
        console.error('Error fetching data:', error)
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

  if (!building) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Building Not Found</h1>
        <Link
          href="/buildings"
          className="text-blue-600 hover:text-blue-700 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Buildings
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Building Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <BuildingOfficeIcon className="h-12 w-12 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  {building.buildingId} - {building.roomName || 'Main Building'}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{building.floors || 'N/A'} Floors</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  <span>{departments.length} Departments</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{rooms.length} Active Rooms</span>
                </div>
              </div>
            </div>
            <Link
              href="/buildings"
              className="text-blue-600 hover:text-blue-700 inline-flex items-center text-sm"
            >
              Back to Buildings
            </Link>
          </div>
        </div>

        {/* Departments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-blue-600" />
            Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.deptId}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-blue-600"
              >
                <h3 className="text-lg font-semibold mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-600 mb-4">Department ID: {dept.deptId}</p>
                <Link
                  href={`/departments/${dept.deptId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center"
                >
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
            {departments.length === 0 && (
              <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-500">
                No departments found in this building
              </div>
            )}
          </div>
        </section>

        {/* Rooms Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            Available Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.roomId}
                room={room}
                bookings={[]} // You might want to fetch room-specific bookings here
              />
            ))}
            {rooms.length === 0 && (
              <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-500">
                No rooms available in this building
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}