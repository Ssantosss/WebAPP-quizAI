import { createClient } from '@supabase/supabase-js';

export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,      // ok anche in server
    process.env.SUPABASE_SERVICE_ROLE_KEY!,     // service_role: route server only
    { auth: { persistSession: false } }
  );
