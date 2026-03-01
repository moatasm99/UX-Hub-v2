import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://psksmlpiqfvafrxqkmps.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBza3NtbHBpcWZ2YWZyeHFrbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjQxNTAsImV4cCI6MjA4NjkwMDE1MH0.vr92alLWaANbqksxCSJBaUzKVhxph6KBoLOYNmjWl_Y'

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Missing Supabase environment variables. ' +
        'Copy .env.example to .env.local and fill in your credentials.'
    )
}

export const supabase = createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || ''
)
