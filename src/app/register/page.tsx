"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "Cet email est déjà inscrit"
          : signUpError.message === "Password should be at least 6 characters"
            ? "Le mot de passe doit faire au moins 6 caractères"
            : signUpError.message
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null,
        role: "free",
      });

      if (profileError) {
        setError("Erreur lors de la création du profil");
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 rounded-2xl bg-blue border-3 border-ink shadow-[5px_5px_0px_#1A1A2E] flex items-center justify-center mx-auto mb-4 -rotate-3">
                <span className="text-white font-display font-bold text-2xl">M</span>
              </div>
            </Link>
            <h1 className="font-display text-2xl font-bold text-ink">Créer un compte</h1>
            <p className="text-ink/60 text-sm mt-1">Inscris-toi pour accéder aux contenus premium</p>
          </div>

          {success ? (
            <div className="bg-mint-light border-3 border-ink rounded-2xl p-6 text-center sticker">
              <i className="fa-solid fa-circle-check text-mint text-4xl mb-3"></i>
              <h2 className="font-display font-bold text-ink text-lg mb-2">Inscription réussie !</h2>
              <p className="text-sm text-ink/60 mb-4">
                Vérifie ta boîte email <strong>{email}</strong> et confirme ton compte avant de te connecter.
              </p>
              <Link href="/login" className="btn-primary inline-flex">
                <i className="fa-regular fa-arrow-right-to-bracket"></i> Se connecter
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl sticker space-y-5">
              <div>
                <label className="block text-sm font-display font-bold text-ink mb-1.5">
                  <i className="fa-regular fa-user text-blue mr-1"></i> Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input w-full px-4 py-3 text-sm"
                  placeholder="Mimoune Kenza"
                />
              </div>

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
                  minLength={6}
                  className="form-input w-full px-4 py-3 text-sm"
                  placeholder="Au moins 6 caractères"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border-2 border-red-200 px-3 py-2 rounded-xl">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i> {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? "Inscription..." : <><i className="fa-regular fa-paper-plane"></i> S&apos;inscrire</>}
              </button>

              <p className="text-center text-sm text-ink/50">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-blue font-bold hover:underline">Connecte-toi</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
