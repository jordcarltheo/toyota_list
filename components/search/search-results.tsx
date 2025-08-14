"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Car, MapPin, Calendar, Gauge, Star } from 'lucide-react'
import type { ListingWithPhotos } from '@/types/database'
import { createBrowserSupabaseClient } from '@/lib/supabase'

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
        const supabase = createBrowserSupabaseClient()
        
        let query = supabase
          .from('listings')
          .select(`
            *,
            listing_photos(path, width, height, sort_order),
            profiles!listings_user_id_fkey(id, full_name, role, created_at)
          `)
          .eq('status', 'active')

        // Apply filters
        if (filters.location_country) {
          query = query.eq('location_country', filters.location_country)
        }
        if (filters.location_state) {
          query = query.eq('location_state', filters.location_state)
        }
        if (filters.location_city) {
          query = query.ilike('location_city', `%${filters.location_city}%`)
        }
        if (filters.make) {
          query = query.eq('make', filters.make)
        }
        if (filters.model) {
          query = query.eq('model', filters.model)
        }
        if (filters.min_price) {
          query = query.gte('price', filters.min_price)
        }
        if (filters.max_price) {
          query = query.lte('price', filters.max_price)
        }
        if (filters.min_year) {
          query = query.gte('year', filters.min_year)
        }
        if (filters.max_year) {
          query = query.lte('year', filters.max_year)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching listings:', error)
          setListings([])
        } else {
          // Transform the data to match our interface
          const transformedListings: ListingWithPhotos[] = (data || []).map(listing => ({
            ...listing,
            photos: listing.listing_photos || [],
            seller: listing.profiles || { id: '', full_name: 'Unknown', role: 'user', created_at: '' }
          }))
          setListings(transformedListings)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [filters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading listings...</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={listing.photos[0]?.path || '/placeholder-car.jpg'}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            {listing.featured && (
              <Badge className="absolute top-2 right-2 bg-amber-500">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(listing.price)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{listing.location_city}, {listing.location_state} ({listing.location_country})</span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{listing.year}</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                <span>{formatMileage(listing.mileage)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{listing.condition}</Badge>
              <Badge variant="secondary">{listing.body_type}</Badge>
              <Badge variant="secondary">{listing.transmission}</Badge>
            </div>
            
            <div className="pt-2">
              <Link href={`/listings/${listing.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
