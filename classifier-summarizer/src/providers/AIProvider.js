export class AIProvider {
  /**
   * @param {string} text
   * @returns {Promise<string[]>}
   */
  async classify(text) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {string} text
   * @returns {Promise<string>}
   */
  async summarize(text) {
    throw new Error('Method not implemented');
  }
}
