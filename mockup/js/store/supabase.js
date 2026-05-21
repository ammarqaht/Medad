import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
// Found in Project Settings -> API
const SUPABASE_URL = 'https://ckzyoogvpfdizyccjjuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrenlvb2d2cGZkaXp5Y2NqanV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzUzMTQsImV4cCI6MjA5MTE1MTMxNH0.xg9ifz1NcgosXgh-LIYefAViJz1Cg2OWC3gybebKmdQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
