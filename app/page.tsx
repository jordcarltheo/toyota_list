import { Hero } from '@/components/home/hero'
import { Categories } from '@/components/home/categories'
import TRDBanner from '@/components/TRDBanner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

// Force dynamic rendering to avoid static generation issues with cookies
export const dynamic = 'force-dynamic'

export default function HomePage() {

  return (
    <>
      <Header />
      <main className="space-y-10">
        <Hero />
        <div className="mx-4 sm:mx-6 lg:mx-8">
          <TRDBanner />
        </div>
        


        <Categories />
      </main>
      <Footer />
    </>
  )
}
