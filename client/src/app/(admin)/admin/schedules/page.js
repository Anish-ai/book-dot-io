// src/app/(admin)/admin/schedules/page.js
"use client"

import { useEffect, useState } from 'react';
import api from '@/app/utils/api';
import { useAuth } from '@/app/context/AuthProvider';
import { ClockIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, PauseCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import AdminTable from '@/app/components/admin/AdminTable';

export default function AdminSchedulesPage() {
  const { isAuthenticated, role, deptId } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/bookings');
        const bookings = response.data;
        
        // Extract schedules from bookings with proper null checks
        const allSchedules = bookings.flatMap(booking => 
          (booking.schedules || []).map(schedule => ({
            ...schedule,
            bookingDetails: {
              requestId: booking.requestId || '',
              description: booking.description || 'No description',
              status: booking.status || 'pending',
              user: booking.userId || ''
            }
          }))
        );
        
        setSchedules(allSchedules);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [role, deptId]);

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') return true;
    const status = schedule.bookingDetails?.status?.toLowerCase() || 'pending';
    console.log(status);
    return status === filter.toLowerCase();
  });

  const columns = [
    {
      header: 'Schedule ID',
      accessor: 'id',
      cell: (value) => <span className="font-mono">#{value}</span>
    },
    {
      header: 'Booking',
      accessor: 'bookingDetails.requestId',
      cell: (value, row) => (
        <div>
          <div className="font-medium">#{value}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {row.bookingDetails?.description || 'No description'}
          </div>
        </div>
      )
    },
    {
      header: 'Date & Time',
      accessor: 'day',
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          <div>
            <div className="font-medium">{value || 'Not specified'}</div>
            <div className="text-sm text-gray-500">
              {row.startTime ? new Date(row.startTime).toLocaleTimeString() : 'N/A'} - {' '}
              {row.endTime ? new Date(row.endTime).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Room',
      accessor: 'roomId',
      cell: (value) => (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Room #{value || 'N/A'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'bookingDetails.status',
      cell: (value) => {
        const status = (value || 'pending').toLowerCase();
        let icon, style;
        
        switch (status) {
          case 'approved':
            icon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            style = 'bg-green-100 text-green-800';
            break;
          case 'rejected':
            icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
            style = 'bg-red-100 text-red-800';
            break;
          default:
            icon = <PauseCircleIcon className="h-5 w-5 text-yellow-500" />;
            style = 'bg-yellow-100 text-yellow-800';
        }
        
        return (
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${style}`}>
            {icon}
            <span>{value || 'Pending'}</span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(value)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(value)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (scheduleId) => {
    // Implement edit functionality
    console.log('Edit schedule:', scheduleId);
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      await api.delete(`/admin/schedules/${scheduleId}`);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete schedule');
    }
  };
  if (!isAuthenticated || role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view this page. Please log in as an admin.
          </p>
          <a 
            href="/auth/login" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              Schedule Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all scheduled bookings for your department
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Schedules</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredSchedules.length > 0 ? (
            <AdminTable 
              columns={columns} 
              data={filteredSchedules} 
              emptyMessage="No schedules found matching your criteria"
            />
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <ClockIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No schedules found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "There are currently no schedules in the system." 
                  : `No ${filter} schedules found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}