// lib/supabase/client.ts
"use client";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, assertPublicEnv } from "./env";

assertPublicEnv();

export const supabaseBrowser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  db: { schema: "public" },
});
