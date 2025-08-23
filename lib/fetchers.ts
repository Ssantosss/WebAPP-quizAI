import { supabaseBrowser } from "@/lib/supabase/browser";
import type { PostgrestResponse } from "@supabase/supabase-js";

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

  // Tipizziamo esplicitamente la risposta del client Supabase
  const res = await withTimeout<PostgrestResponse<Course>>(
    sb.from("courses").select("id,name").order("name", { ascending: true })
  );

  if (res.error) throw res.error;
  return res.data ?? [];
}

export async function loadSubjects(courseId: string): Promise<Subject[]> {
  const sb = supabaseBrowser();

  const res = await withTimeout<PostgrestResponse<Subject>>(
    sb
      .from("subjects")
      .select("id,name,course_id")
      .eq("course_id", courseId)
      .order("name", { ascending: true })
  );

  if (res.error) throw res.error;
  return res.data ?? [];
}
