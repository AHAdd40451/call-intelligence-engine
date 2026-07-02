"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  ChevronDown, Calendar, RefreshCw,
  Phone, MessageSquare, CalendarCheck, CheckCircle, DollarSign,
  ArrowUp, Search, Filter, Clock, Play,
  Info, Frown, Star, X, ArrowRight,
  PlayCircle, FileText,
} from "lucide-react";

/* ─── Palette (used via inline styles throughout) ─────────────────────── */
const C = {
  bg:        "#0d0f1a",
  sidebar:   "#0f1120",
  card:      "#151929",
  elevated:  "#1a1f35",
  border:    "rgba(255,255,255,0.06)",
  border2:   "rgba(255,255,255,0.08)",
  border3:   "rgba(255,255,255,0.04)",
  border4:   "rgba(255,255,255,0.10)",
  border5:   "rgba(255,255,255,0.15)",
  accent:    "#6366f1",
  white:     "#f1f5f9",
  sub:       "#94a3b8",
  muted:     "#475569",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.12)",
  blue:      "#3b82f6",
  blueBg:    "rgba(59,130,246,0.12)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.12)",
  orange:    "#f97316",
  yellow:    "#f59e0b",
  yellowBg:  "rgba(245,158,11,0.12)",
  purple:    "#8b5cf6",
  grayBg:    "rgba(255,255,255,0.06)",
} as const;

/* ─── Data ─────────────────────────────────────────────────────────────── */
const KPIS = [
  { Icon: Phone,        color: C.blue,   label: "Total Calls",           value: "1,248",  change: "↑18% vs last 7 days" },
  { Icon: MessageSquare,color: C.green,  label: "Conversations (60s+)",  value: "642",    change: "↑22% vs last 7 days" },
  { Icon: CalendarCheck,color: C.purple, label: "Calls Booked",          value: "87",     change: "↑16% vs last 7 days" },
  { Icon: CheckCircle,  color: C.blue,   label: "Show Rate",             value: "68%",    change: "↑7% vs last 7 days"  },
  { Icon: DollarSign,   color: C.green,  label: "Close Rate",            value: "31%",    change: "↑5% vs last 7 days"  },
  { Icon: DollarSign,   color: C.yellow, label: "Revenue (This Week)",   value: "$42,600",change: "↑12% vs last 7 days" },
];

const CALLS = [
  { id:"1", initials:"JS", color:C.blue,   name:"John Smith",        phone:"0412 345 678", setter:"Ben",   dt:"18 May, 10:23 AM", dur:"08:42" },
  { id:"2", initials:"MB", color:C.green,  name:"Michael Brown",     phone:"0413 234 567", setter:"Sarah", dt:"18 May, 9:47 AM",  dur:"06:15" },
  { id:"3", initials:"DW", color:C.orange, name:"Daniel Williams",   phone:"0411 456 789", setter:"Jake",  dt:"18 May, 9:15 AM",  dur:"05:02" },
  { id:"4", initials:"CM", color:C.red,    name:"Christopher Miller",phone:"0400 111 222", setter:"Ben",   dt:"18 May, 8:51 AM",  dur:"03:33" },
  { id:"5", initials:"MT", color:C.purple, name:"Matthew Taylor",    phone:"0416 789 123", setter:"Sarah", dt:"18 May, 8:21 AM",  dur:"04:11" },
];

const TABS = ["Transcript","AI Summary","Call Analysis","Notes"] as const;

const TRANSCRIPT = [
  { speaker:"Ben",  time:"00:00", text:"Hey John, it's Ben from Capital Growth Traders. Just calling because you filled out the info on our 3 Day Challenge. Is now a good time to chat?" },
  { speaker:"John", time:"00:07", text:"Yeah mate, this is a good time." },
  { speaker:"Ben",  time:"00:09", text:"Perfect. So John, what made you look into trading and our challenge?" },
  { speaker:"John", time:"00:15", text:"Mainly looking for a way to create a second income. I work FIFO and want more time with my family." },
  { speaker:"Ben",  time:"00:24", text:"That's awesome John. So FIFO life can be tough. How long have you been looking for something flexible?" },
  { speaker:"John", time:"00:35", text:"Probably about six months now. I've tried a few things but nothing's really worked out." },
  { speaker:"Ben",  time:"00:42", text:"Totally get that. And what does your ideal week look like — if you had that flexibility and second income sorted?" },
  { speaker:"John", time:"00:51", text:"Just being home more. Watching my kids grow up instead of being away for three weeks at a time." },
];

