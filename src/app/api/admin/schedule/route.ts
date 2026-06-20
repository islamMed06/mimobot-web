import { getSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SCHEDULE = [
  { time: "08:00 – 09:00", slots: ["", "", "", "", "", ""] },
  { time: "09:00 – 10:00", slots: ["", "", "", "", "", ""] },
  { time: "10:00 – 11:00", slots: ["", "", "", "", "", ""] },
  { time: "11:00 – 12:00", slots: ["", "", "", "", "", ""] },
  { time: "12:00 – 13:00", slots: ["", "", "", "", "", ""] },
  { time: "13:00 – 14:00", slots: ["", "", "", "", "", ""] },
  { time: "14:00 – 15:00", slots: ["", "", "", "", "", ""] },
];

export async function GET() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("teacher_schedule")
    .select("schedule_data")
    .eq("id", 1)
    .single();

  if (error || !data || !Array.isArray(data.schedule_data) || data.schedule_data.length === 0) {
    const supabase2 = getSupabaseClient();
    await supabase2.from("teacher_schedule").upsert(
      { id: 1, schedule_data: DEFAULT_SCHEDULE, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
    return NextResponse.json({ schedule: DEFAULT_SCHEDULE });
  }

  return NextResponse.json({ schedule: data.schedule_data });
}

export async function PUT(req: NextRequest) {
  const supabase = getSupabaseClient();
  const body = await req.json();
  const schedule = body.schedule;

  if (!Array.isArray(schedule)) {
    return NextResponse.json({ error: "Invalid schedule data" }, { status: 400 });
  }

  const { error } = await supabase.from("teacher_schedule").upsert(
    { id: 1, schedule_data: schedule, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
