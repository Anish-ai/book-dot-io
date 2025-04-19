"use client"

import { useState, useEffect } from 'react'
import { CalendarIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import api from '@/app/utils/api'
import { useAuth } from '@/app/context/AuthProvider'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'

const ScheduleForm = ({ initialData, rooms, courses, instructors, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      roomId: '',
      courseId: '',
      instructorId: '',
      weekday: 'MONDAY',
      startHour: 9,
      endHour: 11
    }
  )
  
  const weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Room</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.roomId} value={room.roomId}>
                Room #{room.roomId} (Building #{room.buildingId})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Course</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Instructor</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.instructorId}
            onChange={(e) => setFormData({ ...formData, instructorId: parseInt(e.target.value) })}
          >
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.userId} value={instructor.userId}>
                {instructor.firstName} {instructor.lastName}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Day</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.weekday}
            onChange={(e) => setFormData({ ...formData, weekday: e.target.value })}
          >
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Start Time</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.startHour}
            onChange={(e) => setFormData({ ...formData, startHour: parseInt(e.target.value) })}
          >
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">End Time</label>
          <select
            required
            className="w-full p-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]"
            value={formData.endHour}
            onChange={(e) => setFormData({ ...formData, endHour: parseInt(e.target.value) })}
          >
            {hours.filter(hour => hour > formData.startHour).map((hour) => (
              <option key={hour} value={hour}>
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  )
}

export default function AdminSchedulePage() {
  const { role } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [rooms, setRooms] = useState([])
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [schedulesRes, roomsRes, coursesRes, instructorsRes] = await Promise.all([
        api.get('/admin/schedules'),
        api.get('/admin/rooms'),
        api.get('/admin/courses'),
        api.get('/admin/instructors')
      ])
      setSchedules(schedulesRes.data)
      setRooms(roomsRes.data)
      setCourses(coursesRes.data)
      setInstructors(instructorsRes.data)
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await api.post('/admin/schedules', data)
      fetchData()
      setIsModalOpen(false)
    } catch (err) {
      setError('Failed to create schedule: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleUpdate = async (data) => {
    try {
      await api.put(`/admin/schedules/${selectedSchedule.scheduleId}`, data)
      fetchData()
      setIsModalOpen(false)
      setSelectedSchedule(null)
    } catch (err) {
      setError('Failed to update schedule: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (scheduleId) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await api.delete(`/admin/schedules/${scheduleId}`)
        fetchData()
      } catch (err) {
        setError('Failed to delete schedule: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const formatTime = (hour) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const getWeekdayColor = (weekday) => {
    const colors = {
      MONDAY: 'var(--primary-light)',
      TUESDAY: 'var(--success-light)',
      WEDNESDAY: 'var(--warning-light)',
      THURSDAY: 'var(--error-light)',
      FRIDAY: 'var(--secondary-light)',
      SATURDAY: 'var(--accent-light)',
      SUNDAY: 'var(--info-light)'
    }
    return colors[weekday] || 'var(--background-light)'
  }

  const getWeekdayTextColor = (weekday) => {
    const colors = {
      MONDAY: 'var(--primary-dark)',
      TUESDAY: 'var(--success-dark)',
      WEDNESDAY: 'var(--warning-dark)',
      THURSDAY: 'var(--error-dark)',
      FRIDAY: 'var(--secondary-dark)',
      SATURDAY: 'var(--accent-dark)',
      SUNDAY: 'var(--info-dark)'
    }
    return colors[weekday] || 'var(--foreground)'
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
          <CalendarIcon className="h-8 w-8 text-[var(--primary)]" />
          Manage Schedule
        </h1>
        <Button variant="primary" onClick={() => {
          setSelectedSchedule(null)
          setIsModalOpen(true)
        }}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Schedule
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[var(--error-light)] text-[var(--error)] rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => {
          const course = courses.find(c => c.courseId === schedule.courseId) || {}
          const room = rooms.find(r => r.roomId === schedule.roomId) || {}
          const instructor = instructors.find(i => i.userId === schedule.instructorId) || {}

          return (
            <div key={schedule.scheduleId} className="bg-[var(--background-light)] rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-12 rounded-l-lg mr-3" 
                      style={{backgroundColor: getWeekdayColor(schedule.weekday)}}
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold">{course.courseCode}</h3>
                      <p className="text-[var(--foreground-muted)]">{course.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule)
                        setIsModalOpen(true)
                      }}
                      className="p-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--background-hover)]"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.scheduleId)}
                      className="p-2 text-[var(--foreground-muted)] hover:text-[var(--error)] rounded-lg hover:bg-[var(--background-hover)]"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-[var(--foreground-muted)]">
                    <span className="font-medium mr-2">Room:</span> #{room.roomId} (Building #{room.buildingId})
                  </div>
                  <div className="flex items-center text-sm text-[var(--foreground-muted)]">
                    <span className="font-medium mr-2">Instructor:</span> {instructor.firstName} {instructor.lastName}
                  </div>
                  <div className="flex items-center text-sm text-[var(--foreground-muted)]">
                    <span className="font-medium mr-2">Time:</span> {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
                  </div>
                  <div className="mt-3">
                    <span 
                      className="px-3 py-1 text-sm rounded-full" 
                      style={{
                        backgroundColor: getWeekdayColor(schedule.weekday),
                        color: getWeekdayTextColor(schedule.weekday)
                      }}
                    >
                      {schedule.weekday.charAt(0) + schedule.weekday.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSchedule(null)
        }}
        title={selectedSchedule ? 'Edit Schedule' : 'New Schedule'}
      >
        <ScheduleForm
          initialData={selectedSchedule}
          rooms={rooms}
          courses={courses}
          instructors={instructors}
          onSubmit={selectedSchedule ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedSchedule(null)
          }}
        />
      </Modal>
    </div>
  )
} 