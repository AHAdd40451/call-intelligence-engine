// ---------------------------------------------------------------------------
// Minimal Anthropic Messages API client (no SDK dependency).
// Used by the /api/analyse and /api/content-engine routes to run structured
// extraction over call transcripts.
// ---------------------------------------------------------------------------

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";

interface ClaudeMessageParams {
  system?: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
}

/**
 * Send a single-turn message to Claude and return the concatenated text
 * content of the response. Throws if the request fails or ANTHROPIC_API_KEY
 * is not configured.
 */
export async function askClaude({
  system,
  prompt,
  model = DEFAULT_MODEL,
  maxTokens = 2048,
}: ClaudeMessageParams): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic request failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text?: string }[];
  };

  return data.content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");
}

/**
 * Ask Claude for a JSON object matching a given shape, parsing the response.
 * Instructs the model to return raw JSON only, and strips code fences if the
 * model wraps the output anyway.
 */
export async function askClaudeForJSON<T>(params: ClaudeMessageParams): Promise<T> {
  const text = await askClaude({
    ...params,
    system: `${params.system ?? ""}\n\nRespond with raw JSON only. No markdown, no code fences, no commentary.`,
  });

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");

  return JSON.parse(cleaned) as T;
}
