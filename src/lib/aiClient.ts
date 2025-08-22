interface AiClientOptions {
  model?: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean; // Made optional, defaults to false
}

export default async function aiClient(
  options: AiClientOptions,
  onToken?: (token: string) => void
): Promise<string> {
  const ai = import.meta.env.PUBLIC_AI_API;
  const key = import.meta.env.PUBLIC_AI_API_KEY;

  const messages: { role: string; content: string }[] = [];

  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }

  messages.push({ role: "user", content: options.prompt });

  const body = {
    model: options.model || "openai/gpt-oss-120b",
    messages,
    temperature: options.temperature ?? 1,
    max_tokens: options.maxTokens ?? 5000,
    top_p: 1,
    stream: options.stream ?? false, // Default to false (non-streamed)
  };

  const res = await fetch(ai, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  if (!options.stream) {
    // Non-streamed response
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in non-streamed response");
    }
    return content;
  }

  // Streamed response
  if (!res.body) {
    throw new Error("No response body received for streaming");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.replace(/^data:\s*/, "");

      if (data === "[DONE]") break;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          result += delta;
          if (onToken) onToken(delta);
        }
      } catch (err) {
        console.warn("Failed to parse stream line:", data, err);
      }
    }
  }

  return result;
}