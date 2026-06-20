import { getSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseClient();

  const [lessonsRes, exercisesRes, resourcesRes] = await Promise.all([
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("exercises").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    lessons: lessonsRes.count ?? 0,
    exercises: exercisesRes.count ?? 0,
    resources: resourcesRes.count ?? 0,
  });
}
