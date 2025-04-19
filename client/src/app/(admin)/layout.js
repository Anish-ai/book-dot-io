// src/app/(admin)/layout.js
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from '@/app/utils/auth';
import { BuildingOfficeIcon, CalendarIcon, UsersIcon, BookOpenIcon, ChartBarIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const [deptId, setDeptId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDeptId(localStorage.getItem('deptId'));
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Added flex-shrink-0 and explicit width */}
      <aside className="w-64 flex-shrink-0 fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link href="/admin/bookings" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              <CalendarIcon className="h-5 w-5" />
              Bookings
            </Link>
            <Link href="/admin/buildings" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              <BuildingOfficeIcon className="h-5 w-5" />
              Buildings
            </Link>
            <Link href="/admin/departments" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              <UsersIcon className="h-5 w-5" />
              Departments
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              <BookOpenIcon className="h-5 w-5" />
              Rooms
            </Link>
            <Link href="/admin/schedules" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              <ChartBarIcon className="h-5 w-5" />
              Schedules
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0"> {/* Added min-w-0 to prevent overflow */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Department ID:</span>
              <span className="bg-gray-100 px-2 py-1 rounded-md">
                {deptId || 'Loading...'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-7xl mx-auto"> {/* Added container constraint */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}