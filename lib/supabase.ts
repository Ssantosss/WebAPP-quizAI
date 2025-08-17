import { createClient, SupabaseClient } from '@supabase/supabase-js';

function required<T>(v: T | undefined, name: string): T {
  if (!v) throw new Error(`${name} is missing`);
  return v;
}

export function getSupabaseClient(): SupabaseClient {
  const url = required(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
  const key = required(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

// Per il fallback client-side
export function getBrowserSupabase(): SupabaseClient {
  const url = (process as any).env?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = (process as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env not available in browser');
  return createClient(url, key, { auth: { persistSession: false } });
}
