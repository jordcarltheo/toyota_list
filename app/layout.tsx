import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/auth-provider'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_BRAND_NAME || 'Toyota List',
  description: 'Buy & Sell Toyotas Across the U.S., Canada, and Mexico. Toyota marketplace, Toyota classified ads, buy and sell Toyotas, Toyota cars and trucks. Simple $99 seller fee & $10 buyer access.',
  keywords: 'Toyota marketplace, Toyota classified ads, buy and sell Toyotas, Toyota cars and trucks, Canada, Mexico, Toyota vehicles, Toyota marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var ls = localStorage.getItem('theme');
    var d = document.documentElement.classList;
    if (ls === 'dark' || (!ls && window.matchMedia('(prefers-color-scheme: dark)').matches)) d.add('dark');
  } catch (e) {}
})();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}>
        <header className="border-b bg-white dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">Toyota List</a>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/sell" className="trd-btn-primary">List Your Toyota ($99)</a>
              <ThemeToggle />
            </nav>
          </div>
          <div className="bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 text-xs py-2">
            <div className="mx-auto max-w-6xl px-4">
              Independent marketplace for Toyota owners. Not affiliated with Toyota Motor Corporation.
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 dark:text-neutral-400">© {new Date().getFullYear()} Toyota List</footer>
      </body>
    </html>
  )
}
