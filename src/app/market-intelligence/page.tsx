import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketTagCloud } from "@/components/features/MarketTagCloud";
import { ObjectionBar } from "@/components/charts/ObjectionBar";
import { TrendLine } from "@/components/charts/TrendLine";
import {
  getTagCloud,
  getObjectionFrequency,
  mockFaqs,
  getTrendData,
  mockMarketPhrases,
} from "@/lib/mock-data";

export default function MarketIntelligencePage() {
  const tagCloud = getTagCloud();
  const objections = getObjectionFrequency();
  const painPointTrend = getTrendData(14);
  const topPhrases = [...mockMarketPhrases]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Market Intelligence</h1>
          <p className="text-sm text-zinc-500">
            Aggregated language, objections, and FAQs surfaced from real calls.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Language Cloud</CardTitle>
            <CardDescription>
              Weighted by frequency across pain points, goals, objections, and sentiment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarketTagCloud items={tagCloud} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Objection Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ObjectionBar data={objections} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pain Point Mentions — Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendLine data={painPointTrend} color="#ef4444" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Phrases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center justify-between rounded-lg border border-[#ffffff0a] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {phrase.category.replace("_", " ")}
                    </Badge>
                    <span className="text-sm text-zinc-300">{phrase.phrase}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{phrase.frequency} mentions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Auto-clustered from repeated questions across calls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFaqs.map((faq) => (
              <div key={faq.id} className="border-b border-[#ffffff0a] pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-100">{faq.question}</p>
                  <Badge variant="secondary" className="shrink-0">
                    {faq.frequency}x
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
