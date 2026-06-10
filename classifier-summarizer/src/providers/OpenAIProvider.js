import OpenAI from 'openai';
import { AIProvider } from './AIProvider.js';
import { ProviderError } from '../../../shared/errors/index.js';

export class OpenAIProvider extends AIProvider {
  constructor(config) {
    super();
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.model = config.openai.model;
    this.topics = ['finance', 'technical', 'hr', 'marketing', 'legal', 'other'];
  }

  async classify(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a text classifier. Classify the following text into one or more of these topics: ${this.topics.join(', ')}. Return only a JSON array of strings.`,
          },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      // Expected { "topics": ["finance"] } or similar
      return Array.isArray(parsed.topics) ? parsed.topics : [];
    } catch (error) {
      throw new ProviderError('OpenAI classification failed', error);
    }
  }

  async summarize(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Summarize the following text in 1-2 concise sentences.',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.5,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new ProviderError('OpenAI summarization failed', error);
    }
  }
}
