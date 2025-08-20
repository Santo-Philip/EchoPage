interface AiClientOptions {
  model?: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

const ai = import.meta.env.AI_API;
const key = import.meta.env.AI_API_KEY;

export default function aiClient(options: AiClientOptions) {
  const body = {
    model: options.model || "openai/gpt-oss-120b",
    messages: [{ role: "user", content: options.prompt }],
    temperature: options.temperature ?? 1,
    max_tokens: options.maxTokens ?? 5000,
    top_p: 1,
    stream: true,
    tools: [
      {
        type: "browser_search",
      },
    ],
  };
}
