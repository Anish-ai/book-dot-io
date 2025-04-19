// src/app/(admin)/admin/bookings/page.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClockIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '@/app/utils/api';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/admin/bookings');
        console.log('Bookings:', response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking.requestId === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesSearch = booking.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-xl">
        Error loading bookings: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage room bookings for your department
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
          No bookings match your criteria
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Room</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time Slot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.requestId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.requestId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <Link
                        href={`/rooms/${booking.roomId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {booking.room?.roomName || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.user?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        {new Date(booking.startDate).toLocaleString()} - {' '}
                        {new Date(booking.endDate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.requestId, e.target.value)}
                        className={`status-select ${booking.status.toLowerCase()}`}
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      <Link
                        href={`/bookings/${booking.requestId}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this booking?')) {
                            api.delete(`/bookings/${booking.requestId}`)
                              .then(() => {
                                setBookings(bookings.filter(b => b.requestId !== booking.requestId));
                              })
                              .catch(console.error);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}