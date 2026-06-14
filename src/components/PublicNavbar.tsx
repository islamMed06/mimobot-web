import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/lessons", label: "Leçons" },
  { href: "/exercises", label: "Exercices" },
  { href: "/resources", label: "Ressources" },
  { href: "/login", label: "Admin" },
];

export default function PublicNavbar() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          MimoBot
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gray-900 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