const BEST_TIMES = [
  { time:"6AM – 8AM",   connect:"12%", conv:"6%",  booking:"2%", show:"40%", close:"10%", hi:false },
  { time:"8AM – 10AM",  connect:"28%", conv:"14%", booking:"3%", show:"52%", close:"14%", hi:false },
  { time:"10AM – 12PM", connect:"42%", conv:"22%", booking:"6%", show:"70%", close:"28%", hi:true  },
  { time:"12PM – 2PM",  connect:"32%", conv:"18%", booking:"5%", show:"66%", close:"25%", hi:false },
  { time:"2PM – 4PM",   connect:"34%", conv:"20%", booking:"5%", show:"65%", close:"23%", hi:false },
  { time:"4PM – 6PM",   connect:"22%", conv:"12%", booking:"3%", show:"50%", close:"12%", hi:false },
  { time:"6PM – 8PM",   connect:"8%",  conv:"4%",  booking:"1%", show:"30%", close:"5%",  hi:false },
];

const SCORES = [
  { color:C.green,  label:"Script Compliance",  score:18 },
  { color:C.blue,   label:"Qualification",       score:16 },
  { color:C.orange, label:"Objection Handling",  score:15 },
  { color:C.purple, label:"Closing & Booking",   score:17 },
  { color:"#06b6d4",label:"Communication",        score:16 },
];

type Outcome = "Booked"|"Follow Up"|"Not Interested"|"No Answer";
const TABLE_ROWS: {name:string;setter:string;dt:string;dur:string;outcome:Outcome;score:number|null;topics:string}[] = [
  { name:"John Smith",        setter:"Ben",   dt:"18 May, 10:23 AM", dur:"08:42", outcome:"Booked",       score:82, topics:"FIFO, Second income, Time freedom" },
  { name:"Michael Brown",     setter:"Sarah", dt:"18 May, 9:47 AM",  dur:"06:15", outcome:"Follow Up",    score:75, topics:"Learn trading, No experience" },
  { name:"Daniel Williams",   setter:"Jake",  dt:"18 May, 9:15 AM",  dur:"05:02", outcome:"Not Interested",score:45, topics:"Not interested, Risk averse" },
  { name:"Christopher Miller",setter:"Ben",   dt:"18 May, 8:51 AM",  dur:"07:33", outcome:"Booked",       score:88, topics:"Financial freedom, Quit job" },
  { name:"Matthew Taylor",    setter:"Sarah", dt:"18 May, 8:21 AM",  dur:"04:11", outcome:"No Answer",    score:null,topics:"—" },
];

function outcomePill(o: Outcome) {
  const map: Record<Outcome,{bg:string;color:string}> = {
    "Booked":        { bg:C.greenBg,  color:C.green  },
    "Follow Up":     { bg:C.blueBg,   color:C.blue   },
    "Not Interested":{ bg:C.redBg,    color:C.red    },
    "No Answer":     { bg:C.grayBg,   color:C.sub    },
  };
  return map[o];
}
function scoreStyle(s:number|null) {
  if (s === null) return { color:C.sub, background:"transparent" };
  if (s >= 80)    return { color:C.green,  background:"rgba(34,197,94,0.10)"  };
  if (s >= 60)    return { color:C.yellow, background:"rgba(245,158,11,0.10)" };
  return              { color:C.red,    background:"rgba(239,68,68,0.10)"  };
}

