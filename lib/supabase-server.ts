import { createClient, type SupabaseClient } from '@supabase/supabase-js';
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing env for Supabase admin');
  _admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return _admin;
}
