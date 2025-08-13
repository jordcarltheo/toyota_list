import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Truck, Users, Zap, Leaf, Wrench } from 'lucide-react'

const categories = [
  {
    name: 'Sedans',
    description: 'Camry, Corolla, Avalon, and more',
    icon: Car,
    href: '/search?body_type=Sedan',
    color: 'bg-blue-500'
  },
  {
    name: 'SUVs',
    description: 'RAV4, Highlander, 4Runner, and more',
    icon: Car,
    href: '/search?body_type=SUV',
    color: 'bg-green-500'
  },
  {
    name: 'Trucks',
    description: 'Tacoma, Tundra, and more',
    icon: Truck,
    href: '/search?body_type=Truck',
    color: 'bg-orange-500'
  },
  {
    name: 'Vans',
    description: 'Sienna and more',
    icon: Users,
    href: '/search?body_type=Van',
    color: 'bg-purple-500'
  },
  {
    name: 'Hybrids',
    description: 'Prius, Camry Hybrid, RAV4 Hybrid, and more',
    icon: Leaf,
    href: '/search?fuel=Hybrid',
    color: 'bg-emerald-500'
  },
  {
    name: 'Electric',
    description: 'bZ4X and more',
    icon: Zap,
    href: '/search?fuel=EV',
    color: 'bg-yellow-500'
  }
]

export function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect Toyota for your needs across all body types and fuel options, available nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className={`${category.color} rounded-full w-12 h-12 flex items-center justify-center mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/search">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
