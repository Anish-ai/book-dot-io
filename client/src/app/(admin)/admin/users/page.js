"use client"

import { useState, useEffect } from 'react'
import { UserIcon, UserPlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '@/app/utils/api'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/users')
      setUsers(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user)
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        role: user.role || 'user'
      })
    } else {
      setCurrentUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentUser(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (currentUser) {
        // Don't send password if it's empty (no change)
        const userData = { ...formData }
        if (!userData.password) {
          delete userData.password
        }
        
        await api.put(`/admin/users/${currentUser.userId}`, userData)
        toast.success('User updated successfully')
      } else {
        // For new user, password is required
        if (!formData.password) {
          toast.error('Password is required for new users')
          return
        }
        
        await api.post('/admin/users', formData)
        toast.success('User created successfully')
      }
      
      handleCloseModal()
      fetchUsers()
    } catch (err) {
      console.error('Error saving user:', err)
      toast.error(currentUser 
        ? 'Failed to update user' 
        : 'Failed to create user'
      )
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      toast.error('Failed to delete user')
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-[var(--primary-light)]/20 text-[var(--primary)]'
      case 'manager':
        return 'bg-[var(--warning-light)]/20 text-[var(--warning)]'
      default:
        return 'bg-[var(--secondary-light)]/20 text-[var(--secondary)]'
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add New User
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--error-light)]/20 text-[var(--error)] rounded-md border border-[var(--error)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="h-12 w-12 border-4 border-t-transparent border-[var(--primary)] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Loading users...</p>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden shadow-sm">
          {users.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)]">
              <UserIcon className="h-16 w-16 mx-auto text-[var(--muted)]/30 mb-4" />
              <p className="text-lg">No users found</p>
              <p className="text-sm mt-2">Create your first user by clicking the "Add New User" button</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border)]">
                <thead className="bg-[var(--background)]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((user, index) => (
                    <tr 
                      key={user.userId} 
                      className="hover:bg-[var(--background-hover)] transition-colors animate-fadeInUp"
                      style={{ animationDelay: `${(index % 10) * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {user.name}
                            </div>
                            <div className="text-sm text-[var(--muted)]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary-light)]/10 rounded-md transition-colors"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.userId)}
                            className="p-1.5 text-[var(--error)] hover:bg-[var(--error-light)]/10 rounded-md transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentUser ? 'Edit User' : 'New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Password{currentUser ? ' (leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!currentUser}
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
              placeholder={currentUser ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Role*
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
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
              {currentUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
} 