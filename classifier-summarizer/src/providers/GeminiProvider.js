import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './AIProvider.js';
import { ProviderError } from '../../../shared/errors/index.js';

export class GeminiProvider extends AIProvider {
  constructor(config) {
    super();
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.modelName = config.gemini.model;
    this.model = this.genAI.getGenerativeModel({ model: this.modelName });
    this.topics = ['finance', 'technical', 'hr', 'marketing', 'legal', 'other'];
  }

  async classify(text) {
    try {
      const prompt = `You are a text classifier. Classify the following text into one or more of these topics: ${this.topics.join(', ')}. Return only a JSON array of strings in this format: { "topics": ["topic1", "topic2"] }.

Text: ${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let content = response.text().trim();

      // Gemini sometimes wraps JSON in markdown blocks
      if (content.startsWith('```json')) {
        content = content.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (content.startsWith('```')) {
        content = content.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(content);
      return Array.isArray(parsed.topics) ? parsed.topics : [];
    } catch (error) {
      throw new ProviderError('Gemini classification failed', error);
    }
  }

  async summarize(text) {
    try {
      const prompt = `Summarize the following text in 1-2 concise sentences.

Text: ${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      throw new ProviderError('Gemini summarization failed', error);
    }
  }
}
