"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import LoginPage from "./login/page";

function Sidebar({ user, onLogout }: { user: User; onLogout: () => void }) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      active: true,
    },
    {
      label: "Quadras",
      href: "/admin/quadras",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: "Jogadores",
      href: "/admin/jogadores",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Streaming",
      href: "/admin/streaming",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      ),
    },
    {
      label: "Vídeos",
      href: "/admin/videos",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.6 11.6L22 7v10l-6.4-4.6" />
          <rect x="2" y="7" width="14" height="10" rx="2" />
        </svg>
      ),
    },
    {
      label: "Configurações",
      href: "/admin/config",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#060E0A] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/5">
        <svg width="28" height="28" viewBox="0 0 68 68" fill="none">
          <rect width="68" height="68" rx="10" fill="#10B981" />
          <rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none" />
          <line x1="34" y1="8" x2="34" y2="18" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="34" y1="50" x2="34" y2="60" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="8" y1="34" x2="18" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="50" y1="34" x2="60" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <circle cx="34" cy="34" r="16" fill="#FFFFFF" />
          <polygon points="29,24 29,44 45,34" fill="#0A1410" />
        </svg>
        <span className="text-base font-semibold text-white tracking-tight">courtida</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-semibold shrink-0">
              {user.email?.substring(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sair"
            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0A1410] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) return <LoadingScreen />;

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-[#0A1410]">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}
