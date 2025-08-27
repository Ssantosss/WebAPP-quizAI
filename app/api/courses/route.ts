import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supa = supabaseServer();
    const { data, error } = await supa.from('courses').select('id,name').order('name', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
