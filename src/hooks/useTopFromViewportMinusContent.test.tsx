import { renderHook, act } from "@testing-library/react";
import { useTopFromViewportMinusContent } from "@/hooks/useTopFromViewportMinusContent";

describe("useTopFromViewportMinusContent", () => {
  let observe: jest.Mock;
  let disconnect: jest.Mock;
  let resizeCallback: () => void;

  beforeEach(() => {
    jest.useFakeTimers();

    observe = jest.fn();
    disconnect = jest.fn();

    global.ResizeObserver = jest.fn((callback) => {
      resizeCallback = callback;

      return {
        observe,
        disconnect,
      };
    }) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should return 0 when content fits inside viewport", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    const element = {
      clientHeight: 400,
    } as HTMLDivElement;

    const ref = {
      current: element,
    };

    const { result } = renderHook(() => useTopFromViewportMinusContent(ref));

    expect(result.current).toBe(0);
    expect(observe).toHaveBeenCalledWith(element);
  });

  it("should return negative top when content is taller than viewport", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });

    const element = {
      clientHeight: 700,
    } as HTMLDivElement;

    const ref = {
      current: element,
    };

    const { result } = renderHook(() => useTopFromViewportMinusContent(ref));

    expect(result.current).toBe(-200);
  });

  it("should do nothing when ref.current is null", () => {
    const addListener = jest.spyOn(window, "addEventListener");

    const ref = {
      current: null,
    };

    const { result } = renderHook(() => useTopFromViewportMinusContent(ref));

    expect(result.current).toBe(0);
    expect(addListener).not.toHaveBeenCalled();
    expect(observe).not.toHaveBeenCalled();
  });

  it("should update value after ResizeObserver callback", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 600,
    });

    const element = {
      clientHeight: 400,
    } as HTMLDivElement;

    const ref = {
      current: element,
    };

    const { result } = renderHook(() => useTopFromViewportMinusContent(ref));

    expect(result.current).toBe(0);

    Object.defineProperty(element, "clientHeight", {
      configurable: true,
      value: 800,
    });

    act(() => {
      resizeCallback();
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(-200);
  });

  it("should update value on window resize", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 700,
    });

    const element = {
      clientHeight: 600,
    } as HTMLDivElement;

    const ref = {
      current: element,
    };

    const { result } = renderHook(() => useTopFromViewportMinusContent(ref));

    expect(result.current).toBe(0);

    act(() => {
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: 500,
      });

      window.dispatchEvent(new Event("resize"));
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(-100);
  });

  it("should cleanup listeners and observer on unmount", () => {
    const removeListener = jest.spyOn(window, "removeEventListener");

    const element = {
      clientHeight: 300,
    } as HTMLDivElement;

    const ref = {
      current: element,
    };

    const { unmount } = renderHook(() => useTopFromViewportMinusContent(ref));

    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
