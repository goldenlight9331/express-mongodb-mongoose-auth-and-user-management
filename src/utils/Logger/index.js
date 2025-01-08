import { winston } from "#packages/index.js";

export const createLogger = () => {
  // Define levels and colors
  const logConfig = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    },
    colors: {
      error: "red",
      warn: "yellow",
      info: "green",
      debug: "blue",
    },
  };

  winston.addColors(logConfig.colors);

  const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
      const metaString = Object.keys(meta).length
        ? ` | Meta: ${JSON.stringify(meta)}`
        : "";
      const stackString = stack ? `\nStack: ${stack}` : "";
      return `${timestamp} [${level}]: ${message}${metaString}${stackString}`;
    }),
  );

  return winston.createLogger({
    levels: logConfig.levels,
    transports: [
      new winston.transports.Console({
        format: consoleFormat,
        level: process.env.NODE_ENV === "production" ? "warn" : "debug",
        handleExceptions: true,
      }),
    ],
    exitOnError: false,
  });
};

// Usage
export const logger = createLogger();
