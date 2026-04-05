"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = { id: string; name: string; slug: string };
type Camera = { id: string; name: string; court_id: string|null; club_id: string|null; is_active: boolean; is_online: boolean; ip_address: string|null; monuv_camera_id: string|null };
type AccessDevice = { id: string; name: string; model: string; court_id: string|null; club_id: string|null; is_active: boolean; is_online: boolean; ip_address: string|null };
type Court = { id: string; name: string; type: string; status: string; camera_status: string; club_id: string|null; created_at: string; clubs?: Club; cameras: Camera[]; access_devices: AccessDevice[] };

const ist = { backgroundColor: "var(--bg-input)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" };

function StatusBadge({ status }: { status: string }) {
  const c: Record<string,string> = { available:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20", occupied:"bg-amber-500/10 text-amber-400 border-amber-500/20", maintenance:"bg-red-500/10 text-red-400 border-red-500/20" };
  const l: Record<string,string> = { available:"Disponível", occupied:"Ocupada", maintenance:"Manutenção" };
  const d: Record<string,string> = { available:"bg-emerald-500", occupied:"bg-amber-500", maintenance:"bg-red-500" };
  return <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${c[status]||c.available}`}><span className={`w-1.5 h-1.5 rounded-full ${d[status]||d.available}`}/>{l[status]||status}</span>;
}

function DevicePill({ name, online }: { name: string; online: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${online?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-red-500/10 text-red-400 border-red-500/20"}`}><span className={`w-1.5 h-1.5 rounded-full ${online?"bg-emerald-500":"bg-red-500"}`}/>{name}</span>;
}

