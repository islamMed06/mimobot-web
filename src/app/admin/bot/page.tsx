"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminBot() {
  const supabase = createClient();
  const [status, setStatus] = useState<{ lessons: number; exercises: number; resources: number } | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("exercises").select("*", { count: "exact", head: true }),
      supabase.from("resources").select("*", { count: "exact", head: true }),
    ]).then(([l, e, r]) => {
      setStatus({ lessons: l.count ?? 0, exercises: e.count ?? 0, resources: r.count ?? 0 });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assistant Telegram (Bot)</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-medium">Connecté</span>
          <span className="text-xs text-gray-400">@MimoBot_bot</span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Le bot Telegram est votre assistant personnel. Il vous aide à gérer le contenu,
          consulter les statistiques et automatiser vos tâches. Utilisez Telegram pour
          interagir avec lui.
        </p>

        <hr className="my-4" />

        <h3 className="font-semibold text-sm mb-3">Contenu actuel</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="font-bold text-lg">{status?.lessons ?? "—"}</p>
            <p className="text-gray-500 text-xs">Leçons</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="font-bold text-lg">{status?.exercises ?? "—"}</p>
            <p className="text-gray-500 text-xs">Exercices</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="font-bold text-lg">{status?.resources ?? "—"}</p>
            <p className="text-gray-500 text-xs">Ressources</p>
          </div>
        </div>
      </div>
    </div>
  );
}
