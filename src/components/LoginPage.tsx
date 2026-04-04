"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserProfile, getDashboardPath } from "@/lib/auth";

export default function LoginPage({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : "Erro ao fazer login. Tente novamente."
      );
      return;
    }

    // Buscar perfil e redirecionar baseado no role
    const profile = await getUserProfile();
    if (profile) {
      window.location.href = redirectTo || getDashboardPath(profile.role);
    } else {
      setStatus("error");
      setErrorMsg("Perfil nao encontrado. Contacte o administrador.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1410] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <svg width="40" height="40" viewBox="0 0 68 68" fill="none">
            <rect width="68" height="68" rx="10" fill="#10B981" />
            <rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none" />
            <line x1="34" y1="8" x2="34" y2="18" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
            <line x1="34" y1="50" x2="34" y2="60" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
            <line x1="8" y1="34" x2="18" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
            <line x1="50" y1="34" x2="60" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
            <circle cx="34" cy="34" r="16" fill="#FFFFFF" />
            <polygon points="29,24 29,44 45,34" fill="#0A1410" />
          </svg>
          <span className="text-2xl font-bold text-white tracking-tight">courtida</span>
        </div>

        <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h1 className="text-lg font-semibold text-white mb-1">Entrar</h1>
          <p className="text-sm text-gray-400 mb-6">Acesse sua conta courtida.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">E-mail</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1.5">Senha</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {status === "loading" ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">courtida by Preddita</p>
      </div>
    </div>
  );
}
