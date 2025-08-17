// app/(tabs)/page.tsx  — SERVER COMPONENT (niente "use client")
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import BuddyHero from '@/components/BuddyHero';
import CourseSubjectPickerClient from '@/components/CourseSubjectPicker';
import { getSupabaseClient } from '@/lib/supabase';

type Row = { id: string; name: string };

export default async function HomePage() {
  let initialCourses: Row[] = [];
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('courses')
      .select('id,name')
      .order('name', { ascending: true });
    initialCourses = data ?? [];
  } catch {
    // non bloccare la pagina se le ENV mancano: il picker farà fallback client
    initialCourses = [];
  }

  return (
    <main className="flex-1 p-4 pb-32 space-y-6">
      <header className="text-center mt-6">
        <h1 className="h1">Allenati con<br/>Buddy</h1>
      </header>

      <div className="w-full flex justify-center">
        <BuddyHero className="w-48 h-auto" />
      </div>

      <p className="sub text-center">Puoi provare gratis un quiz completo</p>

      <div className="card p-4">
        {/* client component: gestisce materie e CTA */}
        <CourseSubjectPickerClient initialCourses={initialCourses} />
      </div>

      <div className="h-20" />
    </main>
  );
}

