import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single Supabase client for a client-side application.
// We handle missing variables gracefully during build time and to prevent lag
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
)

if (!isConfigured) {
  console.warn('Supabase is not configured. Some features will be disabled to prevent system lag.')
}
