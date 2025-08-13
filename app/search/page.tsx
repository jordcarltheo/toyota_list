"use client"

import { useState, useEffect, Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { useSearchParams } from 'next/navigation'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    model: searchParams.get('model') || '',
    year_min: searchParams.get('year_min') || '',
    year_max: searchParams.get('year_max') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    mileage_max: searchParams.get('mileage_max') || '',
    body_type: searchParams.get('body_type') || '',
    drivetrain: searchParams.get('drivetrain') || '',
    transmission: searchParams.get('transmission') || '',
    fuel: searchParams.get('fuel') || '',
    condition: searchParams.get('condition') || '',
    location_city: searchParams.get('location_city') || '',
    location_state: searchParams.get('location_state') || '',
    location_country: searchParams.get('location_country') || ''
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Search Toyota Vehicles</h1>
            <p className="text-gray-600 mt-2">
              Find your perfect Toyota across the U.S., Canada, and Mexico
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SearchFilters filters={filters} setFilters={setFilters} />
            </div>
            <div className="lg:col-span-3">
              <SearchResults filters={filters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
