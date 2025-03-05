import axios from "axios";

import { env } from "./env.config.js";

const { OPENROUTER_API_KEY } = env;

export const promptAI = async (prompt) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "perplexity/r1-1776", // Model ID
      messages: [
        {
          role: "system",
          content: "You are an expert software engineer assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://your-site.com", // Replace with your site
        "X-Title": "Your App Name", // Replace with your app name
        "Content-Type": "application/json",
      },
    },
  );

  const result = response.data.choices[0].message.content;
  return result;
};
