export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    const { count: coursesCount, error: cErr } = await supabase
      .from('courses').select('*', { count: 'exact', head: true });
    const { count: subjectsCount, error: sErr } = await supabase
      .from('subjects').select('*', { count: 'exact', head: true });

    return new Response(JSON.stringify({
      ok: !cErr && !sErr,
      env: {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      },
      counts: { courses: coursesCount ?? 0, subjects: subjectsCount ?? 0 },
      errors: { courses: cErr?.message ?? null, subjects: sErr?.message ?? null },
    }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 400 });
  }
}
