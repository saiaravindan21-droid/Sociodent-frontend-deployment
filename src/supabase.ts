import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://avcpacexgcsjuhbwnryo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Y3BhY2V4Z2NzanVoYnducnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTIwOTEsImV4cCI6MjA2MzU2ODA5MX0.R8pKn5qOhtdFA41t5QwT0kZqf2cJ7YKCJgG-d-QfYKM';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
