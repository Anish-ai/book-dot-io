'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ArrowLeftOnRectangleIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  BookOpenIcon, 
  HomeIcon, 
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update scroll state for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Buildings', href: '/buildings', icon: BuildingOfficeIcon },
    { name: 'Rooms', href: '/rooms', icon: BookOpenIcon },
    { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  ];

  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--card)]/95 backdrop-blur-lg shadow-md' 
          : 'bg-[var(--card)] border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold gradient-text flex items-center"
            >
              <BookOpenIcon className="h-7 w-7 mr-2" />
              <span className="animate-fadeIn">Book.io</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item flex items-center ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5 mr-1.5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Theme toggle and auth */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  {user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-[var(--error)] hover:text-[var(--error-light)]"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="btn-ghost"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[var(--foreground)] hover:bg-[var(--background-hover)]"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out absolute w-full bg-[var(--card)] border-b border-[var(--border)] shadow-lg ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
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
          
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-[var(--foreground)] hover:bg-[var(--background-hover)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircleIcon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center text-[var(--error)] hover:bg-[var(--background-hover)]"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
              <Link
                href="/auth/login"
                className="block w-full px-3 py-2 text-center rounded-md text-base font-medium text-[var(--foreground)] hover:bg-[var(--background-hover)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="block w-full px-3 py-2 text-center rounded-md text-base font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 