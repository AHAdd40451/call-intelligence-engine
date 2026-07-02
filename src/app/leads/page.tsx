"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Phone, Mail, ChevronDown, UserPlus } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",blueBg:"rgba(59,130,246,0.12)",
  red:"#ef4444",redBg:"rgba(239,68,68,0.12)",yellow:"#f59e0b",purple:"#8b5cf6",orange:"#f97316",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };
const pill: React.CSSProperties = { display:"flex",alignItems:"center",gap:6,border:`1px solid rgba(255,255,255,0.10)`,background:C.elevated,borderRadius:8,padding:"5px 12px",fontSize:13,color:C.white,cursor:"pointer" };

type Status = "Hot"|"Warm"|"Cold"|"Booked"|"Not Interested";
const COLORS: Record<string,string> = {
  "#3b82f6":C.blue,"#22c55e":C.green,"#f97316":C.orange,"#ef4444":C.red,
  "#8b5cf6":C.purple,"#f59e0b":C.yellow,"#06b6d4":"#06b6d4","#ec4899":"#ec4899",
};
const STATUS_BADGE: Record<Status,{bg:string;c:string}> = {
  "Hot":           {bg:"rgba(239,68,68,0.12)",  c:C.red   },
  "Warm":          {bg:"rgba(245,158,11,0.12)", c:C.yellow},
  "Cold":          {bg:"rgba(148,163,184,0.12)",c:C.sub   },
  "Booked":        {bg:"rgba(34,197,94,0.12)",  c:C.green },
  "Not Interested":{bg:"rgba(255,255,255,0.06)",c:C.muted },
};

