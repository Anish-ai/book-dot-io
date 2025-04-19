// src/middleware.js
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/utils/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const role = localStorage.getItem('role');
    if (!isAuthenticated() || role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect user routes
  if (pathname.startsWith('/bookings')) {
    if (!isAuthenticated()) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}