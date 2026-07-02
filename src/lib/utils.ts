import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds as `mm:ss` or `h:mm:ss` for durations over an hour. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Format a number as a percentage string, e.g. 0.4213 -> "42%". */
export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(digits)}%`;
}

/** Format a phone number to (xxx) xxx-xxxx when possible. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return formatPhone(digits.slice(1));
  }
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Format an ISO date string relative to now, e.g. "2h ago", "3d ago". */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format a date string as `Jan 5, 2026`. */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a date string as `Jan 5, 2026 · 3:45 PM`. */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

/** Clamp a numeric score into [0, 100] and round to nearest integer. */
export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Return a Tailwind color class based on a 0-100 score. */
export function scoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

/** Return a hex color based on a 0-100 score, for charts/SVG strokes. */
export function scoreHexColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

/** Human-readable label for a call outcome. */
export function outcomeLabel(outcome: string): string {
  const map: Record<string, string> = {
    booked: "Booked",
    not_interested: "Not Interested",
    callback: "Callback",
    no_answer: "No Answer",
    voicemail: "Voicemail",
  };
  return map[outcome] ?? outcome;
}

/** Badge color variant for a call outcome. */
export function outcomeColor(outcome: string): string {
  const map: Record<string, string> = {
    booked: "bg-green-500/10 text-green-400 border-green-500/20",
    not_interested: "bg-red-500/10 text-red-400 border-red-500/20",
    callback: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    no_answer: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    voicemail: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return map[outcome] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}

/** Truncate a string to a max length, appending an ellipsis if needed. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Get initials from a full name, e.g. "Jane Doe" -> "JD". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Format a large number with k/m suffixes. */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}
