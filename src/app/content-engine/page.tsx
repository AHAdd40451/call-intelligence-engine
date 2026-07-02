"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sparkles, Film, Mail, Mic, Monitor, HelpCircle, Copy, ChevronRight, RefreshCw, Tag } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",blueBg:"rgba(59,130,246,0.12)",
  red:"#ef4444",yellow:"#f59e0b",purple:"#8b5cf6",orange:"#f97316",cyan:"#06b6d4",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };

type ContentType = "all"|"reel"|"email"|"podcast"|"webinar"|"faq"|"copy";

interface ContentItem {
  id:string; type:Exclude<ContentType,"all">; title:string; body:string; tags:string[]; calls:number; status:"new"|"used";
}

const CONTENT: ContentItem[] = [
  { id:"1",type:"reel",    title:"The biggest mistake FIFO workers make trying to build a second income",body:"Use this insight from 142 calls with FIFO workers who all said the same thing: they waited too long. Open with that exact pain point.",tags:["FIFO","Second income","Time freedom"],calls:142,status:"new" },
  { id:"2",type:"email",   title:"Subject: You said you don't have enough time — here's proof you do",body:"47% of prospects raised time as their #1 objection. Open with this subject line targeting that exact resistance. Highest open-rate opportunity.",tags:["Time objection","Objection handling"],calls:89,status:"new" },
  { id:"3",type:"podcast", title:"Why FIFO workers are the perfect candidate for trading",body:"Episode concept based on 287 calls with FIFO workers. Cover: schedule flexibility, income motivation, discipline from rosters.",tags:["FIFO","Trading","Lifestyle"],calls:287,status:"new" },
  { id:"4",type:"reel",    title:"'I was scared it was a scam' — and then I made my first $2,400",body:"67 prospects mentioned scam concerns. This exact objection reframe performed best in calls where booking happened after the fear was addressed.",tags:["Scam concerns","Trust","Social proof"],calls:67,status:"new" },
  { id:"5",type:"email",   title:"Subject: My partner thinks this is too risky — read this first",body:"143 calls included a partner objection. This email is for the prospect to share with their partner. Address: risk, time commitment, real returns.",tags:["Partner objection","Risk"],calls:143,status:"new" },
  { id:"6",type:"webinar", title:"Add a slide: 'How much time does trading actually take?' — 63% asked this",body:"63% of all prospects asked about time commitment. Your webinar should address this in the first 15 minutes with a specific 'day in the life' slide.",tags:["Time","Webinar improvement","FAQ"],calls:396,status:"used" },
  { id:"7",type:"faq",     title:"FAQ: How much money do I need to start trading?",body:"Answer: You can start with as little as $500–$2,000 for practice trading. We recommend having $5,000–$10,000 for live trading after completing our program.",tags:["Money","Getting started"],calls:121,status:"new" },
  { id:"8",type:"copy",    title:"Landing page headline: 'Trade from Your Hotel Room — Even on a 3-Week Swing'",body:"Direct quote inspired by 12 separate call conversations. Resonates deeply with FIFO audience. Test as primary headline on landing page and ads.",tags:["FIFO","Copy","Headline"],calls:78,status:"new" },
  { id:"9",type:"podcast", title:"Episode: What most beginners get wrong about trading risk",body:"Based on 98 calls where fear was the primary objection. Cover: position sizing, stop losses, emotional control. Real beginner misconceptions from actual prospects.",tags:["Risk","Beginners","Fear"],calls:98,status:"new" },
  { id:"10",type:"reel",   title:"I don't want to miss my kids growing up — sound familiar?",body:"154 prospects mentioned wanting more family time. Open with this raw, emotional angle. No sell needed in first 15 seconds — just the truth they already feel.",tags:["Family","Emotional","FIFO"],calls:154,status:"new" },
  { id:"11",type:"copy",   title:"Ad copy: 'Sick of living paycheck to paycheck? You're not alone.'",body:"Exact phrase used by 76 prospects. 'Living paycheck to paycheck' triggers immediate recognition. Use in Facebook/Instagram ad opener.",tags:["Copy","Ads","Pain point"],calls:76,status:"new" },
  { id:"12",type:"faq",    title:"FAQ: How long until I become profitable?",body:"Answer: Most students see their first profitable trade within 4–8 weeks of the program. Consistent profitability typically develops over 3–6 months of disciplined practice.",tags:["Timeline","Expectations"],calls:98,status:"new" },
];

