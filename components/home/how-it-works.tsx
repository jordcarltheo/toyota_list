import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Car, MessageSquare, Handshake, DollarSign } from 'lucide-react'

const steps = [
  {
    step: '1',
    title: 'Browse & Search',
    description: 'Search through our curated selection of Toyota vehicles across the U.S., Canada, and Mexico. Filter by model, year, price, and more.',
    icon: Search,
    color: 'bg-blue-500'
  },
  {
    step: '2',
    title: 'List Your Car',
    description: 'Create a detailed listing with photos and specifications. Pay a simple $99 fee to activate your listing.',
    icon: Car,
    color: 'bg-green-500'
  },
  {
    step: '3',
    title: 'Connect & Message',
    description: 'Use our secure messaging system to communicate with buyers or sellers. Ask questions and arrange viewings.',
    icon: MessageSquare,
    color: 'bg-purple-500'
  },
  {
    step: '4',
    title: 'Complete Transaction',
            description: 'When ready to buy, pay a $10 fee for 30-day access to all seller contact information.',
    icon: Handshake,
    color: 'bg-orange-500'
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Our simple 4-step process makes buying and selling Toyota vehicles easy and secure across North America
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <Card key={step.step} className="text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`${step.color} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
                    {step.step}
                  </div>
                </div>
                
                <CardHeader className="pt-8">
                  <div className={`${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-700 dark:text-gray-200 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Fee Structure */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              No hidden fees, no percentage commissions. Just two flat fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seller Fee</h4>
              <div className="text-3xl font-bold text-blue-600">$99</div>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                One-time fee to list your vehicle. No recurring charges.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Buyer Fee</h4>
              <div className="text-3xl font-bold text-green-600">$10</div>
                              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                  30-day access to all seller contact information.
                </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Note:</strong> Vehicle purchase funds are handled directly between buyer and seller. 
              Our fees are platform access fees only.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
