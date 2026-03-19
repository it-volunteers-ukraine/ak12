import pino from 'pino';

const transport = process.stdout.isTTY
  ? {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    }
  : {};

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  ...transport,
});
