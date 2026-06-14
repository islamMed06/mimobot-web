import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ResourcesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PublicNavbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Ressources</h1>
        <p className="text-gray-500 mb-8">Fiches, documents et supports à télécharger.</p>

        {(!resources || resources.length === 0) && (
          <p className="text-gray-400 py-12 text-center">Aucune ressource publiée pour le moment.</p>
        )}

        <div className="grid gap-4">
          {resources?.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{r.title}</h2>
                  {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="uppercase">{r.file_type}</span>
                    {r.file_size && <span>{(r.file_size / 1024).toFixed(0)} Ko</span>}
                    <span>{r.class_level}</span>
                    {r.price > 0 ? <span className="text-amber-600">{r.price} DA</span> : <span className="text-green-600">Gratuit</span>}
                  </div>
                </div>
                <a
                  href={r.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
