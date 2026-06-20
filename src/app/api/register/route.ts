import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_KEY!;

async function callSupabase(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
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

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, userType } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    // Create auth user with email_confirm: true so they can log in immediately
    const authRes = await callSupabase("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      }),
    });
    const authUser = await authRes.json();

    // Insert profile with service role (bypasses RLS)
    await callSupabase("/rest/v1/profiles", {
      method: "POST",
      body: JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        full_name: fullName || null,
        role: "free",
        user_type: userType || "student",
      }),
    });

    return NextResponse.json({ ok: true, user: authUser });
  } catch (e: any) {
    console.error("Register error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
