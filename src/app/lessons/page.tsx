"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Lesson } from "@/lib/types";
import Link from "next/link";

export default function LessonsPage() {
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setLessons(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("lessons").delete().eq("id", id);
    setLessons(lessons.filter((l) => l.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Leçons</h1>
          <p className="text-neutral-500 mt-1">Gérez vos leçons d&apos;anglais</p>
        </div>
        <Link
          href="/lessons/new"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Nouvelle leçon
        </Link>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement...</p>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500 mb-4">Aucune leçon pour le moment</p>
          <Link
            href="/lessons/new"
            className="text-primary hover:underline text-sm"
          >
            Créer votre première leçon
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
                  {lesson.class_level || "Tous niveaux"}
                </span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{lesson.title}</h3>
              {lesson.description && (
                <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{lesson.description}</p>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">
                  {new Date(lesson.created_at).toLocaleDateString("fr-FR")}
                </span>
                <button
                  onClick={() => handleDelete(lesson.id)}
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
