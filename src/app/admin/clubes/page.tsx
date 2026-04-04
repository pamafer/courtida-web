"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = { id: string; name: string; slug: string; plan: "starter"|"pro"|"enterprise"; logo_url: string|null; address: string|null; city: string|null; state: string; phone: string|null; email: string|null; is_active: boolean; created_at: string; courts_count?: number; players_count?: number };

const tv = (v: string) => `var(--${v})`;
const s = { page: { backgroundColor: tv("bg-page") }, card: { backgroundColor: tv("bg-card"), border: `1px solid ${tv("border-default")}` }, input: { backgroundColor: tv("bg-input"), border: `1px solid ${tv("border-hover")}`, color: tv("text-primary") }, modal: { backgroundColor: tv("bg-modal"), border: `1px solid ${tv("border-default")}` }, t1: { color: tv("text-primary") }, t2: { color: tv("text-secondary") }, t3: { color: tv("text-tertiary") }, bdr: { borderColor: tv("border-default") }, bdr2: { borderColor: tv("border-hover") } };

function PlanBadge({ plan }: { plan: string }) {
  const st: Record<string,string> = { starter: "bg-gray-500/10 text-gray-400 border-gray-500/20", pro: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", enterprise: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  const lb: Record<string,string> = { starter: "Starter", pro: "Pro", enterprise: "Enterprise" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${st[plan]||st.starter}`}>{lb[plan]||plan}</span>;
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${active?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-red-500/10 text-red-400 border-red-500/20"}`}><span className={`w-1.5 h-1.5 rounded-full ${active?"bg-emerald-500":"bg-red-500"}`}/>{active?"Ativo":"Inativo"}</span>;
}

function Spinner() { return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"/></div>; }

export default function AdminClubesPage() {
  const [clubs, setClubs] = useState<Club[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(""); const [filterPlan, setFilterPlan] = useState("all"); const [filterStatus, setFilterStatus] = useState("all"); const [deleteClub, setDeleteClub] = useState<Club|null>(null); const [deleteLoading, setDeleteLoading] = useState(false); const [showForm, setShowForm] = useState(false); const [editingClub, setEditingClub] = useState<Club|null>(null);

  useEffect(() => { fetchClubs(); }, []);

  async function fetchClubs() {
    setLoading(true);
    const { data } = await supabase.from("clubs").select("*").order("created_at",{ascending:false});
    if (data && data.length > 0) {
      const ids = data.map(c=>c.id);
      const [cr, pr] = await Promise.all([supabase.from("courts").select("club_id").in("club_id",ids), supabase.from("profiles").select("club_id").eq("role","user").in("club_id",ids)]);
      const cc: Record<string,number> = {}; const pc: Record<string,number> = {};
      cr.data?.forEach(c=>{cc[c.club_id]=(cc[c.club_id]||0)+1;}); pr.data?.forEach(p=>{pc[p.club_id]=(pc[p.club_id]||0)+1;});
      setClubs(data.map(c=>({...c, courts_count:cc[c.id]||0, players_count:pc[c.id]||0})));
    } else setClubs([]);
    setLoading(false);
  }

  async function handleToggle(club: Club) { if (club.is_active) { setDeleteClub(club); return; } const {error}=await supabase.from("clubs").update({is_active:true}).eq("id",club.id); if(!error) setClubs(p=>p.map(c=>c.id===club.id?{...c,is_active:true}:c)); }
  async function confirmDeactivate() { if(!deleteClub) return; setDeleteLoading(true); const {error}=await supabase.from("clubs").update({is_active:false}).eq("id",deleteClub.id); if(!error) setClubs(p=>p.map(c=>c.id===deleteClub.id?{...c,is_active:false}:c)); setDeleteLoading(false); setDeleteClub(null); }

  const filtered = clubs.filter(c => { const ms=search===""||c.name.toLowerCase().includes(search.toLowerCase())||c.slug.toLowerCase().includes(search.toLowerCase())||c.city?.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase()); const mp=filterPlan==="all"||c.plan===filterPlan; const mst=filterStatus==="all"||(filterStatus==="active"&&c.is_active)||(filterStatus==="inactive"&&!c.is_active); return ms&&mp&&mst; });

  if (loading) return <Spinner />;
  if (showForm) return <ClubForm club={editingClub} onClose={()=>{setShowForm(false);setEditingClub(null);}} onSuccess={()=>{setShowForm(false);setEditingClub(null);fetchClubs();}} />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold" style={s.t1}>Clubes</h1><p className="text-sm mt-1" style={s.t2}>{clubs.length} {clubs.length===1?"clube cadastrado":"clubes cadastrados"}</p></div>
        <button onClick={()=>{setEditingClub(null);setShowForm(true);}} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Novo clube
        </button>
      </div>

      {clubs.length===0 ? (
        <div className="rounded-xl p-12 text-center" style={s.card}><h3 className="text-lg font-semibold mb-2" style={s.t1}>Nenhum clube cadastrado</h3><p className="text-sm mb-6" style={s.t2}>Comece adicionando o primeiro clube.</p>
          <button onClick={()=>{setEditingClub(null);setShowForm(true);}} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl">Adicionar clube</button></div>
      ) : (<>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--text-tertiary)"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar por nome, cidade ou email..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" style={s.input} />
          </div>
          <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={s.input}><option value="all">Todos os planos</option><option value="starter">Starter</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option></select>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={s.input}><option value="all">Todos os status</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select>
        </div>
        <div className="rounded-xl overflow-hidden" style={s.card}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{borderBottom:`1px solid var(--border-default)`}}>
                {["Clube","Plano","Cidade","Quadras","Jogadores","Status","Ações"].map((h,i)=><th key={h} className={`${i===3||i===4?"text-center":i===6?"text-right":"text-left"} text-xs font-medium uppercase tracking-wider px-5 py-3`} style={s.t3}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(club=>(
                  <tr key={club.id} style={{borderBottom:`1px solid var(--border-default)`}} className="transition-colors" onMouseEnter={e=>{e.currentTarget.style.backgroundColor="var(--bg-card-hover)";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";}}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-semibold shrink-0">{club.name.substring(0,2).toUpperCase()}</div><div className="min-w-0"><p className="text-sm font-medium truncate" style={s.t1}>{club.name}</p><p className="text-xs truncate" style={s.t3}>{club.slug}</p></div></div></td>
                    <td className="px-5 py-4"><PlanBadge plan={club.plan}/></td>
                    <td className="px-5 py-4"><p className="text-sm" style={s.t2}>{club.city||"—"}{club.state?`, ${club.state}`:""}</p></td>
                    <td className="px-5 py-4 text-center"><span className="text-sm" style={s.t2}>{club.courts_count||0}</span></td>
                    <td className="px-5 py-4 text-center"><span className="text-sm" style={s.t2}>{club.players_count||0}</span></td>
                    <td className="px-5 py-4"><StatusBadge active={club.is_active}/></td>
                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-1">
                      <button onClick={()=>{setEditingClub(club);setShowForm(true);}} title="Editar" className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={()=>handleToggle(club)} title={club.is_active?"Desativar":"Reativar"} className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}>{club.is_active?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length===0&&<div className="px-5 py-12 text-center text-sm" style={s.t3}>Nenhum clube encontrado com os filtros aplicados.</div>}
        </div>
      </>)}
      {deleteClub&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setDeleteClub(null)}/>
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl" style={s.modal}>
            <h3 className="text-lg font-semibold text-center mb-2" style={s.t1}>Desativar clube</h3>
            <p className="text-sm text-center mb-6" style={s.t2}>Tem certeza que deseja desativar <strong style={s.t1}>{deleteClub.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteClub(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{...s.t2, border:`1px solid var(--border-hover)`}}>Cancelar</button>
              <button onClick={confirmDeactivate} disabled={deleteLoading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-xl text-sm font-semibold">{deleteLoading?"Desativando...":"Desativar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClubForm({ club, onClose, onSuccess }: { club: Club|null; onClose:()=>void; onSuccess:()=>void }) {
  const isEditing=!!club;
  const [form,setForm]=useState({name:club?.name||"",slug:club?.slug||"",plan:club?.plan||"starter",address:club?.address||"",city:club?.city||"",state:club?.state||"SC",phone:club?.phone||"",email:club?.email||"",logo_url:club?.logo_url||""});
  const [saving,setSaving]=useState(false); const [error,setError]=useState(""); const [slugManual,setSlugManual]=useState(isEditing);

  function genSlug(n:string){return n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  function handleChange(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>){const{name,value}=e.target;setForm(p=>{const u={...p,[name]:value};if(name==="name"&&!slugManual)u.slug=genSlug(value);return u;});}

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError("");
    if(!form.name.trim()||!form.slug.trim()){setError("Nome e slug são obrigatórios.");setSaving(false);return;}
    const payload={name:form.name.trim(),slug:form.slug.trim(),plan:form.plan,address:form.address.trim()||null,city:form.city.trim()||null,state:form.state.trim()||"SC",phone:form.phone.trim()||null,email:form.email.trim()||null,logo_url:form.logo_url.trim()||null};
    try{
      if(isEditing){const{error:e}=await supabase.from("clubs").update(payload).eq("id",club!.id);if(e)throw e;}
      else{const{error:e}=await supabase.from("clubs").insert(payload);if(e){if(e.code==="23505"){setError("Já existe um clube com esse slug.");setSaving(false);return;}throw e;}}
      onSuccess();
    }catch(err){console.error(err);setError("Erro ao salvar.");}finally{setSaving(false);}
  }

  const estados=["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  const ic="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";
  const ist={backgroundColor:"var(--bg-input)",border:"1px solid var(--border-hover)",color:"var(--text-primary)"};

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 className="text-2xl font-bold" style={{color:"var(--text-primary)"}}>{isEditing?"Editar clube":"Novo clube"}</h1><p className="text-sm mt-1" style={{color:"var(--text-secondary)"}}>{isEditing?`Editando ${club!.name}`:"Preencha os dados do novo clube"}</p></div>
      </div>
      <div className="max-w-2xl"><div className="rounded-2xl p-6" style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border-default)"}}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Nome do clube *</label><input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Arena Beach Tennis" className={ic} style={ist}/></div>
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Slug (URL) *</label><input type="text" name="slug" required value={form.slug} onChange={e=>{setSlugManual(true);setForm(p=>({...p,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"")}));}} placeholder="arena-beach-tennis" className={`${ic} font-mono text-sm`} style={ist}/></div>
          </div>
          <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Plano</label>
            <div className="grid grid-cols-3 gap-3">
              {(["starter","pro","enterprise"] as const).map(plan=>{const sel=form.plan===plan;return(
                <button key={plan} type="button" onClick={()=>setForm(p=>({...p,plan}))} className="p-4 rounded-xl text-left transition-all" style={{border:`1px solid ${sel?"rgba(16,185,129,0.5)":"var(--border-hover)"}`,backgroundColor:sel?"rgba(16,185,129,0.1)":"var(--bg-card)"}}>
                  <p className={`text-sm font-semibold ${sel?"text-emerald-400":""}`} style={sel?{}:{color:"var(--text-primary)"}}>{({starter:"Starter",pro:"Pro",enterprise:"Enterprise"})[plan]}</p>
                  <p className="text-xs mt-0.5" style={{color:"var(--text-tertiary)"}}>{({starter:"R$ 199/mês",pro:"R$ 399/mês",enterprise:"Sob consulta"})[plan]}</p>
                </button>);
              })}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>E-mail</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contato@clube.com.br" className={ic} style={ist}/></div>
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Telefone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(47) 99999-9999" className={ic} style={ist}/></div>
          </div>
          <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Endereço</label><input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Rua das Quadras, 123" className={ic} style={ist}/></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Cidade</label><input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Joinville" className={ic} style={ist}/></div>
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Estado</label><select name="state" value={form.state} onChange={handleChange} className={ic} style={ist}>{estados.map(uf=><option key={uf} value={uf}>{uf}</option>)}</select></div>
          </div>
          <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>URL do logo</label><input type="url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://exemplo.com/logo.png" className={ic} style={ist}/></div>
          {error&&<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"><p className="text-sm text-red-400">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors" style={{color:"var(--text-secondary)",border:"1px solid var(--border-hover)"}}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">{saving?"Salvando...":isEditing?"Salvar alterações":"Criar clube"}</button>
          </div>
        </form>
      </div></div>
    </div>
  );
}
