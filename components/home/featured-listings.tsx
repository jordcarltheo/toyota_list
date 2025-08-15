"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Car, MapPin, Calendar, Gauge } from 'lucide-react'

interface ListingPhoto {
  id: string
  listing_id: string
  path: string
  width: number
  height: number
  sort_order: number
  created_at: string
}

interface Profile {
  id: string
  full_name: string
  role: string
  created_at: string
}

interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  make: string
  model: string
  year: number
  mileage: number
  condition: string
  body_type: string
  drivetrain: string
  transmission: string
  fuel: string
  location_city: string
  location_state: string
  location_country: string
  postal_code?: string
  featured: boolean
  status: string
  created_at: string
  updated_at: string
  listing_photos: ListingPhoto[]
  profiles: Profile
}

interface FeaturedListingsProps {
  listings: Listing[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  if (!listings || listings.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Listings
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
              No listings found for the selected country
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Listings
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Discover some of our best Toyota vehicles currently available across North America
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`} className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={listing.listing_photos[0]?.path || '/placeholder-car.jpg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="mb-2 flex items-center gap-1">
                  <span className="inline-block h-2 w-4 rounded-sm bg-trd-red" />
                  <span className="inline-block h-2 w-4 rounded-sm bg-trd-orange" />
                  <span className="inline-block h-2 w-4 rounded-sm bg-trd-yellow" />
                </div>
                <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(listing.price)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{listing.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4" />
                    <span>{formatMileage(listing.mileage)} miles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location_city}, {listing.location_state} ({listing.location_country})</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <Link href={`/listings/${listing.id}#contact`}>
                    <Button variant="outline">Contact</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
              </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/search">
            <Button size="lg" className="px-8 py-3">
              View All Listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
