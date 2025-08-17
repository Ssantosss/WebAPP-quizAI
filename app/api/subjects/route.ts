// app/api/subjects/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { supaServer } from '@/lib/supabaseServer';

const isUuid = (v?: string | null) =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export async function GET(req: NextRequest) {
  try {
    const svc = supaServer({ service: true });
    const { searchParams } = new URL(req.url);
    let courseId = searchParams.get('courseId');
    const slug = searchParams.get('courseSlug');
    const name = searchParams.get('courseName');

    if (!isUuid(courseId)) {
      if (!slug && !name) return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
      const { data: cRow, error: cErr } = await svc
        .from('courses')
        .select('id')
        .limit(1)
        .match(slug ? { slug } : { name })
        .maybeSingle();
      if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });
      courseId = cRow?.id ?? null;
    }

    if (!isUuid(courseId)) return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });

    const { data, error } = await svc
      .from('subjects')
      .select('id,name,slug')
      .eq('course_id', courseId)
      .order('name');
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
