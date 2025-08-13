"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Car, MapPin, Calendar, Gauge, Star } from 'lucide-react'
import type { ListingWithPhotos } from '@/types/database'

interface SearchResultsProps {
  filters: any
}

export function SearchResults({ filters }: SearchResultsProps) {
  const [listings, setListings] = useState<ListingWithPhotos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        // This would be replaced with actual API call using filters
        // For now, we'll use mock data
        const mockListings: ListingWithPhotos[] = [
          {
            id: '1',
            user_id: 'user1',
            title: '2019 Toyota Camry XSE',
            description: 'Excellent condition, low mileage, one owner',
            price: 25000,
            make: 'Toyota',
            model: 'Camry',
            year: 2019,
            mileage: 35000,
            condition: 'Excellent',
            body_type: 'Sedan',
            drivetrain: 'FWD',
            transmission: 'Auto',
            fuel: 'Gas',
            location_city: 'Phoenix',
            location_state: 'AZ',
            location_country: 'US',
            featured: true,
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            photos: [
              {
                id: 'photo1',
                listing_id: '1',
                path: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
                width: 400,
                height: 300,
                sort_order: 0,
                created_at: '2024-01-01T00:00:00Z'
              }
            ],
            seller: {
              id: 'user1',
              full_name: 'John Doe',
              role: 'user',
              created_at: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: '2',
            user_id: 'user2',
            title: '2021 Toyota Tacoma TRD Off-Road',
            description: '4x4, excellent condition, adventure ready',
            price: 42000,
            make: 'Toyota',
            model: 'Tacoma',
            year: 2021,
            mileage: 28000,
            condition: 'Excellent',
            body_type: 'Truck',
            drivetrain: '4WD',
            transmission: 'Auto',
            fuel: 'Gas',
            location_city: 'Phoenix',
            location_state: 'AZ',
            location_country: 'US',
            featured: false,
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            photos: [
              {
                id: 'photo2',
                listing_id: '2',
                path: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                width: 400,
                height: 300,
                sort_order: 0,
                created_at: '2024-01-01T00:00:00Z'
              }
            ],
            seller: {
              id: 'user2',
              full_name: 'Jane Smith',
              role: 'user',
              created_at: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: '3',
            user_id: 'user3',
            title: '2020 Toyota RAV4 Hybrid XLE',
            description: 'Great fuel economy, perfect for families',
            price: 32000,
            make: 'Toyota',
            model: 'RAV4',
            year: 2020,
            mileage: 42000,
            condition: 'Good',
            body_type: 'SUV',
            drivetrain: 'AWD',
            transmission: 'Auto',
            fuel: 'Hybrid',
            location_city: 'Phoenix',
            location_state: 'AZ',
            location_country: 'US',
            featured: false,
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            photos: [
              {
                id: 'photo3',
                listing_id: '3',
                path: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
                width: 400,
                height: 300,
                sort_order: 0,
                created_at: '2024-01-01T00:00:00Z'
              }
            ],
            seller: {
              id: 'user3',
              full_name: 'Mike Johnson',
              role: 'user',
              created_at: '2024-01-01T00:00:00Z'
            }
          }
        ]
        
        // Apply filters (mock implementation)
        let filteredListings = mockListings
        
        if (filters.model) {
          filteredListings = filteredListings.filter(l => l.model === filters.model)
        }
        if (filters.year_min) {
          filteredListings = filteredListings.filter(l => l.year >= parseInt(filters.year_min))
        }
        if (filters.year_max) {
          filteredListings = filteredListings.filter(l => l.year <= parseInt(filters.year_max))
        }
        if (filters.price_min) {
          filteredListings = filteredListings.filter(l => l.price >= parseInt(filters.price_min) * 100)
        }
        if (filters.price_max) {
          filteredListings = filteredListings.filter(l => l.price <= parseInt(filters.price_max) * 100)
        }
        if (filters.mileage_max) {
          filteredListings = filteredListings.filter(l => l.mileage <= parseInt(filters.mileage_max))
        }
        if (filters.body_type) {
          filteredListings = filteredListings.filter(l => l.body_type === filters.body_type)
        }
        if (filters.condition) {
          filteredListings = filteredListings.filter(l => l.condition === filters.condition)
        }
        if (filters.location_country) {
          filteredListings = filteredListings.filter(l => l.location_country === filters.location_country)
        }
        if (filters.location_state) {
          filteredListings = filteredListings.filter(l => l.location_state === filters.location_state)
        }
        if (filters.location_city) {
          filteredListings = filteredListings.filter(l => l.location_city.toLowerCase().includes(filters.location_city.toLowerCase()))
        }
        
        setListings(filteredListings)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching listings:', error)
        setLoading(false)
      }
    }

    fetchListings()
  }, [filters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for vehicles...</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or check back later for new listings.
        </p>
        <Link href="/sell">
          <Button variant="outline">
            List Your Toyota
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {listings.length} vehicle{listings.length !== 1 ? 's' : ''} found
        </h2>
      </div>

      <div className="space-y-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image */}
              <div className="md:col-span-1">
                <div className="aspect-video bg-gray-200 overflow-hidden rounded-lg">
                  <img
                    src={listing.photos[0]?.path || '/placeholder-car.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-2 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{listing.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Gauge className="h-4 w-4" />
                        <span>{formatMileage(listing.mileage)} miles</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location_city}, {listing.location_state} ({listing.location_country})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(listing.price)}
                    </div>
                    {listing.featured && (
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{listing.condition}</Badge>
                  <Badge variant="outline">{listing.body_type}</Badge>
                  <Badge variant="outline">{listing.drivetrain}</Badge>
                  <Badge variant="outline">{listing.transmission}</Badge>
                  <Badge variant="outline">{listing.fuel}</Badge>
                </div>

                <div className="flex space-x-3">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <Link href={`/listings/${listing.id}#contact`}>
                    <Button variant="outline">Contact Seller</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
