"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ lessons: 0, exercises: 0, resources: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) setProfile(p);

      const { count: l } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("teacher_id", user.id);
      const { count: e } = await supabase.from("exercises").select("*", { count: "exact", head: true }).eq("teacher_id", user.id);
      const { count: r } = await supabase.from("resources").select("*", { count: "exact", head: true }).eq("teacher_id", user.id);
      setStats({ lessons: l || 0, exercises: e || 0, resources: r || 0 });
    };
    load();
  }, []);

  const cards = [
    { label: "Leçons", value: stats.lessons, href: "/lessons", color: "bg-primary-light text-primary" },
    { label: "Exercices", value: stats.exercises, href: "/exercises", color: "bg-secondary-light text-secondary" },
    { label: "Ressources", value: stats.resources, href: "/resources", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Bonjour, {profile?.full_name || "Utilisateur"}
        </h1>
        <p className="text-neutral-500 mt-1">Tableau de bord de vos cours d&apos;anglais</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <span className="text-xl font-bold">{card.value}</span>
            </div>
            <h3 className="font-semibold text-neutral-900">{card.label}</h3>
            <p className="text-sm text-neutral-500 mt-1">Voir tout &rarr;</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-semibold text-neutral-900 mb-3">Actions rapides</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/lessons/new" className="px-4 py-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
            + Nouvelle leçon
          </Link>
          <Link href="/exercises/new" className="px-4 py-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
            + Nouvel exercice
          </Link>
        </div>
      </div>
    </div>
  );
}
