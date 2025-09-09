import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBrandName, getMarketCity } from '@/lib/utils'
import { Car, Shield, Users, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About {getBrandName()}
            </h1>
            <p className="text-xl text-gray-600">
              The premier marketplace for Toyota enthusiasts across {getMarketCity()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To create a trusted, national marketplace where Toyota owners can buy and sell 
                  vehicles with confidence, connecting enthusiasts across North America.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Trust & Safety</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We prioritize safety and trust through verified users, 
                  and transparent fee structures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Community Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built for Toyota enthusiasts across North America, fostering connections 
                  and supporting the automotive market nationwide.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>National Reach</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Currently most active in Phoenix, with listings welcome from anywhere.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Why Choose {getBrandName()}?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Simple Fee Structure</h4>
                  <p className="text-gray-600">
                    $99 seller fee and $10 buyer access. No hidden costs, no percentage commissions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">National Marketplace</h4>
                  <p className="text-gray-600">
                    Connect with Toyota enthusiasts nationwide.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Secure Communication</h4>
                  <p className="text-gray-600">
                    Built-in messaging system for safe communication between buyers and sellers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                  <p className="text-gray-600">
                    Focus on Toyota vehicles ensures expertise and quality in every transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-4">
                Join the {getBrandName()} community today and experience the difference 
                a national, Toyota-focused marketplace can make.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/search"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Vehicles
                </a>
                <a
                  href="/sell"
                  className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  List Your Vehicle
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
