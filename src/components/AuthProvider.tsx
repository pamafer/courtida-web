"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { getUserProfile, getDashboardPath, type UserProfile } from "@/lib/auth";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
  requiredRole,
  loginPath,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "moderator" | "user";
  loginPath: string;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const profile = await getUserProfile();

      if (!profile) {
        setLoading(false);
        return;
      }

      // Verificar se o role é compatível
      // Admin pode acessar tudo
      // Moderator pode acessar club e app
      // User pode acessar só app
      const roleHierarchy: Record<string, number> = {
        admin: 3,
        moderator: 2,
        user: 1,
      };

      if (roleHierarchy[profile.role] < roleHierarchy[requiredRole]) {
        // Redirecionar para o dashboard correto
        window.location.href = getDashboardPath(profile.role);
        return;
      }

      setUser(profile);
      setLoading(false);
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [requiredRole]);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = loginPath;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1410] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