/* ─── Shared style helpers ───────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  overflow: "hidden",
};
const pill: React.CSSProperties = {
  display:"flex", alignItems:"center", gap:6,
  border:`1px solid ${C.border4}`,
  background: C.elevated,
  borderRadius: 8,
  padding:"5px 12px",
  fontSize: 13,
  color: C.white,
  cursor:"pointer",
  whiteSpace:"nowrap",
};
const iconBtn: React.CSSProperties = {
  width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center",
  border:`1px solid ${C.border4}`, borderRadius:4, cursor:"pointer",
  background:"transparent",
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [tab, setTab]     = useState<typeof TABS[number]>("Transcript");
  const [selId, setSelId] = useState("1");
  const sel = CALLS.find(c => c.id === selId) ?? CALLS[0];

  const R = 36;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - 0.82);

  return (
    <div style={{ display:"flex", height:"100dvh", width:"100%", overflow:"hidden", background:C.bg, color:C.white }}>
      <Sidebar />

      {/* ── Right of sidebar ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:600, color:C.white }}>CGT AI Call Intelligence Dashboard</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:1 }}>Transcripts, Best Times to Call &amp; AI Call Analysis</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button style={pill}><span>All Setters</span><ChevronDown size={13} color={C.sub}/></button>
            <button style={pill}><span>All Outcomes</span><ChevronDown size={13} color={C.sub}/></button>
            <button style={pill}><Calendar size={13} color={C.sub}/><span>12 May 2025 – 18 May 2025</span></button>
            <div style={{ display:"flex", alignItems:"center", gap:6, paddingLeft:8 }}>
              <span style={{ fontSize:11, color:C.sub }}>Last updated 2 min ago</span>
              <button style={{ ...iconBtn, borderRadius:"50%", width:28, height:28 }}>
                <RefreshCw size={13} color={C.sub}/>
              </button>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display:"flex", gap:10, padding:"10px 12px", flexShrink:0 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ ...card, flex:1, padding:14, minWidth:0 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${k.color}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <k.Icon size={14} color={k.color}/>
              </div>
              <div style={{ fontSize:11, color:C.sub, marginTop:6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{k.label}</div>
              <div style={{ fontSize:22, fontWeight:700, color:C.white, lineHeight:1.2 }}>{k.value}</div>
              <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.green, marginTop:3 }}>
                <ArrowUp size={10}/>{k.change}
              </div>
            </div>
          ))}
        </div>

        {/* Three-column content */}
        <div style={{ flex:1, display:"flex", gap:10, padding:"0 12px", overflow:"hidden", minHeight:0 }}>

          {/* Left: transcript list */}
          <div style={{ ...card, width:270, flexShrink:0, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 10px 6px", flexShrink:0 }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Transcripts</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"5px 8px" }}>
                <Search size={13} color={C.sub}/>
                <input placeholder="Search…" style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:12, color:C.white }} />
                <Filter size={12} color={C.sub} style={{ cursor:"pointer" }}/>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {CALLS.map(c => (
                <div key={c.id} onClick={() => setSelId(c.id)}
                  style={{
                    display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
                    borderBottom:`1px solid ${C.border3}`,
                    borderLeft: c.id===selId ? `3px solid ${C.accent}` : "3px solid transparent",
                    background: c.id===selId ? C.elevated : "transparent",
                    cursor:"pointer",
                    transition:"background .15s",
                  }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{c.initials}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:C.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.phone}</div>
                    <div style={{ fontSize:11, color:C.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.setter} · {c.dt}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.sub }}><Clock size={10}/>{c.dur}</div>
                    <div style={{ width:26, height:26, borderRadius:"50%", border:`1px solid ${C.border5}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <Play size={10} color={C.sub}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"8px", textAlign:"center", flexShrink:0, borderTop:`1px solid ${C.border3}` }}>
              <a href="/transcripts" style={{ fontSize:12, color:C.accent, textDecoration:"none" }}>View all transcripts →</a>
            </div>
          </div>

          {/* Middle: transcript viewer */}
          <div style={{ ...card, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"12px 14px 6px", flexShrink:0 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600 }}>{sel.name}</div>
                <div style={{ fontSize:13, color:C.sub }}>{sel.phone}</div>
              </div>
              <button style={{ ...pill, fontSize:12 }}><Play size={12}/> Play Recording</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px 10px", fontSize:12, color:C.sub, flexShrink:0 }}>
              <span>Setter: {sel.setter}</span><span>|</span>
              <span>{sel.dt}</span><span>|</span>
              <span>Duration: {sel.dur}</span><span>|</span>
              <span style={{ background:C.greenBg, color:C.green, borderRadius:4, padding:"1px 8px", fontSize:11 }}>Booked</span>
            </div>
            {/* Tabs */}
            <div style={{ display:"flex", gap:16, padding:"0 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ background:"none", border:"none", borderBottom:`2px solid ${t===tab ? C.accent:"transparent"}`,
                    padding:"0 0 8px", fontSize:13, color:t===tab ? C.white:C.sub, cursor:"pointer", transition:"color .15s" }}>
                  {t}
                </button>
              ))}
            </div>
            {/* Transcript body */}
            <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:12 }}>
              {TRANSCRIPT.map((l,i) => (
                <div key={i}>
                  <div style={{ fontSize:11, color:C.sub, fontWeight:500, marginBottom:3 }}>{l.speaker} ({l.time})</div>
                  <div style={{ fontSize:13, color:"#e2e8f0", lineHeight:1.6 }}>{l.text}</div>
                </div>
              ))}
            </div>
            {/* AI Summary strip */}
            <div style={{ flexShrink:0, borderTop:`1px solid ${C.border}`, padding:12, background:"rgba(13,15,26,0.5)" }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.sub, letterSpacing:".08em", textTransform:"uppercase", marginBottom:8 }}>AI Summary</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { Icon:Frown,      color:C.orange, label:"Pain Point",    text:"Wants more time with family. FIFO lifestyle is taking a toll." },
                  { Icon:Star,       color:C.yellow, label:"Buying Intent", text:"High — Interested in challenge and next steps." },
                  { Icon:X,          color:C.red,    label:"Objection",     text:"Worried about finding enough time while working FIFO." },
                  { Icon:ArrowRight, color:C.green,  label:"Next Step",     text:"Book strategy call. Send FIFO trader testimonial." },
                ].map(item => (
                  <div key={item.label} style={{ display:"flex", gap:8, background:C.elevated, borderRadius:8, padding:10 }}>
                    <item.Icon size={14} color={item.color} style={{ flexShrink:0, marginTop:2 }}/>
                    <div>
                      <div style={{ fontSize:11, fontWeight:500, marginBottom:2 }}>{item.label}</div>
                      <div style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ width:290, flexShrink:0, display:"flex", flexDirection:"column", gap:10, overflowY:"auto" }}>
            {/* Best times */}
            <div style={{ ...card, padding:14, flexShrink:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600 }}>
                  Best Times to Call <Info size={13} color={C.sub}/>
                </div>
                <button style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.sub, background:"none", border:"none", cursor:"pointer" }}>
                  By Hour <ChevronDown size={11}/>
                </button>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr>
                    {["Time","Con.","Conv.","Book","Show","Close"].map(h => (
                      <th key={h} style={{ color:C.muted, fontWeight:400, textAlign: h==="Time"?"left":"right", paddingBottom:6 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BEST_TIMES.map(r => (
                    <tr key={r.time} style={{ borderTop:`1px solid ${C.border3}` }}>
                      <td style={{ color:C.white, padding:"4px 0", whiteSpace:"nowrap" }}>{r.time}</td>
                      {[r.connect,r.conv,r.booking,r.show,r.close].map((v,i) => (
                        <td key={i} style={{ textAlign:"right", padding:"4px 0" }}>
                          <span style={r.hi ? { background:C.greenBg, color:C.green, borderRadius:3, padding:"1px 4px" } : { color:C.sub }}>
                            {v}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI score */}
            <div style={{ ...card, padding:14 }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>AI Call Analysis Summary</div>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                {/* SVG ring */}
                <div style={{ position:"relative", width:80, height:80, flexShrink:0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={R} fill="none" stroke={C.elevated} strokeWidth="8"/>
                    <circle cx="40" cy="40" r={R} fill="none" stroke={C.green} strokeWidth="8"
                      strokeDasharray={circ} strokeDashoffset={offset}
                      strokeLinecap="round" transform="rotate(-90 40 40)"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>82</span>
                    <span style={{ fontSize:10, color:C.sub }}>/100</span>
                  </div>
                </div>
                {/* Breakdown */}
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                  {SCORES.map(s => (
                    <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ width:7, height:7, borderRadius:"50%", background:s.color, display:"inline-block" }}/>
                        <span style={{ color:C.sub }}>{s.label}</span>
                      </div>
                      <span style={{ color:C.white }}>{s.score}/20</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={{ marginTop:12, width:"100%", background:"none", border:`1px solid ${C.border4}`, borderRadius:8, padding:"7px", fontSize:12, color:C.sub, cursor:"pointer" }}>
                View Full Analysis →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom table */}
        <div style={{ ...card, margin:"0 12px 12px", flexShrink:0, maxHeight:220, overflowY:"auto", borderRadius:10 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead style={{ position:"sticky", top:0, background:C.card, zIndex:1 }}>
              <tr>
                {["Lead Name","Setter","Date / Time","Duration","Outcome","AI Score","Key Topics","Actions"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:C.muted, fontWeight:500, textTransform:"uppercase", letterSpacing:".06em", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(row => {
                const op = outcomePill(row.outcome);
                const ss = scoreStyle(row.score);
                return (
                  <tr key={row.name} style={{ borderBottom:`1px solid ${C.border3}` }}>
                    <td style={{ padding:"8px 12px", color:C.white, whiteSpace:"nowrap" }}>{row.name}</td>
                    <td style={{ padding:"8px 12px", color:C.sub }}>{row.setter}</td>
                    <td style={{ padding:"8px 12px", color:C.sub, whiteSpace:"nowrap" }}>{row.dt}</td>
                    <td style={{ padding:"8px 12px", color:C.sub }}>{row.dur}</td>
                    <td style={{ padding:"8px 12px" }}>
                      <span style={{ background:op.bg, color:op.color, borderRadius:5, padding:"2px 8px", fontSize:11 }}>{row.outcome}</span>
                    </td>
                    <td style={{ padding:"8px 12px" }}>
                      <span style={{ ...ss, borderRadius:4, padding:"2px 7px", fontWeight:600 }}>{row.score ?? "N/A"}</span>
                    </td>
                    <td style={{ padding:"8px 12px", color:C.sub, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.topics}</td>
                    <td style={{ padding:"8px 12px" }}>
                      <div style={{ display:"flex", gap:4 }}>
                        <button style={iconBtn}><PlayCircle size={12} color={C.sub}/></button>
                        <button style={iconBtn}><FileText size={12} color={C.sub}/></button>
                        <button style={iconBtn}><Info size={12} color={C.sub}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
