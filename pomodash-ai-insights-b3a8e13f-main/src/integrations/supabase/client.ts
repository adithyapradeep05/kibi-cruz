
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lqkugoxbejemcwjfjuik.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxa3Vnb3hiZWplbWN3amZqdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjIwNTIsImV4cCI6MjA1OTk5ODA1Mn0.cL0P-ZF0E6Xq4KROjJWk2OFX5URGGRDcVBDkb6tgE7o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
