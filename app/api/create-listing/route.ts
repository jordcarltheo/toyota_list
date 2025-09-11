import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create the listing using service role (bypasses RLS)
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        user_id: body.userId || crypto.randomUUID(),
        title: body.title,
        description: body.description,
        price: body.price,
        make: 'Toyota',
        model: body.model,
        year: body.year,
        mileage: body.mileage,
        condition: body.condition,
        body_type: body.body_type,
        drivetrain: body.drivetrain,
        transmission: body.transmission,
        fuel: body.fuel,
        location_city: body.city,
        location_state: body.state,
        location_country: body.country,
        postal_code: body.postalCode,
        vin: body.vin,
        status: 'draft'
      })
      .select()
      .single()

    if (listingError) {
      return NextResponse.json({ error: listingError.message }, { status: 400 })
    }

    // Create contact record
    if (body.contactEmail || body.contactPhone) {
      await supabase
        .from('listing_contacts')
        .insert({
          listing_id: listing.id,
          phone: body.contactPhone,
          email: body.contactEmail
        })
    }

    // Create verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    await supabase
      .from('listing_verification_tokens')
      .insert({
        listing_id: listing.id,
        token: verificationToken,
        expires_at: expiresAt.toISOString()
      })

    return NextResponse.json({ 
      success: true, 
      listing,
      verificationToken 
    })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
