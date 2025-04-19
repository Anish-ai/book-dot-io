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
    <div className="admin-form-container">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
        {department ? 'Edit Department' : 'Create New Department'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Department ID</label>
          <input
            type="number"
            value={formData.deptId}
            onChange={(e) => setFormData({...formData, deptId: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.deptId ? 'border-[var(--error)]' : 'border-[var(--border)]'} focus:ring-2 focus:ring-[var(--primary)]`}
            disabled={!!department}
          />
          {errors.deptId && <p className="form-error mt-1">{errors.deptId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Department Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-[var(--error)]' : 'border-[var(--border)]'} focus:ring-2 focus:ring-[var(--primary)]`}
          />
          {errors.name && <p className="form-error mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Building</label>
          <select
            value={formData.buildingId}
            onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.buildingId ? 'border-[var(--error)]' : 'border-[var(--border)]'} focus:ring-2 focus:ring-[var(--primary)]`}
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
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
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
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BuildingOfficeIcon className="h-8 w-8 text-[var(--primary)]" />
          Department Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Department
        </button>
      </div>

      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error)] text-[var(--error)] px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Building</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.deptId} className="table-row-hover">
                <td className="table-cell font-medium">#{dept.deptId}</td>
                <td className="table-cell">{dept.name}</td>
                <td className="table-cell">Building {dept.buildingId}</td>
                <td className="table-cell flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDepartment(dept)
                      setShowForm(true)
                    }}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)] p-2 rounded-lg hover:bg-[var(--card-hover)]"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.deptId)}
                    className="text-[var(--error)] hover:text-[var(--error-light)] p-2 rounded-lg hover:bg-[var(--error-bg)]"
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
        <div className="modal-overlay">
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