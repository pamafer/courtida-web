"use client";

import { useEffect, useState } from "react";

type MonuvCamera = {
  id: string;
  description: string;
  stream_status_desc: string;
  live_url: string;
  thumb_url: string;
  player_digest: string;
  address: string;
  plan: string;
  last_recieved_width: number;
  last_recieved_height: number;
};

type MonuvResponse = {
  data: MonuvCamera[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

function CameraStatusBadge({ status }: { status: string }) {
  const isOnline = status === "ONLINE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
        isOnline
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}

function CameraCard({
  camera,
  onSelect,
}: {
  camera: MonuvCamera;
  onSelect: (camera: MonuvCamera) => void;
}) {
  return (
    <div
      onClick={() => onSelect(camera)}
      className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-black/40">
        {camera.thumb_url ? (
          <img
            src={camera.thumb_url}
            alt={camera.description}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.6 11.6L22 7v10l-6.4-4.6" />
              <rect x="2" y="7" width="14" height="10" rx="2" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <CameraStatusBadge status={camera.stream_status_desc} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-white truncate">
          {camera.description}
        </h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{camera.address || "Sem endereço"}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">{camera.plan}</span>
          <span className="text-xs text-gray-500">
            {camera.last_recieved_width}x{camera.last_recieved_height}
          </span>
        </div>
      </div>
    </div>
  );
}

function CameraPlayer({
  camera,
  onClose,
}: {
  camera: MonuvCamera;
  onClose: () => void;
}) {
  const playerUrl = `/api/monuv?action=player&id=${camera.id}`;

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">
            {camera.description}
          </h2>
          <CameraStatusBadge status={camera.stream_status_desc} />
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="aspect-video bg-black">
        <iframe
          src={playerUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
      <div className="px-5 py-3 flex items-center justify-between text-xs text-gray-500">
        <span>{camera.address || "Sem endereço"}</span>
        <span>
          {camera.last_recieved_width}x{camera.last_recieved_height} ·{" "}
          {camera.plan}
        </span>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<MonuvCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCamera, setSelectedCamera] = useState<MonuvCamera | null>(null);
  const [totalCameras, setTotalCameras] = useState(0);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await fetch("/api/monuv?action=cameras");
        if (!res.ok) throw new Error("Erro ao buscar câmeras");
        const data: MonuvResponse = await res.json();
        setCameras(data.data || []);
        setTotalCameras(data.total || 0);
      } catch (err) {
        setError("Não foi possível carregar as câmeras da Monuv.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCameras();
  }, []);

  const onlineCameras = cameras.filter(
    (c) => c.stream_status_desc === "ONLINE"
  ).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Câmeras</h1>
          <p className="text-sm text-gray-400 mt-1">
            {onlineCameras} de {totalCameras} câmeras online · Monuv VMS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Monuv conectada
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Player */}
      {selectedCamera && (
        <div className="mb-8">
          <CameraPlayer
            camera={selectedCamera}
            onClose={() => setSelectedCamera(null)}
          />
        </div>
      )}

      {/* Grid de câmeras */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onSelect={setSelectedCamera}
          />
        ))}
      </div>

      {cameras.length === 0 && !error && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">Nenhuma câmera encontrada</p>
          <p className="text-sm">
            Verifique se há câmeras cadastradas na sua conta Monuv.
          </p>
        </div>
      )}
    </div>
  );
}
