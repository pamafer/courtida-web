"use client";

import { useState } from "react";

// ==================== DADOS FICTÍCIOS ====================
const stats = [
  { label: "Quadras ativas", value: "4", change: "+1 esta semana", trend: "up" },
  { label: "Jogadores cadastrados", value: "247", change: "+12 este mês", trend: "up" },
  { label: "Lives hoje", value: "2", change: "1 ao vivo agora", trend: "live" },
  { label: "Gravações (mês)", value: "186", change: "+23% vs mês anterior", trend: "up" },
];

const courts = [
  {
    name: "Quadra 1",
    type: "Beach Tennis",
    status: "occupied",
    currentPlayers: ["Ana Costa", "Bruno Lima"],
    nextSlot: "16:00",
    camera: "online",
    streaming: true,
  },
  {
    name: "Quadra 2",
    type: "Padel",
    status: "occupied",
    currentPlayers: ["Carlos Dias", "Daniela Rocha", "Eduardo Faria", "Fernanda Gil"],
    nextSlot: "17:00",
    camera: "online",
    streaming: false,
  },
  {
    name: "Quadra 3",
    type: "Beach Tennis",
    status: "available",
    currentPlayers: [],
    nextSlot: "15:30",
    camera: "online",
    streaming: false,
  },
  {
    name: "Quadra 4",
    type: "Tênis",
    status: "maintenance",
    currentPlayers: [],
    nextSlot: "—",
    camera: "offline",
    streaming: false,
  },
];

const recentPlayers = [
  { name: "Ana Costa", photo: "AC", checkin: "14:02", court: "Quadra 1", faceMatch: 99.2 },
  { name: "Bruno Lima", photo: "BL", checkin: "14:01", court: "Quadra 1", faceMatch: 97.8 },
  { name: "Carlos Dias", photo: "CD", checkin: "13:55", court: "Quadra 2", faceMatch: 98.5 },
  { name: "Daniela Rocha", photo: "DR", checkin: "13:54", court: "Quadra 2", faceMatch: 96.1 },
  { name: "Eduardo Faria", photo: "EF", checkin: "13:50", court: "Quadra 2", faceMatch: 99.7 },
  { name: "Fernanda Gil", photo: "FG", checkin: "13:48", court: "Quadra 2", faceMatch: 95.3 },
];

const streams = [
  {
    title: "Quadra 1 — Beach Tennis",
    status: "live",
    viewers: 23,
    duration: "01:12:34",
    platform: "YouTube",
  },
  {
    title: "Quadra 2 — Padel",
    status: "scheduled",
    viewers: 0,
    duration: "—",
    platform: "YouTube",
    scheduledTime: "17:00",
  },
];

const recentVideos = [
  { title: "Quadra 1 — 03/04 manhã", duration: "02:15:00", size: "4.2 GB", players: 4 },
  { title: "Quadra 2 — 02/04 tarde", duration: "01:45:00", size: "3.1 GB", players: 4 },
  { title: "Quadra 1 — 02/04 manhã", duration: "02:30:00", size: "4.8 GB", players: 2 },
  { title: "Quadra 3 — 01/04 noite", duration: "01:20:00", size: "2.3 GB", players: 2 },
];

// ==================== COMPONENTES ====================

function StatCard({ label, value, change, trend }: typeof stats[0]) {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        {trend === "live" ? (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        )}
        <span className={`text-xs ${trend === "live" ? "text-red-400" : "text-emerald-400"}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

function CourtStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    occupied: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const labels: Record<string, string> = {
    occupied: "Ocupada",
    available: "Disponível",
    maintenance: "Manutenção",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function CourtsSection() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Quadras</h2>
        <span className="text-xs text-gray-500">Atualizado agora</span>
      </div>
      <div className="divide-y divide-white/5">
        {courts.map((court) => (
          <div key={court.name} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{court.name}</p>
                  <span className="text-xs text-gray-500">{court.type}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <CourtStatusBadge status={court.status} />
                  {court.currentPlayers.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {court.currentPlayers.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {court.streaming && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  AO VIVO
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${court.camera === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs text-gray-500">Câmera</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Próximo horário</p>
                <p className="text-sm text-white">{court.nextSlot}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayersSection() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Check-ins recentes</h2>
        <span className="text-xs text-gray-500">Reconhecimento facial</span>
      </div>
      <div className="divide-y divide-white/5">
        {recentPlayers.map((player) => (
          <div key={player.name} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                {player.photo}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{player.name}</p>
                <p className="text-xs text-gray-500">{player.court} · {player.checkin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-gray-500">Match facial</p>
                <p className={`text-sm font-medium ${player.faceMatch >= 97 ? "text-emerald-400" : "text-amber-400"}`}>
                  {player.faceMatch}%
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={player.faceMatch >= 97 ? "#34d399" : "#fbbf24"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {player.faceMatch >= 97 ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </>
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingSection() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Streaming</h2>
        <span className="text-xs text-gray-500">YouTube Live</span>
      </div>
      <div className="divide-y divide-white/5">
        {streams.map((stream) => (
          <div key={stream.title} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stream.status === "live" ? "bg-red-500/10" : "bg-white/5"
              }`}>
                {stream.status === "live" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{stream.title}</p>
                <p className="text-xs text-gray-500">
                  {stream.status === "live"
                    ? `${stream.viewers} assistindo · ${stream.duration}`
                    : `Agendada para ${stream.scheduledTime}`}
                </p>
              </div>
            </div>
            {stream.status === "live" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                AO VIVO
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VideosSection() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Últimas gravações</h2>
        <a href="/admin/videos" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          Ver todas
        </a>
      </div>
      <div className="divide-y divide-white/5">
        {recentVideos.map((video) => (
          <div key={video.title} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.6 11.6L22 7v10l-6.4-4.6" />
                  <rect x="2" y="7" width="14" height="10" rx="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{video.title}</p>
                <p className="text-xs text-gray-500">{video.duration} · {video.size} · {video.players} jogadores</p>
              </div>
            </div>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40">
              Assistir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== PÁGINA PRINCIPAL ====================

export default function AdminDashboard() {
  const [currentTime] = useState(
    new Date().toLocaleString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{currentTime}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema online
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <CourtsSection />
        <PlayersSection />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StreamingSection />
        <VideosSection />
      </div>
    </div>
  );
}
