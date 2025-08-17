export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { getSupabaseClient } from '@/lib/supabase';

function extractCourseId(raw: string | null) {
  if (!raw) return null;
  const dec = decodeURIComponent(raw);
  if (/^[0-9a-fA-F-]{36}$/.test(dec)) return dec;
  try {
    const obj = JSON.parse(dec);
    if (Array.isArray(obj) && obj[0]?.id) return String(obj[0].id);
    if (obj && typeof obj === 'object' && 'id' in obj) return String((obj as any).id);
  } catch {}
  return null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let courseId = extractCourseId(url.searchParams.get('courseId'));
    const courseName = url.searchParams.get('courseName');

    const supabase = getSupabaseClient();

    if (!courseId && courseName) {
      const { data: row, error } = await supabase
        .from('courses').select('id').eq('name', courseName).maybeSingle();
      if (error) throw error;
      courseId = row?.id || null;
    }

    if (!courseId) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const { data, error } = await supabase
      .from('subjects')
      .select('id,name')
      .eq('course_id', courseId)
      .order('name', { ascending: true });

    if (error) throw error;

    return new Response(JSON.stringify(data ?? []), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    console.warn('[api/subjects] error:', e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
