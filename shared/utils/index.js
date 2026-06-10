import fs from 'fs/promises';
import logger from '../logger/index.js';

export const loadJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error({ error, filePath }, 'Failed to load JSON file');
    throw error;
  }
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
