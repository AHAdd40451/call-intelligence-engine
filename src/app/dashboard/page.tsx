"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  ChevronDown,
  Calendar,
  RefreshCw,
  Phone,
  MessageSquare,
  CalendarCheck,
  CheckCircle,
  DollarSign,
  ArrowUp,
  Search,
  Filter,
  Clock,
  Play,
  Info,
  Frown,
  Star,
  X,
  ArrowRight,
  PlayCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Kpi = {
  icon: typeof Phone;
  iconColor: string;
  label: string;
  value: string;
  change: string;
};

const KPIS: Kpi[] = [
  { icon: Phone, iconColor: "#3b82f6", label: "Total Calls", value: "1,248", change: "18% vs last 7 days" },
  { icon: MessageSquare, iconColor: "#22c55e", label: "Conversations (60s+)", value: "642", change: "22% vs last 7 days" },
  { icon: CalendarCheck, iconColor: "#8b5cf6", label: "Calls Booked", value: "87", change: "16% vs last 7 days" },
  { icon: CheckCircle, iconColor: "#3b82f6", label: "Show Rate", value: "68%", change: "7% vs last 7 days" },
  { icon: DollarSign, iconColor: "#22c55e", label: "Close Rate", value: "31%", change: "5% vs last 7 days" },
  { icon: DollarSign, iconColor: "#f59e0b", label: "Revenue (This Week)", value: "$42,600", change: "12% vs last 7 days" },
];

type CallListItem = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  phone: string;
  setter: string;
  datetime: string;
  duration: string;
};

const CALL_LIST: CallListItem[] = [
  { id: "1", name: "John Smith", initials: "JS", avatarColor: "#3b82f6", phone: "0412 345 678", setter: "Ben", datetime: "18 May, 10:23 AM", duration: "08:42" },
  { id: "2", name: "Michael Brown", initials: "MB", avatarColor: "#22c55e", phone: "0413 234 567", setter: "Sarah", datetime: "18 May, 9:47 AM", duration: "06:15" },
  { id: "3", name: "Daniel Williams", initials: "DW", avatarColor: "#f97316", phone: "0411 456 789", setter: "Jake", datetime: "18 May, 9:15 AM", duration: "05:02" },
  { id: "4", name: "Christopher Miller", initials: "CM", avatarColor: "#ef4444", phone: "0400 111 222", setter: "Ben", datetime: "18 May, 8:51 AM", duration: "03:33" },
  { id: "5", name: "Matthew Taylor", initials: "MT", avatarColor: "#8b5cf6", phone: "0416 789 123", setter: "Sarah", datetime: "18 May, 8:21 AM", duration: "04:11" },
];

const TABS = ["Transcript", "AI Summary", "Call Analysis", "Notes"] as const;

const TRANSCRIPT = [
  { speaker: "Ben", time: "00:00", text: "Hey John, it's Ben from Capital Growth Traders. Just calling because you filled out the info on our 3 Day Challenge. Is now a good time to chat?" },
  { speaker: "John", time: "00:07", text: "Yeah mate, this is a good time." },
  { speaker: "Ben", time: "00:09", text: "Perfect. So John, what made you look into trading and our challenge?" },
  { speaker: "John", time: "00:15", text: "Mainly looking for a way to create a second income. I work FIFO and want more time with my family." },
  { speaker: "Ben", time: "00:24", text: "That's awesome John. So FIFO life can be tough. How long have you been looking for something flexible?" },
];

const BEST_TIMES = [
  { time: "6AM - 8AM", connect: "12%", conv: "6%", booking: "2%", show: "40%", close: "10%", highlight: false },
  { time: "8AM - 10AM", connect: "28%", conv: "14%", booking: "3%", show: "52%", close: "14%", highlight: false },
  { time: "10AM - 12PM", connect: "42%", conv: "22%", booking: "6%", show: "70%", close: "28%", highlight: true },
  { time: "12PM - 2PM", connect: "32%", conv: "18%", booking: "5%", show: "66%", close: "25%", highlight: false },
  { time: "2PM - 4PM", connect: "34%", conv: "20%", booking: "5%", show: "65%", close: "23%", highlight: false },
  { time: "4PM - 6PM", connect: "22%", conv: "12%", booking: "3%", show: "50%", close: "12%", highlight: false },
  { time: "6PM - 8PM", connect: "8%", conv: "4%", booking: "1%", show: "30%", close: "5%", highlight: false },
];

