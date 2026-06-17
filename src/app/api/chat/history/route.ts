import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return req.cookies.getAll(); } } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentUrl = process.env.AGENT_URL || "http://localhost:10000";
  const telegramAdminId = process.env.TELEGRAM_ADMIN_ID;

  async function fetchHistory(userId: string) {
    try {
      const res = await fetch(`${agentUrl}/history?user_id=${encodeURIComponent(userId)}`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) return [];
      const data = await res.json();
      return data.messages || [];
    } catch { return []; }
  }

  const results = await Promise.all([
    fetchHistory(user.id),
    telegramAdminId ? fetchHistory(telegramAdminId) : Promise.resolve([]),
  ]);

  const seen = new Set<string>();
  const merged = [...results[1], ...results[0]].filter((m: any) => {
    const key = m.role + m.content;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ messages: merged });
}
