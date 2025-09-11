"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { lookupVIN, VINData } from '@/lib/vin-lookup'
import { Search, Car, MapPin, User, Camera, CreditCard, CheckCircle } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase'

interface ListingFormData {
  vin: string
  year: number
  model: string
  trim: string
  cabSize: string
  doors: number
  price: number
  mileage: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Project'
  title: 'Clean' | 'Restored / Rebuilt' | 'Salvage'
  body_type: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other' | 'Unknown'
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD' | 'Unknown'
  transmission: 'Auto' | 'Manual' | 'Unknown'
  fuel: 'Gas' | 'Diesel' | 'Hybrid' | 'EV' | 'Other'
  description: string
  city: string
  state: string
  postalCode: string
  country: 'US' | 'CA' | 'MX'
  contactName: string
  contactEmail: string
  contactPhone: string
  verificationMethod: 'email' | null
  photos: File[]
  hasAccident: boolean
  isCleanTitle: boolean
  hasMaintenanceRecords: boolean
  isCertified: boolean
}

const steps = [
  { id: 1, title: 'VIN Lookup', icon: Search, description: 'Enter your vehicle VIN to auto-populate details' },
  { id: 2, title: 'Vehicle Details', icon: Car, description: 'Review and adjust vehicle information' },
  { id: 3, title: 'Pricing & Condition', icon: CreditCard, description: 'Set price and describe condition' },
  { id: 4, title: 'Location', icon: MapPin, description: 'Where is your vehicle located?' },
  { id: 5, title: 'Contact Info', icon: User, description: 'How can buyers reach you?' },
  { id: 6, title: 'Photos', icon: Camera, description: 'Upload at least 3 photos of your vehicle' },
  { id: 7, title: 'Review & Submit', icon: CheckCircle, description: 'Review your listing and submit' }
]

const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Wagon', 'Coupe', 'Other', 'Unknown']
const conditions = ['Excellent', 'Good', 'Fair', 'Project']
const titles = ['Clean', 'Restored / Rebuilt', 'Salvage']
const drivetrains = ['FWD', 'RWD', 'AWD', '4WD', 'Unknown']
const transmissions = ['Auto', 'Manual', 'Unknown']
const fuels = ['Gas', 'Diesel', 'Hybrid', 'EV', 'Other']

const locationOptions = {
  US: [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ],
  CA: [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE',
    'QC', 'SK', 'YT'
  ],
  MX: [
    'AGU', 'BCN', 'BCS', 'CAM', 'CHH', 'CHP', 'COA', 'COL', 'DUR',
    'GUA', 'GRO', 'HID', 'JAL', 'MEX', 'MIC', 'MOR', 'NAY', 'NLE',
    'OAX', 'PUE', 'QUE', 'ROO', 'SIN', 'SLP', 'SON', 'TAB', 'TAM',
    'TLA', 'VER', 'YUC', 'ZAC'
  ]
}

