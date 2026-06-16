"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

function formatFileSize(bytes: number) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " Mo";
  return (bytes / 1024).toFixed(0) + " Ko";
}

function FichesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fiches, setFiches] = useState<any[] | null>(null);
  const [fichesLoading, setFichesLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/login?redirect=/fiches-pedagogiques"); return; }
      supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
          if (data?.role === "premium" || data?.role === "admin") {
            fetchFiches();
          } else {
            setFichesLoading(false);
          }
        });
    });
  }, []);

  const fetchFiches = async (lvl?: string) => {
    setFichesLoading(true);
    let query = supabase.from("resources").select("*").eq("published", true).gt("price", 0);
    if (lvl) query = query.eq("class_level", lvl.toUpperCase());
    query = query.order("created_at", { ascending: false });
    const { data } = await query;
    setFiches(data);
    setFichesLoading(false);
  };

  useEffect(() => {
    if (profile && (profile.role === "premium" || profile.role === "admin")) {
      fetchFiches(level || undefined);
    }
  }, [level]);

  const levels = [
    { id: "", label: "Tous", icon: "📋" },
    { id: "1AM", label: "1ère AM", icon: "🌱" },
    { id: "2AM", label: "2ème AM", icon: "📘" },
    { id: "3AM", label: "3ème AM", icon: "🧠" },
    { id: "4AM", label: "4ème AM", icon: "🏆" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-display text-ink text-lg">Chargement...</p>
      </div>
    );
  }

  const isPremium = profile?.role === "premium" || profile?.role === "admin";

  return (
    <>
      <Navbar active="fiches" />

      <div className="min-h-screen bg-cream">
        <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <p className="text-coral font-display font-bold text-sm tracking-widest uppercase mb-2">
              <i className="fa-solid fa-file-pen mr-2"></i> Fiches pédagogiques
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
              <span className="squiggle-underline text-blue">Fiches pédagogiques</span>
            </h1>
            <p className="text-ink/60 mt-3 max-w-xl mx-auto">
              Documents premium classés par niveau pour approfondir chaque leçon.
            </p>
          </div>

          {!isPremium ? (
            <div className="max-w-lg mx-auto">
              <div className="sticker rounded-2xl p-8 bg-sun-light text-center">
                <div className="w-16 h-16 rounded-2xl bg-coral border-3 border-ink flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h2 className="font-display text-xl font-bold text-ink mb-2">
                  <i className="fa-solid fa-lock text-coral mr-2"></i> Contenu Premium
                </h2>
                <p className="text-ink/70 mb-6">
                  Ton compte est actuellement gratuit. Pour accéder aux fiches pédagogiques premium,
                  contacte <strong>Mimoune Kenza</strong> directement :
                </p>
                <ul className="space-y-3 text-sm mb-6 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border-2 border-ink flex items-center justify-center text-ink">
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                    <span>WhatsApp : <strong>+213 XXX-XXX-XXX</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border-2 border-ink flex items-center justify-center text-ink">
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                    <span>Email : <strong>kenza.mimoune@email.com</strong></span>
                  </li>
                </ul>
                <p className="text-sm text-ink/50">
                  Une fois le paiement effectué, ton accès sera activé manuellement et tu pourras
                  télécharger toutes les fiches pédagogiques.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="blob bg-mint w-72 h-72 -top-10 -right-10 opacity-40 fixed"></div>
              <div className="blob bg-blue-light w-56 h-56 -bottom-10 -left-10 opacity-40 fixed"></div>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {levels.map((l) => (
                  <Link
                    key={l.id || "all"}
                    href={l.id ? `/fiches-pedagogiques?level=${l.id}` : "/fiches-pedagogiques"}
                    className={`font-display font-bold text-sm px-5 py-2.5 rounded-full border-2 border-ink transition-all no-underline ${
                      (level || "") === l.id
                        ? "bg-ink text-white shadow-[3px_3px_0px_#FFC857]"
                        : "bg-white text-ink hover:shadow-[3px_3px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5"
                    }`}
                  >
                    {l.icon} {l.label}
                  </Link>
                ))}
              </div>

              {fichesLoading && (
                <div className="text-center py-16">
                  <p className="font-display text-ink/40 text-lg">Chargement des fiches...</p>
                </div>
              )}

              {!fichesLoading && (!fiches || fiches.length === 0) && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-ink/40 font-display text-lg">
                    {level
                      ? "Aucune fiche premium pour ce niveau pour le moment."
                      : "Aucune fiche pédagogique disponible pour le moment."}
                  </p>
                  <p className="text-ink/30 text-sm mt-2">
                    Revenez bientôt — de nouvelles fiches sont ajoutées régulièrement.
                  </p>
                </div>
              )}

              {!fichesLoading && fiches && fiches.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fiches.map((f, i) => (
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
                            <h2 className="font-display font-bold text-ink truncate">{f.title}</h2>
                            {f.description && (
                              <p className="text-xs text-ink/50 mt-1 line-clamp-2">{f.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                          <span className="bg-blue-light px-2 py-0.5 rounded border border-ink/20">{f.class_level}</span>
                          {f.file_size && (
                            <span className="text-ink/50">
                              <i className="fa-regular fa-file mr-1"></i>{formatFileSize(f.file_size)}
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
              )}
            </>
          )}
        </section>
      </div>

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

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-display text-ink text-lg">Chargement...</p>
      </div>
    }>
      <FichesContent />
    </Suspense>
  );
}
