"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Exercise } from "@/lib/types";
import Link from "next/link";

export default function ExercisesPage() {
  const supabase = createClient();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setExercises(data);
      setLoading(false);
    };
    load();
  }, []);

  const typeLabels: Record<string, string> = {
    multiple_choice: "QCM",
    fill_blank: "Texte à trous",
    matching: "Association",
    writing: "Rédaction",
  };

  const handleDelete = async (id: string) => {
    await supabase.from("exercises").delete().eq("id", id);
    setExercises(exercises.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Exercices</h1>
          <p className="text-neutral-500 mt-1">Créez et gérez vos exercices interactifs</p>
        </div>
        <Link
          href="/exercises/new"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Nouvel exercice
        </Link>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement...</p>
      ) : exercises.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500 mb-4">Aucun exercice pour le moment</p>
          <Link href="/exercises/new" className="text-primary hover:underline text-sm">
            Créer votre premier exercice
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-secondary bg-secondary-light px-2 py-1 rounded">
                  {typeLabels[ex.type] || ex.type}
                </span>
                {ex.class_level && (
                  <span className="text-xs text-neutral-400">{ex.class_level}</span>
                )}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">{ex.title}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">
                  {new Date(ex.created_at).toLocaleDateString("fr-FR")}
                </span>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
