"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Trophy, TrendingUp, TrendingDown, Phone, UserPlus } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",
  red:"#ef4444",yellow:"#f59e0b",purple:"#8b5cf6",orange:"#f97316",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };

const SETTERS = [
  { id:"emma",   name:"Emma Davis",     initials:"ED", color:"#8b5cf6", calls:98,  booked:29, rate:29.6, score:91, trend:7.3,  status:"active", joined:"Jan 2025" },
  { id:"sarah",  name:"Sarah Mitchell", initials:"SM", color:"#22c55e", calls:163, booked:48, rate:29.4, score:89, trend:5.1,  status:"active", joined:"Feb 2025" },
  { id:"ben",    name:"Ben Carter",     initials:"BC", color:"#3b82f6", calls:187, booked:52, rate:27.8, score:84, trend:3.2,  status:"active", joined:"Dec 2024" },
  { id:"marcus", name:"Marcus Lee",     initials:"ML", color:"#f59e0b", calls:76,  booked:18, rate:23.7, score:76, trend:1.8,  status:"active", joined:"Mar 2025" },
  { id:"jake",   name:"Jake Turner",    initials:"JT", color:"#f97316", calls:142, booked:31, rate:21.8, score:71, trend:-1.4, status:"active", joined:"Jan 2025" },
];

function ScoreRing({ score, size=56 }: { score:number; size?:number }) {
  const r = size*0.36; const circ = 2*Math.PI*r;
  const color = score>=80?C.green:score>=65?C.yellow:C.red;
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.elevated} strokeWidth={size*0.10}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.10}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
        <span style={{ fontSize:size*0.24,fontWeight:700,color:C.white,lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:size*0.16,color:C.sub }}>/100</span>
      </div>
    </div>
  );
}

export default function SettersPage() {
  const total = SETTERS.reduce((a,s)=>({calls:a.calls+s.calls,booked:a.booked+s.booked}),{calls:0,booked:0});

  return (
    <DashboardLayout title="Setters" subtitle="Team roster, performance overview and individual stats">
      {/* Stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Total Setters",val:SETTERS.length.toString(),color:C.white},
          {label:"Total Calls",val:total.calls.toString(),color:C.blue},
          {label:"Total Booked",val:total.booked.toString(),color:C.green},
          {label:"Team Book Rate",val:`${((total.booked/total.calls)*100).toFixed(1)}%`,color:C.green},
          {label:"Avg AI Score",val:Math.round(SETTERS.reduce((a,s)=>a+s.score,0)/SETTERS.length).toString(),color:C.accent},
        ].map(k=>(
          <div key={k.label} style={{ ...card,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:22,fontWeight:700,color:k.color }}>{k.val}</div>
          </div>
        ))}
        <button style={{ background:C.accentBg,border:`1px solid rgba(99,102,241,0.30)`,borderRadius:10,padding:"0 18px",display:"flex",alignItems:"center",gap:8,color:C.accent,fontWeight:600,fontSize:13,cursor:"pointer",flexShrink:0 }}>
          <UserPlus size={14}/> Add Setter
        </button>
      </div>

      {/* Setter cards grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12,marginBottom:14 }}>
        {SETTERS.map((s,i)=>(
          <div key={s.id} style={{ ...card,padding:18 }}>
            {/* Header */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700 }}>{s.initials}</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:600,color:C.white }}>{s.name}</div>
                  <div style={{ fontSize:11,color:C.sub }}>Since {s.joined}</div>
                </div>
              </div>
              {i===0&&<Trophy size={16} color={C.yellow}/>}
            </div>
            {/* Metrics */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14 }}>
              {[
                {label:"Calls",val:s.calls.toString()},
                {label:"Booked",val:s.booked.toString()},
                {label:"Rate",val:`${s.rate}%`},
              ].map(m=>(
                <div key={m.label} style={{ textAlign:"center",background:C.elevated,borderRadius:8,padding:"8px 4px" }}>
                  <div style={{ fontSize:16,fontWeight:700,color:C.white }}>{m.val}</div>
                  <div style={{ fontSize:10,color:C.sub,marginTop:2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            {/* Score + trend */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <ScoreRing score={s.score} size={56}/>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11,color:C.sub }}>AI Score</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4,fontSize:13,fontWeight:600,color:s.trend>0?C.green:C.red,marginTop:4 }}>
                  {s.trend>0?<TrendingUp size={13}/>:<TrendingDown size={13}/>}
                  {s.trend>0?"+":""}{s.trend}% this week
                </div>
                <div style={{ marginTop:8 }}>
                  <a href={`/coaching/${s.id}`} style={{ fontSize:12,color:C.accent,textDecoration:"none" }}>View coaching →</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6 }}>
          <Phone size={14} color={C.accent}/><span style={{ fontSize:13,fontWeight:600 }}>Side-by-Side Comparison</span>
        </div>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Setter","Calls","Booked","Book Rate","AI Score","Trend","Joined"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:i===0?"left":"center",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SETTERS.map(s=>(
              <tr key={s.id} style={{ borderBottom:`1px solid ${C.border3}` }}
                onMouseEnter={e=>e.currentTarget.style.background=C.elevated}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:30,height:30,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700 }}>{s.initials}</div>
                    <span style={{ color:C.white,fontWeight:500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{s.calls}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{s.booked}</td>
                <td style={{ padding:"10px 14px",textAlign:"center" }}>
                  <span style={{ background:C.greenBg,color:C.green,borderRadius:4,padding:"2px 8px",fontSize:12,fontWeight:600 }}>{s.rate}%</span>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center",fontWeight:700,color:s.score>=80?C.green:s.score>=65?C.yellow:C.red }}>{s.score}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:s.trend>0?C.green:C.red,fontWeight:600 }}>{s.trend>0?"+":""}{s.trend}%</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub,fontSize:12 }}>{s.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
