import { getSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseClient();

  const { data: resource } = await supabase
    .from("resources")
    .select("file_url")
    .eq("id", id)
    .single();

  if (!resource) {
    return new Response("Not found", { status: 404 });
  }

  const resp = await fetch(resource.file_url as string);
  if (!resp.ok) {
    return new Response("Failed to fetch PDF", { status: 502 });
  }

  const blob = await resp.blob();
  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
