import pino from "pino";

// Check if we're running on the server (Node.js environment)
const isServer = typeof window === "undefined";

const transport = isServer && process.stdout?.isTTY
  ? {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    }
  : {};

// On client-side, create a minimal logger that uses console
export const logger = isServer 
  ? pino({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      ...transport,
    })
  : {
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      fatal: console.error.bind(console),
      trace: console.trace.bind(console),
      child: () => logger,
    } as pino.Logger;