const TYPE_CONFIG: Record<Exclude<ContentType,"all">,{label:string;Icon:React.ComponentType<{size?:number;color?:string}>;color:string;bg:string}> = {
  reel:    {label:"Instagram Reel",Icon:Film,     color:"#ec4899",bg:"rgba(236,72,153,0.12)"},
  email:   {label:"Email Idea",    Icon:Mail,     color:C.blue,   bg:C.blueBg              },
  podcast: {label:"Podcast Topic", Icon:Mic,      color:C.purple, bg:"rgba(139,92,246,0.12)"},
  webinar: {label:"Webinar Tip",   Icon:Monitor,  color:C.orange, bg:"rgba(249,115,22,0.12)"},
  faq:     {label:"FAQ",           Icon:HelpCircle,color:C.green, bg:C.greenBg             },
  copy:    {label:"Marketing Copy",Icon:Copy,     color:C.cyan,   bg:"rgba(6,182,212,0.12)" },
};

const FILTERS: {id:ContentType;label:string}[] = [
  {id:"all",label:"All"},
  {id:"reel",label:"Reels"},
  {id:"email",label:"Emails"},
  {id:"podcast",label:"Podcasts"},
  {id:"webinar",label:"Webinar"},
  {id:"faq",label:"FAQs"},
  {id:"copy",label:"Ad Copy"},
];

export default function ContentEnginePage() {
  const [filter, setFilter] = useState<ContentType>("all");
  const visible = filter==="all" ? CONTENT : CONTENT.filter(c=>c.type===filter);

  return (
    <DashboardLayout title="AI Content Engine" subtitle="Content ideas generated automatically from real customer conversations">
      {/* Stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Ideas Generated",val:"12",color:C.accent},
          {label:"Based On",val:"1,248 calls",color:C.white},
          {label:"Reels",val:CONTENT.filter(c=>c.type==="reel").length.toString(),color:"#ec4899"},
          {label:"Emails",val:CONTENT.filter(c=>c.type==="email").length.toString(),color:C.blue},
          {label:"Podcasts",val:CONTENT.filter(c=>c.type==="podcast").length.toString(),color:C.purple},
        ].map(k=>(
          <div key={k.label} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:10,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:20,fontWeight:700,color:k.color }}>{k.val}</div>
          </div>
        ))}
        <button style={{ background:C.accentBg,border:`1px solid rgba(99,102,241,0.30)`,borderRadius:10,padding:"0 20px",display:"flex",alignItems:"center",gap:8,color:C.accent,fontWeight:600,fontSize:13,cursor:"pointer",flexShrink:0 }}>
          <Sparkles size={15}/> Generate More
        </button>
      </div>

      {/* Type filters */}
      <div style={{ display:"flex",gap:6,marginBottom:16,flexWrap:"wrap" }}>
        {FILTERS.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            style={{ padding:"5px 14px",borderRadius:20,fontSize:12,cursor:"pointer",border:"none",transition:"background .15s",
              background:filter===f.id?C.accent:"rgba(255,255,255,0.06)",
              color:filter===f.id?C.white:C.sub,fontWeight:filter===f.id?600:400 }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12 }}>
        {visible.map(item=>{
          const cfg = TYPE_CONFIG[item.type];
          const Icon = cfg.Icon;
          return (
            <div key={item.id} style={{ ...card,padding:16,display:"flex",flexDirection:"column",gap:10 }}>
              {/* Type badge + status */}
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,background:cfg.bg,borderRadius:20,padding:"3px 10px" }}>
                  <Icon size={12} color={cfg.color}/>
                  <span style={{ fontSize:11,color:cfg.color,fontWeight:500 }}>{cfg.label}</span>
                </div>
                {item.status==="used" && (
                  <span style={{ fontSize:10,background:"rgba(255,255,255,0.06)",color:C.sub,borderRadius:10,padding:"2px 8px" }}>Used</span>
                )}
              </div>
              {/* Title */}
              <div style={{ fontSize:13,fontWeight:600,color:C.white,lineHeight:1.4 }}>{item.title}</div>
              {/* Body */}
              <div style={{ fontSize:12,color:C.sub,lineHeight:1.6 }}>{item.body}</div>
              {/* Tags */}
              <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                {item.tags.map(t=>(
                  <span key={t} style={{ background:C.elevated,border:`1px solid ${C.border}`,borderRadius:10,padding:"2px 8px",fontSize:10,color:C.muted }}>
                    {t}
                  </span>
                ))}
              </div>
              {/* Footer */}
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4,paddingTop:10,borderTop:`1px solid ${C.border3}` }}>
                <span style={{ fontSize:11,color:C.muted }}>Based on {item.calls} calls</span>
                <button style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.accent,background:"none",border:"none",cursor:"pointer",fontWeight:500 }}>
                  Use this <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
