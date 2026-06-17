import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function createAdminClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { cookies: { getAll() { return req.cookies.getAll(); } } }
  );
}

async function requireAdmin(req: NextRequest) {
  const supabase = createAdminClient(req);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return supabase;
}

export async function GET(req: NextRequest) {
  const supabase = await requireAdmin(req);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const supabase = await requireAdmin(req);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, role } = await req.json();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
