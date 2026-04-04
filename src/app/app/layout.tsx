"use client";

import { AuthProvider, useAuth } from "@/components/AuthProvider";
import LoginPage from "@/components/LoginPage";

const menuItems = [
  { label: "Inicio", href: "/app", icon: "home" },
  { label: "Meus Videos", href: "/app/videos", icon: "video" },
  { label: "Agenda", href: "/app/agenda", icon: "calendar" },
  { label: "Meu Perfil", href: "/app/perfil", icon: "user" },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    video: <><path d="M15.6 11.6L22 7v10l-6.4-4.6" /><rect x="2" y="7" width="14" height="10" rx="2" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#060E0A] border-t border-white/5 z-40 px-4 py-2 flex items-center justify-around">
      {menuItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-1 py-1 px-3 text-gray-400 hover:text-emerald-400 transition-colors"
        >
          <Icon name={item.icon} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function TopBar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#060E0A] border-b border-white/5 z-40 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 68 68" fill="none">
          <rect width="68" height="68" rx="10" fill="#10B981" />
          <rect x="8" y="8" width="52" height="52" rx="2" stroke="#0A1410" strokeWidth="1.2" fill="none" />
          <line x1="34" y1="8" x2="34" y2="18" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="34" y1="50" x2="34" y2="60" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="8" y1="34" x2="18" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <line x1="50" y1="34" x2="60" y2="34" stroke="#0A1410" strokeWidth="1" opacity="0.35" />
          <circle cx="34" cy="34" r="16" fill="#FFFFFF" />
          <polygon points="29,24 29,44 45,34" fill="#0A1410" />
        </svg>
        <span className="text-sm font-semibold text-white">courtida</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{user.name}</span>
        <button onClick={logout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <LoginPage redirectTo="/app" />;

  return (
    <div className="min-h-screen bg-[#0A1410]">
      <TopBar />
      <main className="pt-14 pb-20 min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider requiredRole="user" loginPath="/app">
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
