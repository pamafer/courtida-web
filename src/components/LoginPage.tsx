"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserProfile, getDashboardPath } from "@/lib/auth";

const input = "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";

export default function LoginPage({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setStatus("loading"); setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setStatus("error"); setErrorMsg(error.message === "Invalid login credentials" ? "Email ou senha incorretos." : "Erro ao fazer login. Tente novamente."); return; }
    const profile = await getUserProfile();
    if (profile) window.location.href = redirectTo || getDashboardPath(profile.role);
    else { setStatus("error"); setErrorMsg("Perfil nao encontrado. Contacte o administrador."); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <svg width="40" height="40" viewBox="0 0 68 68" fill="none"><rect width="68" height="68" rx="10" fill="#10B981"/><rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none"/><circle cx="34" cy="34" r="16" fill="#FFFFFF"/><polygon points="29,24 29,44 45,34" fill="#0A1410"/></svg>
          <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>courtida</span>
        </div>
        <div className="p-8 rounded-2xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <h1 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Entrar</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Acesse sua conta courtida.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={input} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" className={input} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" }} />
            </div>
            {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              {status === "loading" ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>courtida by Preddita</p>
      </div>
    </div>
  );
}
