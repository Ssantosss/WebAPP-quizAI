import { createClient } from '@supabase/supabase-js';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supaClient = createClient(URL, ANON, {
  auth: { persistSession: false },
  db: { schema: 'public' },
});
