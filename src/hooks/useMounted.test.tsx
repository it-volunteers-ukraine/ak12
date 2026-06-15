import { renderHook, act } from "@testing-library/react";
import { useMounted } from "./useMounted";

describe("useMounted", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("sets isUnmounted to true immediately when isOpened is true", () => {
    const { result } = renderHook(() =>
      useMounted({
        isOpened: true,
      }),
    );

    expect(result.current.isUnmounted).toBe(true);
  });

  it("keeps isUnmounted true until timeout and then sets it to false", () => {
    const { result, rerender } = renderHook(
      ({ isOpened }) =>
        useMounted({
          isOpened,
        }),
      {
        initialProps: { isOpened: true },
      },
    );

    expect(result.current.isUnmounted).toBe(true);

    rerender({ isOpened: false });

    expect(result.current.isUnmounted).toBe(true);

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(result.current.isUnmounted).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.isUnmounted).toBe(false);
  });

  it("uses custom duration", () => {
    const { result, rerender } = renderHook(
      ({ isOpened }) =>
        useMounted({
          isOpened,
          duration: 1000,
        }),
      {
        initialProps: { isOpened: true },
      },
    );

    rerender({ isOpened: false });

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(result.current.isUnmounted).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.isUnmounted).toBe(false);
  });

  it("clears previous timeout when reopened before duration", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const { result, rerender } = renderHook(
      ({ isOpened }) =>
        useMounted({
          isOpened,
        }),
      {
        initialProps: { isOpened: true },
      },
    );

    rerender({ isOpened: false });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ isOpened: true });

    expect(result.current.isUnmounted).toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const { rerender, unmount } = renderHook(
      ({ isOpened }) =>
        useMounted({
          isOpened,
        }),
      {
        initialProps: { isOpened: true },
      },
    );

    rerender({ isOpened: false });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("starts closed by default and becomes false after duration", () => {
    const { result } = renderHook(() =>
      useMounted({
        isOpened: false,
      }),
    );

    expect(result.current.isUnmounted).toBe(false);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isUnmounted).toBe(false);
  });
});
