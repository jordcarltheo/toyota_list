import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

// Global client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Singleton pattern to prevent multiple client instances
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const createBrowserSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side, return a new client
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side, reuse the same instance
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  return browserClient
}

export const createServerClient = () => {
  return createBrowserClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
  )
}
