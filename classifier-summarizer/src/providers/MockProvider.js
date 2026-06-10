import { AIProvider } from './AIProvider.js';
import { delay } from '../../../shared/utils/index.js';

export class MockProvider extends AIProvider {
  async classify(text) {
    await delay(100);
    const topics = ['finance', 'technical', 'hr', 'marketing', 'legal', 'other'];
    // Randomly pick 1-2 topics
    const shuffled = topics.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  async summarize(text) {
    await delay(100);
    return "This is a mock summary of the provided text, highlighting its key points in a concise manner.";
  }
}
