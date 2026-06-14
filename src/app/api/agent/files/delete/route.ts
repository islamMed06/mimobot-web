import { getSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { file_id } = await req.json();
  if (!file_id) return Response.json({ error: "file_id requis" }, { status: 400 });

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("resources").delete().eq("id", file_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
