import { getSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = getSupabaseClient();

  const { count: users } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: lessons } = await supabase.from("lessons").select("*", { count: "exact", head: true });
  const { count: exercises } = await supabase.from("exercises").select("*", { count: "exact", head: true });
  const { count: resources } = await supabase.from("resources").select("*", { count: "exact", head: true });

  return Response.json({
    stats: {
      users: users || 0,
      lessons: lessons || 0,
      exercises: exercises || 0,
      resources: resources || 0,
    },
  });
}
