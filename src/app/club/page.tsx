"use client";

import { useAuth } from "@/components/AuthProvider";

export default function ClubDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard do Clube</h1>
        <p className="text-sm text-gray-400 mt-1">
          Bem-vindo, {user?.name} - {user?.club?.name || "Clube"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Quadras ativas", value: "4", change: "Todas online" },
          { label: "Jogadores", value: "247", change: "12 novos este mes" },
          { label: "Lives hoje", value: "2", change: "1 ao vivo" },
          { label: "Gravacoes", value: "186", change: "Este mes" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-emerald-400 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
        <p className="text-gray-400">Painel do moderador em construcao.</p>
        <p className="text-gray-500 text-sm mt-2">As funcionalidades serao adicionadas nos proximos sprints.</p>
      </div>
    </div>
  );
}
