import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Shield, AlertTriangle, CheckCircle, Users, Car, CreditCard, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SafetyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Safety Tips
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your safety is our priority. Follow these guidelines to ensure secure and successful transactions on ToyotaList.com
            </p>
          </div>

          {/* General Safety */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              General Safety Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Meet in Public Places</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Always meet in well-lit, public locations like shopping center parking lots, police station parking lots, or busy coffee shops.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Bring a Friend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Never meet strangers alone. Bring a friend or family member with you for added safety and support.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Trust Your Instincts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    If something feels off, don&apos;t proceed with the transaction. Your safety comes first.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Buyers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Safety Tips for Buyers
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-green-600" />
                    <CardTitle>Vehicle Inspection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Always inspect the vehicle in person before purchasing</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Request a vehicle history report (Carfax, etc.)</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Test drive the vehicle on various road conditions</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Have a trusted mechanic inspect the vehicle</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <CardTitle>Payment Safety</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Use secure payment methods (bank transfer, cashier&apos;s check)</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Never send money before seeing the vehicle</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Get a bill of sale and proper documentation</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Verify the seller&apos;s identity and vehicle ownership</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Sellers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Safety Tips for Sellers
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <CardTitle>Meeting Buyers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Meet in public, well-lit locations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Bring a friend or family member</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Don&apos;t let strangers test drive alone</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Keep your personal information private</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <CardTitle>Red Flags to Watch For</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Buyers who refuse to meet in person</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Requests for personal financial information</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Pressure to complete transactions quickly</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">Unusual payment methods or requests</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Safety Measures */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Additional Safety Measures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Location Safety</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Choose safe meeting spots</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Communication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Keep records of all interactions</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get everything in writing</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Trust Your Gut</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">If unsure, walk away</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-3">
                If you feel unsafe or encounter suspicious behavior during a transaction:
              </p>
              <ul className="text-red-700 dark:text-red-300 space-y-1">
                <li>• Immediately leave the location</li>
                <li>• Contact local law enforcement if necessary</li>
                <li>• Report the incident to us at support@toyotalist.com</li>
                <li>• Trust your instincts - your safety is paramount</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
