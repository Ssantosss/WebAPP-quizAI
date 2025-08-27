import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  const U = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let ok = false, rows = 0, error: string | null = null;
  try {
    if (!U || !K) throw new Error('ENV missing');
    const res = await fetch(`${U}/rest/v1/courses?select=id`, {
      headers: { apikey: K, Authorization: `Bearer ${K}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = await res.json();
    ok = true; rows = Array.isArray(data) ? data.length : 0;
  } catch (e:any) { error = e.message ?? String(e); }

  return NextResponse.json(
    { env: { hasUrl: !!U, hasAnon: !!K }, supabase: { ok, rows, error } },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
