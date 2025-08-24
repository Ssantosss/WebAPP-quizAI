import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get('course');
  if (!course) {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id,name,course_id')
    .eq('course_id', course)
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
}
