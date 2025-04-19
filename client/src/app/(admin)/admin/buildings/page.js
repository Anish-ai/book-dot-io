// src/app/(admin)/admin/buildings/page.js
"use client"

import { useEffect, useState } from 'react'
import api from '@/app/utils/api'
import { useAuth } from '@/app/context/AuthProvider'
import { BuildingOfficeIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'

const BuildingForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || { buildingId: '', floors: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Building ID</label>
        <input
          type="number"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.buildingId}
          onChange={(e) => setFormData({ ...formData, buildingId: parseInt(e.target.value) })}
          disabled={!!initialData}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors</label>
        <input
          type="number"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.floors}
          onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) })}
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Building' : 'Create Building'}
        </Button>
      </div>
    </form>
  )
}

export default function AdminBuildingsPage() {
  const { role } = useAuth()
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await api.get('/admin/buildings')
      setBuildings(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch buildings')
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await api.post('/admin/buildings', data)
      fetchBuildings()
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create building')
    }
  }

  const handleUpdate = async (data) => {
    try {
      await api.put(`/admin/buildings/${selectedBuilding.buildingId}`, data)
      fetchBuildings()
      setIsModalOpen(false)
      setSelectedBuilding(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update building')
    }
  }

  const handleDelete = async (buildingId) => {
    if (confirm('Are you sure you want to delete this building?')) {
      try {
        await api.delete(`/admin/buildings/${buildingId}`)
        fetchBuildings()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete building')
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
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
          Manage Buildings
        </h1>
        <Button onClick={() => {
          setSelectedBuilding(null)
          setIsModalOpen(true)
        }}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Building
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building) => (
          <div key={building.buildingId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Building #{building.buildingId}</h3>
                  <p className="text-gray-600">{building.floors} Floors</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBuilding(building)
                      setIsModalOpen(true)
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(building.buildingId)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                {building.departments?.length || 0} Departments
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBuilding(null)
        }}
        title={selectedBuilding ? 'Edit Building' : 'New Building'}
      >
        <BuildingForm
          initialData={selectedBuilding}
          onSubmit={selectedBuilding ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedBuilding(null)
          }}
        />
      </Modal>
    </div>
  )
}