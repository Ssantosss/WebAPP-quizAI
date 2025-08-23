// lib/api.ts
export type Course = { id: string; name: string };
export type Subject = { id: string; name: string; course_id: string };

export async function getCourses(): Promise<Course[]> {
  const r = await fetch("/api/courses", { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getSubjects(courseId: string): Promise<Subject[]> {
  const r = await fetch(`/api/subjects?courseId=${encodeURIComponent(courseId)}`, {
    cache: "no-store",
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
