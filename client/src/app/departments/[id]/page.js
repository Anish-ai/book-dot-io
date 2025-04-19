"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BuildingOfficeIcon, UserCircleIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/app/utils/api'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'

export default function DepartmentPage() {
  const { id } = useParams()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await api.get(`/departments/${id}`)
        setDepartment(response.data)
      } catch (err) {
        setError('Failed to load department details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartment()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Department Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                {department.name}
              </h1>
              <p className="text-gray-600 mt-2">Department ID: #{department.deptId}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
              Active Department
            </span>
          </div>

          {/* Associated Building */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-700" />
              Associated Building
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Building #{department.building.buildingId}</h3>
                  <p className="text-gray-600">
                    {department.building.floors} Floors
                  </p>
                </div>
                <Link
                  href={`/buildings/${department.building.buildingId}`}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View Building
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admins and Users Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admins Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UserCircleIcon className="h-6 w-6 text-purple-600" />
            Department Admins
          </h2>
          <div className="space-y-4">
            {department.admins.map((admin) => (
              <div
                key={admin.adminId}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admin #{admin.adminId}</h3>
                    <p className="text-gray-600">{admin.email}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    Administrator
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UserGroupIcon className="h-6 w-6 text-green-600" />
            Department Users
          </h2>
          <div className="space-y-4">
            {department.users.map((user) => (
              <div
                key={user.userId}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User #{user.userId}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Member
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}