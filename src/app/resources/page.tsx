"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Resource } from "@/lib/types";

export default function ResourcesPage() {
  const supabase = createClient();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setResources(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    setResources(resources.filter((r) => r.id !== id));
  };

  const typeIcon = (type: string) => {
    if (type.startsWith("image")) return "🖼";
    if (type === "application/pdf") return "📄";
    return "📁";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Ressources</h1>
        <p className="text-neutral-500 mt-1">Fiches, examens et supports de cours</p>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement...</p>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500">Aucune ressource pour le moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{typeIcon(res.file_type)}</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">{res.title}</h3>
                  {res.description && (
                    <p className="text-xs text-neutral-500">{res.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">{res.file_type.split("/").pop()?.toUpperCase()}</span>
                  {res.file_size && (
                    <span className="text-xs text-neutral-400">
                      {(res.file_size / 1024).toFixed(0)} KB
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={res.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Ouvrir
                  </a>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
