"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Filter, Clock, Play, ChevronDown, FileText, MoreHorizontal } from "lucide-react";

const C = {
  card:"#151929", elevated:"#1a1f35", border:"rgba(255,255,255,0.06)",
  border2:"rgba(255,255,255,0.08)", border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9", sub:"#94a3b8", muted:"#475569", accent:"#6366f1",
  green:"#22c55e", greenBg:"rgba(34,197,94,0.12)", blue:"#3b82f6",
  blueBg:"rgba(59,130,246,0.12)", red:"#ef4444", redBg:"rgba(239,68,68,0.12)",
  grayBg:"rgba(255,255,255,0.06)", orange:"#f97316", purple:"#8b5cf6",
  yellow:"#f59e0b",
};

type Outcome = "Booked"|"Follow Up"|"Not Interested"|"No Answer"|"Voicemail";
interface Call {
  id:string; initials:string; color:string; name:string; phone:string;
  setter:string; date:string; time:string; duration:string; outcome:Outcome;
  score:number|null; topics:string[];
}

const CALLS: Call[] = [
  { id:"1",  initials:"JS", color:C.blue,   name:"John Smith",          phone:"0412 345 678", setter:"Ben",   date:"18 May 2025", time:"10:23 AM", duration:"08:42", outcome:"Booked",       score:82,  topics:["FIFO","Second income","Time freedom"]    },
  { id:"2",  initials:"MB", color:C.green,  name:"Michael Brown",        phone:"0413 234 567", setter:"Sarah", date:"18 May 2025", time:"9:47 AM",  duration:"06:15", outcome:"Follow Up",    score:75,  topics:["Learn trading","Beginner","Risk"]         },
  { id:"3",  initials:"DW", color:C.orange, name:"Daniel Williams",       phone:"0411 456 789", setter:"Jake",  date:"18 May 2025", time:"9:15 AM",  duration:"05:02", outcome:"Not Interested",score:45,  topics:["Not interested","Risk averse"]            },
  { id:"4",  initials:"CM", color:C.red,    name:"Christopher Miller",    phone:"0400 111 222", setter:"Ben",   date:"18 May 2025", time:"8:51 AM",  duration:"07:33", outcome:"Booked",       score:88,  topics:["Financial freedom","Quit job"]            },
  { id:"5",  initials:"MT", color:C.purple, name:"Matthew Taylor",        phone:"0416 789 123", setter:"Sarah", date:"18 May 2025", time:"8:21 AM",  duration:"04:11", outcome:"No Answer",    score:null,topics:["—"]                                       },
  { id:"6",  initials:"RL", color:"#06b6d4",name:"Robert Lee",            phone:"0419 876 543", setter:"Ben",   date:"17 May 2025", time:"3:14 PM",  duration:"09:05", outcome:"Booked",       score:91,  topics:["Retire early","Passive income","FIFO"]    },
  { id:"7",  initials:"AK", color:C.yellow, name:"Andrew King",           phone:"0432 654 321", setter:"Jake",  date:"17 May 2025", time:"2:41 PM",  duration:"04:58", outcome:"Follow Up",    score:68,  topics:["Partner concerns","Time","Money"]          },
  { id:"8",  initials:"SH", color:"#ec4899",name:"Sarah Hughes",          phone:"0455 321 987", setter:"Sarah", date:"17 May 2025", time:"1:30 PM",  duration:"06:22", outcome:"Booked",       score:79,  topics:["Flexibility","Kids","Work from home"]     },
  { id:"9",  initials:"TN", color:"#84cc16",name:"Thomas Nguyen",         phone:"0467 543 210", setter:"Ben",   date:"17 May 2025", time:"11:12 AM", duration:"03:14", outcome:"Voicemail",    score:null,topics:["—"]                                       },
  { id:"10", initials:"PW", color:"#f43f5e",name:"Patrick Wilson",        phone:"0478 012 345", setter:"Jake",  date:"17 May 2025", time:"10:05 AM", duration:"07:48", outcome:"Booked",       score:84,  topics:["Trading","Second income","Flexibility"]   },
];

const outcomeBadge = (o:Outcome) => {
  const m: Record<Outcome,{bg:string;c:string}> = {
    "Booked":        {bg:C.greenBg,  c:C.green },
    "Follow Up":     {bg:C.blueBg,   c:C.blue  },
    "Not Interested":{bg:C.redBg,    c:C.red   },
    "No Answer":     {bg:C.grayBg,   c:C.sub   },
    "Voicemail":     {bg:"rgba(245,158,11,.12)",c:C.yellow},
  };
  return m[o];
};
const scoreStyle = (s:number|null) => {
  if (s===null) return {color:C.sub,bg:"transparent"};
  if (s>=80)    return {color:C.green, bg:"rgba(34,197,94,.10)"};
  if (s>=60)    return {color:C.yellow,bg:"rgba(245,158,11,.10)"};
  return              {color:C.red,   bg:"rgba(239,68,68,.10)"};
};

