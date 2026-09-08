import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Partner Hub Supabase project values.'
  );
}

// The anon key is meant to be public — Row Level Security policies in
// public/shared/partner-hub-setup.sql are the real security boundary, not
// secrecy of this key. Safe to expose in the client bundle.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
