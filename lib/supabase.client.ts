import { createClient } from '@supabase/supabase-js';

let browserClient: ReturnType<typeof createClient> | null = null;

export function getBrowserSupabase() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Non blocchiamo l'app: il picker farà fallback sulle API interne
    console.warn('Supabase env mancanti, userò fallback API.');
    return null as any;
  }
  browserClient = createClient(url, key, {
    auth: { persistSession: false, detectSessionInUrl: false },
  });
  return browserClient;
}
