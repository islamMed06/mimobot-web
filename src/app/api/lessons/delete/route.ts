import { getSupabaseClient } from "@/lib/supabase-server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const secret = req.headers.get("X-Agent-Secret");
    if (secret !== process.env.SITE_API_SECRET) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  const { id } = await req.json();
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  const { data: lesson, error: fetchError } = await supabase
    .from("lessons")
    .select("file_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    return Response.json({ error: "Leçon introuvable" }, { status: 404 });
  }

  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    + "/storage/v1/object/public/resources/";
  const storagePath = (lesson.file_url as string).replace(storageUrl, "");

  if (storagePath && storagePath !== lesson.file_url) {
    await supabase.storage.from("resources").remove([storagePath]);
  }

  const { error: deleteError } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