const card: React.CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:10 };
const pill: React.CSSProperties = { display:"flex",alignItems:"center",gap:6,border:`1px solid rgba(255,255,255,0.10)`,background:C.elevated,borderRadius:8,padding:"5px 12px",fontSize:13,color:C.white,cursor:"pointer" };
const iconBtn: React.CSSProperties = { width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid rgba(255,255,255,0.10)`,borderRadius:6,cursor:"pointer",background:"transparent" };

export default function TranscriptsPage() {
  const [search, setSearch] = useState("");
  const [setter, setSetter] = useState("All Setters");
  const [outcome, setOutcome] = useState("All Outcomes");

  const filtered = CALLS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.topics.join(" ").toLowerCase().includes(q);
    const matchSetter = setter==="All Setters" || c.setter===setter;
    const matchOutcome = outcome==="All Outcomes" || c.outcome===outcome;
    return matchSearch && matchSetter && matchOutcome;
  });

  return (
    <DashboardLayout title="Transcript Library" subtitle="Search, filter and review every call recording and AI analysis">
      {/* Filters row */}
      <div style={{ display:"flex",gap:10,marginBottom:16,flexWrap:"wrap" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border2}`,borderRadius:8,padding:"6px 10px",flex:1,minWidth:200 }}>
          <Search size={14} color={C.sub}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, topic, keyword…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,color:C.white }} />
        </div>
        <button style={pill}>All Setters <ChevronDown size={13} color={C.sub}/></button>
        <button style={pill}>All Outcomes <ChevronDown size={13} color={C.sub}/></button>
        <button style={pill}>All Scores <ChevronDown size={13} color={C.sub}/></button>
        <button style={pill}><Filter size={13} color={C.sub}/> More Filters</button>
      </div>

      {/* Summary stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Total Calls",val:CALLS.length.toString()},
          {label:"Booked",val:CALLS.filter(c=>c.outcome==="Booked").length.toString(),color:C.green},
          {label:"Follow Up",val:CALLS.filter(c=>c.outcome==="Follow Up").length.toString(),color:C.blue},
          {label:"Not Interested",val:CALLS.filter(c=>c.outcome==="Not Interested").length.toString(),color:C.red},
          {label:"Avg AI Score",val:Math.round(CALLS.filter(c=>c.score).reduce((a,c)=>a+(c.score??0),0)/CALLS.filter(c=>c.score).length).toString()},
        ].map(s=>(
          <div key={s.label} style={{ ...card,padding:"10px 16px",flex:1 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:22,fontWeight:700,color:s.color??C.white }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Lead","Setter","Date","Time","Duration","Outcome","AI Score","Topics","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:"left",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row=>{
              const ob = outcomeBadge(row.outcome);
              const ss = scoreStyle(row.score);
              return (
                <tr key={row.id} style={{ borderBottom:`1px solid ${C.border3}`,cursor:"pointer",transition:"background .12s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=C.elevated)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:row.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0 }}>{row.initials}</div>
                      <div>
                        <div style={{ fontWeight:500,color:C.white }}>{row.name}</div>
                        <div style={{ fontSize:11,color:C.sub }}>{row.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px",color:C.sub }}>{row.setter}</td>
                  <td style={{ padding:"10px 14px",color:C.sub,whiteSpace:"nowrap" }}>{row.date}</td>
                  <td style={{ padding:"10px 14px",color:C.sub }}>{row.time}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:4,color:C.sub,fontSize:12 }}>
                      <Clock size={11}/>{row.duration}
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ background:ob.bg,color:ob.c,borderRadius:5,padding:"2px 8px",fontSize:11,whiteSpace:"nowrap" }}>{row.outcome}</span>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ background:ss.bg,color:ss.color,borderRadius:4,padding:"2px 8px",fontWeight:600,fontSize:12 }}>{row.score??"-"}</span>
                  </td>
                  <td style={{ padding:"10px 14px",color:C.sub,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {row.topics.join(", ")}
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex",gap:4 }}>
                      <button style={iconBtn}><Play size={12} color={C.sub}/></button>
                      <button style={iconBtn}><FileText size={12} color={C.sub}/></button>
                      <button style={iconBtn}><MoreHorizontal size={12} color={C.sub}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div style={{ padding:40,textAlign:"center",color:C.sub }}>No calls match your filters.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
