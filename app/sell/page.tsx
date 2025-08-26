"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StepByStepForm } from '@/components/sell/step-by-step-form'

export default function SellPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              List Your Toyota
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create a professional listing in just a few simple steps
            </p>
          </div>
          
          <StepByStepForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
