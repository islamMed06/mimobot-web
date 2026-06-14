"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

type Lesson = {
  id: string; title: string; class_level: string | null; published: boolean; price: number; created_at: string;
};

export default function AdminLessons() {
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("lessons").select("*").order("created_at", { ascending: false });
    if (data) setLessons(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("lessons").update({ published: !current }).eq("id", id);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette leçon ?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leçons</h1>
        <Link href="/admin/lessons/new" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
          + Nouvelle leçon
        </Link>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && lessons.length === 0 && (
        <p className="text-gray-400 py-8 text-center">Aucune leçon. Créez-en une !</p>
      )}

      <div className="space-y-3">
        {lessons.map((l) => (
          <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{l.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span>{l.class_level || "—"}</span>
                <span className={l.published ? "text-green-600" : "text-amber-600"}>{l.published ? "Publié" : "Brouillon"}</span>
                {l.price > 0 && <span className="text-amber-600">{l.price} DA</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => togglePublish(l.id, l.published)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {l.published ? "Dépublier" : "Publier"}
              </button>
              <button onClick={() => remove(l.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
