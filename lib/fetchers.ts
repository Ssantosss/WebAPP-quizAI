// lib/fetchers.ts
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { PostgrestResponse } from "@supabase/supabase-js";

export type Course = { id: string; name: string };
export type Subject = { id: string; name: string; course_id: string };

// Timeout generico che preserva i tipi
async function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

export async function loadCourses(): Promise<Course[]> {
  const sb = supabaseBrowser();

  // NON destrutturare direttamente il risultato di withTimeout (sarebbe unknown)
  // Usiamo .returns<Course[]>() per tipizzare la risposta di Supabase
  const res: PostgrestResponse<Course[]> = await withTimeout(
    sb.from("courses").select("id,name").order("name", { ascending: true }).returns<Course[]>()
  );

  if (res.error) throw res.error;
  return res.data ?? [];
}

export async function loadSubjects(courseId: string): Promise<Subject[]> {
  const sb = supabaseBrowser();

  const res: PostgrestResponse<Subject[]> = await withTimeout(
    sb
      .from("subjects")
      .select("id,name,course_id")
      .eq("course_id", courseId)
      .order("name", { ascending: true })
      .returns<Subject[]>()
  );

  if (res.error) throw res.error;
  return res.data ?? [];
}
