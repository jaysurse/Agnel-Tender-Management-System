import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message || String(err));
  res.status(500).json({ error: 'Internal Server Error' });
}
