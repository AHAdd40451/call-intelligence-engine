// ---------------------------------------------------------------------------
// Deterministic sample data used to render the UI before a Supabase project
// is connected and synced. Swap these for real Supabase queries once
// `NEXT_PUBLIC_SUPABASE_URL` etc. are configured — see README.md.
// ---------------------------------------------------------------------------

import type {
  Call,
  AIAnalysis,
  CallWithAnalysis,
  ContentIdea,
  SetterStats,
  MarketPhrase,
  FAQ,
  DailyBriefing,
  HeatmapCell,
  FunnelStage,
  TrendPoint,
  SentimentPoint,
  ScoreRadarPoint,
  TagCloudItem,
  Objection,
  CallOutcome,
  BuyingIntent,
} from "@/types";

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

const SETTERS = [
  { id: "setter_1", name: "Jordan Blake" },
  { id: "setter_2", name: "Casey Rivers" },
  { id: "setter_3", name: "Morgan Lee" },
  { id: "setter_4", name: "Avery Chen" },
  { id: "setter_5", name: "Riley Santos" },
];

const LEAD_NAMES = [
  "Alex Turner", "Sam Patel", "Jamie Ortiz", "Taylor Kim", "Drew Fischer",
  "Reese Nolan", "Cameron Brooks", "Skyler Vance", "Dakota Reyes", "Peyton Cole",
  "Emerson Gray", "Rowan Sinclair", "Finley Hayes", "Blake Marlow", "Quinn Ashby",
];

const OUTCOMES: CallOutcome[] = ["booked", "not_interested", "callback", "no_answer", "voicemail"];
const BUYING_INTENTS: BuyingIntent[] = ["very_high", "high", "medium", "low"];