const SCORE_BREAKDOWN = [
  { color: "#22c55e", label: "Script Compliance", score: 18 },
  { color: "#3b82f6", label: "Qualification", score: 16 },
  { color: "#f59e0b", label: "Objection Handling", score: 15 },
  { color: "#8b5cf6", label: "Closing & Booking", score: 17 },
  { color: "#06b6d4", label: "Communication", score: 16 },
];

type Outcome = "Booked" | "Follow Up" | "Not Interested" | "No Answer";

type TableRow = {
  name: string;
  setter: string;
  datetime: string;
  duration: string;
  outcome: Outcome;
  score: number | null;
  topics: string;
};

const TABLE_ROWS: TableRow[] = [
  { name: "John Smith", setter: "Ben", datetime: "18 May, 10:23 AM", duration: "08:42", outcome: "Booked", score: 82, topics: "FIFO, Second income, Time freedom" },
  { name: "Michael Brown", setter: "Sarah", datetime: "18 May, 9:47 AM", duration: "06:15", outcome: "Follow Up", score: 75, topics: "Learn trading, No experience, Timed" },
  { name: "Daniel Williams", setter: "Jake", datetime: "18 May, 9:15 AM", duration: "05:02", outcome: "Not Interested", score: 45, topics: "Not interested, Risk averse" },
  { name: "Christopher Miller", setter: "Ben", datetime: "18 May, 8:51 AM", duration: "07:33", outcome: "Booked", score: 88, topics: "Financial freedom, Quit job" },
  { name: "Matthew Taylor", setter: "Sarah", datetime: "18 May, 8:21 AM", duration: "04:11", outcome: "No Answer", score: null, topics: "—" },
];

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#1a1f35] px-3 py-1.5 text-sm text-[#f1f5f9]">
      {children}
    </button>
  );
}

function outcomeBadgeClasses(outcome: Outcome) {
  switch (outcome) {
    case "Booked":
      return "bg-[#22c55e20] text-[#22c55e]";
    case "Follow Up":
      return "bg-[#3b82f620] text-[#3b82f6]";
    case "Not Interested":
      return "bg-[#ef444420] text-[#ef4444]";
    case "No Answer":
      return "bg-[#ffffff10] text-[#94a3b8]";
  }
}

