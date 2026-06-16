import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(_req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentUrl = process.env.AGENT_URL || "http://localhost:10000";
  const res = await fetch(`${agentUrl}/history?user_id=${user.id}`);
  const data = await res.json();
  return NextResponse.json(data);
}
