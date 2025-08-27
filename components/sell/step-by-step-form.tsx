"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { lookupVIN, VINData } from '@/lib/vin-lookup'
import { Search, Car, MapPin, User, Camera, CreditCard, CheckCircle } from 'lucide-react'

interface ListingFormData {
  vin: string
  year: number
  model: string
  trim: string
  price: number
  mileage: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Project'
  body_type: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Wagon' | 'Coupe' | 'Other'
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
  { id: 6, title: 'Photos', icon: Camera, description: 'Upload photos of your vehicle' },
  { id: 7, title: 'Review & Submit', icon: CheckCircle, description: 'Review your listing and submit' }
]

const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Wagon', 'Coupe', 'Other']
const conditions = ['Excellent', 'Good', 'Fair', 'Project']
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
    price: 25000,
    mileage: 50000,
    condition: 'Good',
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
    hasAccident: false,
    isCleanTitle: true,
    hasMaintenanceRecords: false,
    isCertified: false
  })

  const [vinLookupData, setVinLookupData] = useState<VINData | null>(null)
  const [vinLookupLoading, setVinLookupLoading] = useState(false)
  const [vinLookupError, setVinLookupError] = useState('')

  const progress = (currentStep / steps.length) * 100

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
          drivetrain: vinData.drivetrain as any
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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
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
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Vehicle Found!</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-200">
                    <div><span className="font-medium">Make:</span> {vinLookupData.make}</div>
                    <div><span className="font-medium">Model:</span> {vinLookupData.model}</div>
                    <div><span className="font-medium">Year:</span> {vinLookupData.year}</div>
                    <div><span className="font-medium">Body Type:</span> {vinLookupData.bodyType}</div>
                    {vinLookupData.trim && <div><span className="font-medium">Trim:</span> {vinLookupData.trim}</div>}
                    {vinLookupData.engine && <div><span className="font-medium">Engine:</span> {vinLookupData.engine}</div>}
                    <div><span className="font-medium">Transmission:</span> {vinLookupData.transmission}</div>
                    <div><span className="font-medium">Fuel Type:</span> {vinLookupData.fuelType}</div>
                    <div><span className="font-medium">Drivetrain:</span> {vinLookupData.drivetrain}</div>
                  </div>
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Body Type *</label>
                <Select
                  value={formData.body_type}
                  onValueChange={(value: any) => updateFormData('body_type', value)}
                >
                  <SelectTrigger>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Transmission *</label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: any) => updateFormData('transmission', value)}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage *</label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => updateFormData('mileage', parseInt(e.target.value))}
                  min="0"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                placeholder="Describe your vehicle, any modifications, features, or issues..."
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cleanTitle"
                  checked={formData.isCleanTitle}
                  onCheckedChange={(checked) => updateFormData('isCleanTitle', checked)}
                />
                <label htmlFor="cleanTitle" className="text-sm font-medium text-gray-700">
                  Clean title (no salvage, rebuilt, or branded title)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noAccidents"
                  checked={!formData.hasAccident}
                  onCheckedChange={(checked) => updateFormData('hasAccident', !checked)}
                />
                <label htmlFor="noAccidents" className="text-sm font-medium text-gray-700">
                  No accident history
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maintenanceRecords"
                  checked={formData.hasMaintenanceRecords}
                  onCheckedChange={(checked) => updateFormData('hasMaintenanceRecords', checked)}
                />
                <label htmlFor="maintenanceRecords" className="text-sm font-medium text-gray-700">
                  Maintenance records available
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certified"
                  checked={formData.isCertified}
                  onCheckedChange={(checked) => updateFormData('isCertified', checked)}
                />
                <label htmlFor="certified" className="text-sm font-medium text-gray-700">
                  Certified pre-owned or similar certification
                </label>
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <Select
                  value={formData.country}
                  onValueChange={(value: any) => updateFormData('country', value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions[formData.country as keyof typeof locationOptions]?.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                  placeholder="Optional"
                />
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Photos</h2>
              <p className="text-gray-600">Upload photos of your vehicle</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Photo upload functionality coming soon</p>
              <p className="text-sm text-gray-500">For now, you can add photos after creating your listing</p>
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
                <div><span className="font-medium">Body Type:</span> {formData.body_type}</div>
                <div><span className="font-medium">Price:</span> ${formData.price.toLocaleString()}</div>
                <div><span className="font-medium">Mileage:</span> {formData.mileage.toLocaleString()} miles</div>
                <div><span className="font-medium">Condition:</span> {formData.condition}</div>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white pt-4">Location</h3>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {formData.city}, {formData.state} {formData.country}
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white pt-4">Contact</h3>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {formData.contactName} - {formData.contactEmail}
                {formData.contactPhone && ` - ${formData.contactPhone}`}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Next:</strong> After submitting, you&apos;ll be redirected to complete payment of the $99 listing fee.
              </p>
            </div>
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

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Submit Listing' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
