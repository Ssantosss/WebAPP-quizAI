import HomeClient from './HomeClient';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let initialCourses: { id: string; name: string }[] = [];
  try {
    const supa = getSupabaseAdmin();
    const { data, error } = await supa
      .from('courses')
      .select('id,name')
      .order('name', { ascending: true });
    if (error) throw error;
    initialCourses = data ?? [];
  } catch (e) {
    console.error('Server load courses failed:', e);
  }
  return <HomeClient initialCourses={initialCourses} />;
}
