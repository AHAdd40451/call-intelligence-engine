"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Clock,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Settings,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transcripts", href: "/transcripts", icon: FileText },
  { label: "Best Times", href: "/best-times", icon: Clock },
  { label: "Coaching", href: "/coaching", icon: GraduationCap },
  { label: "Market Intel", href: "/market-intelligence", icon: TrendingUp },
  { label: "Content Engine", href: "/content-engine", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[#ffffff10] bg-[#0a0a0f]">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-[#ffffff10]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/20">
          <Phone className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">
          Call Intelligence
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#6366f1]/10 text-[#a5a6f6] border border-[#6366f1]/20"
                  : "text-zinc-400 hover:bg-[#ffffff08] hover:text-zinc-100 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#ffffff10]">
        <div className="rounded-lg border border-[#ffffff10] bg-[#111118] p-3">
          <p className="text-xs font-medium text-zinc-300">AI Engine</p>
          <p className="mt-1 text-xs text-zinc-500">
            Powered by Claude for call scoring &amp; content generation.
          </p>
        </div>
      </div>
    </aside>
  );
}
