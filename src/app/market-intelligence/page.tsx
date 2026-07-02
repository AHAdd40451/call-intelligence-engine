"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart2, TrendingUp, MessageCircle, HelpCircle, Tag } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",blueBg:"rgba(59,130,246,0.12)",
  red:"#ef4444",redBg:"rgba(239,68,68,0.12)",yellow:"#f59e0b",purple:"#8b5cf6",orange:"#f97316",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };

const PAIN_POINTS = [
  {label:"Wants more time with family",count:342,pct:54},
  {label:"FIFO / fly-in fly-out lifestyle",count:287,pct:46},
  {label:"Wants a second income",count:261,pct:42},
  {label:"Cost of living pressure",count:198,pct:32},
  {label:"Burnt out in current job",count:176,pct:28},
  {label:"Wants financial freedom",count:154,pct:25},
  {label:"Wants more flexibility",count:132,pct:21},
  {label:"Wants to retire early",count:98,pct:16},
];
const OBJECTIONS = [
  {label:"Not enough time",count:189,color:C.red},
  {label:"Partner not convinced",count:143,color:C.orange},
  {label:"Money concerns",count:121,color:C.yellow},
  {label:"Fear / risk averse",count:98,color:C.purple},
  {label:"Scam concerns",count:67,color:C.blue},
  {label:"Wants more research",count:54,color:C.green},
  {label:"Lack of confidence",count:43,color:"#06b6d4"},
];
const GOALS = [
  {label:"Replace income",count:198},{label:"Learn trading",count:176},
  {label:"Spend time with children",count:154},{label:"Build wealth",count:143},
  {label:"Travel",count:121},{label:"Invest",count:98},
  {label:"Retire early",count:87},{label:"Work from home",count:76},
];
const PHRASES = [
  "I hate working away from my family",
  "I just want more freedom",
  "I'm sick of living paycheck to paycheck",
  "I don't want to miss my kids growing up",
  "I need a second income",
  "I'm scared of getting scammed",
  "I just don't have enough time",
  "My wife / husband isn't sure about it",
  "I've tried things before that didn't work",
  "How long until I make real money?",
];
const QUESTIONS = [
  {q:"How much money do I need to start?",count:143},
  {q:"How much time does it take per day?",count:132},
  {q:"Can complete beginners learn this?",count:121},
  {q:"How risky is trading?",count:109},
  {q:"How long until I become profitable?",count:98},
  {q:"Is this a scam?",count:67},
  {q:"Do I need a lot of money to trade?",count:54},
];

function Bar({pct,color=C.accent}:{pct:number;color?:string}) {
  return (
    <div style={{ height:6,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden",flex:1 }}>
      <div style={{ height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width .4s" }}/>
    </div>
  );
}

export default function MarketIntelligencePage() {
  return (
    <DashboardLayout title="Market Intelligence" subtitle="Live aggregate insights from 1,248 conversations — the real pulse of your market">

      {/* Top stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Calls Analysed",val:"1,248",color:C.white},
          {label:"Unique Pain Points",val:"23",color:C.orange},
          {label:"Objection Types",val:"11",color:C.red},
          {label:"Phrases Captured",val:"487",color:C.accent},
          {label:"FAQs Generated",val:"34",color:C.green},
        ].map(k=>(
          <div key={k.label} style={{ ...card,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:22,fontWeight:700,color:k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        {/* Pain Points */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <BarChart2 size={15} color={C.orange}/><span style={{ fontSize:13,fontWeight:600 }}>Top Pain Points</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {PAIN_POINTS.map(p=>(
              <div key={p.label}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                  <span style={{ fontSize:12,color:C.sub }}>{p.label}</span>
                  <span style={{ fontSize:12,color:C.orange,fontWeight:600 }}>{p.count}</span>
                </div>
                <Bar pct={p.pct} color={C.orange}/>
              </div>
            ))}
          </div>
        </div>

        {/* Objections */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <TrendingUp size={15} color={C.red}/><span style={{ fontSize:13,fontWeight:600 }}>Objection Frequency</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {OBJECTIONS.map(o=>(
              <div key={o.label}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                  <span style={{ fontSize:12,color:C.sub }}>{o.label}</span>
                  <span style={{ fontSize:12,fontWeight:600,color:o.color }}>{o.count}</span>
                </div>
                <Bar pct={Math.round(o.count/189*100)} color={o.color}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
        {/* Goals */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <TrendingUp size={15} color={C.green}/><span style={{ fontSize:13,fontWeight:600 }}>Customer Goals</span>
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {GOALS.map((g,i)=>(
              <span key={g.label} style={{
                background:C.elevated,border:`1px solid ${C.border}`,borderRadius:20,
                padding:"4px 10px",
                fontSize:`${Math.max(11,13-i*0.4)}px`,
                color:i<3?C.green:C.sub,
              }}>
                {g.label} <span style={{ color:C.muted }}>{g.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Customer Phrases */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <MessageCircle size={15} color={C.accent}/><span style={{ fontSize:13,fontWeight:600 }}>Marketing Language Library</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {PHRASES.map(p=>(
              <div key={p} style={{ background:C.elevated,borderRadius:6,padding:"6px 10px",fontSize:11,color:C.sub,fontStyle:"italic",borderLeft:`2px solid ${C.accent}` }}>
                "{p}"
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <HelpCircle size={15} color={C.blue}/><span style={{ fontSize:13,fontWeight:600 }}>Top FAQs</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {QUESTIONS.map((q,i)=>(
              <div key={q.q} style={{ borderBottom:`1px solid ${C.border3}`,paddingBottom:8 }}>
                <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
                  <span style={{ fontSize:12,color:C.sub,lineHeight:1.4,flex:1 }}>Q{i+1}. {q.q}</span>
                  <span style={{ fontSize:11,color:C.blue,fontWeight:600,whiteSpace:"nowrap",flexShrink:0 }}>{q.count}×</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
