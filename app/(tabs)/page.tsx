import BuddyHero from '@/components/BuddyHero';
import CourseSubjectPickerClient from '@/components/CourseSubjectPicker';
import { getSupabaseClient } from '@/lib/supabase';

export default async function HomePage() {
  const supabase = getSupabaseClient();
  const { data: initialCourses = [] } = await supabase
    .from('courses')
    .select('id,name')
    .order('name', { ascending: true });

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
        <CourseSubjectPickerClient initialCourses={initialCourses} />
      </div>

      <div className="h-20" />
    </main>
  );
}
