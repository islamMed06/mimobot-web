"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function NewLessonPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    classLevel: "",
    durationMinutes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("lessons").insert({
      teacher_id: user.id,
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      class_level: form.classLevel || null,
      duration_minutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
      tags: [form.classLevel].filter(Boolean),
    });

    if (!error) router.push("/lessons");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/lessons" className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block">
        &larr; Retour aux leçons
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Nouvelle leçon</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Titre *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Contenu</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Niveau</label>
            <select
              value={form.classLevel}
              onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous niveaux</option>
              <option value="1AM">1ère AM</option>
              <option value="2AM">2ème AM</option>
              <option value="3AM">3ème AM</option>
              <option value="4AM">4ème AM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Durée (minutes)</label>
            <input
              type="number"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Création..." : "Créer la leçon"}
          </button>
          <Link href="/lessons" className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
