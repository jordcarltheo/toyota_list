/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'toyota-list-.*-jordan-theobalds-projects.vercel.app',
          },
        ],
        destination: 'https://www.toyotalist.com',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    formats: ['image/webp'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
