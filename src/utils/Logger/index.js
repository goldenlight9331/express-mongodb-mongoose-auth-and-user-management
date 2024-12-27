import { winston } from '#packages/index.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`,
  ),
);

export const logger = winston.createLogger({
  levels,
  format,
  transports: [new winston.transports.Console()],
});