function scoreClasses(score: number | null) {
  if (score === null) return "text-[#94a3b8]";
  if (score >= 80) return "text-[#22c55e] bg-[#22c55e15]";
  if (score >= 60) return "text-[#f59e0b] bg-[#f59e0b15]";
  return "text-[#ef4444] bg-[#ef444415]";
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Transcript");
  const [selectedCallId, setSelectedCallId] = useState("1");
  const selectedCall = CALL_LIST.find((c) => c.id === selectedCallId) ?? CALL_LIST[0];

  const scoreCircumference = 2 * Math.PI * 36;
  const scoreOffset = scoreCircumference * (1 - 0.82);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d0f1a] text-[#f1f5f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
          <div>
            <h1 className="text-xl font-semibold text-white">
              CGT AI Call Intelligence Dashboard
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Transcripts, Best Times to Call &amp; AI Call Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FilterPill>
              All Setters
              <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8]" />
            </FilterPill>
            <FilterPill>
              All Outcomes
              <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8]" />
            </FilterPill>
            <FilterPill>
              <Calendar className="h-3.5 w-3.5 text-[#94a3b8]" />
              12 May 2025 - 18 May 2025
            </FilterPill>
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xs text-[#94a3b8]">Last updated 2 min ago</span>
              <button className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#1a1f35] hover:bg-[#232945]">
                <RefreshCw className="h-3.5 w-3.5 text-[#94a3b8]" />
              </button>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="flex flex-shrink-0 gap-3 px-3 py-3">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="flex-1 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#151929] p-4"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                    style={{ borderColor: kpi.iconColor, color: kpi.iconColor }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#94a3b8]">{kpi.label}</p>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#22c55e]">
                  <ArrowUp className="h-3 w-3" />
                  <span>{kpi.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Three column content */}
        <div className="flex flex-1 flex-row gap-3 overflow-hidden px-3">
          {/* Left column: transcript list */}
          <div className="flex w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-xl bg-[#151929]">
            <div className="flex-shrink-0 space-y-2 p-3">
              <p className="text-sm font-semibold text-white">Transcripts</p>
              <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0d0f1a] px-2 py-1.5">
                <Search className="h-3.5 w-3.5 text-[#94a3b8]" />
                <input
                  placeholder="Search transcripts..."
                  className="flex-1 bg-transparent text-xs text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none"
                />
                <button>
                  <Filter className="h-3.5 w-3.5 text-[#94a3b8]" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {CALL_LIST.map((call) => {
                const isSelected = call.id === selectedCallId;
                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border-b border-[rgba(255,255,255,0.04)] p-3 hover:bg-[#1a1f35]",
                      isSelected && "border-l-2 border-l-[#6366f1] bg-[#1a1f35]"
                    )}
                  >
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: call.avatarColor }}
                    >
                      {call.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{call.name}</p>
                      <p className="truncate text-xs text-[#94a3b8]">{call.phone}</p>
                      <p className="truncate text-xs text-[#94a3b8]">
                        {call.setter} · {call.datetime}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
                        <Clock className="h-3 w-3" />
                        {call.duration}
                      </div>
                      <button className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)]">
                        <Play className="h-3 w-3 text-[#94a3b8]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex-shrink-0 p-3 text-center">
              <a href="/transcripts" className="text-xs text-[#6366f1]">
                View all transcripts →
              </a>
            </div>
          </div>

          {/* Middle column: transcript viewer */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-[#151929]">
            <div className="flex flex-shrink-0 items-center justify-between p-4">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedCall.name}</h2>
                <p className="text-sm text-[#94a3b8]">{selectedCall.phone}</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#1a1f35] px-3 py-1.5 text-xs text-[#f1f5f9]">
                <Play className="h-3.5 w-3.5" />
                Play Recording
              </button>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 px-4 pb-3 text-xs text-[#94a3b8]">
              <span>Setter: {selectedCall.setter}</span>
              <span>|</span>
              <span>{selectedCall.datetime}</span>
              <span>|</span>
              <span>Duration: {selectedCall.duration}</span>
              <span>|</span>
              <span className="rounded bg-green-500/20 px-2 py-0.5 text-green-400">Booked</span>
            </div>

            <div className="flex flex-shrink-0 gap-4 border-b border-[rgba(255,255,255,0.06)] px-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "border-b-2 pb-2 text-sm transition-colors",
                    activeTab === tab
                      ? "border-[#6366f1] text-white"
                      : "border-transparent text-[#94a3b8] hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {TRANSCRIPT.map((line, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-[#94a3b8]">
                    {line.speaker} ({line.time})
                  </p>
                  <p className="text-sm leading-relaxed text-[#e2e8f0]">{line.text}</p>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[#0d0f1a]/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
                AI Summary
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2 rounded-lg bg-[#1a1f35] p-3">
                  <Frown className="h-4 w-4 flex-shrink-0 text-[#f97316]" />
                  <div>
                    <p className="text-xs font-medium text-white">Pain Point</p>
                    <p className="text-xs text-[#94a3b8]">
                      Wants more time with family. FIFO lifestyle is taking a toll.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 rounded-lg bg-[#1a1f35] p-3">
                  <Star className="h-4 w-4 flex-shrink-0 text-[#f59e0b]" />
                  <div>
                    <p className="text-xs font-medium text-white">Buying Intent</p>
                    <p className="text-xs text-[#94a3b8]">
                      High - Interested in challenge and next steps.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 rounded-lg bg-[#1a1f35] p-3">
                  <X className="h-4 w-4 flex-shrink-0 text-[#ef4444]" />
                  <div>
                    <p className="text-xs font-medium text-white">Objection</p>
                    <p className="text-xs text-[#94a3b8]">
                      Worried about finding enough time to learn while working FIFO.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 rounded-lg bg-[#1a1f35] p-3">
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                  <div>
                    <p className="text-xs font-medium text-white">Next Step</p>
                    <p className="text-xs text-[#94a3b8]">
                      Book strategy call this week. Send FIFO trader testimonial and case study.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex w-[300px] flex-shrink-0 flex-col gap-3 overflow-y-auto">
            <div className="rounded-xl bg-[#151929] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white">Best Times to Call</p>
                  <Info className="h-3.5 w-3.5 text-[#94a3b8]" />
                </div>
                <button className="flex items-center gap-1 text-xs text-[#94a3b8]">
                  By Hour of Day
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="pb-2 text-left font-normal text-[#475569]">Time</th>
                    <th className="pb-2 text-right font-normal text-[#475569]">Connect</th>
                    <th className="pb-2 text-right font-normal text-[#475569]">Conv.</th>
                    <th className="pb-2 text-right font-normal text-[#475569]">Booking</th>
                    <th className="pb-2 text-right font-normal text-[#475569]">Show</th>
                    <th className="pb-2 text-right font-normal text-[#475569]">Close</th>
                  </tr>
                </thead>
                <tbody>
                  {BEST_TIMES.map((row) => (
                    <tr key={row.time}>
                      <td className="py-1 text-left text-white">{row.time}</td>
                      <td className="py-1 text-right text-[#94a3b8]">{row.connect}</td>
                      <td className="py-1 text-right text-[#94a3b8]">{row.conv}</td>
                      <td className="py-1 text-right">
                        <span
                          className={cn(
                            row.highlight &&
                              "rounded bg-[#22c55e20] px-1 text-[#22c55e]",
                            !row.highlight && "text-[#94a3b8]"
                          )}
                        >
                          {row.booking}
                        </span>
                      </td>
                      <td className="py-1 text-right">
                        <span
                          className={cn(
                            row.highlight &&
                              "rounded bg-[#22c55e20] px-1 text-[#22c55e]",
                            !row.highlight && "text-[#94a3b8]"
                          )}
                        >
                          {row.show}
                        </span>
                      </td>
                      <td className="py-1 text-right">
                        <span
                          className={cn(
                            row.highlight &&
                              "rounded bg-[#22c55e20] px-1 text-[#22c55e]",
                            !row.highlight && "text-[#94a3b8]"
                          )}
                        >
                          {row.close}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-[#151929] p-4">
              <p className="mb-3 text-sm font-semibold text-white">
                AI Call Analysis Summary
              </p>
              <div className="flex gap-4">
                <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#1a1f35"
                      strokeWidth="8"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={scoreCircumference}
                      strokeDashoffset={scoreOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">82</span>
                    <span className="text-xs text-[#94a3b8]">/100</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  {SCORE_BREAKDOWN.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[#94a3b8]">{item.label}</span>
                      </div>
                      <span className="text-white">{item.score} / 20</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-3 w-full rounded-lg border border-[rgba(255,255,255,0.1)] py-2 text-xs text-[#94a3b8] hover:bg-[#1a1f35]">
                View Full Analysis →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom table */}
        <div className="mx-3 mb-3 flex-shrink-0 overflow-hidden rounded-xl bg-[#151929]">
          <div className="max-h-[240px] overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Lead Name", "Setter", "Date / Time", "Duration", "Outcome", "AI Score", "Key Topics", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="border-b border-[rgba(255,255,255,0.06)] px-3 py-2 text-left text-xs font-normal uppercase tracking-wide text-[#475569]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#1a1f35]/50"
                  >
                    <td className="px-3 py-2 text-white">{row.name}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.setter}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.datetime}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.duration}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs",
                          outcomeBadgeClasses(row.outcome)
                        )}
                      >
                        {row.outcome}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          scoreClasses(row.score)
                        )}
                      >
                        {row.score ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.topics}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button className="flex h-6 w-6 items-center justify-center rounded border border-[rgba(255,255,255,0.1)]">
                          <PlayCircle className="h-3 w-3 text-[#94a3b8]" />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded border border-[rgba(255,255,255,0.1)]">
                          <FileText className="h-3 w-3 text-[#94a3b8]" />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded border border-[rgba(255,255,255,0.1)]">
                          <Info className="h-3 w-3 text-[#94a3b8]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
