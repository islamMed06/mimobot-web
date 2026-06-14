import { getSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ files: data });
}
