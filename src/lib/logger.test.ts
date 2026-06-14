/**
 * @jest-environment node
 */

describe("logger", () => {
  let pinoMock: jest.Mock;
  let consoleSpy: any;

  const load = () => require("./logger");

  beforeEach(() => {
    jest.resetModules();

    consoleSpy = {
      debug: jest.spyOn(console, "debug").mockImplementation(() => {}),
      info: jest.spyOn(console, "info").mockImplementation(() => {}),
      warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
      error: jest.spyOn(console, "error").mockImplementation(() => {}),
      trace: jest.spyOn(console, "trace").mockImplementation(() => {}),
    };

    pinoMock = jest.fn().mockReturnValue({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      trace: jest.fn(),
      child: jest.fn(() => ({})),
    });

    jest.doMock("pino", () => ({
      __esModule: true,
      default: pinoMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    (Object.values(consoleSpy) as jest.SpyInstance[]).forEach((spy) => {
      spy.mockRestore();
    });
  });

  it("creates server logger", () => {
    load();
    expect(pinoMock).toHaveBeenCalled();
  });

  it("client logger methods do not throw", () => {
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    });

    const { logger } = load();

    expect(() => {
      logger.debug("x");
      logger.info("x");
      logger.warn("x");
      logger.error("x");
      logger.trace("x");
      logger.fatal("x");
    }).not.toThrow();

    delete (global as any).window;
  });

  it("covers child() method", () => {
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    });

    const { logger } = load();

    const child = logger.child();

    expect(child).toBeDefined();

    delete (global as any).window;
  });
});