const PAIN_POINTS = [
  "Losing leads to slow follow-up", "No visibility into rep performance",
  "Manual data entry eating up time", "Inconsistent sales scripts",
  "Low show-up rate for booked calls", "Can't tell which leads are hot",
];
const GOALS = [
  "Scale outbound without hiring", "Improve close rate", "Cut onboarding time for new reps",
  "Get real-time coaching feedback", "Increase booked call volume",
];
const OBJECTIONS = [
  "Price is too high", "Need to talk to my partner", "Already using a competitor",
  "Not the right time", "Need more case studies", "Worried about implementation time",
  "Budget frozen this quarter",
];
const SENTIMENTS = ["curious", "skeptical", "engaged", "rushed", "frustrated", "optimistic"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function daysAgoISO(days: number, hour?: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  if (hour !== undefined) d.setHours(hour, randomInt(0, 59), 0, 0);
  return d.toISOString();
}

export const mockCalls: Call[] = Array.from({ length: 48 }, (_, i) => {
  const setter = pick(SETTERS);
  const outcome = pick(OUTCOMES);
  const daysBack = randomInt(0, 21);
  return {
    id: `call_${i + 1}`,
    lead_name: pick(LEAD_NAMES),
    phone: `+1310555${String(1000 + i).slice(-4)}`,
    setter: setter.name,
    setter_id: setter.id,
    date: daysAgoISO(daysBack, randomInt(8, 18)),
    duration: randomInt(45, 900),
    outcome,
    recording_url: undefined,
    transcript:
      "Setter: Hey, thanks for taking the call today.\n" +
      "Lead: No problem, I've got a few minutes.\n" +
      "Setter: Great — tell me a bit about how you're currently handling your sales calls.\n" +
      `Lead: Honestly, ${pick(PAIN_POINTS).toLowerCase()} has been a real headache for us.\n` +
      "Setter: That makes sense, a lot of teams we work with hit that same wall. What would success look like for you?\n" +
      `Lead: Really we just want to ${pick(GOALS).toLowerCase()}.\n` +
      `Setter: Totally doable. I'll be honest with you though — ${pick(OBJECTIONS).toLowerCase()} is usually the first thing people bring up.\n` +
      "Lead: Yeah that's fair, I do have some concerns there.\n" +
      "Setter: Let's set up time with the team to walk through it in detail.",
    ai_summary: `Lead expressed interest driven by ${pick(PAIN_POINTS).toLowerCase()}; discussed ${pick(GOALS).toLowerCase()}.`,
    source: i % 3 === 0 ? "ghl" : "trellus",
    raw_id: `raw_${1000 + i}`,
    created_at: daysAgoISO(daysBack),
  };
});

export const mockAnalyses: Record<string, AIAnalysis> = Object.fromEntries(
  mockCalls.map((call) => {
    const overall = randomInt(35, 96);
    const analysis: AIAnalysis = {
      call_id: call.id,
      overall_score: overall,
      rapport: randomInt(30, 100),
      qualification: randomInt(30, 100),
      discovery: randomInt(30, 100),
      objection_handling: randomInt(30, 100),
      urgency: randomInt(30, 100),
      closing: randomInt(30, 100),
      script_compliance: randomInt(30, 100),
      communication: randomInt(30, 100),
      buying_intent: pick(BUYING_INTENTS),
      buying_intent_reason:
        "Lead asked detailed pricing and timeline questions, and volunteered internal budget context.",
      pain_points: pickMany(PAIN_POINTS, randomInt(1, 3)),
      goals: pickMany(GOALS, randomInt(1, 2)),
      objections: pickMany(OBJECTIONS, randomInt(1, 2)),
      sentiment: pickMany(SENTIMENTS, randomInt(1, 2)),
      missed_opportunities: pickMany(
        [
          "Didn't confirm decision-maker on the call",
          "No follow-up date locked in",
          "Skipped urgency close",
          "Didn't address budget objection directly",
        ],
        randomInt(0, 2)
      ),
      coaching_suggestions: pickMany(
        [
          "Ask for the decision timeline earlier",
          "Use a stronger urgency close",
          "Confirm budget range before pitching",
          "Slow down during discovery",
        ],
        randomInt(1, 2)
      ),
      created_at: call.created_at,
    };
    return [call.id, analysis];
  })
);

export const mockCallsWithAnalysis: CallWithAnalysis[] = mockCalls.map((call) => ({
  ...call,
  analysis: mockAnalyses[call.id],
}));

export function getKpiSummary() {
  const total = mockCalls.length;
  const booked = mockCalls.filter((c) => c.outcome === "booked").length;
  const scores = Object.values(mockAnalyses).map((a) => a.overall_score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const totalDuration = mockCalls.reduce((a, c) => a + c.duration, 0);

  return {
    total_calls: total,
    avg_score: avgScore,
    booking_rate: booked / total,
    total_duration: totalDuration,
    calls_delta: 0.12,
    score_delta: 0.04,
    booking_delta: -0.03,
  };
}

export function getSetterStats(): SetterStats[] {
  return SETTERS.map((setter) => {
    const calls = mockCalls.filter((c) => c.setter_id === setter.id);
    const scores = calls.map((c) => mockAnalyses[c.id]?.overall_score ?? 0);
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const booked = calls.filter((c) => c.outcome === "booked").length;
    return {
      setter_id: setter.id,
      setter_name: setter.name,
      total_calls: calls.length,
      avg_score: avgScore,
      booking_rate: calls.length ? booked / calls.length : 0,
      top_objection: pick(OBJECTIONS),
      trend: Math.round((rand() * 30 - 10) * 10) / 10,
    };
  }).sort((a, b) => b.avg_score - a.avg_score);
}

export function getHeatmapData(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isBusinessHours = hour >= 8 && hour <= 18 && day >= 1 && day <= 5;
      const calls = isBusinessHours ? randomInt(0, 14) : randomInt(0, 3);
      const bookings = Math.round(calls * (isBusinessHours ? rand() * 0.4 : rand() * 0.15));
      cells.push({
        day,
        hour,
        calls,
        bookings,
        conversion_rate: calls ? bookings / calls : 0,
      });
    }
  }
  return cells;
}

export function getFunnelStages(): FunnelStage[] {
  const dialed = 640;
  const connected = 412;
  const qualified = 268;
  const booked = 154;
  const showed = 108;
  return [
    { label: "Dialed", value: dialed, percent: 1 },
    { label: "Connected", value: connected, percent: connected / dialed },
    { label: "Qualified", value: qualified, percent: qualified / dialed },
    { label: "Booked", value: booked, percent: booked / dialed },
    { label: "Showed", value: showed, percent: showed / dialed },
  ];
}

export function getTrendData(days = 14): TrendPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: randomInt(55, 92),
    };
  });
}

export function getCallVolumeTrend(days = 14): TrendPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: randomInt(8, 34),
    };
  });
}

export function getSentimentFlow(): SentimentPoint[] {
  return Array.from({ length: 20 }, (_, i) => ({
    index: i,
    timestamp: `${i}`,
    sentiment_score: Math.round((Math.sin(i / 3) * 0.5 + (rand() - 0.5) * 0.4) * 100) / 100,
    speaker: i % 2 === 0 ? "setter" : "lead",
  }));
}

export function getScoreRadarData(analysis: AIAnalysis): ScoreRadarPoint[] {
  return [
    { metric: "Rapport", value: analysis.rapport, fullMark: 100 },
    { metric: "Qualification", value: analysis.qualification, fullMark: 100 },
    { metric: "Discovery", value: analysis.discovery, fullMark: 100 },
    { metric: "Objections", value: analysis.objection_handling, fullMark: 100 },
    { metric: "Urgency", value: analysis.urgency, fullMark: 100 },
    { metric: "Closing", value: analysis.closing, fullMark: 100 },
  ];
}

