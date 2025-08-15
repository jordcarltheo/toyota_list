"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X } from 'lucide-react'

// Toyota model data with body types and available trims
const toyotaModels = {
  'Camry': {
    bodyType: 'Sedan',
    trims: ['LE', 'SE', 'XLE', 'XSE', 'Nightshade', 'TRD']
  },
  'Corolla': {
    bodyType: 'Sedan',
    trims: ['L', 'LE', 'SE', 'XLE', 'XSE', 'Nightshade', 'Apex']
  },
  'Avalon': {
    bodyType: 'Sedan',
    trims: ['XLE', 'XSE', 'Limited', 'Touring']
  },
  'Prius': {
    bodyType: 'Sedan',
    trims: ['LE', 'XLE', 'Limited']
  },
  'RAV4': {
    bodyType: 'SUV',
    trims: ['LE', 'XLE', 'XLE Premium', 'Adventure', 'TRD Off-Road', 'Limited', 'Prime']
  },
  'Highlander': {
    bodyType: 'SUV',
    trims: ['L', 'LE', 'XLE', 'Limited', 'Platinum']
  },
  '4Runner': {
    bodyType: 'SUV',
    trims: ['SR5', 'TRD Off-Road', 'TRD Off-Road Premium', 'Limited', 'TRD Pro']
  },
  'Tacoma': {
    bodyType: 'Truck',
    trims: ['SR', 'SR5', 'TRD Sport', 'TRD Off-Road', 'TRD Pro', 'Limited']
  },
  'Tundra': {
    bodyType: 'Truck',
    trims: ['SR', 'SR5', 'Limited', 'Platinum', '1794 Edition', 'TRD Pro']
  },
  'Sienna': {
    bodyType: 'Van',
    trims: ['L', 'LE', 'XLE', 'Limited', 'Platinum']
  },
  'C-HR': {
    bodyType: 'SUV',
    trims: ['LE', 'XLE', 'Nightshade']
  },
  'Venza': {
    bodyType: 'SUV',
    trims: ['LE', 'XLE', 'Limited']
  }
}

export default function SellPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    model: '' as keyof typeof toyotaModels | '',
    trim: '',
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
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])

  // Get available trims for selected model
  const availableTrims = form.model ? toyotaModels[form.model]?.trims || [] : []

  // Auto-select body type when model changes
  const handleModelChange = (model: keyof typeof toyotaModels) => {
    const bodyType = toyotaModels[model]?.bodyType as 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other'
    setForm(prev => ({
      ...prev,
      model,
      body_type: bodyType,
      trim: '' // Reset trim when model changes
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      
      // Validate file types and sizes
      const validPhotos = newPhotos.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
        
        if (!isValidType) {
          alert(`${file.name} is not a valid image type. Please use JPG, PNG, or WebP.`)
        }
        if (!isValidSize) {
          alert(`${file.name} is too large. Please use images under 5MB.`)
        }
        
        return isValidType && isValidSize
      })
      
      setPhotos(prev => [...prev, ...validPhotos].slice(0, 10)) // Max 10 photos
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

      // Auto-generate title from year + trim + model (no need for "Toyota" since it's Toyota-specific)
      const autoTitle = `${form.year} ${form.trim} ${form.model}`.trim()

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

            // Upload photos to Supabase Storage
      if (photos.length > 0) {
        setUploadingPhotos(true)
        try {
          const photoPromises = photos.map(async (photo, index) => {
            // Create a unique filename
            const fileExt = photo.name.split('.').pop()
            const fileName = `${data.id}/${Date.now()}_${index}.${fileExt}`
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('listing-photos')
              .upload(fileName, photo, {
                cacheControl: '3600',
                upsert: false
              })
            
            if (uploadError) {
              console.error('Error uploading photo:', uploadError)
              return null
            }
            
            // Get the public URL
            const { data: urlData } = supabase.storage
              .from('listing-photos')
              .getPublicUrl(fileName)
            
            // Save photo metadata to database
            const { error: photoError } = await supabase
              .from('listing_photos')
              .insert({
                listing_id: data.id,
                path: fileName,
                width: 0, // We'll get actual dimensions later if needed
                height: 0,
                sort_order: index
              })
            
            if (photoError) {
              console.error('Error saving photo metadata:', photoError)
            }
            
            return { fileName, publicUrl: urlData.publicUrl }
          })
          
          // Wait for all photo uploads to complete
          await Promise.all(photoPromises)
        } catch (photoError) {
          console.error('Error handling photos:', photoError)
          // Don't fail the listing creation, just log the error
        } finally {
          setUploadingPhotos(false)
        }
      }

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
                Your vehicle has been listed successfully! 🎉
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
              {/* Basic Vehicle Info - Year, Model, Trim */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Vehicle Info</h3>
                
                {/* Year */}
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

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <Select
                    value={form.model}
                    onValueChange={(value: keyof typeof toyotaModels) => handleModelChange(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(toyotaModels).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trim */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trim Level
                  </label>
                  <Select
                    value={form.trim}
                    onValueChange={(value) => setForm(f => ({ ...f, trim: value }))}
                    disabled={!form.model}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={form.model ? "Select Trim" : "Select Model First"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTrims.map((trim) => (
                        <SelectItem key={trim} value={trim}>
                          {trim}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Input
                    type="text"
                    value={form.body_type}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-selected based on model
                  </p>
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
                      <SelectItem value="FWD">FWD</SelectItem>
                      <SelectItem value="RWD">RWD</SelectItem>
                      <SelectItem value="AWD">AWD</SelectItem>
                      <SelectItem value="4WD">4WD</SelectItem>
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
                      <SelectItem value="Auto">Auto</SelectItem>
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
                    <SelectItem value="EV">EV</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Questions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Questions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clean Title?
                    </label>
                    <Select
                      value={form.isCleanTitle ? 'Yes' : 'No'}
                      onValueChange={(value) => setForm(f => ({ ...f, isCleanTitle: value === 'Yes' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accident History?
                    </label>
                    <Select
                      value={form.hasAccident ? 'Yes' : 'No'}
                      onValueChange={(value) => setForm(f => ({ ...f, hasAccident: value === 'Yes' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Records?
                    </label>
                    <Select
                      value={form.hasMaintenanceRecords ? 'Yes' : 'No'}
                      onValueChange={(value) => setForm(f => ({ ...f, hasMaintenanceRecords: value === 'Yes' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certified Pre-Owned?
                    </label>
                    <Select
                      value={form.isCertified ? 'Yes' : 'No'}
                      onValueChange={(value) => setForm(f => ({ ...f, isCertified: value === 'Yes' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
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
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe your vehicle, any modifications, recent work, etc."
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
                      required
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
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <p className="text-sm text-gray-500 mt-2">
                      {photos.length} photo{photos.length !== 1 ? 's' : ''} ready to upload
                    </p>
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

              {/* Submit Button */}
              <div className="border-t pt-6">
                              <Button
                type="submit"
                disabled={loading || uploadingPhotos || !form.model || !form.trim}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? 'Creating Listing...' : 
                 uploadingPhotos ? 'Uploading Photos...' : 'Create Listing'}
              </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Your contact information will be protected and only shared with buyers after payment verification.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
