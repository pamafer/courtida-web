"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = { id: string; name: string; slug: string };
type Court = { id: string; name: string; type: string; club_id: string | null };
type AccessDevice = {
  id: string; name: string; model: string; token: string; court_id: string | null; club_id: string | null;
  ip_address: string | null; location: string | null; is_active: boolean; is_online: boolean;
  last_seen_at: string | null; created_at: string;
  courts?: { id: string; name: string; club_id: string | null } | null;
  clubs?: { id: string; name: string } | null;
};

const ist = { backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" };

function OnlineBadge({ online }: { online: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${online ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`} />
      {online ? "Online" : "Offline"}
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}>
      {active ? "Ativo" : "Desativado"}
    </span>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy} title="Copiar token" className="p-1 rounded transition-colors" style={{ color: copied ? "#34d399" : "var(--text-tertiary)" }}>
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
      )}
    </button>
  );
}

export default function AdminDispositivosPage() {
  const [devices, setDevices] = useState<AccessDevice[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClub, setFilterClub] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [delDevice, setDelDevice] = useState<AccessDevice | null>(null);
  const [delLoading, setDelLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editDevice, setEditDevice] = useState<AccessDevice | null>(null);
  const [showToken, setShowToken] = useState<AccessDevice | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [dev, cl, cr] = await Promise.all([
      supabase.from("access_devices").select("*, courts(id, name, club_id), clubs(id, name)").order("created_at", { ascending: false }),
      supabase.from("clubs").select("id, name, slug").eq("is_active", true).order("name"),
      supabase.from("courts").select("id, name, type, club_id").order("name"),
    ]);
    if (dev.data) setDevices(dev.data as unknown as AccessDevice[]);
    if (cl.data) setClubs(cl.data);
    if (cr.data) setCourts(cr.data);
    setLoading(false);
  }

  async function handleDelete() {
    if (!delDevice) return;
    setDelLoading(true);
    const { error } = await supabase.from("access_devices").delete().eq("id", delDevice.id);
    if (!error) setDevices(p => p.filter(d => d.id !== delDevice.id));
    setDelLoading(false);
    setDelDevice(null);
  }

  async function handleToggleActive(device: AccessDevice) {
    const newStatus = !device.is_active;
    const { error } = await supabase.from("access_devices").update({ is_active: newStatus }).eq("id", device.id);
    if (!error) setDevices(p => p.map(d => d.id === device.id ? { ...d, is_active: newStatus } : d));
  }

  async function handleRegenToken(device: AccessDevice) {
    const { data, error } = await supabase.from("access_devices").update({ token: crypto.randomUUID() }).eq("id", device.id).select("token").single();
    if (!error && data) {
      setDevices(p => p.map(d => d.id === device.id ? { ...d, token: data.token } : d));
      setShowToken({ ...device, token: data.token });
    }
  }

  const filtered = devices.filter(d => {
    const ms = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.model?.toLowerCase().includes(search.toLowerCase()) || d.clubs?.name?.toLowerCase().includes(search.toLowerCase()) || d.courts?.name?.toLowerCase().includes(search.toLowerCase());
    const mc = filterClub === "all" || (filterClub === "none" && !d.club_id) || d.club_id === filterClub;
    const mst = filterStatus === "all" || (filterStatus === "online" && d.is_online) || (filterStatus === "offline" && !d.is_online) || (filterStatus === "active" && d.is_active) || (filterStatus === "inactive" && !d.is_active);
    return ms && mc && mst;
  });

  if (loading) return <Spinner />;
  if (showForm) return <DeviceForm device={editDevice} clubs={clubs} courts={courts} onClose={() => { setShowForm(false); setEditDevice(null); }} onSuccess={() => { setShowForm(false); setEditDevice(null); fetchData(); }} />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Dispositivos de Acesso</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{devices.length} {devices.length === 1 ? "dispositivo cadastrado" : "dispositivos cadastrados"}</p>
        </div>
        <button onClick={() => { setEditDevice(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Novo dispositivo
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Nenhum dispositivo cadastrado</h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Adicione o primeiro terminal IDFace.</p>
          <button onClick={() => { setEditDevice(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl">Adicionar dispositivo</button>
        </div>
      ) : (<>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Buscar por nome, modelo, clube ou quadra..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" style={ist} />
          </div>
          <select value={filterClub} onChange={e => setFilterClub(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={ist}>
            <option value="all">Todos os clubes</option><option value="none">Sem clube</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={ist}>
            <option value="all">Todos os status</option><option value="online">Online</option><option value="offline">Offline</option><option value="active">Ativos</option><option value="inactive">Desativados</option>
          </select>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                  {["Dispositivo", "Clube", "Quadra", "Token", "Status", "Estado", "Ações"].map((h, i) => (
                    <th key={h} className={`${i === 6 ? "text-right" : "text-left"} text-xs font-medium uppercase tracking-wider px-5 py-3`} style={{ color: "var(--text-tertiary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(device => (
                  <tr key={device.id} style={{ borderBottom: "1px solid var(--border-default)" }} className="transition-colors"
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--bg-card-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            <path d="M2 12l2-2 2 2" /><path d="M18 12l2-2 2 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{device.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{device.model || "IDFace"}{device.location ? ` — ${device.location}` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {device.clubs ? <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{device.clubs.name}</span> : <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {device.courts ? <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{device.courts.name}</span> : <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>{device.token.substring(0, 8)}...</span>
                        <CopyButton text={device.token} />
                      </div>
                    </td>
                    <td className="px-5 py-4"><OnlineBadge online={device.is_online} /></td>
                    <td className="px-5 py-4"><ActiveBadge active={device.is_active} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowToken(device)} title="Ver token e URL" className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </button>
                        <button onClick={() => handleToggleActive(device)} title={device.is_active ? "Desativar" : "Ativar"} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                          {device.is_active ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          )}
                        </button>
                        <button onClick={() => { setEditDevice(device); setShowForm(true); }} title="Editar" className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button onClick={() => setDelDevice(device)} title="Excluir" className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="px-5 py-12 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Nenhum dispositivo encontrado.</div>}
        </div>
      </>)}

      {/* Modal token */}
      {showToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowToken(null)} />
          <div className="relative w-full max-w-lg p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-modal)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{showToken.name}</h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Configuração do webhook para este dispositivo</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-tertiary)" }}>TOKEN</label>
                <div className="flex items-center gap-2 p-3 rounded-xl font-mono text-sm" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" }}>
                  <span className="flex-1 break-all">{showToken.token}</span>
                  <CopyButton text={showToken.token} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-tertiary)" }}>URL DO WEBHOOK</label>
                <div className="flex items-center gap-2 p-3 rounded-xl font-mono text-xs" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" }}>
                  <span className="flex-1 break-all">https://courtida.com/api/controlid/webhook?token={showToken.token}</span>
                  <CopyButton text={`https://courtida.com/api/controlid/webhook?token=${showToken.token}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-tertiary)" }}>CONFIGURAR NO IDFACE (CURL)</label>
                <div className="p-3 rounded-xl font-mono text-xs leading-relaxed" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-secondary)" }}>
                  {`curl -X POST http://${showToken.ip_address || "IP_DO_DISPOSITIVO"}/set_configuration.fcgi \\`}<br />
                  {`  -d '{"monitor":{"hostname":"courtida.com","port":443,"path":"api/controlid/webhook?token=${showToken.token}"}}'`}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => handleRegenToken(showToken)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-amber-400" style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
                Regenerar token
              </button>
              <button onClick={() => setShowToken(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-hover)" }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {delDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDelDevice(null)} />
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-modal)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-lg font-semibold text-center mb-2" style={{ color: "var(--text-primary)" }}>Excluir dispositivo</h3>
            <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>Tem certeza que deseja excluir <strong style={{ color: "var(--text-primary)" }}>{delDevice.name}</strong>? O token será invalidado.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelDevice(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-hover)" }}>Cancelar</button>
              <button onClick={handleDelete} disabled={delLoading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-xl text-sm font-semibold">{delLoading ? "Excluindo..." : "Excluir"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== FORMULÁRIO ====================

function DeviceForm({ device, clubs, courts, onClose, onSuccess }: { device: AccessDevice | null; clubs: Club[]; courts: Court[]; onClose: () => void; onSuccess: () => void }) {
  const isEditing = !!device;
  const [form, setForm] = useState({
    name: device?.name || "",
    model: device?.model || "IDFace",
    ip_address: device?.ip_address || "",
    location: device?.location || "",
    club_id: device?.club_id || "",
    court_id: device?.court_id || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredCourts = form.club_id ? courts.filter(c => c.club_id === form.club_id) : courts;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "club_id") {
      setForm(p => ({ ...p, club_id: value, court_id: "" }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.name.trim()) { setError("Nome do dispositivo é obrigatório."); setSaving(false); return; }

    const payload = {
      name: form.name.trim(),
      model: form.model.trim() || "IDFace",
      ip_address: form.ip_address.trim() || null,
      location: form.location.trim() || null,
      club_id: form.club_id || null,
      court_id: form.court_id || null,
    };

    try {
      if (isEditing) {
        const { error: e } = await supabase.from("access_devices").update(payload).eq("id", device!.id);
        if (e) throw e;
      } else {
        // Token é gerado automaticamente pelo banco (gen_random_uuid())
        const { error: e } = await supabase.from("access_devices").insert({ ...payload, is_active: true, is_online: false });
        if (e) throw e;
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const ic = "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";
  const models = ["IDFace", "IDFace Mini", "IDFace Max", "IDFace Pro", "Outro"];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{isEditing ? "Editar dispositivo" : "Novo dispositivo"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{isEditing ? `Editando ${device!.name}` : "Preencha os dados do novo dispositivo"}</p>
        </div>
      </div>
      <div className="max-w-2xl">
        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Nome do dispositivo *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="IDFace Quadra 01" className={ic} style={ist} />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Modelo</label>
                <select name="model" value={form.model} onChange={handleChange} className={ic} style={ist}>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Endereço IP</label>
                <input type="text" name="ip_address" value={form.ip_address} onChange={handleChange} placeholder="192.168.1.200" className={ic} style={ist} />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Localização</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Entrada principal" className={ic} style={ist} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Clube</label>
                {clubs.length > 0 ? (
                  <select name="club_id" value={form.club_id} onChange={handleChange} className={ic} style={ist}>
                    <option value="">Sem clube</option>
                    {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  <div className="px-4 py-3 rounded-xl" style={{ ...ist }}>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Nenhum clube cadastrado. <a href="/admin/clubes" className="text-emerald-400">Cadastre primeiro.</a></p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Quadra</label>
                {filteredCourts.length > 0 ? (
                  <select name="court_id" value={form.court_id} onChange={handleChange} className={ic} style={ist}>
                    <option value="">Sem quadra</option>
                    {filteredCourts.map(c => <option key={c.id} value={c.id}>{c.name}{c.type ? ` (${c.type})` : ""}</option>)}
                  </select>
                ) : (
                  <div className="px-4 py-3 rounded-xl" style={{ ...ist }}>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{form.club_id ? "Nenhuma quadra neste clube." : "Selecione um clube primeiro."}</p>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>TOKEN DO DISPOSITIVO</p>
                <p className="text-sm font-mono break-all" style={{ color: "var(--text-secondary)" }}>{device!.token}</p>
              </div>
            )}

            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"><p className="text-sm text-red-400">{error}</p></div>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-hover)" }}>Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">{saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar dispositivo"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
