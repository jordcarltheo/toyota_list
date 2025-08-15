import { Hero } from '@/components/home/hero'
import { FeaturedListings } from '@/components/home/featured-listings'
import { Categories } from '@/components/home/categories'
import { HowItWorks } from '@/components/home/how-it-works'
import TRDBanner from '@/components/TRDBanner'
import { supabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

// Force dynamic rendering to avoid static generation issues with cookies
export const dynamic = 'force-dynamic'

export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: { country?: string } 
}) {
  let listings = []
  let selected = 'ALL'
  
  try {
    const supabase = supabaseServer()
    selected = (searchParams?.country || 'ALL').toUpperCase()

    let query = supabase
      .from('listings')
      .select(`
        *,
        listing_photos(path, width, height, sort_order),
        profiles!listings_user_id_fkey(id, full_name, role, created_at)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(24)

    // Apply country filter if column exists
    if (selected !== 'ALL') {
      query = query.eq('location_country', selected)
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching listings:', error)
      listings = []
    } else {
      listings = data || []
    }
  } catch (error) {
    console.error('Error in HomePage:', error)
    listings = []
  }

  return (
    <div className="space-y-10">
      <Hero />
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <TRDBanner />
      </div>
      
      {/* Country Filter */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <form method="GET" className="flex items-center gap-2 justify-center">
          <label htmlFor="country" className="text-sm text-neutral-600">Country:</label>
          <select
            id="country"
            name="country"
            defaultValue={selected}
            className="rounded border p-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="US">US</option>
            <option value="CA">CA</option>
            <option value="MX">MX</option>
          </select>
          <button type="submit" className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Apply
          </button>
        </form>
      </div>

      <FeaturedListings listings={listings} />
      <Categories />
      <HowItWorks />
    </div>
  )
}
