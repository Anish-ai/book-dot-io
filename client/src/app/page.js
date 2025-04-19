// src/app/page.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/utils/api';
import { useAuth } from '@/app/context/AuthProvider';
import { BuildingOfficeIcon, CalendarDaysIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import RoomCard from '@/app/components/ui/RoomCard';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6">
              Welcome to Smart Campus
            </h1>
            <p className="text-xl mb-8">
              Book rooms, manage schedules, and explore campus facilities
            </p>
            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Link href="/auth/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                  Sign In
                </Link>
                <Link href="/auth/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campus Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            Campus Buildings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Link 
                key={building.buildingId} 
                href={`/buildings/${building.buildingId}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Building {building.buildingId}</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{building.floors} Floors</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            Available Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard 
                key={room.roomId}
                room={room}
                bookings={bookings.filter(b => b.roomId === room.roomId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div 
                key={booking.requestId}
                className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.description}</h3>
                    <p className="text-gray-600">{booking.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 inline-block mr-1" />
                      {new Date(booking.startDate).toLocaleDateString()} - {' '}
                      {new Date(booking.endDate).toLocaleTimeString()}
                    </p>
                    <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      Room {booking.roomId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/bookings" 
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
            >
              View All Bookings
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}