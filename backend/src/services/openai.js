import OpenAI from "openai";

let client = null;

function getClient() {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  client = new OpenAI({ apiKey });
  return client;
}

export async function getAiCompletion({ message, language }) {
  const openai = getClient();
  if (!openai) {
    return "";
  }

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a concise assistant for a waste disposal system. Help with schedule, segregation, complaint support, and polite guidance. Keep replies under 80 words."
      },
      {
        role: "user",
        content: `Language: ${language}. User message: ${message}`
      }
    ],
    temperature: 0.4
  });

  return completion.output_text?.trim() || "";
}
