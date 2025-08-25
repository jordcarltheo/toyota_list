"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getBrandName, getMarketCity } from '@/lib/utils'
import { Car, Menu, X, Plus } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ToyotaList.com</h1>
              <p className="text-xs text-gray-500 dark:text-gray-300 italic">Real sellers. Real buyers. All Toyotas.</p>
            </div>
          </Link>



          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              Search
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              How it Works
            </Link>
            
            <Link href="/sell">
              <Button size="sm" className="flex items-center space-x-2 trd-btn-primary">
                <Plus className="h-4 w-4" />
                <span>List Your Toyota</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-neutral-700 py-4 bg-white dark:bg-neutral-900">
            <div className="px-2 space-y-1">
              <Link
                href="/search"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              
              <Link
                href="/sell"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                List Your Toyota
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
