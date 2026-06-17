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
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

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

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) { setPwdMsg("6 caractères minimum"); return; }
    setPwdMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPwdMsg(error.message); return; }
    setPwdMsg("Mot de passe mis à jour !");
    setNewPassword("");
    setShowPwdForm(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="font-display text-ink text-lg">Chargement...</p>
    </div>
  );

  const isPremium = profile?.role === "premium";
  const isFreeTeacher = !isPremium && profile?.user_type === "teacher";
  const userTypeLabel = profile?.user_type === "teacher" ? "Professeur" : profile?.user_type === "student" ? "Élève" : null;

  return (
    <>
      <div className="min-h-screen bg-cream">
        <Navbar simple />

        <section className="pt-32 pb-20 max-w-4xl mx-auto px-4 space-y-6">
          {/* Infos personnelles */}
          <div className="sticker rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-6">
              <i className="fa-regular fa-user text-blue mr-2"></i> Mes informations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-display font-bold text-ink/50 uppercase tracking-wide mb-1">Nom complet</label>
                <p className="font-display text-base text-ink bg-white border-2 border-ink/20 rounded-xl px-4 py-3">{profile?.full_name || "—"}</p>
              </div>
              <div>
                <label className="block text-xs font-display font-bold text-ink/50 uppercase tracking-wide mb-1">Email</label>
                <p className="font-display text-base text-ink bg-white border-2 border-ink/20 rounded-xl px-4 py-3">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-xs font-display font-bold text-ink/50 uppercase tracking-wide mb-1">Statut</label>
                <p className="font-display text-base text-ink bg-white border-2 border-ink/20 rounded-xl px-4 py-3">
                  {userTypeLabel ? (
                    <span className={`inline-flex items-center gap-1.5 font-bold ${
                      profile.user_type === "teacher" ? "text-purple-700" : "text-blue-700"
                    }`}>
                      <i className={`fa-solid ${profile.user_type === "teacher" ? "fa-chalkboard-user" : "fa-user"}`}></i>
                      {userTypeLabel}
                    </span>
                  ) : "—"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-display font-bold text-ink/50 uppercase tracking-wide mb-1">Compte</label>
                <p className={`inline-flex items-center gap-2 font-display text-sm font-bold px-4 py-2 rounded-xl border-2 border-ink ${
                  isPremium ? "bg-mint-light text-mint" : "bg-sun-light text-ink"
                }`}>
                  <i className={`fa-solid ${isPremium ? "fa-crown" : "fa-user"}`}></i>
                  {isPremium ? "Premium" : "Gratuit"}
                </p>
              </div>
            </div>

            <hr className="my-6 border-ink/10" />

            <div>
              <button
                onClick={() => setShowPwdForm(!showPwdForm)}
                className="font-display font-bold text-sm text-ink bg-sun-light px-5 py-2.5 rounded-full border-2 border-ink hover:bg-sun transition-all cursor-pointer"
              >
                <i className="fa-solid fa-lock mr-1.5"></i> Changer le mot de passe
              </button>

              {showPwdForm && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (6+ caractères)"
                    className="flex-1 min-w-[200px] px-4 py-2.5 border-2 border-ink rounded-xl text-sm font-display outline-none"
                  />
                  <button
                    onClick={handlePasswordChange}
                    className="font-display font-bold text-sm text-ink bg-sun px-5 py-2.5 rounded-full border-2 border-ink hover:shadow-[3px_3px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => { setShowPwdForm(false); setNewPassword(""); setPwdMsg(""); }}
                    className="font-display text-sm text-ink/50 hover:text-ink px-3 py-2 cursor-pointer"
                  >
                    Annuler
                  </button>
                  {pwdMsg && (
                    <span className={`text-sm font-display font-bold ${pwdMsg.includes("jour") ? "text-mint" : "text-coral"}`}>
                      {pwdMsg}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenu premium / gratuit */}
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
          ) : isFreeTeacher ? (
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
          ) : null}
        </section>

        {/* Watermark */}
        <div className="fixed bottom-6 right-6 opacity-15 pointer-events-none select-none flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 46 46" fill="none" className="flex-shrink-0">
            <rect x="2" y="2" width="42" height="42" rx="14" fill="#2D5BFF" stroke="#1A1A2E" strokeWidth="3" transform="rotate(-4 23 23)"/>
            <path d="M12 30V16L17 21L22 16V30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
            <path d="M25 16V30M25 23L32 16M25 23L32 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
            <circle cx="36" cy="11" r="3" fill="#FFC857" stroke="#1A1A2E" strokeWidth="2"/>
          </svg>
          <div className="leading-tight">
            <span className="font-display text-base font-bold text-ink block">Mimoune <span className="text-blue">Kenza</span></span>
            <span className="text-[9px] font-bold text-coral tracking-wider uppercase block -mt-0.5">English Teacher</span>
          </div>
        </div>
      </div>
    </>
  );
}
