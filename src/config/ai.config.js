import axios from "axios";
import { env } from "./env.config.js";

const { OPENROUTER_API_KEY } = env;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default configuration constants
const DEFAULT_CONFIG = {
  model: "meta-llama/llama-3.3-70b-instruct:free",
  temperature: 0.5,
  max_tokens: 1000,
  top_p: 0.9,
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
  stop: ["\n", "###"],
};

const DEFAULT_MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Create a reusable axios instance with default configuration
const aiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": env.APP_URL || "https://yourwebsite.com", // Required by OpenRouter
    "X-Title": env.APP_NAME || "AI Assistant", // Recommended by OpenRouter
  },
  timeout: 30000,
});

export const promptAI = async (prompt, customOptions = {}) => {
  let retries = 0;
  let lastError = null;

  // Prepare request payload with proper OpenRouter parameter names
  const requestPayload = {
    model: customOptions.model || DEFAULT_CONFIG.model,
    temperature: customOptions.temperature || DEFAULT_CONFIG.temperature,
    max_tokens: customOptions.maxTokens || DEFAULT_CONFIG.max_tokens,
    top_p: customOptions.topP || DEFAULT_CONFIG.top_p,
    frequency_penalty:
      customOptions.frequencyPenalty || DEFAULT_CONFIG.frequency_penalty,
    presence_penalty:
      customOptions.presencePenalty || DEFAULT_CONFIG.presence_penalty,
    stop: customOptions.stop || DEFAULT_CONFIG.stop,
    messages: [
      {
        role: "system",
        content:
          customOptions.systemMessage ||
          "You are an expert software engineer assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  // Implement retry with exponential backoff
  while (retries < DEFAULT_MAX_RETRIES) {
    try {
      const response = await aiClient.post("", requestPayload);

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from API");
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      lastError = error;
      retries++;

      // Don't delay on the last attempt
      if (retries < DEFAULT_MAX_RETRIES) {
        // Exponential backoff with jitter
        const delay =
          RETRY_DELAY_MS *
          Math.pow(2, retries - 1) *
          (0.5 + Math.random() * 0.5);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we exhaust all retries, throw the last error
  throw new Error(
    `Failed after ${DEFAULT_MAX_RETRIES} attempts: ${lastError.message}`,
  );
};

export const chatWithAI = async (messages, customOptions = {}) => {
  const requestPayload = {
    model: customOptions.model || DEFAULT_CONFIG.model,
    temperature: customOptions.temperature || DEFAULT_CONFIG.temperature,
    max_tokens: customOptions.maxTokens || DEFAULT_CONFIG.max_tokens,
    top_p: customOptions.topP || DEFAULT_CONFIG.top_p,
    frequency_penalty:
      customOptions.frequencyPenalty || DEFAULT_CONFIG.frequency_penalty,
    presence_penalty:
      customOptions.presencePenalty || DEFAULT_CONFIG.presence_penalty,
    stop: customOptions.stop || DEFAULT_CONFIG.stop,
    messages,
  };

  try {
    const response = await aiClient.post("", requestPayload);
    return response.data;
  } catch (error) {
    console.error("AI Chat Error:", error.response?.data || error.message);
    throw error;
  }
};
