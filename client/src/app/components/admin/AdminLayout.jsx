'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/utils/auth';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UsersIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';

export default function AdminLayout({ children, title }) {
  const [deptId, setDeptId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setDeptId(localStorage.getItem('deptId'));
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const navItems = [
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon },
    { name: 'Buildings', href: '/admin/buildings', icon: BuildingOfficeIcon },
    { name: 'Departments', href: '/admin/departments', icon: UsersIcon },
    { name: 'Rooms', href: '/admin/rooms', icon: BookOpenIcon },
    { name: 'Schedules', href: '/admin/schedules', icon: ChartBarIcon },
    { name: 'Users', href: '/admin/users', icon: UserCircleIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-[var(--card)] border-r border-[var(--border)] flex-shrink-0 transition-all duration-300 animate-slideInLeft">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Admin Portal</h2>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${isActive(item.href) 
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium' 
                    : 'text-[var(--foreground)] hover:bg-[var(--background-hover)]'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t border-[var(--border)]">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-3 text-[var(--error)] hover:bg-[var(--error)]/5 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-[var(--foreground)] hover:bg-[var(--background-hover)]"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Page title */}
              {title && (
                <h1 className="text-xl font-bold hidden md:block">{title}</h1>
              )}
              
              <div className="flex items-center gap-2 text-sm bg-[var(--background)] px-3 py-1.5 rounded-lg">
                <span className="font-medium text-[var(--muted)]">Department:</span>
                <span className="text-[var(--foreground)] font-mono">
                  {deptId || 'Loading...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out absolute z-30 w-full bg-[var(--card)] border-b border-[var(--border)] shadow-lg ${
            isMobileMenuOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`block p-3 rounded-md text-base font-medium flex items-center ${
                  isActive(item.href)
                    ? 'text-[var(--primary)] bg-[var(--primary-light)]/10'
                    : 'text-[var(--foreground)] hover:bg-[var(--background-hover)]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block p-3 rounded-md text-base font-medium flex items-center text-[var(--error)] hover:bg-[var(--background-hover)]"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              Log Out
            </button>
          </div>
        </div>

        {/* Page title for mobile */}
        {title && (
          <div className="md:hidden p-4 pb-0">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        )}

        <main className="p-4 sm:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 