// src/app/(admin)/admin/bookings/page.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ClockIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarDaysIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '@/app/utils/api';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Button from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      toast.success(`Booking status updated to ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b.requestId !== bookingId));
      toast.success('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Failed to delete booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesSearch = !searchQuery || 
      booking.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success-light)]/20 text-[var(--success)]">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--warning-light)]/20 text-[var(--warning)]">
            <PendingIcon className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--error-light)]/20 text-[var(--error)]">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--secondary-light)]/20 text-[var(--secondary)]">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[var(--error-light)]/20 text-[var(--error)] rounded-xl border border-[var(--error)]">
        Error loading bookings: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="relative hero-gradient hero-pattern py-8 px-6 rounded-xl overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-fadeInDown">
            <CalendarDaysIcon className="h-7 w-7" />
            Booking Requests
          </h1>
          <p className="text-white/80 mt-1 animate-fadeInUp delay-100">
            Manage room bookings for your organization
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-5 left-5 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-5 right-5 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] p-6 animate-fadeInUp">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="     Search by description or user email..."
              className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-[var(--muted)]" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[300px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              disabled={statusFilter === 'ALL' && !searchQuery}
              className="text-[var(--primary)]"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results info */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center animate-fadeIn">
          <span className="badge badge-primary mr-3">{filteredBookings.length}</span>
          Booking Requests
        </h2>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-[var(--card)] p-12 rounded-xl shadow-sm border border-[var(--border)] text-center animate-fadeIn">
          <CalendarDaysIcon className="h-16 w-16 mx-auto text-[var(--muted)]/30 mb-4" />
          <p className="text-[var(--muted)] text-lg mb-4">No bookings match your criteria</p>
          {(statusFilter !== 'ALL' || searchQuery) && (
            <Button 
              variant="primary" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Room</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Time Slot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.requestId} 
                    className="hover:bg-[var(--background-hover)] transition-colors animate-fadeInUp"
                    style={{ animationDelay: `${(index % 10) * 50}ms` }}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--foreground)]">#{booking.requestId}</td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      <Link
                        href={`/rooms/${booking.roomId}`}
                        className="text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                      >
                        {booking.room?.roomName || `Room #${booking.roomId}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      {booking.user?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-[var(--primary)]" />
                        <div>
                          <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                          <div className="text-xs">{new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.requestId, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] bg-[var(--background)] 
                          ${booking.status === 'APPROVED' ? 'text-[var(--success)]' : 
                            booking.status === 'PENDING' ? 'text-[var(--warning)]' : 
                            'text-[var(--error)]'}`}
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/bookings/${booking.requestId}`}
                          className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary-light)]/10 rounded-md transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(booking.requestId)}
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
        </div>
      )}
    </div>
  );
}