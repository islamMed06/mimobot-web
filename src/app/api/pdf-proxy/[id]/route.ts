export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "resource";

  const allowed = ["resource", "lesson", "exercise"];
  if (!allowed.includes(type)) {
    return new Response("Invalid type", { status: 400 });
  }

  const table = type === "resource" ? "resources" : `${type}s`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const resp = await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}&select=file_url`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new Response(text, { status: resp.status });
  }

  const rows = await resp.json();
  if (!rows || rows.length === 0) {
    return new Response("Resource not found", { status: 404 });
  }

  const fileUrl: string = rows[0].file_url;
  const pdfResp = await fetch(fileUrl);
  if (!pdfResp.ok) {
    return new Response("Failed to fetch PDF", { status: 502 });
  }

  const blob = await pdfResp.blob();
  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
