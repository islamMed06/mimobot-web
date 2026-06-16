"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PremiumPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        });
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="font-display text-ink text-lg">Chargement...</p>
    </div>
  );

  const isPremium = profile?.role === "premium";

  return (
    <>
      <div className="min-h-screen bg-cream">
        <Navbar simple />

        <section className="pt-32 pb-20 max-w-4xl mx-auto px-4">
          <div className="sticker rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue border-3 border-ink flex items-center justify-center text-white font-display font-bold text-2xl">
                {profile?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">{profile?.full_name || "Bienvenue"}</h1>
                <p className="text-ink/60 text-sm">{profile?.email}</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 font-display text-sm font-bold px-4 py-2 rounded-full border-2 border-ink ${isPremium ? "bg-mint-light text-mint" : "bg-sun-light text-ink"}`}>
              <i className={`fa-solid ${isPremium ? "fa-crown" : "fa-user"}`}></i>
              {isPremium ? "Compte Premium" : "Compte Gratuit"}
            </div>
          </div>

          {isPremium ? (
            <div className="sticker rounded-2xl p-8 bg-mint-light">
              <h2 className="font-display text-xl font-bold text-ink mb-4">
                <i className="fa-solid fa-crown text-mint mr-2"></i> Contenus Premium
              </h2>
              <p className="text-ink/70 mb-6">Tu as accès à tous les contenus premium. Visite les pages ci-dessous :</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/lessons" className="btn-primary">
                  <i className="fa-solid fa-book-open"></i> Leçons
                </Link>
                <Link href="/exercises" className="btn-primary">
                  <i className="fa-solid fa-pen"></i> Exercices
                </Link>
                <Link href="/resources" className="btn-primary">
                  <i className="fa-solid fa-download"></i> Ressources
                </Link>
              </div>
            </div>
          ) : (
            <div className="sticker rounded-2xl p-8 bg-sun-light">
              <h2 className="font-display text-xl font-bold text-ink mb-4">
                <i className="fa-solid fa-lock text-coral mr-2"></i> Compte Gratuit
              </h2>
              <p className="text-ink/70 mb-4">
                Ton compte est actuellement gratuit. Pour accéder aux contenus premium (leçons, exercices, ressources payants),
                contacte <strong>Mimoune Kenza</strong> directement :
              </p>
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white border-2 border-ink flex items-center justify-center text-ink"><i className="fa-brands fa-whatsapp"></i></span>
                  <span>WhatsApp : <strong>+213 XXX-XXX-XXX</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white border-2 border-ink flex items-center justify-center text-ink"><i className="fa-regular fa-envelope"></i></span>
                  <span>Email : <strong>kenza.mimoune@email.com</strong></span>
                </li>
              </ul>
              <p className="text-sm text-ink/50">
                Une fois le paiement effectué, ton accès sera activé manuellement et tu pourras profiter de tous les contenus premium.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
