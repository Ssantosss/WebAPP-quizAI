// app/api/courses/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { supaServer } from '@/lib/supabaseServer';

const DEFAULT_COURSES = ['Economia','Informatica','Ingegneria','Scienze della Nutrizione'] as const;

async function ensureSeed() {
  const svc = supaServer({ service: true });

  // Count courses
  const { count, error: cErr } = await svc.from('courses').select('id', { head: true, count: 'exact' });
  if (cErr) throw cErr;

  if ((count ?? 0) > 0) return;

  // Seed courses (slug trigger penserà lui)
  const { error: insErr1 } = await svc.from('courses').upsert(
    DEFAULT_COURSES.map((name) => ({ name, slug: null })),
    { onConflict: 'name', ignoreDuplicates: false }
  );
  if (insErr1) throw insErr1;

  // Link subjects
  const subjectsByCourse: Record<string, string[]> = {
    Economia: ['Microeconomia','Macroeconomia','Statistica'],
    Informatica: ['Algoritmi','Reti','Basi di Dati'],
    Ingegneria: ['Analisi 1','Fisica 1','Chimica'],
    'Scienze della Nutrizione': ['Biochimica','Anatomia','Fisiologia'],
  };

  for (const [courseName, subs] of Object.entries(subjectsByCourse)) {
    const { data: cRow, error: getErr } = await svc
      .from('courses')
      .select('id')
      .eq('name', courseName)
      .maybeSingle();
    if (getErr) throw getErr;
    if (!cRow?.id) continue;

    const payload = subs.map((name) => ({ course_id: cRow.id, name, slug: null }));
    const { error: insErr2 } = await svc.from('subjects').upsert(payload, { onConflict: 'course_id,name' });
    if (insErr2) throw insErr2;
  }
}

export async function GET() {
  try {
    await ensureSeed(); // fa nulla se non serve
    const svc = supaServer({ service: true });
    const { data, error } = await svc.from('courses').select('id,name,slug').order('name');
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
