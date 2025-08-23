export type Course = { id: string; name: string };
export type Subject = { id: string; name: string; course_id: string };

function ensureEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    const msg =
      "Env mancanti: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Impostale in Vercel (Production + Preview) e redeploy.";
    // Log utile solo in client console; non interrompere build di Next.
    console.error(msg, { url, hasKey: !!key });
    throw new Error(msg);
  }
  return { url, key };
}

export async function fetchCourses(): Promise<Course[]> {
  const { url, key } = ensureEnv();
  const res = await fetch(`${url}/rest/v1/courses?select=id,name&order=name.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchSubjects(courseId: string): Promise<Subject[]> {
  const { url, key } = ensureEnv();
  const res = await fetch(
    `${url}/rest/v1/subjects?select=id,name,course_id&course_id=eq.${courseId}&order=name.asc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
