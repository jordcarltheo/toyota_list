"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getBrandName } from '@/lib/utils'
import { Search, Car, Shield, DollarSign } from 'lucide-react'
import TRDStripeBar from '@/components/TRDStripeBar'

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-white mx-4 sm:mx-6 lg:mx-8 mt-8">
      <div className="absolute inset-x-0 top-0">
        <TRDStripeBar height={8} />
      </div>
      <div className="px-6 pb-10 pt-8 sm:px-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Buy & Sell Toyotas Nationwide
          </h1>
          <p className="mt-2 text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
            Clean listings, flat $99 seller fee & $10 buyer access. Currently most active in Phoenix — listings welcome from anywhere.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sell">
              <button className="trd-btn-primary px-8 py-4 text-lg">
                <Car className="h-5 w-5 mr-2" />
                List Your Toyota ($99)
              </button>
            </Link>
            <Link href="/search">
              <button className="trd-btn-ghost px-8 py-4 text-lg">
                <Search className="h-5 w-5 mr-2" />
                Browse Listings
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="bg-trd-red rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Safe & Secure</h3>
              <p className="text-gray-700 dark:text-gray-200">
                Verified sellers and secure messaging system
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-trd-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Simple Pricing</h3>
              <p className="text-gray-700 dark:text-gray-200">
                $99 seller fee, $10 buyer access. No hidden costs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-trd-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">National Marketplace</h3>
              <p className="text-gray-700 dark:text-gray-200">
                Connect with Toyota enthusiasts across North America
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
