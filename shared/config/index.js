import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  openai: z.object({
    apiKey: z.string().optional(),
    model: z.string().default('gpt-4o-mini'),
  }),
  gemini: z.object({
    apiKey: z.string().optional(),
    model: z.string().default('gemini-1.5-flash'),
  }),
  logLevel: z.string().default('info'),
  aiProvider: z.enum(['openai', 'gemini', 'mock']).default('mock'),
});

const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
  },
  logLevel: process.env.LOG_LEVEL,
  aiProvider: process.env.AI_PROVIDER,
};

const validatedConfig = configSchema.parse(config);

export default validatedConfig;
