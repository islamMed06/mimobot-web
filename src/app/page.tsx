"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Close mobile on resize
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);

    // Active nav link on scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 150;
        if (window.scrollY >= sectionTop)
          current = section.getAttribute("id") || "";
      });
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current)
          link.classList.add("active");
      });
    };
    window.addEventListener("scroll", handleScroll);

    // Contact form simulation
    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");
    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      formSuccess?.classList.remove("hidden");
      (contactForm as HTMLFormElement).reset();
      setTimeout(() => formSuccess?.classList.add("hidden"), 5000);
    });

    // Scroll observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("section:not(#accueil)").forEach((section) => {
      (section as HTMLElement).style.opacity = "0";
      (section as HTMLElement).style.transform = "translateY(30px)";
      (section as HTMLElement).style.transition =
        "opacity 0.8s ease-out, transform 0.8s ease-out";
      observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      {/* ===================== NAVBAR ===================== */}
      <header className="navbar fixed top-0 left-0 w-full z-50 py-3 bg-cream/92 backdrop-blur-md border-b-3 border-ink transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a
            href="#accueil"
            className="flex items-center gap-3 no-underline group"
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              className="flex-shrink-0"
            >
              <rect
                x="2"
                y="2"
                width="42"
                height="42"
                rx="14"
                fill="#2D5BFF"
                stroke="#1A1A2E"
                strokeWidth="3"
                transform="rotate(-4 23 23)"
              />
              <path
                d="M12 30V16L17 21L22 16V30"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(-4 23 23)"
              />
              <path
                d="M25 16V30M25 23L32 16M25 23L32 30"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(-4 23 23)"
              />
              <circle
                cx="36"
                cy="11"
                r="3"
                fill="#FFC857"
                stroke="#1A1A2E"
                strokeWidth="2"
              />
            </svg>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold text-ink block">
                Mimoune <span className="text-blue">Kenza</span>
              </span>
              <span className="text-[10px] font-bold text-coral tracking-wider uppercase block -mt-0.5">
                English Teacher
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            <a
              href="#accueil"
              className="nav-link text-ink no-underline text-base active"
            >
              Accueil
            </a>
            <a href="#apropos" className="nav-link text-ink no-underline text-base">
              À propos
            </a>
            <a
              href="#ressources"
              className="nav-link text-ink no-underline text-base"
            >
              Ressources
            </a>
            <a href="#eleves" className="nav-link text-ink no-underline text-base">
              Coin des élèves
            </a>
            <a
              href="#contact"
              className="nav-link text-ink no-underline text-base"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 font-display bg-coral text-white text-sm font-bold px-5 py-2.5 rounded-full border-2 border-ink shadow-[3px_3px_0px_#1A1A2E] hover:shadow-[5px_5px_0px_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all no-underline"
            >
              <i className="fa-regular fa-paper-plane"></i> Me contacter
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-ink text-2xl p-1 focus:outline-none"
              aria-label="Menu"
            >
              <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden fixed top-[76px] left-0 w-full bg-cream border-b-3 border-ink p-5 px-6 z-40 transition-all duration-350 ${
            mobileOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-[120%] opacity-0"
          }`}
        >
          {[
            { href: "#accueil", label: "Accueil", icon: "🏠" },
            { href: "#apropos", label: "À propos", icon: "👩‍🏫" },
            { href: "#ressources", label: "Ressources", icon: "📚" },
            { href: "#eleves", label: "Coin des élèves", icon: "🎓" },
            { href: "#contact", label: "Contact", icon: "✉️" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-display font-semibold text-base border-b-2 border-dashed border-ink/25 no-underline text-ink"
            >
              {l.icon} {l.label}
            </a>
          ))}
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section
        id="accueil"
        className="min-h-screen flex items-center relative pt-24 overflow-hidden"
      >
        <div className="blob bg-sun w-72 h-72 -top-10 -right-10 opacity-70"></div>
        <div className="blob bg-mint w-96 h-96 -bottom-32 -left-32 opacity-60"></div>
        <div className="blob bg-coral-light w-40 h-40 top-1/3 right-1/4 opacity-80 hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <p className="inline-flex items-center gap-2 bg-coral text-white font-display font-bold text-sm px-4 py-2 rounded-full border-2 border-ink shadow-[3px_3px_0px_#1A1A2E] mb-6 -rotate-2">
                <i className="fa-solid fa-star"></i> English Teacher – CEM
              </p>
              <h1 className="hero-title font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink leading-tight mb-6">
                Learn English
                <br />
                <span className="squiggle-underline text-blue">
                  with Passion
                </span>{" "}
                🚀
              </h1>
              <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
                Bienvenue dans mon espace pédagogique ! Je suis{" "}
                <strong className="text-ink">Mimoune Kenza</strong>,
                professeure d&apos;anglais au CEM. Ici, je partage des
                ressources, des conseils et toute ma passion pour vous aider à
                progresser en anglais avec confiance et plaisir.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#ressources" className="btn-primary">
                  <i className="fa-solid fa-book-open"></i> Découvrir les cours
                </a>
                <a href="#apropos" className="btn-outline">
                  <i className="fa-regular fa-circle-play"></i> En savoir plus
                </a>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-[3rem] bg-blue border-4 border-ink shadow-[10px_10px_0px_#1A1A2E] flex items-center justify-center rotate-3">
                  <div className="text-center text-white -rotate-3">
                    <i className="fa-solid fa-chalkboard-user text-7xl mb-4 text-sun"></i>
                    <p className="text-lg font-display font-bold">
                      Empowering students
                      <br />
                      through English
                    </p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-8 bg-sun text-ink rounded-2xl px-5 py-3 text-sm font-display font-bold border-3 border-ink shadow-[4px_4px_0px_#1A1A2E] rotate-6">
                  <i className="fa-solid fa-graduation-cap mr-1"></i> 5+ ans
                </div>
                <div className="absolute -bottom-4 -left-8 bg-coral text-white rounded-2xl px-5 py-3 text-sm font-display font-bold border-3 border-ink shadow-[4px_4px_0px_#1A1A2E] -rotate-6">
                  <i className="fa-solid fa-heart mr-1"></i> 200+ élèves
                </div>
                <div className="absolute top-1/2 -right-12 bg-mint text-ink rounded-full w-20 h-20 border-3 border-ink shadow-[4px_4px_0px_#1A1A2E] flex items-center justify-center font-display font-bold text-sm rotate-12 hidden lg:flex">
                  95% BEM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section
        id="apropos"
        className="py-20 md:py-28 bg-cream relative border-y-3 border-ink"
      >
        <div className="blob bg-sun w-72 h-72 absolute -top-20 -right-20 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-coral font-display font-bold text-sm tracking-widest uppercase mb-2">
              <i className="fa-solid fa-id-card mr-2"></i> About me
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
              À propos de{" "}
              <span className="squiggle-underline text-blue">moi</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative">
                <div className="w-72 h-72 rounded-[2.5rem] bg-sun border-4 border-ink shadow-[10px_10px_0px_#1A1A2E] flex items-center justify-center -rotate-3">
                  <i className="fa-solid fa-person-chalkboard text-8xl text-ink"></i>
                </div>
                <div className="absolute -bottom-5 -right-5 bg-mint border-3 border-ink rounded-2xl px-5 py-2 font-display font-bold text-ink shadow-[4px_4px_0px_#1A1A2E] rotate-3">
                  Mimoune Kenza
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h3 className="font-display text-2xl font-bold text-ink mb-4">
                Bonjour, je suis Mimoune Kenza ! 👋
              </h3>
              <p className="text-ink/70 leading-relaxed mb-4">
                Enseignante d&apos;anglais passionnée depuis plus de 5 ans au
                CEM (Collège d&apos;Enseignement Moyen) en Algérie.
                Titulaire d&apos;une licence en langue anglaise et d&apos;un
                diplôme pédagogique, j&apos;ai à cœur d&apos;accompagner mes
                élèves vers la réussite.
              </p>
              <p className="text-ink/70 leading-relaxed mb-4">
                Ma méthode repose sur une approche{" "}
                <strong className="text-ink">
                  bienveillante et interactive
                </strong>{" "}
                : j&apos;adapte mes cours au rythme de chaque élève, en
                utilisant des supports modernes (vidéos, jeux, chansons) pour
                rendre l&apos;apprentissage vivant et motivant.
              </p>
              <p className="text-ink/70 leading-relaxed mb-6">
                Je crois fermement que chaque élève peut aimer l&apos;anglais
                et exceller, à condition d&apos;être guidé avec patience et
                créativité.{" "}
                <strong className="text-blue">
                  &ldquo;Learning English should be fun and
                  meaningful!&rdquo;
                </strong>
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center sticker rounded-2xl py-4 tilt-1">
                  <p className="font-display text-2xl font-extrabold text-coral">
                    200+
                  </p>
                  <p className="text-xs text-ink/60 font-semibold">
                    Élèves formés
                  </p>
                </div>
                <div className="text-center sticker rounded-2xl py-4 tilt-2">
                  <p className="font-display text-2xl font-extrabold text-blue">
                    5+
                  </p>
                  <p className="text-xs text-ink/60 font-semibold">
                    Années d&apos;exp.
                  </p>
                </div>
                <div className="text-center sticker rounded-2xl py-4 tilt-3">
                  <p className="font-display text-2xl font-extrabold text-mint">
                    95%
                  </p>
                  <p className="text-xs text-ink/60 font-semibold">
                    Réussite BEM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: "fa-solid fa-heart",
                color: "bg-coral",
                title: "Bienveillance",
                desc: "Un environnement rassurant où chaque élève ose parler et faire des erreurs pour mieux progresser.",
              },
              {
                icon: "fa-solid fa-lightbulb",
                color: "bg-sun",
                title: "Interactivité",
                desc: "Des cours dynamiques avec des jeux, des vidéos et des activités de groupe pour apprendre en s'amusant.",
              },
              {
                icon: "fa-solid fa-star",
                color: "bg-mint",
                title: "Excellence",
                desc: "Un suivi rigoureux et des ressources ciblées pour préparer chaque élève à réussir (BEM, examens).",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`sticker tilt-${i + 1} rounded-2xl p-8 text-center`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${item.color} border-3 border-ink text-white flex items-center justify-center text-2xl mx-auto mb-4`}
                >
                  <i className={item.icon}></i>
                </div>
                <h4 className="font-display font-bold text-ink mb-2 text-lg">
                  {item.title}
                </h4>
                <p className="text-sm text-ink/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RESSOURCES ===================== */}
      <section
        id="ressources"
        className="py-20 md:py-28 relative overflow-hidden"
      >
        <div className="blob bg-blue-light w-96 h-96 top-1/4 -right-48 opacity-80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-coral font-display font-bold text-sm tracking-widest uppercase mb-2">
              <i className="fa-solid fa-book-open mr-2"></i> Resources
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
              Ressources{" "}
              <span className="squiggle-underline text-blue">& Cours</span>
            </h2>
            <p className="text-ink/60 mt-4 max-w-xl mx-auto">
              Fiches de révision, leçons (PDF), exercices et supports audio
              classés par niveau — comme des pages de ton cahier ! 📖
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                level: "1AM",
                label: "1ère AM",
                icon: "fa-solid fa-seedling",
                color: "bg-mint",
                bg: "bg-mint-light",
                count: "6 leçons",
                desc: "Alphabet, salutations, couleurs, nombres, famille, animaux.",
                resources: [
                  { title: "Leçon 1 : Alphabet", color: "text-mint" },
                  { title: "Fiche : Greetings", color: "text-mint" },
                  { title: "Exercices – Colours", color: "text-blue" },
                  { title: "Audio : Numbers", color: "text-mint" },
                ],
              },
              {
                level: "2AM",
                label: "2ème AM",
                icon: "fa-solid fa-book",
                color: "bg-blue",
                bg: "bg-blue-light",
                count: "8 leçons",
                desc: "Present Simple, articles, prépositions, décrire une personne, routines.",
                resources: [
                  { title: "Leçon : Present Simple", color: "text-blue" },
                  { title: "Fiche : Daily Routine", color: "text-blue" },
                  { title: "Exercices – Prepositions", color: "text-blue" },
                  { title: "Audio : Describing people", color: "text-blue" },
                ],
              },
              {
                level: "3AM",
                label: "3ème AM",
                icon: "fa-solid fa-brain",
                color: "bg-coral",
                bg: "bg-coral-light",
                count: "10 leçons",
                desc: "Past Simple, comparatifs, météo, santé, recettes, biographies.",
                resources: [
                  { title: "Leçon : Past Simple", color: "text-coral" },
                  { title: "Fiche : Weather", color: "text-coral" },
                  { title: "Exercices – Comparatives", color: "text-coral" },
                  { title: "Audio : At the doctor", color: "text-coral" },
                ],
              },
              {
                level: "4AM",
                label: "4ème AM",
                icon: "fa-solid fa-trophy",
                color: "bg-ink",
                bg: "bg-sun",
                count: "12 leçons",
                desc: "Révision générale, rédaction, compréhension écrite, annales BEM.",
                special: "BEM 🏆",
                resources: [
                  { title: "Guide : Révision BEM", color: "text-ink" },
                  { title: "Annales BEM 2024", color: "text-ink" },
                  { title: "Writing : Essay Topics", color: "text-ink" },
                  { title: "Listening Practice", color: "text-ink" },
                ],
              },
            ].map((niveau, i) => (
              <div
                key={niveau.level}
                className={`sticker tilt-${i + 1} rounded-2xl p-6 ${niveau.bg} relative`}
              >
                {niveau.special && (
                  <div className="absolute -top-4 -right-4 bg-ink text-sun font-display font-bold text-xs px-3 py-1.5 rounded-full border-3 border-ink rotate-6">
                    {niveau.special}
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl ${niveau.color} border-3 border-ink text-white flex items-center justify-center text-xl mb-4 ${i % 2 === 0 ? "-rotate-3" : "rotate-3"}`}
                >
                  <i className={niveau.icon}></i>
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-1">
                  {niveau.label}
                </h3>
                <p className="text-xs text-ink/50 mb-4 font-semibold uppercase tracking-wide">
                  {niveau.count}
                </p>
                <p className="text-sm text-ink/70 mb-5">{niveau.desc}</p>
                <ul className="space-y-2 text-sm">
                  {niveau.resources.map((r) => (
                    <li key={r.title}>
                      <Link
                        href={`/lessons?level=${niveau.level}`}
                        className={`resource-link flex items-center gap-2 text-ink no-underline font-medium py-1.5 px-2 rounded-lg ${r.color}`}
                      >
                        <i className="fa-regular fa-file-pdf text-coral"></i>{" "}
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/lessons?level=${niveau.level}`}
                  className={`mt-5 w-full font-display text-sm font-bold text-ink py-2.5 rounded-xl border-3 border-ink bg-cream hover:bg-ink hover:text-cream transition-all flex items-center justify-center gap-1 no-underline`}
                >
                  Voir tout <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-ink/40 text-sm mt-12 font-medium">
            <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
            Nouveaux documents ajoutés régulièrement – Revenez bientôt !
          </p>
        </div>
      </section>

      {/* ===================== STUDENT CORNER ===================== */}
      <section
        id="eleves"
        className="py-20 md:py-28 bg-ink text-cream relative overflow-hidden border-y-3 border-ink"
      >
        <div className="blob bg-mint w-80 h-80 -bottom-20 -right-20 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sun font-display font-bold text-sm tracking-widest uppercase mb-2">
              <i className="fa-solid fa-graduation-cap mr-2"></i> Student
              Corner
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Coin des <span className="text-coral">Élèves</span> 🎓
            </h2>
            <p className="text-cream/60 mt-4 max-w-xl mx-auto">
              Astuces, vocabulaire et conseils pour progresser en anglais et
              réussir tes examens.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conseils */}
            <div className="bg-cream text-ink rounded-2xl p-8 border-3 border-cream/20 tilt-1">
              <div className="w-14 h-14 rounded-full bg-mint border-3 border-ink text-ink flex items-center justify-center text-2xl mb-5">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Conseils pour progresser
              </h3>
              <ul className="space-y-4 text-sm text-ink/70">
                {[
                  {
                    icon: "fa-solid fa-headphones",
                    label: "Écoute",
                    text: "Regarde des séries et des vidéos en anglais avec sous-titres. Même 10 minutes par jour suffisent !",
                  },
                  {
                    icon: "fa-solid fa-pen",
                    label: "Écris",
                    text: "Tiens un petit journal en anglais. 3 phrases par jour, c'est un bon début.",
                  },
                  {
                    icon: "fa-solid fa-comments",
                    label: "Parle",
                    text: "N'aie pas peur de faire des erreurs ! Entraîne-toi à voix haute devant le miroir.",
                  },
                  {
                    icon: "fa-solid fa-repeat",
                    label: "Répète",
                    text: "Relis tes leçons le soir avant de dormir. La répétition est la clé de la mémorisation.",
                  },
                  {
                    icon: "fa-solid fa-music",
                    label: "Chante",
                    text: "Écoute des chansons en anglais et essaie de chanter en suivant les paroles.",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <span className="text-coral mt-0.5">
                      <i className={item.icon}></i>
                    </span>
                    <span>
                      <strong className="text-ink">{item.label} :</strong>{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocabulaire */}
            <div className="bg-cream text-ink rounded-2xl p-8 border-3 border-cream/20 tilt-2">
              <div className="w-14 h-14 rounded-full bg-sun border-3 border-ink text-ink flex items-center justify-center text-2xl mb-5">
                <i className="fa-solid fa-book"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Vocabulaire utile
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: "fa-solid fa-house",
                    title: "At home",
                    words: "kitchen, bedroom, living room, bathroom, fridge, sofa",
                    bg: "bg-mint-light",
                    color: "text-mint",
                  },
                  {
                    icon: "fa-solid fa-school",
                    title: "At school",
                    words: "classroom, teacher, notebook, blackboard, exam, homework",
                    bg: "bg-blue-light",
                    color: "text-blue",
                  },
                  {
                    icon: "fa-solid fa-utensils",
                    title: "Food",
                    words: "breakfast, lunch, dinner, vegetables, fruit, delicious",
                    bg: "bg-coral-light",
                    color: "text-coral",
                  },
                ].map((cat) => (
                  <div
                    key={cat.title}
                    className={`${cat.bg} rounded-xl p-4 border-2 border-ink/10`}
                  >
                    <p className="font-display font-bold text-sm text-ink mb-2">
                      <i className={`${cat.icon} mr-1.5 ${cat.color}`}></i>{" "}
                      {cat.title}
                    </p>
                    <p className="text-xs text-ink/60">{cat.words}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Astuces BEM */}
            <div className="bg-coral text-white rounded-2xl p-8 border-3 border-cream/20 tilt-3">
              <div className="w-14 h-14 rounded-full bg-white border-3 border-ink text-coral flex items-center justify-center text-2xl mb-5">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-4">
                Astuces pour le BEM
              </h3>
              <ul className="space-y-4 text-sm text-white/90">
                {[
                  "Gère ton temps : Lis bien les questions avant de te lancer dans la rédaction.",
                  "Relis ton texte : Vérifie l'orthographe, les temps verbaux et la ponctuation.",
                  "Entraîne-toi sur les annales : Refais les sujets BEM des années précédentes en temps limité.",
                  "Soigne ta présentation : Une copie propre et bien présentée, c'est déjà des points gagnés !",
                  "Gère ton stress : Dors bien la veille, arrive à l'heure, et lis bien tout l'énoncé avant de répondre.",
                ].map((tip, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="bg-white text-coral rounded-full w-6 h-6 flex items-center justify-center text-xs font-display font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>
                      <strong className="text-white">
                        {tip.split(":")[0]} :{" "}
                      </strong>
                      {tip.split(":")[1]}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t-2 border-white/20 text-center">
                <p className="text-white/90 italic text-sm">
                  &ldquo;Success is not final, failure is not fatal: it is the
                  courage to continue that counts.&rdquo;
                </p>
                <p className="text-xs text-white/60 mt-1">
                  — Winston Churchill
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
        <div className="blob bg-sun w-80 h-80 -top-32 -left-32 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-coral font-display font-bold text-sm tracking-widest uppercase mb-2">
              <i className="fa-regular fa-paper-plane mr-2"></i> Contact
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
              Restons en{" "}
              <span className="squiggle-underline text-blue">contact</span>
            </h2>
            <p className="text-ink/60 mt-4 max-w-xl mx-auto">
              Une question, un besoin ? Envoyez-moi un message, je vous
              répondrai avec plaisir. 📬
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="sticker rounded-2xl p-8 bg-cream">
              <form id="contact-form" className="space-y-6">
                <div>
                  <label className="block text-sm font-display font-bold text-ink mb-1.5">
                    <i className="fa-regular fa-user text-blue mr-1"></i> Nom
                    complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Votre nom"
                    className="form-input w-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-ink mb-1.5">
                    <i className="fa-regular fa-envelope text-blue mr-1"></i>{" "}
                    Adresse email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="votre@email.com"
                    className="form-input w-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-ink mb-1.5">
                    <i className="fa-regular fa-message text-blue mr-1"></i> Sujet
                  </label>
                  <select
                    name="subject"
                    className="form-input w-full px-4 py-3 text-sm bg-white"
                  >
                    <option value="">Choisissez un sujet...</option>
                    <option>Demande d&apos;information sur les cours</option>
                    <option>Question sur une leçon / ressource</option>
                    <option>Proposition / Collaboration</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-ink mb-1.5">
                    <i className="fa-regular fa-pen-to-square text-blue mr-1"></i>{" "}
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Écrivez votre message ici..."
                    className="form-input w-full px-4 py-3 text-sm resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <i className="fa-regular fa-paper-plane"></i> Envoyer le
                  message
                </button>
              </form>
              <div
                id="form-success"
                className="hidden mt-6 bg-mint-light border-3 border-ink rounded-2xl p-4 text-sm text-ink text-center font-medium"
              >
                <i className="fa-solid fa-circle-check text-mint text-xl mr-2"></i>
                Merci ! Votre message a bien été envoyé. Je vous répondrai dans
                les plus brefs délais.
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="sticker rounded-2xl p-8 bg-blue-light">
                <h3 className="font-display text-xl font-bold text-ink mb-6">
                  <i className="fa-solid fa-location-dot text-coral mr-2"></i>{" "}
                  Mes coordonnées
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      icon: "fa-regular fa-building",
                      label: "CEM d'affectation",
                      value: "CEM – Bordj Bou Arreridj, Algérie",
                    },
                    {
                      icon: "fa-regular fa-envelope",
                      label: "Email professionnel",
                      value: (
                        <a
                          href="mailto:sarah.boumediene@email.com"
                          className="text-sm text-blue hover:underline font-medium"
                        >
                          kenza.mimoune@email.com
                        </a>
                      ),
                    },
                    {
                      icon: "fa-regular fa-clock",
                      label: "Disponibilités",
                      value: "Samedi – Jeudi : 8h00 – 16h00 (Réponse sous 24h – 48h)",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border-2 border-ink text-ink flex items-center justify-center flex-shrink-0">
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <p className="font-display font-bold text-ink text-sm">
                          {item.label}
                        </p>
                        <p className="text-sm text-ink/60">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticker rounded-2xl p-8 bg-cream">
                <h3 className="font-display text-xl font-bold text-ink mb-6">
                  <i className="fa-solid fa-share-nodes text-coral mr-2"></i>{" "}
                  Suivez-moi
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: "fa-brands fa-facebook-f", label: "Facebook", bg: "bg-blue-light", hover: "hover:bg-blue" },
                    { icon: "fa-brands fa-youtube", label: "YouTube", bg: "bg-coral-light", hover: "hover:bg-coral" },
                    { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", bg: "bg-mint-light", hover: "hover:bg-mint" },
                    { icon: "fa-brands fa-whatsapp", label: "WhatsApp", bg: "bg-sun", hover: "hover:bg-ink hover:text-sun" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      target="_blank"
                      className={`flex items-center gap-2 ${s.bg} ${s.hover} hover:text-white border-2 border-ink text-ink rounded-xl px-4 py-2.5 text-sm font-display font-bold transition-all no-underline`}
                    >
                      <i className={s.icon}></i> {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-ink text-cream border-t-3 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sun border-2 border-cream text-ink flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <span className="font-display text-lg font-bold">
                  Mimoune Kenza
                </span>
              </div>
              <p className="text-sm text-cream/60 leading-relaxed">
                English teacher passionate about helping students learn, grow,
                and succeed. &ldquo;Every student can shine with the right
                guidance and encouragement.&rdquo;
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">
                <i className="fa-solid fa-link mr-2 text-sun"></i> Liens rapides
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  "#accueil",
                  "#apropos",
                  "#ressources",
                  "#eleves",
                  "#contact",
                ].map((href) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-cream/60 hover:text-sun transition no-underline"
                    >
                      {href === "#accueil" && "Accueil"}
                      {href === "#apropos" && "À propos"}
                      {href === "#ressources" && "Ressources"}
                      {href === "#eleves" && "Coin des élèves"}
                      {href === "#contact" && "Contact"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">
                <i className="fa-regular fa-bell mr-2 text-sun"></i> Restez
                informé
              </h4>
              <p className="text-sm text-cream/60 mb-4">
                Recevez les nouvelles ressources directement par email.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm text-ink border-2 border-cream/20 focus:outline-none focus:border-sun"
                />
                <button
                  type="submit"
                  className="bg-sun hover:bg-coral text-ink hover:text-white border-2 border-cream/20 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer"
                >
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

          <div className="border-t-2 border-cream/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/50">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <strong className="text-white">Mimoune Kenza</strong> – Tous
              droits réservés.
            </p>
            <p>
              Fait avec <i className="fa-solid fa-heart text-coral"></i> pour
              mes élèves
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}
