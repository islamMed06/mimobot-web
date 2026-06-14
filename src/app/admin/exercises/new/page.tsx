"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function NewExercise() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ title: "", type: "multiple_choice", questions: "", correct_answers: "", class_level: "1AM", price: "0" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("exercises").insert({
      title: form.title,
      type: form.type,
      questions: form.questions,
      correct_answers: form.correct_answers,
      class_level: form.class_level,
      price: parseFloat(form.price) || 0,
    });
    router.push("/admin/exercises");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvel exercice</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="multiple_choice">QCM</option>
            <option value="fill_blank">Texte à trous</option>
            <option value="matching">Association</option>
            <option value="writing">Rédaction</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Questions (JSON ou format libre)</label>
          <textarea value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Réponses correctes</label>
          <textarea value={form.correct_answers} onChange={(e) => setForm({ ...form, correct_answers: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">Prix (DA)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? "Enregistrement..." : "Créer l'exercice"}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900">Annuler</button>
        </div>
      </form>
    </div>
  );
}
