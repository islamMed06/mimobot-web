import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-neutral-900">MimoBot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Inscription
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Apprenez l&apos;anglais avec{" "}
            <span className="text-primary">MimoBot</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-8">
            Plateforme interactive de cours d&apos;anglais pour les collèges (CEM) en Algérie.
            Leçons, exercices et ressources pour les professeurs et les élèves.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
              Commencer
            </Link>
            <Link href="/login" className="px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100 transition-colors">
              Se connecter
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">L</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Leçons interactives</h3>
              <p className="text-sm text-neutral-500">
                Créez et gérez vos leçons d&apos;anglais avec du contenu riche et structuré.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-secondary-light rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl font-bold">E</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Exercices pratiques</h3>
              <p className="text-sm text-neutral-500">
                Des exercices variés (QCM, textes à trous, rédaction) pour chaque niveau.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-amber-600 text-xl font-bold">R</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Ressources PDF</h3>
              <p className="text-sm text-neutral-500">
                Téléchargez fiches, examens et supports de cours au format PDF.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Intégré avec MimoBot Telegram</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Le bot Telegram @MimoBot_bot complète la plateforme : suivi des élèves,
              rappels de cours, correction d&apos;exercices et plus encore.
            </p>
            <a
              href="https://t.me/MimoBot_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-dark transition-colors"
            >
              Accéder au bot
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} MimoBot — Cours d&apos;Anglais pour CEM Algérie</p>
        </div>
      </footer>
    </div>
  );
}
