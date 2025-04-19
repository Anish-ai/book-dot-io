// src/app/(admin)/layout.js
"use client";

import AdminLayout from '@/app/components/admin/AdminLayout';

export default function RootAdminLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}