"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Clock, Brain,
  Users, UserCheck, BarChart2, Settings,
  BarChart3, ChevronUp,
} from "lucide-react";

const NAV = [
  { label:"Overview",           href:"/dashboard",  Icon:LayoutDashboard },
  { label:"Transcripts",        href:"/transcripts",Icon:FileText         },
  { label:"Best Times to Call", href:"/best-times", Icon:Clock            },
  { label:"AI Call Analysis",   href:"/coaching",   Icon:Brain            },
  { label:"Leads",              href:"/leads",      Icon:Users            },
  { label:"Setters",            href:"/setters",    Icon:UserCheck        },
  { label:"Reports",            href:"/reports",    Icon:BarChart2        },
  { label:"Settings",           href:"/settings",   Icon:Settings         },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      background: "#0f1120",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding:"16px 16px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"rgba(59,130,246,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <BarChart3 size={16} color="#3b82f6"/>
          </div>
          <span style={{ fontSize:15, fontWeight:700, color:"#f1f5f9" }}>CGT</span>
        </div>
        <div style={{ fontSize:10, color:"#94a3b8", marginTop:4, letterSpacing:".08em" }}>CAPITAL GROWTH TRADERS</div>
      </div>

      <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 16px" }}/>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
        {NAV.map(({ label, href, Icon }) => {
          const active = path === href || path?.startsWith(href + "/");
          return (
            <Link key={href} href={href} style={{ textDecoration:"none" }}>
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"7px 10px",
                marginBottom:2,
                borderRadius:8,
                borderLeft: `3px solid ${active ? "#6366f1" : "transparent"}`,
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                color: active ? "#f1f5f9" : "#94a3b8",
                fontSize:13,
                cursor:"pointer",
                transition:"background .15s, color .15s",
              }}>
                <Icon size={15} color={active ? "#6366f1" : "#94a3b8"}/>
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 10px" }}/>

      {/* User */}
      <div style={{ padding:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:8, cursor:"pointer" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#334155", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>NE</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#f1f5f9" }}>Neo</div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>AI Chief of Staff</div>
          </div>
          <ChevronUp size={14} color="#94a3b8"/>
        </div>
      </div>
    </aside>
  );
}
