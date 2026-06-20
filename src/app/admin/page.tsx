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

export default async function AdminDashboard() {
  const stats = await getStats();

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
        <h2 className="font-semibold mb-4">Emploi du temps</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 p-2 text-left font-semibold text-gray-600 min-w-[80px]">Horaire</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Samedi</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Dimanche</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Lundi</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Mardi</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Mercredi</th>
                <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">Jeudi</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: "08:00 – 09:00", slots: ["", "", "", "", "", ""] },
                { time: "09:00 – 10:00", slots: ["4AM · Anglais", "", "3AM · Anglais", "", "2AM · Anglais", ""] },
                { time: "10:00 – 11:00", slots: ["", "", "3AM · Anglais", "", "", ""] },
                { time: "11:00 – 12:00", slots: ["4AM · Anglais", "", "", "", "2AM · Anglais", ""] },
                { time: "12:00 – 13:00", slots: ["", "", "", "", "", ""] },
                { time: "13:00 – 14:00", slots: ["", "1AM · Anglais", "", "1AM · Anglais", "", ""] },
                { time: "14:00 – 15:00", slots: ["", "1AM · Anglais", "", "", "", ""] },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-200 p-2 text-gray-500 font-medium text-xs whitespace-nowrap">{row.time}</td>
                  {row.slots.map((cell, j) => (
                    <td key={j} className={`border border-gray-200 p-2 text-center ${cell ? "bg-blue-50 text-blue-700 font-medium text-xs rounded" : "text-gray-300 text-xs"}`}>
                      {cell || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3"><i className="fa-regular fa-pen-to-square mr-1"></i> Modifiable dans <code className="bg-gray-100 px-1 rounded">src/app/admin/page.tsx</code></p>
      </div>
    </div>
  );
}
