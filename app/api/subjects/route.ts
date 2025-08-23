import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  if (!url || !anon) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }
  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) return NextResponse.json([]);
  const sb = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await sb
    .from("subjects")
    .select("id,name")
    .eq("course_id", courseId)
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
