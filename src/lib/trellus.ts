// ---------------------------------------------------------------------------
// Trellus API client
//
// Trellus exposes two surfaces used here:
//  - `ext.trellus.ai` — the "bootstrap" endpoint used to exchange an API key
//    for a short-lived session/auth context.
//  - `rpt-2.trellus.ai` — the reporting API used to pull call sessions,
//    recordings and transcripts once authenticated.
// ---------------------------------------------------------------------------

const TRELLUS_BOOTSTRAP_URL = "https://ext.trellus.ai";
const TRELLUS_REPORTING_URL = "https://rpt-2.trellus.ai";

export interface TrellusBootstrapResponse {
  session_token: string;
  workspace_id: string;
  expires_at: string;
}

export interface TrellusCallSession {
  id: string;
  contact_name: string;
  contact_phone: string;
  agent_id: string;
  agent_name: string;
  started_at: string;
  duration_seconds: number;
  disposition: string;
  recording_url?: string;
  transcript?: TrellusTranscriptTurn[];
}

export interface TrellusTranscriptTurn {
  speaker: "agent" | "contact";
  text: string;
  timestamp_ms: number;
}

export interface TrellusListSessionsParams {
  from?: string;
  to?: string;
  agent_id?: string;
  limit?: number;
  cursor?: string;
}

export interface TrellusListSessionsResponse {
  sessions: TrellusCallSession[];
  next_cursor?: string;
}

class TrellusClient {
  private apiKey: string;
  private sessionToken: string | null = null;
  private workspaceId: string | null = null;
  private sessionExpiresAt: number | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Exchange the long-lived API key for a short-lived session token.
   * Called automatically before any reporting request if the current
   * session is missing or expired.
   */
  private async bootstrap(): Promise<void> {
    const res = await fetch(`${TRELLUS_BOOTSTRAP_URL}/api/v1/session/bootstrap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error(
        `Trellus bootstrap failed: ${res.status} ${res.statusText}`
      );
    }

    const data = (await res.json()) as TrellusBootstrapResponse;
    this.sessionToken = data.session_token;
    this.workspaceId = data.workspace_id;
    this.sessionExpiresAt = new Date(data.expires_at).getTime();
  }

  private async ensureSession(): Promise<void> {
    const isExpired =
      !this.sessionToken ||
      !this.sessionExpiresAt ||
      Date.now() >= this.sessionExpiresAt - 5_000;

    if (isExpired) {
      await this.bootstrap();
    }
  }

  private async reportingFetch<T>(
    path: string,
    init: RequestInit = {}
  ): Promise<T> {
    await this.ensureSession();

    const res = await fetch(`${TRELLUS_REPORTING_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.sessionToken}`,
        "X-Workspace-Id": this.workspaceId ?? "",
        ...init.headers,
      },
    });

    if (res.status === 401) {
      // Session expired mid-flight — retry once after a fresh bootstrap.
      this.sessionToken = null;
      await this.ensureSession();
      const retryRes = await fetch(`${TRELLUS_REPORTING_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.sessionToken}`,
          "X-Workspace-Id": this.workspaceId ?? "",
          ...init.headers,
        },
      });
      if (!retryRes.ok) {
        throw new Error(
          `Trellus request failed: ${retryRes.status} ${retryRes.statusText}`
        );
      }
      return (await retryRes.json()) as T;
    }

    if (!res.ok) {
      throw new Error(`Trellus request failed: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  }

  /** List call sessions within an optional date range, paginated by cursor. */
  async listSessions(
    params: TrellusListSessionsParams = {}
  ): Promise<TrellusListSessionsResponse> {
    const query = new URLSearchParams();
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    if (params.agent_id) query.set("agent_id", params.agent_id);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.cursor) query.set("cursor", params.cursor);

    return this.reportingFetch<TrellusListSessionsResponse>(
      `/api/v2/sessions?${query.toString()}`
    );
  }

  /** Fetch a single call session with full transcript detail. */
  async getSession(sessionId: string): Promise<TrellusCallSession> {
    return this.reportingFetch<TrellusCallSession>(
      `/api/v2/sessions/${sessionId}`
    );
  }

  /** Fetch all sessions across all pages within a date range. */
  async listAllSessions(
    params: Omit<TrellusListSessionsParams, "cursor"> = {}
  ): Promise<TrellusCallSession[]> {
    const all: TrellusCallSession[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.listSessions({ ...params, cursor });
      all.push(...page.sessions);
      cursor = page.next_cursor;
    } while (cursor);

    return all;
  }
}

export function createTrellusClient(apiKey?: string): TrellusClient {
  const key = apiKey ?? process.env.TRELLUS_API_KEY;
  if (!key) {
    throw new Error("TRELLUS_API_KEY is not configured");
  }
  return new TrellusClient(key);
}

/** Flatten a Trellus transcript into a single plain-text string. */
export function trellusTranscriptToText(
  turns: TrellusTranscriptTurn[] | undefined
): string {
  if (!turns || turns.length === 0) return "";
  return turns
    .map((turn) => `${turn.speaker === "agent" ? "Setter" : "Lead"}: ${turn.text}`)
    .join("\n");
}

export type { TrellusClient };
