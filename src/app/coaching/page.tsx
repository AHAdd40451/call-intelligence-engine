"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Trophy, TrendingUp, Phone, CalendarCheck, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",
  red:"#ef4444",redBg:"rgba(239,68,68,0.12)",yellow:"#f59e0b",purple:"#8b5cf6",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };

const SETTERS = [
  { id:"ben",    name:"Ben Carter",    initials:"BC", color:"#3b82f6", calls:187, booked:52, rate:"27.8%", score:84, trend:"+3.2", mistakes:["Rushing closing","Not digging into pain points"],   bestQ:"What does your ideal week look like if this worked out?" },
  { id:"sarah",  name:"Sarah Mitchell",initials:"SM", color:"#22c55e", calls:163, booked:48, rate:"29.4%", score:89, trend:"+5.1", mistakes:["Over-explaining product","Talking too fast"],          bestQ:"How long have you been looking for a solution like this?" },
  { id:"jake",   name:"Jake Turner",   initials:"JT", color:"#f97316", calls:142, booked:31, rate:"21.8%", score:71, trend:"-1.4", mistakes:["Weak urgency","Not handling money objection well"],  bestQ:"What's stopping you from starting today?" },
  { id:"emma",   name:"Emma Davis",    initials:"ED", color:"#8b5cf6", calls:98,  booked:29, rate:"29.6%", score:91, trend:"+7.3", mistakes:["Booking confidence","Follow-up timing"],              bestQ:"If I could show you how other FIFO workers are doing this, would that help?" },
  { id:"marcus", name:"Marcus Lee",    initials:"ML", color:"#f59e0b", calls:76,  booked:18, rate:"23.7%", score:76, trend:"+1.8", mistakes:["Discovery depth","Qualifying budget too late"],       bestQ:"Tell me more about what a second income would change for you." },
];

function ScoreRing({ score, size=52 }: { score:number; size?:number }) {
  const r = size*0.36; const circ = 2*Math.PI*r;
  const color = score>=80?C.green:score>=65?C.yellow:C.red;
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.elevated} strokeWidth={size*0.11}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.11}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
        <span style={{ fontSize:size*0.26,fontWeight:700,color:C.white,lineHeight:1 }}>{score}</span>
      </div>
    </div>
  );
}

export default function CoachingPage() {
  const top = [...SETTERS].sort((a,b)=>b.score-a.score);

  return (
    <DashboardLayout title="AI Sales Coaching" subtitle="Per-setter performance analytics, mistake patterns and coaching recommendations">

      {/* Leaderboard podium */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {top.slice(0,3).map((s,i)=>(
          <div key={s.id} style={{ ...card,flex:1,padding:16,position:"relative",border:`1px solid ${i===0?"rgba(245,158,11,0.30)":C.border}` }}>
            {i===0&&<Trophy size={16} color={C.yellow} style={{ position:"absolute",top:12,right:12 }}/>}
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700 }}>{s.initials}</div>
              <div>
                <div style={{ fontWeight:600,color:C.white,fontSize:14 }}>{s.name}</div>
                <div style={{ fontSize:11,color:C.sub }}>#{i+1} Ranked setter</div>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              {[
                {label:"Calls",val:s.calls.toString()},
                {label:"Booked",val:s.booked.toString()},
                {label:"Book %",val:s.rate},
              ].map(m=>(
                <div key={m.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16,fontWeight:700,color:C.white }}>{m.val}</div>
                  <div style={{ fontSize:10,color:C.sub }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <ScoreRing score={s.score} size={48}/>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11,color:C.sub }}>AI Score</div>
                <div style={{ fontSize:13,color:s.trend.startsWith("+")?C.green:C.red,fontWeight:600 }}>{s.trend} this week</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full setter table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6 }}>
          <Star size={14} color={C.accent}/>
          <span style={{ fontSize:13,fontWeight:600 }}>All Setters</span>
        </div>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Setter","Calls","Booked","Book Rate","AI Score","Trend","Common Mistakes","View"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:i===0?"left":"center",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((s,i)=>(
              <tr key={s.id} style={{ borderBottom:`1px solid ${C.border3}`,cursor:"pointer",transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.elevated}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:32,height:32,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700 }}>{s.initials}</div>
                    <div>
                      <div style={{ fontWeight:500,color:C.white }}>{s.name}</div>
                      <div style={{ fontSize:11,color:C.sub }}>Setter #{i+1}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{s.calls}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{s.booked}</td>
                <td style={{ padding:"10px 14px",textAlign:"center" }}>
                  <span style={{ background:C.greenBg,color:C.green,borderRadius:4,padding:"2px 8px",fontSize:12,fontWeight:600 }}>{s.rate}</span>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center" }}>
                  <ScoreRing score={s.score} size={40}/>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:s.trend.startsWith("+")?C.green:C.red,fontWeight:600 }}>{s.trend}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub,fontSize:12 }}>
                  {s.mistakes[0]}
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center" }}>
                  <Link href={`/coaching/${s.id}`} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:12,color:C.accent,textDecoration:"none" }}>
                    View <ChevronRight size={12}/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
