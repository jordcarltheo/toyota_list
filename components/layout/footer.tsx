import Link from 'next/link'
import { getBrandName, getMarketCity } from '@/lib/utils'
import { Car } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">{getBrandName()}</h3>
                <p className="text-sm text-gray-400">{getMarketCity()}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The premier marketplace for Toyota enthusiasts across North America. 
              Buy and sell Toyota vehicles with confidence.
            </p>
            <p className="text-xs text-gray-500">
              Independent marketplace for Toyota owners. Not affiliated with Toyota Motor Corporation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Search Cars
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-300 hover:text-white transition-colors">
                  List Your Car
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-300 hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {getBrandName()}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
