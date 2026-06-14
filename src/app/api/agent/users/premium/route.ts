import { getSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { user_id, premium } = await req.json();
  if (!user_id) return Response.json({ error: "user_id requis" }, { status: 400 });

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: premium ? "teacher" : "student" })
    .eq("id", user_id)
    .select("id, email, full_name, role")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, user: data });
}
