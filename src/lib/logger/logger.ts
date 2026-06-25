import pino from "pino";

// Check if we're running on the server (Node.js environment)
const isServer = typeof window === "undefined";

const transport =
  isServer && process.stdout?.isTTY
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {};

// On client-side, create a silent logger that suppresses console output
const createClientLogger = (): pino.Logger => {
  const noop = () => {};
  const clientLogger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
    trace: noop,
    child: () => clientLogger,
    level: "silent",
    silent: noop,
    msgPrefix: "",
  };

  return clientLogger as unknown as pino.Logger;
};

export const logger: pino.Logger = isServer
  ? pino({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      ...transport,
    })
  : createClientLogger();
