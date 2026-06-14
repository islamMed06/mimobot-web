"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function NewLesson() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ title: "", description: "", content: "", class_level: "1AM", duration_minutes: "", price: "0" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("lessons").insert({
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      class_level: form.class_level,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      price: parseFloat(form.price) || 0,
    });
    router.push("/admin/lessons");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvelle leçon</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" placeholder="Texte ou HTML de la leçon" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Niveau</label>
            <select value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="1AM">1AM</option>
              <option value="2AM">2AM</option>
              <option value="3AM">3AM</option>
              <option value="4AM">4AM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durée (min)</label>
            <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix (DA)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? "Enregistrement..." : "Créer la leçon"}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900">Annuler</button>
        </div>
      </form>
    </div>
  );
}
