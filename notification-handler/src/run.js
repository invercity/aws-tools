import { Command } from 'commander';
import logger from '../../shared/logger/index.js';
import { loadJsonFile } from '../../shared/utils/index.js';
import { UserRegisteredHandler } from './handlers/UserRegisteredHandler.js';
import { PasswordResetHandler } from './handlers/PasswordResetHandler.js';
import { UserDeletedHandler } from './handlers/UserDeletedHandler.js';
import { DeduplicationService } from './services/DeduplicationService.js';
import { MySQLSimulationRepository } from './repositories/MySQLSimulationRepository.js';

const program = new Command();

program
  .option('-i, --input <path>', 'Input JSON file path')
  .option('-l, --log-level <level>', 'Log level', 'info')
  .parse(process.argv);

const options = program.opts();

class NotificationProcessor {
  constructor() {
    this.handlers = [
      new UserRegisteredHandler(),
      new PasswordResetHandler(),
      new UserDeletedHandler(),
    ];
    this.dedupeService = new DeduplicationService();
    this.repository = new MySQLSimulationRepository(logger);
    this.stats = {
      accepted: 0,
      skipped: 0,
      duplicates: 0,
      validationFailures: 0,
      unknown: 0
    };
  }

  async processEvents(events) {
    for (const event of events) {
      try {
        if (event.event_id && this.dedupeService.isDuplicate(event.event_id)) {
          logger.warn({ eventId: event.event_id }, 'Duplicate event skipped');
          this.stats.duplicates++;
          this.stats.skipped++;
          continue;
        }

        const handler = this.handlers.find(h => h.supports(event.type));

        if (!handler) {
          logger.warn({ type: event.type }, 'Unknown event type');
          this.stats.unknown++;
          this.stats.skipped++;
          continue;
        }

        const normalizedEvent = await handler.process(event);
        await this.repository.insert(normalizedEvent);
        
        logger.info({ eventId: event.event_id, type: event.type }, 'Event accepted');
        this.stats.accepted++;

      } catch (error) {
        if (error.name === 'ZodError') {
          logger.error({ error: error.errors, eventId: event.event_id }, 'Validation failure');
          this.stats.validationFailures++;
        } else {
          logger.error({ error, eventId: event.event_id }, 'Error processing event');
        }
        this.stats.skipped++;
      }
    }

    logger.info({ stats: this.stats }, 'Final statistics');
  }
}

async function run() {
  if (options.logLevel) {
    logger.level = options.logLevel.toLowerCase();
  }

  if (!options.input) {
    logger.error('Input file is required');
    process.exit(1);
  }

  try {
    const events = await loadJsonFile(options.input);
    const processor = new NotificationProcessor();
    await processor.processEvents(events);
  } catch (error) {
    logger.error({ error }, 'Application failed');
    process.exit(1);
  }
}

run();
