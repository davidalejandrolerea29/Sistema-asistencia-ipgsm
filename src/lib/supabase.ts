import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables would typically be set in a .env file
// For development purposes, we're hardcoding them here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);