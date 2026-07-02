# PIXEL-PERFECT REDESIGN — CGT AI Call Intelligence Dashboard

Completely rewrite the following files to exactly match this design. Do NOT keep any of the old code. Replace everything.

## EXACT DESIGN SPECIFICATION

### COLOR TOKENS (hardcode these exact values)
- bg-primary: #0d0f1a (deepest background)
- bg-sidebar: #0f1120 (sidebar)
- bg-card: #151929 (card surfaces)
- bg-elevated: #1a1f35 (elevated cards, hover)
- border-subtle: rgba(255,255,255,0.06)
- accent-blue: #3b82f6
- accent-indigo: #6366f1
- text-primary: #f1f5f9
- text-secondary: #94a3b8
- text-muted: #475569
- green-positive: #22c55e
- red-negative: #ef4444
- yellow-warning: #f59e0b
- sidebar-active-bg: rgba(99,102,241,0.15)
- sidebar-active-border: #6366f1

### LAYOUT
Full viewport. No scrollbar on outer container. Overflow handled inside panels.
```
<html style="height:100%; overflow:hidden">
  <body style="height:100%; overflow:hidden">
    flex-row, h-screen, overflow-hidden
    ├── Sidebar (w-[220px], fixed left, full height)
    └── Main (flex-1, flex-col, overflow-hidden)
        ├── TopBar (h-auto, border-bottom)
        ├── KPI row (flex-shrink-0)
        └── Content area (flex-1, overflow-hidden)
            ├── Left panel (transcript list, w-[280px], overflow-y-auto)
            ├── Middle panel (transcript viewer, flex-1, overflow-y-auto)
            └── Right panel (w-[300px], overflow-y-auto)
        └── Bottom table (flex-shrink-0, max-h-[240px], overflow-y-auto)
```

---

## FILES TO REWRITE (write complete working code for each):

### FILE 1: src/app/globals.css
```css
@import "tailwindcss";

:root {
  --bg-primary: #0d0f1a;
  --bg-sidebar: #0f1120;
  --bg-card: #151929;
  --bg-elevated: #1a1f35;
  --border-subtle: rgba(255,255,255,0.06);
  --accent: #6366f1;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; background: var(--bg-primary); color: var(--text-primary); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

/* Scrollbar styling */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* Remove default next.js styles */
```

---

### FILE 2: src/components/layout/Sidebar.tsx
'use client'

