import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">MimoBot</span>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-gray-900">Accueil</Link>
            <Link href="/lessons" className="hover:text-gray-900">Leçons</Link>
            <Link href="/exercises" className="hover:text-gray-900">Exercices</Link>
            <Link href="/resources" className="hover:text-gray-900">Ressources</Link>
            <Link href="/login" className="hover:text-gray-900">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Kenza Mimoune
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Professeure d&apos;anglais au CEM
          </p>
          <p className="text-gray-500 max-w-xl mx-auto mb-10">
            Leçons, exercices et ressources pédagogiques pour collégiens en Algérie.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/lessons" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Voir les leçons
            </Link>
            <Link href="/resources" className="border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Ressources
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600 font-bold">L</div>
          <h3 className="font-semibold mb-2">Leçons structurées</h3>
          <p className="text-sm text-gray-500">Par niveau (1AM–4AM), prêtes à être utilisées en classe.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4 text-green-600 font-bold">E</div>
          <h3 className="font-semibold mb-2">Exercices variés</h3>
          <p className="text-sm text-gray-500">QCM, textes à trous, matching… pour évaluer les élèves.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4 text-purple-600 font-bold">R</div>
          <h3 className="font-semibold mb-2">Ressources PDF</h3>
          <p className="text-sm text-gray-500">Fiches, documents, supports à télécharger librement.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MimoBot — Kenza Mimoune. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
