import { Command } from 'commander';
import logger from '../../shared/logger/index.js';
import config from '../../shared/config/index.js';
import { loadJsonFile } from '../../shared/utils/index.js';
import { ClassifierService, ClassifierInputSchema } from './services/ClassifierService.js';
import { OpenAIProvider } from './providers/OpenAIProvider.js';
import { GeminiProvider } from './providers/GeminiProvider.js';
import { MockProvider } from './providers/MockProvider.js';

const program = new Command();

program
  .option('-i, --input <path>', 'Input JSON file path')
  .option('-m, --mode <mode>', 'Mode: classify or summarize', 'classify')
  .option('-l, --log-level <level>', 'Log level', 'info')
  .parse(process.argv);

const options = program.opts();

async function run() {
  const startTime = Date.now();

  try {
    if (options.logLevel) {
      logger.level = options.logLevel.toLowerCase();
    }

    if (!options.input) {
      logger.error('Input file is required');
      process.exit(1);
    }

    const rawData = await loadJsonFile(options.input);
    const items = ClassifierInputSchema.parse(rawData);

    let provider;
    if (config.aiProvider === 'openai' && config.openai.apiKey) {
      provider = new OpenAIProvider(config);
    } else if (config.aiProvider === 'gemini' && config.gemini.apiKey) {
      provider = new GeminiProvider(config);
    } else {
      provider = new MockProvider();
      logger.info('Using Mock AI Provider');
    }

    const service = new ClassifierService(provider, logger);
    const results = await service.process(items, options.mode);

    console.log(JSON.stringify(results, null, 2));

    const duration = Date.now() - startTime;
    logger.info({
      durationMs: duration,
      provider: provider.constructor.name,
      mode: options.mode
    }, 'Execution statistics');

  } catch (error) {
    logger.error({ error }, 'Application failed');
    process.exit(1);
  }
}

run();
