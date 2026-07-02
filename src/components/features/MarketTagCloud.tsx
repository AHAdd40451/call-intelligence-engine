import { cn } from "@/lib/utils";
import type { TagCloudItem } from "@/types";

interface MarketTagCloudProps {
  items: TagCloudItem[];
  className?: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  pain_point: "text-red-400 hover:text-red-300",
  goal: "text-green-400 hover:text-green-300",
  objection: "text-yellow-400 hover:text-yellow-300",
  sentiment: "text-blue-400 hover:text-blue-300",
  keyword: "text-[#a5a6f6] hover:text-[#c4c5fb]",
};

function sizeForWeight(weight: number, min: number, max: number): string {
  const range = max - min || 1;
  const t = (weight - min) / range;
  if (t > 0.8) return "text-2xl font-semibold";
  if (t > 0.6) return "text-xl font-semibold";
  if (t > 0.4) return "text-lg font-medium";
  if (t > 0.2) return "text-base font-medium";
  return "text-sm font-normal";
}

export function MarketTagCloud({ items, className }: MarketTagCloudProps) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">No tag data available.</p>;
  }

  const weights = items.map((item) => item.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}>
      {items.map((item) => (
        <span
          key={item.text}
          className={cn(
            "cursor-default transition-colors leading-none",
            sizeForWeight(item.weight, min, max),
            item.category
              ? CATEGORY_COLOR[item.category] ?? "text-zinc-300"
              : "text-zinc-300"
          )}
          title={`${item.text} · ${item.weight}`}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
