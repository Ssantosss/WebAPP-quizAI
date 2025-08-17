import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Next.js inietta queste stringhe a build-time nel client (inlined)
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

function required<T>(v: T | undefined, name: string): T {
  if (!v) throw new Error(`${name} is missing`);
  return v;
}

export function getSupabaseClient(): SupabaseClient {
  // lato server (route handlers) usiamo le NEXT_PUBLIC, sono ok per SELECT con RLS
  const url = required(PUBLIC_URL, 'NEXT_PUBLIC_SUPABASE_URL');
  const key = required(PUBLIC_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

// fallback lato browser: usa le stesse NEXT_PUBLIC (inlined)
export function getBrowserSupabase(): SupabaseClient {
  const url = required(PUBLIC_URL, 'NEXT_PUBLIC_SUPABASE_URL');
  const key = required(PUBLIC_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}
