import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single Supabase client for a client-side application.
// Note: This is a simplified example. For server-side usage or more complex scenarios,
// consider alternative patterns like passing the client via context or using a server-side client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
