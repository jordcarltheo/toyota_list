import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TRDBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-white">
      <div
        className="pointer-events-none absolute -left-10 top-6 h-24 w-[140%] -rotate-6"
        style={{ backgroundImage: 'linear-gradient(90deg,#EE1C25 0%, #F99D1C 50%, #FFD100 100%)' }}
        aria-hidden
      />
      <div className="relative px-6 py-10">
        <h2 className="text-2xl font-semibold">List Today. Flat $99 Seller Fee.</h2>
        <p className="mt-2 text-neutral-700">No percentage commissions. $99 buyer fee at purchase.</p>
        <div className="mt-4">
          <Link href="/sell">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              List Your Toyota
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
