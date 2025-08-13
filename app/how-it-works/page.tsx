import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBrandName } from '@/lib/utils'
import { Search, Car, MessageSquare, Handshake, DollarSign, Shield, Users } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    step: '1',
    title: 'Browse & Search',
    description: 'Search through our curated selection of Toyota vehicles across the U.S., Canada, and Mexico. Filter by model, year, price, mileage, and more.',
    icon: Search,
    color: 'bg-blue-500',
    details: [
      'Advanced search filters for easy vehicle discovery',
      'Browse by category: Sedan, SUV, Truck, Van, Hybrid, EV',
      'View detailed photos and specifications',
      'Compare multiple vehicles side by side'
    ]
  },
  {
    step: '2',
    title: 'List Your Car',
    description: 'Create a comprehensive listing with photos, detailed specifications, and honest condition assessment. Pay a simple $99 fee to activate.',
    icon: Car,
    color: 'bg-green-500',
    details: [
      'Easy-to-use listing creation form',
      'Upload multiple high-quality photos',
      'Detailed vehicle specifications',
      'Honest condition assessment',
      '$99 one-time listing fee'
    ]
  },
  {
    step: '3',
    title: 'Connect & Message',
    description: 'Use our secure messaging system to communicate with buyers or sellers. Ask questions, arrange viewings, and negotiate terms safely.',
    icon: MessageSquare,
    color: 'bg-purple-500',
    details: [
      'Secure, private messaging system',
      'Real-time notifications',
      'File sharing for documents',
      'Message history preservation',
      'Safe communication platform'
    ]
  },
  {
    step: '4',
    title: 'Complete Transaction',
    description: 'When ready to buy, pay a $99 buyer fee to access seller contact information and complete your purchase with confidence.',
    icon: Handshake,
    color: 'bg-orange-500',
    details: [
      '$99 buyer fee for access to seller info',
      'Direct communication with seller',
      'Secure payment processing',
      'Transaction completion support',
      'Post-sale assistance'
    ]
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How {getBrandName()} Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 4-step process makes buying and selling Toyota vehicles 
              across North America easy, secure, and efficient.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16 mb-16">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                  <div className="lg:w-1/2">
                    <div className="relative">
                      <div className={`${step.color} rounded-full w-24 h-24 flex items-center justify-center mb-6 mx-auto lg:mx-0`}>
                        <IconComponent className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center lg:text-left">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 text-center lg:text-left">
                      {step.description}
                    </p>
                    <ul className="space-y-2 text-left">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <div className="bg-green-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <IconComponent className="h-16 w-16 mx-auto mb-4" />
                        <p>Step {step.step} Illustration</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fee Structure */}
          <Card className="mb-16">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Simple, Transparent Pricing</CardTitle>
              <p className="text-lg text-gray-600">
                No hidden fees, no percentage commissions. Just two flat fees.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Car className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Seller Fee</h4>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$99</div>
                  <p className="text-gray-600">
                    One-time fee to list your vehicle. No recurring charges, no hidden costs.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Buyer Fee</h4>
                  <div className="text-4xl font-bold text-green-600 mb-2">$99</div>
                  <p className="text-gray-600">
                    One-time fee to access seller contact information and complete your purchase.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Vehicle purchase funds are handled directly between buyer and seller. 
                  Our fees are platform access fees only and do not include vehicle costs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-center">Secure & Safe</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Verified users, secure messaging, and transparent processes ensure 
                  safe transactions for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-center">National Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Built for Toyota enthusiasts across North America, fostering connections 
                  and supporting the automotive market nationwide.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-center">Toyota Focused</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Specialized knowledge and focus on Toyota vehicles ensures 
                  quality and expertise in every transaction.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Join the {getBrandName()} community today and experience the difference 
                a national, Toyota-focused marketplace can make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search">
                  <Button size="lg" className="px-8 py-3">
                    Browse Vehicles
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button size="lg" variant="outline" className="px-8 py-3">
                    List Your Vehicle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
