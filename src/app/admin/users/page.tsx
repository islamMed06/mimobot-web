"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const togglePremium = async (user: any) => {
    const newRole = user.role === "premium" ? "free" : "premium";
    await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    fetchUsers();
  };

  if (loading) return <p className="text-ink/60">Chargement...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-6">
        <i className="fa-solid fa-users text-blue mr-2"></i> Gestion des utilisateurs
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-3 border-ink rounded-2xl overflow-hidden">
          <thead className="bg-ink text-cream font-display text-sm">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Rôle</th>
              <th className="p-3 text-center">Inscrit le</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`${i % 2 === 0 ? "bg-cream" : "bg-white"} border-b-2 border-ink/10`}>
                <td className="p-3 font-semibold">{u.full_name || "—"}</td>
                <td className="p-3 text-ink/70">{u.email}</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center gap-1 font-display font-bold text-xs px-3 py-1 rounded-full border-2 border-ink ${
                    u.role === "admin" ? "bg-ink text-cream" :
                    u.role === "premium" ? "bg-mint-light text-mint" :
                    "bg-sun-light text-ink"
                  }`}>
                    <i className={`fa-solid ${u.role === "admin" ? "fa-crown" : u.role === "premium" ? "fa-crown" : "fa-user"}`}></i>
                    {u.role === "admin" ? "Admin" : u.role === "premium" ? "Premium" : "Gratuit"}
                  </span>
                </td>
                <td className="p-3 text-center text-ink/50 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => togglePremium(u)}
                      className={`font-display font-bold text-xs px-4 py-1.5 rounded-full border-2 border-ink transition-all cursor-pointer ${
                        u.role === "premium"
                          ? "bg-coral text-white hover:bg-coral-light hover:text-ink"
                          : "bg-mint text-white hover:bg-mint-light hover:text-ink"
                      }`}
                    >
                      {u.role === "premium" ? "Rétrograder" : "Passer Premium"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-ink/40 font-display text-lg">Aucun utilisateur inscrit pour le moment.</p>
        </div>
      )}
    </div>
  );
}
