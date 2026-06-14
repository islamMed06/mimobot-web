"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

type Exercise = {
  id: string; title: string; type: string; class_level: string | null; published: boolean; price: number; created_at: string;
};

const typeLabels: Record<string, string> = { multiple_choice: "QCM", fill_blank: "Texte à trous", matching: "Association", writing: "Rédaction" };

export default function AdminExercises() {
  const supabase = createClient();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("exercises").select("*").order("created_at", { ascending: false });
    if (data) setExercises(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("exercises").update({ published: !current }).eq("id", id);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet exercice ?")) return;
    await supabase.from("exercises").delete().eq("id", id);
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exercices</h1>
        <Link href="/admin/exercises/new" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
          + Nouvel exercice
        </Link>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && exercises.length === 0 && (
        <p className="text-gray-400 py-8 text-center">Aucun exercice.</p>
      )}

      <div className="space-y-3">
        {exercises.map((e) => (
          <div key={e.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{e.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded">{typeLabels[e.type] || e.type}</span>
                <span>{e.class_level || "—"}</span>
                <span className={e.published ? "text-green-600" : "text-amber-600"}>{e.published ? "Publié" : "Brouillon"}</span>
                {e.price > 0 && <span className="text-amber-600">{e.price} DA</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => togglePublish(e.id, e.published)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {e.published ? "Dépublier" : "Publier"}
              </button>
              <button onClick={() => remove(e.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
