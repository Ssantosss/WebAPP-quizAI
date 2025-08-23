// lib/fetchers.ts
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export type Course = { id: string; name: string };
export type Subject = { id: string; name: string; course_id: string };

// ✅ Versione tipizzata, senza withTimeout né destrutturazioni da Promise “unknown”
export async function loadCourses(): Promise<Course[]> {
  const sb = supabaseBrowser();

  const res: PostgrestSingleResponse<Course[]> = await sb
    .from("courses")
    .select("id,name")
    .order("name", { ascending: true })
    .returns<Course[]>(); // tipizza i dati

  if (res.error) throw res.error;
  return res.data ?? [];
}

export async function loadSubjects(courseId: string): Promise<Subject[]> {
  const sb = supabaseBrowser();

  const res: PostgrestSingleResponse<Subject[]> = await sb
    .from("subjects")
    .select("id,name,course_id")
    .eq("course_id", courseId)
    .order("name", { ascending: true })
    .returns<Subject[]>(); // tipizza i dati

  if (res.error) throw res.error;
  return res.data ?? [];
}
