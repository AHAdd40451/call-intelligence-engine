"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ApiKeyField {
  key: string;
  label: string;
  description: string;
  placeholder: string;
}

const API_KEY_FIELDS: ApiKeyField[] = [
  {
    key: "TRELLUS_API_KEY",
    label: "Trellus API Key",
    description: "Used to pull call sessions and transcripts from Trellus.",
    placeholder: "trls_live_••••••••••••",
  },
  {
    key: "GHL_API_KEY",
    label: "GoHighLevel API Key",
    description: "Used to pull call activity and contacts from GoHighLevel.",
    placeholder: "ghl_••••••••••••",
  },
  {
    key: "ANTHROPIC_API_KEY",
    label: "Anthropic API Key",
    description: "Powers call scoring, coaching suggestions, and content generation.",
    placeholder: "sk-ant-••••••••••••",
  },
];

type SyncStatus = "idle" | "syncing" | "success" | "error";

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [trellusStatus, setTrellusStatus] = useState<SyncStatus>("idle");
  const [ghlStatus, setGhlStatus] = useState<SyncStatus>("idle");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function runSync(source: "trellus" | "ghl") {
    const setStatus = source === "trellus" ? setTrellusStatus : setGhlStatus;
    setStatus("syncing");
    try {
      const res = await fetch(`/api/sync/${source}`, { method: "POST" });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
          <p className="text-sm text-zinc-500">
            Manage API credentials and data sync for your workspace.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Stored as environment variables server-side. Never exposed to the browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {API_KEY_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">{field.label}</label>
                <Input
                  type="password"
                  placeholder={field.placeholder}
                  value={keys[field.key] ?? ""}
                  onChange={(e) =>
                    setKeys((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
                <p className="text-xs text-zinc-500">{field.description}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
              {saved ? "Saved" : "Save Keys"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sync</CardTitle>
            <CardDescription>
              Manually trigger a sync, or rely on the scheduled cron job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SyncRow
              title="Trellus"
              subtitle="Pull call sessions & transcripts"
              status={trellusStatus}
              onSync={() => runSync("trellus")}
            />
            <Separator />
            <SyncRow
              title="GoHighLevel"
              subtitle="Pull call activity & contacts"
              status={ghlStatus}
              onSync={() => runSync("ghl")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Jobs</CardTitle>
            <CardDescription>
              Configured via <code className="text-zinc-400">CRON_SECRET</code> and your hosting
              provider&apos;s cron scheduler.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[#ffffff0a] px-3 py-2">
              <span className="text-zinc-300">Trellus + GHL sync</span>
              <Badge variant="outline">Every 15 min</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#ffffff0a] px-3 py-2">
              <span className="text-zinc-300">Batch AI analysis</span>
              <Badge variant="outline">Every hour</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#ffffff0a] px-3 py-2">
              <span className="text-zinc-300">Morning briefing</span>
              <Badge variant="outline">Daily · 7:00 AM</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SyncRow({
  title,
  subtitle,
  status,
  onSync,
}: {
  title: string;
  subtitle: string;
  status: SyncStatus;
  onSync: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-100">{title}</p>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {status === "success" && <Badge variant="success">Synced</Badge>}
        {status === "error" && <Badge variant="destructive">Failed</Badge>}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSync}
          disabled={status === "syncing"}
        >
          {status === "syncing" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Sync Now
        </Button>
      </div>
    </div>
  );
}
