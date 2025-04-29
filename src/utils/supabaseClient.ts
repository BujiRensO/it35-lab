import { createClient } from '@supabase/supabase-js';

// Use hardcoded values if environment variables are missing (for GitHub Pages)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hoyozmnmyevdsqbifpvw.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhveW96bW5teWV2ZHNxYmlmcHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzQyNzQsImV4cCI6MjA1ODM1MDI3NH0.y4SEPxTcQ2tioEToADR5MsBggACojQ-ShW5f5gjzxA4';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',        // Required for GitHub Pages (SPA security)
    persistSession: true,    // Prevents token loss on refresh
    autoRefreshToken: true,  // Handles token refreshes automatically
  }
});