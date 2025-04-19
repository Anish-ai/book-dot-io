"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/app/utils/api';
import { BuildingOfficeIcon, MapPinIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthProvider';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function BuildingsPage() {
  const { isAuthenticated } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await api.get('/buildings');
        setBuildings(response.data);
      } catch (err) {
        setError('Failed to load buildings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 flex items-center justify-center gap-4">
              <BuildingLibraryIcon className="h-12 w-12" />
              Campus Buildings
            </h1>
            <p className="text-xl mb-8">
              Explore our campus facilities and discover available spaces
            </p>
          </div>
        </div>
      </div>

      {/* Buildings Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Link
                key={building.buildingId}
                href={`/buildings/${building.buildingId}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Building #{building.buildingId}</h3>
                      <p className="text-gray-600">{building.floors || 'N/A'} Floors</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                      <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Rooms: {building.rooms?.length || '0'}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-blue-600 font-medium">View Details →</span>
                    <div className="text-gray-500">
                      {building.departments?.length || '0'} Departments
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {buildings.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No buildings found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}