export class MySQLSimulationRepository {
  constructor(logger) {
    this.logger = logger;
  }

  async insert(event) {
    // Simulate database latency
    await new Promise(resolve => setTimeout(resolve, 10));
    this.logger.info({ payload: event }, 'Event stored in MySQL (simulated)');
  }
}
