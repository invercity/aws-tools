export class EventHandler {
  /**
   * @param {string} type
   * @returns {boolean}
   */
  supports(type) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {any} event
   * @returns {Promise<any>}
   */
  async process(event) {
    throw new Error('Method not implemented');
  }
}
