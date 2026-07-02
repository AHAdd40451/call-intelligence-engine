"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Key, RefreshCw, Save, CheckCircle, AlertCircle, Bell, Database } from "lucide-react";

const C = {
  card:"#151929",elevated:"#1a1f35",border:"rgba(255,255,255,0.06)",border2:"rgba(255,255,255,0.08)",
  white:"#f1f5f9",sub:"#94a3b8",muted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",red:"#ef4444",redBg:"rgba(239,68,68,0.12)",
};
const card: React.CSSProperties = { background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:12 };
const label: React.CSSProperties = { fontSize:12,color:C.sub,marginBottom:6,display:"block" };
const input: React.CSSProperties = {
  width:"100%",background:C.elevated,border:`1px solid ${C.border2}`,borderRadius:8,
  padding:"8px 12px",fontSize:13,color:C.white,outline:"none",boxSizing:"border-box",
  fontFamily:"monospace",
};
const btn = (primary=false): React.CSSProperties => ({
  display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,fontSize:13,cursor:"pointer",
  background:primary?C.accent:C.elevated,color:C.white,border:`1px solid ${primary?"transparent":C.border}`,
  fontWeight:primary?600:400,
});

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
  const handleSync = () => { setSyncing(true); setTimeout(()=>setSyncing(false),2500); };

  return (
    <DashboardLayout title="Settings" subtitle="Configure API connections, sync schedules and notification preferences">

      {/* API Keys */}
      <div style={card}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
          <Key size={15} color={C.accent}/><span style={{ fontSize:14,fontWeight:600 }}>API Keys</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {[
            {label:"Trellus API Key",val:"3b57fdd713b5a3cd00c97c8556e8f8289347ce52",status:"connected"},
            {label:"GoHighLevel API Key",val:"",placeholder:"ghl_xxxxxxxxxxxxxxxxxxxx",status:"missing"},
            {label:"Anthropic API Key (Claude AI)",val:"",placeholder:"sk-ant-xxxxxxxxxxxxxxxx",status:"missing"},
            {label:"Cron Secret",val:"auto-generated",status:"connected"},
          ].map(f=>(
            <div key={f.label}>
              <label style={label}>{f.label}</label>
              <div style={{ position:"relative" }}>
                <input type="password" defaultValue={f.val} placeholder={f.placeholder}
                  style={{ ...input,paddingRight:110 }}/>
                <div style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",display:"flex",alignItems:"center",gap:4 }}>
                  {f.status==="connected"
                    ? <><CheckCircle size={12} color={C.green}/><span style={{ fontSize:11,color:C.green }}>Connected</span></>
                    : <><AlertCircle size={12} color={C.red}/><span style={{ fontSize:11,color:C.red }}>Missing</span></>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16,display:"flex",gap:8 }}>
          <button style={btn(true)} onClick={handleSave}>
            <Save size={13}/>{saved?"Saved!":"Save Keys"}
          </button>
        </div>
      </div>

      {/* Sync Settings */}
      <div style={card}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
          <Database size={15} color={C.accent}/><span style={{ fontSize:14,fontWeight:600 }}>Data Sync</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
          {[
            {label:"Trellus Sync Frequency",val:"Every 30 minutes"},
            {label:"GHL Sync Frequency",val:"Every 60 minutes"},
            {label:"AI Analysis",val:"Auto-analyse new calls"},
            {label:"Last Synced",val:"2 min ago"},
          ].map(f=>(
            <div key={f.label}>
              <label style={label}>{f.label}</label>
              <div style={{ ...input,padding:"8px 12px",fontFamily:"inherit",color:C.white,borderRadius:8 }}>{f.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button style={btn(true)} onClick={handleSync}>
            <RefreshCw size={13} style={{ animation:syncing?"spin 1s linear infinite":"none" }}/>
            {syncing?"Syncing…":"Sync Now"}
          </button>
          <button style={btn()}>View Sync Log</button>
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
          <Bell size={15} color={C.accent}/><span style={{ fontSize:14,fontWeight:600 }}>Notifications</span>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {[
            {label:"Morning executive briefing",desc:"Delivered daily at 7:00 AM",on:true},
            {label:"New booked call alert",desc:"Notify when AI detects a booking",on:true},
            {label:"Setter performance alerts",desc:"Weekly coaching summary",on:false},
            {label:"Objection spike alerts",desc:"Alert when an objection rises >20%",on:true},
            {label:"Content engine suggestions",desc:"New content ideas available",on:false},
          ].map(n=>(
            <div key={n.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
              <div>
                <div style={{ fontSize:13,color:C.white,fontWeight:500 }}>{n.label}</div>
                <div style={{ fontSize:11,color:C.sub }}>{n.desc}</div>
              </div>
              <div style={{ width:38,height:22,borderRadius:11,background:n.on?C.accent:"rgba(255,255,255,0.10)",position:"relative",cursor:"pointer",flexShrink:0 }}>
                <div style={{ width:16,height:16,borderRadius:"50%",background:C.white,position:"absolute",top:3,left:n.on?19:3,transition:"left .2s" }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16 }}>
          <button style={btn(true)} onClick={handleSave}><Save size={13}/>{saved?"Saved!":"Save Preferences"}</button>
        </div>
      </div>

      {/* Supabase */}
      <div style={card}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <Database size={15} color={C.green}/><span style={{ fontSize:14,fontWeight:600 }}>Database</span>
          <span style={{ fontSize:11,background:C.greenBg,color:C.green,borderRadius:10,padding:"2px 8px",marginLeft:"auto" }}>Connected</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            {label:"Supabase Project",val:"call-intelligence-engine"},
            {label:"Region",val:"US East (Virginia)"},
            {label:"Tables",val:"13 tables active"},
            {label:"Storage",val:"142 MB used"},
          ].map(f=>(
            <div key={f.label}>
              <label style={label}>{f.label}</label>
              <div style={{ fontSize:13,color:C.white,padding:"6px 0" }}>{f.val}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
