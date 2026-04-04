"use client";

import { useAuth } from "@/components/AuthProvider";

export default function AppHome() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Ola, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {user?.club?.name || "Seu clube"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href="/app/videos"
          className="p-4 rounded-xl text-center transition-colors"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.6 11.6L22 7v10l-6.4-4.6" /><rect x="2" y="7" width="14" height="10" rx="2" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Meus Videos</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Ver gravacoes</p>
        </a>
        <a
          href="/app/agenda"
          className="p-4 rounded-xl text-center transition-colors"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Agenda</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Ver horarios</p>
        </a>
      </div>

      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Ultimos check-ins</h2>
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Area do jogador em construcao.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>Em breve voce podera ver seus videos e horarios aqui.</p>
        </div>
      </div>
    </div>
  );
}
