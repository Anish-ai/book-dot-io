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
        <LoadingSpinner className="h-12 w-12 text-[var(--primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--error-bg)] text-[var(--error)] p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white py-20">
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
                className="group hover-card"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Building #{building.buildingId}</h3>
                      <p className="text-[var(--muted)]">{building.floors || 'N/A'} Floors</p>
                    </div>
                    <div className="bg-[var(--primary-hover)/10] p-3 rounded-full group-hover:bg-[var(--primary-hover)/20] transition-colors">
                      <BuildingOfficeIcon className="h-8 w-8 text-[var(--primary)]" />
                    </div>
                  </div>

                  <div className="flex items-center text-[var(--muted)]">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Rooms: {building.rooms?.length || '0'}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[var(--primary)] font-medium">View Details →</span>
                    <div className="text-[var(--muted)]">
                      {building.departments?.length || '0'} Departments
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {buildings.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[var(--muted)]">No buildings found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}