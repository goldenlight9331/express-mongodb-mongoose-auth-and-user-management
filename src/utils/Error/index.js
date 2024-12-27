import { createError } from '#packages/index.js';

export const handleError = (error, message) => {
  console.error('Error: ', error);
  if (!error.status) {
    error = createError(500, message);
  }
  return {
    status: error.status,
    message: error.message,
  };
};
