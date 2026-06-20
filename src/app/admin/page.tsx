import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const [lessonsRes, exercisesRes, resourcesRes] = await Promise.all([
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("exercises").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
  ]);

  return {
    lessons: lessonsRes.count ?? 0,
    exercises: exercisesRes.count ?? 0,
    resources: resourcesRes.count ?? 0,
  };
}

async function checkBotStatus() {
  try {
    const res = await fetch(`${process.env.AGENT_URL || "https://mimo-bot-ukhy.onrender.com"}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const botOnline = await checkBotStatus();

  const cards = [
    { label: "Leçons", count: stats.lessons, href: "/admin/lessons", color: "bg-blue-50 text-blue-700" },
    { label: "Exercices", count: stats.exercises, href: "/admin/exercises", color: "bg-green-50 text-green-700" },
    { label: "Fiches pédagogiques", count: stats.resources, href: "/admin/resources", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className={`p-6 rounded-xl ${c.color} border border-current/10`}>
            <p className="text-3xl font-bold">{c.count}</p>
            <p className="text-sm mt-1 opacity-80">{c.label}</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-3">Bienvenue sur MimoBot</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Ce panneau d&apos;administration vous permet de gérer le contenu pédagogique
          que vous partagez sur le site. Utilisez le menu à gauche pour ajouter, modifier
          ou publier vos leçons, exercices et ressources.
        </p>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${botOnline ? "bg-green-500" : "bg-red-500"}`}></span>
        <span className="text-sm font-medium text-gray-700">
          {botOnline ? "Connecté" : "Déconnecté"}
        </span>
        <span className="text-sm text-gray-400">@MimoBot_bot</span>
      </div>
    </div>
  );
}
