"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const links = [
  { href: "/admin", label: "Dashboard", icon: "D" },
  { href: "/admin/lessons", label: "Leçons", icon: "L" },
  { href: "/admin/exercises", label: "Exercices", icon: "E" },
  { href: "/admin/resources", label: "Ressources", icon: "R" },
  { href: "/admin/bot", label: "Bot", icon: "B" },
  { href: "/admin/profile", label: "Profil", icon: "P" },
];

export default function AdminSidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="text-lg font-bold" onClick={onNavigate}>
          MimoBot
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">Panneau d&apos;administration</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          Déconnexion
        </button>
        <Link href="/" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          ← Retour au site
        </Link>
      </div>
    </aside>
  );
}
