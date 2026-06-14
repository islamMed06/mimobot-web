"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Resource = {
  id: string; title: string; file_url: string; file_type: string; file_size: number | null; class_level: string | null; published: boolean; price: number;
};

export default function AdminResources() {
  const supabase = createClient();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", file_url: "", file_type: "pdf", class_level: "1AM", price: "0" });
  const [adding, setAdding] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (data) setResources(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    await supabase.from("resources").insert({
      title: form.title,
      description: form.description || null,
      file_url: form.file_url,
      file_type: form.file_type,
      class_level: form.class_level,
      price: parseFloat(form.price) || 0,
    });
    setForm({ title: "", description: "", file_url: "", file_type: "pdf", class_level: "1AM", price: "0" });
    setAdding(false);
    fetch();
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("resources").update({ published: !current }).eq("id", id);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    await supabase.from("resources").delete().eq("id", id);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ressources</h1>

      {/* Add form */}
      <form onSubmit={addResource} className="bg-white border border-gray-200 rounded-xl p-5 mb-8 space-y-3">
        <h2 className="font-semibold text-sm mb-2">Ajouter une ressource</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" required className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="URL du fichier *" required className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <select value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="video">Vidéo</option>
            <option value="other">Autre</option>
          </select>
          <select value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="1AM">1AM</option>
            <option value="2AM">2AM</option>
            <option value="3AM">3AM</option>
            <option value="4AM">4AM</option>
          </select>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Prix DA" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optionnelle)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <button type="submit" disabled={adding} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
          {adding ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && resources.length === 0 && <p className="text-gray-400 text-center py-8">Aucune ressource.</p>}

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{r.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="uppercase">{r.file_type}</span>
                <span>{r.class_level || "—"}</span>
                <span className={r.published ? "text-green-600" : "text-amber-600"}>{r.published ? "Publié" : "Brouillon"}</span>
                {r.price > 0 && <span className="text-amber-600">{r.price} DA</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Voir</a>
              <button onClick={() => togglePublish(r.id, r.published)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {r.published ? "Dépublier" : "Publier"}
              </button>
              <button onClick={() => remove(r.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
