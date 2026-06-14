import { getSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  if (req.headers.get("X-Agent-Secret") !== process.env.SITE_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { email, password, full_name, role, class_level } = body;

  if (!email || !password) {
    return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return Response.json({ error: authError.message }, { status: 500 });

  if (authData.user) {
    await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: full_name || null,
      role: role || "student",
      class_level: class_level || null,
    });
  }

  return Response.json({ success: true, user_id: authData.user?.id });
}
