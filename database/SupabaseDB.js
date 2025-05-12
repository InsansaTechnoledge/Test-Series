// database/supabase.connect.js
import { createClient } from '@supabase/supabase-js';

let supabase = null;

const connectToSupabase = async () => {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    );
    console.log('✅ Connected to Supabase');
  } catch (e) {
    console.error('❌ Failed to connect to Supabase', e.message);
  }
};

const getSupabaseClient = () => {
  if (!supabase) throw new Error('Supabase client not initialized yet');
  return supabase;
};

export { connectToSupabase, getSupabaseClient };
