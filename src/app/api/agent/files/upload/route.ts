import { getSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { teacher_id, title, file_url, file_type, class_level } = body;

  if (!teacher_id || !title || !file_url) {
    return Response.json({ error: "teacher_id, title, file_url requis" }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("resources").insert({
    teacher_id,
    title,
    file_url,
    file_type: file_type || "application/octet-stream",
    class_level: class_level || null,
  }).select("id").single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, file_id: data.id });
}
