import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toyota List - Literally...a list of Toyotas',
  description: 'Literally...a list of Toyotas. Buy & Sell Toyotas Across the U.S., Canada, and Mexico. Simple $99 seller fee & $10 buyer access.',
  keywords: 'Toyota marketplace, Toyota classified ads, buy and sell Toyotas, Toyota cars and trucks, Canada, Mexico, Toyota vehicles, Toyota marketplace',
  openGraph: {
    title: 'Toyota List - Literally...a list of Toyotas',
    description: 'Literally...a list of Toyotas. Buy & Sell Toyotas Across the U.S., Canada, and Mexico.',
    url: 'https://www.toyotalist.com',
    siteName: 'Toyota List',
    images: [
      {
        url: '/favicon.svg',
        width: 32,
        height: 32,
        alt: 'Toyota List Racing Stripes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Toyota List - Literally...a list of Toyotas',
    description: 'Literally...a list of Toyotas. Buy & Sell Toyotas Across the U.S., Canada, and Mexico.',
    images: ['/favicon.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  )
}
