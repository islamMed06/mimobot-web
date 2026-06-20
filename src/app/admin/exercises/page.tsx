"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";

type Exercise = {
  id: string; title: string; file_url: string; file_type: string; file_size: number | null; class_level: string | null; published: boolean; price: number; description?: string | null;
};

export default function AdminExercises() {
  const supabase = createClient();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadMeta, setUploadMeta] = useState({ title: "", description: "", class_level: "1AM", price: "0", tags: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadExercises = async () => {
    const { data } = await supabase.from("exercises").select("*").order("created_at", { ascending: false });
    if (data) setExercises(data);
    setLoading(false);
  };

  useEffect(() => { loadExercises(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", uploadMeta.title || selectedFile.name);
    formData.append("description", uploadMeta.description);
    formData.append("class_level", uploadMeta.class_level);
    formData.append("price", uploadMeta.price);
    formData.append("tags", uploadMeta.tags);

    const res = await fetch("/api/exercises/upload", { method: "POST", body: formData });
    const data = await res.json();

    setUploading(false);
    if (!data.success) { alert(data.error); return; }

    setSelectedFile(null);
    setUploadMeta({ title: "", description: "", class_level: "1AM", price: "0", tags: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    loadExercises();
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("exercises").update({ published: !current }).eq("id", id);
    loadExercises();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet exercice ?")) return;
    await fetch("/api/exercises/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadExercises();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exercices</h1>

      <form onSubmit={handleUpload} className="bg-white border border-gray-200 rounded-xl p-5 mb-8 space-y-3">
        <h2 className="font-semibold text-sm mb-2">Ajouter un exercice</h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) setSelectedFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          } ${selectedFile ? "bg-green-50 border-green-400" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.mp3,.mp4,.docx,.pptx"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {selectedFile ? (
            <div className="text-sm">
              <span className="text-green-600 font-medium">{selectedFile.name}</span>
              <span className="text-gray-400 ml-2">({formatSize(selectedFile.size)})</span>
              <p className="text-gray-400 mt-1 text-xs">Cliquer pour changer de fichier</p>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              <i className="fa-solid fa-cloud-arrow-up text-2xl mb-2 block"></i>
              <p>Glisser-déposer un fichier ici ou <span className="text-blue-500 underline">parcourir</span></p>
              <p className="text-xs mt-1">PDF, PNG, JPG, MP3, MP4, DOCX, PPTX (max 50 Mo)</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={uploadMeta.title}
            onChange={(e) => setUploadMeta({ ...uploadMeta, title: e.target.value })}
            placeholder="Titre (laissez vide = nom du fichier)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            value={uploadMeta.tags}
            onChange={(e) => setUploadMeta({ ...uploadMeta, tags: e.target.value })}
            placeholder="Tags (séparés par des virgules)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <select value={uploadMeta.class_level} onChange={(e) => setUploadMeta({ ...uploadMeta, class_level: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="1AM">1AM</option>
            <option value="2AM">2AM</option>
            <option value="3AM">3AM</option>
            <option value="4AM">4AM</option>
          </select>
          <input type="number" value={uploadMeta.price} onChange={(e) => setUploadMeta({ ...uploadMeta, price: e.target.value })} placeholder="Prix DA (0 = gratuit)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <input value={uploadMeta.description} onChange={(e) => setUploadMeta({ ...uploadMeta, description: e.target.value })} placeholder="Description (optionnelle)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <button type="submit" disabled={uploading || !selectedFile} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
          {uploading ? "Upload en cours..." : "Uploader le fichier"}
        </button>
      </form>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && exercises.length === 0 && <p className="text-gray-400 text-center py-8">Aucun exercice.</p>}

      <div className="space-y-3">
        {exercises.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{r.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="uppercase">{r.file_type}</span>
                <span>{r.class_level || "—"}</span>
                <span className={r.published ? "text-green-600" : "text-amber-600"}>{r.published ? "Publié" : "Brouillon"}</span>
                {r.file_size && <span>{formatSize(r.file_size)}</span>}
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
