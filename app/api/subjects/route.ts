// app/api/subjects/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

const isUuid = (v?: string | null) =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let courseId   = searchParams.get('courseId');
  const slug     = searchParams.get('courseSlug');
  const name     = searchParams.get('courseName');

  const client = sb();

  try {
    // Se courseId non valido, prova a risolvere tramite slug o name
    if (!isUuid(courseId)) {
      let q = client.from('courses').select('id').limit(1);
      if (slug) q = q.eq('slug', slug);
      else if (name) q = q.eq('name', name);
      else return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });

      const { data: cRow, error: cErr } = await q.maybeSingle();
      if (cErr) {
        return new Response(JSON.stringify({ error: cErr.message }), { status: 400 });
      }
      courseId = cRow?.id ?? null;
    }

    if (!isUuid(courseId)) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const { data, error } = await client
      .from('subjects')
      .select('id,name,slug')
      .eq('course_id', courseId)
      .order('name');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data ?? []), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500 });
  }
}
