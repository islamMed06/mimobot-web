import { getSupabaseClient } from "@/lib/supabase-server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return Response.json({ error: "Content-Type must be multipart/form-data" }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const secret = req.headers.get("X-Agent-Secret");
    if (secret !== process.env.SITE_API_SECRET) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "Fichier requis" }, { status: 400 });

  const title = (formData.get("title") as string) || file.name;
  const description = formData.get("description") as string | null;
  const class_level = formData.get("class_level") as string | null;
  const price = parseFloat((formData.get("price") as string) || "0");
  const tags = (formData.get("tags") as string) || "";

  if (file.size > 50 * 1024 * 1024) {
    return Response.json({ error: "Fichier trop volumineux (max 50 MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const mimeToType: Record<string, string> = {
    "application/pdf": "pdf",
    "image/png": "image",
    "image/jpeg": "image",
    "image/webp": "image",
    "audio/mpeg": "audio",
    "audio/mp4": "audio",
    "video/mp4": "video",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  };
  const file_type = mimeToType[file.type] || "other";

  const rand = Math.random().toString(36).slice(2, 10);
  const fileName = `${Date.now()}-${rand}.${ext}`;
  const filePath = class_level ? `exercises/${class_level}/${fileName}` : `exercises/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: storageError } = await supabase.storage
    .from("resources")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    return Response.json({ error: `Erreur upload: ${storageError.message}` }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("resources")
    .getPublicUrl(filePath);

  const { data: exercise, error: dbError } = await supabase
    .from("exercises")
    .insert({
      title,
      description: description || null,
      file_url: publicUrl,
      file_type,
      file_size: file.size,
      class_level: class_level || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      published: false,
      price,
    })
    .select("id, title, file_url, file_type, file_size, class_level, published, price, created_at")
    .single();

  if (dbError) {
    await supabase.storage.from("resources").remove([filePath]);
    return Response.json({ error: `Erreur base de données: ${dbError.message}` }, { status: 500 });
  }

  return Response.json({ success: true, resource: exercise });
}
