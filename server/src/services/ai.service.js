import { getEnv } from '../config/env.js';

export const AIService = {
  async ask(prompt) {
    const apiKey = getEnv('OPENAI_API_KEY');
    // Placeholder implementation
    return `AI response to: ${prompt}${apiKey ? '' : ' (no API key configured)'}`;
  },
};
