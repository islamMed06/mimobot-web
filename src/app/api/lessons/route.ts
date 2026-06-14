import { getSupabaseClient } from "@/lib/supabase-server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const classLevel = req.nextUrl.searchParams.get("class_level");

  let query = supabase.from("lessons").select("*").eq("teacher_id", user.id);
  if (classLevel) query = query.eq("class_level", classLevel);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lessons: data });
}
