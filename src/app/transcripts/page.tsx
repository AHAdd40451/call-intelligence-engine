"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallCard } from "@/components/features/CallCard";
import { mockCallsWithAnalysis, getSetterStats } from "@/lib/mock-data";
import type { CallFilters } from "@/types";

const DEFAULT_FILTERS: CallFilters = {
  search: "",
  setter_id: "all",
  outcome: "all",
  source: "all",
  date_from: null,
  date_to: null,
  min_score: null,
  buying_intent: "all",
};

export default function TranscriptsPage() {
  const [filters, setFilters] = useState<CallFilters>(DEFAULT_FILTERS);
  const setters = useMemo(() => getSetterStats(), []);

  function setFilter<K extends keyof CallFilters>(key: K, value: CallFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(() => {
    return mockCallsWithAnalysis.filter((call) => {
      if (
        filters.search &&
        !`${call.lead_name} ${call.phone} ${call.ai_summary ?? ""}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.setter_id !== "all" && call.setter_id !== filters.setter_id) return false;
      if (filters.outcome !== "all" && call.outcome !== filters.outcome) return false;
      if (filters.source !== "all" && call.source !== filters.source) return false;
      if (filters.date_from && new Date(call.date) < new Date(filters.date_from)) return false;
      if (filters.date_to && new Date(call.date) > new Date(filters.date_to)) return false;
      if (
        filters.min_score !== null &&
        (call.analysis?.overall_score ?? 0) < filters.min_score
      ) {
        return false;
      }
      if (
        filters.buying_intent !== "all" &&
        call.analysis?.buying_intent !== filters.buying_intent
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return false;
    return value !== "all" && value !== null && value !== "";
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Transcripts</h1>
          <p className="text-sm text-zinc-500">
            {filtered.length} of {mockCallsWithAnalysis.length} calls
          </p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by lead name, phone, or summary…"
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              <Select
                value={filters.setter_id}
                onValueChange={(v) => setFilter("setter_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Setter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Setters</SelectItem>
                  {setters.map((s) => (
                    <SelectItem key={s.setter_id} value={s.setter_id}>
                      {s.setter_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.outcome}
                onValueChange={(v) => setFilter("outcome", v as CallFilters["outcome"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="callback">Callback</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.source}
                onValueChange={(v) => setFilter("source", v as CallFilters["source"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="trellus">Trellus</SelectItem>
                  <SelectItem value="ghl">GoHighLevel</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.buying_intent}
                onValueChange={(v) => setFilter("buying_intent", v as CallFilters["buying_intent"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Buying Intent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Intent</SelectItem>
                  <SelectItem value="very_high">Very High</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.min_score !== null ? String(filters.min_score) : "any"}
                onValueChange={(v) => setFilter("min_score", v === "any" ? null : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Min Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Score</SelectItem>
                  <SelectItem value="80">80+</SelectItem>
                  <SelectItem value="60">60+</SelectItem>
                  <SelectItem value="40">40+</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={filters.date_from ?? ""}
                onChange={(e) => setFilter("date_from", e.target.value || null)}
                aria-label="From date"
              />

              <Input
                type="date"
                value={filters.date_to ?? ""}
                onChange={(e) => setFilter("date_to", e.target.value || null)}
                aria-label="To date"
              />
            </div>

            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  <X className="h-3 w-3" /> Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-zinc-500">
                No calls match your filters.
              </CardContent>
            </Card>
          ) : (
            filtered.map((call) => <CallCard key={call.id} call={call} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
