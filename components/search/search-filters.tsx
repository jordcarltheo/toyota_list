"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SearchFilters {
  model: string
  year_min: string
  year_max: string
  price_min: string
  price_max: string
  mileage_max: string
  body_type: string
  drivetrain: string
  transmission: string
  fuel: string
  condition: string
  location_city: string
  location_state: string
  location_country: string
}

interface SearchFiltersProps {
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
}

const toyotaModels = [
  // 1950s-1960s Models
  'Crown', 'Corona', 'Corolla', 'Publica', 'Sports 800', '2000GT', 'Celica', 'Carina', 'Mark II', 'Cressida', 'Century', 'Crown Comfort', 'Comfort', 'Hiace', 'Dyna', 'Coaster', 'Land Cruiser', 'Stout', 'Tacoma', 'Hilux',
  
  // 1970s-1980s Models
  'Camry', 'Avalon', 'Prius', 'RAV4', 'Highlander', '4Runner', 'Tacoma', 'Tundra', 'Sienna', 'C-HR', 'Venza', 'bZ4X', 'GR86', 'GR Corolla', 'GR Supra', 'GR Yaris', 'Matrix', 'Yaris', 'Yaris Hatchback', 'MR2', 'Tercel', 'Paseo', 'Echo', 'Scion tC', 'Scion xB', 'Scion xD', 'FJ Cruiser', 'Sequoia', 'Lexus ES', 'Lexus IS', 'Lexus LS', 'Lexus LC', 'Lexus RC', 'Lexus UX', 'Lexus NX', 'Lexus RX', 'Lexus GX', 'Lexus LX',
  
  // Hybrid Models
  'Camry Hybrid', 'Corolla Hybrid', 'RAV4 Hybrid', 'Highlander Hybrid', 'Sienna Hybrid', 'Prius Prime', 'RAV4 Prime',
  
  // Electric Models
  'bZ4X AWD',
  
  // Performance Models
  'GR86', 'GR Corolla', 'GR Supra', 'GR Yaris',
  
  // Discontinued Models (Still Common in Market)
  'Avalon', 'C-HR', 'FJ Cruiser', 'Sequoia', 'Land Cruiser', 'Matrix', 'Yaris', 'Yaris Hatchback', 'Celica', 'MR2', 'Tercel', 'Paseo', 'Echo', 'Scion tC', 'Scion xB', 'Scion xD',
  
  // Lexus Models
  'Lexus ES', 'Lexus IS', 'Lexus LS', 'Lexus LC', 'Lexus RC', 'Lexus UX', 'Lexus NX', 'Lexus RX', 'Lexus GX', 'Lexus LX'
]

const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Wagon', 'Coupe', 'Other']
const conditions = ['Excellent', 'Good', 'Fair', 'Project']
const drivetrains = ['FWD', 'RWD', 'AWD', '4WD', 'Unknown']
const transmissions = ['Auto', 'Manual', 'Unknown']
const fuels = ['Gas', 'Diesel', 'Hybrid', 'EV', 'Other']

// Location options for better UX
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

export function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    model: filters.model || 'all',
    body_type: filters.body_type || 'all',
    drivetrain: filters.drivetrain || 'all',
    transmission: filters.transmission || 'all',
    fuel: filters.fuel || 'all',
    condition: filters.condition || 'all',
    location_state: filters.location_state || 'all',
    location_country: filters.location_country || 'all'
  })

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      
      // Clear state/province when country changes
      if (key === 'location_country') {
        newFilters.location_state = ''
        newFilters.location_city = ''
      }
      
      return newFilters
    })
  }

  const applyFilters = () => {
    setFilters(localFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      model: 'all',
      year_min: '',
      year_max: '',
      price_min: '',
      price_max: '',
      mileage_max: '',
      body_type: 'all',
      drivetrain: 'all',
      transmission: 'all',
      fuel: 'all',
      condition: 'all',
      location_city: '',
      location_state: 'all',
      location_country: 'all'
    }
    setLocalFilters(clearedFilters)
    setFilters(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <Select
            value={localFilters.model}
            onValueChange={(value) => handleFilterChange('model', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {toyotaModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              value={localFilters.year_min}
              onChange={(e) => handleFilterChange('year_min', e.target.value)}
              type="number"
              min="1900"
              max="2024"
            />
            <Input
              placeholder="Max"
              value={localFilters.year_max}
              onChange={(e) => handleFilterChange('year_max', e.target.value)}
              type="number"
              min="1900"
              max="2024"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              value={localFilters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value)}
              type="number"
              min="0"
            />
            <Input
              placeholder="Max"
              value={localFilters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value)}
              type="number"
              min="0"
            />
          </div>
        </div>

        {/* Max Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Mileage
          </label>
          <Input
            placeholder="e.g., 100000"
            value={localFilters.mileage_max}
            onChange={(e) => handleFilterChange('mileage_max', e.target.value)}
            type="number"
            min="0"
          />
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Type
          </label>
          <Select
            value={localFilters.body_type}
            onValueChange={(value) => handleFilterChange('body_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Body Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Body Types</SelectItem>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Drivetrain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drivetrain
          </label>
          <Select
            value={localFilters.drivetrain}
            onValueChange={(value) => handleFilterChange('drivetrain', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Drivetrains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivetrains</SelectItem>
              {drivetrains.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission
          </label>
          <Select
            value={localFilters.transmission}
            onValueChange={(value) => handleFilterChange('transmission', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Transmissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transmissions</SelectItem>
              {transmissions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <Select
            value={localFilters.fuel}
            onValueChange={(value) => handleFilterChange('fuel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Fuel Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              {fuels.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <Select
            value={localFilters.condition}
            onValueChange={(value) => handleFilterChange('condition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          
          {/* Country */}
          <div className="mb-3">
            <Select
              value={localFilters.location_country}
              onValueChange={(value) => handleFilterChange('location_country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State/Province */}
          <div className="mb-3">
            <Select
              value={localFilters.location_state}
              onValueChange={(value) => handleFilterChange('location_state', value)}
              disabled={!localFilters.location_country}
            >
              <SelectTrigger>
                <SelectValue placeholder={localFilters.location_country ? "Select State/Province" : "Select Country First"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States/Provinces</SelectItem>
                {localFilters.location_country && locationOptions[localFilters.location_country as keyof typeof locationOptions]?.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="mb-3">
            <Input
              placeholder="City (e.g., Phoenix, Toronto, Guadalajara)"
              value={localFilters.location_city}
              onChange={(e) => handleFilterChange('location_city', e.target.value)}
            />
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
