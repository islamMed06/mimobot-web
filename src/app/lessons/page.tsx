import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

export default async function LessonsPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  let query = supabase.from("lessons").select("*").eq("published", true);
  if (params.level) query = query.eq("class_level", params.level.toUpperCase());
  query = query.order("created_at", { ascending: false });

  const { data: lessons } = await query;

  const levels = [
    { id: "1AM", label: "1ère AM", icon: "🌱" },
    { id: "2AM", label: "2ème AM", icon: "📘" },
    { id: "3AM", label: "3ème AM", icon: "🧠" },
    { id: "4AM", label: "4ème AM", icon: "🏆" },
  ];

  return (
    <>
      <Navbar active="lessons" />

      <div className="blob bg-mint w-72 h-72 -top-10 -right-10 opacity-50 fixed"></div>
      <div className="blob bg-coral-light w-56 h-56 -bottom-10 -left-10 opacity-50 fixed"></div>
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            <span className="squiggle-underline text-blue">Leçons</span>
          </h1>
          <p className="text-ink/60 mt-3">Toutes les leçons d&apos;anglais disponibles par niveau.</p>
        </div>

        {params.level && (
          <div className="text-center mb-10">
            <Link href="/lessons" className="inline-flex items-center gap-2 font-display text-sm font-bold text-ink bg-sun px-5 py-2 rounded-full border-2 border-ink shadow-[3px_3px_0px_#1A1A2E] hover:shadow-[5px_5px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all no-underline">
              <i className="fa-solid fa-arrow-left"></i> Tous les niveaux
            </Link>
          </div>
        )}

        {/* Level filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {levels.map((l) => (
            <Link
              key={l.id}
              href={`/lessons?level=${l.id}`}
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

        {(!lessons || lessons.length === 0) && (
          <div className="text-center py-16">
            <p className="text-ink/40 font-display text-lg">
              {params.level
                ? "Aucune leçon publiée pour ce niveau pour le moment."
                : "Aucune leçon publiée pour le moment."}
            </p>
          </div>
        )}

        <div className="grid gap-5 max-w-3xl mx-auto">
          {lessons?.map((l, i) => (
            <div
              key={l.id}
              className={`sticker rounded-2xl p-6 ${i % 2 === 0 ? "tilt-1" : "tilt-2"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-ink">{l.title}</h2>
                  {l.description && <p className="text-sm text-ink/60 mt-1">{l.description}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs font-semibold">
                    <span className="bg-blue-light px-2 py-0.5 rounded border border-ink/20">
                      {l.class_level}
                    </span>
                    {l.duration_minutes && (
                      <span className="text-ink/50">
                        <i className="fa-regular fa-clock mr-1"></i>
                        {l.duration_minutes} min
                      </span>
                    )}
                    {l.price > 0 ? (
                      <span className="bg-coral-light text-coral px-2 py-0.5 rounded border border-ink/20">
                        {l.price} DA
                      </span>
                    ) : (
                      <span className="bg-mint-light text-mint px-2 py-0.5 rounded border border-ink/20">
                        Gratuit
                      </span>
                    )}
                  </div>
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
