export interface Profile {
  id: string
  full_name: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  make: string
  model: string
  year: number
  mileage: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Project'
  body_type: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other'
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD' | 'Unknown'
  transmission: 'Auto' | 'Manual' | 'Unknown'
  fuel: 'Gas' | 'Diesel' | 'Hybrid' | 'EV' | 'Other'
  location_city: string
  location_state: string
  location_country: 'US' | 'CA' | 'MX'
  postal_code?: string
  lat?: number
  lng?: number
  featured: boolean
  status: 'draft' | 'active' | 'pending_sale' | 'sold' | 'archived'
  created_at: string
  updated_at: string
}

export interface ListingPhoto {
  id: string
  listing_id: string
  path: string
  width: number
  height: number
  sort_order: number
  created_at: string
}

export interface ListingContact {
  id: string
  listing_id: string
  phone?: string
  email: string
  created_at: string
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
}

export interface Order {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  stripe_payment_intent_id: string
  amount: number
  status: 'initiated' | 'paid' | 'cancelled' | 'refunded'
  created_at: string
}

export interface Payment {
  id: string
  listing_id: string
  payer_id: string
  stripe_checkout_id: string
  amount: number
  status: 'initiated' | 'paid' | 'cancelled' | 'refunded'
  created_at: string
}

export interface ListingWithPhotos extends Listing {
  photos: ListingPhoto[]
  seller: Profile
}

export interface ListingWithDetails extends ListingWithPhotos {
  messages: Message[]
  orders: Order[]
  payments: Payment[]
}
