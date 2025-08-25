import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  let canQuery = false;
  let error: string | null = null;
  try {
    const supa = getSupabaseAdmin();
    const { error: e } = await supa.from('courses').select('id').limit(1);
    if (e) throw e;
    canQuery = true;
  } catch (e: any) {
    error = String(e?.message ?? e);
  }
  return NextResponse.json(
    { hasUrl, hasServiceKey, canQuery, error },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
