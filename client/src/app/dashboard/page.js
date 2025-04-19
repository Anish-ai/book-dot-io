"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthProvider';
import api from '@/app/utils/api';
import Link from 'next/link';
import { 
  ClockIcon, 
  CalendarDaysIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    upcomingBookings: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, roomsRes, buildingsRes] = await Promise.all([
          api.get('/bookings/user'),
          api.get('/rooms'),
          api.get('/buildings')
        ]);
        
        const userBookings = bookingsRes.data;
        
        setBookings(userBookings);
        setRooms(roomsRes.data);
        setBuildings(buildingsRes.data);
        
        // Calculate statistics
        const pendingCount = userBookings.filter(b => b.status === 'PENDING').length;
        const today = new Date();
        const upcomingCount = userBookings.filter(b => new Date(b.startDate) > today && b.status !== 'REJECTED').length;
        
        setStats({
          totalBookings: userBookings.length,
          pendingBookings: pendingCount,
          upcomingBookings: upcomingCount,
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get a room name by ID
  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.roomId === roomId);
    return room ? {
      name: room.roomName || `Room #${roomId}`,
      building: getBuildingName(room.buildingId),
      floor: room.floor || '1'
    } : { name: `Room #${roomId}`, building: 'Unknown', floor: '' };
  };
  
  // Function to get a building name by ID
  const getBuildingName = (buildingId) => {
    const building = buildings.find(b => b.buildingId === buildingId);
    return building ? building.buildingName || `Building #${buildingId}` : `Building #${buildingId}`;
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success-light)] text-[var(--success)]">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--warning-light)] text-[var(--warning)]">
            <PendingIcon className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--error-light)] text-[var(--error)]">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--secondary-light)] text-[var(--secondary)]">
            {status || 'Unknown'}
          </span>
        );
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  };
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="h-28 bg-[var(--card)] rounded-xl"></div>
        <div className="h-28 bg-[var(--card)] rounded-xl"></div>
        <div className="h-28 bg-[var(--card)] rounded-xl"></div>
      </div>
      <div className="h-10 bg-[var(--card)] rounded-full w-60 mb-6"></div>
      <div className="space-y-4">
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="animate-fadeInDown">
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
              <p className="mt-2 text-white/80">Manage your room bookings and explore new spaces</p>
            </div>
            <div className="mt-4 md:mt-0 animate-fadeInUp">
              <Link 
                href="/rooms" 
                className="bg-white text-[var(--primary)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Book a Room
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="stats-card p-6 animate-fadeInUp delay-100">
            <div className="flex items-center">
              <div className="p-4 bg-[var(--primary)]/10 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.totalBookings}</div>
                <div className="stats-label">Total Bookings</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card p-6 animate-fadeInUp delay-200">
            <div className="flex items-center">
              <div className="p-4 bg-[var(--warning)]/10 rounded-xl">
                <PendingIcon className="h-8 w-8 text-[var(--warning)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.pendingBookings}</div>
                <div className="stats-label">Pending Approvals</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card p-6 animate-fadeInUp delay-300">
            <div className="flex items-center">
              <div className="p-4 bg-[var(--success)]/10 rounded-xl">
                <ClockIcon className="h-8 w-8 text-[var(--success)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.upcomingBookings}</div>
                <div className="stats-label">Upcoming Bookings</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden mb-10 animate-fadeIn">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--border)]">
            <div>
              <h2 className="text-xl font-bold">Your Recent Bookings</h2>
              <p className="text-[var(--muted)] text-sm">Manage your scheduled room bookings</p>
            </div>
            <div className="mt-2 md:mt-0">
              <Link 
                href="/bookings" 
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] flex items-center text-sm font-medium"
              >
                View All
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Booking List */}
          <div className="divide-y divide-[var(--border)]">
            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-[var(--muted)]/30 mx-auto mb-4" />
                <p className="text-[var(--muted)] mb-4">You don't have any bookings yet</p>
                <Link 
                  href="/rooms" 
                  className="btn-primary inline-flex"
                >
                  Book Your First Room
                </Link>
              </div>
            ) : (
              bookings.slice(0, 5).map((booking, index) => {
                const roomInfo = getRoomInfo(booking.roomId);
                return (
                  <div 
                    key={booking.requestId} 
                    className="p-4 md:p-6 hover:bg-[var(--background-hover)] transition-colors animate-fadeInUp"
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--primary)]/10 rounded-lg hidden sm:block">
                          <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{booking.title || 'Untitled Booking'}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-1">
                            <div className="flex items-center text-[var(--muted)] text-sm">
                              <ClockIcon className="h-4 w-4 mr-1.5" />
                              {formatDateTime(booking.startDate)}
                            </div>
                            <div className="flex items-center text-[var(--muted)] text-sm">
                              <BuildingOfficeIcon className="h-4 w-4 mr-1.5" />
                              {roomInfo.name}
                            </div>
                            <div className="flex items-center text-[var(--muted)] text-sm">
                              <MapPinIcon className="h-4 w-4 mr-1.5" />
                              {roomInfo.building}, Floor {roomInfo.floor}
                            </div>
                            <div>
                              {getStatusBadge(booking.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 md:flex-col md:items-end">
                        <Link 
                          href={`/bookings/${booking.requestId}`}
                          className="btn-outline text-sm py-1.5 px-3 flex-1 md:flex-none"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp delay-500">
          <Link
            href="/rooms"
            className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex items-center hover:shadow-md transition-all hover:border-[var(--primary)]/30"
          >
            <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Find Rooms</h3>
              <p className="text-[var(--muted)] text-sm">Explore available spaces</p>
            </div>
          </Link>
          
          <Link
            href="/buildings"
            className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex items-center hover:shadow-md transition-all hover:border-[var(--primary)]/30"
          >
            <div className="p-3 bg-[var(--accent)]/10 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Buildings</h3>
              <p className="text-[var(--muted)] text-sm">Browse campus buildings</p>
            </div>
          </Link>
          
          <Link
            href="/bookings"
            className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex items-center hover:shadow-md transition-all hover:border-[var(--primary)]/30"
          >
            <div className="p-3 bg-[var(--success)]/10 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-[var(--success)]" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">My Bookings</h3>
              <p className="text-[var(--muted)] text-sm">Manage your reservations</p>
            </div>
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex items-center hover:shadow-md transition-all hover:border-[var(--primary)]/30"
          >
            <div className="p-3 bg-[var(--warning)]/10 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-[var(--warning)]" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Refresh</h3>
              <p className="text-[var(--muted)] text-sm">Update your dashboard</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 