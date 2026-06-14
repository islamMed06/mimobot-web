import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function LessonsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PublicNavbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Leçons</h1>
        <p className="text-gray-500 mb-8">Toutes les leçons d&apos;anglais disponibles.</p>

        {(!lessons || lessons.length === 0) && (
          <p className="text-gray-400 py-12 text-center">Aucune leçon publiée pour le moment.</p>
        )}

        <div className="grid gap-4">
          {lessons?.map((l) => (
            <div key={l.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{l.title}</h2>
                  {l.description && <p className="text-sm text-gray-500 mt-1">{l.description}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{l.class_level}</span>
                    {l.duration_minutes && <span>{l.duration_minutes} min</span>}
                    {l.price > 0 && <span className="text-amber-600">{l.price} DA</span>}
                    {l.price === 0 && <span className="text-green-600">Gratuit</span>}
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
