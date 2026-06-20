"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function Navbar({
  active,
  simple,
  landing,
}: {
  active?: string;
  simple?: boolean;
  landing?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | undefined>(undefined);

  const showFiches = !user || userType === "teacher" || userType === null;

  const supabase = createClient();

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("profiles")
          .select("role, user_type")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) { setRole(data.role); setUserType(data.user_type); }
          });
      }
    });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (simple) {
    return (
      <header className="navbar fixed top-0 left-0 w-full z-50 py-3 bg-cream/92 backdrop-blur-md border-b-3 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="flex-shrink-0">
              <rect x="2" y="2" width="42" height="42" rx="14" fill="#2D5BFF" stroke="#1A1A2E" strokeWidth="3" transform="rotate(-4 23 23)"/>
              <path d="M12 30V16L17 21L22 16V30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
              <path d="M25 16V30M25 23L32 16M25 23L32 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
              <circle cx="36" cy="11" r="3" fill="#FFC857" stroke="#1A1A2E" strokeWidth="2"/>
            </svg>
            <span className="font-display text-lg font-bold text-ink">Mon espace</span>
          </Link>
          <div className="flex items-center gap-4">
            {role === "admin" && (
              <Link href="/admin" className="font-display text-sm font-bold text-ink bg-sun px-4 py-2 rounded-full border-2 border-ink no-underline">
                <i className="fa-solid fa-cog mr-1"></i> Admin
              </Link>
            )}
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
              className="font-display text-sm font-bold text-white bg-coral px-4 py-2 rounded-full border-2 border-ink no-underline cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket mr-1"></i> Déconnexion
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (landing) {
    return (
      <header className="navbar fixed top-0 left-0 w-full z-50 py-3 bg-cream/92 backdrop-blur-md border-b-3 border-ink transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#accueil" className="flex items-center gap-3 no-underline group">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="flex-shrink-0">
              <rect x="2" y="2" width="42" height="42" rx="14" fill="#2D5BFF" stroke="#1A1A2E" strokeWidth="3" transform="rotate(-4 23 23)"/>
              <path d="M12 30V16L17 21L22 16V30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
              <path d="M25 16V30M25 23L32 16M25 23L32 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-4 23 23)"/>
              <circle cx="36" cy="11" r="3" fill="#FFC857" stroke="#1A1A2E" strokeWidth="2"/>
            </svg>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold text-ink block">Mimoune <span className="text-blue">Kenza</span></span>
              <span className="text-[10px] font-bold text-coral tracking-wider uppercase block -mt-0.5">English Teacher</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            <a href="#accueil" className="nav-link text-ink no-underline text-base active">Accueil</a>
            <a href="#apropos" className="nav-link text-ink no-underline text-base">À propos</a>
            <a href="#ressources" className="nav-link text-ink no-underline text-base">Ressources</a>
            {showFiches && <a href="#fiches" className="nav-link text-ink no-underline text-base">Fiche pédagogique</a>}
            <a href="#eleves" className="nav-link text-ink no-underline text-base">Coin des élèves</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/premium" className="hidden md:inline-flex items-center gap-2 font-display bg-mint-light text-ink text-sm font-bold px-4 py-2.5 rounded-full border-2 border-ink hover:bg-ink hover:text-cream transition-all no-underline">
                <i className="fa-solid fa-crown"></i> Mon espace
              </Link>
            ) : (
              <Link href="/login" className="hidden md:inline-flex items-center gap-2 font-display bg-white text-ink text-sm font-bold px-4 py-2.5 rounded-full border-2 border-ink hover:bg-ink hover:text-cream transition-all no-underline">
                <i className="fa-regular fa-user"></i> Espace élève
              </Link>
            )}
            <a href="#contact" className="hidden md:inline-flex items-center gap-2 font-display bg-coral text-white text-sm font-bold px-5 py-2.5 rounded-full border-2 border-ink shadow-[3px_3px_0px_#1A1A2E] hover:shadow-[5px_5px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all no-underline">
              <i className="fa-regular fa-paper-plane"></i> Me contacter
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-ink text-2xl p-1 focus:outline-none" aria-label="Menu">
              <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        <div className={`md:hidden fixed top-[76px] left-0 w-full bg-cream border-b-3 border-ink p-5 px-6 z-40 transition-all duration-350 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"}`}>
          {[
            { href: "#accueil", label: "Accueil", icon: "🏠" },
            { href: "#apropos", label: "À propos", icon: "👩‍🏫" },
            { href: "#ressources", label: "Ressources", icon: "📚" },
          ].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-3 font-display font-semibold text-base border-b-2 border-dashed border-ink/25 no-underline text-ink">
              {l.icon} {l.label}
            </a>
          ))}
          {showFiches && (
            <a href="#fiches" onClick={() => setMobileOpen(false)} className="block py-3 font-display font-semibold text-base border-b-2 border-dashed border-ink/25 no-underline text-ink">
              📋 Fiche pédagogique
            </a>
          )}
          <a href="#eleves" onClick={() => setMobileOpen(false)} className="block py-3 font-display font-semibold text-base border-b-2 border-dashed border-ink/25 no-underline text-ink">
            🎓 Coin des élèves
          </a>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-3 bg-cream/92 backdrop-blur-md border-b-3 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-blue border-3 border-ink flex items-center justify-center text-white font-display font-bold text-sm">M</div>
          <div className="leading-tight">
            <span className="font-display text-lg font-bold text-ink block">Mimoune <span className="text-blue">Kenza</span></span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`nav-link text-ink no-underline text-base ${!active ? "active" : ""}`}>Accueil</Link>
          <Link href="/lessons" className={`nav-link text-ink no-underline text-base ${active === "lessons" ? "active" : ""}`}>Leçons</Link>
          <Link href="/exercises" className={`nav-link text-ink no-underline text-base ${active === "exercises" ? "active" : ""}`}>Exercices</Link>
          <Link href="/resources" className={`nav-link text-ink no-underline text-base ${active === "resources" ? "active" : ""}`}>Ressources</Link>
          {showFiches && <Link href="/fiches-pedagogiques" className={`nav-link text-ink no-underline text-base ${active === "fiches" ? "active" : ""}`}>Fiche pédagogique</Link>}
        </nav>
      </div>
    </header>
  );
}
