import { supabaseBrowser } from "@/lib/supabase/browser";

export type Course = { id: string; name: string };
export type Subject = { id: string; name: string; course_id: string };

async function withTimeout<T>(p: Promise<T>, ms = 3500): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

export async function loadCourses(): Promise<Course[]> {
  const sb = supabaseBrowser();
  const { data, error } = await withTimeout(
    sb.from("courses").select("id,name").order("name", { ascending: true })
  );
  if (error) throw error;
  return data ?? [];
}

export async function loadSubjects(courseId: string): Promise<Subject[]> {
  const sb = supabaseBrowser();
  const { data, error } = await withTimeout(
    sb
      .from("subjects")
      .select("id,name,course_id")
      .eq("course_id", courseId)
      .order("name", { ascending: true })
  );
  if (error) throw error;
  return data ?? [];
}

// RLS hardening: ensure only SELECT policies exist
// -- NON creare policy di INSERT/UPDATE/DELETE
