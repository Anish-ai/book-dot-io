"use client"

import { useState, useEffect } from 'react'
import api from '@/app/utils/api'
import { useAuth } from '@/app/context/AuthProvider'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const DepartmentForm = ({ department, buildings, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    deptId: department?.deptId || '',
    name: department?.name || '',
    buildingId: department?.buildingId || ''
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.deptId) newErrors.deptId = 'Department ID is required'
    if (!formData.name) newErrors.name = 'Department name is required'
    if (!formData.buildingId) newErrors.buildingId = 'Building is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
        {department ? 'Edit Department' : 'Create New Department'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
          <input
            type="number"
            value={formData.deptId}
            onChange={(e) => setFormData({...formData, deptId: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.deptId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
            disabled={!!department}
          />
          {errors.deptId && <p className="form-error mt-1">{errors.deptId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && <p className="form-error mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
          <select
            value={formData.buildingId}
            onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.buildingId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Building</option>
            {buildings.map(building => (
              <option key={building.buildingId} value={building.buildingId}>
                Building {building.buildingId} ({building.floors} floors)
              </option>
            ))}
          </select>
          {errors.buildingId && <p className="form-error mt-1">{errors.buildingId}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusCircleIcon className="h-5 w-5" />
            {department ? 'Save Changes' : 'Create Department'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function DepartmentsPage() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, buildingRes] = await Promise.all([
          api.get('/departments'),
          api.get('/buildings')
        ])
        setDepartments(deptRes.data)
        setBuildings(buildingRes.data)
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async (formData) => {
    try {
      if (selectedDepartment) {
        await api.put(`/admin/departments/${selectedDepartment.deptId}`, formData)
        setDepartments(departments.map(d => 
          d.deptId === selectedDepartment.deptId ? {...d, ...formData} : d
        ))
      } else {
        const res = await api.post('/admin/departments', formData)
        setDepartments([...departments, res.data])
      }
      setShowForm(false)
      setSelectedDepartment(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (deptId) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/admin/departments/${deptId}`)
        setDepartments(departments.filter(d => d.deptId !== deptId))
      } catch (err) {
        setError('Failed to delete department')
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
          Department Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Department
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Building</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept.deptId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">#{dept.deptId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dept.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">Building {dept.buildingId}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDepartment(dept)
                      setShowForm(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.deptId)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <DepartmentForm
            department={selectedDepartment}
            buildings={buildings}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setSelectedDepartment(null)
            }}
          />
        </div>
      )}
    </div>
  )
}