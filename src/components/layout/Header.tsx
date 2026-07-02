"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
}

export function Header({
  userName = "Shane",
  userEmail = "shane@capitalgrowthtraders.com",
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#ffffff10] bg-[#0a0a0f]/80 px-4 backdrop-blur-md md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search calls, setters, transcripts…"
          className="pl-9 bg-[#111118]"
        />
      </div>

      <div className="flex flex-1" />

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
      </Button>

      <div className="flex items-center gap-2 pl-2 border-l border-[#ffffff10]">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block leading-tight">
          <p className="text-xs font-medium text-zinc-200">{userName}</p>
          <p className="text-[11px] text-zinc-500">{userEmail}</p>
        </div>
      </div>
    </header>
  );
}