export function getObjectionFrequency(): Objection[] {
  return OBJECTIONS.map((label, i) => ({
    id: `objection_${i}`,
    label,
    frequency: randomInt(4, 42),
  }));
}

export const mockMarketPhrases: MarketPhrase[] = [
  ...PAIN_POINTS.map((phrase, i) => ({
    id: `pp_${i}`,
    phrase,
    category: "pain_point" as const,
    frequency: randomInt(5, 40),
    call_ids: [],
  })),
  ...GOALS.map((phrase, i) => ({
    id: `goal_${i}`,
    phrase,
    category: "goal" as const,
    frequency: randomInt(5, 40),
    call_ids: [],
  })),
  ...OBJECTIONS.map((phrase, i) => ({
    id: `obj_${i}`,
    phrase,
    category: "objection" as const,
    frequency: randomInt(5, 40),
    call_ids: [],
  })),
];

export function getTagCloud(): TagCloudItem[] {
  return mockMarketPhrases.map((p) => ({
    text: p.phrase,
    weight: p.frequency,
    category: p.category,
  }));
}

export const mockFaqs: FAQ[] = [
  {
    id: "faq_1",
    question: "How long does implementation take?",
    answer: "Most teams are live within one to two weeks, including rep onboarding.",
    frequency: 31,
    source_call_ids: [],
  },
  {
    id: "faq_2",
    question: "Do you integrate with our current CRM?",
    answer: "Yes — native integrations with GoHighLevel, HubSpot and Salesforce.",
    frequency: 24,
    source_call_ids: [],
  },
  {
    id: "faq_3",
    question: "What does pricing look like for a 10-person team?",
    answer: "Pricing scales per seat with volume discounts starting at 5 seats.",
    frequency: 19,
    source_call_ids: [],
  },
];

export const mockContentIdeas: ContentIdea[] = [
  {
    id: "idea_1",
    type: "instagram_reel",
    title: "\"We were losing leads to slow follow-up\" — 30s testimonial cut",
    description:
      "Clip from call_12 where the lead describes their exact pain point in a punchy, quotable way. Great hook for a reel.",
    source_call_ids: ["call_12"],
    created_at: daysAgoISO(1),
    status: "new",
  },
  {
    id: "idea_2",
    type: "email",
    title: "Objection-busting email: \"Already using a competitor\"",
    description:
      "Three calls this week hit the same objection. Draft a nurture email addressing switching costs head-on.",
    source_call_ids: ["call_5", "call_19", "call_27"],
    created_at: daysAgoISO(2),
    status: "reviewed",
  },
  {
    id: "idea_3",
    type: "faq",
    title: "FAQ: Implementation timeline",
    description:
      "Recurring question across 8 calls this month — worth a dedicated FAQ page section and sales one-pager.",
    source_call_ids: ["call_3", "call_8"],
    created_at: daysAgoISO(4),
    status: "used",
  },
  {
    id: "idea_4",
    type: "podcast",
    title: "Episode: How ops teams get visibility into rep performance",
    description:
      "Multiple prospects want more coaching visibility — good angle for a founder-led podcast episode.",
    source_call_ids: ["call_15"],
    created_at: daysAgoISO(5),
    status: "new",
  },
  {
    id: "idea_5",
    type: "marketing_copy",
    title: "Landing page headline test: \"Stop losing hot leads\"",
    description: "Pain point language pulled directly from live calls, tuned for a paid landing page test.",
    source_call_ids: ["call_22", "call_31"],
    created_at: daysAgoISO(6),
    status: "new",
  },
  {
    id: "idea_6",
    type: "webinar",
    title: "Webinar: Scaling outbound without hiring more reps",
    description: "Popular goal mentioned across setter calls — frame as a webinar for VP Sales personas.",
    source_call_ids: ["call_9", "call_14"],
    created_at: daysAgoISO(8),
    status: "reviewed",
  },
];

export function getMorningBriefing(): DailyBriefing {
  const kpi = getKpiSummary();
  const setters = getSetterStats();
  return {
    id: "briefing_today",
    date: new Date().toISOString(),
    summary:
      "Call volume is up 12% week-over-week with steady score performance. Pricing objections ticked up across three reps — worth a quick team sync before EOD.",
    total_calls: kpi.total_calls,
    avg_score: kpi.avg_score,
    booking_rate: kpi.booking_rate,
    top_performer: setters[0]?.setter_name,
    top_objection: "Price is too high",
    highlights: [
      "Jordan Blake booked 6 calls yesterday, team high",
      "3 new content ideas queued from this week's transcripts",
      "Best call window remains Tue–Thu, 10am–12pm",
    ],
  };
}
