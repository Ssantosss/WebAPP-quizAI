// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supaServer(opts?: { service?: boolean }) {
  const useService = !!opts?.service && !!SERVICE;
  const key = useService ? SERVICE! : ANON;
  return createClient(URL, key, { auth: { persistSession: false } });
}
