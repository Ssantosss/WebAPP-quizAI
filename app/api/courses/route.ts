import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  if (!url || !anon) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }
  const sb = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await sb
    .from("courses")
    .select("id,name")
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
