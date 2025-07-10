import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ajulkyowwgrpkjlccppw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdWxreW93d2dycGtqbGNjcHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODExNTMsImV4cCI6MjA2Nzc1NzE1M30.2yz_yROQpXFJHpNLksevDHOoow7IoDi2hvD9BIYeJTc'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})