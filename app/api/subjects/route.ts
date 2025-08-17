export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { getSupabaseClient } from '@/lib/supabase';

function extractCourseId(raw: string | null) {
  if (!raw) return null;
  const dec = decodeURIComponent(raw);
  // UUID classico?
  if (/^[0-9a-fA-F-]{36}$/.test(dec)) return dec;
  // Se arriva accidentalmente JSON, prova a prendere .id
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

    // Fallback: se non c'è UUID ma abbiamo il nome corso, risolvi l'id
    if (!courseId && courseName) {
      const { data: row, error: cErr } = await supabase
        .from('courses')
        .select('id')
        .eq('name', courseName)
        .maybeSingle();
      if (cErr) throw cErr;
      courseId = row?.id || null;
    }

    if (!courseId) {
      return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
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
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 400 });
  }
}
