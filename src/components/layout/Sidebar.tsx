"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Brain,
  Users,
  UserCheck,
  BarChart2,
  Settings,
  BarChart3,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transcripts", href: "/transcripts", icon: FileText },
  { label: "Best Times to Call", href: "/best-times", icon: Clock },
  { label: "AI Call Analysis", href: "/coaching", icon: Brain },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Setters", href: "/setters", icon: UserCheck },
  { label: "Reports", href: "/reports", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] flex-shrink-0 flex-col h-screen bg-[#0f1120] border-r border-[rgba(255,255,255,0.06)]">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/15">
            <BarChart3 className="h-4 w-4 text-[#3b82f6]" />
          </div>
          <span className="text-sm font-bold text-white">CGT</span>
        </div>
        <p className="mt-1 text-[10px] tracking-wide text-[#94a3b8]">
          CAPITAL GROWTH TRADERS
        </p>
      </div>

      <div className="mx-4 border-t border-[rgba(255,255,255,0.06)]" />

      <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors border-l-[3px]",
                isActive
                  ? "border-[#6366f1] bg-[rgba(99,102,241,0.12)] text-white pl-[9px]"
                  : "border-transparent text-[#94a3b8] hover:bg-[#1a1f35] hover:text-white pl-[9px]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#6366f1]" : "text-[#94a3b8]"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[#1a1f35] cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#334155] text-xs font-semibold text-white">
            NE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Neo</p>
            <p className="text-[11px] text-[#94a3b8] truncate">AI Chief of Staff</p>
          </div>
          <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
        </div>
      </div>
    </aside>
  );
}
