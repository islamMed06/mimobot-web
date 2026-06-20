import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_KEY!;

async function callSupabaseRest(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res;
}

async function isAdminUser(req: NextRequest) {
  const supabase = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return req.cookies.getAll(); } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin";
}

export async function GET(req: NextRequest) {
  if (!(await isAdminUser(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const res = await callSupabaseRest("profiles?select=*&order=created_at.desc");
    const users = await res.json();
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminUser(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, role } = await req.json();
    await callSupabaseRest(`profiles?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminUser(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();

    // Delete profile first
    await callSupabaseRest(`profiles?id=eq.${id}`, { method: "DELETE" });

    // Delete auth user via Admin API
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });
    if (!res.ok) { const e = await res.text(); throw new Error(e); }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
