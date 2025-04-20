// src/app/page.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/utils/api';
import { useAuth } from '@/app/context/AuthProvider';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  ClockIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import RoomCard from '@/app/components/ui/RoomCard';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBuildings: 0,
    totalBookings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, roomsRes, bookingsRes] = await Promise.all([
          api.get('/buildings'),
          api.get('/rooms'),
          api.get('/bookings')
        ]);
        
        setBuildings(buildingsRes.data);
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
        
        setStats({
          totalRooms: roomsRes.data.length,
          totalBuildings: buildingsRes.data.length,
          totalBookings: bookingsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to show loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-64 bg-[var(--card)] rounded-xl mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
        <div className="h-24 bg-[var(--card)] rounded-xl"></div>
      </div>
      <div className="h-10 bg-[var(--card)] rounded-full w-60 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-[var(--card)] rounded-xl"></div>
        <div className="h-64 bg-[var(--card)] rounded-xl"></div>
        <div className="h-64 bg-[var(--card)] rounded-xl"></div>
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="relative hero-gradient hero-pattern py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 animate-fadeInDown">
              Welcome to <span className="relative inline-block">
                Smart Campus
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full"></span>
              </span>
            </h1>
            <p className="text-xl mb-8 md:max-w-2xl mx-auto opacity-90 animate-fadeInUp delay-200">
              Book rooms, manage schedules, and explore campus facilities all in one place
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-400">
                <Link 
                  href="/auth/login" 
                  className="bg-white text-[var(--primary)] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-lg flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white/10 rounded-full blur-md animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[var(--card)] py-12 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stats-card flex items-center animate-fadeInUp delay-100">
              <div className="p-4 bg-[var(--primary)]/10 rounded-xl">
                <BuildingOfficeIcon className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.totalBuildings}</div>
                <div className="stats-label">Buildings</div>
              </div>
            </div>
            <div className="stats-card flex items-center animate-fadeInUp delay-200">
              <div className="p-4 bg-[var(--accent)]/10 rounded-xl">
                <BookOpenIcon className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.totalRooms}</div>
                <div className="stats-label">Rooms</div>
              </div>
            </div>
            <div className="stats-card flex items-center animate-fadeInUp delay-300">
              <div className="p-4 bg-[var(--success)]/10 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-[var(--success)]" />
              </div>
              <div className="ml-4">
                <div className="stats-value">{stats.totalBookings}</div>
                <div className="stats-label">Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-12 animate-fadeIn">
            <BuildingOfficeIcon className="h-8 w-8 text-[var(--primary)]" />
            Why Choose Book.io?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card animate-fadeInUp delay-100">
              <div className="p-4 bg-[var(--primary)]/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ClockIcon className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-[var(--muted)]">Find and book available rooms in just a few clicks. No more complicated processes or paperwork.</p>
            </div>
            
            <div className="feature-card animate-fadeInUp delay-200">
              <div className="p-4 bg-[var(--accent)]/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <UserGroupIcon className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Capacity Management</h3>
              <p className="text-[var(--muted)]">Find the perfect size room for your needs, from small meetings to large events.</p>
            </div>
            
            <div className="feature-card animate-fadeInUp delay-300">
              <div className="p-4 bg-[var(--success)]/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <MapPinIcon className="h-8 w-8 text-[var(--success)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Building Explorer</h3>
              <p className="text-[var(--muted)]">Navigate through campus buildings and discover the perfect location for your activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Buildings */}
      <section className="py-16 bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading mb-0 animate-fadeIn">
              <BuildingOfficeIcon className="h-8 w-8 text-[var(--primary)]" />
              Campus Buildings
            </h2>
            <Link 
              href="/buildings" 
              className="btn-outline animate-fadeIn"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.slice(0, 3).map((building, index) => (
              <Link 
                key={building.buildingId} 
                href={`/buildings/${building.buildingId}`}
                className="hover-card group animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-[var(--primary)] transition-colors">
                      Building {building.buildingName || `#${building.buildingId}`}
                    </h3>
                    <div className="bg-[var(--primary-hover)]/10 p-3 rounded-full group-hover:bg-[var(--primary-hover)]/20 transition-colors">
                      <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                  </div>

                  <div className="flex items-center text-[var(--muted)] mb-2">
                    <MapPinIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
                    <span className="text-sm">{building.floors || 'N/A'} Floors</span>
                  </div>
                  
                  <div className="flex items-center text-[var(--muted)]">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-[var(--primary)]" />
                    <span className="text-sm">Rooms: {building.rooms?.length || rooms.filter(r => r.buildingId === building.buildingId).length || '0'}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-end text-sm group-hover:translate-x-1 transition-transform">
                    <span className="text-[var(--primary)] font-medium flex items-center">
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading mb-0 animate-fadeIn">
              <BookOpenIcon className="h-8 w-8 text-[var(--primary)]" />
              Available Rooms
            </h2>
            <Link 
              href="/rooms" 
              className="btn-outline animate-fadeIn"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 3).map((room, index) => (
              <div 
                key={room.roomId} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoomCard 
                  room={room}
                  bookings={bookings.filter(b => b.roomId === room.roomId)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading mb-0 animate-fadeIn">
              <CalendarDaysIcon className="h-8 w-8 text-[var(--primary)]" />
              Upcoming Events
            </h2>
            <Link 
              href="/bookings" 
              className="btn-outline animate-fadeIn"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {bookings.slice(0, 4).map((booking, index) => (
              <div 
                key={booking.requestId}
                className="glass-card p-5 rounded-lg animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <div className="badge badge-primary">
                        {booking.status || 'Scheduled'}
                      </div>
                      <h3 className="text-lg font-semibold">{booking.title || booking.description}</h3>
                    </div>
                    <p className="text-[var(--muted)] mt-1">{booking.description}</p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <div className="flex items-center text-sm text-[var(--muted)] mb-1.5">
                      <ClockIcon className="h-4 w-4 mr-1.5 text-[var(--primary)]" />
                      {new Date(booking.startDate).toLocaleDateString()} - {' '}
                      {new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex items-center text-sm text-[var(--muted)]">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1.5 text-[var(--primary)]" />
                      Room #{booking.roomId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {bookings.length === 0 && (
              <div className="text-center py-10">
                <CalendarDaysIcon className="h-16 w-16 mx-auto text-[var(--muted)]/30 mb-4" />
                <p className="text-[var(--muted)]">No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fadeIn">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto text-xl opacity-90 mb-8 animate-fadeInUp delay-100">
            Join Book.io today and start managing your room bookings efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-200">
            <Link href="/auth/register" className="btn-primary bg-white text-[var(--primary)] hover:bg-opacity-90">
              Create Account
            </Link>
            <Link href="/rooms" className="btn-outline border-white text-white hover:bg-white hover:text-[var(--primary)]">
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}