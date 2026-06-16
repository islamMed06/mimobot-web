import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

function formatFileSize(bytes: number) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " Mo";
  return (bytes / 1024).toFixed(0) + " Ko";
}

export default async function FichesPedagogiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  let query = supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .gt("price", 0);
  if (params.level)
    query = query.eq("class_level", params.level.toUpperCase());
  query = query.order("created_at", { ascending: false });

  const { data: fiches } = await query;

  const levels = [
    { id: "", label: "Tous", icon: "📋" },
    { id: "1AM", label: "1ère AM", icon: "🌱" },
    { id: "2AM", label: "2ème AM", icon: "📘" },
    { id: "3AM", label: "3ème AM", icon: "🧠" },
    { id: "4AM", label: "4ème AM", icon: "🏆" },
  ];

  return (
    <>
      <Navbar active="fiches" />

      <div className="blob bg-mint w-72 h-72 -top-10 -right-10 opacity-40 fixed"></div>
      <div className="blob bg-blue-light w-56 h-56 -bottom-10 -left-10 opacity-40 fixed"></div>

      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <p className="text-coral font-display font-bold text-sm tracking-widest uppercase mb-2">
            <i className="fa-solid fa-file-pen mr-2"></i> Premium
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            <span className="squiggle-underline text-blue">Fiches pédagogiques</span>
          </h1>
          <p className="text-ink/60 mt-3 max-w-xl mx-auto">
            Documents premium classés par niveau pour approfondir chaque leçon.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {levels.map((l) => (
            <Link
              key={l.id || "all"}
              href={l.id ? `/fiches-pedagogiques?level=${l.id}` : "/fiches-pedagogiques"}
              className={`font-display font-bold text-sm px-5 py-2.5 rounded-full border-2 border-ink transition-all no-underline ${
                params.level === l.id
                  ? "bg-ink text-white shadow-[3px_3px_0px_#FFC857]"
                  : "bg-white text-ink hover:shadow-[3px_3px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5"
              }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        {(!fiches || fiches.length === 0) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-ink/40 font-display text-lg">
              {params.level
                ? "Aucune fiche premium pour ce niveau pour le moment."
                : "Aucune fiche pédagogique disponible pour le moment."}
            </p>
            <p className="text-ink/30 text-sm mt-2">
              Revenez bientôt — de nouvelles fiches sont ajoutées régulièrement.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fiches?.map((f, i) => (
            <div
              key={f.id}
              className={`sticker rounded-2xl p-6 bg-white ${i % 2 === 0 ? "tilt-1" : "tilt-2"}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-coral-light border-2 border-ink flex items-center justify-center text-coral text-xl flex-shrink-0">
                    <i className="fa-regular fa-file-pdf"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display font-bold text-ink truncate">
                      {f.title}
                    </h2>
                    {f.description && (
                      <p className="text-xs text-ink/50 mt-1 line-clamp-2">
                        {f.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                  <span className="bg-blue-light px-2 py-0.5 rounded border border-ink/20">
                    {f.class_level}
                  </span>
                  {f.file_size && (
                    <span className="text-ink/50">
                      <i className="fa-regular fa-file mr-1"></i>
                      {formatFileSize(f.file_size)}
                    </span>
                  )}
                  <span className="text-ink/50">
                    <i className="fa-regular fa-calendar mr-1"></i>
                    {new Date(f.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-coral font-display font-bold text-sm bg-coral-light px-3 py-1 rounded-full border border-ink/20">
                    {f.price} DA
                  </span>
                  <span className="bg-mint-light text-mint text-xs font-bold px-2 py-0.5 rounded border border-ink/20">
                    Premium
                  </span>
                </div>

                <div className="mt-auto">
                  <a
                    href={f.file_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full font-display font-bold text-sm bg-coral text-white px-5 py-2.5 rounded-full border-2 border-ink shadow-[3px_3px_0px_#1A1A2E] hover:shadow-[5px_5px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all no-underline text-center inline-flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i> Télécharger
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-ink text-cream border-t-3 border-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/50">
            <p>&copy; {new Date().getFullYear()} <strong className="text-white">Mimoune Kenza</strong> – Tous droits réservés.</p>
            <p>Fait avec <i className="fa-solid fa-heart text-coral"></i> pour mes élèves</p>
          </div>
        </div>
      </footer>
    </>
  );
}
