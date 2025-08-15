# Toyota List - National Toyota Marketplace

A production-quality MVP marketplace for buying and selling Toyota vehicles across the U.S., Canada, and Mexico. Built with Next.js 14, Supabase, and Stripe.

## Features

- **Simple Fee Structure**: $99 seller listing fee, $10 buyer access (30 days)
- **National Reach**: Marketplace covering the U.S., Canada, and Mexico
- **Secure Messaging**: Built-in messaging system between buyers and sellers
- **Image Management**: Server-side image compression and optimization
- **Admin Panel**: Manage listings, users, and moderate content
- **Brand Flexibility**: Easy to switch between "Toyota List" and "Yota List"

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security, Storage)
- **Payments**: Stripe (Checkout for fees)
- **Images**: Sharp for server-side compression
- **Email**: Resend (optional)
- **Maps**: Google Maps API (optional)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd toyota-list
pnpm install
```

### 2. Environment Setup

Copy the environment template and fill in your keys:

```bash
cp env.example .env.local
```

Required environment variables:

```bash
# Brand Configuration
NEXT_PUBLIC_BRAND_NAME="Toyota List"
NEXT_PUBLIC_ALT_BRAND_NAME="Yota List"
NEXT_PUBLIC_MARKET_CITY="U.S., Canada & Mexico"

# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Fees (in cents)
SELLER_FEE_CENTS=9900
BUYER_FEE_CENTS=9900
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the database migrations:

```bash
pnpm db:push
```

3. Set up Storage bucket `listing-images` (public read)

### 4. Stripe Setup

1. Create a Stripe account
2. Get your API keys
3. Set up webhook endpoint: `/api/stripe/webhook`
4. Configure webhook events:
   - `checkout.session.completed`

### 5. Seed the Database

```bash
pnpm seed
```

This creates sample Toyota listings for testing purposes.

### 6. Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
toyota-list/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── home/              # Home page components
│   └── providers/         # Context providers
├── lib/                    # Utility functions
├── types/                  # TypeScript types
├── supabase/               # Database migrations
├── scripts/                # Database scripts
└── hooks/                  # Custom React hooks
```

## Database Schema

### Core Tables

- **profiles**: User profiles and roles
- **listings**: Vehicle listings with all details
- **listing_photos**: Images for each listing
- **messages**: Communication between users
- **orders**: Buyer fee transactions
- **payments**: Seller fee transactions

### Row Level Security (RLS)

- Users can only access their own data
- Public read access to active listings
- Admin access to all data
- Secure messaging between parties

## Business Logic

### Seller Flow

1. User creates listing (status: draft)
2. User pays $99 seller fee via Stripe
3. Webhook marks payment as paid
4. Listing becomes active and visible

### Buyer Flow

1. User views active listing
2. User pays $10 buyer access fee via Stripe (30-day access)
3. User gets seller contact information
4. Messaging thread opens automatically

## API Routes

- `/api/stripe/webhook` - Stripe webhook handler
- `/api/listings` - CRUD operations for listings
- `/api/upload` - Image upload and processing
- `/api/messages` - Messaging system

## Deployment

### Vercel (Frontend)

```bash
pnpm build
vercel --prod
```

### Supabase (Backend)

Database and storage are automatically deployed with Supabase.

## Customization

### Brand Changes

To switch from "Toyota List" to "Yota List":

```bash
# In .env.local
NEXT_PUBLIC_BRAND_NAME="Yota List"
NEXT_PUBLIC_ALT_BRAND_NAME="Toyota List"
```

### Fee Changes

```bash
# In .env.local
SELLER_FEE_CENTS=7900  # $79
BUYER_FEE_CENTS=7900   # $79
```

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format with Prettier
pnpm type-check   # Run TypeScript check
pnpm db:push      # Push database changes
pnpm seed         # Seed database with demo data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Note**: This is an independent marketplace for Toyota owners. Not affiliated with Toyota Motor Corporation.
