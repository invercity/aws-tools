import { z } from 'zod';

export const ClassifierInputSchema = z.array(z.object({
  id: z.number(),
  content: z.string().optional(),
}));

export class ClassifierService {
  constructor(aiProvider, logger) {
    this.aiProvider = aiProvider;
    this.logger = logger;
  }

  async process(items, mode) {
    this.logger.info({ count: items.length, mode }, 'Processing started');
    const results = [];
    let invalidCount = 0;

    // In a real production app, we might use p-limit to control concurrency
    for (const item of items) {
      try {
        if (!item.content || item.content.trim() === '') {
          results.push({ id: item.id, error: 'empty_input' });
          this.logger.warn({ id: item.id }, 'Invalid item: empty_input');
          invalidCount++;
          continue;
        }

        if (mode === 'classify') {
          const topics = await this.aiProvider.classify(item.content);
          results.push({ id: item.id, topics });
        } else if (mode === 'summarize') {
          const summary = await this.aiProvider.summarize(item.content);
          results.push({ id: item.id, summary });
        }
      } catch (error) {
        this.logger.error({ error, id: item.id }, 'Item processing failed');
        results.push({ id: item.id, error: 'processing_failed' });
      }
    }

    this.logger.info({
      total: items.length,
      invalid: invalidCount,
      success: items.length - invalidCount,
    }, 'Processing finished');

    return results;
  }
}
