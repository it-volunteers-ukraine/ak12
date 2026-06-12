import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection";

describe("useActiveSection", () => {
  let callback: IntersectionObserverCallback;
  let observe: jest.Mock;
  let disconnect: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();

    observe = jest.fn();
    disconnect = jest.fn();

    global.IntersectionObserver = jest.fn((cb) => {
      callback = cb;

      return {
        observe,
        disconnect,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: "",
        thresholds: [],
      };
    }) as any;

    document.body.innerHTML = `
      <div id="section-1"></div>
      <div id="section-2"></div>
    `;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const createEntry = (id: string, isIntersecting: boolean): IntersectionObserverEntry =>
    ({
      isIntersecting,
      target: document.getElementById(id)!,
    }) as unknown as IntersectionObserverEntry;

  it("returns empty string initially", () => {
    const { result } = renderHook(() => useActiveSection(["section-1"]));

    expect(result.current).toBe("");
  });

  it("observes elements after timeout", () => {
    renderHook(() => useActiveSection(["section-1", "section-2"]));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(observe).toHaveBeenCalledTimes(2);
    expect(observe).toHaveBeenCalledWith(document.getElementById("section-1"));
    expect(observe).toHaveBeenCalledWith(document.getElementById("section-2"));
  });

  it("updates active section when element intersects", () => {
    const { result } = renderHook(() => useActiveSection(["section-1"]));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      callback([createEntry("section-1", true)], {} as IntersectionObserver);
    });

    expect(result.current).toBe("section-1");
  });

  it("does not update when element is not intersecting", () => {
    const { result } = renderHook(() => useActiveSection(["section-1"]));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      callback([createEntry("section-1", false)], {} as IntersectionObserver);
    });

    expect(result.current).toBe("");
  });

  it("does nothing when sectionIds is empty", () => {
    renderHook(() => useActiveSection([]));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = renderHook(() => useActiveSection(["section-1"]));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  it("skips missing elements", () => {
    document.body.innerHTML = `<div id="section-1"></div>`;

    renderHook(() => useActiveSection(["section-1", "missing"]));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(document.getElementById("section-1"));
  });
});
