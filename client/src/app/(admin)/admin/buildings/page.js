// src/app/(admin)/admin/buildings/page.js
"use client"

import { useState, useEffect } from 'react'
import { BuildingOfficeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import api from '@/app/utils/api'
import AdminLayout from '@/app/components/admin/AdminLayout'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'

export default function BuildingsPage() {
  const router = useRouter()
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentBuilding, setCurrentBuilding] = useState(null)
  const [formData, setFormData] = useState({
    buildingName: '',
    address: '',
    numFloors: 1
  })

  const fetchBuildings = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/buildings')
      setBuildings(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching buildings:', err)
      setError('Failed to load buildings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBuildings()
  }, [])

  const handleOpenModal = (building = null) => {
    if (building) {
      setCurrentBuilding(building)
      setFormData({
        buildingName: building.buildingName || '',
        address: building.address || '',
        numFloors: building.numFloors || 1
      })
    } else {
      setCurrentBuilding(null)
      setFormData({
        buildingName: '',
        address: '',
        numFloors: 1
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentBuilding(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'numFloors') {
      setFormData({
        ...formData,
        [name]: Math.max(1, parseInt(value) || 1)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (currentBuilding) {
        // Update existing building
        await api.put(`/buildings/${currentBuilding.buildingId}`, formData)
        toast.success('Building updated successfully')
      } else {
        // Create new building
        await api.post('/buildings', formData)
        toast.success('Building created successfully')
      }
      
      handleCloseModal()
      fetchBuildings()
    } catch (err) {
      console.error('Error saving building:', err)
      toast.error(currentBuilding 
        ? 'Failed to update building' 
        : 'Failed to create building'
      )
    }
  }

  const handleDelete = async (buildingId) => {
    if (!confirm('Are you sure you want to delete this building? This will also delete all associated rooms.')) {
      return
    }
    
    try {
      await api.delete(`/buildings/${buildingId}`)
      toast.success('Building deleted successfully')
      fetchBuildings()
    } catch (err) {
      console.error('Error deleting building:', err)
      toast.error('Failed to delete building')
    }
  }

  return (
    <AdminLayout title="Buildings">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Buildings</h1>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
        >
          Add New Building
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--error-light)] text-[var(--error)] rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading buildings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.length === 0 ? (
            <div className="col-span-full text-center py-8 text-[var(--foreground-muted)]">
              No buildings found. Add your first building to get started.
            </div>
          ) : (
            buildings.map((building) => (
              <div 
                key={building.buildingId} 
                className="bg-[var(--background)] rounded-lg border border-[var(--border)] shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
                      <h2 className="ml-2 text-xl font-medium">{building.buildingName}</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenModal(building)}
                        className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] rounded-md transition-colors"
                        aria-label="Edit building"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(building.buildingId)}
                        className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--error)] rounded-md transition-colors"
                        aria-label="Delete building"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-[var(--foreground-muted)]">
                    <p className="mb-1">{building.address}</p>
                    <p>Floors: {building.numFloors}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <button
                      onClick={() => router.push(`/admin/rooms?buildingId=${building.buildingId}`)}
                      className="text-[var(--primary)] hover:text-[var(--primary-dark)] text-sm font-medium transition-colors"
                    >
                      Manage Rooms
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentBuilding ? 'Edit Building' : 'New Building'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Building Name*
            </label>
            <input
              type="text"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
              placeholder="Enter building name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
              placeholder="Enter address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Number of Floors*
            </label>
            <input
              type="number"
              name="numFloors"
              value={formData.numFloors}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            />
          </div>
          
          <div className="pt-2 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              {currentBuilding ? 'Update Building' : 'Create Building'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}