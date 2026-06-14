import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const typeLabels: Record<string, string> = {
  multiple_choice: "QCM",
  fill_blank: "Texte à trous",
  matching: "Association",
  writing: "Rédaction",
};

export default async function ExercisesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PublicNavbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Exercices</h1>
        <p className="text-gray-500 mb-8">Exercices d&apos;anglais par niveau.</p>

        {(!exercises || exercises.length === 0) && (
          <p className="text-gray-400 py-12 text-center">Aucun exercice publié pour le moment.</p>
        )}

        <div className="grid gap-4">
          {exercises?.map((e) => (
            <div key={e.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{e.title}</h2>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{typeLabels[e.type] || e.type}</span>
                    <span>{e.class_level}</span>
                    {e.price > 0 ? <span className="text-amber-600">{e.price} DA</span> : <span className="text-green-600">Gratuit</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