Exact sidebar from screenshot:
- Top: CGT bar-chart logo icon (blue) + "CGT" bold white + "CAPITAL GROWTH TRADERS" small gray text below, 2 lines
- Divider line
- Nav items with icons (use lucide-react):
  - Overview → LayoutDashboard icon
  - Transcripts → FileText icon — ACTIVE state: indigo left border (3px solid #6366f1), bg rgba(99,102,241,0.12), text white
  - Best Times to Call → Clock icon
  - AI Call Analysis → Brain icon
  - Leads → Users icon
  - Setters → UserCheck icon
  - Reports → BarChart2 icon
  - Settings → Settings icon
- Bottom: Avatar circle "NE" (gray bg) + "Neo" bold + "AI Chief of Staff" small gray + ChevronUp icon

Sidebar is fixed w-[220px], bg-[#0f1120], border-r border-[rgba(255,255,255,0.06)]
Nav items: px-3 py-2, rounded-lg, text-sm, flex items-center gap-3
Icons: 16px, text-[#94a3b8], active: text-[#6366f1]
Active item: border-l-[3px] border-[#6366f1] pl-[9px] bg-[rgba(99,102,241,0.12)] text-white

---

### FILE 3: src/app/dashboard/page.tsx
This is the MAIN page. It must be a 'use client' component that renders the FULL dashboard layout matching the screenshot EXACTLY. No DashboardLayout wrapper — inline everything for pixel-perfect control.

#### HEADER BAR (inside main content, not sidebar)
- Left: "CGT AI Call Intelligence Dashboard" h1 (text-xl font-semibold text-white)
- Subtext: "Transcripts, Best Times to Call & AI Call Analysis" (text-xs text-[#94a3b8])
- Right side: Three filter pills:
  1. "All Setters" with ChevronDown — border border-[rgba(255,255,255,0.1)] bg-[#1a1f35] rounded-lg px-3 py-1.5 text-sm flex items-center gap-2
  2. "All Outcomes" same style
  3. Date range "12 May 2025 - 18 May 2025" with Calendar icon same style
- Far right: "Last updated" text (text-xs text-[#94a3b8]) + "2 min ago" + refresh button (circle button with RefreshCw icon)

#### KPI CARDS ROW
6 cards in a row. Each card: bg-[#151929] border border-[rgba(255,255,255,0.06)] rounded-xl p-4
Card structure:
- Top row: Icon (circle outline, 32px) + Metric label (text-xs text-[#94a3b8])
- Big number: text-2xl font-bold text-white
- Bottom: ↑ green arrow + "X% vs last 7 days" text-xs text-[#22c55e]

Cards (exact data):
1. Phone icon (blue circle border) | Total Calls | **1,248** | ↑18% vs last 7 days
2. MessageSquare icon (green circle) | Conversations (60s+) | **642** | ↑22%
3. CalendarCheck icon (purple circle) | Calls Booked | **87** | ↑16%
4. CheckCircle icon (blue circle) | Show Rate | **68%** | ↑7%
5. DollarSign icon (green circle) | Close Rate | **31%** | ↑5%
6. DollarSign icon (gold circle) | Revenue (This Week) | **$42,600** | ↑12%

#### THREE-COLUMN CONTENT AREA (flex-1, overflow-hidden, flex flex-row gap-3 p-3)

**LEFT COLUMN — Transcripts List (w-[280px], flex-shrink-0, bg-[#151929], rounded-xl, overflow-hidden, flex flex-col)**
- Header: "Transcripts" text-sm font-semibold + search input (bg-[#0d0f1a] border border-[rgba(255,255,255,0.08)] rounded-lg, Search icon left, Filter icon right button)
- Scrollable list of 5 call cards:
  Each card: flex items-center gap-3 p-3 hover:bg-[#1a1f35] cursor-pointer border-b border-[rgba(255,255,255,0.04)]
  - Avatar circle (32px, colored initials): JS=blue, MB=green, DW=orange, CM=red, MT=purple
  - Middle: Name (text-sm font-medium text-white) + phone (text-xs text-[#94a3b8]) THEN setter name + date/time (text-xs text-[#94a3b8])
  - Right: clock icon + duration (text-xs text-[#94a3b8]) + play button circle (border border-[rgba(255,255,255,0.15)] rounded-full w-7 h-7 flex items-center justify-center)
  
  Call data:
  - John Smith | 0412 345 678 | Ben | 18 May, 10:23 AM | 08:42 — SELECTED (bg-[#1a1f35] border-l-2 border-[#6366f1])
  - Michael Brown | 0413 234 567 | Sarah | 18 May, 9:47 AM | 06:15
  - Daniel Williams | 0411 456 789 | Jake | 18 May, 9:15 AM | 05:02
  - Christopher Miller | 0400 111 222 | Ben | 18 May, 8:51 AM | 03:33
  - Matthew Taylor | 0416 789 123 | Sarah | 18 May, 8:21 AM | 04:11
- Footer: "View all transcripts →" text-xs text-[#6366f1] text-center p-3

**MIDDLE COLUMN — Transcript Viewer (flex-1, bg-[#151929], rounded-xl, overflow-hidden, flex flex-col)**
- Header row:
  - "John Smith" text-base font-semibold + phone "0412 345 678" text-sm text-[#94a3b8]
  - Right: "▶ Play Recording" button (bg-[#1a1f35] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-xs flex gap-2)
- Sub-header: "Setter: Ben | 18 May, 10:23 AM | Duration: 08:42 | " + "Booked" badge (bg-green-500/20 text-green-400 rounded px-2 py-0.5 text-xs)
- Tabs: Transcript (active, underline indigo) | AI Summary | Call Analysis | Notes
  Tab style: text-sm pb-2 border-b-2, active=border-[#6366f1] text-white, inactive=border-transparent text-[#94a3b8]
- Transcript content (flex-1 overflow-y-auto p-4 space-y-3):
  Each message bubble:
  - "Ben (00:00)" text-xs text-[#94a3b8] font-medium
  - Message text text-sm text-[#e2e8f0] leading-relaxed
  Speaker colors: Ben messages have subtle left indicator, John messages different
  
  Exact transcript:
  Ben (00:00): "Hey John, it's Ben from Capital Growth Traders. Just calling because you filled out the info on our 3 Day Challenge. Is now a good time to chat?"
  John (00:07): "Yeah mate, this is a good time."
  Ben (00:09): "Perfect. So John, what made you look into trading and our challenge?"
  John (00:15): "Mainly looking for a way to create a second income. I work FIFO and want more time with my family."
  Ben (00:24): "That's awesome John. So FIFO life can be tough. How long have you been looking for something flexible?"

- AI Summary section (border-t border-[rgba(255,255,255,0.06)] p-4 bg-[#0d0f1a]/50):
  "AI Summary" text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-3
  4 info cards in 2x2 grid:
  - Pain Point (Frown icon, orange): "Wants more time with family. FIFO lifestyle is taking a toll."
  - Buying Intent (Star icon, yellow): "High - Interested in challenge and next steps."
  - Objection (X icon, red): "Worried about finding enough time to learn while working FIFO."
  - Next Step (ArrowRight icon, green): "Book strategy call this week. Send FIFO trader testimonial and case study."
  Each mini-card: bg-[#1a1f35] rounded-lg p-3 flex gap-2

**RIGHT COLUMN (w-[300px], flex-shrink-0, flex flex-col gap-3, overflow-y-auto)**

Top card: "Best Times to Call" bg-[#151929] rounded-xl p-4
- Header: "Best Times to Call" text-sm font-semibold + info circle icon + "By Hour of Day" dropdown right
- Table (full width, text-xs):
  Headers: Time | Connect Rate | Conv. (60s+) Rate | Booking Rate | Show Rate | Close Rate
  Header text: text-[#475569] text-right (except Time which is left)
  Rows (alternating slightly):
  - 6AM - 8AM | 12% | 6% | 2% | 40% | 10%
  - 8AM - 10AM | 28% | 14% | 3% | 52% | 14%
  - 10AM - 12PM | 42% | 22% | **6%** | **70%** | **28%** ← HIGHLIGHTED: 70% and 28% in green pill bg-[#22c55e20] text-[#22c55e] rounded px-1
  - 12PM - 2PM | 32% | 18% | 5% | 66% | 25%
  - 2PM - 4PM | 34% | 20% | 5% | 65% | 23%
  - 4PM - 6PM | 22% | 12% | 3% | 50% | 12%
  - 6PM - 8PM | 8% | 4% | 1% | 30% | 5%
  Row text: text-[#94a3b8], first col text-white text-left, numbers text-right

Bottom card: "AI Call Analysis Summary" bg-[#151929] rounded-xl p-4
- "AI Call Analysis Summary" text-sm font-semibold
- Content: flex gap-4
  Left: Circular score ring (80px diameter):
    SVG circle, stroke-width=8, bg circle color=#1a1f35, progress circle color=#22c55e
    Progress: 82% (circumference = 2π×36 = 226, offset = 226 × (1-0.82) = 40.7)
    Center text: "82" text-2xl font-bold text-white + "/100" text-xs text-[#94a3b8]
  Right: Score breakdown list (text-xs):
    Each row: colored dot + label + "X / 20" right-aligned
    - green dot | Script Compliance | 18 / 20
    - blue dot | Qualification | 16 / 20
    - orange dot | Objection Handling | 15 / 20
    - purple dot | Closing & Booking | 17 / 20
    - cyan dot | Communication | 16 / 20
- "View Full Analysis →" button border border-[rgba(255,255,255,0.1)] text-xs text-[#94a3b8] w-full mt-3 py-2 rounded-lg hover:bg-[#1a1f35]

#### BOTTOM DATA TABLE (flex-shrink-0, bg-[#151929] rounded-xl mx-3 mb-3)
Full-width table. Max 5 rows visible. border-collapse.
Columns: Lead Name | Setter | Date / Time | Duration | Outcome | AI Score | Key Topics | Actions

Column headers: text-xs text-[#475569] uppercase tracking-wide py-2 px-3 border-b border-[rgba(255,255,255,0.06)] text-left

Row data (text-sm):
| John Smith | Ben | 18 May, 10:23 AM | 08:42 | Booked (green) | 82 (green) | FIFO, Second income, Time freedom | ▶ 📄 ℹ️ |
| Michael Brown | Sarah | 18 May, 9:47 AM | 06:15 | Follow Up (blue) | 75 (yellow) | Learn trading, No experience, Timed | ▶ 📄 ℹ️ |
| Daniel Williams | Jake | 18 May, 9:15 AM | 05:02 | Not Interested (red) | 45 (red) | Not interested, Risk averse | ▶ 📄 ℹ️ |
| Christopher Miller | Ben | 18 May, 8:51 AM | 07:33 | Booked (green) | 88 (green) | Financial freedom, Quit job | ▶ 📄 ℹ️ |
| Matthew Taylor | Sarah | 18 May, 8:21 AM | 04:11 | No Answer (gray) | N/A | — | ▶ 📄 ℹ️ |

Outcome badge styles:
- Booked: bg-[#22c55e20] text-[#22c55e] rounded-md px-2 py-0.5 text-xs
- Follow Up: bg-[#3b82f620] text-[#3b82f6] rounded-md px-2 py-0.5 text-xs
- Not Interested: bg-[#ef444420] text-[#ef4444] rounded-md px-2 py-0.5 text-xs
- No Answer: bg-[#ffffff10] text-[#94a3b8] rounded-md px-2 py-0.5 text-xs

AI Score display: colored number badge
- ≥80: text-[#22c55e] bg-[#22c55e15] rounded px-2
- 60-79: text-[#f59e0b] bg-[#f59e0b15] rounded px-2
- <60: text-[#ef4444] bg-[#ef444415] rounded px-2
- N/A: text-[#94a3b8]

Actions: three small icon buttons, gap-1:
- Play2 icon button (w-6 h-6 rounded border border-[rgba(255,255,255,0.1)])
- FileText icon button same
- Info icon button same

Row: py-2 px-3 border-b border-[rgba(255,255,255,0.04)] hover:bg-[#1a1f35]/50

---

### FILE 4: src/components/layout/Sidebar.tsx (see above — full rewrite)

---

### FILE 5: src/app/layout.tsx
Root layout — no padding, no margin, full height, dark bg, import globals.css, render {children} in a div h-screen overflow-hidden flex.

---

IMPORTANT RULES:
1. Use ONLY inline Tailwind classes or inline styles — no CSS modules
2. All components 'use client' where needed
3. Use lucide-react for all icons
4. Write complete, compilable TypeScript — no TypeScript errors
5. Mock data inline — no Supabase calls needed in these UI files
6. The layout must be EXACTLY like the screenshot: sidebar left, everything else right, no page scroll
7. Make the dashboard/page.tsx render the FULL experience shown in the screenshot
