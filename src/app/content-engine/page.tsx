"use client";

import { useMemo, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentIdeaCard } from "@/components/features/ContentIdeaCard";
import { mockContentIdeas } from "@/lib/mock-data";
import type { ContentIdeaType } from "@/types";

const TYPE_TABS: { value: ContentIdeaType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "instagram_reel", label: "Reel" },
  { value: "email", label: "Email" },
  { value: "podcast", label: "Podcast" },
  { value: "webinar", label: "Webinar" },
  { value: "faq", label: "FAQ" },
  { value: "marketing_copy", label: "Copy" },
];

export default function ContentEnginePage() {
  const [typeFilter, setTypeFilter] = useState<ContentIdeaType | "all">("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return mockContentIdeas;
    return mockContentIdeas.filter((idea) => idea.type === typeFilter);
  }, [typeFilter]);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      await fetch("/api/content-engine/generate", { method: "POST" });
    } catch {
      // Ignored — this demo view relies on mock data regardless of API result.
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Content Engine</h1>
            <p className="text-sm text-zinc-500">
              AI-generated content ideas sourced from recent call transcripts.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate New Ideas
          </Button>
        </div>

        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as ContentIdeaType | "all")}>
          <TabsList className="flex-wrap h-auto">
            {TYPE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-zinc-500">
              No content ideas of this type yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((idea) => (
              <ContentIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
