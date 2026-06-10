import { describe, it, expect, vi } from 'vitest';
import { ClassifierService } from '../src/services/ClassifierService.js';

describe('ClassifierService', () => {
  const mockProvider = {
    classify: vi.fn(),
    summarize: vi.fn(),
  };
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const service = new ClassifierService(mockProvider, mockLogger);

  it('should process classification items correctly', async () => {
    mockProvider.classify.mockResolvedValue(['finance']);
    const items = [{ id: 1, content: 'Invoice data' }];
    
    const results = await service.process(items, 'classify');
    
    expect(results).toEqual([{ id: 1, topics: ['finance'] }]);
    expect(mockProvider.classify).toHaveBeenCalledWith('Invoice data');
  });

  it('should handle empty input without stopping', async () => {
    const items = [
      { id: 1, content: '' },
      { id: 2, content: 'Valid data' }
    ];
    mockProvider.classify.mockResolvedValue(['hr']);
    
    const results = await service.process(items, 'classify');
    
    expect(results).toEqual([
      { id: 1, error: 'empty_input' },
      { id: 2, topics: ['hr'] }
    ]);
  });

  it('should process summarization items correctly', async () => {
    mockProvider.summarize.mockResolvedValue('Short summary');
    const items = [{ id: 1, content: 'Long text here...' }];
    
    const results = await service.process(items, 'summarize');
    
    expect(results).toEqual([{ id: 1, summary: 'Short summary' }]);
    expect(mockProvider.summarize).toHaveBeenCalledWith('Long text here...');
  });
});
