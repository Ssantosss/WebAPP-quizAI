// app/api/health/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { supaServer } from '@/lib/supabaseServer';

export async function GET() {
  const svc = supaServer({ service: true });
  const [c, s] = await Promise.all([
    svc.from('courses').select('id', { head: true, count: 'exact' }),
    svc.from('subjects').select('id', { head: true, count: 'exact' }),
  ]);
  return NextResponse.json(
    {
      ok: !c.error && !s.error,
      courses: c.count ?? 0,
      subjects: s.count ?? 0,
      usesService: true,
      errCourses: c.error?.message,
      errSubjects: s.error?.message,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
