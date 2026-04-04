"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ==================== TYPES ====================
type Court = {
  id: string;
  name: string;
  type: string;
  status: string;
  camera_status: string;
};

type Player = {
  id: string;
  name: string;
  photo_initials: string;
};

type Checkin = {
  id: string;
  face_match_score: number;
  checked_in_at: string;
  players: Player;
  courts: Court;
};

type Stream = {
  id: string;
  title: string;
  status: string;
  platform: string;
  viewers: number;
  started_at: string | null;
  scheduled_for: string | null;
  courts: Court;
};

type Video = {
  id: string;
  title: string;
  duration: string;
  file_size: string;
  player_count: number;
  recorded_at: string;
};

// ==================== COMPONENTES ====================

function StatCard({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  trend: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        {trend === "live" ? (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        )}
        <span
          className={`text-xs ${trend === "live" ? "text-red-400" : "text-emerald-400"}`}
        >
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
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function CourtsSection({ courts, streams }: { courts: Court[]; streams: Stream[] }) {
  const liveCourtIds = streams
    .filter((s) => s.status === "live")
    .map((s) => s.courts?.id);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Quadras</h2>
        <span className="text-xs text-gray-500">Tempo real</span>
      </div>
      <div className="divide-y divide-white/5">
        {courts.map((court) => (
          <div
            key={court.id}
            className="px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {liveCourtIds.includes(court.id) && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  AO VIVO
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${court.camera_status === "online" ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <span className="text-xs text-gray-500">Câmera</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayersSection({ checkins }: { checkins: Checkin[] }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          Check-ins recentes
        </h2>
        <span className="text-xs text-gray-500">Reconhecimento facial</span>
      </div>
      <div className="divide-y divide-white/5">
        {checkins.map((checkin) => (
          <div
            key={checkin.id}
            className="px-5 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                {checkin.players?.photo_initials || "??"}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {checkin.players?.name || "Desconhecido"}
                </p>
                <p className="text-xs text-gray-500">
                  {checkin.courts?.name} ·{" "}
                  {new Date(checkin.checked_in_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-gray-500">Match facial</p>
                <p
                  className={`text-sm font-medium ${checkin.face_match_score >= 97 ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {checkin.face_match_score}%
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={checkin.face_match_score >= 97 ? "#34d399" : "#fbbf24"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {checkin.face_match_score >= 97 ? (
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
        {checkins.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            Nenhum check-in registrado ainda
          </div>
        )}
      </div>
    </div>
  );
}

function StreamingSection({ streams }: { streams: Stream[] }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Streaming</h2>
        <span className="text-xs text-gray-500">YouTube Live</span>
      </div>
      <div className="divide-y divide-white/5">
        {streams.map((stream) => {
          const duration =
            stream.status === "live" && stream.started_at
              ? formatDuration(new Date(stream.started_at))
              : "—";

          return (
            <div
              key={stream.id}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stream.status === "live" ? "bg-red-500/10" : "bg-white/5"
                  }`}
                >
                  {stream.status === "live" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {stream.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stream.status === "live"
                      ? `${stream.viewers} assistindo · ${duration}`
                      : `Agendada para ${stream.scheduled_for ? new Date(stream.scheduled_for).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}`}
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
          );
        })}
        {streams.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            Nenhum streaming ativo ou agendado
          </div>
        )}
      </div>
    </div>
  );
}

function VideosSection({ videos }: { videos: Video[] }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          Últimas gravações
        </h2>
        <a
          href="/admin/videos"
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Ver todas
        </a>
      </div>
      <div className="divide-y divide-white/5">
        {videos.map((video) => (
          <div
            key={video.id}
            className="px-5 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15.6 11.6L22 7v10l-6.4-4.6" />
                  <rect x="2" y="7" width="14" height="10" rx="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{video.title}</p>
                <p className="text-xs text-gray-500">
                  {video.duration} · {video.file_size} · {video.player_count}{" "}
                  jogadores
                </p>
              </div>
            </div>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40">
              Assistir
            </button>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            Nenhuma gravação ainda
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

function formatDuration(startedAt: Date): string {
  const diff = Date.now() - startedAt.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ==================== PÁGINA PRINCIPAL ====================

export default function AdminDashboard() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courtsRes, checkinsRes, streamsRes, videosRes] =
          await Promise.all([
            supabase.from("courts").select("*").order("name"),
            supabase
              .from("checkins")
              .select("*, players(*), courts(*)")
              .order("checked_in_at", { ascending: false })
              .limit(10),
            supabase
              .from("streams")
              .select("*, courts(*)")
              .in("status", ["live", "scheduled"])
              .order("created_at", { ascending: false }),
            supabase
              .from("videos")
              .select("*")
              .order("recorded_at", { ascending: false })
              .limit(5),
          ]);

        if (courtsRes.data) setCourts(courtsRes.data);
        if (checkinsRes.data) setCheckins(checkinsRes.data as unknown as Checkin[]);
        if (streamsRes.data) setStreams(streamsRes.data as unknown as Stream[]);
        if (videosRes.data) setVideos(videosRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const liveCount = streams.filter((s) => s.status === "live").length;
  const playerCount = checkins.length;

  const stats = [
    {
      label: "Quadras ativas",
      value: String(courts.filter((c) => c.status !== "maintenance").length),
      change: `${courts.length} total`,
      trend: "up",
    },
    {
      label: "Check-ins hoje",
      value: String(playerCount),
      change: "Reconhecimento facial",
      trend: "up",
    },
    {
      label: "Lives agora",
      value: String(liveCount),
      change: liveCount > 0 ? `${liveCount} ao vivo` : "Nenhuma ao vivo",
      trend: liveCount > 0 ? "live" : "up",
    },
    {
      label: "Gravações",
      value: String(videos.length),
      change: "Últimas gravações",
      trend: "up",
    },
  ];

  const currentTime = new Date().toLocaleString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
        <CourtsSection courts={courts} streams={streams} />
        <PlayersSection checkins={checkins} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StreamingSection streams={streams} />
        <VideosSection videos={videos} />
      </div>
    </div>
  );
}
