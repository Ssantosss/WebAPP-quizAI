import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  let canQuery = false;
  let rows = 0;
  let error: string | null = null;

  try {
    const supa = getSupabaseAdmin();
    const { data, error: e } = await supa.from('courses').select('id', { count: 'exact', head: false });
    if (e) throw e;
    canQuery = true;
    rows = Array.isArray(data) ? data.length : 0;
  } catch (e: any) {
    error = String(e?.message ?? e);
  }

  return NextResponse.json(
    { env: { hasUrl, hasServiceKey }, supabase: { canQuery, rows, error } },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
