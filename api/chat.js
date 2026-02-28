import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // We extract the model from the request, but default to 'openrouter/free'
  const { model, messages } = await req.json();

  const result = await streamText({
    model: openrouter(model || 'openrouter/free'),
    messages,
    headers: {
      "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
      "X-Title": "Stealth Pro Free Tier",
    },
  });

  return result.toDataStreamResponse();
}
