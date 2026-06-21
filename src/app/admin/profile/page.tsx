"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminProfile() {
  const supabase = createClient();
  const [profile, setProfile] = useState({ email: "", full_name: "" });
  const [role, setRole] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setProfile({ email: user.email || "", full_name: user.user_metadata?.full_name || "" });
      supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
        if (data) setRole(data.role);
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { error } = await supabase.auth.updateUser({ data: { full_name: profile.full_name } });
    if (error) {
      setMsg("Error: " + error.message);
    } else {
      setMsg("Profile updated!");
    }
    setSaving(false);
  };

  const handleMakeAdmin = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/profile/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      const data = await res.json();
      if (data.ok) {
        setRole("admin");
        setMsg("Account upgraded to Admin!");
      } else {
        setMsg("Error: " + (data.error || "unknown"));
      }
    } catch (e: any) {
      setMsg("Error: " + e.message);
    }
    setSaving(false);
  };

  const roleBadge = role === "admin" ? "bg-ink text-cream" : role === "premium" ? "bg-mint-light text-mint" : "bg-sun-light text-ink";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Account Type</span>
          <span className={`inline-flex items-center gap-1 font-display font-bold text-xs px-3 py-1 rounded-full border-2 border-ink ${roleBadge}`}>
            <i className={`fa-solid ${role === "admin" ? "fa-crown" : role === "premium" ? "fa-crown" : "fa-user"}`}></i>
            {role === "admin" ? "Admin" : role === "premium" ? "Premium" : "Free"}
          </span>
        </div>
        {role && role !== "admin" && (
          <button
            onClick={handleMakeAdmin}
            disabled={saving}
            className="w-full bg-ink text-cream px-4 py-2 rounded-lg text-sm font-bold hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Upgrading..." : "Make my account Admin"}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={profile.email} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>

        {msg && <p className={`text-sm ${msg.includes("Error") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}

        <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
