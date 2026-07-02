"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChevronDown, TrendingUp, TrendingDown, Clock } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border3:"rgba(255,255,255,0.04)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",
  red:"#ef4444",redBg:"rgba(239,68,68,0.12)",
  blue:"#3b82f6",yellow:"#f59e0b",
};
const card: React.CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:10 };

const HOURS = ["6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM"];
const DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// Booking rate grid (0–10 scale for colour intensity)
const GRID: number[][] = [
  [1,1,2,2,3,2,1],
  [1,2,3,4,4,2,1],
  [2,4,7,8,6,3,1],
  [3,6,9,9,8,4,2],
  [4,8,10,9,7,3,1],
  [4,7,9,8,7,3,1],
  [3,5,7,7,5,2,1],
  [2,4,6,5,4,2,1],
  [2,4,6,6,5,2,1],
  [2,3,5,5,4,2,1],
  [1,3,4,4,3,2,1],
  [1,2,3,3,2,1,0],
  [1,1,2,2,1,1,0],
  [0,1,1,1,1,0,0],
  [0,0,1,1,0,0,0],
];

function heatColor(v: number) {
  if (v===0) return "rgba(255,255,255,0.03)";
  const stops = ["#1a2535","#1e3a4a","#1a4a3a","#1e5c2e","#22c55e"];
  const i = Math.min(Math.floor(v/10*5),4);
  return stops[i];
}

const TABLE = [
  { time:"6AM – 8AM",   connect:"12%",conv:"6%", book:"2%", show:"40%",close:"10%",hi:false },
  { time:"8AM – 10AM",  connect:"28%",conv:"14%",book:"3%", show:"52%",close:"14%",hi:false },
  { time:"10AM – 12PM", connect:"42%",conv:"22%",book:"6%", show:"70%",close:"28%",hi:true  },
  { time:"12PM – 2PM",  connect:"32%",conv:"18%",book:"5%", show:"66%",close:"25%",hi:false },
  { time:"2PM – 4PM",   connect:"34%",conv:"20%",book:"5%", show:"65%",close:"23%",hi:false },
  { time:"4PM – 6PM",   connect:"22%",conv:"12%",book:"3%", show:"50%",close:"12%",hi:false },
  { time:"6PM – 8PM",   connect:"8%", conv:"4%", book:"1%", show:"30%",close:"5%", hi:false },
];

const INSIGHTS = [
  { icon:TrendingUp, color:C.green, title:"Best Window", desc:"10AM – 12PM delivers the highest booking rate at 6% and show rate of 70% across all days." },
  { icon:TrendingUp, color:C.blue,  title:"Best Days",   desc:"Tuesday and Wednesday outperform by 23% on average. Thursday close rate is highest at 28%." },
  { icon:TrendingDown,color:C.red,  title:"Avoid",       desc:"Saturdays and Sundays perform 60% below weekday average. 7PM+ sees near-zero conversions." },
];

export default function BestTimesPage() {
  return (
    <DashboardLayout title="Best Times to Call" subtitle="Identify peak calling windows based on connect, conversion, booking, show and close rates">

      {/* Summary KPI cards */}
      <div style={{ display:"flex",gap:10,marginBottom:16 }}>
        {[
          { label:"Best Hour",    val:"10AM–12PM", sub:"Highest booking rate",     color:C.green  },
          { label:"Best Day",     val:"Tuesday",   sub:"Most bookings this week",  color:C.blue   },
          { label:"Peak Close %", val:"28%",       sub:"Thu 10AM–12PM slot",       color:C.green  },
          { label:"Worst Window", val:"Sat 6PM+",  sub:"0% booking rate",          color:C.red    },
        ].map(k=>(
          <div key={k.label} style={{ ...card,flex:1,padding:14 }}>
            <div style={{ fontSize:11,color:C.sub,marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:20,fontWeight:700,color:k.color }}>{k.val}</div>
            <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:12,marginBottom:12 }}>
        {/* Heatmap */}
        <div style={{ ...card,padding:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <div>
              <div style={{ fontSize:14,fontWeight:600 }}>Booking Rate Heatmap</div>
              <div style={{ fontSize:12,color:C.sub,marginTop:2 }}>Darker = higher booking rate</div>
            </div>
            <button style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.sub,background:C.elevated,border:`1px solid rgba(255,255,255,0.10)`,borderRadius:6,padding:"4px 10px",cursor:"pointer" }}>
              Booking Rate <ChevronDown size={12}/>
            </button>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ borderCollapse:"separate",borderSpacing:3,fontSize:11 }}>
              <thead>
                <tr>
                  <th style={{ color:C.muted,fontWeight:400,padding:"0 6px 6px 0",width:52,textAlign:"left" }}>Hour</th>
                  {DAYS.map(d=>(
                    <th key={d} style={{ color:C.muted,fontWeight:400,padding:"0 0 6px",width:52,textAlign:"center" }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hr,ri)=>(
                  <tr key={hr}>
                    <td style={{ color:C.sub,padding:"0 8px 0 0",whiteSpace:"nowrap" }}>{hr}</td>
                    {DAYS.map((_,ci)=>(
                      <td key={ci}>
                        <div style={{
                          width:48,height:28,borderRadius:4,
                          background:heatColor(GRID[ri][ci]),
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:10,color:GRID[ri][ci]>=6?C.white:C.muted,
                        }}>
                          {GRID[ri][ci]>0 ? `${GRID[ri][ci]*10}%`:""}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {INSIGHTS.map(ins=>(
            <div key={ins.title} style={{ ...card,padding:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <div style={{ width:30,height:30,borderRadius:8,background:`${ins.color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <ins.icon size={15} color={ins.color}/>
                </div>
                <span style={{ fontSize:13,fontWeight:600,color:C.white }}>{ins.title}</span>
              </div>
              <p style={{ fontSize:12,color:C.sub,lineHeight:1.6,margin:0 }}>{ins.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed table */}
      <div style={{ ...card,overflow:"hidden" }}>
        <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6 }}>
          <Clock size={14} color={C.accent}/>
          <span style={{ fontSize:13,fontWeight:600 }}>Hourly Performance Breakdown</span>
        </div>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Time Slot","Connect Rate","Conv. (60s+)","Booking Rate","Show Rate","Close Rate"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 16px",textAlign:i===0?"left":"center",fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE.map(row=>(
              <tr key={row.time} style={{ borderBottom:`1px solid ${C.border3}`,background:row.hi?C.elevated:"transparent" }}>
                <td style={{ padding:"10px 16px",color:row.hi?C.white:C.sub,fontWeight:row.hi?600:400 }}>
                  {row.time}{row.hi&&<span style={{ marginLeft:8,fontSize:10,background:C.greenBg,color:C.green,borderRadius:4,padding:"1px 6px" }}>Best</span>}
                </td>
                {[row.connect,row.conv,row.book,row.show,row.close].map((v,i)=>(
                  <td key={i} style={{ padding:"10px 16px",textAlign:"center" }}>
                    <span style={row.hi?{color:C.green,fontWeight:600}:{color:C.sub}}>{v}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
