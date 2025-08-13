import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const toyotaModels = [
  'Camry', 'Corolla', 'Avalon', 'Prius', 'RAV4', 'Highlander', 
  '4Runner', 'Tacoma', 'Tundra', 'Sienna', 'C-HR', 'Venza'
]

const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Wagon', 'Coupe']
const conditions = ['Excellent', 'Good', 'Fair', 'Project']
const drivetrains = ['FWD', 'RWD', 'AWD', '4WD']
const transmissions = ['Auto', 'Manual']
const fuels = ['Gas', 'Hybrid', 'EV']

const phoenixAreas = [
  'Phoenix', 'Scottsdale', 'Mesa', 'Gilbert', 'Chandler', 
  'Tempe', 'Peoria', 'Surprise', 'Glendale', 'Avondale'
]

const COUNTRIES = ['US', 'CA', 'MX']

const samplePhotos = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800&h=600&fit=crop'
]

const sampleNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'William Garcia', 'Amanda Rodriguez'
]

async function createProfiles() {
  console.log('Creating profiles...')
  
  const profiles = []
  for (let i = 0; i < 10; i++) {
    profiles.push({
      id: `user-${i + 1}`,
      full_name: sampleNames[i],
      role: i === 0 ? 'admin' : 'user' // First user is admin
    })
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(profiles, { onConflict: 'id' })

  if (error) {
    console.error('Error creating profiles:', error)
    throw error
  }

  console.log('✅ Profiles created successfully')
  return profiles
}

async function createListings(profiles: any[]) {
  console.log('Creating listings...')
  
  const listings = []
  const listingPhotos = []
  
  for (let i = 0; i < 25; i++) {
    const year = Math.floor(Math.random() * 10) + 2015 // 2015-2024
    const mileage = Math.floor(Math.random() * 100000) + 10000 // 10k-110k
    const price = Math.floor(Math.random() * 30000) + 15000 // $15k-$45k
    
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    const listing = {
      id: `listing-${i + 1}`,
      user_id: profiles[Math.floor(Math.random() * profiles.length)].id,
      title: `${year} Toyota ${toyotaModels[Math.floor(Math.random() * toyotaModels.length)]}`,
      description: `Great condition ${year} Toyota with ${mileage.toLocaleString()} miles. Well maintained, clean title.`,
      price: price * 100, // Convert to cents
      make: 'Toyota',
      model: toyotaModels[Math.floor(Math.random() * toyotaModels.length)],
      year,
      mileage,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      body_type: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      drivetrain: drivetrains[Math.floor(Math.random() * drivetrains.length)],
      transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
      fuel: fuels[Math.floor(Math.random() * fuels.length)],
      location_city: phoenixAreas[Math.floor(Math.random() * phoenixAreas.length)],
      location_state: 'AZ',
      location_country: country,
      postal_code: Math.random() > 0.5 ? `${Math.floor(Math.random() * 99999) + 10000}` : null,
      featured: Math.random() > 0.8, // 20% chance of being featured
      status: 'active'
    }
    
    listings.push(listing)
    
    // Create 2-4 photos for each listing
    const photoCount = Math.floor(Math.random() * 3) + 2
    for (let j = 0; j < photoCount; j++) {
      listingPhotos.push({
        id: `photo-${i + 1}-${j + 1}`,
        listing_id: listing.id,
        path: samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
        width: 800,
        height: 600,
        sort_order: j
      })
    }
  }

  // Insert listings
  const { error: listingsError } = await supabase
    .from('listings')
    .upsert(listings, { onConflict: 'id' })

  if (listingsError) {
    console.error('Error creating listings:', listingsError)
    throw listingsError
  }

  // Insert photos
  const { error: photosError } = await supabase
    .from('listing_photos')
    .upsert(listingPhotos, { onConflict: 'id' })

  if (photosError) {
    console.error('Error creating listing photos:', photosError)
    throw photosError
  }

  console.log('✅ Listings and photos created successfully')
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Create profiles first
    const profiles = await createProfiles()
    
    // Create listings and photos
    await createListings(profiles)
    
    console.log('🎉 Database seeding completed successfully!')
    console.log(`Created ${profiles.length} profiles and 25 listings with photos`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
