"use client";

import { AuthProvider, useAuth } from "@/components/AuthProvider";
import LoginPage from "@/components/LoginPage";
import { ThemeToggle } from "@/components/ThemeProvider";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Clubes", href: "/admin/clubes", icon: "building" },
  { label: "Quadras", href: "/admin/quadras", icon: "court" },
  { label: "Jogadores", href: "/admin/jogadores", icon: "users" },
  { label: "Cameras", href: "/admin/cameras", icon: "camera" },
  { label: "Dispositivos", href: "/admin/dispositivos", icon: "device" },
  { label: "Streaming", href: "/admin/streaming", icon: "stream" },
  { label: "Videos", href: "/admin/videos", icon: "video" },
  { label: "Configuracoes", href: "/admin/config", icon: "settings" },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></>,
    court: <><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    camera: <><path d="M15.6 11.6L22 7v10l-6.4-4.6"/><rect x="2" y="7" width="14" height="10" rx="2"/></>,
    device: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M2 12l2-2 2 2"/><path d="M18 12l2-2 2 2"/></>,
    stream: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></>,
    video: <><path d="M15.6 11.6L22 7v10l-6.4-4.6"/><rect x="2" y="7" width="14" height="10" rx="2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 flex flex-col z-40" style={{ backgroundColor: "var(--bg-sidebar)", borderRight: "1px solid var(--border-default)" }}>
      <div className="h-16 flex items-center gap-2.5 px-5" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <svg width="28" height="28" viewBox="0 0 68 68" fill="none"><rect width="68" height="68" rx="10" fill="#10B981"/><rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none"/><circle cx="34" cy="34" r="16" fill="#FFFFFF"/><polygon points="29,24 29,44 45,34" fill="#0A1410"/></svg>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>courtida</span>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Admin</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <a key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.backgroundColor = "var(--bg-card-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
            <Icon name={item.icon} />{item.label}
          </a>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-semibold shrink-0">
              {user.avatar_initials || user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{user.name}</p>
              <p className="text-xs text-emerald-400">Administrador</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={logout} title="Sair" className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <LoginPage redirectTo="/admin" />;
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <Sidebar />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider requiredRole="admin" loginPath="/admin"><AdminContent>{children}</AdminContent></AuthProvider>;
}
