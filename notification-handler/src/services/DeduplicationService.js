export class DeduplicationService {
  constructor() {
    this.processedIds = new Set();
  }

  isDuplicate(eventId) {
    if (!eventId) return false;
    if (this.processedIds.has(eventId)) {
      return true;
    }
    this.processedIds.add(eventId);
    return false;
  }
}
