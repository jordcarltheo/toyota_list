import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100)
}

export function formatMileage(mileage: number) {
  return new Intl.NumberFormat('en-US').format(mileage)
}

export function getBrandName() {
  return process.env.NEXT_PUBLIC_BRAND_NAME || 'Toyota List'
}

export function getAltBrandName() {
  return process.env.NEXT_PUBLIC_ALT_BRAND_NAME || 'Yota List'
}

export function getMarketCity() {
  return process.env.NEXT_PUBLIC_MARKET_CITY || 'U.S., Canada & Mexico'
}
