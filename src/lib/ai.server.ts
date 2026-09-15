/**
 * Server-only helper for the Lovable AI Gateway (Responses API).
 * The API key never leaves the server.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  status: number;
  userMessage: string;
  constructor(status: number, userMessage: string) {
    super(userMessage);
    this.status = status;
    this.userMessage = userMessage;
  }
}

function messageForStatus(status: number): string {
  if (status === 401 || status === 403)
    return "The AI service is not configured correctly for this project. Please contact the project owner.";
  if (status === 402)
    return "The AI analysis quota for this project has run out. Please try again later.";
  if (status === 429)
    return "Too many requests right now. Please wait a moment and try again.";
  if (status >= 500)
    return "The AI service is temporarily unavailable. Please try again shortly.";
  return "The analysis request could not be completed. Please try again.";
}

/**
 * Calls the gateway with a strict JSON schema and returns parsed JSON.
 * Always streams (reasoning models can run for minutes).
 */
export async function generateStructured<T>(args: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
  effort?: "low" | "medium";
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new AiError(
      401,
      "AI analysis is not available because the LOVABLE_API_KEY environment variable is not configured.",
    );
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: args.instructions,
      input: args.input,
      stream: true,
      reasoning: { effort: args.effort ?? "low", summary: "auto" },
      text: {
        format: {
          type: "json_schema",
          name: args.schemaName,
          strict: true,
          schema: args.schema,
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const status = res.status || 500;
    console.error("AI gateway error", status, await res.text().catch(() => ""));
    throw new AiError(status, messageForStatus(status));
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && evt.response?.output_text) {
          if (!text) text = evt.response.output_text;
        }
      } catch {
        /* ignore malformed keepalive frames */
      }
    }
  }

  if (!text.trim()) {
    throw new AiError(502, "The AI service returned an empty response. Please try again.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AiError(502, "The AI service returned an unreadable response. Please try again.");
  }
}
