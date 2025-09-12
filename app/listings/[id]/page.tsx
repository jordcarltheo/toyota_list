import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface ListingPhoto {
  id: string
  path: string
  width: number
  height: number
  sort_order: number
}

interface ListingPageProps {
  params: { id: string }
}

interface ListingPageProps {
  params: { id: string }
}

export default async function ListingPage({ params }: ListingPageProps) {
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    notFound()
  }

  let listing: any = null

  try {
    const supabase = supabaseServer()
    
    // Fetch the listing with profile, contact info, and photos
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles!listings_user_id_fkey (
          full_name
        ),
        listing_photos (
          id,
          path,
          width,
          height,
          sort_order
        )
      `)
      .eq('id', params.id)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      notFound()
    }

    listing = data

  } catch (error) {
    console.error('Error fetching listing:', error)
    notFound()
  }

  // Format price from cents to dollars
  const priceInDollars = (listing.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  // Format mileage
  const formattedMileage = listing.mileage?.toLocaleString() || 'N/A'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </nav>

      {/* Main Listing Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {listing.title}
              </CardTitle>
              <p className="text-2xl font-semibold text-green-600 mt-2">
                {priceInDollars}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {listing.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Photo Section */}
          {listing.listing_photos && listing.listing_photos.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listing.listing_photos
                  .sort((a: ListingPhoto, b: ListingPhoto) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((photo: ListingPhoto) => (
                    <div key={photo.id} className="relative group">
                                              <img
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-photos/${photo.path}`}
                          alt={`Vehicle photo`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                          }}
                        />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="text-gray-500 text-lg">
                📸 No photos uploaded yet
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Photos will appear here once uploaded by the seller
              </p>
            </div>
          )}

          {/* Vehicle Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{listing.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{listing.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">{formattedMileage} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <Badge variant="outline">{listing.condition}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Type:</span>
                  <span className="font-medium">{listing.body_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drivetrain:</span>
                  <span className="font-medium">{listing.drivetrain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission:</span>
                  <span className="font-medium">{listing.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{listing.fuel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium">{listing.location_city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State/Province:</span>
                  <span className="font-medium">{listing.location_state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <Badge variant="outline">{listing.location_country}</Badge>
                </div>
                {listing.postal_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Postal Code:</span>
                    <span className="font-medium">{listing.postal_code}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Contact Information - Hidden for now */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Contact Information</h3>
            </div>
            <p className="text-blue-800 text-sm">
              Seller contact details are protected and will be revealed after payment verification.
              This ensures a secure marketplace experience for both buyers and sellers.
            </p>
            <div className="mt-3">
              <Button disabled className="bg-blue-600 hover:bg-blue-700">
                Contact Seller (Payment Required)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/sell">
          <Button className="w-full sm:w-auto">
            List Your Toyota
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" className="w-full sm:w-auto">
            Browse More Listings
          </Button>
        </Link>
      </div>
    </div>
  )
}
