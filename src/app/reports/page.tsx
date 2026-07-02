"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Download, TrendingUp, TrendingDown, BarChart2, Calendar } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",blue:"#3b82f6",blueBg:"rgba(59,130,246,0.12)",
  red:"#ef4444",redBg:"rgba(239,68,68,0.12)",yellow:"#f59e0b",orange:"#f97316",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10 };

const WEEKLY = [
  { week:"Week 1 (5–11 May)",  calls:287, booked:72, rate:"25.1%", score:79, revenue:"$36,000", trend:"—"     },
  { week:"Week 2 (12–18 May)", calls:312, booked:87, rate:"27.9%", score:82, revenue:"$42,600", trend:"+18.3%" },
  { week:"Week 3 (19–25 May)", calls:298, booked:81, rate:"27.2%", score:83, revenue:"$39,800", trend:"-6.6%"  },
  { week:"Week 4 (26 May–1 Jun)",calls:351,booked:98,rate:"27.9%", score:85, revenue:"$48,200", trend:"+21.1%" },
];

const BAR_DATA = [
  {label:"Mon",calls:48,booked:13},
  {label:"Tue",calls:62,booked:18},
  {label:"Wed",calls:58,booked:17},
  {label:"Thu",calls:55,booked:16},
  {label:"Fri",calls:42,booked:10},
  {label:"Sat",calls:18,booked:3},
  {label:"Sun",calls:9, booked:1},
];
const maxCalls = Math.max(...BAR_DATA.map(d=>d.calls));

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports" subtitle="Weekly performance summaries, trend analysis and exportable data">
      {/* Stats */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          {label:"Calls This Month",val:"1,248",trend:"+18%",color:C.blue},
          {label:"Bookings",        val:"338",  trend:"+22%",color:C.green},
          {label:"Book Rate",       val:"27.1%",trend:"+4%", color:C.green},
          {label:"Avg AI Score",    val:"82",   trend:"+5%", color:C.accent},
          {label:"Revenue",         val:"$166,600",trend:"+31%",color:C.yellow},
        ].map(k=>(
          <div key={k.label} style={{ ...card,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:20,fontWeight:700,color:k.color }}>{k.val}</div>
            <div style={{ fontSize:11,color:C.green,marginTop:3 }}>{k.trend} vs last month</div>
          </div>
        ))}
        <button style={{ background:C.accentBg,border:`1px solid rgba(99,102,241,0.30)`,borderRadius:10,padding:"0 18px",display:"flex",alignItems:"center",gap:8,color:C.accent,fontWeight:600,fontSize:13,cursor:"pointer",flexShrink:0 }}>
          <Download size={14}/> Export CSV
        </button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:12,marginBottom:12 }}>
        {/* Bar chart */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
            <BarChart2 size={15} color={C.accent}/>
            <span style={{ fontSize:13,fontWeight:600 }}>Calls by Day of Week (this week)</span>
          </div>
          <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:180 }}>
            {BAR_DATA.map(d=>(
              <div key={d.label} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%" }}>
                <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",width:"100%",gap:2 }}>
                  <div style={{ width:"100%",height:`${(d.calls/maxCalls)*100}%`,background:`${C.blue}30`,borderRadius:"4px 4px 0 0",position:"relative",minHeight:4 }}>
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:`${(d.booked/d.calls)*100}%`,background:C.green,borderRadius:"4px 4px 0 0",minHeight:2 }}/>
                  </div>
                </div>
                <div style={{ fontSize:10,color:C.muted }}>{d.label}</div>
                <div style={{ fontSize:10,color:C.blue,fontWeight:600 }}>{d.calls}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:16,marginTop:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.sub }}><div style={{ width:12,height:12,borderRadius:2,background:`${C.blue}30` }}/>Total Calls</div>
            <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.sub }}><div style={{ width:12,height:12,borderRadius:2,background:C.green }}/>Booked</div>
          </div>
        </div>

        {/* AI Briefing */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <Calendar size={15} color={C.accent}/><span style={{ fontSize:13,fontWeight:600 }}>Today's AI Briefing</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {[
              {icon:TrendingUp,  color:C.red,   text:"Partner objections up 18% this week — create a partner-focused FAQ page."},
              {icon:TrendingUp,  color:C.orange, text:"FIFO workers mentioned 'family time' 42 times this week."},
              {icon:TrendingUp,  color:C.green,  text:"10AM–12PM produced 70% show rate — schedule more calls here."},
              {icon:TrendingUp,  color:C.green,  text:"Setters asking open questions booked 27% more."},
              {icon:TrendingDown,color:C.yellow,  text:"'Second income' topic: 146 mentions. Recommend 3 videos on this topic."},
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex",gap:10,padding:"8px 0",borderBottom:i<4?`1px solid ${C.border3}`:"none" }}>
                <item.icon size={14} color={item.color} style={{ flexShrink:0,marginTop:2 }}/>
                <span style={{ fontSize:12,color:C.sub,lineHeight:1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6 }}>
          <BarChart2 size={14} color={C.accent}/><span style={{ fontSize:13,fontWeight:600 }}>Weekly Performance History</span>
        </div>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Week","Calls","Booked","Book Rate","Avg AI Score","Revenue","vs Prior Week"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:i===0?"left":"center",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKLY.map((row,i)=>(
              <tr key={row.week} style={{ borderBottom:`1px solid ${C.border3}`,background:i===WEEKLY.length-1?C.elevated:"transparent" }}>
                <td style={{ padding:"10px 14px",color:C.white,fontWeight:i===WEEKLY.length-1?600:400 }}>{row.week}{i===WEEKLY.length-1&&<span style={{ marginLeft:8,fontSize:10,background:C.accentBg,color:C.accent,borderRadius:4,padding:"1px 6px" }}>Latest</span>}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{row.calls}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.sub }}>{row.booked}</td>
                <td style={{ padding:"10px 14px",textAlign:"center" }}>
                  <span style={{ background:C.greenBg,color:C.green,borderRadius:4,padding:"2px 8px",fontSize:12,fontWeight:600 }}>{row.rate}</span>
                </td>
                <td style={{ padding:"10px 14px",textAlign:"center",fontWeight:600,color:row.score>=80?C.green:C.yellow }}>{row.score}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:C.white,fontWeight:500 }}>{row.revenue}</td>
                <td style={{ padding:"10px 14px",textAlign:"center",color:row.trend.startsWith("+")?C.green:row.trend==="-6.6%"?C.red:C.sub,fontWeight:500 }}>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
