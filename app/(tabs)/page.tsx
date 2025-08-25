import { getSupabaseAdmin } from '@/lib/supabase-server';
import CourseSubjectPicker from '../_components/CourseSubjectPicker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let initialCourses: { id: string; name: string }[] = [];
  try {
    const supa = getSupabaseAdmin();
    const { data } = await supa.from('courses').select('id,name').order('name', { ascending: true });
    initialCourses = data ?? [];
  } catch (_) {}

  return (
    <main className="max-w-md mx-auto p-6 relative">
      <div className="absolute inset-0 z-0 pointer-events-none" />
      <figure className="mx-auto mt-6 w-40 pointer-events-none select-none relative z-0">{/* Buddy */}</figure>
      <div className="mt-10 rounded-2xl border p-5 relative z-20 pointer-events-auto">
        <CourseSubjectPicker initialCourses={initialCourses} />
        <button className="mt-6 w-full rounded-2xl bg-[#176d46] text-white py-3 font-semibold">Inizia subito</button>
      </div>
    </main>
  );
}