const LEADS = [
  { id:"1",  initials:"JS", color:"#3b82f6", name:"John Smith",          phone:"0412 345 678", email:"john.smith@email.com",   source:"Facebook Ad",  status:"Booked"        as Status, setter:"Ben",   lastCall:"18 May 2025", calls:1 },
  { id:"2",  initials:"MB", color:"#22c55e", name:"Michael Brown",        phone:"0413 234 567", email:"m.brown@gmail.com",      source:"Instagram",    status:"Warm"          as Status, setter:"Sarah", lastCall:"18 May 2025", calls:2 },
  { id:"3",  initials:"DW", color:"#f97316", name:"Daniel Williams",       phone:"0411 456 789", email:"d.williams@outlook.com", source:"Google Ad",    status:"Not Interested"as Status, setter:"Jake",  lastCall:"18 May 2025", calls:1 },
  { id:"4",  initials:"CM", color:"#ef4444", name:"Christopher Miller",    phone:"0400 111 222", email:"c.miller@email.com",     source:"Referral",     status:"Booked"        as Status, setter:"Ben",   lastCall:"18 May 2025", calls:1 },
  { id:"5",  initials:"MT", color:"#8b5cf6", name:"Matthew Taylor",        phone:"0416 789 123", email:"matt.taylor@gmail.com",  source:"Facebook Ad",  status:"Cold"          as Status, setter:"Sarah", lastCall:"18 May 2025", calls:3 },
  { id:"6",  initials:"RL", color:"#06b6d4", name:"Robert Lee",            phone:"0419 876 543", email:"r.lee@email.com",        source:"Webinar",      status:"Booked"        as Status, setter:"Ben",   lastCall:"17 May 2025", calls:2 },
  { id:"7",  initials:"AK", color:"#f59e0b", name:"Andrew King",           phone:"0432 654 321", email:"a.king@outlook.com",     source:"Instagram",    status:"Warm"          as Status, setter:"Jake",  lastCall:"17 May 2025", calls:1 },
  { id:"8",  initials:"SH", color:"#ec4899", name:"Sarah Hughes",          phone:"0455 321 987", email:"s.hughes@gmail.com",     source:"Facebook Ad",  status:"Booked"        as Status, setter:"Sarah", lastCall:"17 May 2025", calls:1 },
  { id:"9",  initials:"TN", color:"#84cc16", name:"Thomas Nguyen",          phone:"0467 543 210", email:"t.nguyen@email.com",     source:"Google Ad",    status:"Cold"          as Status, setter:"Ben",   lastCall:"17 May 2025", calls:1 },
  { id:"10", initials:"PW", color:"#f43f5e", name:"Patrick Wilson",         phone:"0478 012 345", email:"p.wilson@gmail.com",     source:"Referral",     status:"Hot"           as Status, setter:"Jake",  lastCall:"17 May 2025", calls:2 },
  { id:"11", initials:"GJ", color:"#6366f1", name:"George Johnson",         phone:"0434 567 890", email:"g.johnson@email.com",    source:"Facebook Ad",  status:"Warm"          as Status, setter:"Ben",   lastCall:"16 May 2025", calls:1 },
  { id:"12", initials:"LM", color:"#14b8a6", name:"Lisa Martin",            phone:"0445 678 901", email:"l.martin@gmail.com",     source:"Instagram",    status:"Hot"           as Status, setter:"Sarah", lastCall:"16 May 2025", calls:3 },
];

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const filtered = LEADS.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) || l.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Leads" subtitle="All leads captured from Facebook, Instagram, Google and referrals">
      {/* Stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Total Leads",val:LEADS.length.toString(),color:C.white},
          {label:"Hot",val:LEADS.filter(l=>l.status==="Hot").length.toString(),color:C.red},
          {label:"Booked",val:LEADS.filter(l=>l.status==="Booked").length.toString(),color:C.green},
          {label:"Warm",val:LEADS.filter(l=>l.status==="Warm").length.toString(),color:C.yellow},
          {label:"Not Interested",val:LEADS.filter(l=>l.status==="Not Interested").length.toString(),color:C.muted},
        ].map(k=>(
          <div key={k.label} style={{ ...card,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:22,fontWeight:700,color:k.color }}>{k.val}</div>
          </div>
        ))}
        <button style={{ background:C.accentBg,border:`1px solid rgba(99,102,241,0.30)`,borderRadius:10,padding:"0 18px",display:"flex",alignItems:"center",gap:8,color:C.accent,fontWeight:600,fontSize:13,cursor:"pointer",flexShrink:0 }}>
          <UserPlus size={14}/> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex",gap:10,marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid rgba(255,255,255,0.08)`,borderRadius:8,padding:"6px 10px",flex:1 }}>
          <Search size={14} color={C.sub}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads by name, phone, source…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,color:C.white }} />
        </div>
        <button style={pill}>All Sources <ChevronDown size={13} color={C.sub}/></button>
        <button style={pill}>All Statuses <ChevronDown size={13} color={C.sub}/></button>
        <button style={pill}>All Setters <ChevronDown size={13} color={C.sub}/></button>
      </div>

      {/* Table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Lead","Contact","Source","Status","Setter","Last Call","Calls","Actions"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:i===0?"left":"center",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l=>{
              const sb = STATUS_BADGE[l.status];
              return (
                <tr key={l.id} style={{ borderBottom:`1px solid ${C.border3}`,cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.elevated}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:l.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0 }}>{l.initials}</div>
                      <span style={{ fontWeight:500,color:C.white }}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px",textAlign:"center" }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                      <a href={`tel:${l.phone}`} style={{ display:"flex",alignItems:"center",gap:4,color:C.sub,fontSize:12,textDecoration:"none" }}><Phone size={11}/>{l.phone}</a>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub,fontSize:12 }}>{l.source}</td>
                  <td style={{ padding:"10px 14px",textAlign:"center" }}>
                    <span style={{ background:sb.bg,color:sb.c,borderRadius:5,padding:"2px 10px",fontSize:11,fontWeight:500 }}>{l.status}</span>
                  </td>
                  <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{l.setter}</td>
                  <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub,fontSize:12 }}>{l.lastCall}</td>
                  <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{l.calls}</td>
                  <td style={{ padding:"10px 14px",textAlign:"center" }}>
                    <div style={{ display:"flex",justifyContent:"center",gap:6 }}>
                      <button style={{ padding:"4px 10px",background:C.accentBg,color:C.accent,border:`1px solid rgba(99,102,241,0.20)`,borderRadius:6,fontSize:11,cursor:"pointer" }}>Call</button>
                      <button style={{ padding:"4px 10px",background:C.elevated,color:C.sub,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,cursor:"pointer" }}>View</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
