import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('id,name')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
}
