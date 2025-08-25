import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const course = new URL(req.url).searchParams.get('course');
    if (!course) return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });

    const supa = getSupabaseAdmin();
    const { data, error } = await supa
      .from('subjects')
      .select('id,name,course_id')
      .eq('course_id', course)
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