function NoBadge({ label }: { label: string }) { return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-gray-500/10 text-gray-500 border-gray-500/20">{label}</span>; }

function Spinner() { return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"/></div>; }

export default function AdminQuadrasPage() {
  const [courts,setCourts]=useState<Court[]>([]); const [clubs,setClubs]=useState<Club[]>([]); const [allCameras,setAllCameras]=useState<Camera[]>([]); const [allDevices,setAllDevices]=useState<AccessDevice[]>([]);
  const [loading,setLoading]=useState(true); const [search,setSearch]=useState(""); const [filterClub,setFilterClub]=useState("all"); const [filterStatus,setFilterStatus]=useState("all");
  const [delCourt,setDelCourt]=useState<Court|null>(null); const [delLoading,setDelLoading]=useState(false); const [showForm,setShowForm]=useState(false); const [editCourt,setEditCourt]=useState<Court|null>(null);

  useEffect(()=>{fetchData();},[]);

  async function fetchData() {
    setLoading(true);
    const [cr,cl,cam,dev] = await Promise.all([
      supabase.from("courts").select("*, clubs(id, name, slug)").order("created_at",{ascending:false}),
      supabase.from("clubs").select("id, name, slug").eq("is_active",true).order("name"),
      supabase.from("cameras").select("*").order("name"),
      supabase.from("access_devices").select("*").order("name"),
    ]);
    const cameras: Camera[] = (cam.data||[]) as Camera[];
    const devices: AccessDevice[] = (dev.data||[]) as AccessDevice[];
    setAllCameras(cameras); setAllDevices(devices);
    if(cl.data) setClubs(cl.data);
    if(cr.data) setCourts(cr.data.map(c=>({...c, cameras:cameras.filter(x=>x.court_id===c.id), access_devices:devices.filter(x=>x.court_id===c.id)})) as unknown as Court[]);
    setLoading(false);
  }

  async function handleDelete() {
    if(!delCourt) return; setDelLoading(true);
    await supabase.from("cameras").update({court_id:null}).eq("court_id",delCourt.id);
    await supabase.from("access_devices").update({court_id:null}).eq("court_id",delCourt.id);
    const{error}=await supabase.from("courts").delete().eq("id",delCourt.id);
    if(!error) setCourts(p=>p.filter(c=>c.id!==delCourt.id));
    setDelLoading(false); setDelCourt(null);
  }

  const filtered=courts.filter(c=>{
    const ms=search===""||c.name.toLowerCase().includes(search.toLowerCase())||c.type?.toLowerCase().includes(search.toLowerCase())||c.clubs?.name?.toLowerCase().includes(search.toLowerCase());
    const mc=filterClub==="all"||(filterClub==="none"&&!c.club_id)||c.club_id===filterClub;
    const mst=filterStatus==="all"||c.status===filterStatus;
    return ms&&mc&&mst;
  });

  if(loading) return <Spinner/>;
  if(showForm) return <CourtForm court={editCourt} clubs={clubs} allCameras={allCameras} allDevices={allDevices} onClose={()=>{setShowForm(false);setEditCourt(null);}} onSuccess={()=>{setShowForm(false);setEditCourt(null);fetchData();}}/>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold" style={{color:"var(--text-primary)"}}>Quadras</h1><p className="text-sm mt-1" style={{color:"var(--text-secondary)"}}>{courts.length} {courts.length===1?"quadra cadastrada":"quadras cadastradas"}</p></div>
        <button onClick={()=>{setEditCourt(null);setShowForm(true);}} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nova quadra
        </button>
      </div>

      {courts.length===0?(
        <div className="rounded-xl p-12 text-center" style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border-default)"}}><h3 className="text-lg font-semibold mb-2" style={{color:"var(--text-primary)"}}>Nenhuma quadra cadastrada</h3><p className="text-sm mb-6" style={{color:"var(--text-secondary)"}}>Comece adicionando a primeira quadra.</p>
          <button onClick={()=>{setEditCourt(null);setShowForm(true);}} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl">Adicionar quadra</button></div>
      ):(<>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--text-tertiary)"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar por nome, tipo ou clube..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" style={ist}/>
          </div>
          <select value={filterClub} onChange={e=>setFilterClub(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={ist}><option value="all">Todos os clubes</option><option value="none">Sem clube</option>{clubs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" style={ist}><option value="all">Todos os status</option><option value="available">Disponível</option><option value="occupied">Ocupada</option><option value="maintenance">Manutenção</option></select>
        </div>
        <div className="rounded-xl overflow-hidden" style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border-default)"}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{borderBottom:"1px solid var(--border-default)"}}>
                {["Quadra","Clube","Tipo","Status","Câmeras","Dispositivos","Ações"].map((h,i)=><th key={h} className={`${i===6?"text-right":"text-left"} text-xs font-medium uppercase tracking-wider px-5 py-3`} style={{color:"var(--text-tertiary)"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(court=>(
                  <tr key={court.id} style={{borderBottom:"1px solid var(--border-default)"}} className="transition-colors" onMouseEnter={e=>{e.currentTarget.style.backgroundColor="var(--bg-card-hover)";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";}}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><circle cx="12" cy="12" r="3"/></svg></div><p className="text-sm font-medium" style={{color:"var(--text-primary)"}}>{court.name}</p></div></td>
                    <td className="px-5 py-4">{court.clubs?<div><p className="text-sm" style={{color:"var(--text-secondary)"}}>{court.clubs.name}</p><p className="text-xs" style={{color:"var(--text-tertiary)"}}>{court.clubs.slug}</p></div>:<span className="text-sm" style={{color:"var(--text-tertiary)"}}>—</span>}</td>
                    <td className="px-5 py-4"><span className="text-sm" style={{color:"var(--text-secondary)"}}>{court.type||"—"}</span></td>
                    <td className="px-5 py-4"><StatusBadge status={court.status}/></td>
                    <td className="px-5 py-4"><div className="flex flex-wrap gap-1">{court.cameras.length>0?court.cameras.map(c=><DevicePill key={c.id} name={c.name} online={c.is_online}/>):<NoBadge label="Nenhuma"/>}</div></td>
                    <td className="px-5 py-4"><div className="flex flex-wrap gap-1">{court.access_devices.length>0?court.access_devices.map(d=><DevicePill key={d.id} name={d.name} online={d.is_online}/>):<NoBadge label="Nenhum"/>}</div></td>
                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-1">
                      <button onClick={()=>{setEditCourt(court);setShowForm(true);}} title="Editar" className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={()=>setDelCourt(court)} title="Excluir" className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length===0&&<div className="px-5 py-12 text-center text-sm" style={{color:"var(--text-tertiary)"}}>Nenhuma quadra encontrada.</div>}
        </div>
      </>)}
      {delCourt&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setDelCourt(null)}/>
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl" style={{backgroundColor:"var(--bg-modal)",border:"1px solid var(--border-default)"}}>
            <h3 className="text-lg font-semibold text-center mb-2" style={{color:"var(--text-primary)"}}>Excluir quadra</h3>
            <p className="text-sm text-center mb-6" style={{color:"var(--text-secondary)"}}>Tem certeza que deseja excluir <strong style={{color:"var(--text-primary)"}}>{delCourt.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelCourt(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{color:"var(--text-secondary)",border:"1px solid var(--border-hover)"}}>Cancelar</button>
              <button onClick={handleDelete} disabled={delLoading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-xl text-sm font-semibold">{delLoading?"Excluindo...":"Excluir"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== FORMULÁRIO ====================

function CourtForm({court,clubs,allCameras,allDevices,onClose,onSuccess}:{court:Court|null;clubs:Club[];allCameras:Camera[];allDevices:AccessDevice[];onClose:()=>void;onSuccess:()=>void}) {
  const isEditing=!!court;
  const [form,setForm]=useState({name:court?.name||"",type:court?.type||"",status:court?.status||"available",club_id:court?.club_id||""});
  const [selCameras,setSelCameras]=useState<string[]>(court?.cameras.map(c=>c.id)||[]);
  const [selDevices,setSelDevices]=useState<string[]>(court?.access_devices.map(d=>d.id)||[]);
  const [saving,setSaving]=useState(false); const [error,setError]=useState("");

  const availCameras=allCameras.filter(c=>!c.court_id||c.court_id===court?.id);
  const availDevices=allDevices.filter(d=>!d.court_id||d.court_id===court?.id);

  function handleChange(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>){setForm(p=>({...p,[e.target.name]:e.target.value}));}
  function toggleCam(id:string){setSelCameras(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);}
  function toggleDev(id:string){setSelDevices(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);}

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError("");
    if(!form.name.trim()){setError("Nome da quadra é obrigatório.");setSaving(false);return;}
    const payload={name:form.name.trim(),type:form.type.trim()||null,status:form.status,camera_status:selCameras.length>0?"online":"offline",club_id:form.club_id||null};
    try{
      let courtId=court?.id;
      if(isEditing){const{error:e}=await supabase.from("courts").update(payload).eq("id",court!.id);if(e)throw e;}
      else{const{data,error:e}=await supabase.from("courts").insert(payload).select("id").single();if(e)throw e;courtId=data.id;}
      if(courtId){
        await supabase.from("cameras").update({court_id:null}).eq("court_id",courtId);
        await supabase.from("access_devices").update({court_id:null}).eq("court_id",courtId);
        if(selCameras.length>0) await supabase.from("cameras").update({court_id:courtId}).in("id",selCameras);
        if(selDevices.length>0) await supabase.from("access_devices").update({court_id:courtId}).in("id",selDevices);
      }
      onSuccess();
    }catch(err){console.error(err);setError("Erro ao salvar.");}finally{setSaving(false);}
  }

  const types=["Beach Tennis","Padel","Tênis","Futevôlei","Vôlei de Praia","Basquete","Futsal","Squash","Badminton","Pickleball","Outro"];
  const ic="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";

  function CheckboxList({title,items,selected,toggle,emptyMsg}:{title:string;items:{id:string;name:string;is_online?:boolean;is_active?:boolean}[];selected:string[];toggle:(id:string)=>void;emptyMsg:string}){
    return(
      <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>{title}</label>
        {items.length>0?(
          <div className="space-y-2">{items.map(item=>{const ch=selected.includes(item.id);const online=item.is_online||false;return(
            <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{border:`1px solid ${ch?"rgba(16,185,129,0.5)":"var(--border-hover)"}`,backgroundColor:ch?"rgba(16,185,129,0.1)":"var(--bg-card)"}}>
              <input type="checkbox" checked={ch} onChange={()=>toggle(item.id)} className="sr-only"/>
              <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors" style={{borderColor:ch?"#10b981":"var(--border-hover)",backgroundColor:ch?"#10b981":"transparent"}}>
                {ch&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div className="flex-1 min-w-0"><p className={`text-sm font-medium ${ch?"text-emerald-400":""}`} style={ch?{}:{color:"var(--text-primary)"}}>{item.name}</p></div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${online?"bg-emerald-500/10 text-emerald-400":"bg-red-500/10 text-red-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${online?"bg-emerald-500":"bg-red-500"}`}/>{online?"Online":"Offline"}
              </span>
            </label>);})}</div>
        ):(<div className="px-4 py-3 rounded-xl" style={{backgroundColor:"var(--bg-input)",border:"1px solid var(--border-hover)"}}><p className="text-sm" style={{color:"var(--text-tertiary)"}}>{emptyMsg}</p></div>)}
      </div>
    );
  }

  return(
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{color:"var(--text-tertiary)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 className="text-2xl font-bold" style={{color:"var(--text-primary)"}}>{isEditing?"Editar quadra":"Nova quadra"}</h1><p className="text-sm mt-1" style={{color:"var(--text-secondary)"}}>{isEditing?`Editando ${court!.name}`:"Preencha os dados da nova quadra"}</p></div>
      </div>
      <div className="max-w-2xl"><div className="rounded-2xl p-6" style={{backgroundColor:"var(--bg-card)",border:"1px solid var(--border-default)"}}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Nome da quadra *</label><input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Quadra 01" className={ic} style={ist}/></div>
            <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Modalidade</label><select name="type" value={form.type} onChange={handleChange} className={ic} style={ist}><option value="">Selecione</option>{types.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Clube</label>
            {clubs.length>0?<select name="club_id" value={form.club_id} onChange={handleChange} className={ic} style={ist}><option value="">Sem clube (avulsa)</option>{clubs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
            :<div className="px-4 py-3 rounded-xl" style={{...ist}}><p className="text-sm" style={{color:"var(--text-tertiary)"}}>Nenhum clube cadastrado. <a href="/admin/clubes" className="text-emerald-400">Cadastre primeiro.</a></p></div>}
          </div>
          <div><label className="block text-sm mb-1.5" style={{color:"var(--text-secondary)"}}>Status</label>
            <div className="grid grid-cols-3 gap-2">
              {([{v:"available",l:"Disponível",c:"emerald"},{v:"occupied",l:"Ocupada",c:"amber"},{v:"maintenance",l:"Manutenção",c:"red"}] as const).map(o=>{const sel=form.status===o.v;const bc=sel?(o.c==="emerald"?"rgba(16,185,129,0.5)":o.c==="amber"?"rgba(245,158,11,0.5)":"rgba(239,68,68,0.5)"):"var(--border-hover)";const bg=sel?(o.c==="emerald"?"rgba(16,185,129,0.1)":o.c==="amber"?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)"):"var(--bg-card)";const tc=sel?(o.c==="emerald"?"#34d399":o.c==="amber"?"#fbbf24":"#f87171"):"var(--text-secondary)";
                return<button key={o.v} type="button" onClick={()=>setForm(p=>({...p,status:o.v}))} className="p-3 rounded-xl text-center transition-all" style={{border:`1px solid ${bc}`,backgroundColor:bg}}><p className="text-xs font-medium" style={{color:tc}}>{o.l}</p></button>;
              })}
            </div>
          </div>
          <CheckboxList title="Câmeras (Monuv)" items={availCameras} selected={selCameras} toggle={toggleCam} emptyMsg="Nenhuma câmera disponível. Cadastre câmeras primeiro."/>
          <CheckboxList title="Dispositivos de acesso (IDFace)" items={availDevices} selected={selDevices} toggle={toggleDev} emptyMsg="Nenhum dispositivo disponível. Cadastre dispositivos primeiro."/>
          {error&&<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"><p className="text-sm text-red-400">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors" style={{color:"var(--text-secondary)",border:"1px solid var(--border-hover)"}}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20">{saving?"Salvando...":isEditing?"Salvar alterações":"Criar quadra"}</button>
          </div>
        </form>
      </div></div>
    </div>
  );
}
