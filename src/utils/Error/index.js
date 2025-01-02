import { createError } from '#packages/index.js';
import { logger } from '#utils/index.js';

export const handleError = (error, message) => {
  logger.error('Error: ', error);

  if (!error.status) {
    error = createError(500, message);
  }

  return {
    status: error.status || 500,
    message: error.message || 'Internal Server Error',
  };
};
