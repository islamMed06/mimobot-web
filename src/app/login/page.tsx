"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue border-3 border-ink shadow-[5px_5px_0px_#1A1A2E] flex items-center justify-center mx-auto mb-4 -rotate-3">
              <span className="text-white font-display font-bold text-2xl">M</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">Espace administration</h1>
            <p className="text-ink/60 text-sm mt-1">Connectez-vous pour gérer vos contenus</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded-2xl sticker space-y-5"
          >
            <div>
              <label className="block text-sm font-display font-bold text-ink mb-1.5">
                <i className="fa-regular fa-envelope text-blue mr-1"></i> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input w-full px-4 py-3 text-sm"
                placeholder="vous@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold text-ink mb-1.5">
                <i className="fa-solid fa-lock text-blue mr-1"></i> Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input w-full px-4 py-3 text-sm"
                placeholder="Votre mot de passe"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border-2 border-red-200 px-3 py-2 rounded-xl">
                <i className="fa-solid fa-circle-exclamation mr-1"></i> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? (
                "Connexion..."
              ) : (
                <>
                  <i className="fa-regular fa-paper-plane"></i> Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