export function StepByStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ListingFormData>({
    vin: '',
    year: new Date().getFullYear(),
    model: '',
    trim: '',
    cabSize: '',
    doors: 4,
    price: 25000,
    mileage: 50000,
    condition: 'Good',
    title: 'Clean',
    body_type: 'Sedan',
    drivetrain: 'FWD',
    transmission: 'Auto',
    fuel: 'Gas',
    description: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    verificationMethod: null,
    photos: [],
    hasAccident: false,
    isCleanTitle: true,
    hasMaintenanceRecords: false,
    isCertified: false
  })

  const [vinLookupData, setVinLookupData] = useState<VINData | null>(null)
  const [vinLookupLoading, setVinLookupLoading] = useState(false)
  const [vinLookupError, setVinLookupError] = useState('')
  const [zipLookupLoading, setZipLookupLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [submissionCode, setSubmissionCode] = useState('')
  const [isCodeValid, setIsCodeValid] = useState(false)
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = (currentStep / steps.length) * 100

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Code validation function
  const validateCode = (code: string): boolean => {
    return code === 'FREEYOTA'
  }

  // Handle code input change
  const handleCodeChange = (value: string) => {
    setSubmissionCode(value)
    setIsCodeValid(validateCode(value))
  }

  // Phone number formatting function
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '')
    
    // Limit to 10 digits
    const limitedPhone = phoneNumber.slice(0, 10)
    
    // Format as XXX-XXX-XXXX
    if (limitedPhone.length >= 6) {
      return `${limitedPhone.slice(0, 3)}-${limitedPhone.slice(3, 6)}-${limitedPhone.slice(6)}`
    } else if (limitedPhone.length >= 3) {
      return `${limitedPhone.slice(0, 3)}-${limitedPhone.slice(3)}`
    } else {
      return limitedPhone
    }
  }

  // Phone number validation function
  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneNumber = phone.replace(/\D/g, '')
    return phoneNumber.length === 10
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Files selected:', files)
    const newPhotos = [...formData.photos, ...files].slice(0, 10) // Max 10 photos
    console.log('New photos array:', newPhotos)
    updateFormData('photos', newPhotos)
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    console.log('New preview URLs:', newPreviews)
    setPhotoPreview(prev => [...prev, ...newPreviews].slice(0, 10))
  }

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index)
    const newPreviews = photoPreview.filter((_, i) => i !== index)
    updateFormData('photos', newPhotos)
    setPhotoPreview(newPreviews)
  }

  const handleZipLookup = async (zipCode: string) => {
    if (!zipCode || zipCode.length < 5) return

    setZipLookupLoading(true)
    try {
      // Using a free zip code API
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`)
      if (response.ok) {
        const data = await response.json()
        if (data.places && data.places.length > 0) {
          const place = data.places[0]
          updateFormData('city', place['place name'])
          updateFormData('state', place['state abbreviation'])
        }
      }
    } catch (error) {
      console.error('Zip code lookup failed:', error)
    } finally {
      setZipLookupLoading(false)
    }
  }

  const handleVINLookup = async () => {
    if (!formData.vin || formData.vin.length !== 17) {
      setVinLookupError('VIN must be exactly 17 characters')
      return
    }

    setVinLookupLoading(true)
    setVinLookupError('')

    try {
      const vinData = await lookupVIN(formData.vin)
      
      if (vinData?.error) {
        setVinLookupError(vinData.error)
        setVinLookupData(null)
      } else if (vinData) {
        setVinLookupData(vinData)
        // Auto-populate form with VIN data
        setFormData(prev => ({
          ...prev,
          year: parseInt(vinData.year),
          model: vinData.model,
          trim: vinData.trim || '',
          body_type: vinData.bodyType as any,
          transmission: vinData.transmission as any,
          fuel: vinData.fuelType as any,
          drivetrain: vinData.drivetrain as any,
          cabSize: vinData.cabSize || '',
          doors: vinData.doors || 0
        }))
        setVinLookupError('')
      }
    } catch (error) {
      setVinLookupError('Failed to lookup VIN. Please try again.')
      setVinLookupData(null)
    } finally {
      setVinLookupLoading(false)
    }
  }

  // Check if vehicle make is Toyota or Lexus
  const isToyotaOrLexus = vinLookupData && (vinLookupData.make === 'TOYOTA' || vinLookupData.make === 'LEXUS')
  
  // Generate alliterative error message for non-Toyota vehicles
  const getNonToyotaMessage = (make: string) => {
    const makeLower = make.toLowerCase()
    const firstLetter = makeLower.charAt(0)
    
    const messages = {
      'h': `Haha! A ${make}? How hilarious! You silly goose, this is ToyotaList.com, not ${make}List.com!`,
      'b': `Bummer! A ${make}? Better bring a Toyota or Lexus, you beautiful but bewildered buyer!`,
      'f': `Foolish! A F***ing ${make}?! Find yourself a phalic shaped fence post, and go $%#& yourself with it!`,
      'c': `Come on! A ${make}? Clearly you need a Toyota or Lexus, you clever but confused customer!`,
      'd': `Duh! A ${make}? Don't be daft - drive a Toyota or Lexus, you delightful but dense driver!`,
      'g': `Geez! A ${make}? Get a grip and grab a Toyota or Lexus, you great but goofy gearhead!`,
      'j': `Jeez! A ${make}? Just join the Toyota or Lexus club, you joyful but jumbled joker!`,
      'k': `Kidding me? A ${make}? Keep it real with a Toyota or Lexus, you kind but klutzy kid!`,
      'l': `LOL! A ${make}? Let's stick to Toyota or Lexus, you lovely but loopy legend!`,
      'm': `My my! A ${make}? Maybe try a Toyota or Lexus, you marvelous but mixed-up motorist!`,
      'n': `No way! A ${make}? Not on ToyotaList.com, you nice but naive navigator!`,
      'p': `Please! A ${make}? Pick a Toyota or Lexus, you perfect but puzzled person!`,
      'q': `Quit it! A ${make}? Quick, get a Toyota or Lexus, you quirky but questionable driver!`,
      'r': `Really? A ${make}? Ridiculous! Reach for a Toyota or Lexus, you radiant but ridiculous roadster!`,
      's': `Seriously? A ${make}? Silly you! Select a Toyota or Lexus, you splendid but silly speedster!`,
      't': `Too bad! A ${make}? Try a Toyota or Lexus, you terrific but thick-headed traveler!`,
      'u': `Unbelievable! A ${make}? Use your head and get a Toyota or Lexus, you unique but unwise user!`,
      'v': `Very funny! A ${make}? Visit Toyota or Lexus instead, you vibrant but vexing vehicle lover!`,
      'w': `What? A ${make}? Wrong choice! Want a Toyota or Lexus, you wonderful but wacky wheelman!`,
      'x': `X marks the spot for Toyota or Lexus! A ${make}? Xtra silly choice, you excellent but eccentric explorer!`,
      'y': `Yikes! A ${make}? You need a Toyota or Lexus, you youthful but yawning yahoo!`,
      'z': `Zounds! A ${make}? Zero chance! Zip over to Toyota or Lexus, you zesty but zany zoomer!`
    }
    
    return messages[firstLetter as keyof typeof messages] || `Oops! A ${make}? Only Toyota or Lexus allowed here, you silly goose!`
  }

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // VIN Lookup
        return !!(formData.vin && formData.vin.length === 17 && vinLookupData && isToyotaOrLexus)
      
      case 2: // Vehicle Details
        return !!(formData.year && formData.model && formData.body_type && 
                 formData.drivetrain && formData.transmission && formData.fuel &&
                 formData.drivetrain !== 'Unknown' && formData.transmission !== 'Unknown')
      
      case 3: // Pricing & Condition
        return !!(formData.price && formData.mileage && formData.condition && 
                 formData.title && formData.description)
      
      case 4: // Location
        return !!(formData.postalCode && formData.city && formData.state)
      
      case 5: // Contact Info
        return !!(
          formData.contactName && 
          formData.contactEmail && 
          isValidEmail(formData.contactEmail) &&
          formData.contactPhone && 
          isValidPhoneNumber(formData.contactPhone) &&
          formData.verificationMethod
        )
      
      case 6: // Photos
        console.log('Photo validation - formData.photos:', formData.photos)
        console.log('Photo validation - formData.photos.length:', formData.photos.length)
        console.log('Photo validation - photoPreview:', photoPreview)
        console.log('Photo validation - photoPreview.length:', photoPreview.length)
        return formData.photos.length >= 3
      
      case 7: // Review & Submit
        return true // Final step
      
      default:
        return false
    }
  }

  const getValidationMessage = (step: number): string => {
    switch (step) {
      case 1:
        if (!formData.vin || formData.vin.length !== 17) return 'Please enter a valid 17-character VIN'
        if (!vinLookupData) return 'Please lookup your VIN first'
        if (!isToyotaOrLexus) return 'Only Toyota and Lexus vehicles are allowed'
        return ''
      
      case 2:
        const missing = []
        if (!formData.year) missing.push('Year')
        if (!formData.model) missing.push('Model')
        if (!formData.body_type) missing.push('Body Type')
        if (!formData.drivetrain) missing.push('Drivetrain')
        if (!formData.transmission) missing.push('Transmission')
        if (!formData.fuel) missing.push('Fuel Type')
        
        // Check for Unknown values that need to be corrected
        if (formData.drivetrain === 'Unknown') missing.push('Drivetrain (select correct type)')
        if (formData.transmission === 'Unknown') missing.push('Transmission (select correct type)')
        
        return missing.length > 0 ? `Please fix: ${missing.join(', ')}` : ''
      
      case 3:
        const missing3 = []
        if (!formData.price) missing3.push('Price')
        if (!formData.mileage) missing3.push('Mileage')
        if (!formData.condition) missing3.push('Condition')
        if (!formData.title) missing3.push('Title')
        if (!formData.description) missing3.push('Description')
        return missing3.length > 0 ? `Please fill in: ${missing3.join(', ')}` : ''
      
      case 4:
        const missing4 = []
        if (!formData.postalCode) missing4.push('ZIP Code')
        if (!formData.city) missing4.push('City')
        if (!formData.state) missing4.push('State')
        return missing4.length > 0 ? `Please fill in: ${missing4.join(', ')}` : ''
      
      case 5:
        const missing5 = []
        if (!formData.contactName) missing5.push('Full Name')
        if (!formData.contactEmail) missing5.push('Email')
        if (!formData.contactPhone) missing5.push('Phone Number')
        if (!formData.verificationMethod) missing5.push('Verification Method')
        
        // Check for invalid formats
        if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
          missing5.push('Valid Email (format: user@example.com)')
        }
        if (formData.contactPhone && !isValidPhoneNumber(formData.contactPhone)) {
          missing5.push('Valid Phone (format: XXX-XXX-XXXX)')
        }
        
        return missing5.length > 0 ? `Please fix: ${missing5.join(', ')}` : ''
      
      case 6:
        if (formData.photos.length < 3) {
          return `Please upload at least 3 photos (${formData.photos.length}/3 uploaded)`
        }
        return ''
      
      default:
        return ''
    }
  }

  const nextStep = async () => {
    if (currentStep < steps.length && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === steps.length && validateStep(currentStep)) {
      // This is the final step - show code entry
      setShowCodeEntry(true)
    }
  }

  const handleSubmit = async () => {
    if (!isCodeValid) return
    
    setIsSubmitting(true)
    try {
      const supabase = createBrowserSupabaseClient()
      
      // Create the listing first (without user authentication)
      // We'll create a temporary user ID and handle user creation later
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: tempUserId,
          title: `${formData.year} ${formData.model} ${formData.trim || ''}`.trim(),
          description: formData.description,
          price: formData.price,
          make: 'Toyota',
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          condition: formData.condition,
          body_type: formData.body_type,
          drivetrain: formData.drivetrain,
          transmission: formData.transmission,
          fuel: formData.fuel,
          location_city: formData.city,
          location_state: formData.state,
          location_country: formData.country,
          postal_code: formData.postalCode,
          vin: formData.vin,
          status: 'draft' // Set to draft until verification
        })
        .select()
        .single()

      if (listingError) {
        throw new Error(`Failed to create listing: ${listingError.message}`)
      }

      // Now create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.contactEmail,
        password: Math.random().toString(36).slice(-12), // Random password
        options: {
          data: {
            full_name: formData.contactName
          }
        }
      })

      if (authError) {
        console.error('Failed to create user account:', authError)
        // Don't throw error here - listing was created successfully
      } else if (authData.user?.id) {
        // Update the listing with the real user ID
        await supabase
          .from('listings')
          .update({ user_id: authData.user.id })
          .eq('id', listing.id)
      }

      // Upload photos if any
      if (formData.photos.length > 0 && listing) {
        const photoPromises = formData.photos.map(async (photo, index) => {
          const fileExt = photo.name.split('.').pop()
          const fileName = `${listing.id}/${index}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage
            .from('listing-photos')
            .upload(fileName, photo)

          if (uploadError) {
            console.error('Error uploading photo:', uploadError)
            return null
          }

          // Create photo record
          const { error: photoError } = await supabase
            .from('listing_photos')
            .insert({
              listing_id: listing.id,
              path: fileName,
              width: 800, // Default width
              height: 600, // Default height
              sort_order: index
            })

          if (photoError) {
            console.error('Error creating photo record:', photoError)
          }
        })

        await Promise.all(photoPromises)
      }

      // Create contact record
      if (listing) {
        const { error: contactError } = await supabase
          .from('listing_contacts')
          .insert({
            listing_id: listing.id,
            phone: formData.contactPhone,
            email: formData.contactEmail
          })

        if (contactError) {
          console.error('Error creating contact record:', contactError)
        }
      }

      // Create verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // Token expires in 24 hours

      const { error: tokenError } = await supabase
        .from('listing_verification_tokens')
        .insert({
          listing_id: listing.id,
          token: verificationToken,
          expires_at: expiresAt.toISOString()
        })

      if (tokenError) {
        console.error('Error creating verification token:', tokenError)
      }

      // Send verification email
      if (formData.verificationMethod === 'email') {
        const verificationUrl = `${window.location.origin}/verify/${listing.id}?token=${verificationToken}`
        
        // Use Supabase Auth to send verification email
        const { error: emailError } = await supabase.auth.resend({
          type: 'signup',
          email: formData.contactEmail,
          options: {
            emailRedirectTo: verificationUrl
          }
        })

        if (emailError) {
          console.error('Error sending verification email:', emailError)
          // Fallback: show the verification URL in console for now
          console.log('Verification URL:', verificationUrl)
        }
      }

      alert('Please check your email and click the verification link to activate your listing.')
      
      // Reset form
      setFormData({
        vin: '',
        year: new Date().getFullYear(),
        model: '',
        trim: '',
        cabSize: '',
        doors: 4,
        price: 25000,
        mileage: 50000,
        condition: 'Good',
        title: 'Clean',
        body_type: 'Sedan',
        drivetrain: 'FWD',
        transmission: 'Auto',
        fuel: 'Gas',
        description: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        verificationMethod: null,
        photos: [],
        hasAccident: false,
        isCleanTitle: true,
        hasMaintenanceRecords: false,
        isCertified: false
      })
      setCurrentStep(1)
      setPhotoPreview([])
      setSubmissionCode('')
      setIsCodeValid(false)
      setShowCodeEntry(false)
      
    } catch (error) {
      console.error('Error submitting listing:', error)
      alert(`Error submitting listing: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter Your Vehicle VIN</h2>
              <p className="text-gray-600 dark:text-gray-300">We&apos;ll automatically populate your vehicle details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Vehicle Identification Number (VIN) *
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.vin}
                    onChange={(e) => updateFormData('vin', e.target.value.toUpperCase())}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleVINLookup}
                    disabled={vinLookupLoading || formData.vin.length !== 17}
                    className="px-6"
                  >
                    {vinLookupLoading ? 'Looking up...' : 'Lookup'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter the 17-character VIN found on your vehicle or registration
                </p>
              </div>

              {vinLookupError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 text-sm">{vinLookupError}</p>
                </div>
              )}

              {vinLookupData && (
                <>
                  {/* Non-Toyota/Lexus Error Message */}
                  {!isToyotaOrLexus && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium text-center">
                        {getNonToyotaMessage(vinLookupData.make)}
                      </p>
                    </div>
                  )}
                  
                   <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                     <h3 className="text-green-800 font-semibold mb-3">Vehicle Found!</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <div><span className="text-green-700 font-medium">Make:</span> {vinLookupData.make}</div>
                         <div><span className="text-green-700 font-medium">Year:</span> {vinLookupData.year}</div>
                         <div><span className="text-green-700 font-medium">Trim:</span> {vinLookupData.trim || 'Not specified'}</div>
                         <div><span className="text-green-700 font-medium">Engine:</span> {vinLookupData.engine}</div>
                         <div><span className="text-green-700 font-medium">Fuel Type:</span> {vinLookupData.fuelType}</div>
                       </div>
                       <div className="space-y-2">
                         <div><span className="text-green-700 font-medium">Model:</span> {vinLookupData.model}</div>
                         <div><span className="text-green-700 font-medium">Body Type:</span> {vinLookupData.bodyType}</div>
                         {vinLookupData.bodyType === 'Truck' ? (
                           <div><span className="text-green-700 font-medium">Cab Size:</span> {vinLookupData.cabSize || 'Not specified'}</div>
                         ) : (
                           <div><span className="text-green-700 font-medium">Doors:</span> {vinLookupData.doors}</div>
                         )}
                         <div><span className="text-green-700 font-medium">Transmission:</span> {vinLookupData.transmission}</div>
                         <div><span className="text-green-700 font-medium">Drivetrain:</span> {vinLookupData.drivetrain}</div>
                       </div>
                     </div>
                   </div>
                   <p className="text-sm text-gray-500 italic mb-6">
                     If any of this data appears wrong, you can correct it on the next page.
                   </p>
                </>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vehicle Details</h2>
              <p className="text-gray-600 dark:text-gray-300">Review and adjust the information from your VIN</p>
            </div>

            {/* Warning for Unknown fields */}
            {(formData.body_type === 'Unknown' || formData.transmission === 'Unknown' || formData.drivetrain === 'Unknown') && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Some vehicle details need your attention
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>The VIN lookup couldn&apos;t determine some vehicle details. Please review and correct the highlighted fields below:</p>
                      <ul className="mt-2 list-disc list-inside">
                        {formData.body_type === 'Unknown' && <li>Body Type</li>}
                        {formData.transmission === 'Unknown' && <li>Transmission</li>}
                        {formData.drivetrain === 'Unknown' && <li>Drivetrain</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Year *</label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Model *</label>
                <Input
                  value={formData.model}
                  onChange={(e) => updateFormData('model', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Trim (Optional)</label>
                <Input
                  value={formData.trim}
                  onChange={(e) => updateFormData('trim', e.target.value)}
                  placeholder="e.g., LE, XLE, Limited"
                />
              </div>

              {formData.body_type === 'Truck' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cab Size (Optional)</label>
                  <Input
                    value={formData.cabSize}
                    onChange={(e) => updateFormData('cabSize', e.target.value)}
                    placeholder="e.g., Double Cab, Crew Cab, Single Cab"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Number of Doors</label>
                  <Input
                    type="number"
                    value={formData.doors}
                    onChange={(e) => updateFormData('doors', parseInt(e.target.value))}
                    min="2"
                    max="5"
                    placeholder="e.g., 2, 4"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Body Type *</label>
                <Select
                  value={formData.body_type}
                  onValueChange={(value: any) => updateFormData('body_type', value)}
                >
                  <SelectTrigger className={formData.body_type === 'Unknown' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.body_type === 'Unknown' && (
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">⚠️ This field needs attention - please select the correct body type</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Transmission *</label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: any) => updateFormData('transmission', value)}
                >
                  <SelectTrigger className={formData.transmission === 'Unknown' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.transmission === 'Unknown' && (
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">⚠️ This field needs attention - please select the correct transmission type</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Fuel Type *</label>
                <Select
                  value={formData.fuel}
                  onValueChange={(value: any) => updateFormData('fuel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fuels.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Drivetrain *</label>
                <Select
                  value={formData.drivetrain}
                  onValueChange={(value: any) => updateFormData('drivetrain', value)}
                >
                  <SelectTrigger className={formData.drivetrain === 'Unknown' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {drivetrains.map((drivetrain) => (
                      <SelectItem key={drivetrain} value={drivetrain}>
                        {drivetrain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.drivetrain === 'Unknown' && (
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">⚠️ This field needs attention - please select the correct drivetrain type</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Condition</h2>
              <p className="text-gray-600">Set your price and describe condition</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                <Input
                  type="text"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 25000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage *</label>
                <Input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => updateFormData('mileage', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 50000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: any) => updateFormData('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <Select
                value={formData.title}
                onValueChange={(value: any) => updateFormData('title', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                placeholder="Describe your vehicle, any modifications, features, or issues... Please no contact info here, that will be added later."
                required
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
              <p className="text-gray-600">Where is your vehicle located?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => {
                    updateFormData('postalCode', e.target.value)
                    if (e.target.value.length === 5) {
                      handleZipLookup(e.target.value)
                    }
                  }}
                  placeholder="e.g., 85001"
                  maxLength={5}
                  required
                />
                {zipLookupLoading && (
                  <p className="text-sm text-blue-600 mt-1">Looking up location...</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Auto-filled from ZIP code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="Auto-filled from ZIP code"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">How can buyers reach you?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  placeholder="user@example.com"
                  className={formData.contactEmail && !isValidEmail(formData.contactEmail) ? 'border-red-500' : ''}
                  required
                />
                {formData.contactEmail && !isValidEmail(formData.contactEmail) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', formatPhoneNumber(e.target.value))}
                  placeholder="XXX-XXX-XXXX"
                  maxLength={12}
                  className={formData.contactPhone && !isValidPhoneNumber(formData.contactPhone) ? 'border-red-500' : ''}
                  required
                />
                {formData.contactPhone && !isValidPhoneNumber(formData.contactPhone) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid 10-digit phone number</p>
                )}
              </div>
            </div>

            {/* Verification Method Selection */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Verification Method</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Check the box for how you&apos;d like to verify your listing:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="verify-email"
                    checked={formData.verificationMethod === 'email'}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData('verificationMethod', 'email')
                      } else {
                        updateFormData('verificationMethod', null)
                      }
                    }}
                  />
                  <label htmlFor="verify-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email verification to {formData.contactEmail || 'your email'}
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We&apos;ll send you a verification link to confirm your listing.
                </p>
              </div>
              
              {!formData.verificationMethod && (
                <p className="text-red-500 text-sm mt-2">Please select a verification method</p>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Photos</h2>
              <p className="text-gray-600">Upload at least 3 photos of your vehicle (up to 10 photos)</p>
              <p className="text-sm text-gray-500 mt-1">Minimum 3 photos required to proceed</p>
            </div>
            
            {/* Photo Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Click to upload photos or drag and drop</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Photos
              </label>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, or WebP. Max 10MB per photo.
              </p>
            </div>

            {/* Photo Preview Grid */}
            {photoPreview.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploaded Photos ({photoPreview.length}/10)
                  {photoPreview.length < 3 && (
                    <span className="text-red-500 text-sm ml-2">- Need {3 - photoPreview.length} more</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photoPreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Vehicle photo ${index + 1}`}
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Photo Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Take photos in good lighting</li>
                <li>• Include exterior shots from multiple angles</li>
                <li>• Show the interior, dashboard, and seats</li>
                <li>• Include photos of any damage or wear</li>
                <li>• Clean your vehicle before taking photos</li>
              </ul>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h2>
              <p className="text-gray-600">Please review all information before submitting</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                <div><span className="font-medium">VIN:</span> {formData.vin}</div>
                <div><span className="font-medium">Year:</span> {formData.year}</div>
                <div><span className="font-medium">Model:</span> {formData.model}</div>
                <div><span className="font-medium">Trim:</span> {formData.trim || 'Not specified'}</div>
                {formData.body_type === 'Truck' && (
                  <div><span className="font-medium">Cab Size:</span> {formData.cabSize || 'Not specified'}</div>
                )}
                <div><span className="font-medium">Body Type:</span> {formData.body_type}</div>
                <div><span className="font-medium">Price:</span> ${formData.price.toLocaleString()}</div>
                <div><span className="font-medium">Mileage:</span> {formData.mileage.toLocaleString()} miles</div>
                <div><span className="font-medium">Condition:</span> {formData.condition}</div>
                <div><span className="font-medium">Title:</span> {formData.title}</div>
              </div>
              
              {formData.description && (
                <div className="pt-2">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Description</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{formData.description}</p>
                </div>
              )}
              
              <h3 className="font-semibold text-gray-900 dark:text-white pt-4">Location</h3>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {formData.city}, {formData.state} {formData.country}
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white pt-4">
                Contact 
                <span className="text-red-400 italic text-sm font-normal ml-2">
                  (contact info won&apos;t be shown until buyers are verified)
                </span>
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {formData.contactName} - {formData.contactEmail}
                {formData.contactPhone && ` - ${formData.contactPhone}`}
              </div>

              {photoPreview.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-900 dark:text-white pt-4">Photos ({photoPreview.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {photoPreview.map((preview, index) => (
                      <Image
                        key={index}
                        src={preview}
                        alt={`Vehicle photo ${index + 1}`}
                        width={100}
                        height={80}
                        className="w-full h-20 object-cover rounded border border-gray-200"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Code Entry Section */}
              {showCodeEntry && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Enter Submission Code</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Enter the code to submit your listing
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={submissionCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={`flex-1 ${isCodeValid ? 'border-green-500' : 'border-gray-300'}`}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={!isCodeValid || isSubmitting}
                      className={`px-6 ${!isCodeValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                    </Button>
                  </div>
                  {submissionCode && !isCodeValid && (
                    <p className="text-red-600 text-sm mt-2">Invalid code. Please try again.</p>
                  )}
                </div>
              )}
            </div>

            {!showCodeEntry && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Next:</strong> Click Submit to enter your submission code and complete your listing.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Step {currentStep} of {steps.length}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step.id <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <div className="h-4 w-4">
                    {React.createElement(step.icon, { className: "h-4 w-4" })}
                  </div>
                )}
              </div>
              <span className="text-xs text-center max-w-16 text-gray-900 dark:text-gray-200">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-6 w-6" })}
            <span>{steps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-900 dark:text-white">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Validation Message */}
      {!validateStep(currentStep) && getValidationMessage(currentStep) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            {getValidationMessage(currentStep)}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6"
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={!validateStep(currentStep)}
          className={`px-6 ${!validateStep(currentStep) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentStep === steps.length ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
