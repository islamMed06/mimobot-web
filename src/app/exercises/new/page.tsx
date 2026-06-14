"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function NewExercisePage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    title: "",
    type: "multiple_choice" as string,
    questions: "",
    correctAnswers: "",
    classLevel: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("exercises").insert({
      teacher_id: user.id,
      title: form.title,
      type: form.type as any,
      questions: form.questions,
      correct_answers: form.correctAnswers,
      class_level: form.classLevel || null,
    });

    if (!error) router.push("/exercises");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/exercises" className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block">
        &larr; Retour aux exercices
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Nouvel exercice</h1>

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
          <label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="multiple_choice">QCM (Choix multiples)</option>
            <option value="fill_blank">Texte à trous</option>
            <option value="matching">Association</option>
            <option value="writing">Rédaction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Questions (format JSON)
          </label>
          <textarea
            value={form.questions}
            onChange={(e) => setForm({ ...form, questions: e.target.value })}
            rows={6}
            placeholder='[{"question": "What is ...?", "options": ["A", "B", "C"], "answer": "A"}]'
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Corrigé (JSON)</label>
          <textarea
            value={form.correctAnswers}
            onChange={(e) => setForm({ ...form, correctAnswers: e.target.value })}
            rows={3}
            placeholder='{"answers": ["A", "B", "C"]}'
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

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

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Création..." : "Créer l&apos;exercice"}
          </button>
          <Link href="/exercises" className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
