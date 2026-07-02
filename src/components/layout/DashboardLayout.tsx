import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div style={{ display:"flex", height:"100dvh", width:"100%", overflow:"hidden", background:"#0d0f1a", color:"#f1f5f9" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {(title || subtitle) && (
          <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
            {title    && <h1 style={{ fontSize:18, fontWeight:600, color:"#f1f5f9", margin:0 }}>{title}</h1>}
            {subtitle && <p  style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
