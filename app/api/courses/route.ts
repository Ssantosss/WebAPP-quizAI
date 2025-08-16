import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('courses')
    .select('id,name')
    .order('name', { ascending: true });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' }
  });
}
