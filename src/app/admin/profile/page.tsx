"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminProfile() {
  const supabase = createClient();
  const [profile, setProfile] = useState({ email: "", full_name: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfile({ email: user.email || "", full_name: user.user_metadata?.full_name || "" });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { error } = await supabase.auth.updateUser({ data: { full_name: profile.full_name } });
    if (error) {
      setMsg("Erreur : " + error.message);
    } else {
      setMsg("Profil mis à jour !");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={profile.email} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>

        {msg && <p className={`text-sm ${msg.includes("Erreur") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}

        <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
