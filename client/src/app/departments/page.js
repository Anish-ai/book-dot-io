// src/app/departments/page.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/utils/api';
import { BuildingOfficeIcon, UserGroupIcon, IdentificationIcon, UsersIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/admin/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
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
              Campus Departments
            </h1>
            <p className="text-xl mb-8">
              Explore academic departments and their resources
            </p>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <Link 
                key={department.deptId}
                href={`/departments/${department.deptId}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{department.name}</h3>
                      <p className="text-gray-600">Department ID: {department.deptId}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      #{department.buildingId}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      Building: {department.buildingId}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IdentificationIcon className="h-5 w-5 mr-2" />
                      Admins: {department.admins?.length || 0}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="h-5 w-5 mr-2" />
                      Users: {department.users?.length || 0}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    View Department Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {departments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No departments found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}