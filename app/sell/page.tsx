"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X } from 'lucide-react'

export default function SellPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    trim: '',
    model: '',
    price: 25000, // Price in dollars, not cents
    description: '',
    mileage: 50000,
    condition: 'Good' as 'Excellent' | 'Good' | 'Fair' | 'Project',
    body_type: 'Sedan' as 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other',
    drivetrain: 'FWD' as 'FWD' | 'RWD' | 'AWD' | '4WD' | 'Unknown',
    transmission: 'Auto' as 'Auto' | 'Manual' | 'Unknown',
    fuel: 'Gas' as 'Gas' | 'Diesel' | 'Hybrid' | 'EV' | 'Other',
    city: '',
    state: '',
    postalCode: '',
    country: 'US' as 'US' | 'CA' | 'MX',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    hasAccident: false,
    isCleanTitle: true,
    hasMaintenanceRecords: false,
    isCertified: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 10)) // Max 10 photos
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      
      // Generate a proper UUID for anonymous listings
      const tempUserId = crypto.randomUUID()

      // Create a profile entry for the anonymous user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: tempUserId,
          // Only include basic fields that should exist
          // full_name: form.contactName, // Comment out if column doesn't exist
          // email: form.contactEmail,    // Comment out if column doesn't exist
          // role: 'user',                // Comment out if column doesn't exist
          // created_at: new Date().toISOString() // Comment out if column doesn't exist
        })

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating profile:', profileError)
        alert('Error creating listing. Please try again.')
        return
      }

      // Auto-generate title from year + trim + model
      const autoTitle = `${form.year} Toyota ${form.trim} ${form.model}`.trim()

      // Create listing
      const { data, error } = await supabase
        .from('listings')
        .insert({
          user_id: tempUserId,
          title: autoTitle,
          model: form.model,
          year: form.year,
          price: form.price * 100, // Convert dollars to cents for database
          description: `${form.description}\n\nVehicle Details:\n- Condition: ${form.condition}\n- Body Type: ${form.body_type}\n- Drivetrain: ${form.drivetrain}\n- Transmission: ${form.transmission}\n- Fuel: ${form.fuel}\n- Mileage: ${form.mileage.toLocaleString()} miles\n- Clean Title: ${form.isCleanTitle ? 'Yes' : 'No'}\n- Accident History: ${form.hasAccident ? 'Yes' : 'No'}\n- Maintenance Records: ${form.hasMaintenanceRecords ? 'Yes' : 'No'}\n- Certified: ${form.isCertified ? 'Yes' : 'No'}`,
          mileage: form.mileage,
          condition: form.condition,
          body_type: form.body_type,
          drivetrain: form.drivetrain,
          transmission: form.transmission,
          fuel: form.fuel,
          location_city: form.city,
          location_state: form.state,
          location_country: form.country,
          postal_code: form.postalCode || null,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating listing:', error)
        alert('Error creating listing. Please try again.')
        return
      }

      // Store contact information securely in separate table
      const { error: contactError } = await supabase
        .from('listing_contacts')
        .insert({
          listing_id: data.id,
          phone: form.contactPhone || null,
          email: form.contactEmail
        })

      if (contactError) {
        console.error('Error storing contact info:', contactError)
        // Don't fail the listing creation, just log the error
        // Contact info can be added later if needed
      }

      // TODO: Handle photo uploads to Supabase storage
      // For now, we'll just redirect to the listing

      // Show success state and redirect
      setSuccess(true)
      setTimeout(() => {
        router.push(`/listings/${data.id}`)
      }, 2000) // Give user 2 seconds to see success message
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            List Your Toyota
          </h1>
          <p className="text-lg text-gray-600">
            Quick and easy - just answer a few questions
          </p>
          <p className="text-sm text-gray-500 mt-2">
            No account required - list anonymously and start selling today!
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-green-800 font-medium">
                Your Toyota has been listed successfully! 🎉
              </p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              You can now view your listing and share it with potential buyers.
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Vehicle Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <Input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trim Level
                  </label>
                  <Input
                    type="text"
                    value={form.trim}
                    onChange={(e) => setForm(f => ({ ...f, trim: e.target.value }))}
                    placeholder="e.g., XSE, TRD"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <Input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm(f => ({ ...f, model: e.target.value }))}
                    placeholder="e.g., Camry, Tacoma"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD)
                </label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                  min="0"
                  step="1"
                  placeholder="25000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the price in whole dollars (e.g., 25000 for $25,000)
                </p>
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage
                </label>
                <Input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => setForm(f => ({ ...f, mileage: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="9999999"
                  step="1"
                  placeholder="50000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total mileage (0 - 9,999,999)
                </p>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <Select
                    value={form.condition}
                    onValueChange={(value: 'Excellent' | 'Good' | 'Fair' | 'Project') => setForm(f => ({ ...f, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type
                  </label>
                  <Select
                    value={form.body_type}
                    onValueChange={(value: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other') => setForm(f => ({ ...f, body_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Wagon">Wagon</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drivetrain
                  </label>
                  <Select
                    value={form.drivetrain}
                    onValueChange={(value: 'FWD' | 'RWD' | 'AWD' | '4WD' | 'Unknown') => setForm(f => ({ ...f, drivetrain: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                      <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                      <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                      <SelectItem value="4WD">Four-Wheel Drive</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <Select
                    value={form.transmission}
                    onValueChange={(value: 'Auto' | 'Manual' | 'Unknown') => setForm(f => ({ ...f, transmission: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <Select
                  value={form.fuel}
                  onValueChange={(value: 'Gas' | 'Diesel' | 'Hybrid' | 'EV' | 'Other') => setForm(f => ({ ...f, fuel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="EV">Electric</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Binary Questions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Questions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Clean title?</span>
                    <Select
                      value={form.isCleanTitle ? 'yes' : 'no'}
                      onValueChange={(value) => setForm(f => ({ ...f, isCleanTitle: value === 'yes' }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Any accident history?</span>
                    <Select
                      value={form.hasAccident ? 'yes' : 'no'}
                      onValueChange={(value) => setForm(f => ({ ...f, hasAccident: value === 'yes' }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Maintenance records available?</span>
                    <Select
                      value={form.hasMaintenanceRecords ? 'yes' : 'no'}
                      onValueChange={(value) => setForm(f => ({ ...f, hasMaintenanceRecords: value === 'yes' }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Certified pre-owned?</span>
                    <Select
                      value={form.isCertified ? 'yes' : 'no'}
                      onValueChange={(value) => setForm(f => ({ ...f, isCertified: value === 'yes' }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (optional)
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Any additional details about your vehicle..."
                />
              </div>

              {/* Location */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <Select
                      value={form.country}
                      onValueChange={(value: 'US' | 'CA' | 'MX') => setForm(f => ({ ...f, country: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="MX">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <Input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}
                      placeholder="e.g., AZ"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="e.g., Phoenix"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm(f => ({ ...f, postalCode: e.target.value }))}
                      placeholder="e.g., 85001"
                    />
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Click to upload photos
                      </span>
                      <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload up to 10 photos (JPG, PNG)
                    </p>
                  </div>
                </div>
                
                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <Input
                      type="text"
                      value={form.contactName}
                      onChange={(e) => setForm(f => ({ ...f, contactName: e.target.value }))}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone (optional)
                  </label>
                  <Input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
