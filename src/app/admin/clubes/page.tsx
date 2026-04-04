"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ==================== TYPES ====================
type Club = {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "pro" | "enterprise";
  logo_url: string | null;
  address: string | null;
  city: string | null;
  state: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  courts_count?: number;
  players_count?: number;
};

// ==================== COMPONENTES ====================

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    starter: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    pro: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    enterprise: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const labels: Record<string, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[plan] || styles.starter}`}
    >
      {labels[plan] || plan}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`}
      />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="9" y1="6" x2="9" y2="6.01" />
          <line x1="15" y1="6" x2="15" y2="6.01" />
          <line x1="9" y1="10" x2="9" y2="10.01" />
          <line x1="15" y1="10" x2="15" y2="10.01" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Nenhum clube cadastrado
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
        Comece adicionando o primeiro clube à plataforma courtida.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Adicionar clube
      </button>
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

function DeleteModal({
  club,
  onConfirm,
  onCancel,
  loading,
}: {
  club: Club;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md p-6 rounded-2xl border border-white/5 bg-[#0D1B14] shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white text-center mb-2">
          Desativar clube
        </h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          Tem certeza que deseja desativar <strong className="text-white">{club.name}</strong>?
          O clube e seus dados serão mantidos, mas o acesso será bloqueado.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {loading ? "Desativando..." : "Desativar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== PÁGINA PRINCIPAL ====================

export default function AdminClubesPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteClub, setDeleteClub] = useState<Club | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar contagens de quadras e jogadores por clube
      if (data && data.length > 0) {
        const clubIds = data.map((c) => c.id);

        const [courtsRes, profilesRes] = await Promise.all([
          supabase
            .from("courts")
            .select("club_id")
            .in("club_id", clubIds),
          supabase
            .from("profiles")
            .select("club_id")
            .eq("role", "user")
            .in("club_id", clubIds),
        ]);

        const courtsCounts: Record<string, number> = {};
        const playersCounts: Record<string, number> = {};

        courtsRes.data?.forEach((c) => {
          courtsCounts[c.club_id] = (courtsCounts[c.club_id] || 0) + 1;
        });

        profilesRes.data?.forEach((p) => {
          playersCounts[p.club_id] = (playersCounts[p.club_id] || 0) + 1;
        });

        const enriched = data.map((club) => ({
          ...club,
          courts_count: courtsCounts[club.id] || 0,
          players_count: playersCounts[club.id] || 0,
        }));

        setClubs(enriched);
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error("Erro ao carregar clubes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(club: Club) {
    if (club.is_active) {
      setDeleteClub(club);
      return;
    }

    // Reativar direto
    const { error } = await supabase
      .from("clubs")
      .update({ is_active: true })
      .eq("id", club.id);

    if (!error) {
      setClubs((prev) =>
        prev.map((c) => (c.id === club.id ? { ...c, is_active: true } : c))
      );
    }
  }

  async function confirmDeactivate() {
    if (!deleteClub) return;
    setDeleteLoading(true);

    const { error } = await supabase
      .from("clubs")
      .update({ is_active: false })
      .eq("id", deleteClub.id);

    if (!error) {
      setClubs((prev) =>
        prev.map((c) =>
          c.id === deleteClub.id ? { ...c, is_active: false } : c
        )
      );
    }

    setDeleteLoading(false);
    setDeleteClub(null);
  }

  function handleEdit(club: Club) {
    setEditingClub(club);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingClub(null);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingClub(null);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingClub(null);
    fetchClubs();
  }

  // Filtros
  const filtered = clubs.filter((club) => {
    const matchSearch =
      search === "" ||
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.slug.toLowerCase().includes(search.toLowerCase()) ||
      club.city?.toLowerCase().includes(search.toLowerCase()) ||
      club.email?.toLowerCase().includes(search.toLowerCase());

    const matchPlan = filterPlan === "all" || club.plan === filterPlan;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && club.is_active) ||
      (filterStatus === "inactive" && !club.is_active);

    return matchSearch && matchPlan && matchStatus;
  });

  if (loading) return <LoadingSpinner />;

  if (showForm) {
    return (
      <ClubForm
        club={editingClub}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clubes</h1>
          <p className="text-sm text-gray-400 mt-1">
            {clubs.length} {clubs.length === 1 ? "clube cadastrado" : "clubes cadastrados"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo clube
        </button>
      </div>

      {clubs.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome, cidade ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="all">Todos os planos</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* Tabela */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Clube
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Plano
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Cidade
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Quadras
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Jogadores
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((club) => (
                    <tr
                      key={club.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-semibold shrink-0">
                            {club.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {club.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {club.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <PlanBadge plan={club.plan} />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-300">
                          {club.city || "—"}
                          {club.state ? `, ${club.state}` : ""}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm text-gray-300">
                          {club.courts_count || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm text-gray-300">
                          {club.players_count || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge active={club.is_active} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(club)}
                            title="Editar"
                            className="p-2 text-gray-500 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleActive(club)}
                            title={club.is_active ? "Desativar" : "Reativar"}
                            className={`p-2 rounded-lg transition-colors ${
                              club.is_active
                                ? "text-gray-500 hover:text-red-400 hover:bg-white/5"
                                : "text-gray-500 hover:text-emerald-400 hover:bg-white/5"
                            }`}
                          >
                            {club.is_active ? (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-gray-500 text-sm">
                Nenhum clube encontrado com os filtros aplicados.
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de desativação */}
      {deleteClub && (
        <DeleteModal
          club={deleteClub}
          onConfirm={confirmDeactivate}
          onCancel={() => setDeleteClub(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

// ==================== FORMULÁRIO ====================

function ClubForm({
  club,
  onClose,
  onSuccess,
}: {
  club: Club | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!club;

  const [form, setForm] = useState({
    name: club?.name || "",
    slug: club?.slug || "",
    plan: club?.plan || "starter",
    address: club?.address || "",
    city: club?.city || "",
    state: club?.state || "SC",
    phone: club?.phone || "",
    email: club?.email || "",
    logo_url: club?.logo_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-gerar slug a partir do nome (se não foi editado manualmente)
      if (name === "name" && !slugManual) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManual(true);
    setForm((prev) => ({
      ...prev,
      slug: e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, ""),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.name.trim() || !form.slug.trim()) {
      setError("Nome e slug são obrigatórios.");
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("clubs")
          .update({
            name: form.name.trim(),
            slug: form.slug.trim(),
            plan: form.plan,
            address: form.address.trim() || null,
            city: form.city.trim() || null,
            state: form.state.trim() || "SC",
            phone: form.phone.trim() || null,
            email: form.email.trim() || null,
            logo_url: form.logo_url.trim() || null,
          })
          .eq("id", club!.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("clubs").insert({
          name: form.name.trim(),
          slug: form.slug.trim(),
          plan: form.plan,
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || "SC",
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          logo_url: form.logo_url.trim() || null,
        });

        if (insertError) {
          if (insertError.code === "23505") {
            setError("Já existe um clube com esse slug. Escolha outro.");
            setSaving(false);
            return;
          }
          throw insertError;
        }
      }

      onSuccess();
    } catch (err) {
      console.error("Erro ao salvar clube:", err);
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const estados = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? "Editar clube" : "Novo clube"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEditing
              ? `Editando ${club!.name}`
              : "Preencha os dados do novo clube"}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-2xl">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome e Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Nome do clube *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Arena Beach Tennis"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="arena-beach-tennis"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors font-mono text-sm"
                />
              </div>
            </div>

            {/* Plano */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Plano
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["starter", "pro", "enterprise"] as const).map((plan) => {
                  const labels = {
                    starter: "Starter",
                    pro: "Pro",
                    enterprise: "Enterprise",
                  };
                  const prices = {
                    starter: "R$ 199/mês",
                    pro: "R$ 399/mês",
                    enterprise: "Sob consulta",
                  };
                  const isSelected = form.plan === plan;

                  return (
                    <button
                      key={plan}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, plan }))
                      }
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${isSelected ? "text-emerald-400" : "text-white"}`}
                      >
                        {labels[plan]}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {prices[plan]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email e Telefone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contato@clube.com.br"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(47) 99999-9999"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Rua das Quadras, 123"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Joinville"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Estado
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                >
                  {estados.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL do Logo */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                URL do logo
              </label>
              <input
                type="url"
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/logo.png"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                {saving
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Criar clube"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
