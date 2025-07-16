import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dbhdwiwomgzhtrodccsi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGR3aXdvbWd6aHRyb2RjY3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTU1ODcsImV4cCI6MjA2NzEzMTU4N30.Ahyx9_9imyrut5h1Hn-dJ0HTiz-w4w1bHWPOV0PY8u0'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})